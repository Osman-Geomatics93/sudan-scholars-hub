import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const { testId } = await params;

    const test = await prisma.ieltsToeflTest.findUnique({
      where: { id: testId },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Increment usage count
    await prisma.ieltsToeflTest.update({
      where: { id: testId },
      data: { usageCount: { increment: 1 } },
    });

    return NextResponse.json({ test });
  } catch (err) {
    console.error('Error fetching test:', err);
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
  }
}
