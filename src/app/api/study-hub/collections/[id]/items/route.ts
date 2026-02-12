import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// POST - Add item to collection
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: collectionId } = await params;
    const { materialId } = await request.json();
    const userId = (session!.user as { id: string }).id;

    if (!materialId) {
      return NextResponse.json({ error: 'materialId is required' }, { status: 400 });
    }

    // Verify ownership
    const collection = await prisma.materialCollection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found or not owned' }, { status: 404 });
    }

    // Get next order
    const maxOrder = await prisma.collectionItem.aggregate({
      where: { collectionId },
      _max: { order: true },
    });

    const item = await prisma.collectionItem.create({
      data: {
        collectionId,
        materialId,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Item already in collection' }, { status: 409 });
    }
    console.error('Error adding item to collection:', error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}

// DELETE - Remove item from collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: collectionId } = await params;
    const { materialId } = await request.json();
    const userId = (session!.user as { id: string }).id;

    if (!materialId) {
      return NextResponse.json({ error: 'materialId is required' }, { status: 400 });
    }

    // Verify ownership
    const collection = await prisma.materialCollection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found or not owned' }, { status: 404 });
    }

    await prisma.collectionItem.deleteMany({
      where: { collectionId, materialId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing item from collection:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
