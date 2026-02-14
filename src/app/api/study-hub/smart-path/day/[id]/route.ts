import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { updateDaySchema } from '@/lib/validations/smart-path';
import { recalculateMastery } from '@/lib/smart-path/mastery';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// PATCH - Update day status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const { id: dayId } = await params;

    const body = await request.json();
    const result = updateDaySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Verify the day belongs to the user's path
    const day = await prisma.studyPathDay.findUnique({
      where: { id: dayId },
      include: { path: { select: { userId: true, id: true, totalDays: true } } },
    });

    if (!day || day.path.userId !== userId) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    // Update the day
    const updated = await prisma.studyPathDay.update({
      where: { id: dayId },
      data: {
        status: result.data.status,
        completedAt: result.data.status === 'completed' ? new Date() : null,
        userNotes: result.data.userNotes ?? day.userNotes,
      },
    });

    // Award points if completed
    if (result.data.status === 'completed') {
      await awardPoints(userId, POINT_VALUES.STUDY_PATH_DAY_COMPLETED);
    }

    // Check if all days are done (completed, struggled, or skipped)
    const allDays = await prisma.studyPathDay.findMany({
      where: { pathId: day.path.id },
      select: { status: true },
    });

    const allDone = allDays.every((d) => d.status !== 'pending');
    if (allDone) {
      await prisma.smartStudyPath.update({
        where: { id: day.path.id },
        data: { status: 'completed' },
      });
      await awardPoints(userId, POINT_VALUES.STUDY_PATH_COMPLETED);
    }

    // Recalculate mastery
    await recalculateMastery(userId).catch(() => {});

    return NextResponse.json({ day: updated, pathCompleted: allDone });
  } catch (err) {
    console.error('Error updating study path day:', err);
    return NextResponse.json({ error: 'Failed to update day' }, { status: 500 });
  }
}
