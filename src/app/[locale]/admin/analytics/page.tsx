'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Download,
  Eye,
  Users,
  TrendingUp,
  Globe,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { AnalyticsChart } from '@/components/admin/analytics-chart';
import { Button } from '@/components/ui/button';
import { SkeletonStatCard, SkeletonChart } from '@/components/ui/skeleton';

interface AnalyticsData {
  summary: {
    totalPageViews: number;
    uniqueVisitors: number;
    totalDownloads: number;
    avgPagesPerVisitor: string;
  };
  charts: {
    pageViewsByDay: { date: string; count: number }[];
    downloadsByFile: { fileName: string; count: number }[];
  };
  tables: {
    topPages: { path: string; count: number }[];
    topReferrers: { referrer: string; count: number }[];
  };
  period: string;
}

export default function AnalyticsPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const periodOptions = [
    { value: 'today', label: isRTL ? 'اليوم' : 'Today' },
    { value: '7d', label: isRTL ? 'آخر 7 أيام' : 'Last 7 Days' },
    { value: '30d', label: isRTL ? 'آخر 30 يوم' : 'Last 30 Days' },
    { value: '90d', label: isRTL ? 'آخر 90 يوم' : 'Last 90 Days' },
    { value: 'all', label: isRTL ? 'كل الوقت' : 'All Time' },
  ];

  const statCards = [
    {
      title: isRTL ? 'مشاهدات الصفحات' : 'Page Views',
      value: data?.summary.totalPageViews || 0,
      icon: Eye,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: isRTL ? 'الزوار الفريدين' : 'Unique Visitors',
      value: data?.summary.uniqueVisitors || 0,
      icon: Users,
      color: 'bg-green-500',
      bgLight: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: isRTL ? 'التحميلات' : 'Downloads',
      value: data?.summary.totalDownloads || 0,
      icon: Download,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: isRTL ? 'صفحات/زائر' : 'Pages/Visitor',
      value: data?.summary.avgPagesPerVisitor || '0',
      icon: TrendingUp,
      color: 'bg-amber-500',
      bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {isRTL ? 'التحليلات' : 'Analytics'}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {isRTL ? 'إحصائيات الموقع والتحميلات' : 'Website and download statistics'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}
              >
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {loading ? (
                  <span className="inline-block h-8 w-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                ) : (
                  card.value.toLocaleString()
                )}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Page Views Chart */}
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            {isRTL ? 'مشاهدات الصفحات' : 'Page Views Over Time'}
          </h2>
          {loading ? (
            <SkeletonChart />
          ) : (
            <AnalyticsChart
              data={data?.charts.pageViewsByDay || []}
              type="line"
              locale={locale}
            />
          )}
        </div>

        {/* Downloads by File */}
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
            <Download className="h-5 w-5 text-purple-600" />
            {isRTL ? 'التحميلات حسب الملف' : 'Downloads by File'}
          </h2>
          {loading ? (
            <SkeletonChart />
          ) : (
            <AnalyticsChart
              data={data?.charts.downloadsByFile || []}
              type="bar"
              locale={locale}
            />
          )}
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            {isRTL ? 'أكثر الصفحات زيارة' : 'Top Pages'}
          </h2>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))
            ) : data?.tables.topPages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isRTL ? 'لا توجد بيانات' : 'No data available'}
              </p>
            ) : (
              data?.tables.topPages.map((page, index) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {page.path}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {page.count.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-600" />
            {isRTL ? 'مصادر الزيارات' : 'Top Referrers'}
          </h2>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-48 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))
            ) : data?.tables.topReferrers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isRTL ? 'لا توجد بيانات' : 'No data available'}
              </p>
            ) : (
              data?.tables.topReferrers.map((ref, index) => (
                <div
                  key={ref.referrer}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {ref.referrer}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {ref.count.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
