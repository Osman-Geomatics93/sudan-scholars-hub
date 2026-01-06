import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Disable caching for this route
export const dynamic = 'force-dynamic';

// GET - Get single blog post by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const blogPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Only return published posts to public
    if (!blogPost.isPublished) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
