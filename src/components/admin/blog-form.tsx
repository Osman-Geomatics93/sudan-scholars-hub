'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Save, ArrowLeft, Loader2, X, Plus } from 'lucide-react';

interface BlogFormData {
  title: string;
  titleAr: string;
  slug: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  category: string;
  categoryAr: string;
  author: string;
  authorAr: string;
  readTime: string;
  readTimeAr: string;
  image: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  blogId?: string;
}

const CATEGORIES = [
  { en: 'Application Tips', ar: 'نصائح التقديم' },
  { en: 'Scholarships', ar: 'المنح الدراسية' },
  { en: 'Test Prep', ar: 'التحضير للاختبارات' },
  { en: 'Study Abroad', ar: 'الدراسة بالخارج' },
  { en: 'Interview', ar: 'المقابلات' },
  { en: 'Success Stories', ar: 'قصص نجاح' },
];

export function BlogForm({ initialData, blogId }: BlogFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';
  const isEditing = !!blogId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    titleAr: initialData?.titleAr || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    excerptAr: initialData?.excerptAr || '',
    content: initialData?.content || '',
    contentAr: initialData?.contentAr || '',
    category: initialData?.category || 'Application Tips',
    categoryAr: initialData?.categoryAr || 'نصائح التقديم',
    author: initialData?.author || 'Sudan Scholars Hub',
    authorAr: initialData?.authorAr || 'مركز منح السودان',
    readTime: initialData?.readTime || '5 min read',
    readTimeAr: initialData?.readTimeAr || '5 دقائق قراءة',
    image: initialData?.image || '',
    tags: initialData?.tags || [],
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

  const handleCategoryChange = (categoryEn: string) => {
    const category = CATEGORIES.find((c) => c.en === categoryEn);
    if (category) {
      setFormData((prev) => ({
        ...prev,
        category: category.en,
        categoryAr: category.ar,
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/admin/blog/${blogId}`
        : '/api/admin/blog';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save blog post');
      }

      router.push(`/${locale}/admin/blog`);
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
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.en} value={cat.en}>
                  {cat.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Author (English)
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              المؤلف (عربي)
            </label>
            <input
              type="text"
              value={formData.authorAr}
              onChange={(e) => setFormData({ ...formData, authorAr: e.target.value })}
              dir="rtl"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Read Time (English)
            </label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              placeholder="e.g., 5 min read"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              وقت القراءة (عربي)
            </label>
            <input
              type="text"
              value={formData.readTimeAr}
              onChange={(e) => setFormData({ ...formData, readTimeAr: e.target.value })}
              dir="rtl"
              placeholder="مثال: 5 دقائق قراءة"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'المقتطف' : 'Excerpt'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Excerpt (English) *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows={3}
              placeholder="Brief summary of the article..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              المقتطف (عربي) *
            </label>
            <textarea
              value={formData.excerptAr}
              onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
              required
              rows={3}
              dir="rtl"
              placeholder="ملخص موجز للمقال..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'المحتوى' : 'Content'}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Content (English) * <span className="text-gray-400 text-xs">(Markdown supported)</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={12}
              placeholder="# Article Title&#10;&#10;Write your article content here...&#10;&#10;## Section 1&#10;&#10;Your content..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              المحتوى (عربي) * <span className="text-gray-400 text-xs">(يدعم Markdown)</span>
            </label>
            <textarea
              value={formData.contentAr}
              onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
              required
              rows={12}
              dir="rtl"
              placeholder="# عنوان المقال&#10;&#10;اكتب محتوى المقال هنا...&#10;&#10;## القسم الأول&#10;&#10;المحتوى..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isRTL ? 'الوسوم' : 'Tags'}
        </h2>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder={isRTL ? 'أضف وسم...' : 'Add a tag...'}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              {isRTL ? 'إضافة' : 'Add'}
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full p-0.5 hover:bg-gray-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
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
                {isRTL ? 'مقال مميز' : 'Featured Article'}
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
                {isRTL ? 'منشور' : 'Published'}
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
