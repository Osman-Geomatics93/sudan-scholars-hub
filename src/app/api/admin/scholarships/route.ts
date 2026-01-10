import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-utils';
import { scholarshipSchema } from '@/lib/validations/scholarship';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - List all scholarships (including drafts)
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.scholarship.count(),
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

// POST - Create new scholarship
export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();

    const result = scholarshipSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check if slug already exists
    const existing = await prisma.scholarship.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A scholarship with this slug already exists' },
        { status: 400 }
      );
    }

    const scholarship = await prisma.scholarship.create({
      data: {
        ...data,
        deadline: new Date(data.deadline),
      },
    });

    return NextResponse.json({ scholarship }, { status: 201 });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to create scholarship' },
      { status: 500 }
    );
  }
}
