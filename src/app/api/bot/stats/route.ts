import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBotAuth } from '@/lib/bot-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = requireBotAuth(request);
  if (authError) return authError;

  try {
    const [users, scholarships, materials, decks, questions] = await Promise.all([
      prisma.user.count(),
      prisma.scholarship.count({ where: { isPublished: true } }),
      prisma.studyMaterial.count({ where: { status: 'APPROVED' } }),
      prisma.flashcardDeck.count({ where: { isPublic: true } }),
      prisma.battleQuestion.count(),
    ]);

    const text = [
      '📊 *Sudan Scholars Hub Stats*',
      '',
      `👥 Users: ${users}`,
      `🎓 Scholarships: ${scholarships}`,
      `📚 Study Materials: ${materials}`,
      `🃏 Flashcard Decks: ${decks}`,
      `🧠 Quiz Questions: ${questions}`,
    ].join('\n');

    return NextResponse.json({ text, count: users + scholarships + materials + decks + questions });
  } catch (error) {
    console.error('Bot stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
