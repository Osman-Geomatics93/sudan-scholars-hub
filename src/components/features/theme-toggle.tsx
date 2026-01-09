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
      <button
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-9 h-9 animate-pulse"
        suppressHydrationWarning
      />
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
        'relative p-2.5 rounded-xl overflow-hidden transition-all duration-300 group',
        'bg-gray-100 dark:bg-gray-800',
        'hover:bg-amber-50 dark:hover:bg-indigo-900/50',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'dark:focus:ring-offset-gray-900'
      )}
      title={getLabel()}
      aria-label={getLabel()}
      suppressHydrationWarning
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 dark:from-indigo-400 dark:to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

      {/* Icons container */}
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <Sun className={cn(
          'absolute w-5 h-5 text-amber-500 transition-all duration-500',
          resolvedTheme === 'dark' || theme === 'system'
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        )} />
        {/* Moon icon */}
        <Moon className={cn(
          'absolute w-5 h-5 text-indigo-400 transition-all duration-500',
          resolvedTheme === 'dark' && theme !== 'system'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        )} />
        {/* Monitor icon */}
        <Monitor className={cn(
          'absolute w-5 h-5 text-gray-500 dark:text-gray-400 transition-all duration-500',
          theme === 'system'
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0'
        )} />
      </div>
    </button>
  );
}
