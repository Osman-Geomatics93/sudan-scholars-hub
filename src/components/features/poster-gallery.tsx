'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, ImageOff } from 'lucide-react';
import { PosterCard } from './poster-card';
import { PosterLightbox } from './poster-lightbox';
import { PosterFilter } from './poster-filter';
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

interface PosterGalleryProps {
  locale: string;
  showFilter?: boolean;
  initialCategory?: PosterCategory | null;
}

export function PosterGallery({
  locale,
  showFilter = true,
  initialCategory = null,
}: PosterGalleryProps) {
  const t = useTranslations('posters');
  const [posters, setPosters] = useState<Poster[]>([]);
  const [filteredPosters, setFilteredPosters] = useState<Poster[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PosterCategory | null>(
    initialCategory
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fetch posters
  useEffect(() => {
    async function fetchPosters() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/posters');
        if (res.ok) {
          const data = await res.json();
          setPosters(data.posters);
        }
      } catch (error) {
        console.error('Failed to fetch posters:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosters();
  }, []);

  // Filter posters by category
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredPosters(posters);
    } else {
      setFilteredPosters(posters.filter((p) => p.category === selectedCategory));
    }
  }, [posters, selectedCategory]);

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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      {showFilter && (
        <PosterFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          locale={locale}
        />
      )}

      {/* Gallery Grid */}
      {filteredPosters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosters.map((poster) => (
            <PosterCard
              key={poster.id}
              poster={poster}
              locale={locale}
              onOpen={handleOpenLightbox}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ImageOff className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {t('noPosters')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('noPosterDescription')}
          </p>
        </div>
      )}

      {/* Lightbox */}
      <PosterLightbox
        isOpen={isLightboxOpen}
        poster={selectedPoster}
        posters={filteredPosters}
        locale={locale}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
