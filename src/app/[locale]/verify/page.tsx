'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { ShieldCheck, ShieldX, Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VerifyData {
  name: string;
  tier: { en: string; ar: string };
  status: 'ACTIVE' | 'EXPIRED';
  expiresAt: string;
}

type VerifyState =
  | { type: 'loading' }
  | { type: 'valid'; data: VerifyData }
  | { type: 'invalid'; reason: string };

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>({ type: 'loading' });

  useEffect(() => {
    if (!token) {
      setState({ type: 'invalid', reason: 'missing_token' });
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/card/verify?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (data.valid) {
          setState({ type: 'valid', data: data.data });
        } else {
          setState({ type: 'invalid', reason: data.reason || 'unknown' });
        }
      } catch {
        setState({ type: 'invalid', reason: 'network_error' });
      }
    })();
  }, [token]);

  const getReasonText = (reason: string) => {
    const reasons: Record<string, { en: string; ar: string }> = {
      missing_token: {
        en: 'No verification token provided.',
        ar: 'لم يتم تقديم رمز التحقق.',
      },
      invalid_or_expired: {
        en: 'This verification link is invalid or has expired. Cards generate a new QR code every 15 minutes.',
        ar: 'رابط التحقق هذا غير صالح أو منتهي الصلاحية. يتم إنشاء رمز QR جديد كل 15 دقيقة.',
      },
      user_not_found: {
        en: 'The student associated with this card could not be found.',
        ar: 'لم يتم العثور على الطالب المرتبط بهذه البطاقة.',
      },
      network_error: {
        en: 'Could not connect to the verification server. Please try again.',
        ar: 'تعذر الاتصال بخادم التحقق. يرجى المحاولة مرة أخرى.',
      },
      unknown: {
        en: 'Verification failed for an unknown reason.',
        ar: 'فشل التحقق لسبب غير معروف.',
      },
    };
    const r = reasons[reason] || reasons.unknown;
    return isRTL ? r.ar : r.en;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24" dir={isRTL ? 'rtl' : 'ltr'}>
      <Container>
        <div className="max-w-lg mx-auto py-12">
          {/* Loading state */}
          {state.type === 'loading' && (
            <Card className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {isRTL ? 'جارٍ التحقق...' : 'Verifying...'}
              </p>
            </Card>
          )}

          {/* Valid state */}
          {state.type === 'valid' && (
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-10 w-10 text-green-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isRTL ? 'تم التحقق بنجاح' : 'Verification Successful'}
              </h1>

              <p className="text-gray-500 mb-8 text-sm">
                {isRTL
                  ? 'هذه البطاقة الطلابية موثقة من منصة سودانيز ستدي هب'
                  : 'This student card is verified by Sudanese Study Hub'}
              </p>

              <div className="space-y-4 text-start">
                {/* Name */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">
                    {isRTL ? 'الاسم' : 'Name'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {state.data.name}
                  </span>
                </div>

                {/* Tier */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">
                    {isRTL ? 'المستوى' : 'Membership Tier'}
                  </span>
                  <Badge>
                    {isRTL ? state.data.tier.ar : state.data.tier.en}
                  </Badge>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">
                    {isRTL ? 'الحالة' : 'Status'}
                  </span>
                  <Badge variant={state.data.status === 'ACTIVE' ? 'success' : 'error'}>
                    {state.data.status === 'ACTIVE'
                      ? (isRTL ? 'نشط' : 'Active')
                      : (isRTL ? 'منتهي' : 'Expired')}
                  </Badge>
                </div>

                {/* Expiry */}
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 text-sm">
                    {isRTL ? 'تاريخ الانتهاء' : 'Expires'}
                  </span>
                  <span className="text-gray-900">
                    {new Date(state.data.expiresAt).toLocaleDateString(
                      isRTL ? 'ar-SA' : 'en-US',
                      { month: 'long', year: 'numeric' }
                    )}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-8">
                sudanscholarhub.com
              </p>
            </Card>
          )}

          {/* Invalid state */}
          {state.type === 'invalid' && (
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldX className="h-10 w-10 text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isRTL ? 'فشل التحقق' : 'Verification Failed'}
              </h1>

              <p className="text-gray-600 mt-4">
                {getReasonText(state.reason)}
              </p>

              <p className="text-xs text-gray-400 mt-8">
                sudanscholarhub.com
              </p>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
