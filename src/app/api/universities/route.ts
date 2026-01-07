import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic since we use searchParams
export const dynamic = 'force-dynamic';

// GET - Fetch university by name or get all universities
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');

    if (name) {
      // Fetch single university by name
      const university = await prisma.university.findUnique({
        where: { name },
        select: {
          id: true,
          name: true,
          nameAr: true,
          country: true,
          countryAr: true,
          qsRank: true,
          timesRank: true,
          logo: true,
          website: true,
        },
      });

      if (!university) {
        return NextResponse.json({ university: null });
      }

      return NextResponse.json({ university });
    }

    // Fetch all universities (for rankings page or dropdown)
    const universities = await prisma.university.findMany({
      orderBy: { qsRank: 'asc' },
      select: {
        id: true,
        name: true,
        nameAr: true,
        country: true,
        countryAr: true,
        qsRank: true,
        timesRank: true,
        logo: true,
      },
    });

    return NextResponse.json({ universities });
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}
