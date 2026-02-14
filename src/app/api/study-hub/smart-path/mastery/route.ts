import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { recalculateMastery } from '@/lib/smart-path/mastery';

export const dynamic = 'force-dynamic';

// GET - Get mastery breakdown (lazy recalculate if stale >1hr)
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    // Check if mastery data is stale (>1 hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const existing = await prisma.topicMastery.findMany({
      where: { userId },
      orderBy: { masteryPct: 'desc' },
    });

    const isStale = existing.length === 0 ||
      existing.some((m) => m.updatedAt < oneHourAgo);

    if (isStale) {
      const updated = await recalculateMastery(userId);
      return NextResponse.json({ mastery: updated });
    }

    return NextResponse.json({ mastery: existing });
  } catch (err) {
    console.error('Error fetching mastery:', err);
    return NextResponse.json({ error: 'Failed to fetch mastery data' }, { status: 500 });
  }
}
