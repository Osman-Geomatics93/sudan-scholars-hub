import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// POST - Toggle vote on a professor review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: reviewId } = await params;
    const body = await request.json();

    // Resolve user from DB by email (session.user.id may be an Admin ID, not a User ID)
    const userEmail = session!.user?.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'No email in session' }, { status: 400 });
    }
    const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!dbUser) {
      return NextResponse.json(
        { error: 'Only regular users can vote on reviews. Admin accounts cannot vote.' },
        { status: 403 }
      );
    }
    const userId = dbUser.id;
    const { isHelpful } = body;

    if (typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'isHelpful must be a boolean' },
        { status: 400 }
      );
    }

    // Verify review exists
    const review = await prisma.professorReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check existing vote
    const existingVote = await prisma.professorReviewVote.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    if (existingVote) {
      if (existingVote.isHelpful === isHelpful) {
        // Same vote again → remove (toggle off)
        await prisma.professorReviewVote.delete({
          where: { id: existingVote.id },
        });
      } else {
        // Different vote → switch
        await prisma.professorReviewVote.update({
          where: { id: existingVote.id },
          data: { isHelpful },
        });
      }
    } else {
      // No existing vote → create
      await prisma.professorReviewVote.create({
        data: { userId, reviewId, isHelpful },
      });
    }

    // Recalculate counts
    const [helpfulCount, unhelpfulCount] = await Promise.all([
      prisma.professorReviewVote.count({ where: { reviewId, isHelpful: true } }),
      prisma.professorReviewVote.count({ where: { reviewId, isHelpful: false } }),
    ]);

    await prisma.professorReview.update({
      where: { id: reviewId },
      data: { helpfulCount, unhelpfulCount },
    });

    // Get user's current vote state
    const userVote = await prisma.professorReviewVote.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    return NextResponse.json({
      helpfulCount,
      unhelpfulCount,
      userVote: userVote ? userVote.isHelpful : null,
    });
  } catch (error) {
    console.error('Error voting on professor review:', error);
    return NextResponse.json(
      { error: 'Failed to vote on review' },
      { status: 500 }
    );
  }
}
