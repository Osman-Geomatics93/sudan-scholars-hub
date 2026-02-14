import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { generateHeatmapData, getWeeklyStats, getSubjectBreakdown, getTotalMinutes } from '@/lib/study-planner/analytics';

export const dynamic = 'force-dynamic';

// GET - Get aggregated analytics
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    // Fetch all sessions from the last year
    const since = new Date();
    since.setDate(since.getDate() - 365);

    const sessions = await prisma.studySession.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: 'desc' },
    });

    const heatmap = generateHeatmapData(sessions, 365);
    const weeklyStats = getWeeklyStats(sessions);
    const subjectBreakdown = getSubjectBreakdown(sessions);

    // Today's total
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMinutes = getTotalMinutes(sessions, todayStart);

    // This week's total
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekMinutes = getTotalMinutes(sessions, weekStart);

    // This month's total
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthMinutes = getTotalMinutes(sessions, monthStart);

    // Total all time
    const totalMinutes = getTotalMinutes(sessions);

    return NextResponse.json({
      heatmap,
      weeklyStats,
      subjectBreakdown,
      totals: {
        today: todayMinutes,
        week: weekMinutes,
        month: monthMinutes,
        allTime: totalMinutes,
      },
      sessionCount: sessions.length,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
