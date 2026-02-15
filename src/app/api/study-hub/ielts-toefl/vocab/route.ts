import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const difficulty = searchParams.get('difficulty');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { definition: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Try to get user progress if authenticated
    let userId: string | null = null;
    try {
      const { session } = await requireAuth();
      if (session?.user) {
        userId = (session.user as { id: string }).id;
      }
    } catch {
      // Not authenticated, that's fine
    }

    const [vocab, total] = await Promise.all([
      prisma.ieltsToeflVocab.findMany({
        where,
        orderBy: { word: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: userId
          ? {
              progress: {
                where: { userId },
                select: {
                  easeFactor: true,
                  interval: true,
                  repetitions: true,
                  nextReview: true,
                  lastReview: true,
                },
              },
            }
          : undefined,
      }),
      prisma.ieltsToeflVocab.count({ where }),
    ]);

    return NextResponse.json({ vocab, total, page, limit });
  } catch (err) {
    console.error('Error fetching vocab:', err);
    return NextResponse.json({ error: 'Failed to fetch vocabulary' }, { status: 500 });
  }
}
