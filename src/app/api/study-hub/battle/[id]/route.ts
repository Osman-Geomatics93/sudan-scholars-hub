import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { battleActionSchema } from '@/lib/validations/battle';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

interface BattleQuestion {
  questionId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}

interface AnswerEntry {
  questionIdx: number;
  answer: string;
  timeMs: number;
}

function calculateScore(questions: BattleQuestion[], answers: AnswerEntry[]): number {
  let total = 0;
  for (const ans of answers) {
    const q = questions[ans.questionIdx];
    if (!q) continue;
    if (ans.answer === q.correctOption) {
      // Base 100 + speed bonus (up to 100 for <30s)
      const speedBonus = Math.max(0, Math.floor((30000 - ans.timeMs) / 300));
      total += 100 + speedBonus;
    }
  }
  return total;
}

// GET — Battle detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const { id } = await params;

    const battle = await prisma.battle.findUnique({
      where: { id },
      include: {
        challenger: { select: { id: true, name: true, image: true, badge: true, points: true } },
        opponent: { select: { id: true, name: true, image: true, badge: true, points: true } },
      },
    });

    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    // Only participants can view
    if (battle.challengerId !== userId && battle.opponentId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Hide correct answers if user hasn't submitted yet
    const isChallenger = battle.challengerId === userId;
    const hasSubmitted = isChallenger ? !!battle.challengerAnswers : !!battle.opponentAnswers;
    const questions = battle.questions as unknown as BattleQuestion[];

    const sanitizedQuestions = hasSubmitted || battle.status === 'completed'
      ? questions
      : questions.map(q => ({ ...q, correctOption: undefined }));

    return NextResponse.json({
      battle: {
        ...battle,
        questions: sanitizedQuestions,
        // Hide opponent's answers until both submitted
        challengerAnswers: battle.status === 'completed' ? battle.challengerAnswers : (isChallenger ? battle.challengerAnswers : null),
        opponentAnswers: battle.status === 'completed' ? battle.opponentAnswers : (!isChallenger ? battle.opponentAnswers : null),
      },
    });
  } catch (err) {
    console.error('Error fetching battle:', err);
    return NextResponse.json({ error: 'Failed to fetch battle' }, { status: 500 });
  }
}

// PATCH — Accept/decline/submit answers
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const { id } = await params;
    const body = await request.json();
    const result = battleActionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 },
      );
    }

    const battle = await prisma.battle.findUnique({
      where: { id },
      include: {
        challenger: { select: { id: true, name: true, image: true, badge: true } },
        opponent: { select: { id: true, name: true, image: true, badge: true } },
      },
    });

    if (!battle) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    if (battle.challengerId !== userId && battle.opponentId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const action = result.data.action;
    const isChallenger = battle.challengerId === userId;

    // ACCEPT
    if (action === 'accept') {
      if (battle.status !== 'pending') {
        return NextResponse.json({ error: 'Battle is not pending' }, { status: 400 });
      }
      if (isChallenger) {
        return NextResponse.json({ error: 'Challenger cannot accept their own battle' }, { status: 400 });
      }

      const updated = await prisma.battle.update({
        where: { id },
        data: { status: 'in_progress' },
        include: {
          challenger: { select: { id: true, name: true, image: true, badge: true } },
          opponent: { select: { id: true, name: true, image: true, badge: true } },
        },
      });

      return NextResponse.json({ battle: updated });
    }

    // DECLINE
    if (action === 'decline') {
      if (battle.status !== 'pending') {
        return NextResponse.json({ error: 'Battle is not pending' }, { status: 400 });
      }

      const updated = await prisma.battle.update({
        where: { id },
        data: { status: 'declined' },
        include: {
          challenger: { select: { id: true, name: true, image: true, badge: true } },
          opponent: { select: { id: true, name: true, image: true, badge: true } },
        },
      });

      return NextResponse.json({ battle: updated });
    }

    // SUBMIT ANSWERS
    if (action === 'submit') {
      if (battle.status !== 'in_progress' && battle.status !== 'accepted') {
        return NextResponse.json({ error: 'Battle is not active' }, { status: 400 });
      }

      // Check if already submitted
      if (isChallenger && battle.challengerAnswers) {
        return NextResponse.json({ error: 'Already submitted answers' }, { status: 400 });
      }
      if (!isChallenger && battle.opponentAnswers) {
        return NextResponse.json({ error: 'Already submitted answers' }, { status: 400 });
      }

      const answers = result.data.answers;
      const questions = battle.questions as unknown as BattleQuestion[];
      const score = calculateScore(questions, answers);

      const updateData: Record<string, unknown> = {};
      if (isChallenger) {
        updateData.challengerAnswers = answers;
        updateData.challengerScore = score;
      } else {
        updateData.opponentAnswers = answers;
        updateData.opponentScore = score;
      }

      // Check if both players have now submitted
      const otherSubmitted = isChallenger ? !!battle.opponentAnswers : !!battle.challengerAnswers;

      if (otherSubmitted) {
        // Battle complete — determine winner
        const challengerScore = isChallenger ? score : (battle.challengerScore || 0);
        const opponentScore = isChallenger ? (battle.opponentScore || 0) : score;

        let winnerId: string;
        if (challengerScore >= opponentScore) {
          winnerId = battle.challengerId; // Tie goes to challenger
        } else {
          winnerId = battle.opponentId;
        }

        updateData.status = 'completed';
        updateData.completedAt = new Date();
        updateData.winnerId = winnerId;

        // Award points to both participants
        await Promise.all([
          awardPoints(battle.challengerId, POINT_VALUES.BATTLE_PARTICIPATED),
          awardPoints(battle.opponentId, POINT_VALUES.BATTLE_PARTICIPATED),
          awardPoints(winnerId, POINT_VALUES.BATTLE_WON),
        ]);
      }

      const updated = await prisma.battle.update({
        where: { id },
        data: updateData,
        include: {
          challenger: { select: { id: true, name: true, image: true, badge: true } },
          opponent: { select: { id: true, name: true, image: true, badge: true } },
        },
      });

      return NextResponse.json({
        battle: updated,
        score,
        completed: !!otherSubmitted,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Error updating battle:', err);
    return NextResponse.json({ error: 'Failed to update battle' }, { status: 500 });
  }
}
