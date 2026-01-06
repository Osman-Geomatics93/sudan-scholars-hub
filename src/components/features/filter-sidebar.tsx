'use client';

import { useTranslations } from 'next-intl';
import { X, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  filters: {
    levels: string[];
    fundingTypes: string[];
    countries: string[];
  };
  onFilterChange: (type: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({
  locale,
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {
  const t = useTranslations('listing');
  const tCountries = useTranslations('countries');

  const studyLevels = [
    { value: 'bachelor', label: t('bachelor') },
    { value: 'master', label: t('master') },
    { value: 'phd', label: t('phd') },
  ];

  const fundingTypes = [
    { value: 'fully-funded', label: t('fullyFunded') },
    { value: 'partially-funded', label: t('partiallyFunded') },
  ];

  const countries = [
    { value: 'turkey', label: tCountries('turkey') },
    { value: 'usa', label: tCountries('usa') },
    { value: 'uk', label: tCountries('uk') },
    { value: 'canada', label: tCountries('canada') },
    { value: 'germany', label: tCountries('germany') },
    { value: 'australia', label: tCountries('australia') },
    { value: 'japan', label: tCountries('japan') },
  ];

  const hasActiveFilters =
    filters.levels.length > 0 ||
    filters.fundingTypes.length > 0 ||
    filters.countries.length > 0;

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header for mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="text-lg font-semibold">{t('filterTitle')}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Study Level */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t('studyLevel')}</h3>
        <div className="space-y-2">
          {studyLevels.map((level) => (
            <Checkbox
              key={level.value}
              label={level.label}
              checked={filters.levels.includes(level.value)}
              onChange={() => onFilterChange('levels', level.value)}
            />
          ))}
        </div>
      </div>

      {/* Funding Type */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t('fundingType')}</h3>
        <div className="space-y-2">
          {fundingTypes.map((type) => (
            <Checkbox
              key={type.value}
              label={type.label}
              checked={filters.fundingTypes.includes(type.value)}
              onChange={() => onFilterChange('fundingTypes', type.value)}
            />
          ))}
        </div>
      </div>

      {/* Country */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t('country')}</h3>
        <div className="space-y-2">
          {countries.map((country) => (
            <Checkbox
              key={country.value}
              label={country.label}
              checked={filters.countries.includes(country.value)}
              onChange={() => onFilterChange('countries', country.value)}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={onClearFilters}>
          {locale === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t('filterTitle')}
          </h2>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Filter Modal */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div
          className={cn(
            'absolute inset-y-0 start-0 w-80 max-w-full bg-white p-6 overflow-y-auto transition-transform',
            isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
          )}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
