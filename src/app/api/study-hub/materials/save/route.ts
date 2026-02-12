import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// POST - Toggle save/unsave a material (bookmark)
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { materialId } = await request.json();
    if (!materialId) {
      return NextResponse.json({ error: 'materialId is required' }, { status: 400 });
    }

    const userId = (session!.user as { id: string }).id;

    const existing = await prisma.savedMaterial.findUnique({
      where: { userId_materialId: { userId, materialId } },
    });

    if (existing) {
      await prisma.savedMaterial.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false, message: 'Material unsaved' });
    } else {
      await prisma.savedMaterial.create({
        data: { userId, materialId },
      });
      return NextResponse.json({ saved: true, message: 'Material saved' });
    }
  } catch (error) {
    console.error('Error toggling saved material:', error);
    return NextResponse.json({ error: 'Failed to toggle save' }, { status: 500 });
  }
}
