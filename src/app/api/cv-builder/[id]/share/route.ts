import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { shareSettingsSchema } from '@/lib/validations/cv-builder';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/cv-builder/[id]/share
 * Update sharing settings for a resume
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id?: string } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const existing = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true, slug: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = shareSettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { isPublic, slug } = validationResult.data;

    // If custom slug provided, check if it's available
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.resume.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'This URL is already taken' },
          { status: 409 }
        );
      }
    }

    const resume = await prisma.resume.update({
      where: { id },
      data: {
        isPublic,
        ...(slug && { slug }),
      },
      select: {
        id: true,
        slug: true,
        isPublic: true,
      },
    });

    return NextResponse.json({
      resume,
      shareUrl: resume.isPublic ? `/cv-builder/share/${resume.slug}` : null,
    });
  } catch (error) {
    console.error('Error updating share settings:', error);
    return NextResponse.json(
      { error: 'Failed to update share settings' },
      { status: 500 }
    );
  }
}
