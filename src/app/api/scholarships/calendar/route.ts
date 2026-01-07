import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Disable caching for fresh deadline data
export const dynamic = 'force-dynamic';

// GET - Fetch all published scholarships with deadlines for calendar
export async function GET() {
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: {
        isPublished: true,
        deadline: {
          gte: new Date(), // Only future deadlines
        },
      },
      orderBy: {
        deadline: 'asc',
      },
      select: {
        id: true,
        slug: true,
        title: true,
        titleAr: true,
        university: true,
        universityAr: true,
        country: true,
        countryAr: true,
        deadline: true,
        image: true,
        fundingType: true,
        levels: true,
      },
    });

    return NextResponse.json({ scholarships });
  } catch (error) {
    console.error('Failed to fetch calendar scholarships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    );
  }
}
