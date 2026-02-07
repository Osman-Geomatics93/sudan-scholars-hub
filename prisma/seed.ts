import { PrismaClient, FundingType, StudyLevel, FieldOfStudy, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user (OTP-based authentication - no password)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sudanscholarshub.com';
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('Created admin:', admin.email);

  // Create countries
  const countries = [
    { code: 'turkey', name: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷' },
    { code: 'uk', name: 'United Kingdom', nameAr: 'المملكة المتحدة', flag: '🇬🇧' },
    { code: 'usa', name: 'United States', nameAr: 'الولايات المتحدة', flag: '🇺🇸' },
    { code: 'germany', name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪' },
    { code: 'australia', name: 'Australia', nameAr: 'أستراليا', flag: '🇦🇺' },
    { code: 'canada', name: 'Canada', nameAr: 'كندا', flag: '🇨🇦' },
    { code: 'france', name: 'France', nameAr: 'فرنسا', flag: '🇫🇷' },
    { code: 'netherlands', name: 'Netherlands', nameAr: 'هولندا', flag: '🇳🇱' },
    { code: 'japan', name: 'Japan', nameAr: 'اليابان', flag: '🇯🇵' },
    { code: 'switzerland', name: 'Switzerland', nameAr: 'سويسرا', flag: '🇨🇭' },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: country,
      create: country,
    });
  }
  console.log('Created countries:', countries.length);

  // Create scholarships
  const scholarships = [
    {
      slug: 'chevening-scholarship',
      title: 'Chevening Scholarship',
      titleAr: 'منحة تشيفنينج',
      university: 'Various UK Universities',
      universityAr: 'جامعات بريطانية متعددة',
      country: 'United Kingdom',
      countryCode: 'uk',
      countryAr: 'المملكة المتحدة',
      deadline: new Date('2025-11-05'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.MASTER],
      field: FieldOfStudy.BUSINESS,
      description: "Chevening Scholarships are the UK government's global scholarship programme, funded by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations. The scholarships are awarded to individuals with demonstrable leadership potential who also have strong academic backgrounds.",
      descriptionAr: 'منح تشيفنينج هي برنامج المنح الدراسية العالمي للحكومة البريطانية، والممول من مكتب الخارجية والكومنولث والتنمية والمنظمات الشريكة. تُمنح المنح للأفراد الذين يتمتعون بإمكانيات قيادية واضحة ولديهم خلفيات أكاديمية قوية.',
      eligibility: [
        'Be a citizen of a Chevening-eligible country',
        'Return to your country for a minimum of two years after your award',
        'Have an undergraduate degree',
        'Have at least two years of work experience',
      ],
      eligibilityAr: [
        'أن تكون مواطناً في دولة مؤهلة لمنحة تشيفنينج',
        'العودة إلى بلدك لمدة سنتين على الأقل بعد انتهاء المنحة',
        'الحصول على شهادة البكالوريوس',
        'امتلاك خبرة عملية لا تقل عن سنتين',
      ],
      benefits: [
        'Full tuition fees',
        'Monthly living allowance',
        'Return economy flights',
        'Arrival and departure allowances',
        'Thesis or dissertation grant',
      ],
      benefitsAr: [
        'الرسوم الدراسية الكاملة',
        'بدل معيشة شهري',
        'تذاكر سفر ذهاب وإياب بالدرجة الاقتصادية',
        'بدل وصول ومغادرة',
        'منحة للرسالة أو الأطروحة',
      ],
      requirements: [
        'Academic transcripts',
        'Two reference letters',
        'Personal statement',
        'Valid passport',
      ],
      requirementsAr: [
        'كشف الدرجات الأكاديمية',
        'خطابان توصية',
        'بيان شخصي',
        'جواز سفر ساري المفعول',
      ],
      howToApply: 'Apply online through the official Chevening website during the application period. Complete your application with all required documents and submit before the deadline.',
      howToApplyAr: 'قدم طلبك عبر الإنترنت من خلال موقع تشيفنينج الرسمي خلال فترة التقديم. أكمل طلبك مع جميع المستندات المطلوبة وأرسله قبل الموعد النهائي.',
      applicationUrl: 'https://www.chevening.org/scholarships/',
      image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&q=80',
      duration: '1 year',
      durationAr: 'سنة واحدة',
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'daad-scholarship',
      title: 'DAAD Scholarship',
      titleAr: 'منحة DAAD الألمانية',
      university: 'German Universities',
      universityAr: 'الجامعات الألمانية',
      country: 'Germany',
      countryCode: 'germany',
      countryAr: 'ألمانيا',
      deadline: new Date('2025-10-15'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.MASTER],
      field: FieldOfStudy.ENGINEERING,
      description: 'The German Academic Exchange Service (DAAD) offers scholarships for international students to study in Germany. The program supports talented students in their pursuit of academic excellence at German universities.',
      descriptionAr: 'تقدم الهيئة الألمانية للتبادل الأكاديمي (DAAD) منحاً دراسية للطلاب الدوليين للدراسة في ألمانيا. يدعم البرنامج الطلاب الموهوبين في سعيهم لتحقيق التميز الأكاديمي في الجامعات الألمانية.',
      eligibility: [
        "Bachelor's degree in a relevant field",
        'Two years of professional experience',
        'Strong academic record',
        'Language proficiency (German or English)',
      ],
      eligibilityAr: [
        'شهادة بكالوريوس في مجال ذي صلة',
        'سنتان من الخبرة المهنية',
        'سجل أكاديمي قوي',
        'إتقان اللغة (الألمانية أو الإنجليزية)',
      ],
      benefits: [
        'Monthly scholarship payment of €934',
        'Travel allowance',
        'Health insurance subsidy',
        'Study and research allowance',
      ],
      benefitsAr: [
        'مبلغ شهري 934 يورو',
        'بدل سفر',
        'دعم التأمين الصحي',
        'بدل الدراسة والبحث',
      ],
      requirements: [
        'Online application form',
        'CV in tabular form',
        'Letter of motivation',
        'Academic certificates',
      ],
      requirementsAr: [
        'نموذج طلب إلكتروني',
        'سيرة ذاتية في شكل جدول',
        'خطاب تحفيزي',
        'الشهادات الأكاديمية',
      ],
      howToApply: 'Submit your application through the DAAD portal. Applications must include all required documents.',
      howToApplyAr: 'أرسل طلبك عبر بوابة DAAD. يجب أن تتضمن الطلبات جميع المستندات المطلوبة.',
      applicationUrl: 'https://www.daad.de/en/',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
      duration: '2 years',
      durationAr: 'سنتان',
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'fulbright-scholarship',
      title: 'Fulbright Foreign Student Program',
      titleAr: 'برنامج فولبرايت للطلاب الأجانب',
      university: 'US Universities',
      universityAr: 'الجامعات الأمريكية',
      country: 'United States',
      countryCode: 'usa',
      countryAr: 'الولايات المتحدة',
      deadline: new Date('2025-06-01'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.MASTER],
      field: FieldOfStudy.SCIENCE,
      description: "The Fulbright Program is the U.S. government's flagship international educational exchange program. It provides funding for students, scholars, teachers, and professionals to study, research, or teach abroad.",
      descriptionAr: 'برنامج فولبرايت هو البرنامج الرائد للتبادل التعليمي الدولي للحكومة الأمريكية. يوفر تمويلاً للطلاب والباحثين والمعلمين والمهنيين للدراسة أو البحث أو التدريس في الخارج.',
      eligibility: [
        "Bachelor's degree or equivalent",
        'Proficiency in English',
        'Strong academic record',
        'Leadership potential',
      ],
      eligibilityAr: [
        'شهادة بكالوريوس أو ما يعادلها',
        'إتقان اللغة الإنجليزية',
        'سجل أكاديمي قوي',
        'إمكانيات قيادية',
      ],
      benefits: [
        'Full tuition coverage',
        'Living stipend',
        'Round-trip airfare',
        'Health insurance',
        'Book and equipment allowances',
      ],
      benefitsAr: [
        'تغطية الرسوم الدراسية الكاملة',
        'راتب معيشة',
        'تذاكر سفر ذهاب وإياب',
        'تأمين صحي',
        'بدل الكتب والمعدات',
      ],
      requirements: [
        'Academic transcripts',
        'Three letters of recommendation',
        'Personal statement',
        'Study objective statement',
      ],
      requirementsAr: [
        'كشف الدرجات الأكاديمية',
        'ثلاثة خطابات توصية',
        'بيان شخصي',
        'بيان الهدف الدراسي',
      ],
      howToApply: 'Apply through the Fulbright Commission in your home country or through the Institute of International Education (IIE).',
      howToApplyAr: 'قدم طلبك من خلال لجنة فولبرايت في بلدك أو من خلال معهد التعليم الدولي (IIE).',
      applicationUrl: 'https://foreign.fulbrightonline.org/',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
      duration: '1-2 years',
      durationAr: '1-2 سنة',
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'australia-awards',
      title: 'Australia Awards Scholarships',
      titleAr: 'منح أستراليا',
      university: 'Australian Universities',
      universityAr: 'الجامعات الأسترالية',
      country: 'Australia',
      countryCode: 'australia',
      countryAr: 'أستراليا',
      deadline: new Date('2025-04-30'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.MASTER],
      field: FieldOfStudy.EDUCATION,
      description: "Australia Awards Scholarships are long-term development awards funded by the Australian Government. They aim to contribute to the development needs of Australia's partner countries.",
      descriptionAr: 'منح أستراليا هي منح تنموية طويلة الأجل ممولة من الحكومة الأسترالية. تهدف إلى المساهمة في احتياجات التنمية في البلدان الشريكة لأستراليا.',
      eligibility: [
        'Citizen of a participating country',
        'Not hold Australian citizenship',
        'Minimum two years post-study residence',
        "Bachelor's degree for Master's application",
      ],
      eligibilityAr: [
        'أن تكون مواطناً في دولة مشاركة',
        'عدم حمل الجنسية الأسترالية',
        'إقامة سنتين بعد الدراسة كحد أدنى',
        'شهادة بكالوريوس للتقديم على الماجستير',
      ],
      benefits: [
        'Full tuition fees',
        'Return air travel',
        'Establishment allowance',
        'Contribution to living expenses',
        'Overseas student health cover',
      ],
      benefitsAr: [
        'الرسوم الدراسية الكاملة',
        'تذاكر سفر ذهاب وإياب',
        'بدل استقرار',
        'مساهمة في نفقات المعيشة',
        'تغطية صحية للطلاب الدوليين',
      ],
      requirements: [
        'Academic qualifications',
        'IELTS score minimum 6.5',
        'Statement of purpose',
        'Referee reports',
      ],
      requirementsAr: [
        'المؤهلات الأكاديمية',
        'درجة IELTS لا تقل عن 6.5',
        'بيان الغرض',
        'تقارير المرجعين',
      ],
      howToApply: 'Apply through the Australia Awards website during the application round for your country.',
      howToApplyAr: 'قدم طلبك عبر موقع منح أستراليا خلال جولة التقديم لبلدك.',
      applicationUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards',
      image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80',
      duration: '1-2 years',
      durationAr: '1-2 سنة',
      isFeatured: false,
      isPublished: true,
    },
    {
      slug: 'erasmus-mundus',
      title: 'Erasmus Mundus Joint Masters',
      titleAr: 'إيراسموس موندوس للماجستير المشترك',
      university: 'European Universities',
      universityAr: 'الجامعات الأوروبية',
      country: 'Netherlands',
      countryCode: 'netherlands',
      countryAr: 'هولندا',
      deadline: new Date('2025-01-15'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.MASTER],
      field: FieldOfStudy.TECHNOLOGY,
      description: 'Erasmus Mundus Joint Master Degrees are high-level integrated study programmes at Master level. They are designed and delivered by partnerships of higher education institutions from different countries.',
      descriptionAr: 'درجات الماجستير المشتركة إيراسموس موندوس هي برامج دراسية متكاملة عالية المستوى على مستوى الماجستير. يتم تصميمها وتقديمها من قبل شراكات مؤسسات التعليم العالي من دول مختلفة.',
      eligibility: [
        "Bachelor's degree or equivalent",
        'Meet specific program requirements',
        'Language proficiency',
        'Strong academic background',
      ],
      eligibilityAr: [
        'شهادة بكالوريوس أو ما يعادلها',
        'استيفاء متطلبات البرنامج المحددة',
        'إتقان اللغة',
        'خلفية أكاديمية قوية',
      ],
      benefits: [
        'Full tuition coverage',
        'Travel costs',
        'Installation costs',
        'Monthly subsistence allowance',
      ],
      benefitsAr: [
        'تغطية الرسوم الدراسية الكاملة',
        'تكاليف السفر',
        'تكاليف الاستقرار',
        'بدل إعاشة شهري',
      ],
      requirements: [
        'Degree certificates',
        'Transcripts',
        'CV/Resume',
        'Motivation letter',
        'Language certificates',
      ],
      requirementsAr: [
        'شهادات الدرجة',
        'كشف الدرجات',
        'السيرة الذاتية',
        'خطاب التحفيز',
        'شهادات اللغة',
      ],
      howToApply: 'Apply directly to the consortium managing the EMJMD you wish to apply for through their application portal.',
      howToApplyAr: 'قدم طلبك مباشرة إلى الاتحاد الذي يدير برنامج EMJMD الذي ترغب في التقديم له من خلال بوابة التقديم الخاصة بهم.',
      applicationUrl: 'https://erasmus-plus.ec.europa.eu/',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      duration: '2 years',
      durationAr: 'سنتان',
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'gates-cambridge',
      title: 'Gates Cambridge Scholarship',
      titleAr: 'منحة جيتس كامبريدج',
      university: 'University of Cambridge',
      universityAr: 'جامعة كامبريدج',
      country: 'United Kingdom',
      countryCode: 'uk',
      countryAr: 'المملكة المتحدة',
      deadline: new Date('2025-12-03'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.PHD],
      field: FieldOfStudy.SCIENCE,
      description: 'The Gates Cambridge Scholarship programme was established in October 2000 by a donation of US$210m from the Bill and Melinda Gates Foundation. It is one of the most prestigious scholarships worldwide.',
      descriptionAr: 'تأسس برنامج منحة جيتس كامبريدج في أكتوبر 2000 بتبرع قدره 210 مليون دولار أمريكي من مؤسسة بيل وميليندا جيتس. وهي واحدة من أكثر المنح الدراسية المرموقة في العالم.',
      eligibility: [
        'Outstanding intellectual ability',
        'Leadership potential',
        "Commitment to improving others' lives",
        'Applying for full-time postgraduate degree',
      ],
      eligibilityAr: [
        'قدرة فكرية متميزة',
        'إمكانيات قيادية',
        'الالتزام بتحسين حياة الآخرين',
        'التقديم لدرجة دراسات عليا بدوام كامل',
      ],
      benefits: [
        'Full cost of studying at Cambridge',
        'Maintenance allowance',
        'Airfare to and from Cambridge',
        'Visa costs and immigration health surcharge',
      ],
      benefitsAr: [
        'التكلفة الكاملة للدراسة في كامبريدج',
        'بدل إعاشة',
        'تذاكر سفر من وإلى كامبريدج',
        'رسوم التأشيرة والرسوم الصحية للهجرة',
      ],
      requirements: [
        'Cambridge application',
        'Gates Cambridge application',
        'Reference letters',
        'Research proposal (for PhD)',
      ],
      requirementsAr: [
        'طلب كامبريدج',
        'طلب جيتس كامبريدج',
        'خطابات التوصية',
        'مقترح البحث (للدكتوراه)',
      ],
      howToApply: 'Apply simultaneously to Cambridge and Gates Cambridge through the university application portal.',
      howToApplyAr: 'قدم طلبك في وقت واحد إلى كامبريدج وجيتس كامبريدج من خلال بوابة التقديم بالجامعة.',
      applicationUrl: 'https://www.gatescambridge.org/',
      image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=80',
      duration: '3-4 years',
      durationAr: '3-4 سنوات',
      isFeatured: true,
      isPublished: true,
    },
    {
      slug: 'mext-scholarship',
      title: 'MEXT Japanese Government Scholarship',
      titleAr: 'منحة الحكومة اليابانية MEXT',
      university: 'Japanese Universities',
      universityAr: 'الجامعات اليابانية',
      country: 'Japan',
      countryCode: 'japan',
      countryAr: 'اليابان',
      deadline: new Date('2025-05-15'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.BACHELOR],
      field: FieldOfStudy.TECHNOLOGY,
      description: 'The Japanese Government (MEXT) Scholarship provides opportunities to study at Japanese universities. It covers research students, undergraduate students, and teacher training programs.',
      descriptionAr: 'توفر منحة الحكومة اليابانية (MEXT) فرصاً للدراسة في الجامعات اليابانية. تغطي طلاب البحث وطلاب البكالوريوس وبرامج تدريب المعلمين.',
      eligibility: [
        'Age between 17-24 for undergraduates',
        'Completed 12 years of schooling',
        'Willingness to learn Japanese',
        'Good health',
      ],
      eligibilityAr: [
        'العمر بين 17-24 للبكالوريوس',
        'إكمال 12 سنة من التعليم',
        'الرغبة في تعلم اللغة اليابانية',
        'صحة جيدة',
      ],
      benefits: [
        'Tuition fees exemption',
        'Monthly allowance of ¥117,000',
        'Round-trip airfare',
        'Free Japanese language training',
      ],
      benefitsAr: [
        'إعفاء من الرسوم الدراسية',
        'بدل شهري 117,000 ين',
        'تذاكر سفر ذهاب وإياب',
        'تدريب مجاني على اللغة اليابانية',
      ],
      requirements: [
        'Application form',
        'Academic transcripts',
        'Certificate of health',
        'Recommendation letter',
      ],
      requirementsAr: [
        'نموذج الطلب',
        'كشف الدرجات الأكاديمية',
        'شهادة صحية',
        'خطاب توصية',
      ],
      howToApply: 'Apply through the Japanese Embassy or Consulate in your country during the application period.',
      howToApplyAr: 'قدم طلبك من خلال السفارة أو القنصلية اليابانية في بلدك خلال فترة التقديم.',
      applicationUrl: 'https://www.mext.go.jp/en/',
      image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80',
      duration: '5 years',
      durationAr: '5 سنوات',
      isFeatured: false,
      isPublished: true,
    },
    {
      slug: 'swiss-excellence',
      title: 'Swiss Government Excellence Scholarships',
      titleAr: 'منح التميز السويسرية الحكومية',
      university: 'Swiss Universities',
      universityAr: 'الجامعات السويسرية',
      country: 'Switzerland',
      countryCode: 'switzerland',
      countryAr: 'سويسرا',
      deadline: new Date('2025-08-01'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.PHD],
      field: FieldOfStudy.SCIENCE,
      description: 'The Swiss Government Excellence Scholarships provide highly qualified researchers with the opportunity to pursue doctoral or postdoctoral research at one of the Swiss public universities.',
      descriptionAr: 'توفر منح التميز الحكومية السويسرية للباحثين المؤهلين تأهيلاً عالياً فرصة متابعة البحث الدكتوراه أو ما بعد الدكتوراه في إحدى الجامعات السويسرية العامة.',
      eligibility: [
        "Master's degree for PhD applications",
        'PhD for postdoctoral applications',
        'Born after a specific date',
        'Strong academic record',
      ],
      eligibilityAr: [
        'درجة الماجستير لطلبات الدكتوراه',
        'درجة الدكتوراه لطلبات ما بعد الدكتوراه',
        'أن تكون مولوداً بعد تاريخ محدد',
        'سجل أكاديمي قوي',
      ],
      benefits: [
        'Monthly scholarship of CHF 1,920',
        'Tuition fee exemption',
        'Health insurance',
        'Housing allowance',
      ],
      benefitsAr: [
        'منحة شهرية 1,920 فرنك سويسري',
        'إعفاء من الرسوم الدراسية',
        'تأمين صحي',
        'بدل سكن',
      ],
      requirements: [
        'Research proposal',
        'Acceptance from Swiss professor',
        'Academic certificates',
        'Language certificates',
      ],
      requirementsAr: [
        'مقترح بحثي',
        'قبول من أستاذ سويسري',
        'الشهادات الأكاديمية',
        'شهادات اللغة',
      ],
      howToApply: 'Contact the Swiss Embassy in your country and apply through the official channels.',
      howToApplyAr: 'تواصل مع السفارة السويسرية في بلدك وقدم طلبك من خلال القنوات الرسمية.',
      applicationUrl: 'https://www.sbfi.admin.ch/sbfi/en/home.html',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
      duration: '3 years',
      durationAr: '3 سنوات',
      isFeatured: false,
      isPublished: true,
    },
    {
      slug: 'turkiye-burslari',
      title: 'Türkiye Burslari - Turkish Government Scholarship',
      titleAr: 'منحة تركيا بورسلاري - المنحة الحكومية التركية',
      university: 'Turkish Universities',
      universityAr: 'الجامعات التركية',
      country: 'Turkey',
      countryCode: 'turkey',
      countryAr: 'تركيا',
      deadline: new Date('2025-02-20'),
      fundingType: FundingType.FULLY_FUNDED,
      levels: [StudyLevel.MASTER],
      field: FieldOfStudy.ENGINEERING,
      description: 'Türkiye Burslari is the Turkish Government\'s flagship scholarship program for international students. It offers fully-funded opportunities for Bachelor\'s, Master\'s, and PhD studies at top Turkish universities. The scholarship covers tuition, accommodation, monthly stipend, health insurance, and round-trip flight tickets.',
      descriptionAr: 'تركيا بورسلاري هو برنامج المنح الدراسية الرائد للحكومة التركية للطلاب الدوليين. يقدم فرصاً ممولة بالكامل لدراسة البكالوريوس والماجستير والدكتوراه في أفضل الجامعات التركية. تغطي المنحة الرسوم الدراسية والسكن والراتب الشهري والتأمين الصحي وتذاكر الطيران ذهاباً وإياباً.',
      eligibility: [
        'Under 21 years for Bachelor\'s, under 30 for Master\'s, under 35 for PhD',
        'Minimum 70% GPA for Bachelor\'s, 75% for Master\'s and PhD',
        'Not currently enrolled in a Turkish university',
        'Good health condition',
        'Citizen of an eligible country',
      ],
      eligibilityAr: [
        'أقل من 21 سنة للبكالوريوس، أقل من 30 للماجستير، أقل من 35 للدكتوراه',
        'معدل 70% كحد أدنى للبكالوريوس، 75% للماجستير والدكتوراه',
        'ألا يكون الطالب مسجلاً حالياً في جامعة تركية',
        'حالة صحية جيدة',
        'أن يكون من دولة مؤهلة',
      ],
      benefits: [
        'Full tuition fee coverage',
        'Monthly stipend (Bachelor: 1,000 TL, Master: 1,400 TL, PhD: 1,800 TL)',
        'Free accommodation in university dormitories',
        'Health insurance coverage',
        'Round-trip flight tickets',
        'One year Turkish language course',
      ],
      benefitsAr: [
        'تغطية كاملة للرسوم الدراسية',
        'راتب شهري (بكالوريوس: 1,000 ليرة، ماجستير: 1,400 ليرة، دكتوراه: 1,800 ليرة)',
        'سكن مجاني في المدينة الجامعية',
        'تأمين صحي شامل',
        'تذاكر طيران ذهاب وإياب',
        'دورة لغة تركية لمدة سنة',
      ],
      requirements: [
        'Online application through Türkiye Burslari portal',
        'Academic transcripts and diploma',
        'Valid passport or national ID',
        'Recent passport-sized photo',
        'Letter of intent/motivation',
        'Recommendation letter (optional but recommended)',
      ],
      requirementsAr: [
        'تقديم إلكتروني عبر بوابة تركيا بورسلاري',
        'كشف الدرجات والشهادة الأكاديمية',
        'جواز سفر ساري أو هوية وطنية',
        'صورة شخصية حديثة بحجم جواز السفر',
        'خطاب النية/التحفيز',
        'خطاب توصية (اختياري لكن مُوصى به)',
      ],
      howToApply: 'Apply online through the official Türkiye Burslari website (turkiyeburslari.gov.tr) during the application period, usually from January to February. Complete your application with all required documents and submit before the deadline.',
      howToApplyAr: 'قدم طلبك إلكترونياً عبر موقع تركيا بورسلاري الرسمي (turkiyeburslari.gov.tr) خلال فترة التقديم، عادةً من يناير إلى فبراير. أكمل طلبك مع جميع المستندات المطلوبة وأرسله قبل الموعد النهائي.',
      applicationUrl: 'https://turkiyeburslari.gov.tr/',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
      duration: '1-4 years (depending on program)',
      durationAr: '1-4 سنوات (حسب البرنامج)',
      isFeatured: true,
      isPublished: true,
    },
  ];

  for (const scholarship of scholarships) {
    await prisma.scholarship.upsert({
      where: { slug: scholarship.slug },
      update: scholarship,
      create: scholarship,
    });
  }
  console.log('Created scholarships:', scholarships.length);

  // Create testimonials
  const testimonials = [
    {
      name: 'Ahmed Hassan',
      nameAr: 'أحمد حسن',
      university: 'Oxford University',
      universityAr: 'جامعة أكسفورد',
      country: 'UK',
      countryAr: 'بريطانيا',
      quote: 'This platform helped me find the perfect scholarship. The guidance was invaluable in my application journey.',
      quoteAr: 'ساعدتني هذه المنصة في العثور على المنحة المثالية. كان التوجيه لا يقدر بثمن في رحلة تقديمي.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      scholarshipYear: 2023,
      isPublished: true,
    },
    {
      name: 'Sara Ali',
      nameAr: 'سارة علي',
      university: 'MIT',
      universityAr: 'معهد ماساتشوستس للتكنولوجيا',
      country: 'USA',
      countryAr: 'أمريكا',
      quote: "I never thought studying abroad was possible until I discovered the scholarships listed here. Now I'm living my dream!",
      quoteAr: 'لم أكن أظن أن الدراسة في الخارج ممكنة حتى اكتشفت المنح المدرجة هنا. الآن أعيش حلمي!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      scholarshipYear: 2024,
      isPublished: true,
    },
    {
      name: 'Mohammed Khalid',
      nameAr: 'محمد خالد',
      university: 'TU Munich',
      universityAr: 'جامعة ميونيخ التقنية',
      country: 'Germany',
      countryAr: 'ألمانيا',
      quote: 'The detailed information about each scholarship made the application process so much easier. Highly recommended!',
      quoteAr: 'المعلومات المفصلة عن كل منحة جعلت عملية التقديم أسهل بكثير. أنصح به بشدة!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
      scholarshipYear: 2023,
      isPublished: true,
    },
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: testimonial.name },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial });
    }
  }
  console.log('Created testimonials:', testimonials.length);

  // Create blog posts
  const blogPosts = [
    {
      slug: 'how-to-write-winning-motivation-letter',
      title: 'How to Write a Winning Motivation Letter',
      titleAr: 'كيف تكتب خطاب دافع فائز',
      excerpt: 'Learn the essential elements of a compelling motivation letter that will make your scholarship application stand out from thousands of applicants.',
      excerptAr: 'تعرف على العناصر الأساسية لخطاب دافع مقنع يجعل طلب المنحة الخاص بك يبرز بين آلاف المتقدمين.',
      content: `# How to Write a Winning Motivation Letter

A motivation letter is your opportunity to stand out from thousands of other applicants. It's your chance to tell your story, explain your goals, and convince the scholarship committee that you're the right candidate.

## Key Elements of a Strong Motivation Letter

### 1. Strong Opening
Capture the reader's attention from the first sentence. Avoid generic openings like "I am writing to apply for..." Instead, start with something memorable about your journey or aspirations.

### 2. Personal Story
Share your unique background and experiences. What challenges have you overcome? What experiences shaped your academic interests? Be authentic and specific.

### 3. Clear Goals
Explain your academic and career objectives. How does this scholarship align with your goals? What do you hope to achieve during and after your studies?

### 4. Why This Program
Show that you've done your research. Why specifically this university or program? What unique opportunities does it offer that align with your interests?

### 5. Future Plans
Demonstrate how you plan to use your education to make an impact. Scholarship committees want to invest in future leaders who will contribute to their communities.

## Tips for Success

- **Be authentic**: Don't try to be someone you're not
- **Be specific**: Use concrete examples rather than vague statements
- **Keep it concise**: Typically 500-1000 words is ideal
- **Proofread multiple times**: Ask others to review your letter
- **Follow instructions**: Adhere to any specific guidelines provided

## Common Mistakes to Avoid

- Repeating your CV or resume
- Being too generic or vague
- Focusing only on what you'll gain
- Grammatical and spelling errors
- Missing the deadline

Remember, your motivation letter is your voice on paper. Make it count!`,
      contentAr: `# كيف تكتب خطاب دافع فائز

خطاب الدافع هو فرصتك للتميز عن آلاف المتقدمين الآخرين. إنه فرصتك لتروي قصتك وتشرح أهدافك وتقنع لجنة المنح بأنك المرشح المناسب.

## العناصر الأساسية لخطاب دافع قوي

### 1. افتتاحية قوية
اجذب انتباه القارئ من الجملة الأولى. تجنب الافتتاحيات العامة مثل "أكتب للتقديم على..." بدلاً من ذلك، ابدأ بشيء لا يُنسى عن رحلتك أو طموحاتك.

### 2. قصة شخصية
شارك خلفيتك وتجاربك الفريدة. ما التحديات التي تغلبت عليها؟ ما التجارب التي شكلت اهتماماتك الأكاديمية؟ كن صادقاً ومحدداً.

### 3. أهداف واضحة
اشرح أهدافك الأكاديمية والمهنية. كيف تتوافق هذه المنحة مع أهدافك؟ ماذا تأمل أن تحقق أثناء وبعد دراستك؟

### 4. لماذا هذا البرنامج
أظهر أنك أجريت بحثك. لماذا هذه الجامعة أو البرنامج بالتحديد؟ ما الفرص الفريدة التي يقدمها والتي تتوافق مع اهتماماتك؟

### 5. خطط مستقبلية
أظهر كيف تخطط لاستخدام تعليمك لإحداث تأثير. لجان المنح تريد الاستثمار في قادة المستقبل الذين سيساهمون في مجتمعاتهم.

## نصائح للنجاح

- **كن صادقاً**: لا تحاول أن تكون شخصاً لست عليه
- **كن محدداً**: استخدم أمثلة ملموسة بدلاً من العبارات الغامضة
- **كن موجزاً**: عادة 500-1000 كلمة مثالية
- **راجع عدة مرات**: اطلب من الآخرين مراجعة خطابك
- **اتبع التعليمات**: التزم بأي إرشادات محددة مقدمة

تذكر، خطاب الدافع هو صوتك على الورق. اجعله مؤثراً!`,
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
      category: 'Application Tips',
      categoryAr: 'نصائح التقديم',
      author: 'Sudan Scholars Hub',
      authorAr: 'مركز منح السودان',
      readTime: '5 min read',
      readTimeAr: '5 دقائق قراءة',
      tags: ['motivation letter', 'application tips', 'scholarships'],
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date('2024-12-15'),
    },
    {
      slug: 'turkiye-burslari-complete-guide',
      title: 'Türkiye Burslari 2025: Complete Application Guide',
      titleAr: 'منحة تركيا 2025: دليل التقديم الكامل',
      excerpt: 'Everything you need to know about applying for the Turkish Government Scholarship - deadlines, requirements, and insider tips.',
      excerptAr: 'كل ما تحتاج معرفته عن التقديم لمنحة الحكومة التركية - المواعيد والمتطلبات ونصائح من الداخل.',
      content: `# Türkiye Burslari 2025: Complete Application Guide

The Turkish Government Scholarship (Türkiye Burslari) is one of the most popular fully-funded scholarships for international students. Here's everything you need to know about the 2025 application.

## Application Timeline

- **Application Opens**: January 10, 2025
- **Application Deadline**: February 20, 2025
- **Interview Period**: March - June 2025
- **Results Announcement**: July 2025
- **Turkish Language Course**: September 2025
- **Academic Year Begins**: October 2025

## Eligibility Requirements

### Age Limits
- Bachelor's: Under 21 years old
- Master's: Under 30 years old
- PhD: Under 35 years old

### Academic Requirements
- Bachelor's applicants: Minimum 70% GPA
- Master's and PhD applicants: Minimum 75% GPA

## Required Documents

1. Valid passport or national ID
2. Recent passport-sized photo
3. High school diploma/transcript (for Bachelor's)
4. University diploma/transcript (for Master's/PhD)
5. Letter of intent
6. Optional: Language certificates, recommendation letters

## Tips for a Strong Application

### 1. Start Early
Don't wait until the last minute. The application portal can be slow near the deadline.

### 2. Write a Compelling Letter of Intent
This is your most important document. Explain why you want to study in Turkey and how you'll contribute.

### 3. Choose Programs Carefully
You can select up to 12 programs. Research each one thoroughly.

### 4. Prepare for the Interview
If shortlisted, you'll have an interview. Practice common questions and be ready to discuss your goals.

## Benefits Covered

- Full tuition fees
- Monthly stipend
- Accommodation
- Health insurance
- One-year Turkish language course
- Round-trip flight tickets

Good luck with your application!`,
      contentAr: `# منحة تركيا 2025: دليل التقديم الكامل

منحة الحكومة التركية (تركيا بورسلاري) هي واحدة من أكثر المنح الممولة بالكامل شعبية للطلاب الدوليين. إليك كل ما تحتاج معرفته عن تقديم 2025.

## الجدول الزمني للتقديم

- **فتح التقديم**: 10 يناير 2025
- **آخر موعد للتقديم**: 20 فبراير 2025
- **فترة المقابلات**: مارس - يونيو 2025
- **إعلان النتائج**: يوليو 2025
- **دورة اللغة التركية**: سبتمبر 2025
- **بداية العام الدراسي**: أكتوبر 2025

## شروط الأهلية

### حدود العمر
- البكالوريوس: أقل من 21 سنة
- الماجستير: أقل من 30 سنة
- الدكتوراه: أقل من 35 سنة

### المتطلبات الأكاديمية
- متقدمو البكالوريوس: معدل 70% كحد أدنى
- متقدمو الماجستير والدكتوراه: معدل 75% كحد أدنى

## المستندات المطلوبة

1. جواز سفر ساري أو هوية وطنية
2. صورة شخصية حديثة بحجم جواز السفر
3. شهادة الثانوية/كشف الدرجات (للبكالوريوس)
4. شهادة الجامعة/كشف الدرجات (للماجستير/الدكتوراه)
5. خطاب النية
6. اختياري: شهادات لغة، خطابات توصية

## نصائح لتقديم قوي

### 1. ابدأ مبكراً
لا تنتظر حتى اللحظة الأخيرة. بوابة التقديم قد تكون بطيئة قرب الموعد النهائي.

### 2. اكتب خطاب نية مقنع
هذا هو أهم مستند لديك. اشرح لماذا تريد الدراسة في تركيا وكيف ستساهم.

### 3. اختر البرامج بعناية
يمكنك اختيار حتى 12 برنامجاً. ابحث عن كل واحد بدقة.

### 4. استعد للمقابلة
إذا تم اختيارك، ستجري مقابلة. تدرب على الأسئلة الشائعة وكن مستعداً لمناقشة أهدافك.

## المزايا المغطاة

- الرسوم الدراسية الكاملة
- راتب شهري
- سكن
- تأمين صحي
- دورة لغة تركية لمدة سنة
- تذاكر طيران ذهاب وإياب

حظاً موفقاً في تقديمك!`,
      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
      category: 'Scholarships',
      categoryAr: 'المنح الدراسية',
      author: 'Sudan Scholars Hub',
      authorAr: 'مركز منح السودان',
      readTime: '8 min read',
      readTimeAr: '8 دقائق قراءة',
      tags: ['turkiye burslari', 'turkey scholarship', 'application guide'],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2024-12-10'),
    },
    {
      slug: 'ielts-preparation-tips',
      title: 'IELTS Preparation: Score 7+ in 30 Days',
      titleAr: 'التحضير للآيلتس: احصل على 7+ في 30 يوماً',
      excerpt: 'Practical strategies and resources to help you achieve a high IELTS score, even with limited preparation time.',
      excerptAr: 'استراتيجيات وموارد عملية لمساعدتك على تحقيق درجة عالية في الآيلتس، حتى مع وقت محدود للتحضير.',
      content: `# IELTS Preparation: Score 7+ in 30 Days

Achieving a band 7 or higher on IELTS is possible with focused preparation. Here's a 30-day strategy that works.

## Understanding the Test

IELTS has four sections:
- Listening (30 minutes)
- Reading (60 minutes)
- Writing (60 minutes)
- Speaking (11-14 minutes)

## 30-Day Study Plan

### Week 1: Assessment and Basics
- Take a practice test to assess your current level
- Identify your weak areas
- Learn the test format thoroughly
- Start vocabulary building (10 new words daily)

### Week 2: Skill Building
- Focus on your weakest section
- Practice listening with BBC podcasts
- Read academic articles daily
- Write one essay per day

### Week 3: Intensive Practice
- Do full practice tests
- Time yourself strictly
- Review mistakes carefully
- Practice speaking with a partner

### Week 4: Final Push
- Continue practice tests
- Focus on speed and accuracy
- Review common topics
- Rest well before the exam

## Section-Specific Tips

### Listening
- Read questions before audio plays
- Practice with different accents
- Note keywords and synonyms

### Reading
- Skim passages first
- Manage your time (20 min per passage)
- Practice locating information quickly

### Writing
- Learn essay structures
- Practice paraphrasing
- Check grammar and spelling

### Speaking
- Practice with native speakers
- Record yourself and review
- Expand your answers naturally

## Recommended Resources

- Cambridge IELTS Practice Tests
- IELTS Liz (free online)
- BBC Learning English
- TED Talks for listening practice

Stay consistent and believe in yourself!`,
      contentAr: `# التحضير للآيلتس: احصل على 7+ في 30 يوماً

تحقيق درجة 7 أو أعلى في الآيلتس ممكن مع التحضير المركز. إليك استراتيجية 30 يوماً فعالة.

## فهم الاختبار

الآيلتس يتكون من أربعة أقسام:
- الاستماع (30 دقيقة)
- القراءة (60 دقيقة)
- الكتابة (60 دقيقة)
- المحادثة (11-14 دقيقة)

## خطة دراسة 30 يوماً

### الأسبوع الأول: التقييم والأساسيات
- خذ اختباراً تجريبياً لتقييم مستواك الحالي
- حدد نقاط ضعفك
- تعلم شكل الاختبار جيداً
- ابدأ ببناء المفردات (10 كلمات جديدة يومياً)

### الأسبوع الثاني: بناء المهارات
- ركز على قسمك الأضعف
- تدرب على الاستماع مع بودكاست BBC
- اقرأ مقالات أكاديمية يومياً
- اكتب مقالاً واحداً يومياً

### الأسبوع الثالث: التدريب المكثف
- أجرِ اختبارات تجريبية كاملة
- التزم بالوقت بدقة
- راجع أخطاءك بعناية
- تدرب على المحادثة مع شريك

### الأسبوع الرابع: الدفعة الأخيرة
- استمر في الاختبارات التجريبية
- ركز على السرعة والدقة
- راجع المواضيع الشائعة
- استرح جيداً قبل الامتحان

## نصائح خاصة بكل قسم

### الاستماع
- اقرأ الأسئلة قبل تشغيل الصوت
- تدرب على لهجات مختلفة
- لاحظ الكلمات المفتاحية والمرادفات

### القراءة
- تصفح المقاطع أولاً
- أدر وقتك (20 دقيقة لكل مقطع)
- تدرب على تحديد موقع المعلومات بسرعة

### الكتابة
- تعلم هياكل المقالات
- تدرب على إعادة الصياغة
- تحقق من القواعد والإملاء

### المحادثة
- تدرب مع متحدثين أصليين
- سجل نفسك وراجع
- وسع إجاباتك بشكل طبيعي

كن مثابراً وآمن بنفسك!`,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
      category: 'Test Prep',
      categoryAr: 'التحضير للاختبارات',
      author: 'Sudan Scholars Hub',
      authorAr: 'مركز منح السودان',
      readTime: '6 min read',
      readTimeAr: '6 دقائق قراءة',
      tags: ['IELTS', 'test preparation', 'english proficiency'],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2024-12-05'),
    },
    {
      slug: 'student-life-in-germany',
      title: 'Student Life in Germany: What to Expect',
      titleAr: 'حياة الطالب في ألمانيا: ماذا تتوقع',
      excerpt: 'A comprehensive guide to living and studying in Germany - from accommodation to part-time jobs and social life.',
      excerptAr: 'دليل شامل للعيش والدراسة في ألمانيا - من السكن إلى الوظائف بدوام جزئي والحياة الاجتماعية.',
      content: `# Student Life in Germany: What to Expect

Germany is one of the top destinations for international students. Here's what you need to know about living and studying there.

## Cost of Living

Monthly expenses typically range from €800-1,200:
- Rent: €300-600
- Food: €150-200
- Transport: €50-100
- Health Insurance: €100
- Phone/Internet: €30-50
- Entertainment: €50-100

## Accommodation Options

### Student Dormitories (Studentenwohnheim)
- Most affordable option (€200-400/month)
- Apply early through Studentenwerk
- Limited availability

### Shared Apartments (WG)
- Popular among students
- Cost: €300-500/month
- Great for making friends

### Private Apartments
- More expensive (€500-800/month)
- More privacy and independence

## Part-Time Work

International students can work:
- Up to 120 full days or 240 half days per year
- No limit for student jobs (Werkstudent)
- Minimum wage: €12.41/hour (2024)

## Healthcare

Health insurance is mandatory:
- Public insurance: ~€110/month
- Students under 30 can use public insurance
- Over 30 must use private insurance

## Transportation

- Semester ticket included in tuition fees
- Covers public transport in your city/region
- Deutsche Bahn offers student discounts

## Social Life

- Join university clubs (Hochschulsport)
- Attend orientation events
- Explore German culture
- Travel during semester breaks

## Tips for Success

1. Learn basic German before arriving
2. Open a blocked account for visa
3. Register your address (Anmeldung)
4. Get a German bank account
5. Make German friends

Germany offers excellent education and quality of life. Embrace the experience!`,
      contentAr: `# حياة الطالب في ألمانيا: ماذا تتوقع

ألمانيا هي واحدة من أفضل الوجهات للطلاب الدوليين. إليك ما تحتاج معرفته عن العيش والدراسة هناك.

## تكلفة المعيشة

النفقات الشهرية عادة تتراوح بين 800-1,200 يورو:
- الإيجار: 300-600 يورو
- الطعام: 150-200 يورو
- المواصلات: 50-100 يورو
- التأمين الصحي: 100 يورو
- الهاتف/الإنترنت: 30-50 يورو
- الترفيه: 50-100 يورو

## خيارات السكن

### السكن الجامعي (Studentenwohnheim)
- الخيار الأقل تكلفة (200-400 يورو/شهر)
- قدم مبكراً من خلال Studentenwerk
- التوفر محدود

### الشقق المشتركة (WG)
- شائعة بين الطلاب
- التكلفة: 300-500 يورو/شهر
- رائعة لتكوين صداقات

### الشقق الخاصة
- أغلى (500-800 يورو/شهر)
- خصوصية واستقلالية أكثر

## العمل بدوام جزئي

يمكن للطلاب الدوليين العمل:
- حتى 120 يوم كامل أو 240 نصف يوم سنوياً
- بلا حدود للوظائف الطلابية (Werkstudent)
- الحد الأدنى للأجور: 12.41 يورو/ساعة (2024)

## الرعاية الصحية

التأمين الصحي إلزامي:
- التأمين العام: ~110 يورو/شهر
- الطلاب تحت 30 يمكنهم استخدام التأمين العام
- فوق 30 يجب استخدام التأمين الخاص

## المواصلات

- تذكرة الفصل مشمولة في الرسوم
- تغطي المواصلات العامة في مدينتك/منطقتك
- Deutsche Bahn تقدم خصومات للطلاب

## الحياة الاجتماعية

- انضم لأندية الجامعة (Hochschulsport)
- احضر فعاليات التوجيه
- اكتشف الثقافة الألمانية
- سافر خلال العطلات

## نصائح للنجاح

1. تعلم الألمانية الأساسية قبل الوصول
2. افتح حساباً مغلقاً للتأشيرة
3. سجل عنوانك (Anmeldung)
4. احصل على حساب بنكي ألماني
5. كوّن صداقات ألمانية

ألمانيا تقدم تعليماً ممتازاً وجودة حياة. استمتع بالتجربة!`,
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
      category: 'Study Abroad',
      categoryAr: 'الدراسة بالخارج',
      author: 'Sudan Scholars Hub',
      authorAr: 'مركز منح السودان',
      readTime: '7 min read',
      readTimeAr: '7 دقائق قراءة',
      tags: ['germany', 'student life', 'study abroad'],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2024-11-28'),
    },
    {
      slug: 'recommendation-letter-guide',
      title: 'Getting Strong Recommendation Letters',
      titleAr: 'الحصول على خطابات توصية قوية',
      excerpt: 'How to approach professors and employers for recommendation letters, and what information to provide them.',
      excerptAr: 'كيفية مراسلة الأساتذة وأصحاب العمل للحصول على خطابات توصية، وما المعلومات التي يجب تقديمها لهم.',
      content: `# Getting Strong Recommendation Letters

Strong recommendation letters can make or break your scholarship application. Here's how to get them.

## Who to Ask

### Best Choices
- Professors who know your work well
- Research supervisors
- Employers who can speak to your skills
- Mentors who've guided your development

### Avoid
- Family members
- Friends
- People who barely know you
- Famous people with no direct connection

## When to Ask

- At least 4-6 weeks before deadline
- Earlier is always better
- Allow time for revisions

## How to Ask

### The Right Approach
1. Ask in person if possible
2. Be specific about what you need
3. Explain why you chose them
4. Offer to provide supporting materials

### What to Say
"Professor [Name], I'm applying for [scholarship]. Based on our work together on [project], I believe you could speak to my [skills]. Would you be willing to write a recommendation?"

## Information to Provide

### Essential Materials
- Your updated CV/resume
- Personal statement draft
- Scholarship description
- Deadline and submission method
- List of your achievements

### Helpful Context
- Specific examples they can mention
- Skills you want highlighted
- Your career goals
- Why this scholarship matters

## Following Up

- Send a polite reminder 2 weeks before deadline
- Confirm submission
- Thank them regardless of outcome
- Update them on your results

## Red Flags

Signs someone might not write a strong letter:
- They hesitate when asked
- They say they're too busy
- They don't know you well enough
- They ask you to write it yourself

## Final Tips

- Quality over prestige
- Give them time to write thoughtfully
- Show gratitude always
- Keep recommenders updated on your journey

A genuine, detailed letter from someone who knows you beats a generic letter from a famous person every time.`,
      contentAr: `# الحصول على خطابات توصية قوية

خطابات التوصية القوية يمكن أن تصنع أو تكسر طلب المنحة الخاص بك. إليك كيفية الحصول عليها.

## من تطلب منه

### الخيارات الأفضل
- أساتذة يعرفون عملك جيداً
- مشرفو البحث
- أصحاب العمل الذين يمكنهم التحدث عن مهاراتك
- المرشدون الذين وجهوا تطورك

### تجنب
- أفراد العائلة
- الأصدقاء
- أشخاص بالكاد يعرفونك
- أشخاص مشهورون بدون صلة مباشرة

## متى تطلب

- قبل 4-6 أسابيع على الأقل من الموعد النهائي
- الأبكر دائماً أفضل
- اترك وقتاً للمراجعات

## كيف تطلب

### النهج الصحيح
1. اطلب شخصياً إن أمكن
2. كن محدداً بشأن ما تحتاجه
3. اشرح لماذا اخترتهم
4. اعرض تقديم مواد داعمة

### ماذا تقول
"أستاذ [الاسم]، أنا أتقدم لـ [المنحة]. بناءً على عملنا معاً في [المشروع]، أعتقد أنك تستطيع التحدث عن [مهاراتي]. هل ستكون على استعداد لكتابة توصية؟"

## المعلومات المطلوب تقديمها

### المواد الأساسية
- سيرتك الذاتية المحدثة
- مسودة البيان الشخصي
- وصف المنحة
- الموعد النهائي وطريقة التقديم
- قائمة إنجازاتك

### سياق مفيد
- أمثلة محددة يمكنهم ذكرها
- المهارات التي تريد إبرازها
- أهدافك المهنية
- لماذا هذه المنحة مهمة

## المتابعة

- أرسل تذكيراً لطيفاً قبل أسبوعين من الموعد
- تأكد من التقديم
- اشكرهم بغض النظر عن النتيجة
- أطلعهم على نتائجك

## علامات تحذيرية

علامات أن شخصاً قد لا يكتب خطاباً قوياً:
- يتردد عند السؤال
- يقول إنه مشغول جداً
- لا يعرفك جيداً بما فيه الكفاية
- يطلب منك كتابته بنفسك

## نصائح أخيرة

- الجودة أهم من المكانة
- امنحهم وقتاً للكتابة بعناية
- أظهر الامتنان دائماً
- أبقِ المرجعين على اطلاع برحلتك

خطاب صادق ومفصل من شخص يعرفك يتفوق على خطاب عام من شخص مشهور في كل مرة.`,
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
      category: 'Application Tips',
      categoryAr: 'نصائح التقديم',
      author: 'Sudan Scholars Hub',
      authorAr: 'مركز منح السودان',
      readTime: '4 min read',
      readTimeAr: '4 دقائق قراءة',
      tags: ['recommendation letters', 'application tips', 'professors'],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2024-11-20'),
    },
    {
      slug: 'scholarship-interview-tips',
      title: 'Ace Your Scholarship Interview',
      titleAr: 'تألق في مقابلة المنحة',
      excerpt: 'Common scholarship interview questions and how to answer them confidently. Includes virtual interview tips.',
      excerptAr: 'أسئلة مقابلات المنح الشائعة وكيفية الإجابة عليها بثقة. يتضمن نصائح للمقابلات الافتراضية.',
      content: `# Ace Your Scholarship Interview

Getting an interview means you're a strong candidate. Now it's time to seal the deal.

## Common Questions

### About Yourself
- Tell us about yourself
- What are your strengths and weaknesses?
- What's your greatest achievement?

### About Your Goals
- Where do you see yourself in 10 years?
- Why this field of study?
- How will you use this education?

### About the Scholarship
- Why do you deserve this scholarship?
- How will you contribute to our community?
- Why this country/university?

## How to Answer

### STAR Method
- Situation: Set the context
- Task: Describe the challenge
- Action: Explain what you did
- Result: Share the outcome

### Be Specific
Don't say: "I'm a hard worker"
Say: "I balanced a full course load while working 20 hours weekly and maintained a 3.8 GPA"

## Virtual Interview Tips

### Technical Setup
- Test your camera and microphone
- Ensure stable internet connection
- Use a professional background
- Have good lighting

### During the Interview
- Look at the camera, not the screen
- Minimize distractions
- Have notes nearby (but don't read)
- Dress professionally (full outfit!)

## Questions to Ask

Show interest by asking:
- What qualities do successful scholars share?
- What opportunities are available for scholars?
- How can I contribute to the program?

## Day Before Checklist

- Research the organization thoroughly
- Prepare your answers
- Choose your outfit
- Get a good night's sleep
- Prepare questions to ask

## Body Language

- Sit up straight
- Smile naturally
- Maintain eye contact
- Use hand gestures appropriately
- Show enthusiasm

## After the Interview

- Send a thank-you email within 24 hours
- Mention something specific from the conversation
- Reiterate your interest

Remember: They already believe in you. Now show them why!`,
      contentAr: `# تألق في مقابلة المنحة

الحصول على مقابلة يعني أنك مرشح قوي. الآن حان الوقت لإتمام الأمر.

## الأسئلة الشائعة

### عن نفسك
- أخبرنا عن نفسك
- ما نقاط قوتك وضعفك؟
- ما أعظم إنجازاتك؟

### عن أهدافك
- أين ترى نفسك بعد 10 سنوات؟
- لماذا هذا المجال الدراسي؟
- كيف ستستخدم هذا التعليم؟

### عن المنحة
- لماذا تستحق هذه المنحة؟
- كيف ستساهم في مجتمعنا؟
- لماذا هذا البلد/الجامعة؟

## كيف تجيب

### طريقة STAR
- الموقف: حدد السياق
- المهمة: صف التحدي
- الإجراء: اشرح ما فعلته
- النتيجة: شارك المخرجات

### كن محدداً
لا تقل: "أنا عامل مجتهد"
قل: "وازنت بين حمل دراسي كامل والعمل 20 ساعة أسبوعياً وحافظت على معدل 3.8"

## نصائح المقابلة الافتراضية

### الإعداد التقني
- اختبر الكاميرا والميكروفون
- تأكد من استقرار الإنترنت
- استخدم خلفية احترافية
- احصل على إضاءة جيدة

### أثناء المقابلة
- انظر إلى الكاميرا، ليس الشاشة
- قلل من المشتتات
- احتفظ بملاحظات قريبة (لكن لا تقرأ)
- ارتدِ ملابس رسمية (الزي كاملاً!)

## أسئلة لتطرحها

أظهر الاهتمام بالسؤال:
- ما الصفات المشتركة بين الحاصلين على المنحة الناجحين؟
- ما الفرص المتاحة للحاصلين على المنحة؟
- كيف يمكنني المساهمة في البرنامج؟

## قائمة تحقق لليوم السابق

- ابحث عن المنظمة جيداً
- حضر إجاباتك
- اختر ملابسك
- احصل على نوم جيد
- حضر أسئلة لتطرحها

## لغة الجسد

- اجلس مستقيماً
- ابتسم بشكل طبيعي
- حافظ على التواصل البصري
- استخدم إيماءات اليد بشكل مناسب
- أظهر الحماس

## بعد المقابلة

- أرسل بريد شكر خلال 24 ساعة
- اذكر شيئاً محدداً من المحادثة
- أكد على اهتمامك

تذكر: هم يؤمنون بك بالفعل. الآن أظهر لهم لماذا!`,
      image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&q=80',
      category: 'Interview',
      categoryAr: 'المقابلات',
      author: 'Sudan Scholars Hub',
      authorAr: 'مركز منح السودان',
      readTime: '6 min read',
      readTimeAr: '6 دقائق قراءة',
      tags: ['interview tips', 'scholarship interview', 'preparation'],
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date('2024-11-15'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log('Created blog posts:', blogPosts.length);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
