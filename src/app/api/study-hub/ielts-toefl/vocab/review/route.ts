import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { reviewVocabSchema } from '@/lib/validations/ielts-toefl';
import { sm2 } from '@/lib/ielts-toefl/scoring';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = reviewVocabSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { vocabId, quality } = result.data;

    // Get or create progress
    let progress = await prisma.ieltsToeflVocabProgress.findUnique({
      where: { userId_vocabId: { userId, vocabId } },
    });

    const sm2Result = sm2(
      quality,
      progress?.repetitions ?? 0,
      progress?.easeFactor ?? 2.5,
      progress?.interval ?? 0,
    );

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + sm2Result.interval);

    if (progress) {
      progress = await prisma.ieltsToeflVocabProgress.update({
        where: { id: progress.id },
        data: {
          easeFactor: sm2Result.easeFactor,
          interval: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          nextReview,
          lastReview: new Date(),
        },
      });
    } else {
      progress = await prisma.ieltsToeflVocabProgress.create({
        data: {
          userId,
          vocabId,
          easeFactor: sm2Result.easeFactor,
          interval: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          nextReview,
          lastReview: new Date(),
        },
      });
    }

    // Award points every 10 reviews
    const totalReviews = await prisma.ieltsToeflVocabProgress.count({
      where: { userId, repetitions: { gt: 0 } },
    });
    if (totalReviews > 0 && totalReviews % 10 === 0) {
      await awardPoints(userId, POINT_VALUES.IELTS_VOCAB_REVIEWED);
    }

    return NextResponse.json({ progress, nextReview });
  } catch (err) {
    console.error('Error reviewing vocab:', err);
    return NextResponse.json({ error: 'Failed to review vocabulary' }, { status: 500 });
  }
}
