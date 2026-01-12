// LOI Builder Types

export interface HookData {
  openingStatement: string;
  fieldOfInterest: string;
  careerGoal: string;
}

export interface AcademicData {
  currentEducation: string;
  relevantCourses: string;
  academicAchievements: string;
  skillsGained: string;
}

export interface WhyScholarshipData {
  whatAttracted: string;
  alignmentWithGoals: string;
  uniqueOffering: string;
}

export interface WhyTurkeyData {
  countryReasons: string;
  universityName: string;
  programName: string;
  whyThisProgram: string;
  specificDetails: string;
}

export interface LeadershipData {
  situation: string;
  task: string;
  action: string;
  result: string;
  lessonsLearned: string;
}

export interface FutureData {
  shortTermGoals: string;
  longTermGoals: string;
  impactOnCommunity: string;
  measurableOutcomes: string;
}

export interface ClosingData {
  commitment: string;
  gratitude: string;
}

export interface SettingsData {
  fullName: string;
  tone: 'formal' | 'balanced' | 'personal';
  language: 'en' | 'tr' | 'ar';
  targetWordCount: number;
}

export interface LOIWizardData {
  hook: HookData;
  academic: AcademicData;
  whyScholarship: WhyScholarshipData;
  whyTurkey: WhyTurkeyData;
  leadership: LeadershipData;
  future: FutureData;
  closing: ClosingData;
  settings: SettingsData;
}

export interface QualityIssue {
  step: number;
  field: string;
  type: 'cliche' | 'generic' | 'missing' | 'too_short' | 'too_long';
  message: string;
  suggestion: string;
}

export interface QualityScore {
  overall: number;
  specificity: number;
  completeness: number;
  clicheScore: number;
  futureClarity: number;
  issues: QualityIssue[];
}

export interface StepConfig {
  id: string;
  label: { en: string; ar: string };
}

export const STEPS: StepConfig[] = [
  { id: 'hook', label: { en: 'Hook', ar: 'المقدمة' } },
  { id: 'academic', label: { en: 'Academic', ar: 'الأكاديمي' } },
  { id: 'why-scholarship', label: { en: 'Why Scholarship', ar: 'لماذا المنحة' } },
  { id: 'why-turkey', label: { en: 'Why Turkey', ar: 'لماذا تركيا' } },
  { id: 'leadership', label: { en: 'Leadership', ar: 'القيادة' } },
  { id: 'future', label: { en: 'Future Plan', ar: 'الخطة المستقبلية' } },
  { id: 'closing', label: { en: 'Closing', ar: 'الختام' } },
];

export const DEFAULT_LOI_DATA: LOIWizardData = {
  hook: {
    openingStatement: '',
    fieldOfInterest: '',
    careerGoal: '',
  },
  academic: {
    currentEducation: '',
    relevantCourses: '',
    academicAchievements: '',
    skillsGained: '',
  },
  whyScholarship: {
    whatAttracted: '',
    alignmentWithGoals: '',
    uniqueOffering: '',
  },
  whyTurkey: {
    countryReasons: '',
    universityName: '',
    programName: '',
    whyThisProgram: '',
    specificDetails: '',
  },
  leadership: {
    situation: '',
    task: '',
    action: '',
    result: '',
    lessonsLearned: '',
  },
  future: {
    shortTermGoals: '',
    longTermGoals: '',
    impactOnCommunity: '',
    measurableOutcomes: '',
  },
  closing: {
    commitment: '',
    gratitude: '',
  },
  settings: {
    fullName: '',
    tone: 'balanced',
    language: 'en',
    targetWordCount: 700,
  },
};

// Word count targets per section
export const SECTION_WORD_TARGETS = {
  hook: { min: 50, max: 100 },
  academic: { min: 80, max: 150 },
  whyScholarship: { min: 60, max: 120 },
  whyTurkey: { min: 80, max: 150 },
  leadership: { min: 100, max: 180 },
  future: { min: 80, max: 150 },
  closing: { min: 30, max: 60 },
};

// Overall word count targets
export const TOTAL_WORD_TARGET = { min: 500, max: 900 };
