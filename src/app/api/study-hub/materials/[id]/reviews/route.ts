import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { awardPoints, POINT_VALUES } from '@/lib/points';
import { createNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

// GET - List reviews for a material
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reviews = await prisma.materialReview.findMany({
      where: { materialId: id },
      include: {
        user: { select: { id: true, name: true, image: true, badge: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const material = await prisma.studyMaterial.findUnique({
      where: { id },
      select: { averageRating: true, reviewCount: true },
    });

    return NextResponse.json({
      reviews,
      averageRating: material?.averageRating || 0,
      reviewCount: material?.reviewCount || 0,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST - Create or update a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: materialId } = await params;
    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const userId = (session!.user as { id: string }).id;

    // Check if user already reviewed
    const existing = await prisma.materialReview.findUnique({
      where: { userId_materialId: { userId, materialId } },
    });

    if (existing) {
      // Update existing review
      await prisma.materialReview.update({
        where: { id: existing.id },
        data: { rating, comment: comment || null },
      });
    } else {
      // Create new review
      await prisma.materialReview.create({
        data: { userId, materialId, rating, comment: comment || null },
      });

      // Award points for posting a review
      await awardPoints(userId, POINT_VALUES.REVIEW_POSTED);
    }

    // Recalculate average rating
    const agg = await prisma.materialReview.aggregate({
      where: { materialId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const material = await prisma.studyMaterial.update({
      where: { id: materialId },
      data: {
        averageRating: Math.round((agg._avg.rating || 0) * 10) / 10,
        reviewCount: agg._count.rating,
      },
      select: { userId: true, title: true },
    });

    // Notify material owner about the new review (if not self-review)
    if (material.userId && material.userId !== userId) {
      const reviewerName = (session!.user as { name?: string }).name || 'Someone';
      await createNotification({
        userId: material.userId,
        type: 'NEW_REVIEW',
        title: 'New Review',
        message: `${reviewerName} rated your material "${material.title}" ${rating}/5`,
        relatedId: materialId,
      });

      // Award points for high rating received
      if (rating >= 4) {
        await awardPoints(material.userId, POINT_VALUES.HIGH_RATING_RECEIVED);
      }
    }

    return NextResponse.json({
      success: true,
      averageRating: agg._avg.rating || 0,
      reviewCount: agg._count.rating,
    });
  } catch (error) {
    console.error('Error posting review:', error);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}
