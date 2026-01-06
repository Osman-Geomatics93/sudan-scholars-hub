'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Calendar, MapPin, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SaveButton } from '@/components/features/save-button';
import { ShareButton } from '@/components/features/share-button';
import { Scholarship } from '@/types/scholarship';
import { formatDate, isDeadlineSoon, getLocalizedField } from '@/lib/utils';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  locale: string;
}

export function ScholarshipCard({ scholarship, locale }: ScholarshipCardProps) {
  const t = useTranslations('badges');
  const tListing = useTranslations('listing');

  const title = getLocalizedField(scholarship, 'title', locale);
  const university = getLocalizedField(scholarship, 'university', locale);
  const country = getLocalizedField(scholarship, 'country', locale);
  const deadlineSoon = isDeadlineSoon(scholarship.deadline);

  return (
    <Link href={`/${locale}/scholarships/${scholarship.slug}`}>
      <Card className="h-full overflow-hidden group cursor-pointer">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={scholarship.image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 start-3 flex flex-wrap gap-2">
            {(scholarship.fundingType === 'fully-funded' || scholarship.fundingType === 'FULLY_FUNDED') && (
              <Badge variant="success">{t('fullyFunded')}</Badge>
            )}
            {scholarship.isNew && <Badge variant="info">{t('new')}</Badge>}
            {deadlineSoon && <Badge variant="warning">{t('deadlineSoon')}</Badge>}
          </div>
          {/* Share and Save Buttons */}
          <div className="absolute top-3 end-3 flex gap-2">
            <ShareButton
              title={title}
              description={getLocalizedField(scholarship, 'description', locale).slice(0, 150)}
              image={scholarship.image}
              slug={scholarship.slug}
              type="scholarship"
              locale={locale}
              size="sm"
            />
            <SaveButton scholarshipId={scholarship.id} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="truncate">{university}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <span>{country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
              <span>{formatDate(scholarship.deadline, locale)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>
              {scholarship.level === 'bachelor'
                ? tListing('bachelor')
                : scholarship.level === 'master'
                ? tListing('master')
                : tListing('phd')}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
