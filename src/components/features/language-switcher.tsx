'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  locale: string;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  // Render a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600">
        <Globe className="h-4 w-4" />
        <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
      </div>
    );
  }

  return (
    <button
      onClick={switchLocale}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
        'text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors'
      )}
      aria-label={`Switch to ${locale === 'ar' ? 'English' : 'Arabic'}`}
    >
      <Globe className="h-4 w-4" />
      <span>{t('language')}</span>
    </button>
  );
}
