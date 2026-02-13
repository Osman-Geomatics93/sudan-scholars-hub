import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { sendMaterialReviewNotification } from '@/lib/email';
import { awardPoints, deductPoints, POINT_VALUES } from '@/lib/points';
import { createNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

// PATCH - Approve/reject a past exam
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

    const existingExam = await prisma.pastExam.findUnique({
      where: { id },
      select: { userEmail: true, userName: true, title: true, userId: true },
    });

    const exam = await prisma.pastExam.update({
      where: { id },
      data: {
        status,
        rejectionNote: status === 'REJECTED' ? (rejectionNote || null) : null,
        reviewedAt: new Date(),
      },
    });

    // Award points & create in-app notification on approval/rejection
    if (existingExam?.userId) {
      if (status === 'APPROVED') {
        await awardPoints(existingExam.userId, POINT_VALUES.UPLOAD_APPROVED);
        await createNotification({
          userId: existingExam.userId,
          type: 'MATERIAL_APPROVED',
          title: 'Past Exam Approved',
          message: `Your past exam "${existingExam.title}" has been approved and is now visible to everyone!`,
          relatedId: id,
        });
        await createNotification({
          userId: existingExam.userId,
          type: 'POINTS_EARNED',
          title: 'Points Earned',
          message: `You earned ${POINT_VALUES.UPLOAD_APPROVED} points for your approved past exam!`,
          relatedId: id,
        });
      } else if (status === 'REJECTED') {
        await createNotification({
          userId: existingExam.userId,
          type: 'MATERIAL_REJECTED',
          title: 'Past Exam Rejected',
          message: `Your past exam "${existingExam.title}" was not approved.${rejectionNote ? ` Reason: ${rejectionNote}` : ''}`,
          relatedId: id,
        });
      }
    }

    // Send notification email to the uploader (best-effort)
    let emailSent = false;
    let emailError: string | null = null;

    if (existingExam?.userEmail) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const studyHubUrl = `${baseUrl}/en/study-hub`;
      try {
        await sendMaterialReviewNotification({
          email: existingExam.userEmail,
          userName: existingExam.userName || 'Student',
          materialTitle: existingExam.title,
          status: status as 'APPROVED' | 'REJECTED',
          rejectionNote: status === 'REJECTED' ? rejectionNote : undefined,
          studyHubUrl,
        });
        emailSent = true;
      } catch (err) {
        emailError = err instanceof Error ? err.message : 'Unknown email error';
        console.error('Failed to send exam review notification email:', err);
      }
    } else {
      emailError = 'No uploader email found on this exam';
    }

    return NextResponse.json({ exam, emailSent, emailError });
  } catch (error) {
    console.error('Error updating past exam:', error);
    return NextResponse.json(
      { error: 'Failed to update past exam' },
      { status: 500 }
    );
  }
}

// DELETE - Permanently delete a past exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    const exam = await prisma.pastExam.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    await prisma.pastExam.delete({
      where: { id },
    });

    if (exam?.userId && exam.status === 'APPROVED') {
      await deductPoints(exam.userId, POINT_VALUES.UPLOAD_APPROVED);
    }

    return NextResponse.json({ success: true, message: 'Past exam deleted' });
  } catch (error) {
    console.error('Error deleting past exam:', error);
    return NextResponse.json(
      { error: 'Failed to delete past exam' },
      { status: 500 }
    );
  }
}
