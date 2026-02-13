import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { recalculateAllPoints } from '@/lib/points';

export const dynamic = 'force-dynamic';

// POST - Recalculate points for all users based on actual data
export async function POST() {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const updated = await recalculateAllPoints();

    return NextResponse.json({
      success: true,
      message: `Recalculated points for ${updated.length} user(s)`,
      updated,
    });
  } catch (error) {
    console.error('Error recalculating points:', error);
    return NextResponse.json(
      { error: 'Failed to recalculate points' },
      { status: 500 }
    );
  }
}
