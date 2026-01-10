/**
 * Simple in-memory rate limiter for Vercel/Edge environments
 * Note: This works per-instance. For multi-instance deployments, consider Redis.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP address or user ID)
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns Object with success status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  cleanupExpiredEntries();

  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // First request or window expired - reset counter
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { success: true, remaining: limit - 1, resetTime };
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment counter
  record.count++;
  return { success: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and standard proxies
 */
export function getClientIP(request: Request): string {
  // Cloudflare
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;

  // Vercel
  const vercelIP = request.headers.get('x-vercel-forwarded-for');
  if (vercelIP) return vercelIP.split(',')[0].trim();

  // Standard proxy
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  // Real IP header
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  // Fallback
  return 'unknown';
}

/**
 * Create rate limited response with proper headers
 */
export function rateLimitedResponse(resetTime: number): Response {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      retryAfter
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(resetTime)
      }
    }
  );
}

// Preset rate limit configurations
export const RATE_LIMITS = {
  // Contact form: 5 requests per minute
  contact: { limit: 5, windowMs: 60000 },
  // Newsletter: 3 requests per minute
  newsletter: { limit: 3, windowMs: 60000 },
  // OTP requests: 3 per minute (prevent brute force)
  otp: { limit: 3, windowMs: 60000 },
  // Login attempts: 5 per minute
  login: { limit: 5, windowMs: 60000 },
  // General API: 60 per minute
  api: { limit: 60, windowMs: 60000 },
  // Search: 30 per minute
  search: { limit: 30, windowMs: 60000 }
} as const;
