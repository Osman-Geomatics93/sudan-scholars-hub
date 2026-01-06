import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';

// GET - Dashboard statistics
export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const [
      totalScholarships,
      publishedScholarships,
      featuredScholarships,
      totalContacts,
      unreadContacts,
      totalSubscribers,
      activeSubscribers,
      recentScholarships,
      recentContacts,
    ] = await Promise.all([
      prisma.scholarship.count(),
      prisma.scholarship.count({ where: { isPublished: true } }),
      prisma.scholarship.count({ where: { isFeatured: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { isActive: true } }),
      prisma.scholarship.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          titleAr: true,
          isPublished: true,
          createdAt: true,
        },
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          isRead: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        scholarships: {
          total: totalScholarships,
          published: publishedScholarships,
          featured: featuredScholarships,
          drafts: totalScholarships - publishedScholarships,
        },
        contacts: {
          total: totalContacts,
          unread: unreadContacts,
        },
        subscribers: {
          total: totalSubscribers,
          active: activeSubscribers,
        },
      },
      recentScholarships,
      recentContacts,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
