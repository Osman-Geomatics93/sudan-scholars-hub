import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// PATCH - Approve/reject a study material
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    const { status, rejectionNote } = body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be APPROVED or REJECTED' },
        { status: 400 }
      );
    }

    const material = await prisma.studyMaterial.update({
      where: { id },
      data: {
        status,
        rejectionNote: status === 'REJECTED' ? (rejectionNote || null) : null,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ material });
  } catch (error) {
    console.error('Error updating study material:', error);
    return NextResponse.json(
      { error: 'Failed to update study material' },
      { status: 500 }
    );
  }
}

// DELETE - Permanently delete a study material
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    await prisma.studyMaterial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Study material deleted' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    return NextResponse.json(
      { error: 'Failed to delete study material' },
      { status: 500 }
    );
  }
}
