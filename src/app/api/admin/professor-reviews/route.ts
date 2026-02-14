import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List all professor reviews (admin, filterable by status)
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status'); // PENDING, APPROVED, REJECTED

    const where: Record<string, unknown> = {};

    if (status) where.status = status;

    if (search) {
      where.OR = [
        { professorName: { contains: search, mode: 'insensitive' } },
        { courseName: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
        { universityName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [reviews, total, pendingCount] = await Promise.all([
      prisma.professorReview.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.professorReview.count({ where }),
      prisma.professorReview.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({ reviews, total, pendingCount });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
