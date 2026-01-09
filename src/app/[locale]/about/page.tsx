import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Users, Globe, Award, BookOpen } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { teamMembers } from '@/lib/mock-data';
import { getLocalizedField } from '@/lib/utils';

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('about');

  const impactStats = [
    { value: '10,000+', label: locale === 'ar' ? 'طالب مستفيد' : 'Students Helped', icon: Users },
    { value: '50+', label: locale === 'ar' ? 'دولة' : 'Countries', icon: Globe },
    { value: '500+', label: locale === 'ar' ? 'منحة' : 'Scholarships', icon: Award },
    { value: '200+', label: locale === 'ar' ? 'جامعة' : 'Universities', icon: BookOpen },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-display text-gray-900 mb-6">{t('heroTitle')}</h1>
            <p className="text-xl text-gray-600">{t('heroSubtitle')}</p>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <Container size="md">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 text-gray-900 mb-4">{t('missionTitle')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('missionText')}</p>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                alt="Students studying"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="section-padding bg-gray-50">
        <Container size="md">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden order-2 md:order-1">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                alt="Team collaboration"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-h2 text-gray-900 mb-4">{t('storyTitle')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('storyText')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Stats */}
      <section className="section-padding bg-primary-600">
        <Container>
          <h2 className="text-h2 text-white text-center mb-12">{t('impactTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="h-10 w-10 mx-auto mb-4 opacity-80" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gray-900 mb-3">{t('teamTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-6 text-center">
                <Image
                  src={member.avatar}
                  alt={getLocalizedField(member, 'name', locale)}
                  width={96}
                  height={96}
                  className="rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {getLocalizedField(member, 'name', locale)}
                </h3>
                <p className="text-primary-600 text-sm mb-3">
                  {getLocalizedField(member, 'role', locale)}
                </p>
                <p className="text-gray-600 text-sm">
                  {getLocalizedField(member, 'bio', locale)}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Partners */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center">
            <h2 className="text-h2 text-gray-900 mb-8">{t('partnersTitle')}</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['University of Oxford', 'Harvard', 'MIT', 'Stanford', 'Cambridge'].map((partner) => (
                <div
                  key={partner}
                  className="text-xl font-bold text-gray-400"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
