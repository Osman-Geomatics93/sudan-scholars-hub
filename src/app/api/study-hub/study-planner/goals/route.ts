import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createGoalSchema } from '@/lib/validations/study-planner';

export const dynamic = 'force-dynamic';

// GET - Get user's active goals
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const goals = await prisma.studyGoal.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ goals });
  } catch (err) {
    console.error('Error fetching goals:', err);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

// POST - Create or update a goal
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = createGoalSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Deactivate existing goal of same type
    await prisma.studyGoal.updateMany({
      where: { userId, type: result.data.type, isActive: true },
      data: { isActive: false },
    });

    const goal = await prisma.studyGoal.create({
      data: {
        userId,
        type: result.data.type,
        targetMinutes: result.data.targetMinutes,
      },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (err) {
    console.error('Error creating goal:', err);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

// DELETE - Deactivate a goal
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('id');

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 });
    }

    const existing = await prisma.studyGoal.findFirst({ where: { id: goalId, userId } });
    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    await prisma.studyGoal.update({
      where: { id: goalId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting goal:', err);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}
