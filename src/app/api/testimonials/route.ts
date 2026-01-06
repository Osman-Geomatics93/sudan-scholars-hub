import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Disable caching for this route
export const dynamic = 'force-dynamic';

// GET - List published testimonials (public endpoint)
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
