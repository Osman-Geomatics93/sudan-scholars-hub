import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { awardPoints, POINT_VALUES } from '@/lib/points';
import { createNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

// PATCH - Fulfill or close a material request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['FULFILLED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ error: 'Status must be FULFILLED or CLOSED' }, { status: 400 });
    }

    const userId = (session!.user as { id: string }).id;

    const existingRequest = await prisma.materialRequest.findUnique({
      where: { id },
      select: { userId: true, title: true },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { status };
    if (status === 'FULFILLED') {
      updateData.fulfilledBy = userId;
    }

    const updatedRequest = await prisma.materialRequest.update({
      where: { id },
      data: updateData,
    });

    // Award points and notify on fulfillment
    if (status === 'FULFILLED') {
      await awardPoints(userId, POINT_VALUES.REQUEST_FULFILLED);

      // Notify the requester
      if (existingRequest.userId !== userId) {
        const fulfillerName = (session!.user as { name?: string }).name || 'Someone';
        await createNotification({
          userId: existingRequest.userId,
          type: 'REQUEST_FULFILLED',
          title: 'Request Fulfilled',
          message: `${fulfillerName} fulfilled your request "${existingRequest.title}"`,
          relatedId: id,
        });
      }
    }

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
