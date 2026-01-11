'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { CVWizard } from '@/components/cv-builder/cv-wizard';

export default function NewCVPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const isRTL = locale === 'ar';

  const { data: session, status } = useSession();

  const labels = {
    title: isRTL ? 'إنشاء سيرة ذاتية جديدة' : 'Create New Resume',
    subtitle: isRTL
      ? 'املأ النموذج لإنشاء سيرة ذاتية احترافية'
      : 'Fill out the form to create a professional resume',
    back: isRTL ? 'العودة' : 'Back',
    loginRequired: isRTL
      ? 'يرجى تسجيل الدخول لإنشاء سيرة ذاتية'
      : 'Please log in to create a resume',
    login: isRTL ? 'تسجيل الدخول' : 'Log In',
  };

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    return (
      <MainLayout locale={locale}>
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10">
          <Container size="md" className="pt-24 pb-16">
            <div className="text-center">
              <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {labels.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {labels.loginRequired}
              </p>
              <Link href={`/${locale}/login`}>
                <Button size="lg">{labels.login}</Button>
              </Link>
            </div>
          </Container>
        </div>
      </MainLayout>
    );
  }

  if (status === 'loading') {
    return (
      <MainLayout locale={locale}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout locale={locale}>
      <div
        className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container size="lg" className="pt-20 pb-8 md:pt-24 md:pb-12">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/${locale}/cv-builder`}>
              <Button variant="ghost" className="gap-2 mb-4">
                {isRTL ? (
                  <>
                    {labels.back}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    {labels.back}
                  </>
                )}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {labels.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {labels.subtitle}
            </p>
          </div>

          {/* Wizard */}
          <CVWizard locale={locale} />
        </Container>
      </div>
    </MainLayout>
  );
}
