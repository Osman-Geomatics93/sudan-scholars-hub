'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { cn, getLocalizedField } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface PosterLightboxProps {
  isOpen: boolean;
  poster: Poster | null;
  posters: Poster[];
  locale: string;
  onClose: () => void;
  onNavigate: (poster: Poster) => void;
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

export function PosterLightbox({
  isOpen,
  poster,
  posters,
  locale,
  onClose,
  onNavigate,
}: PosterLightboxProps) {
  const t = useTranslations('posters');
  const isRTL = locale === 'ar';
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find current index for navigation
  const currentIndex = poster ? posters.findIndex((p) => p.id === poster.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < posters.length - 1;

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      onNavigate(posters[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, posters, onNavigate]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      onNavigate(posters[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, posters, onNavigate]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        isRTL ? goToNext() : goToPrev();
      } else if (e.key === 'ArrowRight') {
        isRTL ? goToPrev() : goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isRTL, goToPrev, goToNext, onClose]);

  // Download handler
  const handleDownload = async () => {
    if (!poster) return;

    setIsDownloading(true);
    try {
      // Try to fetch and download
      const response = await fetch(poster.imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${poster.title.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab for manual save
      window.open(poster.imageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen || !poster || !mounted) return null;

  const title = getLocalizedField(poster, 'title', locale);
  const description = getLocalizedField(poster, 'description', locale);
  const categoryLabel = t(`categories.${poster.category}`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 end-4 z-20 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label={t('close')}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation - Previous */}
      {hasPrev && (
        <button
          onClick={goToPrev}
          className="absolute start-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label={t('previous')}
        >
          <ChevronLeft className={cn('h-8 w-8', isRTL && 'rotate-180')} />
        </button>
      )}

      {/* Navigation - Next */}
      {hasNext && (
        <button
          onClick={goToNext}
          className="absolute end-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label={t('next')}
        >
          <ChevronRight className={cn('h-8 w-8', isRTL && 'rotate-180')} />
        </button>
      )}

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
        {/* Image container */}
        <div className="relative max-w-2xl w-full max-h-[75vh] flex items-center justify-center">
          <Image
            src={poster.imageUrl}
            alt={title}
            width={1580}
            height={2048}
            className="object-contain w-auto h-auto max-w-full max-h-[75vh] rounded-lg shadow-2xl"
            priority
          />
        </div>

        {/* Info bar */}
        <div className="mt-4 w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left side - Title and category */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn('text-white text-xs', categoryColors[poster.category])}>
                  {categoryLabel}
                </Badge>
                {poster.isFeatured && (
                  <Badge className="bg-amber-500 text-white text-xs">
                    {t('featured')}
                  </Badge>
                )}
              </div>
              <h2 className="text-white font-semibold text-lg truncate">{title}</h2>
              {description && (
                <p className="text-white/70 text-sm line-clamp-1 mt-1">{description}</p>
              )}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                ) : (
                  <Download className="h-4 w-4 me-2" />
                )}
                {isDownloading ? t('downloading') : t('download')}
              </Button>

              {poster.scholarship && (
                <Link href={`/${locale}/scholarships/${poster.scholarship.slug}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    <ExternalLink className="h-4 w-4 me-2" />
                    {t('viewScholarship')}
                  </Button>
                </Link>
              )}

              {!poster.scholarship && poster.externalUrl && (
                <a
                  href={poster.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    <ExternalLink className="h-4 w-4 me-2" />
                    {t('visitLink')}
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Counter */}
          <div className="mt-3 text-center text-white/50 text-sm">
            {currentIndex + 1} / {posters.length}
          </div>
        </div>
      </div>
    </div>
  );
}
