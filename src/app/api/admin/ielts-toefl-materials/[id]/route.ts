import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { sendMaterialReviewNotification } from '@/lib/email';
import { awardPoints, deductPoints, POINT_VALUES } from '@/lib/points';
import { createNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

// PATCH - Approve/reject an IELTS/TOEFL material
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

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be approved or rejected' },
        { status: 400 }
      );
    }

    const existingMaterial = await prisma.ieltsToeflMaterial.findUnique({
      where: { id },
      select: { userEmail: true, userName: true, title: true, userId: true },
    });

    if (!existingMaterial) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    const material = await prisma.ieltsToeflMaterial.update({
      where: { id },
      data: {
        status,
      },
    });

    // Award points & create in-app notification
    if (existingMaterial.userId) {
      if (status === 'approved') {
        await awardPoints(existingMaterial.userId, POINT_VALUES.UPLOAD_APPROVED);
        await createNotification({
          userId: existingMaterial.userId,
          type: 'MATERIAL_APPROVED',
          title: 'IELTS/TOEFL Material Approved',
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
      } else if (status === 'rejected') {
        await createNotification({
          userId: existingMaterial.userId,
          type: 'MATERIAL_REJECTED',
          title: 'IELTS/TOEFL Material Rejected',
          message: `Your material "${existingMaterial.title}" was not approved.${rejectionNote ? ` Reason: ${rejectionNote}` : ''}`,
          relatedId: id,
        });
      }
    }

    // Send notification email (best-effort)
    let emailSent = false;
    let emailError: string | null = null;

    if (existingMaterial.userEmail) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const studyHubUrl = `${baseUrl}/en/study-hub`;
      try {
        await sendMaterialReviewNotification({
          email: existingMaterial.userEmail,
          userName: existingMaterial.userName || 'Student',
          materialTitle: existingMaterial.title,
          status: status.toUpperCase() as 'APPROVED' | 'REJECTED',
          rejectionNote: status === 'rejected' ? rejectionNote : undefined,
          studyHubUrl,
        });
        emailSent = true;
      } catch (err) {
        emailError = err instanceof Error ? err.message : 'Unknown email error';
        console.error('Failed to send IELTS/TOEFL material review email:', err);
      }
    } else {
      emailError = 'No uploader email found on this material';
    }

    return NextResponse.json({ material, emailSent, emailError });
  } catch (error) {
    console.error('Error updating IELTS/TOEFL material:', error);
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    );
  }
}

// DELETE - Permanently delete an IELTS/TOEFL material
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    const material = await prisma.ieltsToeflMaterial.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    await prisma.ieltsToeflMaterial.delete({
      where: { id },
    });

    if (material?.userId && material.status === 'approved') {
      await deductPoints(material.userId, POINT_VALUES.UPLOAD_APPROVED);
    }

    return NextResponse.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    console.error('Error deleting IELTS/TOEFL material:', error);
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}
