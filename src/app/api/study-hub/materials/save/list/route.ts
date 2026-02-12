import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List user's saved materials
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    const savedMaterials = await prisma.savedMaterial.findMany({
      where: { userId },
      include: { material: true },
      orderBy: { savedAt: 'desc' },
    });

    const materials = savedMaterials.map((s) => s.material);
    const materialIds = savedMaterials.map((s) => s.materialId);

    return NextResponse.json({ materials, materialIds });
  } catch (error) {
    console.error('Error fetching saved materials:', error);
    return NextResponse.json({ error: 'Failed to fetch saved materials' }, { status: 500 });
  }
}
