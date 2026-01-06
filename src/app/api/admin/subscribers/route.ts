import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - List all subscribers
export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
    const isActive = searchParams.get('isActive');
    const format = searchParams.get('format');

    const where = isActive !== null ? { isActive: isActive === 'true' } : {};

    // Export as CSV
    if (format === 'csv') {
      const subscribers = await prisma.subscriber.findMany({
        where: { isActive: true },
        orderBy: { subscribedAt: 'desc' },
      });

      const csv = [
        'Email,Subscribed At',
        ...subscribers.map(
          (s) => `${s.email},${s.subscribedAt.toISOString()}`
        ),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="subscribers.csv"',
        },
      });
    }

    const [subscribers, total, activeCount] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.subscriber.count({ where }),
      prisma.subscriber.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      subscribers,
      activeCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
