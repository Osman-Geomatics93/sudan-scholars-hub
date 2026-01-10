import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-utils';
import { PosterCategory } from '@prisma/client';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - List all posters (including inactive)
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as PosterCategory | null;

    const where: { category?: PosterCategory } = {};
    if (category && Object.values(PosterCategory).includes(category)) {
      where.category = category;
    }

    const posters = await prisma.poster.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
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

    return NextResponse.json({ posters });
  } catch (error) {
    console.error('Error fetching posters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posters' },
      { status: 500 }
    );
  }
}

// POST - Create new poster
export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.titleAr || !body.imageUrl || !body.category) {
      return NextResponse.json(
        { error: 'Title, Arabic title, image URL, and category are required' },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(PosterCategory).includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Get the highest order number and add 1
    const lastPoster = await prisma.poster.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const nextOrder = (lastPoster?.order ?? -1) + 1;

    const poster = await prisma.poster.create({
      data: {
        title: body.title,
        titleAr: body.titleAr,
        description: body.description || null,
        descriptionAr: body.descriptionAr || null,
        imageUrl: body.imageUrl,
        category: body.category,
        scholarshipId: body.scholarshipId || null,
        externalUrl: body.externalUrl || null,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        order: body.order ?? nextOrder,
      },
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

    return NextResponse.json({ poster }, { status: 201 });
  } catch (error) {
    console.error('Error creating poster:', error);
    return NextResponse.json(
      { error: 'Failed to create poster' },
      { status: 500 }
    );
  }
}
