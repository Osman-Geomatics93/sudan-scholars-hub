'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sparkles, LogIn, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { MatcherWizard } from '@/components/matcher';
import type { MatcherProfileInput } from '@/lib/validations/matcher';

export default function MatcherPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const isRTL = locale === 'ar';

  const { data: session, status } = useSession();
  const [existingProfile, setExistingProfile] = useState<MatcherProfileInput | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing profile if user is logged in
  useEffect(() => {
    async function fetchProfile() {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/matcher/profile');
          if (response.ok) {
            const data = await response.json();
            setExistingProfile(data.profile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setLoading(false);
    }

    if (status !== 'loading') {
      fetchProfile();
    }
  }, [status]);

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <MainLayout locale={locale}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <MainLayout locale={locale}>
        <div
          className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <Container size="md" className="py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {isRTL ? 'مطابق المنح الذكي' : 'AI Scholarship Matcher'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                {isRTL
                  ? 'اكتشف المنح الدراسية المناسبة لك باستخدام الذكاء الاصطناعي. قم بتسجيل الدخول للبدء.'
                  : 'Discover scholarships that match your profile using AI. Sign in to get started.'}
              </p>
              <Button
                size="lg"
                onClick={() => router.push(`/${locale}/login?callbackUrl=/${locale}/matcher`)}
                className="gap-2"
              >
                <LogIn className="w-5 h-5" />
                {isRTL ? 'تسجيل الدخول للبدء' : 'Sign In to Get Started'}
              </Button>

              {/* Features */}
              <div className="mt-12 grid md:grid-cols-3 gap-6 text-start">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isRTL ? 'مطابقة ذكية' : 'Smart Matching'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL
                      ? 'نحلل ملفك الشخصي ونقارنه مع متطلبات المنح المختلفة'
                      : 'We analyze your profile and compare it with different scholarship requirements'}
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isRTL ? 'توصيات مخصصة' : 'Personalized Recommendations'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL
                      ? 'احصل على شرح مفصل لماذا كل منحة مناسبة لك'
                      : 'Get detailed explanations of why each scholarship fits you'}
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {isRTL ? 'تصنيف ذكي' : 'Smart Ranking'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL
                      ? 'نرتب المنح حسب درجة التطابق مع ملفك'
                      : 'We rank scholarships by how well they match your profile'}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </MainLayout>
    );
  }

  // Show matcher wizard for authenticated users
  return (
    <MainLayout locale={locale}>
      <div
        className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container size="lg" className="py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {isRTL ? 'مطابق المنح الذكي' : 'AI Scholarship Matcher'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {isRTL
                ? 'أدخل معلوماتك وسنجد لك المنح الأنسب باستخدام الذكاء الاصطناعي'
                : 'Enter your information and we\'ll find the best scholarships for you using AI'}
            </p>
          </div>

          {/* Wizard */}
          <MatcherWizard locale={locale} existingProfile={existingProfile} />
        </Container>
      </div>
    </MainLayout>
  );
}
