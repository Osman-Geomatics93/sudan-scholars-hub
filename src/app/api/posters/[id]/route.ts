import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - Fetch single poster by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
            country: true,
            countryAr: true,
            university: true,
            universityAr: true,
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

    // Don't return inactive posters to public
    if (!poster.isActive) {
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
