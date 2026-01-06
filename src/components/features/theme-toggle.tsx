'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  locale?: string;
}

export function ThemeToggle({ locale = 'en' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-9 h-9 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-5 w-5" />;
    }
    if (resolvedTheme === 'dark') {
      return <Moon className="h-5 w-5" />;
    }
    return <Sun className="h-5 w-5" />;
  };

  const getLabel = () => {
    if (theme === 'system') {
      return locale === 'ar' ? 'تلقائي' : 'System';
    }
    if (theme === 'dark') {
      return locale === 'ar' ? 'داكن' : 'Dark';
    }
    return locale === 'ar' ? 'فاتح' : 'Light';
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'p-2 rounded-lg transition-all duration-200',
        'bg-gray-100 hover:bg-gray-200 text-gray-700',
        'dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'dark:focus:ring-offset-gray-900'
      )}
      title={getLabel()}
      aria-label={getLabel()}
    >
      <span className="transition-transform duration-300 inline-block">
        {getIcon()}
      </span>
    </button>
  );
}
