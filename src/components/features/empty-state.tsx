'use client';

import { useTranslations } from 'next-intl';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearFilters?: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  const t = useTranslations('listing');

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <SearchX className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('emptyTitle')}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{t('emptyDescription')}</p>
      {onClearFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          {t('filterTitle')}
        </Button>
      )}
    </div>
  );
}
