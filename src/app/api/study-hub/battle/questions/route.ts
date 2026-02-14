import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createQuestionSchema } from '@/lib/validations/battle';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// GET — List user's question bank
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = { userId };
    if (subject) where.subject = subject;

    const [questions, total] = await Promise.all([
      prisma.battleQuestion.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.battleQuestion.count({ where }),
    ]);

    // Get subject breakdown
    const subjects = await prisma.battleQuestion.groupBy({
      by: ['subject'],
      where: { userId },
      _count: { id: true },
    });

    return NextResponse.json({ questions, total, subjects: subjects.map(s => ({ subject: s.subject, count: s._count.id })) });
  } catch (err) {
    console.error('Error fetching battle questions:', err);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

// POST — Create a new question
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = createQuestionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const question = await prisma.battleQuestion.create({
      data: { userId, ...result.data },
    });

    // Check if user just hit 10 questions milestone
    const totalQuestions = await prisma.battleQuestion.count({ where: { userId } });
    let milestoneReached = false;
    if (totalQuestions === 10) {
      await awardPoints(userId, POINT_VALUES.QUESTION_BANK_10);
      milestoneReached = true;
    }

    return NextResponse.json({ question, totalQuestions, milestoneReached }, { status: 201 });
  } catch (err) {
    console.error('Error creating battle question:', err);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

// DELETE — Remove a question
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }

    const question = await prisma.battleQuestion.findUnique({ where: { id } });
    if (!question || question.userId !== userId) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    await prisma.battleQuestion.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting battle question:', err);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
