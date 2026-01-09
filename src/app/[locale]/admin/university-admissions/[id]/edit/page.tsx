'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UniversityAdmissionForm } from '@/components/admin/university-admission-form';
import { Skeleton } from '@/components/ui/skeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditUniversityAdmissionPage({ params }: PageProps) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [admission, setAdmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [admissionId, setAdmissionId] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      setAdmissionId(resolvedParams.id);

      try {
        const res = await fetch(`/api/admin/university-admissions/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch admission');
        }
        const data = await res.json();
        setAdmission(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/admin/university-admissions`}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Error</h1>
        </div>
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

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
            Edit University Admission
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {admission?.universityNameEn}
          </p>
        </div>
      </div>

      {/* Form */}
      <UniversityAdmissionForm initialData={admission} admissionId={admissionId} />
    </div>
  );
}
