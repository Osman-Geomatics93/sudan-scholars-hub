'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { QualityScore } from '@/lib/loi-builder/types';

interface StrengthMeterProps {
  score: QualityScore;
  showDetails?: boolean;
  locale?: string;
}

export function StrengthMeter({ score, showDetails = false, locale = 'en' }: StrengthMeterProps) {
  const isRTL = locale === 'ar';

  const { color, bgColor, label, emoji } = useMemo(() => {
    if (score.overall < 30) {
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-500',
        label: isRTL ? 'ضعيف' : 'Weak',
        emoji: '😟',
      };
    }
    if (score.overall < 50) {
      return {
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-500',
        label: isRTL ? 'متوسط' : 'Fair',
        emoji: '🤔',
      };
    }
    if (score.overall < 70) {
      return {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-500',
        label: isRTL ? 'جيد' : 'Good',
        emoji: '😊',
      };
    }
    if (score.overall < 85) {
      return {
        color: 'text-lime-600 dark:text-lime-400',
        bgColor: 'bg-lime-500',
        label: isRTL ? 'قوي' : 'Strong',
        emoji: '😃',
      };
    }
    return {
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500',
      label: isRTL ? 'ممتاز' : 'Excellent',
      emoji: '🎉',
    };
  }, [score.overall, isRTL]);

  return (
    <div className="space-y-3">
      {/* Main score bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {isRTL ? 'قوة الخطاب' : 'Letter Strength'}
            </span>
            <span className={cn('text-sm font-bold', color)}>
              {score.overall}% {emoji}
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-500', bgColor)}
              style={{ width: `${score.overall}%` }}
            />
          </div>
        </div>
        <span className={cn('text-sm font-semibold px-2 py-1 rounded', color, 'bg-opacity-10', bgColor.replace('bg-', 'bg-opacity-10 bg-'))}>
          {label}
        </span>
      </div>

      {/* Detailed breakdown */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <ScoreItem
            label={isRTL ? 'الخصوصية' : 'Specificity'}
            value={score.specificity}
            locale={locale}
          />
          <ScoreItem
            label={isRTL ? 'الاكتمال' : 'Completeness'}
            value={score.completeness}
            locale={locale}
          />
          <ScoreItem
            label={isRTL ? 'تجنب الكليشيهات' : 'Cliche-Free'}
            value={score.clicheScore}
            locale={locale}
          />
          <ScoreItem
            label={isRTL ? 'وضوح المستقبل' : 'Future Clarity'}
            value={score.futureClarity}
            locale={locale}
          />
        </div>
      )}

      {/* Issues count */}
      {score.issues.length > 0 && (
        <div className="text-xs text-amber-600 dark:text-amber-400">
          {isRTL
            ? `${score.issues.length} قضايا تحتاج للمراجعة`
            : `${score.issues.length} issues to review`}
        </div>
      )}
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  value: number;
  locale: string;
}

function ScoreItem({ label, value, locale }: ScoreItemProps) {
  const getColor = () => {
    if (value < 40) return 'text-red-600 dark:text-red-400';
    if (value < 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={cn('font-medium', getColor())}>{value}%</span>
    </div>
  );
}
