import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - Single material detail, increment viewCount
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const material = await prisma.ieltsToeflMaterial.findUnique({ where: { id } });

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // Increment view count
    await prisma.ieltsToeflMaterial.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ material: { ...material, viewCount: material.viewCount + 1 } });
  } catch (error) {
    console.error('Error fetching IELTS/TOEFL material:', error);
    return NextResponse.json({ error: 'Failed to fetch material' }, { status: 500 });
  }
}

// DELETE - Owner-only deletion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const material = await prisma.ieltsToeflMaterial.findUnique({ where: { id } });

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    if (material.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only delete your own materials' }, { status: 403 });
    }

    await prisma.ieltsToeflMaterial.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    console.error('Error deleting IELTS/TOEFL material:', error);
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
  }
}
