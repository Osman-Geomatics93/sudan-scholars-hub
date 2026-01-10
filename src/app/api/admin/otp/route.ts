import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendAdminOTP } from '@/lib/email';
import { checkRateLimit, getClientIP, rateLimitedResponse, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - stricter for OTP to prevent brute force
    const clientIP = getClientIP(request);
    const { success, resetTime } = checkRateLimit(
      `otp:${clientIP}`,
      RATE_LIMITS.otp.limit,
      RATE_LIMITS.otp.windowMs
    );

    if (!success) {
      return rateLimitedResponse(resetTime);
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      // Don't reveal if admin exists or not for security
      return NextResponse.json(
        { error: 'If this email is registered, you will receive a verification code.' },
        { status: 200 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP for storage
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    // Save OTP with 5-minute expiration
    await prisma.admin.update({
      where: { email },
      data: {
        otpCode: hashedOtp,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Send OTP via email
    await sendAdminOTP({ email, otpCode });

    return NextResponse.json(
      {
        success: true,
        message: 'Verification code sent to your email'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
