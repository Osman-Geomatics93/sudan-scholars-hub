import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateResumePDF } from '@/lib/cv-builder/pdf-generator';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/cv-builder/[id]/export
 * Generate and download PDF of resume
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id?: string } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch resume with all sections
    const resume = await prisma.resume.findUnique({
      where: { id },
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

    // Check ownership
    if (resume.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get locale from request headers or body
    const body = await request.json().catch(() => ({}));
    const locale = (body.locale as string) || 'en';

    // Generate PDF (Prisma types are compatible at runtime)
    const pdfBuffer = await generateResumePDF(resume as any, locale);

    // Ensure we have a proper Buffer with data
    if (!pdfBuffer || pdfBuffer.length === 0) {
      console.error('PDF generation returned empty buffer');
      return NextResponse.json(
        { error: 'PDF generation failed - empty buffer' },
        { status: 500 }
      );
    }

    console.log('Generated PDF:', pdfBuffer.length, 'bytes');

    // Update last exported timestamp
    await prisma.resume.update({
      where: { id },
      data: { lastExportedAt: new Date() },
    });

    // Return PDF as downloadable file
    const safeName = resume.fullName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = safeName + '_Resume.pdf';

    // Convert to Uint8Array for proper response handling
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="' + fileName + '"',
        'Content-Length': uint8Array.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error exporting resume:', error);
    return NextResponse.json(
      { error: 'Failed to export resume' },
      { status: 500 }
    );
  }
}
