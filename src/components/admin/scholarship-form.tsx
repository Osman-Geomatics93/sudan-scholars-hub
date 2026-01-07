'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Search } from 'lucide-react';
import { COUNTRIES } from '@/lib/constants/countries';

interface ScholarshipFormData {
  title: string;
  titleAr: string;
  slug: string;
  university: string;
  universityAr: string;
  country: string;
  countryAr: string;
  countryCode: string;
  description: string;
  descriptionAr: string;
  eligibility: string[];
  eligibilityAr: string[];
  benefits: string[];
  benefitsAr: string[];
  requirements: string[];
  requirementsAr: string[];
  howToApply: string;
  howToApplyAr: string;
  duration: string;
  durationAr: string;
  deadline: string;
  fundingType: 'FULLY_FUNDED' | 'PARTIALLY_FUNDED';
  levels: ('BACHELOR' | 'MASTER' | 'PHD')[];
  field: string;
  applicationUrl: string;
  image: string;
  isFeatured: boolean;
  isPublished: boolean;
}

interface ScholarshipFormProps {
  initialData?: Partial<ScholarshipFormData>;
  scholarshipId?: string;
}

const FIELDS = [
  'ENGINEERING',
  'MEDICINE',
  'BUSINESS',
  'ARTS',
  'SCIENCE',
  'LAW',
  'EDUCATION',
  'TECHNOLOGY',
];


export function ScholarshipForm({ initialData, scholarshipId }: ScholarshipFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';
  const isEditing = !!scholarshipId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const query = countrySearch.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.nameAr.includes(countrySearch) ||
        c.code.includes(query)
    );
  }, [countrySearch]);

  const [formData, setFormData] = useState<ScholarshipFormData>({
    title: initialData?.title || '',
    titleAr: initialData?.titleAr || '',
    slug: initialData?.slug || '',
    university: initialData?.university || '',
    universityAr: initialData?.universityAr || '',
    country: initialData?.country || '',
    countryAr: initialData?.countryAr || '',
    countryCode: initialData?.countryCode || '',
    description: initialData?.description || '',
    descriptionAr: initialData?.descriptionAr || '',
    eligibility: initialData?.eligibility || [''],
    eligibilityAr: initialData?.eligibilityAr || [''],
    benefits: initialData?.benefits || [''],
    benefitsAr: initialData?.benefitsAr || [''],
    requirements: initialData?.requirements || [''],
    requirementsAr: initialData?.requirementsAr || [''],
    howToApply: initialData?.howToApply || '',
    howToApplyAr: initialData?.howToApplyAr || '',
    duration: initialData?.duration || '',
    durationAr: initialData?.durationAr || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
    fundingType: initialData?.fundingType || 'FULLY_FUNDED',
    levels: initialData?.levels || ['MASTER'],
    field: initialData?.field || 'ENGINEERING',
    applicationUrl: initialData?.applicationUrl || '',
    image: initialData?.image || '',
    isFeatured: initialData?.isFeatured || false,
    isPublished: initialData?.isPublished || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (country) {
      setFormData((prev) => ({
        ...prev,
        countryCode: country.code,
        country: country.name,
        countryAr: country.nameAr,
      }));
    }
  };

  const handleArrayChange = (
    field: 'eligibility' | 'eligibilityAr' | 'benefits' | 'benefitsAr' | 'requirements' | 'requirementsAr',
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: 'eligibility' | 'eligibilityAr' | 'benefits' | 'benefitsAr' | 'requirements' | 'requirementsAr') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (
    field: 'eligibility' | 'eligibilityAr' | 'benefits' | 'benefitsAr' | 'requirements' | 'requirementsAr',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/admin/scholarships/${scholarshipId}`
        : '/api/admin/scholarships';

      const method = isEditing ? 'PUT' : 'POST';

      const dataToSend = {
        ...formData,
        eligibility: formData.eligibility.filter((e) => e.trim()),
        eligibilityAr: formData.eligibilityAr.filter((e) => e.trim()),
        benefits: formData.benefits.filter((b) => b.trim()),
        benefitsAr: formData.benefitsAr.filter((b) => b.trim()),
        requirements: formData.requirements.filter((r) => r.trim()),
        requirementsAr: formData.requirementsAr.filter((r) => r.trim()),
        deadline: new Date(formData.deadline).toISOString(),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save scholarship');
      }

      router.push(`/${locale}/admin/scholarships`);
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

      {/* Basic Info */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title (English) *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              العنوان (عربي) *
            </label>
            <input
              type="text"
              value={formData.titleAr}
              onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
              required
              dir="rtl"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Country *
            </label>
            <div className="relative">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <select
                value={formData.countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                required
                size={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Select Country</option>
                {filteredCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name} ({country.nameAr})
                  </option>
                ))}
              </select>
              {formData.country && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected: {formData.country} / {formData.countryAr}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              University (English) *
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              required
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'الوصف' : 'Description'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description (English) *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              الوصف (عربي) *
            </label>
            <textarea
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              required
              rows={4}
              dir="rtl"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Eligibility */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'شروط الأهلية' : 'Eligibility'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Eligibility (English)
            </label>
            {formData.eligibility.map((item, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('eligibility', index, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('eligibility', index)}
                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('eligibility')}
              className="mt-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              + Add Item
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              شروط الأهلية (عربي)
            </label>
            {formData.eligibilityAr.map((item, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('eligibilityAr', index, e.target.value)}
                  dir="rtl"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('eligibilityAr', index)}
                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('eligibilityAr')}
              className="mt-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              + إضافة
            </button>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'المزايا' : 'Benefits'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Benefits (English)
            </label>
            {formData.benefits.map((item, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('benefits', index)}
                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('benefits')}
              className="mt-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              + Add Item
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              المزايا (عربي)
            </label>
            {formData.benefitsAr.map((item, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('benefitsAr', index, e.target.value)}
                  dir="rtl"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('benefitsAr', index)}
                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('benefitsAr')}
              className="mt-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              + إضافة
            </button>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'المتطلبات' : 'Requirements'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Requirements (English)
            </label>
            {formData.requirements.map((item, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('requirements', index)}
                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="mt-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              + Add Item
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              المتطلبات (عربي)
            </label>
            {formData.requirementsAr.map((item, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('requirementsAr', index, e.target.value)}
                  dir="rtl"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('requirementsAr', index)}
                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirementsAr')}
              className="mt-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              + إضافة
            </button>
          </div>
        </div>
      </div>

      {/* How to Apply */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'كيفية التقديم' : 'How to Apply'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              How to Apply (English) *
            </label>
            <textarea
              value={formData.howToApply}
              onChange={(e) => setFormData({ ...formData, howToApply: e.target.value })}
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              كيفية التقديم (عربي) *
            </label>
            <textarea
              value={formData.howToApplyAr}
              onChange={(e) => setFormData({ ...formData, howToApplyAr: e.target.value })}
              required
              rows={3}
              dir="rtl"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Duration & Deadline */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'المدة والموعد النهائي' : 'Duration & Deadline'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Duration (English) *
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
              placeholder="e.g., 2 years"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              المدة (عربي) *
            </label>
            <input
              type="text"
              value={formData.durationAr}
              onChange={(e) => setFormData({ ...formData, durationAr: e.target.value })}
              required
              dir="rtl"
              placeholder="مثال: سنتان"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Deadline *
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Application URL *
            </label>
            <input
              type="url"
              value={formData.applicationUrl}
              onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'التصنيف' : 'Classification'}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Funding Type *
            </label>
            <select
              value={formData.fundingType}
              onChange={(e) => setFormData({ ...formData, fundingType: e.target.value as any })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="FULLY_FUNDED">Fully Funded</option>
              <option value="PARTIALLY_FUNDED">Partially Funded</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Study Levels * (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-4">
              {(['BACHELOR', 'MASTER', 'PHD'] as const).map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.levels.includes(level)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, levels: [...formData.levels, level] });
                      } else {
                        setFormData({ ...formData, levels: formData.levels.filter((l) => l !== level) });
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    {level === 'BACHELOR' ? 'Bachelor (BSc)' : level === 'MASTER' ? 'Master (MSc)' : 'PhD'}
                  </span>
                </label>
              ))}
            </div>
            {formData.levels.length === 0 && (
              <p className="mt-1 text-sm text-red-500">Please select at least one level</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Field of Study *
            </label>
            <select
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {FIELDS.map((field) => (
                <option key={field} value={field}>
                  {field.charAt(0) + field.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Image & Status */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'الصورة والحالة' : 'Image & Status'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image URL *
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 h-32 w-full rounded-lg object-cover"
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">
                {isRTL ? 'منحة مميزة' : 'Featured Scholarship'}
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isPublished" className="text-sm text-gray-700">
                {isRTL ? 'منشورة' : 'Published'}
              </label>
            </div>
          </div>
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
