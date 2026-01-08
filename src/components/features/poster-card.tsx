'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Download, ExternalLink, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
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

interface PosterCardProps {
  poster: Poster;
  locale: string;
  onOpen: (poster: Poster) => void;
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

export function PosterCard({ poster, locale, onOpen }: PosterCardProps) {
  const t = useTranslations('posters');
  const title = getLocalizedField(poster, 'title', locale);
  const categoryLabel = t(`categories.${poster.category}`);

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={() => onOpen(poster)}
    >
      {/* Image Container - 3:4 aspect ratio for portrait posters */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={poster.imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 start-3">
          <Badge className={cn('text-white text-xs', categoryColors[poster.category])}>
            {categoryLabel}
          </Badge>
        </div>

        {/* Featured Badge */}
        {poster.isFeatured && (
          <div className="absolute top-3 end-3">
            <Badge className="bg-amber-500 text-white text-xs">
              {t('featured')}
            </Badge>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute bottom-3 start-3 end-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(poster);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg text-sm font-medium transition-colors"
          >
            <Eye className="h-4 w-4" />
            {t('view')}
          </button>

          {poster.scholarship && (
            <Link
              href={`/${locale}/scholarships/${poster.scholarship.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-50 text-sm line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>

        {poster.scholarship && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {getLocalizedField(poster.scholarship, 'title', locale)}
          </p>
        )}
      </div>
    </Card>
  );
}
