import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBotAuth } from '@/lib/bot-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = requireBotAuth(request);
  if (authError) return authError;

  try {
    const params = request.nextUrl.searchParams;
    const action = params.get('action') || 'random';
    const subject = params.get('subject');
    const count = Math.min(parseInt(params.get('count') || '3'), 10);
    const deckId = params.get('deckId');

    if (action === 'decks') {
      // Search public decks
      const where: Record<string, unknown> = { isPublic: true };
      if (subject) {
        where.OR = [
          { title: { contains: subject, mode: 'insensitive' } },
          { subject: { contains: subject, mode: 'insensitive' } },
        ];
      }

      const decks = await prisma.flashcardDeck.findMany({
        where,
        take: count,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { cards: true } } },
      });

      const lines = decks.map((d, i) =>
        `${i + 1}. *${d.title}*${d.subject ? ` (${d.subject})` : ''}\n   ${d._count.cards} cards | ID: \`${d.id}\``
      );

      const text = decks.length > 0
        ? `📂 *Flashcard Decks* (${decks.length})\n\n${lines.join('\n\n')}`
        : '❌ No public decks found.';

      return NextResponse.json({ text, count: decks.length });
    }

    if (action === 'due' && deckId) {
      // Cards due for review in a specific deck
      const cards = await prisma.flashcard.findMany({
        where: {
          deckId,
          nextReview: { lte: new Date() },
        },
        take: count,
        orderBy: { nextReview: 'asc' },
      });

      const lines = cards.map((c, i) =>
        `${i + 1}. *Q:* ${c.front}\n   *A:* ||${c.back}||`
      );

      const text = cards.length > 0
        ? `🔔 *Due Cards* (${cards.length})\n\n${lines.join('\n\n')}`
        : '✅ No cards due for review!';

      return NextResponse.json({ text, count: cards.length });
    }

    // Default: random cards from public decks
    const where: Record<string, unknown> = {
      deck: { isPublic: true },
    };

    if (subject) {
      where.deck = {
        isPublic: true,
        OR: [
          { subject: { contains: subject, mode: 'insensitive' } },
          { title: { contains: subject, mode: 'insensitive' } },
        ],
      };
    }

    if (deckId) {
      where.deckId = deckId;
    }

    // Get total count for random offset
    const total = await prisma.flashcard.count({ where });
    const skip = total > count ? Math.floor(Math.random() * (total - count)) : 0;

    const cards = await prisma.flashcard.findMany({
      where,
      skip,
      take: count,
      include: { deck: { select: { title: true } } },
    });

    const lines = cards.map((c, i) =>
      `${i + 1}. 📖 *${c.deck.title}*\n   *Q:* ${c.front}\n   *A:* ||${c.back}||`
    );

    const text = cards.length > 0
      ? `🃏 *Random Flashcards* (${cards.length})\n\n${lines.join('\n\n')}\n\n_Tap the spoiler to reveal the answer!_`
      : '❌ No flashcards found.';

    return NextResponse.json({ text, count: cards.length });
  } catch (error) {
    console.error('Bot flashcards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}
