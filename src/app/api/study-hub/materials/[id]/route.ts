import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { deductPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// PATCH - Update a material (owner only, resets status to PENDING for re-review)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const material = await prisma.studyMaterial.findUnique({ where: { id } });

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    if (material.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only edit your own materials' }, { status: 403 });
    }

    const body = await request.json();
    const { title, type, url, description, subject, facultyId, specialtyId, uploaderRole } = body;

    const updated = await prisma.studyMaterial.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(url !== undefined && { url }),
        ...(description !== undefined && { description: description || null }),
        ...(subject !== undefined && { subject }),
        ...(facultyId !== undefined && { facultyId: facultyId || null }),
        ...(specialtyId !== undefined && { specialtyId: specialtyId || null }),
        ...(uploaderRole !== undefined && { uploaderRole }),
        status: 'PENDING', // Reset to pending for re-review after edit
        editedAt: new Date(),
        rejectionNote: null,
        reviewedAt: null,
      },
    });

    return NextResponse.json({ material: updated, message: 'Material updated and resubmitted for review' });
  } catch (error) {
    console.error('Error updating study material:', error);
    return NextResponse.json({ error: 'Failed to update study material' }, { status: 500 });
  }
}

// DELETE - Delete a material (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const material = await prisma.studyMaterial.findUnique({ where: { id } });

    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    if (material.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only delete your own materials' }, { status: 403 });
    }

    const wasApproved = material.status === 'APPROVED';

    await prisma.studyMaterial.delete({ where: { id } });

    if (wasApproved) {
      await deductPoints(userId, POINT_VALUES.UPLOAD_APPROVED);
    }

    return NextResponse.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    return NextResponse.json({ error: 'Failed to delete study material' }, { status: 500 });
  }
}
