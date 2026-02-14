import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createCardSchema } from '@/lib/validations/flashcard';

export const dynamic = 'force-dynamic';

// PATCH - Update a card
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const card = await prisma.flashcard.findUnique({
      where: { id },
      include: { deck: { select: { userId: true } } },
    });

    if (!card || card.deck.userId !== userId) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const body = await request.json();
    const result = createCardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const updated = await prisma.flashcard.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ card: updated });
  } catch (err) {
    console.error('Error updating card:', err);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE - Delete a card
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const card = await prisma.flashcard.findUnique({
      where: { id },
      include: { deck: { select: { userId: true } } },
    });

    if (!card || card.deck.userId !== userId) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    await prisma.flashcard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting card:', err);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
