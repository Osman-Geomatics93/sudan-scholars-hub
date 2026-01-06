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
  Quote,
  GraduationCap,
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  nameAr: string;
  university: string;
  universityAr: string;
  country: string;
  countryAr: string;
  quote: string;
  quoteAr: string;
  avatar: string;
  scholarshipYear: number;
  isPublished: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string, isPublished: boolean) {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, isPublished: !isPublished } : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  }

  async function deleteTestimonial(id: string) {
    if (
      !confirm(
        isRTL
          ? 'هل أنت متأكد من حذف هذه الشهادة؟'
          : 'Are you sure you want to delete this testimonial?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
  }

  const filteredTestimonials = testimonials.filter((t) =>
    isRTL
      ? t.nameAr.toLowerCase().includes(search.toLowerCase()) ||
        t.universityAr.toLowerCase().includes(search.toLowerCase())
      : t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.university.toLowerCase().includes(search.toLowerCase())
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
            {isRTL ? 'شهادات الطلاب' : 'Testimonials'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isRTL
              ? `${testimonials.length} شهادة`
              : `${testimonials.length} testimonials`}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/testimonials/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          {isRTL ? 'إضافة شهادة' : 'Add Testimonial'}
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
          placeholder={isRTL ? 'البحث عن شهادة...' : 'Search testimonials...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-lg border border-gray-300 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
          }`}
        />
      </div>

      {/* Grid of testimonials */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={isRTL ? testimonial.nameAr : testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(testimonial.name);
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {isRTL ? testimonial.nameAr : testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isRTL ? testimonial.universityAr : testimonial.university}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  testimonial.isPublished
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {testimonial.isPublished
                  ? isRTL
                    ? 'منشور'
                    : 'Published'
                  : isRTL
                  ? 'مسودة'
                  : 'Draft'}
              </span>
            </div>

            {/* Quote */}
            <div className="mb-4">
              <Quote className="mb-2 h-5 w-5 text-primary-300" />
              <p className="line-clamp-3 text-sm text-gray-600">
                {isRTL ? testimonial.quoteAr : testimonial.quote}
              </p>
            </div>

            {/* Meta */}
            <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                {testimonial.scholarshipYear}
              </span>
              <span>{isRTL ? testimonial.countryAr : testimonial.country}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t pt-4">
              <button
                onClick={() =>
                  togglePublish(testimonial.id, testimonial.isPublished)
                }
                className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title={testimonial.isPublished ? 'Unpublish' : 'Publish'}
              >
                {testimonial.isPublished ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <Link
                href={`/${locale}/admin/testimonials/${testimonial.id}/edit`}
                className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => deleteTestimonial(testimonial.id)}
                className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="rounded-xl bg-white py-12 text-center text-gray-500 shadow-sm">
          {isRTL ? 'لا توجد شهادات للعرض' : 'No testimonials to display'}
        </div>
      )}
    </div>
  );
}
