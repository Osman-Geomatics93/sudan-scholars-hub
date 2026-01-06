'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Calendar,
  MapPin,
  GraduationCap,
  Clock,
  DollarSign,
  ExternalLink,
  ChevronRight,
  Share2,
  Check,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScholarshipCard } from '@/components/features/scholarship-card';
import { ShareModal } from '@/components/features/share-modal';
import { formatDate, getLocalizedField } from '@/lib/utils';
import { Scholarship } from '@/types/scholarship';
import { ShareContent } from '@/lib/share-utils';

export default function ScholarshipDetailsPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [relatedScholarships, setRelatedScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const t = useTranslations('details');
  const tBadges = useTranslations('badges');
  const tListing = useTranslations('listing');

  useEffect(() => {
    async function fetchScholarship() {
      try {
        const res = await fetch(`/api/scholarships/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setScholarship(data.scholarship);

          // Fetch related scholarships
          if (data.scholarship) {
            const relatedRes = await fetch(`/api/scholarships?level=${data.scholarship.level}&limit=3`);
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json();
              setRelatedScholarships(
                relatedData.scholarships.filter((s: Scholarship) => s.id !== data.scholarship.id).slice(0, 3)
              );
            }
          }
        } else {
          router.push(`/${locale}/scholarships`);
        }
      } catch (error) {
        console.error('Failed to fetch scholarship:', error);
        router.push(`/${locale}/scholarships`);
      } finally {
        setLoading(false);
      }
    }

    fetchScholarship();
  }, [slug, locale, router]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!scholarship) {
    return null;
  }

  const title = getLocalizedField(scholarship, 'title', locale);
  const university = getLocalizedField(scholarship, 'university', locale);
  const country = getLocalizedField(scholarship, 'country', locale);
  const description = getLocalizedField(scholarship, 'description', locale);
  const duration = getLocalizedField(scholarship, 'duration', locale);
  const howToApply = getLocalizedField(scholarship, 'howToApply', locale);

  const eligibility = locale === 'ar' ? scholarship.eligibilityAr : scholarship.eligibility;
  const benefits = locale === 'ar' ? scholarship.benefitsAr : scholarship.benefits;
  const requirements = locale === 'ar' ? scholarship.requirementsAr : scholarship.requirements;

  const getLevelLabel = (level: string) => {
    const normalized = level.toLowerCase();
    if (normalized === 'bachelor') return tListing('bachelor');
    if (normalized === 'master') return tListing('master');
    if (normalized === 'phd') return tListing('phd');
    return level;
  };

  const getFundingLabel = (fundingType: string) => {
    const normalized = fundingType.toLowerCase().replace('_', '-');
    if (normalized === 'fully-funded' || normalized === 'fully_funded') return tBadges('fullyFunded');
    return tBadges('partiallyFunded');
  };

  const isFullyFunded = scholarship.fundingType.toLowerCase().includes('fully');

  const keyFacts = [
    {
      icon: MapPin,
      label: t('hostCountry'),
      value: country,
    },
    {
      icon: GraduationCap,
      label: t('studyLevel'),
      value: getLevelLabel(scholarship.level),
    },
    {
      icon: Clock,
      label: t('duration'),
      value: duration,
    },
    {
      icon: DollarSign,
      label: t('fundingType'),
      value: getFundingLabel(scholarship.fundingType),
    },
    {
      icon: Calendar,
      label: t('deadline'),
      value: formatDate(scholarship.deadline, locale),
    },
  ];

  // Share content for ShareModal
  const shareContent: ShareContent = {
    type: 'scholarship',
    title: title,
    description: description?.substring(0, 160) || '',
    image: scholarship.image,
    url: typeof window !== 'undefined'
      ? `${window.location.origin}/${locale}/scholarships/${scholarship.slug}`
      : '',
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <nav className="py-4 text-sm">
            <ol className="flex items-center gap-2 text-gray-600">
              <li>
                <Link href={`/${locale}`} className="hover:text-primary-600">
                  {locale === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              <li>
                <Link href={`/${locale}/scholarships`} className="hover:text-primary-600">
                  {locale === 'ar' ? 'المنح' : 'Scholarships'}
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              <li className="text-gray-900 font-medium truncate max-w-[200px]">{title}</li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
              {/* Image */}
              <div className="relative w-full lg:w-64 h-40 lg:h-48 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={scholarship.image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 256px"
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {isFullyFunded && (
                    <Badge variant="success">{tBadges('fullyFunded')}</Badge>
                  )}
                  {scholarship.isFeatured && <Badge variant="warning">{tBadges('featured')}</Badge>}
                </div>

                <h1 className="text-h1 text-gray-900 mb-3">{title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    {university}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    {country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container>
        <div className="py-8 flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Overview */}
            <Card className="p-6">
              <h2 className="text-h3 text-gray-900 mb-4">{t('overview')}</h2>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </Card>

            {/* Eligibility */}
            <Card className="p-6">
              <h2 className="text-h3 text-gray-900 mb-4">{t('eligibility')}</h2>
              <ul className="space-y-3">
                {eligibility.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <Check className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Benefits */}
            <Card className="p-6">
              <h2 className="text-h3 text-gray-900 mb-4">{t('benefits')}</h2>
              <ul className="space-y-3">
                {benefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <Check className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Requirements */}
            <Card className="p-6">
              <h2 className="text-h3 text-gray-900 mb-4">{t('requirements')}</h2>
              <ul className="space-y-3">
                {requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <Check className="h-5 w-5 text-secondary-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* How to Apply */}
            <Card className="p-6">
              <h2 className="text-h3 text-gray-900 mb-4">{t('howToApply')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{howToApply}</p>
              <a
                href={scholarship.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  {t('visitWebsite')}
                  <ExternalLink className="h-4 w-4 ms-2" />
                </Button>
              </a>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0 space-y-6">
            {/* Apply CTA */}
            <Card className="p-6 sticky top-24">
              <a
                href={scholarship.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4"
              >
                <Button className="w-full" size="lg">
                  {t('applyNow')}
                  <ExternalLink className="h-4 w-4 ms-2" />
                </Button>
              </a>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                {t('shareTitle')}
              </button>

              <hr className="my-6" />

              {/* Key Facts */}
              <h3 className="font-semibold text-gray-900 mb-4">{t('keyFacts')}</h3>
              <div className="space-y-4">
                {keyFacts.map((fact, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <fact.icon className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">{fact.label}</div>
                      <div className="font-medium text-gray-900">{fact.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Related Scholarships */}
        {relatedScholarships.length > 0 && (
          <div className="pb-16">
            <h2 className="text-h2 text-gray-900 mb-6">{t('relatedTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedScholarships.map((s) => (
                <ScholarshipCard key={s.id} scholarship={s} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        content={shareContent}
        locale={locale}
      />
    </div>
  );
}
