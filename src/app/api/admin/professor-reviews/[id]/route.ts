import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { createNotification } from '@/lib/notifications';
import { awardPoints, deductPoints, POINT_VALUES } from '@/lib/points';
import { sendMaterialReviewNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

// PATCH - Approve/reject a professor review
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

    const existingReview = await prisma.professorReview.findUnique({
      where: { id },
      select: { userId: true, professorName: true, user: { select: { email: true, name: true } } },
    });

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const review = await prisma.professorReview.update({
      where: { id },
      data: {
        status,
        rejectionNote: status === 'REJECTED' ? (rejectionNote || null) : null,
        reviewedAt: new Date(),
      },
    });

    // Award points & create in-app notifications
    if (status === 'APPROVED') {
      await awardPoints(existingReview.userId, POINT_VALUES.REVIEW_POSTED);
      await createNotification({
        userId: existingReview.userId,
        type: 'MATERIAL_APPROVED',
        title: 'Review Approved',
        message: `Your review for professor "${existingReview.professorName}" has been approved and is now visible!`,
        relatedId: id,
      });
      await createNotification({
        userId: existingReview.userId,
        type: 'POINTS_EARNED',
        title: 'Points Earned',
        message: `You earned ${POINT_VALUES.REVIEW_POSTED} points for your approved professor review!`,
        relatedId: id,
      });
    } else if (status === 'REJECTED') {
      await createNotification({
        userId: existingReview.userId,
        type: 'MATERIAL_REJECTED',
        title: 'Review Rejected',
        message: `Your review for professor "${existingReview.professorName}" was not approved.${rejectionNote ? ` Reason: ${rejectionNote}` : ''}`,
        relatedId: id,
      });
    }

    // Send email notification (best-effort)
    let emailSent = false;
    let emailError: string | null = null;

    const userEmail = existingReview.user?.email;
    if (userEmail) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const studyHubUrl = `${baseUrl}/en/study-hub`;
      try {
        await sendMaterialReviewNotification({
          email: userEmail,
          userName: existingReview.user?.name || 'Student',
          materialTitle: `Professor review: ${existingReview.professorName}`,
          status: status as 'APPROVED' | 'REJECTED',
          rejectionNote: status === 'REJECTED' ? rejectionNote : undefined,
          studyHubUrl,
        });
        emailSent = true;
      } catch (err) {
        emailError = err instanceof Error ? err.message : 'Unknown email error';
        console.error('Failed to send review notification email:', err);
      }
    } else {
      emailError = 'No user email found';
    }

    return NextResponse.json({ review, emailSent, emailError });
  } catch (error) {
    console.error('Error updating professor review:', error);
    return NextResponse.json(
      { error: 'Failed to update professor review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a professor review (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    const review = await prisma.professorReview.findUnique({
      where: { id },
      select: { userId: true, professorName: true, status: true },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await prisma.professorReview.delete({ where: { id } });

    // Deduct points if the review was approved
    if (review.status === 'APPROVED') {
      await deductPoints(review.userId, POINT_VALUES.REVIEW_POSTED);
    }

    // Notify the review owner
    await createNotification({
      userId: review.userId,
      type: 'MATERIAL_REJECTED',
      title: 'Review Removed',
      message: `Your review for professor "${review.professorName}" has been removed by an administrator.`,
      relatedId: id,
    });

    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
