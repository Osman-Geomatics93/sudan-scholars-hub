'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, Users, UserCheck, UserX } from 'lucide-react';
import { SkeletonStatCard, SkeletonTable } from '@/components/ui/skeleton';

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export default function SubscribersPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    try {
      const res = await fetch('/api/admin/subscribers');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers);
        setActiveCount(data.activeCount);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function exportCSV() {
    try {
      const res = await fetch('/api/admin/subscribers?format=csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  }

  const filteredSubscribers = subscribers.filter((s) => {
    if (filter === 'active') return s.isActive;
    if (filter === 'inactive') return !s.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Stats skeleton */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Table skeleton */}
        <SkeletonTable columns={3} rows={10} showHeader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'المشتركين' : 'Subscribers'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isRTL
              ? `${activeCount} مشترك نشط من ${subscribers.length}`
              : `${activeCount} active of ${subscribers.length} subscribers`}
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <Download className="h-5 w-5" />
          {isRTL ? 'تصدير CSV' : 'Export CSV'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {subscribers.length}
              </p>
              <p className="text-sm text-gray-600">
                {isRTL ? 'إجمالي المشتركين' : 'Total Subscribers'}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-sm text-gray-600">
                {isRTL ? 'مشتركين نشطين' : 'Active Subscribers'}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {subscribers.length - activeCount}
              </p>
              <p className="text-sm text-gray-600">
                {isRTL ? 'غير مشتركين' : 'Unsubscribed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'inactive'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all'
              ? isRTL
                ? 'الكل'
                : 'All'
              : f === 'active'
              ? isRTL
                ? 'نشط'
                : 'Active'
              : isRTL
              ? 'غير نشط'
              : 'Inactive'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'الحالة' : 'Status'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'تاريخ الاشتراك' : 'Subscribed'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <a
                    href={`mailto:${subscriber.email}`}
                    className="text-primary-600 hover:underline"
                  >
                    {subscriber.email}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      subscriber.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {subscriber.isActive ? (
                      <>
                        <UserCheck className="h-3 w-3" />
                        {isRTL ? 'نشط' : 'Active'}
                      </>
                    ) : (
                      <>
                        <UserX className="h-3 w-3" />
                        {isRTL ? 'غير نشط' : 'Inactive'}
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(subscriber.subscribedAt).toLocaleDateString(
                    isRTL ? 'ar-SA' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubscribers.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            {isRTL ? 'لا يوجد مشتركين' : 'No subscribers'}
          </div>
        )}
      </div>
    </div>
  );
}
