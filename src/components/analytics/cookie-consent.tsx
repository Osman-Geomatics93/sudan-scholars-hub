'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay before showing banner
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie_consent', 'essential');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-4 md:p-6 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 shrink-0">
              <Cookie className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                {isRTL ? 'نستخدم ملفات تعريف الارتباط' : 'We use cookies'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isRTL
                  ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل حركة المرور على الموقع. يمكنك اختيار قبول جميع ملفات تعريف الارتباط أو الأساسية فقط.'
                  : 'We use cookies to improve your experience and analyze site traffic. You can choose to accept all cookies or only essential ones.'}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={acceptEssential}
              className="flex-1 md:flex-none"
            >
              {isRTL ? 'الأساسية فقط' : 'Essential Only'}
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="flex-1 md:flex-none"
            >
              {isRTL ? 'قبول الكل' : 'Accept All'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
