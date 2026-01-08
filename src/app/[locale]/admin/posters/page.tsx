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
  Star,
  Link as LinkIcon,
} from 'lucide-react';

type PosterCategory =
  | 'SCHOLARSHIP_INFO'
  | 'TURKEY'
  | 'EUROPE'
  | 'USA_CANADA'
  | 'ASIA'
  | 'APPLICATION_TIPS'
  | 'DEADLINE_REMINDER'
  | 'SUCCESS_STORIES'
  | 'GENERAL';

interface Scholarship {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
}

interface Poster {
  id: string;
  title: string;
  titleAr: string;
  description: string | null;
  descriptionAr: string | null;
  imageUrl: string;
  category: PosterCategory;
  scholarshipId: string | null;
  externalUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  scholarship?: Scholarship | null;
}

interface FormData {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  imageUrl: string;
  category: PosterCategory;
  scholarshipId: string;
  externalUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

const categories: { value: PosterCategory; labelEn: string; labelAr: string }[] = [
  { value: 'SCHOLARSHIP_INFO', labelEn: 'Scholarship Info', labelAr: 'معلومات المنح' },
  { value: 'TURKEY', labelEn: 'Turkey Scholarships', labelAr: 'منح تركيا' },
  { value: 'EUROPE', labelEn: 'European Scholarships', labelAr: 'المنح الأوروبية' },
  { value: 'USA_CANADA', labelEn: 'USA & Canada', labelAr: 'أمريكا وكندا' },
  { value: 'ASIA', labelEn: 'Asian Scholarships', labelAr: 'المنح الآسيوية' },
  { value: 'APPLICATION_TIPS', labelEn: 'Application Tips', labelAr: 'نصائح التقديم' },
  { value: 'DEADLINE_REMINDER', labelEn: 'Deadline Reminders', labelAr: 'تذكير بالمواعيد' },
  { value: 'SUCCESS_STORIES', labelEn: 'Success Stories', labelAr: 'قصص نجاح' },
  { value: 'GENERAL', labelEn: 'General', labelAr: 'عام' },
];

const initialFormData: FormData = {
  title: '',
  titleAr: '',
  description: '',
  descriptionAr: '',
  imageUrl: '',
  category: 'GENERAL',
  scholarshipId: '',
  externalUrl: '',
  isActive: true,
  isFeatured: false,
  order: 0,
};

export default function PostersPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [posters, setPosters] = useState<Poster[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<PosterCategory | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchPosters();
    fetchScholarships();
  }, []);

  async function fetchPosters() {
    try {
      const res = await fetch('/api/admin/posters');
      if (res.ok) {
        const data = await res.json();
        setPosters(data.posters);
      }
    } catch (error) {
      console.error('Failed to fetch posters:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchScholarships() {
    try {
      const res = await fetch('/api/scholarships?limit=100');
      if (res.ok) {
        const data = await res.json();
        setScholarships(data.scholarships || []);
      }
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/posters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        setPosters((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !isActive } : p))
        );
      }
    } catch (error) {
      console.error('Failed to toggle active:', error);
    }
  }

  async function toggleFeatured(id: string, isFeatured: boolean) {
    try {
      const res = await fetch(`/api/admin/posters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (res.ok) {
        setPosters((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !isFeatured } : p))
        );
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  }

  async function deletePoster(id: string) {
    if (
      !confirm(
        isRTL ? 'هل أنت متأكد من حذف هذا الملصق؟' : 'Are you sure you want to delete this poster?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/posters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosters((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete poster:', error);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    setFormData({
      ...initialFormData,
      order: posters.length,
    });
    setIsModalOpen(true);
  }

  function openEditModal(poster: Poster) {
    setEditingId(poster.id);
    setFormData({
      title: poster.title,
      titleAr: poster.titleAr,
      description: poster.description || '',
      descriptionAr: poster.descriptionAr || '',
      imageUrl: poster.imageUrl,
      category: poster.category,
      scholarshipId: poster.scholarshipId || '',
      externalUrl: poster.externalUrl || '',
      isActive: poster.isActive,
      isFeatured: poster.isFeatured,
      order: poster.order,
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/admin/posters/${editingId}` : '/api/admin/posters';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        scholarshipId: formData.scholarshipId || null,
        externalUrl: formData.externalUrl || null,
        description: formData.description || null,
        descriptionAr: formData.descriptionAr || null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchPosters();
        setIsModalOpen(false);
        setFormData(initialFormData);
        setEditingId(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save poster');
      }
    } catch (error) {
      console.error('Failed to save poster:', error);
      alert('Failed to save poster');
    } finally {
      setSaving(false);
    }
  }

  const filteredPosters = posters.filter((p) => {
    const matchesSearch = isRTL
      ? p.titleAr.toLowerCase().includes(search.toLowerCase())
      : p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: PosterCategory) => {
    const cat = categories.find((c) => c.value === category);
    return isRTL ? cat?.labelAr : cat?.labelEn;
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
            {isRTL ? 'الملصقات' : 'Posters'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isRTL ? `${posters.length} ملصق` : `${posters.length} posters`}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          {isRTL ? 'إضافة ملصق' : 'Add Poster'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 ${
              isRTL ? 'right-3' : 'left-3'
            }`}
          />
          <input
            type="text"
            placeholder={isRTL ? 'البحث عن ملصق...' : 'Search posters...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-lg border border-gray-300 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
              isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as PosterCategory | '')}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">{isRTL ? 'جميع الفئات' : 'All Categories'}</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {isRTL ? cat.labelAr : cat.labelEn}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of posters */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPosters.map((poster) => (
          <div
            key={poster.id}
            className="group rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden"
          >
            {/* Image - Portrait aspect ratio */}
            <div className="relative aspect-[3/4] bg-gray-100">
              <Image
                src={poster.imageUrl}
                alt={isRTL ? poster.titleAr : poster.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* Order badge */}
              <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium text-gray-700 flex items-center gap-1">
                <GripVertical className="h-3 w-3" />
                #{poster.order + 1}
              </div>

              {/* Featured badge */}
              {poster.isFeatured && (
                <div className="absolute top-2 right-2 bg-amber-500 rounded-full p-1">
                  <Star className="h-3 w-3 text-white fill-white" />
                </div>
              )}

              {/* Status badge */}
              <div
                className={`absolute bottom-2 left-2 rounded-full px-2 py-1 text-xs font-medium ${
                  poster.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {poster.isActive
                  ? isRTL ? 'نشط' : 'Active'
                  : isRTL ? 'غير نشط' : 'Inactive'}
              </div>

              {/* Category badge */}
              <div className="absolute bottom-2 right-2 bg-primary-500 text-white rounded-full px-2 py-1 text-xs font-medium">
                {getCategoryLabel(poster.category)}
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                {isRTL ? poster.titleAr : poster.title}
              </h3>

              {poster.scholarship && (
                <div className="flex items-center gap-1 text-xs text-primary-600 mb-2">
                  <LinkIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {isRTL ? poster.scholarship.titleAr : poster.scholarship.title}
                  </span>
                </div>
              )}

              {poster.externalUrl && !poster.scholarship && (
                <a
                  href={poster.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 mb-2"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{poster.externalUrl}</span>
                </a>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between border-t pt-3 mt-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFeatured(poster.id, poster.isFeatured)}
                    className={`rounded p-1.5 transition-colors ${
                      poster.isFeatured
                        ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-amber-500'
                    }`}
                    title={poster.isFeatured ? 'Remove from featured' : 'Add to featured'}
                  >
                    <Star className={`h-4 w-4 ${poster.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleActive(poster.id, poster.isActive)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title={poster.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {poster.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(poster)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deletePoster(poster.id)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosters.length === 0 && (
        <div className="rounded-xl bg-white py-12 text-center text-gray-500 shadow-sm">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>{isRTL ? 'لا توجد ملصقات للعرض' : 'No posters to display'}</p>
          <button onClick={openCreateModal} className="mt-4 text-primary-600 hover:underline">
            {isRTL ? 'إضافة ملصق جديد' : 'Add your first poster'}
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId
                  ? isRTL ? 'تعديل الملصق' : 'Edit Poster'
                  : isRTL ? 'إضافة ملصق جديد' : 'Add New Poster'}
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
              <div className="grid md:grid-cols-2 gap-4">
                {/* Title (English) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Description (English) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                {/* Description (Arabic) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'رابط الصورة' : 'Image URL'} *
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="https://example.com/poster.jpg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isRTL ? 'استخدم صور عمودية (نسبة 3:4)' : 'Use portrait images (3:4 ratio)'}
                </p>
                {formData.imageUrl && (
                  <div className="mt-2 relative w-32 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
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

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'الفئة' : 'Category'} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as PosterCategory })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {isRTL ? cat.labelAr : cat.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Link to Scholarship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'ربط بمنحة (اختياري)' : 'Link to Scholarship (Optional)'}
                </label>
                <select
                  value={formData.scholarshipId}
                  onChange={(e) => setFormData({ ...formData, scholarshipId: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">{isRTL ? 'لا يوجد ربط' : 'No linked scholarship'}</option>
                  {scholarships.map((s) => (
                    <option key={s.id} value={s.id}>
                      {isRTL ? s.titleAr : s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* External URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isRTL ? 'رابط خارجي (اختياري)' : 'External URL (Optional)'}
                </label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="https://example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isRTL ? 'يستخدم إذا لم يتم الربط بمنحة' : 'Used if not linking to a scholarship'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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

                {/* Toggles */}
                <div className="space-y-3">
                  {/* Featured Toggle */}
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({ ...formData, isFeatured: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700">
                      {isRTL ? 'مميز في الصفحة الرئيسية' : 'Featured on Homepage'}
                    </span>
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
                </div>
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
                    ? isRTL ? 'حفظ التغييرات' : 'Save Changes'
                    : isRTL ? 'إضافة' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
