import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { gradeWritingSchema, gradeSpeakingSchema } from '@/lib/validations/ielts-toefl';
import { gradeWritingTask, gradeSpeakingTask } from '@/lib/ielts-toefl/ai-grader';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const { type } = body;

    if (type === 'writing') {
      const result = gradeWritingSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: result.error.flatten().fieldErrors },
          { status: 400 },
        );
      }

      const { testId, attemptId, taskResponse } = result.data;

      const attempt = await prisma.ieltsToeflAttempt.findUnique({ where: { id: attemptId } });
      if (!attempt || attempt.userId !== userId) {
        return NextResponse.json({ error: 'Attempt not found or unauthorized' }, { status: 404 });
      }

      const test = await prisma.ieltsToeflTest.findUnique({ where: { id: testId } });
      if (!test) {
        return NextResponse.json({ error: 'Test not found' }, { status: 404 });
      }

      const content = test.content as { tasks?: Array<{ type: string; prompt: string }> };
      const taskPrompt = content.tasks?.[0]?.prompt || '';
      const taskType = content.tasks?.[0]?.type || 'task2';

      const grading = await gradeWritingTask(taskPrompt, taskResponse, test.examType as 'ielts' | 'toefl', taskType);
      const score = 'band' in grading ? grading.band : ('score' in grading ? (grading as { score: number }).score : null);

      await prisma.ieltsToeflAttempt.update({
        where: { id: attemptId },
        data: {
          aiGrading: grading as object,
          score,
          maxScore: test.examType === 'ielts' ? 9 : 5,
          status: 'graded',
        },
      });

      await awardPoints(userId, POINT_VALUES.IELTS_TEST_COMPLETED);

      return NextResponse.json({ grading, score });
    } else if (type === 'speaking') {
      const result = gradeSpeakingSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: result.error.flatten().fieldErrors },
          { status: 400 },
        );
      }

      const { testId, attemptId, transcription } = result.data;

      const attempt = await prisma.ieltsToeflAttempt.findUnique({ where: { id: attemptId } });
      if (!attempt || attempt.userId !== userId) {
        return NextResponse.json({ error: 'Attempt not found or unauthorized' }, { status: 404 });
      }

      const test = await prisma.ieltsToeflTest.findUnique({ where: { id: testId } });
      if (!test) {
        return NextResponse.json({ error: 'Test not found' }, { status: 404 });
      }

      const content = test.content as { parts?: Array<{ partNumber: number; prompt: string }> };
      const partPrompt = content.parts?.[0]?.prompt || '';
      const partNumber = content.parts?.[0]?.partNumber || 1;

      const grading = await gradeSpeakingTask(partPrompt, transcription, test.examType as 'ielts' | 'toefl', partNumber);

      await prisma.ieltsToeflAttempt.update({
        where: { id: attemptId },
        data: {
          aiGrading: grading as object,
          score: grading.band,
          maxScore: test.examType === 'ielts' ? 9 : 5,
          status: 'graded',
        },
      });

      await awardPoints(userId, POINT_VALUES.IELTS_TEST_COMPLETED);

      return NextResponse.json({ grading, score: grading.band });
    }

    return NextResponse.json({ error: 'Invalid grading type. Use "writing" or "speaking".' }, { status: 400 });
  } catch (err) {
    console.error('Error grading attempt:', err);
    return NextResponse.json({ error: 'Failed to grade attempt' }, { status: 500 });
  }
}
