import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List all past exams (admin, filterable by status)
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

    const [exams, total, pendingCount] = await Promise.all([
      prisma.pastExam.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.pastExam.count({ where }),
      prisma.pastExam.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({
      exams,
      pendingCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching past exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch past exams' },
      { status: 500 }
    );
  }
}
