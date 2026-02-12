import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Top users by points (public)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { points: { gt: 0 } },
      select: {
        id: true,
        name: true,
        image: true,
        points: true,
        badge: true,
      },
      orderBy: { points: 'desc' },
      take: 20,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
