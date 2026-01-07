import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Record a page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, path, referrer, locale } = body;

    // Validate required fields
    if (!sessionId || !path) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user agent from headers
    const userAgent = request.headers.get('user-agent') || undefined;

    await prisma.pageView.create({
      data: {
        sessionId,
        path,
        referrer: referrer || null,
        userAgent,
        locale: locale || 'en',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording page view:', error);
    return NextResponse.json(
      { error: 'Failed to record page view' },
      { status: 500 }
    );
  }
}
