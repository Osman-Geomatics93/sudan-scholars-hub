import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Track view or download on a past exam
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (!action || !['view', 'download'].includes(action)) {
      return NextResponse.json({ error: 'action must be view or download' }, { status: 400 });
    }

    const field = action === 'view' ? 'viewCount' : 'downloadCount';

    await prisma.pastExam.update({
      where: { id },
      data: { [field]: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking exam action:', error);
    return NextResponse.json({ error: 'Failed to track action' }, { status: 500 });
  }
}
