import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subscribeSchema } from '@/lib/validations/newsletter';
import { sendWelcomeEmail } from '@/lib/email';
import { checkRateLimit, getClientIP, rateLimitedResponse, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const { success, resetTime } = checkRateLimit(
      `newsletter:${clientIP}`,
      RATE_LIMITS.newsletter.limit,
      RATE_LIMITS.newsletter.windowMs
    );

    if (!success) {
      return rateLimitedResponse(resetTime);
    }

    const body = await request.json();

    // Validate input
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email address', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      }

      // Reactivate subscription
      await prisma.subscriber.update({
        where: { email },
        data: {
          isActive: true,
          unsubscribedAt: null,
          subscribedAt: new Date(),
        },
      });

      // Send welcome email for reactivation (non-blocking)
      sendWelcomeEmail({ email }).catch((error) => {
        console.error('Failed to send welcome email:', error);
      });

      return NextResponse.json({
        success: true,
        message: 'Your subscription has been reactivated!',
      });
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: { email },
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ email }).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to the newsletter!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
