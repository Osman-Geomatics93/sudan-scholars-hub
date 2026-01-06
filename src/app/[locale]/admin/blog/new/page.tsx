'use client';

import { usePathname } from 'next/navigation';
import { BlogForm } from '@/components/admin/blog-form';

export default function NewBlogPostPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? 'إضافة مقال جديد' : 'Add New Article'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isRTL
            ? 'أضف مقالاً جديداً إلى المدونة'
            : 'Add a new article to the blog'}
        </p>
      </div>

      <BlogForm />
    </div>
  );
}
