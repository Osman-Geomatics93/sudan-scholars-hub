'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Users,
  Eye,
  Star,
  FileText,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { SkeletonStatCard, SkeletonTable } from '@/components/ui/skeleton';

interface Stats {
  scholarships: {
    total: number;
    published: number;
    featured: number;
    drafts: number;
  };
  contacts: {
    total: number;
    unread: number;
  };
  subscribers: {
    total: number;
    active: number;
  };
}

interface RecentScholarship {
  id: string;
  title: string;
  titleAr: string;
  isPublished: boolean;
  createdAt: string;
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentScholarships, setRecentScholarships] = useState<
    RecentScholarship[]
  >([]);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);

  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentScholarships(data.recentScholarships);
          setRecentContacts(data.recentContacts);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: isRTL ? 'إجمالي المنح' : 'Total Scholarships',
      value: stats?.scholarships.total || 0,
      subtitle: isRTL
        ? `${stats?.scholarships.published || 0} منشور`
        : `${stats?.scholarships.published || 0} published`,
      icon: GraduationCap,
      color: 'bg-blue-500',
      href: `/${locale}/admin/scholarships`,
    },
    {
      title: isRTL ? 'المنح المميزة' : 'Featured',
      value: stats?.scholarships.featured || 0,
      subtitle: isRTL ? 'منحة مميزة' : 'featured scholarships',
      icon: Star,
      color: 'bg-amber-500',
      href: `/${locale}/admin/scholarships`,
    },
    {
      title: isRTL ? 'الرسائل' : 'Messages',
      value: stats?.contacts.total || 0,
      subtitle: isRTL
        ? `${stats?.contacts.unread || 0} غير مقروءة`
        : `${stats?.contacts.unread || 0} unread`,
      icon: Mail,
      color: 'bg-green-500',
      href: `/${locale}/admin/contacts`,
    },
    {
      title: isRTL ? 'المشتركين' : 'Subscribers',
      value: stats?.subscribers.active || 0,
      subtitle: isRTL ? 'مشترك نشط' : 'active subscribers',
      icon: Users,
      color: 'bg-purple-500',
      href: `/${locale}/admin/subscribers`,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div>
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>

        {/* Tables skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonTable columns={3} rows={5} />
          <SkeletonTable columns={2} rows={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isRTL
            ? 'مرحباً بك في لوحة إدارة المنح الدراسية'
            : 'Welcome to the scholarship management dashboard'}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}
              >
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <Arrow className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm font-medium text-gray-900">{card.title}</p>
              <p className="text-sm text-gray-500">{card.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent scholarships */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isRTL ? 'أحدث المنح' : 'Recent Scholarships'}
            </h2>
            <Link
              href={`/${locale}/admin/scholarships`}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {isRTL ? 'عرض الكل' : 'View all'}
            </Link>
          </div>
          <div className="space-y-3">
            {recentScholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <GraduationCap className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {isRTL ? scholarship.titleAr : scholarship.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(scholarship.createdAt).toLocaleDateString(
                        isRTL ? 'ar-SA' : 'en-US'
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    scholarship.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {scholarship.isPublished
                    ? isRTL
                      ? 'منشور'
                      : 'Published'
                    : isRTL
                    ? 'مسودة'
                    : 'Draft'}
                </span>
              </div>
            ))}
            {recentScholarships.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                {isRTL ? 'لا توجد منح حتى الآن' : 'No scholarships yet'}
              </p>
            )}
          </div>
        </div>

        {/* Recent messages */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isRTL ? 'أحدث الرسائل' : 'Recent Messages'}
            </h2>
            <Link
              href={`/${locale}/admin/contacts`}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {isRTL ? 'عرض الكل' : 'View all'}
            </Link>
          </div>
          <div className="space-y-3">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      contact.isRead ? 'bg-gray-100' : 'bg-primary-50'
                    }`}
                  >
                    <Mail
                      className={`h-5 w-5 ${
                        contact.isRead ? 'text-gray-400' : 'text-primary-600'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{contact.name}</p>
                    <p className="truncate text-sm text-gray-500">
                      {contact.subject}
                    </p>
                  </div>
                </div>
                {!contact.isRead && (
                  <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary-600" />
                )}
              </div>
            ))}
            {recentContacts.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                {isRTL ? 'لا توجد رسائل حتى الآن' : 'No messages yet'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
