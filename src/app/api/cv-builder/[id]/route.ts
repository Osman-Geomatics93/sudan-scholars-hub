import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resumeUpdateSchema } from '@/lib/validations/cv-builder';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/cv-builder/[id]
 * Get a specific resume with all sections
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user as { id?: string } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cv-builder/[id]
 * Update a resume
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
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = resumeUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const { personal, education, experience, skills, languages, certifications, projects, awards, ...resumeData } = data;

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (resumeData.title !== undefined) updateData.title = resumeData.title;
    if (resumeData.template !== undefined) updateData.template = resumeData.template;
    if (resumeData.primaryColor !== undefined) updateData.primaryColor = resumeData.primaryColor;
    if (resumeData.summary !== undefined) updateData.summary = resumeData.summary || null;
    if (resumeData.summaryAr !== undefined) updateData.summaryAr = resumeData.summaryAr || null;
    if (resumeData.isPublic !== undefined) updateData.isPublic = resumeData.isPublic;

    // Update personal info if provided
    if (personal) {
      updateData.fullName = personal.fullName;
      updateData.email = personal.email;
      updateData.phone = personal.phone || null;
      updateData.location = personal.location || null;
      updateData.linkedIn = personal.linkedIn || null;
      updateData.website = personal.website || null;
    }

    // Update resume base data
    await prisma.resume.update({
      where: { id },
      data: updateData,
    });

    // Update education if provided
    if (education !== undefined) {
      await prisma.resumeEducation.deleteMany({ where: { resumeId: id } });
      if (education.length > 0) {
        await prisma.resumeEducation.createMany({
          data: education.map((edu, index) => ({
            resumeId: id,
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            location: edu.location || null,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            current: edu.current,
            gpa: edu.gpa || null,
            achievements: edu.achievements || null,
            order: index,
          })),
        });
      }
    }

    // Update experience if provided
    if (experience !== undefined) {
      await prisma.resumeExperience.deleteMany({ where: { resumeId: id } });
      if (experience.length > 0) {
        await prisma.resumeExperience.createMany({
          data: experience.map((exp, index) => ({
            resumeId: id,
            company: exp.company,
            position: exp.position,
            location: exp.location || null,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            current: exp.current,
            description: exp.description || null,
            order: index,
          })),
        });
      }
    }

    // Update skills if provided
    if (skills !== undefined) {
      await prisma.resumeSkill.deleteMany({ where: { resumeId: id } });
      if (skills.length > 0) {
        await prisma.resumeSkill.createMany({
          data: skills.map((skill, index) => ({
            resumeId: id,
            name: skill.name,
            level: skill.level || null,
            category: skill.category || null,
            order: index,
          })),
        });
      }
    }

    // Update languages if provided
    if (languages !== undefined) {
      await prisma.resumeLanguage.deleteMany({ where: { resumeId: id } });
      if (languages.length > 0) {
        await prisma.resumeLanguage.createMany({
          data: languages.map((lang, index) => ({
            resumeId: id,
            language: lang.language,
            proficiency: lang.proficiency,
            order: index,
          })),
        });
      }
    }

    // Update certifications if provided
    if (certifications !== undefined) {
      await prisma.resumeCertification.deleteMany({ where: { resumeId: id } });
      if (certifications.length > 0) {
        await prisma.resumeCertification.createMany({
          data: certifications.map((cert, index) => ({
            resumeId: id,
            name: cert.name,
            issuer: cert.issuer,
            issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            credentialId: cert.credentialId || null,
            url: cert.url || null,
            order: index,
          })),
        });
      }
    }

    // Update projects if provided
    if (projects !== undefined) {
      await prisma.resumeProject.deleteMany({ where: { resumeId: id } });
      if (projects.length > 0) {
        await prisma.resumeProject.createMany({
          data: projects.map((project, index) => ({
            resumeId: id,
            name: project.name,
            description: project.description || null,
            technologies: project.technologies || [],
            url: project.url || null,
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            current: project.current,
            order: index,
          })),
        });
      }
    }

    // Update awards if provided
    if (awards !== undefined) {
      await prisma.resumeAward.deleteMany({ where: { resumeId: id } });
      if (awards.length > 0) {
        await prisma.resumeAward.createMany({
          data: awards.map((award, index) => ({
            resumeId: id,
            title: award.title,
            issuer: award.issuer,
            date: award.date ? new Date(award.date) : null,
            description: award.description || null,
            order: index,
          })),
        });
      }
    }

    // Fetch updated resume
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

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cv-builder/[id]
 * Delete a resume
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.resume.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
