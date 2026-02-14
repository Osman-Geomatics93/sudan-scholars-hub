import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// GET - Get user's streak data
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    let streak = await prisma.studyStreak.findUnique({ where: { userId } });
    if (!streak) {
      streak = await prisma.studyStreak.create({
        data: { userId, currentStreak: 0, longestStreak: 0 },
      });
    }

    return NextResponse.json({ streak });
  } catch (err) {
    console.error('Error fetching streak:', err);
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 });
  }
}

// POST - Update streak (called after logging a study session)
export async function POST(_request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    let streak = await prisma.studyStreak.findUnique({ where: { userId } });
    if (!streak) {
      streak = await prisma.studyStreak.create({
        data: { userId, currentStreak: 0, longestStreak: 0 },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStudy = streak.lastStudyDate ? new Date(streak.lastStudyDate) : null;
    if (lastStudy) lastStudy.setHours(0, 0, 0, 0);

    let newStreak = streak.currentStreak;

    if (!lastStudy || lastStudy.getTime() < today.getTime()) {
      // Check if yesterday was studied (streak continues)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastStudy && lastStudy.getTime() === yesterday.getTime()) {
        newStreak = streak.currentStreak + 1;
      } else if (!lastStudy || lastStudy.getTime() < yesterday.getTime()) {
        newStreak = 1; // Reset streak
      }
      // Same day = no change

      const longestStreak = Math.max(streak.longestStreak, newStreak);

      const updated = await prisma.studyStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak,
          lastStudyDate: today,
        },
      });

      // Award points for streak milestones
      if (newStreak === 7 && streak.currentStreak < 7) {
        await awardPoints(userId, POINT_VALUES.STUDY_STREAK_7);
      }
      if (newStreak === 30 && streak.currentStreak < 30) {
        await awardPoints(userId, POINT_VALUES.STUDY_STREAK_30);
      }

      return NextResponse.json({ streak: updated });
    }

    return NextResponse.json({ streak });
  } catch (err) {
    console.error('Error updating streak:', err);
    return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
  }
}
