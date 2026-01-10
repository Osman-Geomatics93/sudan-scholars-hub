import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, rateLimitedResponse } from '@/lib/rate-limit';
import {
  filterScholarships,
  getTopMatches,
  generateMatchExplanations,
  getAIModel,
  type MatcherProfile,
  type ScholarshipMatch,
} from '@/lib/matcher';
import type { Scholarship } from '@/types/scholarship';

// Rate limit: 5 matches per 5 minutes
const RATE_LIMIT = { limit: 5, windowMs: 300000 };

/**
 * POST /api/matcher/match
 * Run AI scholarship matching for the authenticated user
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const session = await auth();
    const user = session?.user as { id?: string; isAdmin?: boolean } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isAdmin) {
      return NextResponse.json({ error: 'Admin users cannot use the matcher' }, { status: 403 });
    }

    const userId = user.id;

    // Rate limiting
    const { success, resetTime } = checkRateLimit(
      `matcher:${userId}`,
      RATE_LIMIT.limit,
      RATE_LIMIT.windowMs
    );

    if (!success) {
      return rateLimitedResponse(resetTime);
    }

    // Get user's matcher profile
    const profile = await prisma.matcherProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Matcher profile not found. Please create a profile first.' },
        { status: 404 }
      );
    }

    // Get locale from request
    const acceptLanguage = request.headers.get('accept-language') || 'en';
    const locale = acceptLanguage.includes('ar') ? 'ar' : 'en';

    // Get all published scholarships
    const scholarships = await prisma.scholarship.findMany({
      where: { isPublished: true },
    });

    if (scholarships.length === 0) {
      return NextResponse.json(
        { error: 'No scholarships available for matching' },
        { status: 404 }
      );
    }

    // Convert profile to matcher type
    const matcherProfile: MatcherProfile = {
      id: profile.id,
      userId: profile.userId,
      gpaValue: profile.gpaValue,
      gpaSystem: profile.gpaSystem as MatcherProfile['gpaSystem'],
      currentLevel: profile.currentLevel as MatcherProfile['currentLevel'],
      targetLevel: profile.targetLevel as MatcherProfile['targetLevel'],
      fieldsOfStudy: profile.fieldsOfStudy as MatcherProfile['fieldsOfStudy'],
      countryOfOrigin: profile.countryOfOrigin,
      languages: profile.languages,
      age: profile.age,
      fundingPreference: profile.fundingPreference as MatcherProfile['fundingPreference'],
      specialCircumstances: profile.specialCircumstances,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };

    // Convert scholarships to expected type
    const typedScholarships = scholarships.map((s) => ({
      ...s,
      deadline: s.deadline.toISOString(),
      createdAt: s.createdAt.toISOString(),
    })) as unknown as Scholarship[];

    // Step 1: Hard filter (eliminate ineligible)
    const eligible = filterScholarships(typedScholarships, matcherProfile);

    if (eligible.length === 0) {
      return NextResponse.json({
        resultId: null,
        matches: [],
        totalMatched: 0,
        processingTimeMs: Date.now() - startTime,
        message: locale === 'ar'
          ? 'لم يتم العثور على منح تتطابق مع ملفك الشخصي. جرب تعديل تفضيلاتك.'
          : 'No scholarships match your profile. Try adjusting your preferences.',
      });
    }

    // Step 2: Preliminary scoring and get top matches
    const preliminaryMatches = getTopMatches(eligible, matcherProfile, 15);

    // Step 3: AI ranking and explanations
    const matches = await generateMatchExplanations(
      preliminaryMatches,
      matcherProfile,
      locale
    );

    const processingTime = Date.now() - startTime;

    // Save results to database
    const result = await prisma.matchResult.create({
      data: {
        profileId: profile.id,
        matches: JSON.parse(JSON.stringify(matches.map((m) => ({
          scholarshipId: m.scholarshipId,
          score: m.score,
          matchLevel: m.matchLevel,
          explanation: m.explanation,
          factors: m.factors,
        })))),
        totalMatched: matches.length,
        profileSnapshot: {
          gpaValue: profile.gpaValue,
          gpaSystem: profile.gpaSystem,
          currentLevel: profile.currentLevel,
          targetLevel: profile.targetLevel,
          fieldsOfStudy: profile.fieldsOfStudy,
          countryOfOrigin: profile.countryOfOrigin,
          languages: profile.languages,
          age: profile.age,
          fundingPreference: profile.fundingPreference,
          specialCircumstances: profile.specialCircumstances,
        },
        aiModel: getAIModel(),
        processingTimeMs: processingTime,
      },
    });

    return NextResponse.json({
      resultId: result.id,
      matches,
      totalMatched: matches.length,
      processingTimeMs: processingTime,
    });
  } catch (error) {
    console.error('Error running matcher:', error);
    return NextResponse.json(
      { error: 'Failed to run scholarship matching' },
      { status: 500 }
    );
  }
}
