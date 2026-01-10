import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/matcher/history
 * Get the authenticated user's match history
 */
export async function GET(request: NextRequest) {
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

    // Get user's matcher profile
    const profile = await prisma.matcherProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({
        history: [],
        totalCount: 0,
      });
    }

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Get match history
    const [results, totalCount] = await Promise.all([
      prisma.matchResult.findMany({
        where: { profileId: profile.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          totalMatched: true,
          createdAt: true,
          aiModel: true,
          processingTimeMs: true,
          matches: true,
        },
      }),
      prisma.matchResult.count({
        where: { profileId: profile.id },
      }),
    ]);

    // Transform results to include top matches summary
    const history = results.map((result) => {
      const matches = result.matches as Array<{
        scholarshipId: string;
        score: number;
        matchLevel: string;
      }>;

      return {
        id: result.id,
        totalMatched: result.totalMatched,
        createdAt: result.createdAt,
        aiModel: result.aiModel,
        processingTimeMs: result.processingTimeMs,
        topMatches: matches.slice(0, 3).map((m) => ({
          scholarshipId: m.scholarshipId,
          score: m.score,
          matchLevel: m.matchLevel,
        })),
      };
    });

    return NextResponse.json({
      history,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Error fetching match history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    );
  }
}
