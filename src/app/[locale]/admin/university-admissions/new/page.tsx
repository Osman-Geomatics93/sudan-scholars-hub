'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UniversityAdmissionForm } from '@/components/admin/university-admission-form';

export default function NewUniversityAdmissionPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/admin/university-admissions`}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Add University Admission
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Create a new university admission entry for the calendar
          </p>
        </div>
      </div>

      {/* Form */}
      <UniversityAdmissionForm />
    </div>
  );
}
