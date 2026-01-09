'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  DollarSign,
  FileCheck,
  Languages,
  GraduationCap,
  Building,
  Plane,
  BookOpen,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CountryGuide {
  id: string;
  country: string;
  countryAr: string;
  flag: string;
  image: string;
  description: string;
  descriptionAr: string;
  highlights: { icon: React.ElementType; text: string; textAr: string }[];
  universities: string[];
  costOfLiving: string;
  costOfLivingAr: string;
  language: string;
  languageAr: string;
  visa: string;
  visaAr: string;
}

const countryGuides: CountryGuide[] = [
  {
    id: 'turkey',
    country: 'Turkey',
    countryAr: 'تركيا',
    flag: '🇹🇷',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
    description: 'Turkey offers world-class education with affordable living costs and rich cultural experiences. The Türkiye Burslari scholarship is one of the most comprehensive in the world.',
    descriptionAr: 'تقدم تركيا تعليماً عالمي المستوى بتكاليف معيشة معقولة وتجارب ثقافية غنية. منحة تركيا بورسلاري من أشمل المنح في العالم.',
    highlights: [
      { icon: GraduationCap, text: '200+ Universities', textAr: '+200 جامعة' },
      { icon: DollarSign, text: 'Low Tuition Fees', textAr: 'رسوم دراسية منخفضة' },
      { icon: Languages, text: 'English Programs', textAr: 'برامج بالإنجليزية' },
      { icon: Building, text: 'Modern Facilities', textAr: 'مرافق حديثة' },
    ],
    universities: ['Istanbul University', 'Ankara University', 'Middle East Technical University', 'Boğaziçi University'],
    costOfLiving: '$400-700/month including accommodation',
    costOfLivingAr: '400-700$ شهرياً شاملة السكن',
    language: 'Turkish (English programs widely available)',
    languageAr: 'التركية (برامج إنجليزية متوفرة)',
    visa: 'Student visa required - Scholarship covers application',
    visaAr: 'تأشيرة طالب مطلوبة - المنحة تغطي التقديم',
  },
  {
    id: 'germany',
    country: 'Germany',
    countryAr: 'ألمانيا',
    flag: '🇩🇪',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
    description: 'Germany offers free or low-cost education at public universities with excellent research opportunities. DAAD scholarships are highly prestigious.',
    descriptionAr: 'تقدم ألمانيا تعليماً مجانياً أو منخفض التكلفة في الجامعات الحكومية مع فرص بحثية ممتازة. منح DAAD مرموقة للغاية.',
    highlights: [
      { icon: GraduationCap, text: 'Free Public Unis', textAr: 'جامعات حكومية مجانية' },
      { icon: Building, text: 'Research Excellence', textAr: 'تميز بحثي' },
      { icon: Globe, text: 'Work Opportunities', textAr: 'فرص عمل' },
      { icon: Languages, text: '1,800+ English Programs', textAr: '+1,800 برنامج إنجليزي' },
    ],
    universities: ['TU Munich', 'LMU Munich', 'Heidelberg University', 'Humboldt University'],
    costOfLiving: '€850-1,200/month',
    costOfLivingAr: '850-1,200 يورو شهرياً',
    language: 'German (Many English Master\'s programs)',
    languageAr: 'الألمانية (برامج ماجستير إنجليزية كثيرة)',
    visa: 'Student visa required - Blocked account of €11,208/year',
    visaAr: 'تأشيرة طالب مطلوبة - حساب مجمد 11,208 يورو سنوياً',
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    countryAr: 'ماليزيا',
    flag: '🇲🇾',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
    description: 'Malaysia is an affordable study destination with quality education and a multicultural environment. Many programs are taught entirely in English.',
    descriptionAr: 'ماليزيا وجهة دراسية بأسعار معقولة مع تعليم جيد وبيئة متعددة الثقافات. كثير من البرامج تُدرّس بالإنجليزية.',
    highlights: [
      { icon: DollarSign, text: 'Affordable', textAr: 'أسعار معقولة' },
      { icon: Languages, text: 'English Medium', textAr: 'التدريس بالإنجليزية' },
      { icon: Building, text: 'Quality Education', textAr: 'تعليم جيد' },
      { icon: Globe, text: 'Multicultural', textAr: 'متعددة الثقافات' },
    ],
    universities: ['University of Malaya', 'USM', 'UKM', 'UTM'],
    costOfLiving: '$300-500/month',
    costOfLivingAr: '300-500$ شهرياً',
    language: 'English (widely used in education)',
    languageAr: 'الإنجليزية (مستخدمة على نطاق واسع)',
    visa: 'Student Pass required - University assists with application',
    visaAr: 'تصريح طالب مطلوب - الجامعة تساعد في التقديم',
  },
  {
    id: 'hungary',
    country: 'Hungary',
    countryAr: 'المجر',
    flag: '🇭🇺',
    image: 'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=800&q=80',
    description: 'Hungary\'s Stipendium Hungaricum scholarship covers tuition, accommodation, and monthly stipend. Budapest is a beautiful and affordable European capital.',
    descriptionAr: 'منحة Stipendium Hungaricum المجرية تغطي الرسوم والسكن والراتب الشهري. بودابست عاصمة أوروبية جميلة وبأسعار معقولة.',
    highlights: [
      { icon: GraduationCap, text: 'Full Scholarships', textAr: 'منح كاملة' },
      { icon: Building, text: 'EU Education', textAr: 'تعليم أوروبي' },
      { icon: DollarSign, text: 'Affordable Living', textAr: 'معيشة معقولة' },
      { icon: Languages, text: 'English Programs', textAr: 'برامج إنجليزية' },
    ],
    universities: ['ELTE', 'Budapest University', 'University of Debrecen', 'University of Szeged'],
    costOfLiving: '€500-700/month',
    costOfLivingAr: '500-700 يورو شهرياً',
    language: 'Hungarian (English programs available)',
    languageAr: 'المجرية (برامج إنجليزية متوفرة)',
    visa: 'Student visa required for non-EU students',
    visaAr: 'تأشيرة طالب مطلوبة لغير الأوروبيين',
  },
];

const generalTips = [
  {
    icon: FileCheck,
    title: 'Prepare Documents Early',
    titleAr: 'حضّر المستندات مبكراً',
    description: 'Start gathering transcripts, certificates, and translations months before deadlines.',
    descriptionAr: 'ابدأ بجمع كشوف الدرجات والشهادات والترجمات قبل أشهر من المواعيد النهائية.',
  },
  {
    icon: Languages,
    title: 'Learn the Language',
    titleAr: 'تعلّم اللغة',
    description: 'Even if studying in English, learning the local language enriches your experience.',
    descriptionAr: 'حتى لو درست بالإنجليزية، تعلم اللغة المحلية يُثري تجربتك.',
  },
  {
    icon: DollarSign,
    title: 'Budget Wisely',
    titleAr: 'خطط ماليتك بحكمة',
    description: 'Research actual costs and create a realistic monthly budget before arriving.',
    descriptionAr: 'ابحث عن التكاليف الفعلية وأنشئ ميزانية شهرية واقعية قبل الوصول.',
  },
  {
    icon: Plane,
    title: 'Plan Your Arrival',
    titleAr: 'خطط لوصولك',
    description: 'Arrange accommodation, airport pickup, and essential items before departure.',
    descriptionAr: 'رتّب السكن واستقبال المطار والأشياء الأساسية قبل المغادرة.',
  },
];

export default function StudyGuidesPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
        <Container size="md">
          <div className="text-center">
            <Globe className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {isRTL ? 'أدلة الدراسة' : 'Study Guides'}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {isRTL
                ? 'كل ما تحتاج معرفته عن الدراسة في الخارج - من اختيار الوجهة إلى الاستقرار'
                : 'Everything you need to know about studying abroad - from choosing a destination to settling in'
              }
            </p>
          </div>
        </Container>
      </section>

      {/* Country Guides */}
      <section className="py-12 md:py-16 bg-gray-50">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            {isRTL ? 'أدلة الدول' : 'Country Guides'}
          </h2>
          <div className="space-y-8">
            {countryGuides.map((guide, idx) => (
              <Card key={guide.id} className="overflow-hidden">
                <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Image */}
                  <div className="relative w-full lg:w-2/5 h-64 lg:h-auto">
                    <Image
                      src={guide.image}
                      alt={isRTL ? guide.countryAr : guide.country}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r" />
                    <div className="absolute bottom-4 start-4 text-white">
                      <span className="text-4xl me-2">{guide.flag}</span>
                      <span className="text-2xl font-bold">
                        {isRTL ? guide.countryAr : guide.country}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 lg:p-8">
                    <p className="text-gray-600 mb-6">
                      {isRTL ? guide.descriptionAr : guide.description}
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {guide.highlights.map((h, i) => (
                        <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                          <h.icon className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                          <span className="text-sm text-gray-700">
                            {isRTL ? h.textAr : h.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">
                            {isRTL ? 'تكلفة المعيشة:' : 'Cost of Living:'}
                          </span>
                          <p className="text-gray-600">
                            {isRTL ? guide.costOfLivingAr : guide.costOfLiving}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Languages className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">
                            {isRTL ? 'اللغة:' : 'Language:'}
                          </span>
                          <p className="text-gray-600">
                            {isRTL ? guide.languageAr : guide.language}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 md:col-span-2">
                        <FileCheck className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900">
                            {isRTL ? 'التأشيرة:' : 'Visa:'}
                          </span>
                          <p className="text-gray-600">
                            {isRTL ? guide.visaAr : guide.visa}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Top Universities */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-900">
                        {isRTL ? 'أفضل الجامعات:' : 'Top Universities:'}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {guide.universities.join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* General Tips */}
      <section className="py-12 md:py-16 bg-white">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            {isRTL ? 'نصائح عامة للدراسة بالخارج' : 'General Tips for Studying Abroad'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generalTips.map((tip, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-md transition-shadow">
                <div className="inline-flex p-3 bg-primary-100 rounded-full mb-4">
                  <tip.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {isRTL ? tip.titleAr : tip.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {isRTL ? tip.descriptionAr : tip.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-primary-600">
        <Container size="sm">
          <div className="text-center text-white">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isRTL ? 'ابدأ رحلتك الدراسية' : 'Start Your Study Journey'}
            </h2>
            <p className="text-primary-100 mb-6 max-w-md mx-auto">
              {isRTL
                ? 'اكتشف المنح الدراسية المتاحة في وجهتك المفضلة'
                : 'Discover scholarships available in your preferred destination'
              }
            </p>
            <Link href={`/${locale}/scholarships`}>
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                {isRTL ? 'استكشف المنح' : 'Explore Scholarships'}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180 me-2' : 'ms-2'}`} />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
