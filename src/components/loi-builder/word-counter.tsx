'use client';

import { cn } from '@/lib/utils';

interface WordCounterProps {
  current: number;
  min: number;
  max: number;
  label?: string;
}

export function WordCounter({ current, min, max, label = 'Words' }: WordCounterProps) {
  const isUnderMin = current < min;
  const isOverMax = current > max;
  const isInRange = current >= min && current <= max;

  const getStatusColor = () => {
    if (isUnderMin) return 'text-amber-600 dark:text-amber-400';
    if (isOverMax) return 'text-red-600 dark:text-red-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getBarColor = () => {
    if (isUnderMin) return 'bg-amber-500';
    if (isOverMax) return 'bg-red-500';
    return 'bg-green-500';
  };

  // Calculate progress percentage (cap at 100% for display)
  const progressPercent = Math.min((current / max) * 100, 100);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className={cn('font-medium', getStatusColor())}>
          {current} / {min}-{max}
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', getBarColor())}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {isUnderMin && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
          Add {min - current} more words
        </p>
      )}
      {isOverMax && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          Remove {current - max} words
        </p>
      )}
    </div>
  );
}
