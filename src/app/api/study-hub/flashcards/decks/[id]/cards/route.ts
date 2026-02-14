import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createCardSchema } from '@/lib/validations/flashcard';

export const dynamic = 'force-dynamic';

// GET - List cards in a deck
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: deckId } = await params;
    const userId = (session!.user as { id: string }).id;

    const deck = await prisma.flashcardDeck.findFirst({
      where: { id: deckId, OR: [{ userId }, { isPublic: true }] },
    });
    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    const cards = await prisma.flashcard.findMany({
      where: { deckId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ cards });
  } catch (err) {
    console.error('Error fetching cards:', err);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// POST - Add a card to a deck
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: deckId } = await params;
    const userId = (session!.user as { id: string }).id;

    const deck = await prisma.flashcardDeck.findFirst({ where: { id: deckId, userId } });
    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    const body = await request.json();
    const result = createCardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const card = await prisma.flashcard.create({
      data: { deckId, ...result.data },
    });

    return NextResponse.json({ card }, { status: 201 });
  } catch (err) {
    console.error('Error creating card:', err);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
