'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { PosterCategory } from '@prisma/client';

interface PosterFilterProps {
  selectedCategory: PosterCategory | null;
  onCategoryChange: (category: PosterCategory | null) => void;
  locale: string;
}

const categories: (PosterCategory | null)[] = [
  null, // "All" option
  'SCHOLARSHIP_INFO',
  'TURKEY',
  'EUROPE',
  'USA_CANADA',
  'ASIA',
  'APPLICATION_TIPS',
  'DEADLINE_REMINDER',
  'SUCCESS_STORIES',
  'GENERAL',
];

export function PosterFilter({
  selectedCategory,
  onCategoryChange,
  locale,
}: PosterFilterProps) {
  const t = useTranslations('posters');
  const isRTL = locale === 'ar';

  return (
    <div
      className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex gap-2 pb-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category ?? 'all'}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === category
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {category === null ? t('filterAll') : t(`categories.${category}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
