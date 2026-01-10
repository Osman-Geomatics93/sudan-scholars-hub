import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-utils';

// Disable caching
export const dynamic = 'force-dynamic';

// GET single university by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    const university = await prisma.university.findUnique({
      where: { id },
    });

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(university);
  } catch (error) {
    console.error('Failed to fetch university:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university' },
      { status: 500 }
    );
  }
}

// PUT update university
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if university exists
    const existing = await prisma.university.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed to an existing one
    if (body.name && body.name !== existing.name) {
      const nameExists = await prisma.university.findUnique({
        where: { name: body.name },
      });
      if (nameExists) {
        return NextResponse.json(
          { error: 'A university with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Only update fields that are provided
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.countryAr !== undefined) updateData.countryAr = body.countryAr;
    if (body.qsRank !== undefined) updateData.qsRank = body.qsRank ? parseInt(body.qsRank) : null;
    if (body.timesRank !== undefined) updateData.timesRank = body.timesRank ? parseInt(body.timesRank) : null;
    if (body.logo !== undefined) updateData.logo = body.logo || null;
    if (body.website !== undefined) updateData.website = body.website || null;

    const university = await prisma.university.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(university);
  } catch (error) {
    console.error('Failed to update university:', error);
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    );
  }
}

// DELETE university
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    // Check if university exists
    const existing = await prisma.university.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    await prisma.university.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'University deleted successfully' });
  } catch (error) {
    console.error('Failed to delete university:', error);
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    );
  }
}
