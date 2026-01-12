'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, FileText } from 'lucide-react';
import { LOIWizard } from '@/components/loi-builder/loi-wizard';

export default function LOIBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const isRTL = locale === 'ar';

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login?callbackUrl=/${locale}/loi-builder`);
    }

    // Redirect admin users - they should not use this feature
    if (status === 'authenticated' && (session?.user as { isAdmin?: boolean })?.isAdmin) {
      router.push(`/${locale}/admin`);
    }
  }, [status, session, router, locale]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
          <p className="mt-2 text-gray-500">
            {isRTL ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirect state - show loading while redirecting
  if (status === 'unauthenticated' || (session?.user as { isAdmin?: boolean })?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
          <p className="mt-2 text-gray-500">
            {isRTL ? 'جاري إعادة التوجيه...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container-custom pt-20 pb-8">
        <LOIWizard locale={locale} />
      </div>
    </main>
  );
}
