'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
} from 'lucide-react';

interface Scholarship {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  university: string;
  universityAr: string;
  country: string;
  countryAr: string;
  deadline: string;
  fundingType: string;
  level: string;
  field: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export default function ScholarshipsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchScholarships();
  }, []);

  async function fetchScholarships() {
    try {
      const res = await fetch('/api/admin/scholarships');
      if (res.ok) {
        const data = await res.json();
        setScholarships(data.scholarships);
      }
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string, isPublished: boolean) {
    try {
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (res.ok) {
        setScholarships((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, isPublished: !isPublished } : s
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  }

  async function toggleFeatured(id: string, isFeatured: boolean) {
    try {
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (res.ok) {
        setScholarships((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, isFeatured: !isFeatured } : s
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  }

  async function deleteScholarship(id: string) {
    if (
      !confirm(
        isRTL
          ? 'هل أنت متأكد من حذف هذه المنحة؟'
          : 'Are you sure you want to delete this scholarship?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setScholarships((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete scholarship:', error);
    }
  }

  const filteredScholarships = scholarships.filter((s) =>
    isRTL
      ? s.titleAr.toLowerCase().includes(search.toLowerCase()) ||
        s.universityAr.toLowerCase().includes(search.toLowerCase())
      : s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.university.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'المنح الدراسية' : 'Scholarships'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isRTL
              ? `${scholarships.length} منحة دراسية`
              : `${scholarships.length} scholarships`}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/scholarships/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          {isRTL ? 'إضافة منحة' : 'Add Scholarship'}
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 ${
            isRTL ? 'right-3' : 'left-3'
          }`}
        />
        <input
          type="text"
          placeholder={isRTL ? 'البحث عن منحة...' : 'Search scholarships...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-lg border border-gray-300 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
          }`}
        />
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
                {isRTL ? 'المنحة' : 'Scholarship'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'المستوى' : 'Level'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'الموعد النهائي' : 'Deadline'}
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
                {isRTL ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredScholarships.map((scholarship) => (
              <tr key={scholarship.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {isRTL ? scholarship.titleAr : scholarship.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isRTL ? scholarship.universityAr : scholarship.university}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    {scholarship.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(scholarship.deadline).toLocaleDateString(
                    isRTL ? 'ar-SA' : 'en-US'
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
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
                    {scholarship.isFeatured && (
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        togglePublish(scholarship.id, scholarship.isPublished)
                      }
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      title={scholarship.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {scholarship.isPublished ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        toggleFeatured(scholarship.id, scholarship.isFeatured)
                      }
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-amber-600"
                      title={scholarship.isFeatured ? 'Unfeature' : 'Feature'}
                    >
                      {scholarship.isFeatured ? (
                        <StarOff className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/${locale}/admin/scholarships/${scholarship.id}/edit`}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteScholarship(scholarship.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredScholarships.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            {isRTL ? 'لا توجد منح للعرض' : 'No scholarships to display'}
          </div>
        )}
      </div>
    </div>
  );
}
