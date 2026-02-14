import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createBattleSchema } from '@/lib/validations/battle';

export const dynamic = 'force-dynamic';

// GET — List user's battles
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const where: Record<string, unknown> = {
      OR: [{ challengerId: userId }, { opponentId: userId }],
    };
    if (status) where.status = status;

    const battles = await prisma.battle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        challenger: { select: { id: true, name: true, image: true, badge: true } },
        opponent: { select: { id: true, name: true, image: true, badge: true } },
      },
    });

    // Categorize
    const pending = battles.filter(b => b.status === 'pending');
    const active = battles.filter(b => b.status === 'accepted' || b.status === 'in_progress');
    const completed = battles.filter(b => b.status === 'completed');

    return NextResponse.json({ battles, pending, active, completed });
  } catch (err) {
    console.error('Error fetching battles:', err);
    return NextResponse.json({ error: 'Failed to fetch battles' }, { status: 500 });
  }
}

// POST — Create a new challenge
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = createBattleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { opponentId, subject } = result.data;

    if (opponentId === userId) {
      return NextResponse.json({ error: 'Cannot challenge yourself' }, { status: 400 });
    }

    // Verify opponent exists
    const opponent = await prisma.user.findUnique({ where: { id: opponentId }, select: { id: true } });
    if (!opponent) {
      return NextResponse.json({ error: 'Opponent not found' }, { status: 404 });
    }

    // Get questions from both players' banks for this subject
    const [challengerQuestions, opponentQuestions] = await Promise.all([
      prisma.battleQuestion.findMany({
        where: { userId, subject },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.battleQuestion.findMany({
        where: { userId: opponentId, subject },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const allQuestions = [...challengerQuestions, ...opponentQuestions];
    if (allQuestions.length < 5) {
      return NextResponse.json(
        { error: 'Not enough questions. Both players need at least 5 questions combined in this subject.' },
        { status: 400 },
      );
    }

    // Randomly select 10 questions (or all if fewer)
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    const questionsSnapshot = selected.map(q => ({
      questionId: q.id,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
    }));

    // Update used counts
    await prisma.battleQuestion.updateMany({
      where: { id: { in: selected.map(q => q.id) } },
      data: { usedCount: { increment: 1 } },
    });

    const battle = await prisma.battle.create({
      data: {
        challengerId: userId,
        opponentId,
        subject,
        questions: questionsSnapshot,
      },
      include: {
        challenger: { select: { id: true, name: true, image: true, badge: true } },
        opponent: { select: { id: true, name: true, image: true, badge: true } },
      },
    });

    return NextResponse.json({ battle }, { status: 201 });
  } catch (err) {
    console.error('Error creating battle:', err);
    return NextResponse.json({ error: 'Failed to create battle' }, { status: 500 });
  }
}
