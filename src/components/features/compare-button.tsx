'use client';

import { GitCompare, Check } from 'lucide-react';
import { useComparison } from '@/contexts/comparison-context';
import { Scholarship } from '@/types/scholarship';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
  scholarship: Scholarship;
  locale?: string;
  size?: 'sm' | 'md';
}

export function CompareButton({ scholarship, locale = 'en', size = 'sm' }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInComparison, canAddMore } = useComparison();

  const isSelected = isInComparison(scholarship.id);
  const isDisabled = !isSelected && !canAddMore;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSelected) {
      removeFromCompare(scholarship.id);
    } else if (canAddMore) {
      addToCompare(scholarship);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'rounded-full transition-all duration-200',
        sizeClasses[size],
        isSelected
          ? 'bg-primary-600 text-white hover:bg-primary-700'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
      title={
        isSelected
          ? (locale === 'ar' ? 'إزالة من المقارنة' : 'Remove from compare')
          : isDisabled
          ? (locale === 'ar' ? 'الحد الأقصى 3 منح' : 'Max 3 scholarships')
          : (locale === 'ar' ? 'أضف للمقارنة' : 'Add to compare')
      }
    >
      {isSelected ? (
        <Check className={iconSizes[size]} />
      ) : (
        <GitCompare className={iconSizes[size]} />
      )}
    </button>
  );
}
