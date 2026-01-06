import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';

// GET single scholarship by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;

    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error('Failed to fetch scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarship' },
      { status: 500 }
    );
  }
}

// PUT update scholarship
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if scholarship exists
    const existing = await prisma.scholarship.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed to an existing one
    if (body.slug !== existing.slug) {
      const slugExists = await prisma.scholarship.findUnique({
        where: { slug: body.slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: {
        slug: body.slug,
        title: body.title,
        titleAr: body.titleAr,
        university: body.university,
        universityAr: body.universityAr,
        country: body.country,
        countryAr: body.countryAr,
        countryCode: body.countryCode,
        description: body.description,
        descriptionAr: body.descriptionAr,
        eligibility: body.eligibility,
        eligibilityAr: body.eligibilityAr,
        benefits: body.benefits,
        benefitsAr: body.benefitsAr,
        requirements: body.requirements,
        requirementsAr: body.requirementsAr,
        howToApply: body.howToApply,
        howToApplyAr: body.howToApplyAr,
        duration: body.duration,
        durationAr: body.durationAr,
        deadline: new Date(body.deadline),
        fundingType: body.fundingType,
        level: body.level,
        field: body.field,
        applicationUrl: body.applicationUrl,
        image: body.image,
        isFeatured: body.isFeatured,
        isPublished: body.isPublished,
      },
    });

    return NextResponse.json(scholarship);
  } catch (error) {
    console.error('Failed to update scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to update scholarship' },
      { status: 500 }
    );
  }
}

// DELETE scholarship
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;

    // Check if scholarship exists
    const existing = await prisma.scholarship.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    await prisma.scholarship.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error('Failed to delete scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to delete scholarship' },
      { status: 500 }
    );
  }
}
