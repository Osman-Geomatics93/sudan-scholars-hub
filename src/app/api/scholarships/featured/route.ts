import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    return NextResponse.json({ scholarships });
  } catch (error) {
    console.error('Error fetching featured scholarships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured scholarships' },
      { status: 500 }
    );
  }
}
