'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BlogForm } from '@/components/admin/blog-form';
import { Loader2 } from 'lucide-react';

interface EditBlogPostPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const blogId = pathname.split('/')[4]; // /en/admin/blog/[id]/edit

  const isRTL = locale === 'ar';
  const [blogPost, setBlogPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const res = await fetch(`/api/admin/blog/${blogId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data = await res.json();
        setBlogPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (blogId) {
      fetchBlogPost();
    }
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? 'تعديل المقال' : 'Edit Article'}
        </h1>
        <p className="mt-1 text-gray-600">
          {blogPost?.title}
        </p>
      </div>

      <BlogForm initialData={blogPost} blogId={blogId} />
    </div>
  );
}
