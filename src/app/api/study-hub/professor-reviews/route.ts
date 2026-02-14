import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { professorReviewSchema } from '@/lib/validations/professor-review';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List professor reviews with search, filter, pagination, and aggregates
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const universityId = searchParams.get('universityId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const aggregatesOnly = searchParams.get('aggregatesOnly') === 'true';
    const mostReviewed = searchParams.get('mostReviewed') === 'true';

    // Most reviewed professors — aggregation query (only APPROVED)
    if (mostReviewed) {
      const results = await prisma.professorReview.groupBy({
        by: ['professorName', 'universityName'],
        where: { status: 'APPROVED' },
        _count: { id: true },
        _avg: { rating: true, difficulty: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      });

      const mostReviewedProfs = results.map((r) => ({
        professorName: r.professorName,
        universityName: r.universityName,
        reviewCount: r._count.id,
        avgRating: Math.round((r._avg.rating || 0) * 10) / 10,
        avgDifficulty: Math.round((r._avg.difficulty || 0) * 10) / 10,
      }));

      return NextResponse.json({ mostReviewedProfs });
    }

    const where: Record<string, unknown> = { status: 'APPROVED' };

    if (search) {
      where.OR = [
        { professorName: { contains: search, mode: 'insensitive' } },
        { courseName: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (universityId) where.universityId = universityId;
    if (userId) where.userId = userId;

    // Aggregates for filtered results
    if (aggregatesOnly) {
      const [avgRating, avgDifficulty, totalCount, wouldTakeAgainCount, allTags] = await Promise.all([
        prisma.professorReview.aggregate({ where, _avg: { rating: true } }),
        prisma.professorReview.aggregate({ where, _avg: { difficulty: true } }),
        prisma.professorReview.count({ where }),
        prisma.professorReview.count({ where: { ...where, wouldTakeAgain: true } }),
        prisma.professorReview.findMany({ where, select: { tags: true } }),
      ]);

      const tagCounts: Record<string, number> = {};
      allTags.forEach((r) => r.tags.forEach((tag) => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; }));

      return NextResponse.json({
        aggregates: {
          avgRating: Math.round((avgRating._avg.rating || 0) * 10) / 10,
          avgDifficulty: Math.round((avgDifficulty._avg.difficulty || 0) * 10) / 10,
          wouldTakeAgainPct: totalCount > 0 ? Math.round((wouldTakeAgainCount / totalCount) * 100) : 0,
          totalCount,
          tagCounts,
        },
      });
    }

    const [reviews, total] = await Promise.all([
      prisma.professorReview.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.professorReview.count({ where }),
    ]);

    return NextResponse.json({ reviews, total });
  } catch (error) {
    console.error('Error fetching professor reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch professor reviews' },
      { status: 500 }
    );
  }
}

// POST - Submit a new professor review (requires auth)
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = professorReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = session!.user as { id: string; name?: string | null };

    const review = await prisma.professorReview.create({
      data: {
        ...result.data,
        comment: result.data.comment || null,
        userId: user.id,
        userName: result.data.isAnonymous ? null : (user.name || null),
      },
    });

    return NextResponse.json(
      { review, message: 'Review submitted successfully and is pending admin approval.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating professor review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
