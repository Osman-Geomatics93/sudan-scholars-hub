import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/cv-builder/public/[slug]
 * Get a public resume by slug (no auth required)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const resume = await prisma.resume.findUnique({
      where: { slug },
      include: {
        education: { orderBy: { order: 'asc' } },
        experience: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        languages: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
        awards: { orderBy: { order: 'asc' } },
      },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Check if resume is public
    if (!resume.isPublic) {
      return NextResponse.json(
        { error: 'This resume is not publicly available' },
        { status: 403 }
      );
    }

    // Increment view count
    await prisma.resume.update({
      where: { id: resume.id },
      data: { viewCount: { increment: 1 } },
    });

    // Remove sensitive fields
    const { userId, ...publicResume } = resume;

    return NextResponse.json({ resume: publicResume });
  } catch (error) {
    console.error('Error fetching public resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}
