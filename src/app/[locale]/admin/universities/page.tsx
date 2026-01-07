'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  Trophy,
  X,
  Save,
  ExternalLink,
  Globe,
} from 'lucide-react';

interface University {
  id: string;
  name: string;
  nameAr: string;
  country: string;
  countryAr: string;
  qsRank: number | null;
  timesRank: number | null;
  logo: string | null;
  website: string | null;
  createdAt: string;
}

interface FormData {
  name: string;
  nameAr: string;
  country: string;
  countryAr: string;
  qsRank: string;
  timesRank: string;
  logo: string;
  website: string;
}

const initialFormData: FormData = {
  name: '',
  nameAr: '',
  country: '',
  countryAr: '',
  qsRank: '',
  timesRank: '',
  logo: '',
  website: '',
};

export default function UniversitiesPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchUniversities();
  }, []);

  async function fetchUniversities() {
    try {
      const res = await fetch('/api/admin/universities');
      if (res.ok) {
        const data = await res.json();
        setUniversities(data.universities);
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUniversity(id: string) {
    if (
      !confirm(
        isRTL
          ? 'هل أنت متأكد من حذف هذه الجامعة؟'
          : 'Are you sure you want to delete this university?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/universities/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUniversities((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete university:', error);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  }

  function openEditModal(uni: University) {
    setEditingId(uni.id);
    setFormData({
      name: uni.name,
      nameAr: uni.nameAr,
      country: uni.country,
      countryAr: uni.countryAr,
      qsRank: uni.qsRank?.toString() || '',
      timesRank: uni.timesRank?.toString() || '',
      logo: uni.logo || '',
      website: uni.website || '',
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `/api/admin/universities/${editingId}`
        : '/api/admin/universities';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchUniversities();
        setIsModalOpen(false);
        setFormData(initialFormData);
        setEditingId(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save university');
      }
    } catch (error) {
      console.error('Failed to save university:', error);
      alert('Failed to save university');
    } finally {
      setSaving(false);
    }
  }

  const filteredUniversities = universities.filter((u) =>
    isRTL
      ? u.nameAr.toLowerCase().includes(search.toLowerCase()) ||
        u.countryAr.toLowerCase().includes(search.toLowerCase())
      : u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.country.toLowerCase().includes(search.toLowerCase())
  );

  const getRankBadgeColor = (rank: number | null) => {
    if (!rank) return 'bg-gray-100 text-gray-600';
    if (rank <= 10) return 'bg-yellow-100 text-yellow-700';
    if (rank <= 50) return 'bg-blue-100 text-blue-700';
    if (rank <= 100) return 'bg-green-100 text-green-700';
    if (rank <= 500) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-600';
  };

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
            {isRTL ? 'الجامعات' : 'Universities'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isRTL
              ? `${universities.length} جامعة`
              : `${universities.length} universities`}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          {isRTL ? 'إضافة جامعة' : 'Add University'}
        </button>
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
          placeholder={isRTL ? 'البحث عن جامعة...' : 'Search universities...'}
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
                {isRTL ? 'الجامعة' : 'University'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'البلد' : 'Country'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'تصنيف QS' : 'QS Rank'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'تصنيف Times' : 'Times Rank'}
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
            {filteredUniversities.map((uni) => (
              <tr key={uni.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isRTL ? uni.nameAr : uni.name}
                      </p>
                      {uni.website && (
                        <a
                          href={uni.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          {isRTL ? 'الموقع الإلكتروني' : 'Website'}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {isRTL ? uni.countryAr : uni.country}
                </td>
                <td className="px-6 py-4">
                  {uni.qsRank ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getRankBadgeColor(
                        uni.qsRank
                      )}`}
                    >
                      <Trophy className="h-3 w-3" />#{uni.qsRank}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {uni.timesRank ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getRankBadgeColor(
                        uni.timesRank
                      )}`}
                    >
                      <Trophy className="h-3 w-3" />#{uni.timesRank}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(uni)}
                      className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteUniversity(uni.id)}
                      className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUniversities.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>{isRTL ? 'لا توجد جامعات للعرض' : 'No universities to display'}</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-primary-600 hover:underline"
            >
              {isRTL ? 'إضافة جامعة جديدة' : 'Add your first university'}
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId
                  ? isRTL
                    ? 'تعديل الجامعة'
                    : 'Edit University'
                  : isRTL
                  ? 'إضافة جامعة جديدة'
                  : 'Add New University'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Name (English) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                />
              </div>

              {/* Name (Arabic) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'} *
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameAr: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  dir="rtl"
                  required
                />
              </div>

              {/* Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'البلد (إنجليزي)' : 'Country (English)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'البلد (عربي)' : 'Country (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.countryAr}
                    onChange={(e) =>
                      setFormData({ ...formData, countryAr: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* Rankings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'تصنيف QS' : 'QS Ranking'}
                  </label>
                  <input
                    type="number"
                    value={formData.qsRank}
                    onChange={(e) =>
                      setFormData({ ...formData, qsRank: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    min="1"
                    placeholder="e.g., 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'تصنيف Times' : 'Times Ranking'}
                  </label>
                  <input
                    type="number"
                    value={formData.timesRank}
                    onChange={(e) =>
                      setFormData({ ...formData, timesRank: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    min="1"
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'رابط الشعار' : 'Logo URL'}
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الموقع الإلكتروني' : 'Website'}
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="https://university.edu"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {editingId
                    ? isRTL
                      ? 'حفظ التغييرات'
                      : 'Save Changes'
                    : isRTL
                    ? 'إضافة'
                    : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
