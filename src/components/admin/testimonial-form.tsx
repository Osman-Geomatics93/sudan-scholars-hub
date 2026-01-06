'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

interface TestimonialFormData {
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
}

interface TestimonialFormProps {
  initialData?: Partial<TestimonialFormData>;
  testimonialId?: string;
}

const COUNTRIES = [
  { en: 'United States', ar: 'الولايات المتحدة' },
  { en: 'United Kingdom', ar: 'المملكة المتحدة' },
  { en: 'Germany', ar: 'ألمانيا' },
  { en: 'Turkey', ar: 'تركيا' },
  { en: 'Canada', ar: 'كندا' },
  { en: 'Australia', ar: 'أستراليا' },
  { en: 'France', ar: 'فرنسا' },
  { en: 'Netherlands', ar: 'هولندا' },
  { en: 'Sweden', ar: 'السويد' },
  { en: 'Japan', ar: 'اليابان' },
  { en: 'China', ar: 'الصين' },
  { en: 'South Korea', ar: 'كوريا الجنوبية' },
  { en: 'Malaysia', ar: 'ماليزيا' },
  { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
  { en: 'UAE', ar: 'الإمارات العربية المتحدة' },
  { en: 'Qatar', ar: 'قطر' },
];

export function TestimonialForm({ initialData, testimonialId }: TestimonialFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';
  const isEditing = !!testimonialId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const [formData, setFormData] = useState<TestimonialFormData>({
    name: initialData?.name || '',
    nameAr: initialData?.nameAr || '',
    university: initialData?.university || '',
    universityAr: initialData?.universityAr || '',
    country: initialData?.country || 'United States',
    countryAr: initialData?.countryAr || 'الولايات المتحدة',
    quote: initialData?.quote || '',
    quoteAr: initialData?.quoteAr || '',
    avatar: initialData?.avatar || '',
    scholarshipYear: initialData?.scholarshipYear || currentYear,
    isPublished: initialData?.isPublished ?? true,
  });

  const handleCountryChange = (countryEn: string) => {
    const country = COUNTRIES.find((c) => c.en === countryEn);
    if (country) {
      setFormData((prev) => ({
        ...prev,
        country: country.en,
        countryAr: country.ar,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/admin/testimonials/${testimonialId}`
        : '/api/admin/testimonials';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save testimonial');
      }

      router.push(`/${locale}/admin/testimonials`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {/* Personal Info */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name (English) *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Ahmed Mohamed"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              الاسم (عربي) *
            </label>
            <input
              type="text"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              required
              dir="rtl"
              placeholder="مثال: أحمد محمد"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Avatar URL *
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              required
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            {formData.avatar && (
              <div className="mt-2">
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="h-16 w-16 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(formData.name || 'User');
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Scholarship Year *
            </label>
            <select
              value={formData.scholarshipYear}
              onChange={(e) =>
                setFormData({ ...formData, scholarshipYear: parseInt(e.target.value) })
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* University & Country */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'الجامعة والدولة' : 'University & Country'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              University (English) *
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              required
              placeholder="e.g., Harvard University"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              الجامعة (عربي) *
            </label>
            <input
              type="text"
              value={formData.universityAr}
              onChange={(e) => setFormData({ ...formData, universityAr: e.target.value })}
              required
              dir="rtl"
              placeholder="مثال: جامعة هارفارد"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Country *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {COUNTRIES.map((c) => (
                <option key={c.en} value={c.en}>
                  {c.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              الدولة (عربي)
            </label>
            <input
              type="text"
              value={formData.countryAr}
              readOnly
              dir="rtl"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Testimonial Quote */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'الشهادة' : 'Testimonial Quote'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Quote (English) *
            </label>
            <textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              required
              rows={5}
              placeholder="Share the student's experience and journey..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              الاقتباس (عربي) *
            </label>
            <textarea
              value={formData.quoteAr}
              onChange={(e) => setFormData({ ...formData, quoteAr: e.target.value })}
              required
              rows={5}
              dir="rtl"
              placeholder="شارك تجربة الطالب ورحلته..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'الحالة' : 'Status'}
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isPublished" className="text-sm text-gray-700">
            {isRTL ? 'منشور (يظهر على الموقع)' : 'Published (visible on website)'}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          {isRTL ? 'رجوع' : 'Back'}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {loading
            ? isRTL
              ? 'جاري الحفظ...'
              : 'Saving...'
            : isRTL
            ? 'حفظ'
            : 'Save'}
        </button>
      </div>
    </form>
  );
}
