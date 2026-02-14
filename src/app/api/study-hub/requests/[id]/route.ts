import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAdmin } from '@/lib/auth-utils';
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

    // Only the creator can close their own request
    if (status === 'CLOSED' && existingRequest.userId !== userId) {
      return NextResponse.json({ error: 'Only the request creator can close it' }, { status: 403 });
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

// PUT - Edit a material request (only by creator, only if still OPEN)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const { title, description, subject } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const userId = (session!.user as { id: string }).id;

    const existingRequest = await prisma.materialRequest.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (existingRequest.userId !== userId) {
      return NextResponse.json({ error: 'You can only edit your own requests' }, { status: 403 });
    }

    if (existingRequest.status !== 'OPEN') {
      return NextResponse.json({ error: 'Can only edit open requests' }, { status: 400 });
    }

    const updatedRequest = await prisma.materialRequest.update({
      where: { id },
      data: {
        title,
        description: description || null,
        subject: subject || null,
      },
    });

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error('Error editing request:', error);
    return NextResponse.json({ error: 'Failed to edit request' }, { status: 500 });
  }
}

// DELETE - Delete a material request (by creator or admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;
    const userRole = (session!.user as { role?: string }).role;

    const existingRequest = await prisma.materialRequest.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Only creator or admin can delete
    if (existingRequest.userId !== userId && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized to delete this request' }, { status: 403 });
    }

    await prisma.materialRequest.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
