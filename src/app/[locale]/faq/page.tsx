'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, HelpCircle, FileText, Users, GraduationCap, Mail } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FAQCategory = 'all' | 'general' | 'application' | 'eligibility' | 'documents';

interface FAQ {
  id: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  category: FAQCategory;
}

const faqs: FAQ[] = [
  // General
  {
    id: '1',
    question: 'What is Sudan Scholars Hub?',
    questionAr: 'ما هو مركز منح السودان؟',
    answer: 'Sudan Scholars Hub is a comprehensive platform designed to help Sudanese students discover and apply for scholarships worldwide. We aggregate scholarship opportunities, provide application guidance, and support students throughout their educational journey.',
    answerAr: 'مركز منح السودان هو منصة شاملة مصممة لمساعدة الطلاب السودانيين في اكتشاف المنح الدراسية والتقدم إليها في جميع أنحاء العالم. نقوم بتجميع فرص المنح الدراسية وتقديم إرشادات التقديم ودعم الطلاب طوال رحلتهم التعليمية.',
    category: 'general',
  },
  {
    id: '2',
    question: 'Is Sudan Scholars Hub free to use?',
    questionAr: 'هل استخدام مركز منح السودان مجاني؟',
    answer: 'Yes! Sudan Scholars Hub is completely free for all students. We believe education opportunities should be accessible to everyone regardless of their financial situation.',
    answerAr: 'نعم! مركز منح السودان مجاني تماماً لجميع الطلاب. نؤمن بأن الفرص التعليمية يجب أن تكون متاحة للجميع بغض النظر عن وضعهم المالي.',
    category: 'general',
  },
  {
    id: '3',
    question: 'How often are new scholarships added?',
    questionAr: 'كم مرة تُضاف منح دراسية جديدة؟',
    answer: 'We update our scholarship database regularly, adding new opportunities as they become available. We recommend subscribing to our newsletter to stay informed about the latest scholarships.',
    answerAr: 'نقوم بتحديث قاعدة بيانات المنح الدراسية بانتظام، ونضيف فرصاً جديدة بمجرد توفرها. ننصح بالاشتراك في النشرة الإخبارية للبقاء على اطلاع بأحدث المنح.',
    category: 'general',
  },
  // Application
  {
    id: '4',
    question: 'How do I apply for a scholarship?',
    questionAr: 'كيف أتقدم للحصول على منحة دراسية؟',
    answer: 'Each scholarship has its own application process. Browse our scholarships, click on one that interests you, and follow the "Apply Now" button which will redirect you to the official application page. Make sure to read all requirements carefully before applying.',
    answerAr: 'لكل منحة عملية تقديم خاصة بها. تصفح المنح الدراسية لدينا، انقر على المنحة التي تهمك، واتبع زر "تقدم الآن" الذي سيوجهك إلى صفحة التقديم الرسمية. تأكد من قراءة جميع المتطلبات بعناية قبل التقديم.',
    category: 'application',
  },
  {
    id: '5',
    question: 'Can I apply for multiple scholarships at once?',
    questionAr: 'هل يمكنني التقدم لعدة منح في وقت واحد؟',
    answer: 'Yes, you can and should apply for multiple scholarships to increase your chances of success. However, make sure you meet the eligibility criteria for each and can dedicate enough time to submit quality applications.',
    answerAr: 'نعم، يمكنك ويجب عليك التقدم لعدة منح لزيادة فرص نجاحك. ومع ذلك، تأكد من استيفائك لمعايير الأهلية لكل منحة وأن لديك الوقت الكافي لتقديم طلبات عالية الجودة.',
    category: 'application',
  },
  {
    id: '6',
    question: 'What should I include in my motivation letter?',
    questionAr: 'ماذا يجب أن أضمّن في خطاب الدافع؟',
    answer: 'Your motivation letter should include: your academic background, career goals, why you chose this specific scholarship/program, how it aligns with your aspirations, and what makes you a strong candidate. Be genuine, specific, and proofread carefully.',
    answerAr: 'يجب أن يتضمن خطاب الدافع: خلفيتك الأكاديمية، أهدافك المهنية، لماذا اخترت هذه المنحة/البرنامج بالتحديد، كيف تتوافق مع تطلعاتك، وما الذي يجعلك مرشحاً قوياً. كن صادقاً ومحدداً وراجع كتابتك بعناية.',
    category: 'application',
  },
  // Eligibility
  {
    id: '7',
    question: 'Do I need to know the local language to apply?',
    questionAr: 'هل أحتاج إلى معرفة اللغة المحلية للتقديم؟',
    answer: 'It depends on the scholarship. Many programs offer courses in English, while others require proficiency in the local language. Check the language requirements for each scholarship. Many fully-funded scholarships include language preparatory courses.',
    answerAr: 'يعتمد ذلك على المنحة. تقدم العديد من البرامج دورات باللغة الإنجليزية، بينما يتطلب البعض الآخر إتقان اللغة المحلية. تحقق من متطلبات اللغة لكل منحة. تتضمن العديد من المنح الممولة بالكامل دورات تحضيرية للغة.',
    category: 'eligibility',
  },
  {
    id: '8',
    question: 'What GPA do I need for most scholarships?',
    questionAr: 'ما المعدل التراكمي المطلوب لمعظم المنح؟',
    answer: 'GPA requirements vary by scholarship. Highly competitive scholarships typically require a GPA of 3.0/4.0 or above (or equivalent 75%+). However, many scholarships consider the whole application, including extracurriculars, leadership, and community service.',
    answerAr: 'تختلف متطلبات المعدل التراكمي حسب المنحة. تتطلب المنح التنافسية عادةً معدلاً 3.0/4.0 أو أعلى (أو ما يعادل 75%+). ومع ذلك، تأخذ العديد من المنح في الاعتبار الطلب بالكامل، بما في ذلك الأنشطة اللامنهجية والقيادة وخدمة المجتمع.',
    category: 'eligibility',
  },
  {
    id: '9',
    question: 'Can I apply if I\'m already enrolled in a university?',
    questionAr: 'هل يمكنني التقديم إذا كنت مسجلاً بالفعل في جامعة؟',
    answer: 'Yes, many scholarships accept applications from current university students, especially for Master\'s and PhD programs. Some undergraduate scholarships also allow transfers. Check each scholarship\'s specific requirements.',
    answerAr: 'نعم، تقبل العديد من المنح طلبات من طلاب الجامعات الحاليين، خاصة لبرامج الماجستير والدكتوراه. تسمح بعض منح البكالوريوس أيضاً بالتحويل. تحقق من المتطلبات المحددة لكل منحة.',
    category: 'eligibility',
  },
  // Documents
  {
    id: '10',
    question: 'What documents do I typically need?',
    questionAr: 'ما المستندات التي أحتاجها عادةً؟',
    answer: 'Common required documents include: passport copy, academic transcripts, degree certificates, language proficiency test scores (IELTS/TOEFL), motivation letter, CV/resume, recommendation letters (usually 2-3), and passport-sized photos.',
    answerAr: 'تشمل المستندات المطلوبة عادةً: نسخة جواز السفر، كشوف الدرجات الأكاديمية، شهادات الدرجات العلمية، درجات اختبار إتقان اللغة (IELTS/TOEFL)، خطاب الدافع، السيرة الذاتية، خطابات التوصية (عادةً 2-3)، وصور بحجم جواز السفر.',
    category: 'documents',
  },
  {
    id: '11',
    question: 'Do my documents need to be translated?',
    questionAr: 'هل تحتاج مستنداتي إلى ترجمة؟',
    answer: 'Most scholarships require documents to be in English or the country\'s official language. If your documents are in Arabic, you\'ll typically need certified translations. Some scholarships accept notarized translations, while others require sworn translators.',
    answerAr: 'تتطلب معظم المنح أن تكون المستندات باللغة الإنجليزية أو اللغة الرسمية للبلد. إذا كانت مستنداتك بالعربية، ستحتاج عادةً إلى ترجمات معتمدة. تقبل بعض المنح الترجمات الموثقة، بينما يتطلب البعض الآخر مترجمين محلفين.',
    category: 'documents',
  },
  {
    id: '12',
    question: 'How do I get recommendation letters?',
    questionAr: 'كيف أحصل على خطابات التوصية؟',
    answer: 'Ask professors, academic advisors, or employers who know your work well. Give them at least 2-3 weeks notice, provide them with your CV and goals, and politely follow up. Choose recommenders who can speak specifically about your abilities and character.',
    answerAr: 'اطلب من الأساتذة أو المرشدين الأكاديميين أو أصحاب العمل الذين يعرفون عملك جيداً. أعطهم إشعاراً قبل 2-3 أسابيع على الأقل، وزودهم بسيرتك الذاتية وأهدافك، وتابع بلطف. اختر موصين يمكنهم التحدث بشكل محدد عن قدراتك وشخصيتك.',
    category: 'documents',
  },
  {
    id: '13',
    question: 'What if I don\'t have IELTS or TOEFL?',
    questionAr: 'ماذا لو لم يكن لدي IELTS أو TOEFL؟',
    answer: 'Some scholarships accept alternative English proficiency proofs like Duolingo English Test, PTE, or even medium of instruction certificates. Some programs waive language requirements if you previously studied in English. Check specific scholarship requirements.',
    answerAr: 'تقبل بعض المنح إثباتات بديلة لإتقان اللغة الإنجليزية مثل اختبار دولينجو للإنجليزية أو PTE أو حتى شهادات لغة التدريس. تتنازل بعض البرامج عن متطلبات اللغة إذا درست سابقاً بالإنجليزية. تحقق من متطلبات المنحة المحددة.',
    category: 'documents',
  },
  {
    id: '14',
    question: 'When should I start preparing my application?',
    questionAr: 'متى يجب أن أبدأ في تحضير طلبي؟',
    answer: 'Start at least 3-6 months before the deadline. This gives you time to gather documents, write and revise your motivation letter, request recommendation letters, and take any required tests. Early preparation leads to stronger applications.',
    answerAr: 'ابدأ قبل 3-6 أشهر على الأقل من الموعد النهائي. هذا يمنحك الوقت لجمع المستندات وكتابة ومراجعة خطاب الدافع وطلب خطابات التوصية وإجراء أي اختبارات مطلوبة. التحضير المبكر يؤدي إلى طلبات أقوى.',
    category: 'documents',
  },
];

const categories = [
  { id: 'all' as FAQCategory, label: 'All Questions', labelAr: 'جميع الأسئلة', icon: HelpCircle },
  { id: 'general' as FAQCategory, label: 'General', labelAr: 'عام', icon: HelpCircle },
  { id: 'application' as FAQCategory, label: 'Application', labelAr: 'التقديم', icon: FileText },
  { id: 'eligibility' as FAQCategory, label: 'Eligibility', labelAr: 'الأهلية', icon: Users },
  { id: 'documents' as FAQCategory, label: 'Documents', labelAr: 'المستندات', icon: GraduationCap },
];

export default function FAQPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {isRTL
                ? 'إجابات على الأسئلة الأكثر شيوعاً حول المنح الدراسية وعملية التقديم'
                : 'Answers to the most common questions about scholarships and the application process'
              }
            </p>
          </div>
        </Container>
      </section>

      {/* Category Tabs */}
      <section className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-16 z-20">
        <Container>
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <cat.icon className="h-4 w-4" />
                {isRTL ? cat.labelAr : cat.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
        <Container size="md">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-start hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-50 pe-4">
                    {isRTL ? faq.questionAr : faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-gray-500 shrink-0 transition-transform duration-200',
                      openItems.includes(faq.id) && 'rotate-180'
                    )}
                  />
                </button>
                {openItems.includes(faq.id) && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {isRTL ? faq.answerAr : faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-primary-600">
        <Container size="sm">
          <div className="text-center text-white">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isRTL ? 'لم تجد إجابتك؟' : 'Still have questions?'}
            </h2>
            <p className="text-primary-100 mb-6 max-w-md mx-auto">
              {isRTL
                ? 'فريقنا جاهز لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت.'
                : "Our team is ready to help. Contact us and we'll get back to you as soon as possible."
              }
            </p>
            <Link href={`/${locale}/contact`}>
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                {isRTL ? 'تواصل معنا' : 'Contact Us'}
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
