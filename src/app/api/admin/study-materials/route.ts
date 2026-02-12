import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List all study materials (admin, filterable by status)
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const status = searchParams.get('status'); // PENDING, APPROVED, REJECTED

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [materials, total, pendingCount] = await Promise.all([
      prisma.studyMaterial.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.studyMaterial.count({ where }),
      prisma.studyMaterial.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({
      materials,
      pendingCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching study materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study materials' },
      { status: 500 }
    );
  }
}
