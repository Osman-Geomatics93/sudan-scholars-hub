import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Top users by points (public, supports pagination)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { points: { gt: 0 } },
        select: {
          id: true,
          name: true,
          image: true,
          points: true,
          badge: true,
        },
        orderBy: { points: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where: { points: { gt: 0 } } }),
    ]);

    return NextResponse.json({ users, total });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
