import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering to avoid static generation errors
export const dynamic = 'force-dynamic';

// GET - List published blog posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      isPublished: boolean;
      isFeatured?: boolean;
      tags?: { has: string };
      category?: string;
    } = { isPublished: true };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (category) {
      where.category = category;
    }

    const [blogPosts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          titleAr: true,
          excerpt: true,
          excerptAr: true,
          image: true,
          category: true,
          categoryAr: true,
          author: true,
          authorAr: true,
          readTime: true,
          readTimeAr: true,
          tags: true,
          isFeatured: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      blogPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
