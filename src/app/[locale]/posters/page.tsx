import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Image as ImageIcon } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { PosterGallery } from '@/components/features/poster-gallery';

interface PostersPageProps {
  params: { locale: string };
}

export default function PostersPage({ params: { locale } }: PostersPageProps) {
  setRequestLocale(locale);
  const t = useTranslations('posters');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              {t('heroSubtitle')}
            </p>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-16">
        <Container>
          <PosterGallery locale={locale} showFilter />
        </Container>
      </section>
    </main>
  );
}
