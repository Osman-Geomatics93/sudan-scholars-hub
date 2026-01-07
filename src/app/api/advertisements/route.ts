import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - Fetch active advertisements for public display
export async function GET() {
  try {
    const advertisements = await prisma.advertisement.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        title: true,
        titleAr: true,
        imageUrl: true,
        linkUrl: true,
        order: true,
      },
    });

    return NextResponse.json({ advertisements });
  } catch (error) {
    console.error('Failed to fetch advertisements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}
