import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List all material requests (admin)
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') where.status = status;

    const [requests, counts] = await Promise.all([
      prisma.materialRequest.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.materialRequest.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    const statusCounts = {
      OPEN: 0,
      FULFILLED: 0,
      CLOSED: 0,
      ALL: 0,
    };
    counts.forEach((c) => {
      statusCounts[c.status as keyof typeof statusCounts] = c._count;
      statusCounts.ALL += c._count;
    });

    return NextResponse.json({ requests, statusCounts });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
