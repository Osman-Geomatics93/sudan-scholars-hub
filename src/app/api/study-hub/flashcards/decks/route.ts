import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createDeckSchema } from '@/lib/validations/flashcard';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// GET - List user's decks + public decks
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const browse = searchParams.get('browse'); // "public" to browse public decks
  const search = searchParams.get('search');
  const userId = (session!.user as { id: string }).id;

  try {
    const where: Record<string, unknown> = {};

    if (browse === 'public') {
      where.isPublic = true;
      where.NOT = { userId };
    } else {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const decks = await prisma.flashcardDeck.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { cards: true } },
        user: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json({ decks });
  } catch (err) {
    console.error('Error fetching decks:', err);
    return NextResponse.json({ error: 'Failed to fetch decks' }, { status: 500 });
  }
}

// POST - Create a new deck
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createDeckSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const userId = (session!.user as { id: string }).id;

    const deck = await prisma.flashcardDeck.create({
      data: { ...result.data, userId },
    });

    await awardPoints(userId, POINT_VALUES.FLASHCARD_DECK_CREATED);

    return NextResponse.json({ deck }, { status: 201 });
  } catch (err) {
    console.error('Error creating deck:', err);
    return NextResponse.json({ error: 'Failed to create deck' }, { status: 500 });
  }
}
