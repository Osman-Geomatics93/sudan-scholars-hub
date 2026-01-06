import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const scholarship = await prisma.scholarship.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug },
        ],
        isPublished: true,
      },
    });

    if (!scholarship) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ scholarship });
  } catch (error) {
    console.error('Error fetching scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarship' },
      { status: 500 }
    );
  }
}
