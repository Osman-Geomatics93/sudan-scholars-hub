import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBotAuth } from '@/lib/bot-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = requireBotAuth(request);
  if (authError) return authError;

  try {
    const params = request.nextUrl.searchParams;
    const subject = params.get('subject');
    const count = Math.min(parseInt(params.get('count') || '5'), 10);

    const where: Record<string, unknown> = {};
    if (subject) {
      where.subject = { contains: subject, mode: 'insensitive' };
    }

    // Get total for random offset
    const total = await prisma.battleQuestion.count({ where });
    const skip = total > count ? Math.floor(Math.random() * (total - count)) : 0;

    const questions = await prisma.battleQuestion.findMany({
      where,
      skip,
      take: count,
    });

    const optionLabels = ['A', 'B', 'C', 'D'] as const;
    const lines = questions.map((q, i) => {
      const options = [
        `  A) ${q.optionA}`,
        `  B) ${q.optionB}`,
        `  C) ${q.optionC}`,
        `  D) ${q.optionD}`,
      ].join('\n');
      return `*${i + 1}. ${q.question}*\n${options}\n✅ Answer: ||${q.correctOption}||`;
    });

    const text = questions.length > 0
      ? `🧠 *Quick Quiz* (${questions.length} question${questions.length !== 1 ? 's' : ''})\n${subject ? `Subject: ${subject}\n` : ''}\n${lines.join('\n\n')}\n\n_Tap the spoiler to reveal the answer!_`
      : '❌ No quiz questions found for this subject.';

    return NextResponse.json({ text, count: questions.length });
  } catch (error) {
    console.error('Bot quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}
