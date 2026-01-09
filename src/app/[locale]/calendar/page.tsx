'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { ScholarshipCalendar } from '@/components/features/scholarship-calendar';
import { SkeletonCalendar } from '@/components/ui/skeleton';

interface CalendarScholarship {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  university: string;
  universityAr: string;
  country: string;
  countryAr: string;
  deadline: string;
  image: string;
  fundingType: string;
  levels: string[];
}

export default function CalendarPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [scholarships, setScholarships] = useState<CalendarScholarship[]>([]);
  const [loading, setLoading] = useState(true);

  const isRTL = locale === 'ar';

  useEffect(() => {
    async function fetchScholarships() {
      try {
        const res = await fetch('/api/scholarships/calendar');
        if (res.ok) {
          const data = await res.json();
          setScholarships(data.scholarships);
        }
      } catch (error) {
        console.error('Failed to fetch scholarships:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchScholarships();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-8 md:pt-32 md:pb-12">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            {isRTL ? 'تقويم المنح الدراسية' : 'Scholarship Calendar'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRTL
              ? 'تتبع جميع المواعيد النهائية للمنح الدراسية في مكان واحد'
              : 'Track all scholarship deadlines in one place'}
          </p>
        </div>

        {loading ? (
          <SkeletonCalendar />
        ) : (
          <ScholarshipCalendar scholarships={scholarships} locale={locale} />
        )}
      </Container>
    </div>
  );
}
