import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - Fetch analytics data for admin dashboard
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Fetch all analytics data in parallel
    const [
      totalPageViews,
      uniqueVisitorsResult,
      totalDownloads,
      pageViewsByDay,
      downloadsByFile,
      topPages,
      topReferrers,
    ] = await Promise.all([
      // Total page views
      prisma.pageView.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Unique visitors (count distinct sessionIds)
      prisma.pageView.groupBy({
        by: ['sessionId'],
        where: { createdAt: { gte: startDate } },
      }),

      // Total downloads
      prisma.downloadEvent.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Page views by day (for line chart)
      prisma.$queryRaw<{ date: string; count: bigint }[]>`
        SELECT DATE("createdAt") as date, COUNT(*) as count
        FROM "PageView"
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,

      // Downloads by file (for bar chart)
      prisma.downloadEvent.groupBy({
        by: ['fileName'],
        where: { createdAt: { gte: startDate } },
        _count: { fileName: true },
        orderBy: { _count: { fileName: 'desc' } },
        take: 10,
      }),

      // Top pages
      prisma.pageView.groupBy({
        by: ['path'],
        where: { createdAt: { gte: startDate } },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),

      // Top referrers
      prisma.pageView.groupBy({
        by: ['referrer'],
        where: {
          createdAt: { gte: startDate },
          referrer: { not: null },
        },
        _count: { referrer: true },
        orderBy: { _count: { referrer: 'desc' } },
        take: 10,
      }),
    ]);

    const uniqueVisitors = uniqueVisitorsResult.length;

    return NextResponse.json({
      summary: {
        totalPageViews,
        uniqueVisitors,
        totalDownloads,
        avgPagesPerVisitor: uniqueVisitors > 0
          ? (totalPageViews / uniqueVisitors).toFixed(1)
          : '0',
      },
      charts: {
        pageViewsByDay: pageViewsByDay.map((row) => ({
          date: row.date,
          count: Number(row.count),
        })),
        downloadsByFile: downloadsByFile.map((d) => ({
          fileName: d.fileName,
          count: d._count.fileName,
        })),
      },
      tables: {
        topPages: topPages.map((p) => ({
          path: p.path,
          count: p._count.path,
        })),
        topReferrers: topReferrers.map((r) => ({
          referrer: r.referrer || 'Direct',
          count: r._count.referrer,
        })),
      },
      period,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
