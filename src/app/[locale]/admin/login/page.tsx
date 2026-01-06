'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { GraduationCap, Mail, Key, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

function LoginForm() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/admin`;

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const isRTL = locale === 'ar';

  // Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStep('otp');
        // Start countdown for resend
        setCountdown(60);
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(
          isRTL
            ? 'فشل في إرسال رمز التحقق'
            : 'Failed to send verification code'
        );
      }
    } catch (err) {
      setError(
        isRTL
          ? 'حدث خطأ. يرجى المحاولة مرة أخرى'
          : 'An error occurred. Please try again'
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        otpCode,
        redirect: false,
      });

      if (result?.error) {
        setError(
          isRTL
            ? 'رمز التحقق غير صحيح أو منتهي الصلاحية'
            : 'Invalid or expired verification code'
        );
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError(
        isRTL
          ? 'حدث خطأ. يرجى المحاولة مرة أخرى'
          : 'An error occurred. Please try again'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setOtpCode('');
    setError('');
  };

  return (
    <div
      className={`flex h-full w-full items-center justify-center px-4 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <GraduationCap className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRTL ? 'لوحة الإدارة' : 'Admin Panel'}
            </h1>
            <p className="mt-2 text-gray-600">
              {step === 'email'
                ? isRTL
                  ? 'أدخل بريدك الإلكتروني لتلقي رمز التحقق'
                  : 'Enter your email to receive a verification code'
                : isRTL
                ? 'أدخل رمز التحقق المرسل إلى بريدك'
                : 'Enter the verification code sent to your email'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 ${
                      isRTL ? 'right-3' : 'left-3'
                    }`}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    suppressHydrationWarning
                    className={`w-full rounded-lg border border-gray-300 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                      isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                    }`}
                    placeholder="osmangeomatics1@gmail.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                  </>
                ) : (
                  isRTL ? 'إرسال رمز التحقق' : 'Send Verification Code'
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <label
                    htmlFor="otpCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {isRTL ? 'رمز التحقق' : 'Verification Code'}
                  </label>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                    {isRTL ? 'تغيير البريد' : 'Change email'}
                  </button>
                </div>
                <div className="relative">
                  <Key
                    className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 ${
                      isRTL ? 'right-3' : 'left-3'
                    }`}
                  />
                  <input
                    id="otpCode"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    suppressHydrationWarning
                    className={`w-full rounded-lg border border-gray-300 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                      isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                    }`}
                    placeholder="••••••"
                  />
                </div>
                <p className="mt-2 text-center text-sm text-gray-500">
                  {isRTL ? `تم إرسال الرمز إلى ${email}` : `Code sent to ${email}`}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isRTL ? 'جاري التحقق...' : 'Verifying...'}
                  </>
                ) : (
                  isRTL ? 'تحقق وتسجيل الدخول' : 'Verify & Sign In'
                )}
              </button>

              {/* Resend code */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    {isRTL
                      ? `إعادة إرسال الرمز بعد ${countdown} ثانية`
                      : `Resend code in ${countdown}s`}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
                  >
                    {isRTL ? 'إعادة إرسال الرمز' : 'Resend code'}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Info hint */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700">
            <p>
              {isRTL
                ? 'سيتم إرسال رمز تحقق مكون من 6 أرقام إلى بريدك الإلكتروني'
                : 'A 6-digit verification code will be sent to your email'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
