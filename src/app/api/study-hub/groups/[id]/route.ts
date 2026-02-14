import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// PATCH - Update a study group (owner only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const group = await prisma.studyGroup.findUnique({ where: { id } });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.createdBy !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only edit your own groups' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, platform, chatLink } = body;

    if (platform && !['whatsapp', 'telegram', 'discord'].includes(platform)) {
      return NextResponse.json({ error: 'Platform must be whatsapp, telegram, or discord' }, { status: 400 });
    }

    const updated = await prisma.studyGroup.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(platform !== undefined && { platform }),
        ...(chatLink !== undefined && { chatLink }),
      },
    });

    return NextResponse.json({ group: updated, message: 'Group updated successfully' });
  } catch (error) {
    console.error('Error updating study group:', error);
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

// DELETE - Delete a study group (owner or admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;
    const isAdmin = (session!.user as { isAdmin?: boolean }).isAdmin === true;
    const userRole = (session!.user as { role?: string }).role;

    const group = await prisma.studyGroup.findUnique({ where: { id } });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.createdBy !== userId && !isAdmin && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - You can only delete your own groups' }, { status: 403 });
    }

    await prisma.studyGroup.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    console.error('Error deleting study group:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}
