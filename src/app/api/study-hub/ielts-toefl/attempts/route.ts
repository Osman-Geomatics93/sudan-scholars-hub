import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { submitAttemptSchema } from '@/lib/validations/ielts-toefl';
import { calculateReadingScore, calculateListeningScore } from '@/lib/ielts-toefl/scoring';

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = submitAttemptSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const userId = (session!.user as { id: string }).id;
    const { testId, answers, timeSpentSec } = result.data;

    const test = await prisma.ieltsToeflTest.findUnique({ where: { id: testId } });
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Auto-grade reading and listening sections
    let score: number | null = null;
    let maxScore: number | null = null;
    let status = 'completed';
    const content = test.content as Record<string, unknown>;
    const userAnswers = answers as Record<string, string>;

    if (test.section === 'reading' || test.section === 'listening') {
      const passages = (content.passages || []) as Array<{
        questions: Array<{ correct: string }>;
      }>;
      const questions = (content.questions || []) as Array<{ correct: string }>;

      // Collect all questions from passages or top-level
      const allQuestions = passages.length > 0
        ? passages.flatMap((p) => p.questions)
        : questions;

      let correct = 0;
      const total = allQuestions.length;

      allQuestions.forEach((q, i) => {
        if (userAnswers[String(i)] === q.correct) {
          correct++;
        }
      });

      const scoreFn = test.section === 'reading' ? calculateReadingScore : calculateListeningScore;
      const result = scoreFn(correct, total, test.examType as 'ielts' | 'toefl');
      score = result.band ?? result.score;
      maxScore = result.maxScore;
      status = 'graded';
    } else if (test.section === 'writing' || test.section === 'speaking') {
      status = 'completed'; // Needs AI grading
    }

    const attempt = await prisma.ieltsToeflAttempt.create({
      data: {
        userId,
        testId,
        examType: test.examType,
        section: test.section,
        answers: answers as Prisma.InputJsonValue,
        score,
        maxScore,
        timeSpentSec: timeSpentSec ?? null,
        status,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ attempt }, { status: 201 });
  } catch (err) {
    console.error('Error submitting attempt:', err);
    return NextResponse.json({ error: 'Failed to submit attempt' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const searchParams = request.nextUrl.searchParams;
    const examType = searchParams.get('examType');
    const section = searchParams.get('section');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);

    const where: Record<string, unknown> = { userId };
    if (examType) where.examType = examType;
    if (section) where.section = section;

    const [attempts, total] = await Promise.all([
      prisma.ieltsToeflAttempt.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          test: {
            select: { title: true, section: true, examType: true, difficulty: true },
          },
        },
      }),
      prisma.ieltsToeflAttempt.count({ where }),
    ]);

    return NextResponse.json({ attempts, total, page, limit });
  } catch (err) {
    console.error('Error fetching attempts:', err);
    return NextResponse.json({ error: 'Failed to fetch attempts' }, { status: 500 });
  }
}
