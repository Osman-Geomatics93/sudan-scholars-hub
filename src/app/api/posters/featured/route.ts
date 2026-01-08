import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - Fetch featured posters for homepage
export async function GET() {
  try {
    const posters = await prisma.poster.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 6, // Limit to 6 featured posters
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
    console.error('Failed to fetch featured posters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured posters' },
      { status: 500 }
    );
  }
}
