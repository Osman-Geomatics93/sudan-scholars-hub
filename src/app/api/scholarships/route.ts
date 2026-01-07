import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Force dynamic rendering to avoid static generation errors
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Filters
    const level = searchParams.get('level');
    const fundingType = searchParams.get('fundingType');
    const country = searchParams.get('country');
    const field = searchParams.get('field');
    const search = searchParams.get('search');

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: Prisma.ScholarshipWhereInput = {
      isPublished: true,
    };

    if (level) {
      const levelFilters = level.split(',');
      where.levels = { hasSome: levelFilters as any };
    }

    if (fundingType) {
      const types = fundingType.split(',');
      where.fundingType = { in: types as any };
    }

    if (country) {
      const countries = country.split(',');
      where.countryCode = { in: countries };
    }

    if (field) {
      const fields = field.split(',');
      where.field = { in: fields as any };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { university: { contains: search, mode: 'insensitive' } },
        { universityAr: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { countryAr: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const orderBy: Prisma.ScholarshipOrderByWithRelationInput = {};
    if (sortBy === 'deadline') {
      orderBy.deadline = sortOrder as 'asc' | 'desc';
    } else if (sortBy === 'title') {
      orderBy.title = sortOrder as 'asc' | 'desc';
    } else {
      orderBy.createdAt = sortOrder as 'asc' | 'desc';
    }

    // Get scholarships with pagination
    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.scholarship.count({ where }),
    ]);

    return NextResponse.json({
      scholarships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    );
  }
}
