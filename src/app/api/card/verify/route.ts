import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyCardToken } from '@/lib/card-token';
import { checkRateLimit, getClientIP, rateLimitedResponse, RATE_LIMITS } from '@/lib/rate-limit';

// Map badge keys to display tier labels
const TIER_MAP: Record<string, { en: string; ar: string }> = {
  newcomer: { en: 'Student', ar: 'طالب' },
  contributor: { en: 'Contributor', ar: 'مساهم' },
  scholar: { en: 'Verified', ar: 'موثق' },
  expert: { en: 'Verified', ar: 'موثق' },
  legend: { en: 'Alumni', ar: 'خريج' },
};

export async function GET(request: NextRequest) {
  // Rate limit by IP
  const ip = getClientIP(request);
  const ipLimit = checkRateLimit(
    `card-verify:${ip}`,
    RATE_LIMITS.cardVerify.limit,
    RATE_LIMITS.cardVerify.windowMs
  );
  if (!ipLimit.success) {
    return rateLimitedResponse(ipLimit.resetTime);
  }

  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json(
      { valid: false, reason: 'missing_token' },
      { status: 400 }
    );
  }

  // Verify token signature + expiry
  const payload = await verifyCardToken(token);
  if (!payload) {
    return NextResponse.json(
      { valid: false, reason: 'invalid_or_expired' },
      { status: 200 }
    );
  }

  // Fetch minimal user data
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      name: true,
      badge: true,
      points: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { valid: false, reason: 'user_not_found' },
      { status: 200 }
    );
  }

  // Compute membership status
  const expiryDate = new Date(user.createdAt);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const status = expiryDate > new Date() ? 'ACTIVE' : 'EXPIRED';

  // Map badge to tier
  const tier = TIER_MAP[user.badge || 'newcomer'] || TIER_MAP.newcomer;

  return NextResponse.json({
    valid: true,
    data: {
      name: user.name || 'Student',
      tier,
      status,
      expiresAt: expiryDate.toISOString(),
    },
  });
}
