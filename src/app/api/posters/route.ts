import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PosterCategory } from '@prisma/client';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - Fetch active posters with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as PosterCategory | null;
    const featured = searchParams.get('featured');
    const scholarshipId = searchParams.get('scholarshipId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Build where clause
    const where: {
      isActive: boolean;
      category?: PosterCategory;
      isFeatured?: boolean;
      scholarshipId?: string;
    } = {
      isActive: true,
    };

    // Filter by category if provided
    if (category && Object.values(PosterCategory).includes(category)) {
      where.category = category;
    }

    // Filter by featured if provided
    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Filter by scholarship if provided
    if (scholarshipId) {
      where.scholarshipId = scholarshipId;
    }

    const posters = await prisma.poster.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
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
      ...(limit && { take: parseInt(limit) }),
      ...(offset && { skip: parseInt(offset) }),
    });

    // Get total count for pagination
    const total = await prisma.poster.count({ where });

    return NextResponse.json({
      posters,
      total,
      hasMore: offset && limit ? parseInt(offset) + parseInt(limit) < total : false,
    });
  } catch (error) {
    console.error('Failed to fetch posters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posters' },
      { status: 500 }
    );
  }
}
