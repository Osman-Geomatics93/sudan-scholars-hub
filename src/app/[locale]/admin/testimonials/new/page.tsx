'use client';

import { usePathname } from 'next/navigation';
import { TestimonialForm } from '@/components/admin/testimonial-form';

export default function NewTestimonialPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? 'إضافة شهادة جديدة' : 'Add New Testimonial'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isRTL
            ? 'أضف شهادة طالب جديدة'
            : 'Add a new student testimonial'}
        </p>
      </div>

      <TestimonialForm />
    </div>
  );
}
