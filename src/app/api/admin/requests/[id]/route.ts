import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';
import { createNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

// PATCH - Update request status (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const { status, adminNote } = await request.json();

    if (!status || !['OPEN', 'FULFILLED', 'CLOSED'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be OPEN, FULFILLED, or CLOSED' },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.materialRequest.findUnique({
      where: { id },
      select: { userId: true, title: true, status: true },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const updatedRequest = await prisma.materialRequest.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    // Notify the request creator about status change
    const adminName = (session!.user as { name?: string }).name || 'Admin';
    if (existingRequest.status !== status) {
      const statusMessages: Record<string, string> = {
        FULFILLED: `Your request "${existingRequest.title}" has been marked as fulfilled by ${adminName}.`,
        CLOSED: `Your request "${existingRequest.title}" has been closed by ${adminName}.${adminNote ? ` Note: ${adminNote}` : ''}`,
        OPEN: `Your request "${existingRequest.title}" has been reopened by ${adminName}.`,
      };

      await createNotification({
        userId: existingRequest.userId,
        type: 'REQUEST_FULFILLED',
        title: status === 'FULFILLED' ? 'Request Fulfilled' : status === 'CLOSED' ? 'Request Closed' : 'Request Reopened',
        message: statusMessages[status] || `Request status changed to ${status}`,
        relatedId: id,
      });
    }

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

// DELETE - Delete a request (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    const existingRequest = await prisma.materialRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    await prisma.materialRequest.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
