'use client';

import { usePathname } from 'next/navigation';
import { ScholarshipForm } from '@/components/admin/scholarship-form';

export default function NewScholarshipPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? 'إضافة منحة جديدة' : 'Add New Scholarship'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isRTL
            ? 'أضف منحة دراسية جديدة إلى قاعدة البيانات'
            : 'Add a new scholarship to the database'}
        </p>
      </div>

      <ScholarshipForm />
    </div>
  );
}
