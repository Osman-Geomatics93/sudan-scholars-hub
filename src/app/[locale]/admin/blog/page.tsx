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
  Tag,
} from 'lucide-react';
import { SkeletonTable } from '@/components/ui/skeleton';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  author: string;
  authorAr: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  async function fetchBlogPosts() {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const data = await res.json();
        setBlogPosts(data.blogPosts);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string, isPublished: boolean) {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (res.ok) {
        setBlogPosts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isPublished: !isPublished } : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  }

  async function toggleFeatured(id: string, isFeatured: boolean) {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (res.ok) {
        setBlogPosts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isFeatured: !isFeatured } : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  }

  async function deleteBlogPost(id: string) {
    if (
      !confirm(
        isRTL
          ? 'هل أنت متأكد من حذف هذا المقال؟'
          : 'Are you sure you want to delete this blog post?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBlogPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    }
  }

  const filteredPosts = blogPosts.filter((p) =>
    isRTL
      ? p.titleAr.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryAr.toLowerCase().includes(search.toLowerCase())
      : p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Search skeleton */}
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />

        {/* Table skeleton */}
        <SkeletonTable columns={5} rows={8} showHeader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'المدونة' : 'Blog'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isRTL
              ? `${blogPosts.length} مقال`
              : `${blogPosts.length} articles`}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/blog/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          {isRTL ? 'إضافة مقال' : 'Add Article'}
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
          placeholder={isRTL ? 'البحث عن مقال...' : 'Search articles...'}
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
                {isRTL ? 'المقال' : 'Article'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'التصنيف' : 'Category'}
              </th>
              <th
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? 'الوسوم' : 'Tags'}
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
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {isRTL ? post.titleAr : post.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isRTL ? post.authorAr : post.author}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    {isRTL ? post.categoryAr : post.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        post.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.isPublished
                        ? isRTL
                          ? 'منشور'
                          : 'Published'
                        : isRTL
                        ? 'مسودة'
                        : 'Draft'}
                    </span>
                    {post.isFeatured && (
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        togglePublish(post.id, post.isPublished)
                      }
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      title={post.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {post.isPublished ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        toggleFeatured(post.id, post.isFeatured)
                      }
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-amber-600"
                      title={post.isFeatured ? 'Unfeature' : 'Feature'}
                    >
                      {post.isFeatured ? (
                        <StarOff className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/${locale}/admin/blog/${post.id}/edit`}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteBlogPost(post.id)}
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

        {filteredPosts.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            {isRTL ? 'لا توجد مقالات للعرض' : 'No articles to display'}
          </div>
        )}
      </div>
    </div>
  );
}
