import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Update saved scholarship status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    // Verify ownership
    const savedScholarship = await prisma.savedScholarship.findUnique({
      where: { id },
    });

    if (!savedScholarship) {
      return NextResponse.json(
        { error: 'Saved scholarship not found' },
        { status: 404 }
      );
    }

    if (savedScholarship.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update
    const updated = await prisma.savedScholarship.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        scholarship: true,
      },
    });

    return NextResponse.json({
      savedScholarship: updated,
      message: 'Status updated successfully',
    });
  } catch (error) {
    console.error('Error updating saved scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to update saved scholarship' },
      { status: 500 }
    );
  }
}

// Remove saved scholarship
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = params;

    // Verify ownership
    const savedScholarship = await prisma.savedScholarship.findUnique({
      where: { id },
    });

    if (!savedScholarship) {
      return NextResponse.json(
        { error: 'Saved scholarship not found' },
        { status: 404 }
      );
    }

    if (savedScholarship.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete
    await prisma.savedScholarship.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Scholarship removed from saved list',
    });
  } catch (error) {
    console.error('Error removing saved scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to remove saved scholarship' },
      { status: 500 }
    );
  }
}
