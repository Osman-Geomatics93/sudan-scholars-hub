import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const { attemptId } = await params;

    const attempt = await prisma.ieltsToeflAttempt.findUnique({
      where: { id: attemptId },
      include: {
        test: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    if (attempt.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ attempt });
  } catch (err) {
    console.error('Error fetching attempt:', err);
    return NextResponse.json({ error: 'Failed to fetch attempt' }, { status: 500 });
  }
}
