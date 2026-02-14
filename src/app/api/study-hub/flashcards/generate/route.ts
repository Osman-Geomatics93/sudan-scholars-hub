import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { generateCardsSchema } from '@/lib/validations/flashcard';
import { generateFlashcards } from '@/lib/flashcards/ai-generator';

export const dynamic = 'force-dynamic';

// POST - Generate flashcards from text using AI
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = generateCardsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { text, count, language, deckId } = result.data;

    // Generate flashcards via AI
    const generated = await generateFlashcards(text, count, language);

    if (generated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate flashcards from the provided text' },
        { status: 422 },
      );
    }

    // If deckId is provided, add cards to that deck
    if (deckId) {
      const deck = await prisma.flashcardDeck.findFirst({ where: { id: deckId, userId } });
      if (!deck) {
        return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
      }

      await prisma.flashcard.createMany({
        data: generated.map((c) => ({
          deckId,
          front: c.front,
          back: c.back,
        })),
      });

      return NextResponse.json({ cards: generated, addedToDeck: deckId });
    }

    // Return generated cards without saving
    return NextResponse.json({ cards: generated });
  } catch (err) {
    console.error('Error generating flashcards:', err);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
