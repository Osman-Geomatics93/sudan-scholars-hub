import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { updateDeckSchema } from '@/lib/validations/flashcard';

export const dynamic = 'force-dynamic';

// GET - Get a deck with its cards
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const deck = await prisma.flashcardDeck.findFirst({
      where: {
        id,
        OR: [{ userId }, { isPublic: true }],
      },
      include: {
        cards: { orderBy: { createdAt: 'asc' } },
        user: { select: { name: true, image: true } },
        _count: { select: { cards: true } },
      },
    });

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    // Count cards due for review
    const dueCount = deck.cards.filter((c) => new Date(c.nextReview) <= new Date()).length;

    return NextResponse.json({ deck, dueCount });
  } catch (err) {
    console.error('Error fetching deck:', err);
    return NextResponse.json({ error: 'Failed to fetch deck' }, { status: 500 });
  }
}

// PATCH - Update a deck
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const existing = await prisma.flashcardDeck.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    const body = await request.json();
    const result = updateDeckSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const deck = await prisma.flashcardDeck.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ deck });
  } catch (err) {
    console.error('Error updating deck:', err);
    return NextResponse.json({ error: 'Failed to update deck' }, { status: 500 });
  }
}

// DELETE - Delete a deck
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const existing = await prisma.flashcardDeck.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    await prisma.flashcardDeck.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting deck:', err);
    return NextResponse.json({ error: 'Failed to delete deck' }, { status: 500 });
  }
}
