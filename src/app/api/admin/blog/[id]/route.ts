import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';

// GET single blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;

    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!blogPost) {
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

// PUT update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if blog post exists
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed to an existing one
    if (body.slug !== existing.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: body.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Handle publishedAt based on isPublished status
    let publishedAt = existing.publishedAt;
    if (body.isPublished && !existing.isPublished) {
      // Being published for the first time
      publishedAt = new Date();
    } else if (!body.isPublished) {
      // Being unpublished
      publishedAt = null;
    }

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        slug: body.slug,
        title: body.title,
        titleAr: body.titleAr,
        excerpt: body.excerpt,
        excerptAr: body.excerptAr,
        content: body.content,
        contentAr: body.contentAr,
        category: body.category,
        categoryAr: body.categoryAr,
        author: body.author,
        authorAr: body.authorAr,
        readTime: body.readTime,
        readTimeAr: body.readTimeAr,
        image: body.image,
        tags: body.tags,
        isFeatured: body.isFeatured,
        isPublished: body.isPublished,
        publishedAt,
      },
    });

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Failed to update blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;

    // Check if blog post exists
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
