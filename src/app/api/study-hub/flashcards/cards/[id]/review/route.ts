import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { reviewCardSchema } from '@/lib/validations/flashcard';
import { calculateSM2 } from '@/lib/flashcards/sm2';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// POST - Review a card with SM-2
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: cardId } = await params;
    const userId = (session!.user as { id: string }).id;

    const card = await prisma.flashcard.findUnique({ where: { id: cardId } });
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const body = await request.json();
    const result = reviewCardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    // Calculate SM-2
    const sm2 = calculateSM2(
      result.data.quality,
      card.easeFactor,
      card.interval,
      card.repetitions,
    );

    // Update card with SM-2 results
    const updated = await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        easeFactor: sm2.easeFactor,
        interval: sm2.interval,
        repetitions: sm2.repetitions,
        nextReview: sm2.nextReview,
      },
    });

    // Record the review
    await prisma.flashcardReview.create({
      data: { cardId, userId, quality: result.data.quality },
    });

    // Award points every 10 reviews
    const totalReviews = await prisma.flashcardReview.count({ where: { userId } });
    if (totalReviews % 10 === 0) {
      await awardPoints(userId, POINT_VALUES.FLASHCARD_REVIEW_10);
    }

    return NextResponse.json({
      card: updated,
      sm2Result: sm2,
    });
  } catch (err) {
    console.error('Error reviewing card:', err);
    return NextResponse.json({ error: 'Failed to review card' }, { status: 500 });
  }
}
