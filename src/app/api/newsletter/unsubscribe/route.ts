import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unsubscribeSchema } from '@/lib/validations/newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = unsubscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email address', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if subscriber exists
    const subscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in our subscription list' },
        { status: 404 }
      );
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { error: 'This email is already unsubscribed' },
        { status: 400 }
      );
    }

    // Deactivate subscription
    await prisma.subscriber.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from the newsletter',
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}
