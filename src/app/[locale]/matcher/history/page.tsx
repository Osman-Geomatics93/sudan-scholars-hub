'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  History,
  Clock,
  Trophy,
  Trash2,
  ChevronRight,
  Loader2,
  AlertCircle,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MatchHistoryItem {
  id: string;
  totalMatched: number;
  processingTimeMs: number;
  createdAt: string;
  topMatches: Array<{
    scholarshipTitle: string;
    score: number;
  }>;
}

export default function MatcherHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const isRTL = locale === 'ar';

  const { data: session, status } = useSession();
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch history
  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/matcher/history');
        if (response.ok) {
          const data = await response.json();
          setHistory(data.history || []);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchHistory();
    } else if (status === 'unauthenticated') {
      router.push(`/${locale}/matcher`);
    }
  }, [status, locale, router]);

  // Delete a result
  async function handleDelete(id: string) {
    if (deleting) return;

    const confirmed = window.confirm(
      isRTL
        ? 'هل أنت متأكد من حذف هذه النتيجة؟'
        : 'Are you sure you want to delete this result?'
    );

    if (!confirmed) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/matcher/history/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting result:', error);
    } finally {
      setDeleting(null);
    }
  }

  // Format date
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <MainLayout locale={locale}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {isRTL ? 'جاري تحميل السجل...' : 'Loading history...'}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

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
              <History className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {isRTL ? 'سجل المطابقات' : 'Match History'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isRTL
                ? 'عرض نتائج المطابقات السابقة'
                : 'View your previous match results'}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => router.push(`/${locale}/matcher`)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isRTL ? 'مطابقة جديدة' : 'New Match'}
            </Button>
          </div>

          {/* History List */}
          {history.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isRTL ? 'لا يوجد سجل بعد' : 'No History Yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isRTL
                    ? 'قم بتشغيل المطابق للعثور على المنح المناسبة لك'
                    : 'Run the matcher to find scholarships that fit you'}
                </p>
                <Button onClick={() => router.push(`/${locale}/matcher`)}>
                  {isRTL ? 'ابدأ المطابقة' : 'Start Matching'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="info" className="gap-1">
                            <Trophy className="w-3 h-3" />
                            {item.totalMatched}{' '}
                            {isRTL ? 'منحة' : 'scholarships'}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {(item.processingTimeMs / 1000).toFixed(1)}s
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-3">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.createdAt)}
                        </p>

                        {/* Top Matches Preview */}
                        {item.topMatches && item.topMatches.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {isRTL ? 'أفضل المطابقات:' : 'Top matches:'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.topMatches.slice(0, 3).map((match, idx) => (
                                <Badge
                                  key={idx}
                                  className="text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                >
                                  {match.scholarshipTitle.length > 25
                                    ? match.scholarshipTitle.slice(0, 25) + '...'
                                    : match.scholarshipTitle}
                                  <span className="ml-1 text-primary font-medium">
                                    {match.score}%
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link href={`/${locale}/matcher/results?id=${item.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            {isRTL ? 'عرض' : 'View'}
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          {deleting === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  {isRTL ? 'معلومة' : 'Note'}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {isRTL
                    ? 'يتم حفظ آخر 10 نتائج مطابقة. النتائج القديمة تُحذف تلقائياً عند تجاوز الحد.'
                    : 'The last 10 match results are saved. Older results are automatically deleted when the limit is exceeded.'}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
