import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBotAuth } from '@/lib/bot-auth';
import { BADGE_THRESHOLDS, getBadgeForPoints } from '@/lib/points';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = requireBotAuth(request);
  if (authError) return authError;

  try {
    const params = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(params.get('limit') || '10'), 20);

    const users = await prisma.user.findMany({
      where: { points: { gt: 0 } },
      orderBy: { points: 'desc' },
      take: limit,
      select: {
        name: true,
        points: true,
        badge: true,
      },
    });

    const medals = ['🥇', '🥈', '🥉'];
    const lines = users.map((u, i) => {
      const badge = getBadgeForPoints(u.points);
      const medal = i < 3 ? medals[i] : `${i + 1}.`;
      const name = u.name || 'Anonymous';
      return `${medal} ${badge.icon} *${name}* — ${u.points} pts (${badge.labelEn})`;
    });

    const text = users.length > 0
      ? `🏆 *Leaderboard* (Top ${users.length})\n\n${lines.join('\n')}`
      : '📊 No users on the leaderboard yet.';

    return NextResponse.json({ text, count: users.length });
  } catch (error) {
    console.error('Bot leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
