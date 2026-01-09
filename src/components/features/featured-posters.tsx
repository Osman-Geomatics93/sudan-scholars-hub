'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Loader2, ImageOff } from 'lucide-react';
import { PosterLightbox } from './poster-lightbox';
import { Badge } from '@/components/ui/badge';
import { cn, getLocalizedField } from '@/lib/utils';
import { PosterCategory } from '@prisma/client';

interface Poster {
  id: string;
  title: string;
  titleAr: string;
  description: string | null;
  descriptionAr: string | null;
  imageUrl: string;
  category: PosterCategory;
  scholarshipId: string | null;
  externalUrl: string | null;
  isFeatured: boolean;
  scholarship?: {
    id: string;
    slug: string;
    title: string;
    titleAr: string;
  } | null;
}

interface FeaturedPostersProps {
  locale: string;
}

const categoryColors: Record<PosterCategory, string> = {
  SCHOLARSHIP_INFO: 'bg-blue-500',
  TURKEY: 'bg-red-500',
  EUROPE: 'bg-indigo-500',
  USA_CANADA: 'bg-purple-500',
  ASIA: 'bg-orange-500',
  APPLICATION_TIPS: 'bg-green-500',
  DEADLINE_REMINDER: 'bg-yellow-500',
  SUCCESS_STORIES: 'bg-pink-500',
  GENERAL: 'bg-gray-500',
};

export function FeaturedPosters({ locale }: FeaturedPostersProps) {
  const t = useTranslations('posters');
  const isRTL = locale === 'ar';
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    async function fetchFeaturedPosters() {
      try {
        const res = await fetch('/api/posters/featured');
        if (res.ok) {
          const data = await res.json();
          setPosters(data.posters);
        }
      } catch (error) {
        console.error('Failed to fetch featured posters:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedPosters();
  }, []);

  const handleOpenLightbox = (poster: Poster) => {
    setSelectedPoster(poster);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedPoster(null);
  };

  const handleNavigate = (poster: Poster) => {
    setSelectedPoster(poster);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (posters.length === 0) {
    return null; // Don't show section if no featured posters
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {t('title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Link
          href={`/${locale}/posters`}
          className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          {t('viewAll')}
          <ArrowRight className={cn('h-4 w-4', isRTL && 'rotate-180')} />
        </Link>
      </div>

      {/* Horizontal scroll container */}
      <div
        className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex gap-3 sm:gap-4 min-w-max pb-4 snap-x snap-mandatory">
          {posters.map((poster) => {
            const title = getLocalizedField(poster, 'title', locale);
            const categoryLabel = t(`categories.${poster.category}`);

            return (
              <div
                key={poster.id}
                className="w-32 sm:w-40 md:w-48 flex-shrink-0 group cursor-pointer snap-start"
                onClick={() => handleOpenLightbox(poster)}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-2">
                  <Image
                    src={poster.imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Category badge */}
                  <div className="absolute top-2 start-2">
                    <Badge
                      className={cn(
                        'text-white text-[10px] px-2 py-0.5',
                        categoryColors[poster.category]
                      )}
                    >
                      {categoryLabel}
                    </Badge>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {t('view')}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile view all link */}
      <div className="sm:hidden mt-4 text-center">
        <Link
          href={`/${locale}/posters`}
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
        >
          {t('viewAll')}
          <ArrowRight className={cn('h-4 w-4', isRTL && 'rotate-180')} />
        </Link>
      </div>

      {/* Lightbox */}
      <PosterLightbox
        isOpen={isLightboxOpen}
        poster={selectedPoster}
        posters={posters}
        locale={locale}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
