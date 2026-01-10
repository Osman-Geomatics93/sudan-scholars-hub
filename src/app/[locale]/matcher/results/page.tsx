'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Trophy,
  Clock,
  MapPin,
  GraduationCap,
  Wallet,
  ExternalLink,
  ChevronRight,
  Loader2,
  RefreshCw,
  History,
  CheckCircle2,
  AlertCircle,
  Target,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ScholarshipMatch, MatchLevel } from '@/lib/matcher/types';

interface MatchResultData {
  result: {
    id: string;
    matches: Array<ScholarshipMatch & { scholarship: any }>;
    totalMatched: number;
    processingTimeMs: number;
    createdAt: string;
  };
}

function MatcherResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const isRTL = locale === 'ar';
  const resultId = searchParams.get('id');

  const { data: session, status } = useSession();
  const [data, setData] = useState<MatchResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch results
  useEffect(() => {
    async function fetchResults() {
      if (!resultId) {
        setError(isRTL ? 'لم يتم تحديد النتائج' : 'No results specified');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/matcher/history/${resultId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(isRTL ? 'فشل تحميل النتائج' : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchResults();
    } else if (status === 'unauthenticated') {
      router.push(`/${locale}/matcher`);
    }
  }, [resultId, status, locale, router, isRTL]);

  // Match level config
  const matchLevelConfig: Record<MatchLevel, { color: string; label: { en: string; ar: string }; icon: typeof CheckCircle2 }> = {
    excellent: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      label: { en: 'Excellent Match', ar: 'تطابق ممتاز' },
      icon: CheckCircle2,
    },
    good: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      label: { en: 'Good Match', ar: 'تطابق جيد' },
      icon: Target,
    },
    fair: {
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      label: { en: 'Fair Match', ar: 'تطابق مقبول' },
      icon: AlertCircle,
    },
  };

  if (status === 'loading' || loading) {
    return (
      <MainLayout locale={locale}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {isRTL ? 'جاري تحميل النتائج...' : 'Loading results...'}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout locale={locale}>
        <Container size="md" className="py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || (isRTL ? 'لم يتم العثور على نتائج' : 'No results found')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isRTL
                ? 'يمكنك إعادة المحاولة أو العودة للمطابق'
                : 'You can try again or go back to the matcher'}
            </p>
            <Button onClick={() => router.push(`/${locale}/matcher`)}>
              {isRTL ? 'العودة للمطابق' : 'Back to Matcher'}
            </Button>
          </div>
        </Container>
      </MainLayout>
    );
  }

  const { result } = data;
  const matches = result.matches;

  return (
    <MainLayout locale={locale}>
      <div
        className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container size="lg" className="py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {isRTL ? 'نتائج المطابقة' : 'Your Matches'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isRTL
                ? `وجدنا ${matches.length} منحة تتناسب مع ملفك الشخصي`
                : `We found ${matches.length} scholarships that match your profile`}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <Clock className="w-4 h-4 inline mr-1" />
              {isRTL
                ? `تمت المعالجة في ${(result.processingTimeMs / 1000).toFixed(1)} ثانية`
                : `Processed in ${(result.processingTimeMs / 1000).toFixed(1)} seconds`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/matcher`)}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {isRTL ? 'إعادة المطابقة' : 'Run Again'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/matcher/history`)}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              {isRTL ? 'سجل المطابقات' : 'View History'}
            </Button>
          </div>

          {/* Results Grid */}
          {matches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isRTL ? 'لم يتم العثور على منح مطابقة' : 'No Matching Scholarships Found'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isRTL
                    ? 'جرب تعديل معدلك أو تفضيلاتك للحصول على نتائج أكثر'
                    : 'Try adjusting your GPA or preferences to get more results'}
                </p>
                <Button onClick={() => router.push(`/${locale}/matcher`)}>
                  {isRTL ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => {
                const scholarship = match.scholarship;
                if (!scholarship) return null;

                const levelConfig = matchLevelConfig[match.matchLevel];
                const LevelIcon = levelConfig.icon;

                return (
                  <Card key={match.scholarshipId} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                          <Image
                            src={scholarship.image || '/images/scholarship-placeholder.jpg'}
                            alt={scholarship.title}
                            fill
                            className="object-cover"
                          />
                          {/* Rank Badge */}
                          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-full text-sm font-bold">
                            #{index + 1}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              {/* Title & University */}
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {isRTL ? scholarship.titleAr || scholarship.title : scholarship.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                {isRTL ? scholarship.universityAr || scholarship.university : scholarship.university}
                              </p>

                              {/* Meta info */}
                              <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {isRTL ? scholarship.countryAr || scholarship.country : scholarship.country}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Wallet className="w-4 h-4" />
                                  {scholarship.fundingType === 'FULLY_FUNDED'
                                    ? isRTL ? 'ممولة بالكامل' : 'Fully Funded'
                                    : isRTL ? 'ممولة جزئياً' : 'Partially Funded'}
                                </span>
                              </div>

                              {/* AI Explanation */}
                              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {isRTL
                                    ? match.explanation?.ar || match.explanation?.en
                                    : match.explanation?.en || match.explanation?.ar}
                                </p>
                              </div>

                              {/* Match Factors */}
                              <div className="flex flex-wrap gap-1">
                                {match.factors?.slice(0, 4).map((factor) => (
                                  <Badge
                                    key={factor.type}
                                    className={`text-xs border bg-transparent ${
                                      factor.status === 'match'
                                        ? 'border-green-500 text-green-600'
                                        : factor.status === 'partial'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-gray-300 text-gray-500'
                                    }`}
                                  >
                                    {factor.type === 'gpa' && (isRTL ? 'المعدل' : 'GPA')}
                                    {factor.type === 'field' && (isRTL ? 'المجال' : 'Field')}
                                    {factor.type === 'level' && (isRTL ? 'المستوى' : 'Level')}
                                    {factor.type === 'funding' && (isRTL ? 'التمويل' : 'Funding')}
                                    {factor.type === 'country' && (isRTL ? 'البلد' : 'Country')}
                                    {factor.status === 'match' && ' ✓'}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Score & Actions */}
                            <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                              {/* Score */}
                              <div className="text-center md:text-end">
                                <div className="text-3xl font-bold text-primary">{match.score}%</div>
                                <Badge className={levelConfig.color}>
                                  <LevelIcon className="w-3 h-3 mr-1" />
                                  {isRTL ? levelConfig.label.ar : levelConfig.label.en}
                                </Badge>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <Link href={`/${locale}/scholarships/${scholarship.slug}`}>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    {isRTL ? 'التفاصيل' : 'Details'}
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </Link>
                                {scholarship.applicationUrl && (
                                  <a
                                    href={scholarship.applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button size="sm" className="gap-1">
                                      {isRTL ? 'تقديم' : 'Apply'}
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </div>
    </MainLayout>
  );
}

function ResultsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
      </div>
    </div>
  );
}

export default function MatcherResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <MatcherResultsContent />
    </Suspense>
  );
}
