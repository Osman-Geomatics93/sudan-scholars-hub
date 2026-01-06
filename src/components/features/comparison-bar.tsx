'use client';

import { X, GitCompare } from 'lucide-react';
import { useComparison } from '@/contexts/comparison-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLocalizedField } from '@/lib/utils';

interface ComparisonBarProps {
  locale?: string;
}

export function ComparisonBar({ locale = 'en' }: ComparisonBarProps) {
  const {
    scholarships,
    removeFromCompare,
    clearComparison,
    openCompareModal,
  } = useComparison();

  const isRTL = locale === 'ar';

  if (scholarships.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg animate-fade-in-up">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Selected scholarships */}
          <div className="flex items-center gap-3 overflow-x-auto flex-1">
            <div className="flex items-center gap-2 shrink-0">
              <GitCompare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isRTL ? 'مقارنة:' : 'Compare:'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm shrink-0"
                >
                  <span className="max-w-[150px] truncate">
                    {getLocalizedField(scholarship, 'title', locale)}
                  </span>
                  <button
                    onClick={() => removeFromCompare(scholarship.id)}
                    className="p-0.5 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: 3 - scholarships.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="px-3 py-1.5 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-full text-sm shrink-0"
                >
                  {isRTL ? `منحة ${i + scholarships.length + 1}` : `Slot ${i + scholarships.length + 1}`}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearComparison}
              className="text-gray-600 dark:text-gray-400"
            >
              {isRTL ? 'مسح الكل' : 'Clear'}
            </Button>
            <Button
              size="sm"
              onClick={openCompareModal}
              disabled={scholarships.length < 2}
              className={cn(
                scholarships.length < 2 && 'opacity-50 cursor-not-allowed'
              )}
            >
              <GitCompare className="h-4 w-4 me-2" />
              {isRTL ? 'قارن الآن' : 'Compare Now'}
              {scholarships.length >= 2 && ` (${scholarships.length})`}
            </Button>
          </div>
        </div>

        {scholarships.length < 2 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {isRTL
              ? 'اختر منحتين على الأقل للمقارنة'
              : 'Select at least 2 scholarships to compare'}
          </p>
        )}
      </div>
    </div>
  );
}
