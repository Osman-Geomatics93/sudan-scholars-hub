'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ScholarshipForm } from '@/components/admin/scholarship-form';
import { Loader2 } from 'lucide-react';

interface EditScholarshipPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function EditScholarshipPage({ params }: EditScholarshipPageProps) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const scholarshipId = pathname.split('/')[4]; // /en/admin/scholarships/[id]/edit

  const isRTL = locale === 'ar';
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchScholarship() {
      try {
        const res = await fetch(`/api/admin/scholarships/${scholarshipId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch scholarship');
        }
        const data = await res.json();
        setScholarship(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (scholarshipId) {
      fetchScholarship();
    }
  }, [scholarshipId]);

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
          {isRTL ? 'تعديل المنحة' : 'Edit Scholarship'}
        </h1>
        <p className="mt-1 text-gray-600">
          {scholarship?.title}
        </p>
      </div>

      <ScholarshipForm initialData={scholarship} scholarshipId={scholarshipId} />
    </div>
  );
}
