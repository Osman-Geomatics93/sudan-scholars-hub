import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET — Battle leaderboard
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all-time';

    let dateFilter: Date | undefined;
    if (period === 'weekly') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (period === 'monthly') {
      dateFilter = new Date();
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    const completedFilter: Record<string, unknown> = { status: 'completed' };
    if (dateFilter) completedFilter.completedAt = { gte: dateFilter };

    // Get all completed battles in the period
    const battles = await prisma.battle.findMany({
      where: completedFilter,
      select: { challengerId: true, opponentId: true, winnerId: true },
    });

    // Aggregate wins and losses per user
    const stats: Record<string, { wins: number; losses: number; battles: number }> = {};

    for (const b of battles) {
      for (const pid of [b.challengerId, b.opponentId]) {
        if (!stats[pid]) stats[pid] = { wins: 0, losses: 0, battles: 0 };
        stats[pid].battles++;
        if (b.winnerId === pid) stats[pid].wins++;
        else stats[pid].losses++;
      }
    }

    // Sort by wins descending
    const sorted = Object.entries(stats)
      .sort((a, b) => b[1].wins - a[1].wins)
      .slice(0, 50);

    const userIds = sorted.map(([id]) => id);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true, badge: true, points: true },
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    const rankings = sorted.map(([id, s], idx) => ({
      rank: idx + 1,
      user: userMap.get(id) || { id, name: 'Unknown', image: null, badge: null, points: 0 },
      wins: s.wins,
      losses: s.losses,
      battles: s.battles,
      winRate: s.battles > 0 ? Math.round((s.wins / s.battles) * 100) : 0,
    }));

    return NextResponse.json({ rankings, period });
  } catch (err) {
    console.error('Error fetching battle leaderboard:', err);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
