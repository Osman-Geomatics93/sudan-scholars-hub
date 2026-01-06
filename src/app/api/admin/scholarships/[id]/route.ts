import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';

// Disable caching
export const dynamic = 'force-dynamic';

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

    // Only update fields that are provided
    const updateData: any = {};
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.titleAr !== undefined) updateData.titleAr = body.titleAr;
    if (body.university !== undefined) updateData.university = body.university;
    if (body.universityAr !== undefined) updateData.universityAr = body.universityAr;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.countryAr !== undefined) updateData.countryAr = body.countryAr;
    if (body.countryCode !== undefined) updateData.countryCode = body.countryCode;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.descriptionAr !== undefined) updateData.descriptionAr = body.descriptionAr;
    if (body.eligibility !== undefined) updateData.eligibility = body.eligibility;
    if (body.eligibilityAr !== undefined) updateData.eligibilityAr = body.eligibilityAr;
    if (body.benefits !== undefined) updateData.benefits = body.benefits;
    if (body.benefitsAr !== undefined) updateData.benefitsAr = body.benefitsAr;
    if (body.requirements !== undefined) updateData.requirements = body.requirements;
    if (body.requirementsAr !== undefined) updateData.requirementsAr = body.requirementsAr;
    if (body.howToApply !== undefined) updateData.howToApply = body.howToApply;
    if (body.howToApplyAr !== undefined) updateData.howToApplyAr = body.howToApplyAr;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.durationAr !== undefined) updateData.durationAr = body.durationAr;
    if (body.deadline !== undefined) updateData.deadline = new Date(body.deadline);
    if (body.fundingType !== undefined) updateData.fundingType = body.fundingType;
    if (body.level !== undefined) updateData.level = body.level;
    if (body.field !== undefined) updateData.field = body.field;
    if (body.applicationUrl !== undefined) updateData.applicationUrl = body.applicationUrl;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;

    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: updateData,
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
