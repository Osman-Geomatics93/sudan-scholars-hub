import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';
import { blogPostSchema } from '@/lib/validations/blog';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - List all blog posts (including drafts)
export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [blogPosts, total] = await Promise.all([
      prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count(),
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

// POST - Create new blog post
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();

    const result = blogPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ blogPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
