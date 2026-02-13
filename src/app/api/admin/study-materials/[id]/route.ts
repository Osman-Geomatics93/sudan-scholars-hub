import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { sendMaterialReviewNotification } from '@/lib/email';
import { awardPoints, deductPoints, POINT_VALUES } from '@/lib/points';
import { createNotification } from '@/lib/notifications';

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

    // Fetch the material first to get uploader info for the notification email
    const existingMaterial = await prisma.studyMaterial.findUnique({
      where: { id },
      select: { userEmail: true, userName: true, title: true, userId: true },
    });

    const material = await prisma.studyMaterial.update({
      where: { id },
      data: {
        status,
        rejectionNote: status === 'REJECTED' ? (rejectionNote || null) : null,
        reviewedAt: new Date(),
      },
    });

    // Award points & create in-app notification on approval/rejection
    if (existingMaterial?.userId) {
      if (status === 'APPROVED') {
        await awardPoints(existingMaterial.userId, POINT_VALUES.UPLOAD_APPROVED);
        await createNotification({
          userId: existingMaterial.userId,
          type: 'MATERIAL_APPROVED',
          title: 'Material Approved',
          message: `Your material "${existingMaterial.title}" has been approved and is now visible to everyone!`,
          relatedId: id,
        });
        await createNotification({
          userId: existingMaterial.userId,
          type: 'POINTS_EARNED',
          title: 'Points Earned',
          message: `You earned ${POINT_VALUES.UPLOAD_APPROVED} points for your approved material!`,
          relatedId: id,
        });
      } else if (status === 'REJECTED') {
        await createNotification({
          userId: existingMaterial.userId,
          type: 'MATERIAL_REJECTED',
          title: 'Material Rejected',
          message: `Your material "${existingMaterial.title}" was not approved.${rejectionNote ? ` Reason: ${rejectionNote}` : ''}`,
          relatedId: id,
        });
      }
    }

    // Send notification email to the uploader (best-effort)
    let emailSent = false;
    let emailError: string | null = null;

    if (existingMaterial?.userEmail) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const studyHubUrl = `${baseUrl}/en/study-hub`;
      try {
        await sendMaterialReviewNotification({
          email: existingMaterial.userEmail,
          userName: existingMaterial.userName || 'Student',
          materialTitle: existingMaterial.title,
          status: status as 'APPROVED' | 'REJECTED',
          rejectionNote: status === 'REJECTED' ? rejectionNote : undefined,
          studyHubUrl,
        });
        emailSent = true;
      } catch (err) {
        emailError = err instanceof Error ? err.message : 'Unknown email error';
        console.error('Failed to send material review notification email:', err);
      }
    } else {
      emailError = 'No uploader email found on this material';
    }

    return NextResponse.json({ material, emailSent, emailError });
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

    const material = await prisma.studyMaterial.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    await prisma.studyMaterial.delete({
      where: { id },
    });

    if (material?.userId && material.status === 'APPROVED') {
      await deductPoints(material.userId, POINT_VALUES.UPLOAD_APPROVED);
    }

    return NextResponse.json({ success: true, message: 'Study material deleted' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    return NextResponse.json(
      { error: 'Failed to delete study material' },
      { status: 500 }
    );
  }
}
