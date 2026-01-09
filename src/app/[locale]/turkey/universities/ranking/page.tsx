'use client';

import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Trophy, GraduationCap } from 'lucide-react';

export default function UniversityRankingPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16 md:py-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'ترتيب الجامعات التركية' : 'Ranking of Turkish Universities'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? 'تعرف على ترتيب الجامعات التركية محلياً وعالمياً'
                : 'Learn about Turkish university rankings locally and globally'}
            </p>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <GraduationCap className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
              {isRTL ? 'قريباً' : 'Coming Soon'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isRTL
                ? 'نعمل على إضافة ترتيب شامل للجامعات التركية'
                : 'We are working on adding a comprehensive ranking of Turkish universities'}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
