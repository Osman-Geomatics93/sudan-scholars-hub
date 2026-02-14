import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List all professor reviews (admin)
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const flagged = searchParams.get('flagged') === 'true';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { professorName: { contains: search, mode: 'insensitive' } },
        { courseName: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
        { universityName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const reviews = await prisma.professorReview.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.professorReview.count();

    return NextResponse.json({ reviews, total });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
