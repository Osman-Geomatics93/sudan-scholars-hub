import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { createNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

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
      select: { userId: true, professorName: true },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await prisma.professorReview.delete({ where: { id } });

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
