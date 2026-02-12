import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - Check if a material is saved by the current user
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const materialId = request.nextUrl.searchParams.get('materialId');
    if (!materialId) {
      return NextResponse.json({ error: 'materialId is required' }, { status: 400 });
    }

    const userId = (session!.user as { id: string }).id;

    const saved = await prisma.savedMaterial.findUnique({
      where: { userId_materialId: { userId, materialId } },
    });

    return NextResponse.json({ isSaved: !!saved });
  } catch (error) {
    console.error('Error checking saved status:', error);
    return NextResponse.json({ error: 'Failed to check save status' }, { status: 500 });
  }
}
