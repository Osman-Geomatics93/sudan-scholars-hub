import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-utils';

// Disable caching
export const dynamic = 'force-dynamic';

// GET single advertisement by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    const advertisement = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(advertisement);
  } catch (error) {
    console.error('Failed to fetch advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisement' },
      { status: 500 }
    );
  }
}

// PUT update advertisement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if advertisement exists
    const existing = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    // Only update fields that are provided
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.titleAr !== undefined) updateData.titleAr = body.titleAr;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.linkUrl !== undefined) updateData.linkUrl = body.linkUrl;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.order !== undefined) updateData.order = body.order;

    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(advertisement);
  } catch (error) {
    console.error('Failed to update advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}

// DELETE advertisement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    // Check if advertisement exists
    const existing = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    await prisma.advertisement.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Failed to delete advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to delete advertisement' },
      { status: 500 }
    );
  }
}
