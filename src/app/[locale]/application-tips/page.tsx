'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  CheckCircle,
  Clock,
  Users,
  Award,
  MessageSquare,
  BookOpen,
  Target,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Tip {
  id: string;
  icon: React.ElementType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  tips: string[];
  tipsAr: string[];
}

const applicationTips: Tip[] = [
  {
    id: '1',
    icon: Clock,
    title: 'Start Early',
    titleAr: 'ابدأ مبكراً',
    description: 'Give yourself plenty of time to prepare a strong application.',
    descriptionAr: 'امنح نفسك وقتاً كافياً لإعداد طلب قوي.',
    tips: [
      'Begin preparation 3-6 months before deadlines',
      'Create a timeline for each application component',
      'Set personal deadlines 2 weeks before official ones',
      'Research scholarships early in the year',
    ],
    tipsAr: [
      'ابدأ التحضير قبل 3-6 أشهر من المواعيد النهائية',
      'أنشئ جدولاً زمنياً لكل عنصر من عناصر الطلب',
      'حدد مواعيد نهائية شخصية قبل أسبوعين من المواعيد الرسمية',
      'ابحث عن المنح الدراسية في وقت مبكر من العام',
    ],
  },
  {
    id: '2',
    icon: FileText,
    title: 'Craft a Compelling Personal Statement',
    titleAr: 'اكتب خطاب دافع مقنع',
    description: 'Your personal statement is your chance to stand out from other applicants.',
    descriptionAr: 'خطاب الدافع هو فرصتك للتميز عن المتقدمين الآخرين.',
    tips: [
      'Tell your unique story - be authentic',
      'Connect your past experiences to future goals',
      'Explain why this specific scholarship matters to you',
      'Show, don\'t just tell - use specific examples',
      'Have multiple people review and edit your draft',
    ],
    tipsAr: [
      'اروِ قصتك الفريدة - كن صادقاً',
      'اربط خبراتك السابقة بأهدافك المستقبلية',
      'اشرح لماذا هذه المنحة بالذات مهمة لك',
      'أظهر، لا تخبر فقط - استخدم أمثلة محددة',
      'اطلب من عدة أشخاص مراجعة وتحرير مسودتك',
    ],
  },
  {
    id: '3',
    icon: Users,
    title: 'Secure Strong Recommendation Letters',
    titleAr: 'احصل على خطابات توصية قوية',
    description: 'Choose recommenders who know you well and can speak to your abilities.',
    descriptionAr: 'اختر موصين يعرفونك جيداً ويمكنهم التحدث عن قدراتك.',
    tips: [
      'Ask professors or supervisors who know your work',
      'Give recommenders at least 3-4 weeks notice',
      'Provide them with your CV and goals',
      'Send a polite reminder one week before deadline',
      'Thank them after submission',
    ],
    tipsAr: [
      'اطلب من الأساتذة أو المشرفين الذين يعرفون عملك',
      'أعطِ الموصين إشعاراً قبل 3-4 أسابيع على الأقل',
      'زودهم بسيرتك الذاتية وأهدافك',
      'أرسل تذكيراً لطيفاً قبل أسبوع من الموعد النهائي',
      'اشكرهم بعد التقديم',
    ],
  },
  {
    id: '4',
    icon: BookOpen,
    title: 'Prepare Your Documents',
    titleAr: 'حضّر مستنداتك',
    description: 'Organize and prepare all required documents well in advance.',
    descriptionAr: 'نظّم وحضّر جميع المستندات المطلوبة مقدماً.',
    tips: [
      'Keep digital and physical copies of all documents',
      'Get official translations certified early',
      'Scan documents in high quality (300 DPI minimum)',
      'Name files clearly (e.g., "Transcript_University_2024.pdf")',
      'Check file size and format requirements',
    ],
    tipsAr: [
      'احتفظ بنسخ رقمية ومادية من جميع المستندات',
      'احصل على ترجمات رسمية معتمدة مبكراً',
      'امسح المستندات بجودة عالية (300 DPI كحد أدنى)',
      'سمِّ الملفات بوضوح (مثلاً "Transcript_University_2024.pdf")',
      'تحقق من متطلبات حجم الملف والتنسيق',
    ],
  },
  {
    id: '5',
    icon: Target,
    title: 'Tailor Each Application',
    titleAr: 'خصص كل طلب',
    description: 'Customize your application for each scholarship opportunity.',
    descriptionAr: 'خصص طلبك لكل فرصة منحة.',
    tips: [
      'Research the scholarship organization\'s values',
      'Align your goals with their mission',
      'Address specific criteria mentioned in requirements',
      'Avoid generic, copy-paste applications',
      'Show you understand what makes this scholarship unique',
    ],
    tipsAr: [
      'ابحث عن قيم منظمة المنحة',
      'اربط أهدافك برسالتهم',
      'تناول المعايير المحددة المذكورة في المتطلبات',
      'تجنب الطلبات العامة المنسوخة',
      'أظهر أنك تفهم ما يجعل هذه المنحة فريدة',
    ],
  },
  {
    id: '6',
    icon: MessageSquare,
    title: 'Ace the Interview',
    titleAr: 'تألق في المقابلة',
    description: 'Prepare thoroughly for scholarship interviews.',
    descriptionAr: 'استعد جيداً لمقابلات المنح الدراسية.',
    tips: [
      'Practice common scholarship interview questions',
      'Prepare questions to ask the interviewers',
      'Dress professionally and test your technology',
      'Be ready to discuss your application in detail',
      'Show enthusiasm and genuine interest',
    ],
    tipsAr: [
      'تدرب على أسئلة المقابلات الشائعة للمنح',
      'حضّر أسئلة لطرحها على المحاورين',
      'ارتدِ ملابس رسمية واختبر تقنيتك',
      'كن مستعداً لمناقشة طلبك بالتفصيل',
      'أظهر الحماس والاهتمام الحقيقي',
    ],
  },
];

const timeline = [
  { month: '6+ months before', monthAr: 'قبل 6+ أشهر', task: 'Research scholarships and requirements', taskAr: 'ابحث عن المنح ومتطلباتها' },
  { month: '4-5 months before', monthAr: 'قبل 4-5 أشهر', task: 'Take required tests (IELTS, TOEFL, GRE)', taskAr: 'خذ الاختبارات المطلوبة (IELTS, TOEFL, GRE)' },
  { month: '3-4 months before', monthAr: 'قبل 3-4 أشهر', task: 'Request recommendation letters', taskAr: 'اطلب خطابات التوصية' },
  { month: '2-3 months before', monthAr: 'قبل 2-3 أشهر', task: 'Write first draft of personal statement', taskAr: 'اكتب المسودة الأولى لخطاب الدافع' },
  { month: '1-2 months before', monthAr: 'قبل 1-2 شهر', task: 'Gather and translate all documents', taskAr: 'اجمع وترجم جميع المستندات' },
  { month: '2-3 weeks before', monthAr: 'قبل 2-3 أسابيع', task: 'Finalize and review all materials', taskAr: 'انتهِ من ومراجعة جميع المواد' },
  { month: '1 week before', monthAr: 'قبل أسبوع', task: 'Submit application and confirm receipt', taskAr: 'قدم الطلب وتأكد من الاستلام' },
];

export default function ApplicationTipsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
        <Container size="md">
          <div className="text-center">
            <Award className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              {isRTL ? 'نصائح للتقديم' : 'Application Tips'}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {isRTL
                ? 'دليلك الشامل لتقديم طلب منحة ناجح وزيادة فرصك في القبول'
                : 'Your comprehensive guide to submitting a successful scholarship application and increasing your chances of acceptance'
              }
            </p>
          </div>
        </Container>
      </section>

      {/* Quick Tips */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Clock, text: isRTL ? 'ابدأ مبكراً' : 'Start Early', color: 'bg-blue-100 text-blue-600' },
              { icon: CheckCircle, text: isRTL ? 'كن منظماً' : 'Stay Organized', color: 'bg-green-100 text-green-600' },
              { icon: Lightbulb, text: isRTL ? 'كن فريداً' : 'Be Unique', color: 'bg-yellow-100 text-yellow-600' },
              { icon: Target, text: isRTL ? 'خصص طلبك' : 'Be Specific', color: 'bg-purple-100 text-purple-600' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4">
                <div className={`inline-flex p-3 rounded-full ${item.color} mb-3`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-50">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Tips */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-10">
            {isRTL ? 'نصائح أساسية للتقديم' : 'Essential Application Tips'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {applicationTips.map((tip) => (
              <Card key={tip.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-lg shrink-0">
                    <tip.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                      {isRTL ? tip.titleAr : tip.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {isRTL ? tip.descriptionAr : tip.description}
                    </p>
                    <ul className="space-y-2">
                      {(isRTL ? tip.tipsAr : tip.tips).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <Container size="md">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-4">
            {isRTL ? 'الجدول الزمني للتقديم' : 'Application Timeline'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-xl mx-auto">
            {isRTL
              ? 'خطط لطلبك باتباع هذا الجدول الزمني الموصى به'
              : 'Plan your application by following this recommended timeline'
            }
          </p>
          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute top-0 bottom-0 w-0.5 bg-primary-200 ${isRTL ? 'right-4 md:right-1/2' : 'left-4 md:left-1/2'}`} />

            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className={`relative flex items-center gap-4 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className={`absolute w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow ${isRTL ? 'right-2 md:right-1/2 md:-translate-x-1/2' : 'left-2 md:left-1/2 md:-translate-x-1/2'}`} />

                  {/* Content */}
                  <div className={`${isRTL ? 'mr-10 md:mr-0' : 'ml-10 md:ml-0'} md:w-1/2 ${idx % 2 === 0 ? 'md:pe-8 md:text-end' : 'md:ps-8'}`}>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-primary-600">
                        {isRTL ? item.monthAr : item.month}
                      </span>
                      <p className="text-gray-900 dark:text-gray-50 mt-1">
                        {isRTL ? item.taskAr : item.task}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-primary-600">
        <Container size="sm">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isRTL ? 'مستعد للبدء؟' : 'Ready to Get Started?'}
            </h2>
            <p className="text-primary-100 mb-6 max-w-md mx-auto">
              {isRTL
                ? 'تصفح المنح الدراسية المتاحة وابدأ في التقديم اليوم'
                : 'Browse available scholarships and start your application today'
              }
            </p>
            <Link href={`/${locale}/scholarships`}>
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                {isRTL ? 'تصفح المنح' : 'Browse Scholarships'}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180 me-2' : 'ms-2'}`} />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
