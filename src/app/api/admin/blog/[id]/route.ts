import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';

// Disable caching
export const dynamic = 'force-dynamic';

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

    // Only update fields that are provided
    const updateData: any = {};
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.titleAr !== undefined) updateData.titleAr = body.titleAr;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.excerptAr !== undefined) updateData.excerptAr = body.excerptAr;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.contentAr !== undefined) updateData.contentAr = body.contentAr;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.categoryAr !== undefined) updateData.categoryAr = body.categoryAr;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.authorAr !== undefined) updateData.authorAr = body.authorAr;
    if (body.readTime !== undefined) updateData.readTime = body.readTime;
    if (body.readTimeAr !== undefined) updateData.readTimeAr = body.readTimeAr;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;

    // Handle publishedAt based on isPublished status
    if (body.isPublished !== undefined) {
      updateData.isPublished = body.isPublished;
      if (body.isPublished && !existing.isPublished) {
        // Being published for the first time
        updateData.publishedAt = new Date();
      } else if (!body.isPublished) {
        // Being unpublished
        updateData.publishedAt = null;
      }
    }

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
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
