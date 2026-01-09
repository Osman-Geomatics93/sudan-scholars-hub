'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Search, Wrench, Stethoscope, Briefcase, Palette, Atom, Scale, GraduationCap, Laptop, ChevronRight, ArrowRight, MapPin, Building2, CheckCircle } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScholarshipCard } from '@/components/features/scholarship-card';
import { SkeletonCard, SkeletonTestimonial } from '@/components/ui/skeleton';
import { AdCarousel } from '@/components/features/ad-carousel';
import { FeaturedPosters } from '@/components/features/featured-posters';
import { stats, categories } from '@/lib/mock-data';
import { getLocalizedField } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Scholarship } from '@/types/scholarship';

const iconMap: Record<string, any> = {
  Wrench,
  Stethoscope,
  Briefcase,
  Palette,
  Atom,
  Scale,
  GraduationCap,
  Laptop,
};

export default function HomePage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'en';
  const t = useTranslations('home');
  const tCategories = useTranslations('categories');
  const tTurkey = useTranslations('turkey');

  const [featuredScholarships, setFeaturedScholarships] = useState<Scholarship[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/${locale}/scholarships?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/${locale}/scholarships`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage(data.message || (locale === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!'));
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || (locale === 'ar' ? 'حدث خطأ' : 'An error occurred'));
      }
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterMessage(locale === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured scholarships and testimonials in parallel
        const [scholarshipsRes, testimonialsRes] = await Promise.all([
          fetch('/api/scholarships/featured'),
          fetch('/api/testimonials'),
        ]);

        if (scholarshipsRes.ok) {
          const data = await scholarshipsRes.json();
          setFeaturedScholarships(data.scholarships.slice(0, 3));
        }

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          setTestimonials(data.testimonials.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-20 lg:py-28 overflow-hidden">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display font-bold text-gray-900 mb-4 md:mb-6 text-balance animate-on-load animate-fade-in-up">
              {t('heroTitle')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4 animate-on-load animate-fade-in-up animation-delay-200">
              {t('heroSubtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 md:mb-12 px-4 animate-on-load animate-scale-in animation-delay-400">
              <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 sm:p-2 rounded-xl shadow-lg">
                <Input
                  placeholder={t('searchPlaceholder')}
                  className="border-0 focus:ring-0 h-12"
                  icon={<Search className="h-5 w-5" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button size="lg" className="shrink-0 w-full sm:w-auto" onClick={handleSearch}>
                  <Search className="h-5 w-5 me-2 sm:me-0 md:me-2" />
                  <span className="sm:hidden md:inline">{locale === 'ar' ? 'بحث' : 'Search'}</span>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 animate-on-load animate-fade-in-up animation-delay-600">
              {stats.map((stat, index) => (
                <div key={stat.labelKey} className="text-center p-3 md:p-0">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">{t(`stats.${stat.labelKey}`)}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Ad Carousel */}
      <section className="py-8 md:py-12 bg-white">
        <Container>
          <AdCarousel locale={locale} autoPlayInterval={5000} />
        </Container>
      </section>

      {/* Featured Posters */}
      <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
        <Container>
          <FeaturedPosters locale={locale} />
        </Container>
      </section>

      {/* Featured Scholarships */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-8 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-gray-900 mb-1 md:mb-2">{t('featuredTitle')}</h2>
              <p className="text-sm md:text-base text-gray-600">{t('featuredSubtitle')}</p>
            </div>
            <Link href={`/${locale}/scholarships`} className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium shrink-0">
              {locale === 'ar' ? 'عرض الكل' : 'View All'}
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  locale={locale}
                />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href={`/${locale}/scholarships`}>
              <Button variant="outline">
                {locale === 'ar' ? 'عرض جميع المنح' : 'View All Scholarships'}
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-gray-900 mb-2 md:mb-3">{t('categoriesTitle')}</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">{t('categoriesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || GraduationCap;
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/scholarships?field=${category.id}`}
                >
                  <Card className="p-4 md:p-6 text-center hover:border-primary-300 hover:shadow-md transition-all group cursor-pointer h-full">
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-100 text-primary-600 mb-3 md:mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      {tCategories(category.id)}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">
                      {category.count} {locale === 'ar' ? 'منحة' : 'scholarships'}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Study in Turkey Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-start">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">{tTurkey('homeSectionTitle')}</h2>
              <p className="text-red-100 text-base md:text-lg mb-6">{tTurkey('homeSectionSubtitle')}</p>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 md:mb-8">
                <div className="bg-white/10 backdrop-blur rounded-lg p-3 md:p-4 text-center">
                  <GraduationCap className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2" />
                  <p className="font-semibold text-xs sm:text-sm md:text-base">{locale === 'ar' ? 'منحة ممولة بالكامل' : 'Fully Funded'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3 md:p-4 text-center">
                  <Building2 className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2" />
                  <p className="font-semibold text-xs sm:text-sm md:text-base">{locale === 'ar' ? '+200 جامعة' : '200+ Unis'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-3 md:p-4 text-center">
                  <CheckCircle className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2" />
                  <p className="font-semibold text-xs sm:text-sm md:text-base">{locale === 'ar' ? 'سكن + راتب' : 'Housing + Stipend'}</p>
                </div>
              </div>

              <Link href={`/${locale}/turkey`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {tTurkey('homeSectionButton')}
                  <ChevronRight className="h-5 w-5 ms-2 rtl:rotate-180" />
                </Button>
              </Link>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  <circle cx="50" cy="50" r="40" />
                  <path d="M50 25 L55 40 L70 40 L58 50 L63 65 L50 55 L37 65 L42 50 L30 40 L45 40 Z" fill="white" />
                </svg>
              </div>
              <Card className="bg-white/10 backdrop-blur border-white/20 p-6">
                <h3 className="text-xl font-semibold mb-4">{locale === 'ar' ? 'منحة تركيا بورسلاري' : 'Türkiye Burslari'}</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>{locale === 'ar' ? 'رسوم دراسية كاملة' : 'Full Tuition Coverage'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>{locale === 'ar' ? 'سكن مجاني' : 'Free Accommodation'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>{locale === 'ar' ? 'راتب شهري' : 'Monthly Stipend'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>{locale === 'ar' ? 'تأمين صحي' : 'Health Insurance'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>{locale === 'ar' ? 'تذاكر طيران' : 'Flight Tickets'}</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <Container>
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-gray-900 mb-2 md:mb-3">{t('howItWorksTitle')}</h2>
            <p className="text-sm md:text-base text-gray-600">{t('howItWorksSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center px-4 md:px-0">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary-600 text-white text-xl md:text-2xl font-bold mb-4 md:mb-6">
                  {step}
                </div>
                <h3 className="text-lg md:text-h4 font-semibold text-gray-900 mb-2 md:mb-3">{t(`step${step}Title`)}</h3>
                <p className="text-sm md:text-base text-gray-600">{t(`step${step}Desc`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      {(loading || testimonials.length > 0) && (
        <section className="py-12 md:py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
          <Container>
            <div className="text-center mb-8 md:mb-12 px-4">
              <h2 className="text-xl sm:text-2xl md:text-h2 font-bold text-gray-900 dark:text-gray-50 mb-2 md:mb-3">{t('testimonialsTitle')}</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t('testimonialsSubtitle')}</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3].map((i) => (
                  <SkeletonTestimonial key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <Image
                        src={testimonial.avatar}
                        alt={getLocalizedField(testimonial, 'name', locale)}
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-10 h-10 md:w-12 md:h-12"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-50 text-sm md:text-base">
                          {getLocalizedField(testimonial, 'name', locale)}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          {getLocalizedField(testimonial, 'university', locale)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 italic">
                      &ldquo;{getLocalizedField(testimonial, 'quote', locale)}&rdquo;
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-12 md:py-16 lg:py-24 bg-primary-600">
        <Container size="md">
          <div className="text-center text-white px-4">
            <h2 className="text-xl sm:text-2xl md:text-h2 font-bold mb-2 md:mb-3">{t('newsletterTitle')}</h2>
            <p className="text-sm md:text-base text-primary-100 mb-6 md:mb-8 max-w-xl mx-auto">
              {t('newsletterSubtitle')}
            </p>

            {newsletterStatus === 'success' ? (
              <div className="bg-white/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-white font-medium text-sm md:text-base">{newsletterMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder={t('newsletterPlaceholder')}
                  className="bg-white/10 border-white/20 text-white placeholder:text-primary-200 focus:ring-white h-12"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="shrink-0 w-full sm:w-auto"
                  disabled={newsletterStatus === 'loading'}
                >
                  {newsletterStatus === 'loading'
                    ? (locale === 'ar' ? 'جاري...' : 'Loading...')
                    : t('newsletterButton')}
                  {newsletterStatus !== 'loading' && <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />}
                </Button>
              </form>
            )}
            {newsletterStatus === 'error' && (
              <p className="mt-3 text-red-200 text-sm">{newsletterMessage}</p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
