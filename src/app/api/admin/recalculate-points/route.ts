import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { recalculateAllPoints } from '@/lib/points';

export const dynamic = 'force-dynamic';

// POST - Recalculate points for all users based on actual data
// Supports admin session OR secret token via RECALCULATE_SECRET env var
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const validSecret = process.env.RECALCULATE_SECRET;

  if (secret && validSecret && secret === validSecret) {
    // Secret token auth — bypasses session check
  } else {
    const { session, error } = await requireAdmin();
    if (error) return error;
  }

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
