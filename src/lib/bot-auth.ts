import { NextRequest, NextResponse } from 'next/server';
import { getBotApiKey } from './env';
import { checkRateLimit, getClientIP, rateLimitedResponse, RATE_LIMITS } from './rate-limit';
import crypto from 'crypto';

/**
 * Validate bot API key from X-Bot-API-Key header.
 * Returns null if auth passed, or an error NextResponse.
 */
export function requireBotAuth(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get('X-Bot-API-Key');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Unauthorized - Missing API key' },
      { status: 401 }
    );
  }

  const expected = getBotApiKey();

  // Constant-time comparison to prevent timing attacks
  const keyBuffer = Buffer.from(apiKey);
  const expectedBuffer = Buffer.from(expected);

  if (keyBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(keyBuffer, expectedBuffer)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid API key' },
      { status: 401 }
    );
  }

  // Rate limit by IP
  const ip = getClientIP(request);
  const { success, resetTime } = checkRateLimit(
    `bot:${ip}`,
    RATE_LIMITS.bot.limit,
    RATE_LIMITS.bot.windowMs
  );

  if (!success) {
    return rateLimitedResponse(resetTime) as unknown as NextResponse;
  }

  return null; // Auth passed
}
