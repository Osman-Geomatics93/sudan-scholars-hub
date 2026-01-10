import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-utils';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - List all universities
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'qsRank';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const universities = await prisma.university.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { nameAr: { contains: search, mode: 'insensitive' } },
              { country: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: {
        [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc',
      },
    });

    return NextResponse.json({ universities });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

// POST - Create new university
export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.nameAr || !body.country || !body.countryAr) {
      return NextResponse.json(
        { error: 'Name, Arabic name, country, and Arabic country are required' },
        { status: 400 }
      );
    }

    // Check if university already exists
    const existing = await prisma.university.findUnique({
      where: { name: body.name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A university with this name already exists' },
        { status: 400 }
      );
    }

    const university = await prisma.university.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        country: body.country,
        countryAr: body.countryAr,
        qsRank: body.qsRank ? parseInt(body.qsRank) : null,
        timesRank: body.timesRank ? parseInt(body.timesRank) : null,
        logo: body.logo || null,
        website: body.website || null,
      },
    });

    return NextResponse.json({ university }, { status: 201 });
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}
