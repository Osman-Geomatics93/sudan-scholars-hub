import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';

// Disable caching
export const dynamic = 'force-dynamic';

// GET single university admission by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;

    const admission = await prisma.universityAdmission.findUnique({
      where: { id },
    });

    if (!admission) {
      return NextResponse.json(
        { error: 'University admission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(admission);
  } catch (error) {
    console.error('Failed to fetch university admission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university admission' },
      { status: 500 }
    );
  }
}

// PUT update university admission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if admission exists
    const existing = await prisma.universityAdmission.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'University admission not found' },
        { status: 404 }
      );
    }

    // Only update fields that are provided
    const updateData: any = {};

    if (body.universityNameEn !== undefined) updateData.universityNameEn = body.universityNameEn;
    if (body.universityNameTr !== undefined) updateData.universityNameTr = body.universityNameTr;
    if (body.universityNameAr !== undefined) updateData.universityNameAr = body.universityNameAr;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.cityAr !== undefined) updateData.cityAr = body.cityAr;
    if (body.degree !== undefined) updateData.degree = body.degree;
    if (body.specialization !== undefined) updateData.specialization = body.specialization || null;
    if (body.registrationStart !== undefined) updateData.registrationStart = new Date(body.registrationStart);
    if (body.registrationEnd !== undefined) updateData.registrationEnd = new Date(body.registrationEnd);
    if (body.resultsDate !== undefined) updateData.resultsDate = new Date(body.resultsDate);
    if (body.acceptedCertificates !== undefined) updateData.acceptedCertificates = body.acceptedCertificates;
    if (body.detailsUrl !== undefined) updateData.detailsUrl = body.detailsUrl;
    if (body.applicationType !== undefined) updateData.applicationType = body.applicationType;
    if (body.localRanking !== undefined) updateData.localRanking = body.localRanking;
    if (body.applicationFee !== undefined) updateData.applicationFee = body.applicationFee || null;
    if (body.applicationFeeCurrency !== undefined) updateData.applicationFeeCurrency = body.applicationFeeCurrency || null;
    if (body.isFreeApplication !== undefined) updateData.isFreeApplication = body.isFreeApplication;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const admission = await prisma.universityAdmission.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(admission);
  } catch (error) {
    console.error('Failed to update university admission:', error);
    return NextResponse.json(
      { error: 'Failed to update university admission' },
      { status: 500 }
    );
  }
}

// DELETE university admission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const { id } = await params;

    // Check if admission exists
    const existing = await prisma.universityAdmission.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'University admission not found' },
        { status: 404 }
      );
    }

    await prisma.universityAdmission.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'University admission deleted successfully' });
  } catch (error) {
    console.error('Failed to delete university admission:', error);
    return NextResponse.json(
      { error: 'Failed to delete university admission' },
      { status: 500 }
    );
  }
}
