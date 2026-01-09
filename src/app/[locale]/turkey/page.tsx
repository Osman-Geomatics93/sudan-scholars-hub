'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {
  GraduationCap,
  DollarSign,
  Globe2,
  TrendingUp,
  CheckCircle,
  Building2,
  FileText,
  Home,
  Bus,
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Download,
  Award,
  BookOpen,
  CheckSquare,
  Lightbulb,
  Users,
  FileCheck,
  FileType,
  School,
  PlayCircle,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrackedDownload } from '@/components/features/tracked-download';

export default function TurkeyPage() {
  const locale = useLocale();
  const t = useTranslations('turkey');
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const whyTurkeyCards = [
    { icon: GraduationCap, titleKey: 'why1Title', descKey: 'why1Desc' },
    { icon: DollarSign, titleKey: 'why2Title', descKey: 'why2Desc' },
    { icon: Globe2, titleKey: 'why3Title', descKey: 'why3Desc' },
    { icon: TrendingUp, titleKey: 'why4Title', descKey: 'why4Desc' },
  ];

  const benefits = [
    t('benefit1'),
    t('benefit2'),
    t('benefit3'),
    t('benefit4'),
    t('benefit5'),
    t('benefit6'),
  ];

  const eligibility = [
    t('eligibility1'),
    t('eligibility2'),
    t('eligibility3'),
    t('eligibility4'),
  ];

  const universities = [
    { name: t('uni1'), logo: 'ITU' },
    { name: t('uni2'), logo: 'METU' },
    { name: t('uni3'), logo: 'KTU' },
    { name: t('uni4'), logo: 'BU' },
    { name: t('uni5'), logo: 'AU' },
  ];

  const livingCards = [
    { icon: Home, titleKey: 'living1Title', descKey: 'living1Desc' },
    { icon: Bus, titleKey: 'living2Title', descKey: 'living2Desc' },
    { icon: UtensilsCrossed, titleKey: 'living3Title', descKey: 'living3Desc' },
  ];

  // Single comprehensive guide file for all levels
  const mainGuideFile = '/downloads/turkey/turkiye-burslari-guide.pdf';

  // Available files (files that actually exist)
  const availableFiles = [
    '/downloads/turkey/turkiye-burslari-guide.pdf',
    '/downloads/turkey/application-tips.pdf',
    '/downloads/turkey/document-checklist.pdf',
    '/downloads/turkey/transcript-form.docx',
    '/downloads/turkey/transcript-form.pdf',
    '/downloads/turkey/english-certificate.docx',
    '/downloads/turkey/english-certificate.pdf',
    '/downloads/turkey/validation-letter-msc.pdf',
    '/downloads/turkey/validation-letter-phd.pdf',
    '/downloads/turkey/recommendation-letter-bsc.pdf',
    '/downloads/turkey/recommendation-letter-msc.pdf',
    '/downloads/turkey/recommendation-letter-phd.pdf',
  ];

  const isFileAvailable = (filePath: string) => availableFiles.includes(filePath);

  const downloadResources = [
    {
      id: 'bachelor-guide',
      titleKey: 'bachelorGuide',
      descKey: 'bachelorGuideDesc',
      icon: GraduationCap,
      file: mainGuideFile,
      color: 'blue',
    },
    {
      id: 'master-guide',
      titleKey: 'masterGuide',
      descKey: 'masterGuideDesc',
      icon: Award,
      file: mainGuideFile,
      color: 'green',
    },
    {
      id: 'phd-guide',
      titleKey: 'phdGuide',
      descKey: 'phdGuideDesc',
      icon: BookOpen,
      file: mainGuideFile,
      color: 'purple',
    },
    {
      id: 'checklist',
      titleKey: 'checklist',
      descKey: 'checklistDesc',
      icon: CheckSquare,
      file: '/downloads/turkey/document-checklist.pdf',
      color: 'orange',
    },
    {
      id: 'tips',
      titleKey: 'tips',
      descKey: 'tipsDesc',
      icon: Lightbulb,
      file: '/downloads/turkey/application-tips.pdf',
      color: 'yellow',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-200' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-200' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', hover: 'hover:bg-yellow-200' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'hover:bg-teal-200' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'hover:bg-indigo-200' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', hover: 'hover:bg-rose-200' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', hover: 'hover:bg-cyan-200' },
  };

  // Student Forms
  const secondarySchoolForm = {
    id: 'transcript-form',
    titleKey: 'transcriptForm',
    descKey: 'transcriptFormDesc',
    icon: FileText,
    docFile: '/downloads/turkey/transcript-form.docx',
    pdfFile: '/downloads/turkey/transcript-form.pdf',
    color: 'rose',
  };

  const universityForm = {
    id: 'english-certificate',
    titleKey: 'certificateForm',
    descKey: 'certificateFormDesc',
    icon: Award,
    docFile: '/downloads/turkey/english-certificate.docx',
    pdfFile: '/downloads/turkey/english-certificate.pdf',
    color: 'cyan',
  };

  // Recommendation and Validation Letters
  const recommendationLetters = [
    {
      id: 'rec-bsc',
      titleKey: 'recLetterBsc',
      descKey: 'recLetterBscDesc',
      icon: Users,
      file: '/downloads/turkey/recommendation-letter-bsc.pdf',
      color: 'blue',
    },
    {
      id: 'rec-msc',
      titleKey: 'recLetterMsc',
      descKey: 'recLetterMscDesc',
      icon: Users,
      file: '/downloads/turkey/recommendation-letter-msc.pdf',
      color: 'green',
    },
    {
      id: 'rec-phd',
      titleKey: 'recLetterPhd',
      descKey: 'recLetterPhdDesc',
      icon: Users,
      file: '/downloads/turkey/recommendation-letter-phd.pdf',
      color: 'purple',
    },
  ];

  const validationLetters = [
    {
      id: 'val-msc',
      titleKey: 'validationMsc',
      descKey: 'validationMscDesc',
      icon: FileCheck,
      file: '/downloads/turkey/validation-letter-msc.pdf',
      color: 'teal',
    },
    {
      id: 'val-phd',
      titleKey: 'validationPhd',
      descKey: 'validationPhdDesc',
      icon: FileCheck,
      file: '/downloads/turkey/validation-letter-phd.pdf',
      color: 'indigo',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
            <circle cx="50" cy="50" r="40" />
            <path d="M50 25 L55 40 L70 40 L58 50 L63 65 L50 55 L37 65 L42 50 L30 40 L45 40 Z" fill="white" />
          </svg>
        </div>
        <Container>
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://turkiyeburslari.gov.tr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t('applyScholarship')}
                  <ExternalLink className="h-4 w-4 ms-2" />
                </Button>
              </a>
              <Link href={`/${locale}/scholarships?country=turkey`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  {t('learnMore')}
                  <Arrow className="h-4 w-4 ms-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Turkey Section */}
      <section className="section-padding bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gray-900 mb-4">{t('whyTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('whySubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyTurkeyCards.map((card) => (
              <Card key={card.titleKey} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
                  <card.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(card.titleKey)}
                </h3>
                <p className="text-gray-600 text-sm">{t(card.descKey)}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Türkiye Burslari Section */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 text-gray-900 mb-4">{t('scholarshipTitle')}</h2>
              <p className="text-lg text-gray-600 mb-6">{t('scholarshipSubtitle')}</p>
              <p className="text-gray-600 mb-8">{t('scholarshipDesc')}</p>

              <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{t('deadline')}</p>
                  <p className="text-gray-600">{t('deadlineDate')}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://turkiyeburslari.gov.tr/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    {t('applyScholarship')}
                    <ExternalLink className="h-4 w-4 ms-2" />
                  </Button>
                </a>
                <TrackedDownload href="/downloads/turkey/turkiye-burslari-guide.pdf">
                  <Button size="lg" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                    <Download className="h-4 w-4 me-2" />
                    {t('downloadGuide')}
                  </Button>
                </TrackedDownload>
              </div>
            </div>

            <div className="space-y-6">
              {/* Benefits */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {t('scholarshipBenefits')}
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Eligibility */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  {t('scholarshipEligibility')}
                </h3>
                <ul className="space-y-3">
                  {eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* University Enrollment Section */}
      <section className="section-padding bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gray-900 mb-4">{t('enrollmentTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('enrollmentSubtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 border-2 border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{t('yosTitle')}</h3>
              </div>
              <p className="text-gray-600">{t('yosDesc')}</p>
            </Card>

            <Card className="p-6 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{t('directTitle')}</h3>
              </div>
              <p className="text-gray-600">{t('directDesc')}</p>
            </Card>
          </div>

          {/* Popular Universities */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">{t('popularUnis')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {universities.map((uni) => (
                <Card key={uni.logo} className="p-4 text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-700">{uni.logo}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{uni.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Resources & Downloads Section */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gray-900 mb-4">{t('resourcesTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('resourcesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloadResources.map((resource) => {
              const colors = colorClasses[resource.color];
              const fileAvailable = isFileAvailable(resource.file);
              return (
                <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                      <resource.icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {t(resource.titleKey)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {t(resource.descKey)}
                      </p>
                      {fileAvailable ? (
                        <TrackedDownload href={resource.file}>
                          <Button variant="outline" size="sm" className={`${colors.text} border-current ${colors.hover}`}>
                            <Download className="h-4 w-4 me-2" />
                            {t('downloadBtn')}
                          </Button>
                        </TrackedDownload>
                      ) : (
                        <div className="relative inline-block group">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className={`${colors.text} border-current opacity-60 cursor-not-allowed`}
                          >
                            <Download className="h-4 w-4 me-2" />
                            {t('downloadBtn')}
                          </Button>
                          <span className="absolute -top-2 -end-2 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-medium rounded-full">
                            {t('comingSoon')}
                          </span>
                          <div className="absolute bottom-full mb-2 start-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                              {t('comingSoonTooltip')}
                            </div>
                            <div className="absolute top-full start-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {locale === 'ar'
                ? 'يحتوي هذا الدليل على معلومات شاملة لجميع مراحل الدراسة (البكالوريوس، الماجستير، الدكتوراه)'
                : 'This comprehensive guide contains information for all study levels (Bachelor, Master, PhD)'}
            </p>
          </div>
        </Container>
      </section>

      {/* Letters & Templates Section */}
      <section className="section-padding bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gray-900 mb-4">{t('lettersTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('lettersSubtitle')}</p>
          </div>

          {/* Recommendation Letters */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {t('recommendationTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendationLetters.map((letter) => {
                const colors = colorClasses[letter.color];
                const fileAvailable = isFileAvailable(letter.file);
                return (
                  <Card key={letter.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                        <letter.icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {t(letter.titleKey)}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          {t(letter.descKey)}
                        </p>
                        {fileAvailable ? (
                          <TrackedDownload href={letter.file}>
                            <Button variant="outline" size="sm" className={`${colors.text} border-current ${colors.hover}`}>
                              <Download className="h-4 w-4 me-2" />
                              {t('downloadBtn')}
                            </Button>
                          </TrackedDownload>
                        ) : (
                          <div className="relative inline-block group">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className={`${colors.text} border-current opacity-60 cursor-not-allowed`}
                            >
                              <Download className="h-4 w-4 me-2" />
                              {t('downloadBtn')}
                            </Button>
                            <span className="absolute -top-2 -end-2 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-medium rounded-full">
                              {t('comingSoon')}
                            </span>
                            <div className="absolute bottom-full mb-2 start-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                              <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                                {t('comingSoonTooltip')}
                              </div>
                              <div className="absolute top-full start-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Validation Letters */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
              <FileCheck className="h-5 w-5 text-teal-600" />
              {t('validationTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {validationLetters.map((letter) => {
                const colors = colorClasses[letter.color];
                const fileAvailable = isFileAvailable(letter.file);
                return (
                  <Card key={letter.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                        <letter.icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {t(letter.titleKey)}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          {t(letter.descKey)}
                        </p>
                        {fileAvailable ? (
                          <TrackedDownload href={letter.file}>
                            <Button variant="outline" size="sm" className={`${colors.text} border-current ${colors.hover}`}>
                              <Download className="h-4 w-4 me-2" />
                              {t('downloadBtn')}
                            </Button>
                          </TrackedDownload>
                        ) : (
                          <div className="relative inline-block group">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className={`${colors.text} border-current opacity-60 cursor-not-allowed`}
                            >
                              <Download className="h-4 w-4 me-2" />
                              {t('downloadBtn')}
                            </Button>
                            <span className="absolute -top-2 -end-2 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-medium rounded-full">
                              {t('comingSoon')}
                            </span>
                            <div className="absolute bottom-full mb-2 start-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                              <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                                {t('comingSoonTooltip')}
                              </div>
                              <div className="absolute top-full start-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Student Forms Section */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gray-900 mb-4">{t('studentFormsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('studentFormsSubtitle')}</p>
          </div>

          {/* Secondary School Students */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <School className="h-5 w-5 text-rose-600" />
              {t('secondaryTitle')}
            </h3>
            <p className="text-center text-gray-600 mb-6">{t('secondaryDesc')}</p>
            <div className="max-w-lg mx-auto">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[secondarySchoolForm.color].bg} flex items-center justify-center shrink-0`}>
                    <secondarySchoolForm.icon className={`h-6 w-6 ${colorClasses[secondarySchoolForm.color].text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {t(secondarySchoolForm.titleKey)}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {t(secondarySchoolForm.descKey)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <TrackedDownload href={secondarySchoolForm.docFile}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                          <FileType className="h-4 w-4 me-2" />
                          {t('downloadDoc')}
                        </Button>
                      </TrackedDownload>
                      <TrackedDownload href={secondarySchoolForm.pdfFile}>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          <FileText className="h-4 w-4 me-2" />
                          {t('downloadPdf')}
                        </Button>
                      </TrackedDownload>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* University Students */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Award className="h-5 w-5 text-cyan-600" />
              {t('universityTitle')}
            </h3>
            <p className="text-center text-gray-600 mb-6">{t('universityDesc')}</p>
            <div className="max-w-lg mx-auto">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[universityForm.color].bg} flex items-center justify-center shrink-0`}>
                    <universityForm.icon className={`h-6 w-6 ${colorClasses[universityForm.color].text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {t(universityForm.titleKey)}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {t(universityForm.descKey)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <TrackedDownload href={universityForm.docFile}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                          <FileType className="h-4 w-4 me-2" />
                          {t('downloadDoc')}
                        </Button>
                      </TrackedDownload>
                      <TrackedDownload href={universityForm.pdfFile}>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          <FileText className="h-4 w-4 me-2" />
                          {t('downloadPdf')}
                        </Button>
                      </TrackedDownload>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Video Tutorials Section */}
      <section className="section-padding bg-white">
        <Container>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 mb-4">
              <PlayCircle className="h-7 w-7" />
            </div>
            <h2 className="text-h2 text-gray-900 mb-4">{t('videoTutorialsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('videoTutorialsSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Video 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/KnOmrKa_FDM"
                  title={t('video1Title')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{t('video1Title')}</h3>
              </div>
            </Card>

            {/* Video 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/CLcQVtwWAHk"
                  title={t('video2Title')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{t('video2Title')}</h3>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Living in Turkey Section */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gray-900 mb-4">{t('livingTitle')}</h2>
            <p className="text-xl text-gray-600">{t('livingSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {livingCards.map((card) => (
              <Card key={card.titleKey} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <card.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t(card.titleKey)}</h3>
                </div>
                <p className="text-gray-600">{t(card.descKey)}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <Container size="md">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('ctaTitle')}</h2>
            <p className="text-xl text-red-100 mb-8">{t('ctaSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://turkiyeburslari.gov.tr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t('ctaButton')}
                  <ExternalLink className="h-4 w-4 ms-2" />
                </Button>
              </a>
              <Link href={`/${locale}/scholarships?country=turkey`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  {locale === 'ar' ? 'تصفح المنح التركية' : 'Browse Turkish Scholarships'}
                  <Arrow className="h-4 w-4 ms-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
