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
      <button
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800"
        suppressHydrationWarning
      >
        <Globe className="h-5 w-5" />
        <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={switchLocale}
      className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium',
        'bg-gray-100 dark:bg-gray-800',
        'text-gray-600 dark:text-gray-300',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        'hover:text-primary-600 dark:hover:text-primary-400',
        'transition-all duration-300 group'
      )}
      aria-label={`Switch to ${locale === 'ar' ? 'English' : 'Arabic'}`}
      suppressHydrationWarning
    >
      <Globe className="h-5 w-5 group-hover:text-primary-500 group-hover:rotate-12 transition-all duration-300" />
      <span className="group-hover:translate-x-0.5 transition-transform duration-300">{t('language')}</span>
    </button>
  );
}
