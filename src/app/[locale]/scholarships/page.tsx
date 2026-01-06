'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ScholarshipCard } from '@/components/features/scholarship-card';
import { FilterSidebar } from '@/components/features/filter-sidebar';
import { EmptyState } from '@/components/features/empty-state';
import { SkeletonCard } from '@/components/ui/skeleton';
import { ComparisonBar } from '@/components/features/comparison-bar';
import { ComparisonModal } from '@/components/features/comparison-modal';
import { Scholarship } from '@/types/scholarship';

const ITEMS_PER_PAGE = 6;

function ScholarshipsContent({ locale }: { locale: string }) {
  const t = useTranslations('listing');
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get('search') || '';

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [filters, setFilters] = useState({
    levels: [] as string[],
    fundingTypes: [] as string[],
    countries: [] as string[],
  });

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setCurrentPage(1);
    // Update URL without full page reload
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    router.push(`/${locale}/scholarships?${params.toString()}`, { scroll: false });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/${locale}/scholarships?${params.toString()}`, { scroll: false });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Fetch scholarships from API
  useEffect(() => {
    async function fetchScholarships() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', ITEMS_PER_PAGE.toString());

        if (sortBy === 'newest') {
          params.set('sortBy', 'createdAt');
          params.set('sortOrder', 'desc');
        } else if (sortBy === 'deadline') {
          params.set('sortBy', 'deadline');
          params.set('sortOrder', 'asc');
        }

        if (activeSearch) {
          params.set('search', activeSearch);
        }

        if (filters.levels.length > 0) {
          params.set('level', filters.levels.join(','));
        }
        if (filters.fundingTypes.length > 0) {
          params.set('fundingType', filters.fundingTypes.join(','));
        }
        if (filters.countries.length > 0) {
          params.set('country', filters.countries.join(','));
        }

        const res = await fetch(`/api/scholarships?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setScholarships(data.scholarships);
          setTotalPages(data.pagination.totalPages);
          setTotal(data.pagination.total);
        }
      } catch (error) {
        console.error('Failed to fetch scholarships:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchScholarships();
  }, [currentPage, sortBy, filters, activeSearch]);

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => {
      const current = prev[type as keyof typeof prev] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ levels: [], fundingTypes: [], countries: [] });
    setCurrentPage(1);
  };

  const activeFilterCount =
    filters.levels.length + filters.fundingTypes.length + filters.countries.length;

  const sortOptions = [
    { value: 'newest', label: locale === 'ar' ? 'الأحدث' : 'Newest' },
    { value: 'deadline', label: locale === 'ar' ? 'الموعد النهائي' : 'Deadline' },
  ];

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-950 min-h-screen pb-32">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-gray-900 dark:text-gray-50 mb-2">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>

          {/* Search Bar */}
          <div className="mt-6 max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder={locale === 'ar' ? 'ابحث عن منحة، جامعة، أو دولة...' : 'Search for scholarship, university, or country...'}
                  className="h-12 pe-10"
                  icon={<Search className="h-5 w-5" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button size="lg" onClick={handleSearch}>
                <Search className="h-5 w-5 md:me-2" />
                <span className="hidden md:inline">{locale === 'ar' ? 'بحث' : 'Search'}</span>
              </Button>
            </div>
            {activeSearch && (
              <p className="mt-2 text-sm text-gray-600">
                {locale === 'ar' ? `نتائج البحث عن: "${activeSearch}"` : `Search results for: "${activeSearch}"`}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            locale={locale}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                {/* Mobile filter button */}
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="h-4 w-4 me-2" />
                  {t('filterTitle')}
                  {activeFilterCount > 0 && (
                    <span className="ms-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                <span className="text-gray-600 dark:text-gray-400">
                  {total} {t('results')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('sortBy')}:</span>
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-40"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : scholarships.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {scholarships.map((scholarship) => (
                    <ScholarshipCard
                      key={scholarship.id}
                      scholarship={scholarship}
                      locale={locale}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState onClearFilters={handleClearFilters} />
            )}
          </div>
        </div>
      </Container>

      {/* Comparison Components */}
      <ComparisonBar locale={locale} />
      <ComparisonModal locale={locale} />
    </section>
  );
}

function ScholarshipsLoadingFallback() {
  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <Container>
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function ScholarshipsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <Suspense fallback={<ScholarshipsLoadingFallback />}>
      <ScholarshipsContent locale={locale} />
    </Suspense>
  );
}
