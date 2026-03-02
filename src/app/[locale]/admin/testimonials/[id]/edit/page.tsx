'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TestimonialForm } from '@/components/admin/testimonial-form';
import { Loader2 } from 'lucide-react';

export default function EditTestimonialPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const testimonialId = pathname.split('/')[4]; // /en/admin/testimonials/[id]/edit

  const isRTL = locale === 'ar';
  const [testimonial, setTestimonial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTestimonial() {
      try {
        const res = await fetch(`/api/admin/testimonials/${testimonialId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch testimonial');
        }
        const data = await res.json();
        setTestimonial(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-4 text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {isRTL ? 'تعديل الشهادة' : 'Edit Testimonial'}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {isRTL ? testimonial?.nameAr : testimonial?.name}
        </p>
      </div>

      <TestimonialForm initialData={testimonial} testimonialId={testimonialId} />
    </div>
  );
}
