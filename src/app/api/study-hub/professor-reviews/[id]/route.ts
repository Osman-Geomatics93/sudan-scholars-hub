import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// PATCH - Update a professor review (owner only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const review = await prisma.professorReview.findUnique({ where: { id } });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only edit your own reviews' }, { status: 403 });
    }

    const body = await request.json();
    const { professorName, universityId, universityName, courseName, rating, difficulty, wouldTakeAgain, comment, tags, isAnonymous } = body;

    const updated = await prisma.professorReview.update({
      where: { id },
      data: {
        ...(professorName !== undefined && { professorName }),
        ...(universityId !== undefined && { universityId }),
        ...(universityName !== undefined && { universityName }),
        ...(courseName !== undefined && { courseName }),
        ...(rating !== undefined && { rating }),
        ...(difficulty !== undefined && { difficulty }),
        ...(wouldTakeAgain !== undefined && { wouldTakeAgain }),
        ...(comment !== undefined && { comment: comment || null }),
        ...(tags !== undefined && { tags }),
        ...(isAnonymous !== undefined && { isAnonymous }),
        ...(isAnonymous !== undefined && { userName: isAnonymous ? null : (session!.user as { name?: string | null }).name || null }),
        // Reset to PENDING so edited reviews go through moderation again
        status: 'PENDING',
        rejectionNote: null,
        reviewedAt: null,
      },
    });

    return NextResponse.json({ review: updated, message: 'Review updated and is pending admin approval.' });
  } catch (error) {
    console.error('Error updating professor review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE - Delete a professor review (owner or admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;
    const userRole = (session!.user as { role?: string; isAdmin?: boolean }).role;
    const isAdmin = (session!.user as { isAdmin?: boolean }).isAdmin === true;

    const review = await prisma.professorReview.findUnique({ where: { id } });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (review.userId !== userId && userRole !== 'ADMIN' && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden - You can only delete your own reviews' }, { status: 403 });
    }

    await prisma.professorReview.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting professor review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
