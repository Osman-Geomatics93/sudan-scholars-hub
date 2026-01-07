'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  GripVertical,
  X,
  Save,
  Image as ImageIcon,
} from 'lucide-react';

interface Advertisement {
  id: string;
  title: string;
  titleAr: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface FormData {
  title: string;
  titleAr: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
}

const initialFormData: FormData = {
  title: '',
  titleAr: '',
  imageUrl: '',
  linkUrl: '',
  isActive: true,
  order: 0,
};

export default function AdvertisementsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  async function fetchAdvertisements() {
    try {
      const res = await fetch('/api/admin/advertisements');
      if (res.ok) {
        const data = await res.json();
        setAdvertisements(data.advertisements);
      }
    } catch (error) {
      console.error('Failed to fetch advertisements:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        setAdvertisements((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, isActive: !isActive } : a
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle active:', error);
    }
  }

  async function deleteAdvertisement(id: string) {
    if (
      !confirm(
        isRTL
          ? 'هل أنت متأكد من حذف هذا الإعلان؟'
          : 'Are you sure you want to delete this advertisement?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAdvertisements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete advertisement:', error);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      order: advertisements.length,
    });
    setIsModalOpen(true);
  }

  function openEditModal(ad: Advertisement) {
    setEditingId(ad.id);
    setFormData({
      title: ad.title,
      titleAr: ad.titleAr,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl || '',
      isActive: ad.isActive,
      order: ad.order,
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `/api/admin/advertisements/${editingId}`
        : '/api/admin/advertisements';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchAdvertisements();
        setIsModalOpen(false);
        setFormData(initialFormData);
        setEditingId(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save advertisement');
      }
    } catch (error) {
      console.error('Failed to save advertisement:', error);
      alert('Failed to save advertisement');
    } finally {
      setSaving(false);
    }
  }

  const filteredAdvertisements = advertisements.filter((a) =>
    isRTL
      ? a.titleAr.toLowerCase().includes(search.toLowerCase())
      : a.title.toLowerCase().includes(search.toLowerCase())
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
            {isRTL ? 'الإعلانات' : 'Advertisements'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isRTL
              ? `${advertisements.length} إعلان`
              : `${advertisements.length} advertisements`}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          {isRTL ? 'إضافة إعلان' : 'Add Advertisement'}
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
          placeholder={isRTL ? 'البحث عن إعلان...' : 'Search advertisements...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-lg border border-gray-300 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
          }`}
        />
      </div>

      {/* Grid of advertisements */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAdvertisements.map((ad) => (
          <div
            key={ad.id}
            className="group rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-40 bg-gray-100">
              <Image
                src={ad.imageUrl}
                alt={isRTL ? ad.titleAr : ad.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* Order badge */}
              <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium text-gray-700 flex items-center gap-1">
                <GripVertical className="h-3 w-3" />
                #{ad.order + 1}
              </div>

              {/* Status badge */}
              <div
                className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${
                  ad.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {ad.isActive
                  ? isRTL
                    ? 'نشط'
                    : 'Active'
                  : isRTL
                  ? 'غير نشط'
                  : 'Inactive'}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 truncate">
                {isRTL ? ad.titleAr : ad.title}
              </h3>
              {ad.linkUrl && (
                <a
                  href={ad.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:underline flex items-center gap-1 truncate"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{ad.linkUrl}</span>
                </a>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 border-t mt-4 pt-4">
                <button
                  onClick={() => toggleActive(ad.id, ad.isActive)}
                  className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  title={ad.isActive ? 'Deactivate' : 'Activate'}
                >
                  {ad.isActive ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(ad)}
                  className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteAdvertisement(ad.id)}
                  className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAdvertisements.length === 0 && (
        <div className="rounded-xl bg-white py-12 text-center text-gray-500 shadow-sm">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>{isRTL ? 'لا توجد إعلانات للعرض' : 'No advertisements to display'}</p>
          <button
            onClick={openCreateModal}
            className="mt-4 text-primary-600 hover:underline"
          >
            {isRTL ? 'إضافة إعلان جديد' : 'Add your first advertisement'}
          </button>
        </div>
      )}

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
                    ? 'تعديل الإعلان'
                    : 'Edit Advertisement'
                  : isRTL
                  ? 'إضافة إعلان جديد'
                  : 'Add New Advertisement'}
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
              {/* Title (English) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                />
              </div>

              {/* Title (Arabic) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'} *
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, titleAr: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  dir="rtl"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'رابط الصورة' : 'Image URL'} *
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.imageUrl && (
                  <div className="mt-2 relative h-32 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'رابط الإعلان (اختياري)' : 'Link URL (Optional)'}
                </label>
                <input
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="https://example.com"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الترتيب' : 'Display Order'}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  min="0"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  {isRTL ? 'نشط' : 'Active'}
                </span>
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
