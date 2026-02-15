import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { signCardToken } from '@/lib/card-token';
import { checkRateLimit, getClientIP, rateLimitedResponse, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = getClientIP(request);
  const ipLimit = checkRateLimit(
    `card-token:${ip}`,
    RATE_LIMITS.cardToken.limit,
    RATE_LIMITS.cardToken.windowMs
  );
  if (!ipLimit.success) {
    return rateLimitedResponse(ipLimit.resetTime);
  }

  // Require authentication
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = (session!.user as any).id as string;

  // Per-user rate limit (5/min)
  const userLimit = checkRateLimit(`card-token:user:${userId}`, 5, 60000);
  if (!userLimit.success) {
    return rateLimitedResponse(userLimit.resetTime);
  }

  try {
    const token = await signCardToken(userId);
    const expiresAt = new Date(Date.now() + 900 * 1000).toISOString();

    // Build the verify URL based on the request origin and locale
    const origin = request.headers.get('origin') || request.nextUrl.origin;
    // Use referer to detect locale, fall back to 'en'
    const referer = request.headers.get('referer') || '';
    const localeMatch = referer.match(/\/(ar|en)\//);
    const locale = localeMatch ? localeMatch[1] : 'en';
    const verifyUrl = `${origin}/${locale}/verify?token=${token}`;

    return NextResponse.json({ token, expiresAt, verifyUrl });
  } catch (err) {
    console.error('Failed to sign card token:', err);
    return NextResponse.json(
      { error: 'Failed to generate verification token' },
      { status: 500 }
    );
  }
}
