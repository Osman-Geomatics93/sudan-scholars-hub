import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resumeCreateSchema } from '@/lib/validations/cv-builder';
import { nanoid } from 'nanoid';

/**
 * GET /api/cv-builder
 * List all resumes for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as { id?: string; isAdmin?: boolean } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isAdmin) {
      return NextResponse.json({ error: 'Admin users cannot use CV Builder' }, { status: 403 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        fullName: true,
        template: true,
        isPublic: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            education: true,
            experience: true,
            skills: true,
          },
        },
      },
    });

    return NextResponse.json({
      resumes,
      totalCount: resumes.length,
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cv-builder
 * Create a new resume
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as { id?: string; isAdmin?: boolean } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isAdmin) {
      return NextResponse.json({ error: 'Admin users cannot use CV Builder' }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = resumeCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const { personal, education, experience, skills, languages, certifications, projects, awards, ...resumeData } = data;

    // Generate unique slug
    const slugBase = personal.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${slugBase}-${nanoid(8)}`;

    // Create resume with all related data
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        slug,
        title: resumeData.title || 'My Resume',
        template: resumeData.template || 'modern',
        primaryColor: resumeData.primaryColor || '#2563eb',
        summary: resumeData.summary || null,
        summaryAr: resumeData.summaryAr || null,
        fullName: personal.fullName,
        email: personal.email,
        phone: personal.phone || null,
        location: personal.location || null,
        linkedIn: personal.linkedIn || null,
        website: personal.website || null,
        education: education && education.length > 0 ? {
          create: education.map((edu, index) => ({
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
        } : undefined,
        experience: experience && experience.length > 0 ? {
          create: experience.map((exp, index) => ({
            company: exp.company,
            position: exp.position,
            location: exp.location || null,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            current: exp.current,
            description: exp.description || null,
            order: index,
          })),
        } : undefined,
        skills: skills && skills.length > 0 ? {
          create: skills.map((skill, index) => ({
            name: skill.name,
            level: skill.level || null,
            category: skill.category || null,
            order: index,
          })),
        } : undefined,
        languages: languages && languages.length > 0 ? {
          create: languages.map((lang, index) => ({
            language: lang.language,
            proficiency: lang.proficiency,
            order: index,
          })),
        } : undefined,
        certifications: certifications && certifications.length > 0 ? {
          create: certifications.map((cert, index) => ({
            name: cert.name,
            issuer: cert.issuer,
            issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            credentialId: cert.credentialId || null,
            url: cert.url || null,
            order: index,
          })),
        } : undefined,
        projects: projects && projects.length > 0 ? {
          create: projects.map((project, index) => ({
            name: project.name,
            description: project.description || null,
            technologies: project.technologies || [],
            url: project.url || null,
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            current: project.current,
            order: index,
          })),
        } : undefined,
        awards: awards && awards.length > 0 ? {
          create: awards.map((award, index) => ({
            title: award.title,
            issuer: award.issuer,
            date: award.date ? new Date(award.date) : null,
            description: award.description || null,
            order: index,
          })),
        } : undefined,
      },
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

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
