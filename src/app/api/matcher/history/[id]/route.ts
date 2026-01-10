import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/matcher/history/[id]
 * Get a specific match result with full details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    const { id } = await params;

    // Get user's matcher profile
    const profile = await prisma.matcherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Matcher profile not found' },
        { status: 404 }
      );
    }

    // Get the match result
    const result = await prisma.matchResult.findFirst({
      where: {
        id,
        profileId: profile.id, // Ensure user owns this result
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Match result not found' },
        { status: 404 }
      );
    }

    // Get scholarship details for each match
    const matches = result.matches as Array<{
      scholarshipId: string;
      score: number;
      matchLevel: string;
      explanation: { en: string; ar: string };
      factors: Array<{
        type: string;
        status: string;
        score: number;
        maxScore: number;
        detail: { en: string; ar: string };
      }>;
    }>;

    const scholarshipIds = matches.map((m) => m.scholarshipId);
    const scholarships = await prisma.scholarship.findMany({
      where: { id: { in: scholarshipIds } },
    });

    // Merge scholarship data with match data
    const enrichedMatches = matches.map((match) => {
      const scholarship = scholarships.find((s) => s.id === match.scholarshipId);
      return {
        ...match,
        scholarship: scholarship
          ? {
              id: scholarship.id,
              title: scholarship.title,
              titleAr: scholarship.titleAr,
              university: scholarship.university,
              universityAr: scholarship.universityAr,
              country: scholarship.country,
              countryAr: scholarship.countryAr,
              countryCode: scholarship.countryCode,
              deadline: scholarship.deadline,
              fundingType: scholarship.fundingType,
              levels: scholarship.levels,
              field: scholarship.field,
              image: scholarship.image,
              slug: scholarship.slug,
              applicationUrl: scholarship.applicationUrl,
            }
          : null,
      };
    });

    return NextResponse.json({
      result: {
        id: result.id,
        matches: enrichedMatches,
        totalMatched: result.totalMatched,
        profileSnapshot: result.profileSnapshot,
        aiModel: result.aiModel,
        processingTimeMs: result.processingTimeMs,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching match result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match result' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/matcher/history/[id]
 * Delete a specific match result
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    const { id } = await params;

    // Get user's matcher profile
    const profile = await prisma.matcherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Matcher profile not found' },
        { status: 404 }
      );
    }

    // Check if result exists and belongs to user
    const result = await prisma.matchResult.findFirst({
      where: {
        id,
        profileId: profile.id,
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Match result not found' },
        { status: 404 }
      );
    }

    // Delete the result
    await prisma.matchResult.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Match result deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting match result:', error);
    return NextResponse.json(
      { error: 'Failed to delete match result' },
      { status: 500 }
    );
  }
}
