import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// POST - Clone a public deck
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: sourceDeckId } = await params;
    const userId = (session!.user as { id: string }).id;

    const sourceDeck = await prisma.flashcardDeck.findFirst({
      where: { id: sourceDeckId, isPublic: true },
      include: { cards: true },
    });

    if (!sourceDeck) {
      return NextResponse.json({ error: 'Deck not found or not public' }, { status: 404 });
    }

    // Create cloned deck
    const clonedDeck = await prisma.flashcardDeck.create({
      data: {
        userId,
        title: sourceDeck.title,
        description: sourceDeck.description,
        subject: sourceDeck.subject,
        isPublic: false,
        sourceId: sourceDeckId,
      },
    });

    // Clone all cards
    if (sourceDeck.cards.length > 0) {
      await prisma.flashcard.createMany({
        data: sourceDeck.cards.map((c) => ({
          deckId: clonedDeck.id,
          front: c.front,
          back: c.back,
        })),
      });
    }

    // Increment clone count on source
    await prisma.flashcardDeck.update({
      where: { id: sourceDeckId },
      data: { cloneCount: { increment: 1 } },
    });

    return NextResponse.json({ deck: clonedDeck }, { status: 201 });
  } catch (err) {
    console.error('Error cloning deck:', err);
    return NextResponse.json({ error: 'Failed to clone deck' }, { status: 500 });
  }
}
