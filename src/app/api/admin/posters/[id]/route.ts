import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';
import { PosterCategory } from '@prisma/client';

// Disable caching
export const dynamic = 'force-dynamic';

// GET single poster by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;

    const poster = await prisma.poster.findUnique({
      where: { id },
      include: {
        scholarship: {
          select: {
            id: true,
            slug: true,
            title: true,
            titleAr: true,
          },
        },
      },
    });

    if (!poster) {
      return NextResponse.json(
        { error: 'Poster not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ poster });
  } catch (error) {
    console.error('Failed to fetch poster:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poster' },
      { status: 500 }
    );
  }
}

// PUT update poster
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if poster exists
    const existing = await prisma.poster.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Poster not found' },
        { status: 404 }
      );
    }

    // Validate category if provided
    if (body.category && !Object.values(PosterCategory).includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Only update fields that are provided
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.titleAr !== undefined) updateData.titleAr = body.titleAr;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.descriptionAr !== undefined) updateData.descriptionAr = body.descriptionAr;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.scholarshipId !== undefined) updateData.scholarshipId = body.scholarshipId || null;
    if (body.externalUrl !== undefined) updateData.externalUrl = body.externalUrl || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.order !== undefined) updateData.order = body.order;

    const poster = await prisma.poster.update({
      where: { id },
      data: updateData,
      include: {
        scholarship: {
          select: {
            id: true,
            slug: true,
            title: true,
            titleAr: true,
          },
        },
      },
    });

    return NextResponse.json({ poster });
  } catch (error) {
    console.error('Failed to update poster:', error);
    return NextResponse.json(
      { error: 'Failed to update poster' },
      { status: 500 }
    );
  }
}

// DELETE poster
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;

    // Check if poster exists
    const existing = await prisma.poster.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Poster not found' },
        { status: 404 }
      );
    }

    await prisma.poster.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Poster deleted successfully' });
  } catch (error) {
    console.error('Failed to delete poster:', error);
    return NextResponse.json(
      { error: 'Failed to delete poster' },
      { status: 500 }
    );
  }
}
