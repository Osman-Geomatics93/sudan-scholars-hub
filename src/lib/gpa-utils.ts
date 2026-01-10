/**
 * GPA Conversion Utilities
 * Supports conversion between multiple international grading systems
 */

// Letter grade to percentage mapping
export const LETTER_GRADES: Record<string, number> = {
  'A+': 97,
  'A': 93,
  'A-': 90,
  'B+': 87,
  'B': 83,
  'B-': 80,
  'C+': 77,
  'C': 73,
  'C-': 70,
  'D+': 67,
  'D': 63,
  'D-': 60,
  'F': 0,
};

// Letter grade to 4.0 GPA mapping
export const LETTER_TO_GPA: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

// UK Classification grades
export const UK_GRADES: Record<string, number> = {
  'First': 70,
  '2:1': 60,
  '2:2': 50,
  'Third': 40,
  'Fail': 0,
};

// GPA System types
export type GPASystem =
  | 'us-4.0'
  | 'us-5.0'
  | 'percentage'
  | 'letter'
  | 'uk'
  | 'german'
  | 'french';

// System configuration
export interface GPASystemConfig {
  id: GPASystem;
  name: { en: string; ar: string };
  min: number;
  max: number;
  isDiscrete?: boolean;
  grades?: string[];
  description: { en: string; ar: string };
}

export const GPA_SYSTEMS: GPASystemConfig[] = [
  {
    id: 'us-4.0',
    name: { en: 'US 4.0 Scale', ar: 'النظام الأمريكي 4.0' },
    min: 0,
    max: 4.0,
    description: { en: 'Common in USA and Canada', ar: 'شائع في أمريكا وكندا' },
  },
  {
    id: 'us-5.0',
    name: { en: 'US 5.0 Scale', ar: 'النظام الأمريكي 5.0' },
    min: 0,
    max: 5.0,
    description: { en: 'Used in some US schools', ar: 'مستخدم في بعض المدارس الأمريكية' },
  },
  {
    id: 'percentage',
    name: { en: 'Percentage (0-100)', ar: 'النسبة المئوية (0-100)' },
    min: 0,
    max: 100,
    description: { en: 'Turkey, India, Sudan, and more', ar: 'تركيا، الهند، السودان، وغيرها' },
  },
  {
    id: 'letter',
    name: { en: 'Letter Grade (A-F)', ar: 'الحروف (A-F)' },
    min: 0,
    max: 100,
    isDiscrete: true,
    grades: Object.keys(LETTER_GRADES),
    description: { en: 'International letter grading', ar: 'نظام الحروف الدولي' },
  },
  {
    id: 'uk',
    name: { en: 'UK Classification', ar: 'التصنيف البريطاني' },
    min: 0,
    max: 100,
    isDiscrete: true,
    grades: Object.keys(UK_GRADES),
    description: { en: 'UK and Commonwealth countries', ar: 'بريطانيا ودول الكومنولث' },
  },
  {
    id: 'german',
    name: { en: 'German Scale (1-5)', ar: 'النظام الألماني (1-5)' },
    min: 1.0,
    max: 5.0,
    description: { en: 'Germany, Austria (1 is best)', ar: 'ألمانيا، النمسا (1 هو الأفضل)' },
  },
  {
    id: 'french',
    name: { en: 'French Scale (0-20)', ar: 'النظام الفرنسي (0-20)' },
    min: 0,
    max: 20,
    description: { en: 'France and French-speaking countries', ar: 'فرنسا والدول الفرانكوفونية' },
  },
];

/**
 * Convert any GPA value to percentage (0-100)
 */
export function toPercentage(value: number | string, system: GPASystem): number {
  switch (system) {
    case 'us-4.0':
      return (Number(value) / 4.0) * 100;
    case 'us-5.0':
      return (Number(value) / 5.0) * 100;
    case 'percentage':
      return Number(value);
    case 'letter':
      return LETTER_GRADES[String(value).toUpperCase()] ?? 0;
    case 'uk':
      return UK_GRADES[String(value)] ?? 0;
    case 'german':
      // German scale: 1.0 = best (100%), 5.0 = fail (0%)
      const germanValue = Number(value);
      return ((5 - germanValue) / 4) * 100;
    case 'french':
      return (Number(value) / 20) * 100;
    default:
      return 0;
  }
}

/**
 * Convert percentage to target GPA system
 */
export function fromPercentage(percent: number, system: GPASystem): number | string {
  // Clamp percentage between 0 and 100
  const clampedPercent = Math.max(0, Math.min(100, percent));

  switch (system) {
    case 'us-4.0':
      return Number(((clampedPercent / 100) * 4.0).toFixed(2));
    case 'us-5.0':
      return Number(((clampedPercent / 100) * 5.0).toFixed(2));
    case 'percentage':
      return Number(clampedPercent.toFixed(1));
    case 'letter':
      return percentToLetter(clampedPercent);
    case 'uk':
      return percentToUK(clampedPercent);
    case 'german':
      // German scale: 100% = 1.0, 0% = 5.0
      return Number((5 - (clampedPercent / 100) * 4).toFixed(1));
    case 'french':
      return Number(((clampedPercent / 100) * 20).toFixed(1));
    default:
      return 0;
  }
}

/**
 * Convert percentage to letter grade
 */
function percentToLetter(percent: number): string {
  if (percent >= 97) return 'A+';
  if (percent >= 93) return 'A';
  if (percent >= 90) return 'A-';
  if (percent >= 87) return 'B+';
  if (percent >= 83) return 'B';
  if (percent >= 80) return 'B-';
  if (percent >= 77) return 'C+';
  if (percent >= 73) return 'C';
  if (percent >= 70) return 'C-';
  if (percent >= 67) return 'D+';
  if (percent >= 63) return 'D';
  if (percent >= 60) return 'D-';
  return 'F';
}

/**
 * Convert percentage to UK classification
 */
function percentToUK(percent: number): string {
  if (percent >= 70) return 'First';
  if (percent >= 60) return '2:1';
  if (percent >= 50) return '2:2';
  if (percent >= 40) return 'Third';
  return 'Fail';
}

/**
 * Convert GPA from one system to another
 */
export function convertGPA(
  value: number | string,
  fromSystem: GPASystem,
  toSystem: GPASystem
): number | string {
  const percent = toPercentage(value, fromSystem);
  return fromPercentage(percent, toSystem);
}

/**
 * Get display value for GPA
 */
export function formatGPAValue(value: number | string, system: GPASystem): string {
  if (system === 'letter' || system === 'uk') {
    return String(value);
  }
  if (system === 'percentage') {
    return `${value}%`;
  }
  if (system === 'german') {
    return `${value}/5.0`;
  }
  if (system === 'french') {
    return `${value}/20`;
  }
  if (system === 'us-4.0') {
    return `${value}/4.0`;
  }
  if (system === 'us-5.0') {
    return `${value}/5.0`;
  }
  return String(value);
}

// Scholarship requirement interface
export interface ScholarshipRequirement {
  id: string;
  name: { en: string; ar: string };
  minPercent: number;
  levels: ('BACHELOR' | 'MASTER' | 'PHD')[];
  note: { en: string; ar: string };
  country: string;
  website?: string;
}

// Pre-defined scholarship requirements
export const SCHOLARSHIP_REQUIREMENTS: ScholarshipRequirement[] = [
  // === EUROPE ===
  {
    id: 'turkish',
    name: { en: 'Turkish Government Scholarship', ar: 'المنحة التركية الحكومية' },
    minPercent: 70,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: '70% for Bachelor, 75% for Master/PhD',
      ar: '70% للبكالوريوس، 75% للماجستير/الدكتوراه'
    },
    country: 'Turkey',
    website: 'https://turkiyeburslari.gov.tr',
  },
  {
    id: 'daad',
    name: { en: 'DAAD Scholarship', ar: 'منحة DAAD الألمانية' },
    minPercent: 75,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Requires "Good" grade (2.5 German scale)',
      ar: 'يتطلب درجة "جيد" (2.5 في النظام الألماني)'
    },
    country: 'Germany',
    website: 'https://www.daad.de',
  },
  {
    id: 'chevening',
    name: { en: 'Chevening Scholarship', ar: 'منحة تشيفنينج البريطانية' },
    minPercent: 60,
    levels: ['MASTER'],
    note: {
      en: 'Requires UK 2:1 or equivalent',
      ar: 'يتطلب تصنيف 2:1 أو ما يعادله'
    },
    country: 'UK',
    website: 'https://www.chevening.org',
  },
  {
    id: 'hungarian',
    name: { en: 'Stipendium Hungaricum', ar: 'منحة المجر الحكومية' },
    minPercent: 70,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'Varies by program, generally 70%+',
      ar: 'يختلف حسب البرنامج، عادة 70%+'
    },
    country: 'Hungary',
    website: 'https://stipendiumhungaricum.hu',
  },
  {
    id: 'erasmus',
    name: { en: 'Erasmus Mundus', ar: 'منحة إيراسموس موندوس' },
    minPercent: 75,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'EU-funded, study in multiple European countries',
      ar: 'ممولة من الاتحاد الأوروبي، الدراسة في عدة دول أوروبية'
    },
    country: 'European Union',
    website: 'https://erasmus-plus.ec.europa.eu',
  },
  {
    id: 'gates-cambridge',
    name: { en: 'Gates Cambridge Scholarship', ar: 'منحة غيتس كامبريدج' },
    minPercent: 90,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Highly competitive, outstanding academics required',
      ar: 'تنافسية للغاية، تتطلب تفوق أكاديمي عالي'
    },
    country: 'UK',
    website: 'https://www.gatescambridge.org',
  },
  {
    id: 'rhodes',
    name: { en: 'Rhodes Scholarship', ar: 'منحة رودس (أكسفورد)' },
    minPercent: 90,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Most prestigious scholarship, top academics required',
      ar: 'أرقى منحة في العالم، تتطلب تفوق أكاديمي استثنائي'
    },
    country: 'UK',
    website: 'https://www.rhodeshouse.ox.ac.uk',
  },
  {
    id: 'commonwealth',
    name: { en: 'Commonwealth Scholarship', ar: 'منحة الكومنولث' },
    minPercent: 60,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'For Commonwealth countries citizens, UK 2:1 required',
      ar: 'لمواطني دول الكومنولث، يتطلب تصنيف 2:1'
    },
    country: 'UK',
    website: 'https://cscuk.fcdo.gov.uk',
  },
  {
    id: 'swedish-si',
    name: { en: 'Swedish Institute Scholarship', ar: 'منحة المعهد السويدي' },
    minPercent: 75,
    levels: ['MASTER'],
    note: {
      en: 'For global professionals, leadership experience valued',
      ar: 'للمهنيين العالميين، تُقدّر الخبرة القيادية'
    },
    country: 'Sweden',
    website: 'https://si.se/en/apply/scholarships',
  },
  {
    id: 'netherlands',
    name: { en: 'Holland Scholarship', ar: 'منحة هولندا' },
    minPercent: 75,
    levels: ['BACHELOR', 'MASTER'],
    note: {
      en: '€5,000 for first year, non-EEA students',
      ar: '5,000 يورو للسنة الأولى، للطلاب من خارج المنطقة الاقتصادية الأوروبية'
    },
    country: 'Netherlands',
    website: 'https://www.studyinholland.nl',
  },
  {
    id: 'italy-gov',
    name: { en: 'Italian Government Scholarship', ar: 'منحة الحكومة الإيطالية' },
    minPercent: 70,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Covers tuition and living expenses',
      ar: 'تغطي الرسوم الدراسية ونفقات المعيشة'
    },
    country: 'Italy',
    website: 'https://studyinitaly.esteri.it',
  },
  {
    id: 'russia-gov',
    name: { en: 'Russian Government Scholarship', ar: 'منحة الحكومة الروسية' },
    minPercent: 65,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'Fully funded, various programs available',
      ar: 'ممولة بالكامل، برامج متنوعة متاحة'
    },
    country: 'Russia',
    website: 'https://education-in-russia.com',
  },
  {
    id: 'poland-gov',
    name: { en: 'Poland Ignacy Lukasiewicz Scholarship', ar: 'منحة بولندا الحكومية' },
    minPercent: 70,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'For developing countries, STEM focus',
      ar: 'للدول النامية، تركيز على العلوم والتكنولوجيا'
    },
    country: 'Poland',
    website: 'https://nawa.gov.pl',
  },
  // === AMERICAS ===
  {
    id: 'fulbright',
    name: { en: 'Fulbright Scholarship', ar: 'منحة فولبرايت الأمريكية' },
    minPercent: 75,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Minimum 3.0 GPA on 4.0 scale',
      ar: 'الحد الأدنى 3.0 من 4.0'
    },
    country: 'USA',
    website: 'https://foreign.fulbrightonline.org',
  },
  {
    id: 'vanier',
    name: { en: 'Vanier Canada Graduate Scholarship', ar: 'منحة فانير الكندية' },
    minPercent: 85,
    levels: ['PHD'],
    note: {
      en: '$50,000/year for 3 years, highly competitive',
      ar: '50,000 دولار/سنة لمدة 3 سنوات، تنافسية للغاية'
    },
    country: 'Canada',
    website: 'https://vanier.gc.ca',
  },
  {
    id: 'canada-lester',
    name: { en: 'Lester B. Pearson Scholarship', ar: 'منحة ليستر بيرسون (تورنتو)' },
    minPercent: 90,
    levels: ['BACHELOR'],
    note: {
      en: 'Full scholarship at University of Toronto',
      ar: 'منحة كاملة في جامعة تورنتو'
    },
    country: 'Canada',
    website: 'https://future.utoronto.ca/pearson',
  },
  {
    id: 'oas',
    name: { en: 'OAS Academic Scholarship', ar: 'منحة منظمة الدول الأمريكية' },
    minPercent: 75,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'Study in OAS member countries',
      ar: 'الدراسة في دول منظمة الدول الأمريكية'
    },
    country: 'Americas',
    website: 'https://www.oas.org/en/scholarships',
  },
  // === ASIA ===
  {
    id: 'mext',
    name: { en: 'MEXT Scholarship', ar: 'منحة MEXT اليابانية' },
    minPercent: 80,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'Competitive, higher GPA recommended',
      ar: 'تنافسية، يُفضل معدل أعلى'
    },
    country: 'Japan',
    website: 'https://www.mext.go.jp',
  },
  {
    id: 'kgsp',
    name: { en: 'KGSP (Korean Government)', ar: 'منحة الحكومة الكورية' },
    minPercent: 80,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'GPA of 80% or above in last degree',
      ar: 'معدل 80% أو أعلى في آخر شهادة'
    },
    country: 'South Korea',
    website: 'https://www.studyinkorea.go.kr',
  },
  {
    id: 'csc',
    name: { en: 'CSC Scholarship (China)', ar: 'منحة CSC الصينية' },
    minPercent: 75,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'Minimum 75% or equivalent',
      ar: 'الحد الأدنى 75% أو ما يعادله'
    },
    country: 'China',
    website: 'https://www.campuschina.org',
  },
  {
    id: 'schwarzman',
    name: { en: 'Schwarzman Scholars', ar: 'منحة شوارزمان (الصين)' },
    minPercent: 85,
    levels: ['MASTER'],
    note: {
      en: 'Leadership program at Tsinghua University',
      ar: 'برنامج قيادي في جامعة تسينغهوا'
    },
    country: 'China',
    website: 'https://www.schwarzmanscholars.org',
  },
  {
    id: 'malaysia-mis',
    name: { en: 'Malaysia International Scholarship', ar: 'منحة ماليزيا الدولية' },
    minPercent: 75,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Covers tuition and monthly allowance',
      ar: 'تغطي الرسوم الدراسية والبدل الشهري'
    },
    country: 'Malaysia',
    website: 'https://biasiswa.mohe.gov.my',
  },
  {
    id: 'singapore-singa',
    name: { en: 'Singapore SINGA Award', ar: 'منحة سينغا (سنغافورة)' },
    minPercent: 80,
    levels: ['PHD'],
    note: {
      en: 'PhD in science and engineering',
      ar: 'دكتوراه في العلوم والهندسة'
    },
    country: 'Singapore',
    website: 'https://www.a-star.edu.sg/singa',
  },
  {
    id: 'taiwan-icdf',
    name: { en: 'Taiwan ICDF Scholarship', ar: 'منحة تايوان ICDF' },
    minPercent: 70,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'For developing countries, focus on development',
      ar: 'للدول النامية، تركيز على التنمية'
    },
    country: 'Taiwan',
    website: 'https://www.icdf.org.tw',
  },
  {
    id: 'india-iccr',
    name: { en: 'ICCR Scholarship (India)', ar: 'منحة ICCR الهندية' },
    minPercent: 60,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'Covers tuition and living expenses',
      ar: 'تغطي الرسوم الدراسية ونفقات المعيشة'
    },
    country: 'India',
    website: 'https://www.iccr.gov.in',
  },
  // === OCEANIA ===
  {
    id: 'australia-awards',
    name: { en: 'Australia Awards Scholarship', ar: 'منحة أستراليا أواردز' },
    minPercent: 75,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Fully funded, 2 years work experience preferred',
      ar: 'ممولة بالكامل، يُفضل خبرة عملية سنتين'
    },
    country: 'Australia',
    website: 'https://www.australiaawards.gov.au',
  },
  {
    id: 'nz-scholarship',
    name: { en: 'New Zealand Scholarships', ar: 'منح نيوزيلندا' },
    minPercent: 70,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'For developing countries, various programs',
      ar: 'للدول النامية، برامج متنوعة'
    },
    country: 'New Zealand',
    website: 'https://www.nzscholarships.govt.nz',
  },
  // === AFRICA & MIDDLE EAST ===
  {
    id: 'mastercard',
    name: { en: 'Mastercard Foundation Scholars', ar: 'منحة ماستركارد للقادة الأفارقة' },
    minPercent: 70,
    levels: ['BACHELOR', 'MASTER'],
    note: {
      en: 'For African students, leadership potential required',
      ar: 'للطلاب الأفارقة، تتطلب إمكانات قيادية'
    },
    country: 'Various',
    website: 'https://mastercardfdn.org/all/scholars',
  },
  {
    id: 'mofaic-uae',
    name: { en: 'UAE Government Scholarship', ar: 'منحة حكومة الإمارات' },
    minPercent: 80,
    levels: ['BACHELOR', 'MASTER'],
    note: {
      en: 'For outstanding students from partner countries',
      ar: 'للطلاب المتفوقين من الدول الشريكة'
    },
    country: 'UAE',
    website: 'https://www.mofaic.gov.ae',
  },
  {
    id: 'qatar-foundation',
    name: { en: 'Qatar Foundation Scholarship', ar: 'منحة مؤسسة قطر' },
    minPercent: 85,
    levels: ['BACHELOR'],
    note: {
      en: 'Study at Education City partner universities',
      ar: 'الدراسة في جامعات المدينة التعليمية'
    },
    country: 'Qatar',
    website: 'https://www.qf.org.qa',
  },
  {
    id: 'kaust',
    name: { en: 'KAUST Fellowship (Saudi)', ar: 'منحة كاوست السعودية' },
    minPercent: 85,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Full funding for STEM programs',
      ar: 'تمويل كامل لبرامج العلوم والتكنولوجيا'
    },
    country: 'Saudi Arabia',
    website: 'https://www.kaust.edu.sa',
  },
  {
    id: 'egypt-gov',
    name: { en: 'Egyptian Government Scholarship', ar: 'منحة الحكومة المصرية' },
    minPercent: 65,
    levels: ['BACHELOR', 'MASTER', 'PHD'],
    note: {
      en: 'For African and Asian students',
      ar: 'للطلاب الأفارقة والآسيويين'
    },
    country: 'Egypt',
    website: 'https://www.mohesr.gov.eg',
  },
  {
    id: 'african-union',
    name: { en: 'African Union Mwalimu Nyerere', ar: 'منحة الاتحاد الأفريقي' },
    minPercent: 70,
    levels: ['MASTER', 'PHD'],
    note: {
      en: 'Study at African universities',
      ar: 'الدراسة في الجامعات الأفريقية'
    },
    country: 'Africa',
    website: 'https://au.int',
  },
];

/**
 * Check scholarship eligibility based on GPA percentage
 */
export function checkEligibility(
  gpaPercent: number,
  level?: 'BACHELOR' | 'MASTER' | 'PHD'
): {
  eligible: ScholarshipRequirement[];
  close: ScholarshipRequirement[];
  notEligible: ScholarshipRequirement[];
} {
  const eligible: ScholarshipRequirement[] = [];
  const close: ScholarshipRequirement[] = [];
  const notEligible: ScholarshipRequirement[] = [];

  for (const scholarship of SCHOLARSHIP_REQUIREMENTS) {
    // If level is specified, filter by level
    if (level && !scholarship.levels.includes(level)) {
      continue;
    }

    const diff = gpaPercent - scholarship.minPercent;

    if (diff >= 0) {
      eligible.push(scholarship);
    } else if (diff >= -5) {
      // Within 5% of requirement
      close.push(scholarship);
    } else {
      notEligible.push(scholarship);
    }
  }

  return { eligible, close, notEligible };
}

// Course interface for GPA calculation
export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

/**
 * Calculate weighted GPA from courses
 */
export function calculateWeightedGPA(
  courses: Course[],
  system: GPASystem = 'us-4.0'
): { gpa: number; totalCredits: number; percent: number } {
  if (courses.length === 0) {
    return { gpa: 0, totalCredits: 0, percent: 0 };
  }

  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const gradePercent = toPercentage(course.grade, 'letter');
    const gradeValue = Number(fromPercentage(gradePercent, system));

    totalPoints += gradeValue * course.credits;
    totalCredits += course.credits;
  }

  if (totalCredits === 0) {
    return { gpa: 0, totalCredits: 0, percent: 0 };
  }

  const gpa = totalPoints / totalCredits;
  const percent = toPercentage(gpa, system);

  return {
    gpa: Number(gpa.toFixed(2)),
    totalCredits,
    percent: Number(percent.toFixed(1)),
  };
}

// Reference table data
export const REFERENCE_TABLE = [
  { gpa40: 4.0, percent: 100, letter: 'A+', uk: 'First', german: 1.0, french: 20 },
  { gpa40: 3.9, percent: 97.5, letter: 'A+', uk: 'First', german: 1.1, french: 19.5 },
  { gpa40: 3.7, percent: 92.5, letter: 'A', uk: 'First', german: 1.3, french: 18.5 },
  { gpa40: 3.5, percent: 87.5, letter: 'A-/B+', uk: '2:1', german: 1.5, french: 17.5 },
  { gpa40: 3.3, percent: 82.5, letter: 'B+', uk: '2:1', german: 1.7, french: 16.5 },
  { gpa40: 3.0, percent: 75, letter: 'B', uk: '2:1', german: 2.0, french: 15 },
  { gpa40: 2.7, percent: 67.5, letter: 'B-', uk: '2:1', german: 2.3, french: 13.5 },
  { gpa40: 2.5, percent: 62.5, letter: 'C+', uk: '2:2', german: 2.5, french: 12.5 },
  { gpa40: 2.3, percent: 57.5, letter: 'C+', uk: '2:2', german: 2.7, french: 11.5 },
  { gpa40: 2.0, percent: 50, letter: 'C', uk: '2:2', german: 3.0, french: 10 },
  { gpa40: 1.7, percent: 42.5, letter: 'C-', uk: 'Third', german: 3.3, french: 8.5 },
  { gpa40: 1.0, percent: 25, letter: 'D', uk: 'Fail', german: 4.0, french: 5 },
  { gpa40: 0.0, percent: 0, letter: 'F', uk: 'Fail', german: 5.0, french: 0 },
];
