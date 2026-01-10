import { z } from 'zod';
import { gpaSystemSchema } from './gpa';

// Current education level
export const currentLevelSchema = z.enum([
  'HIGH_SCHOOL',
  'BACHELOR',
  'MASTER',
  'PHD',
]);

// Target study level
export const targetLevelSchema = z.enum([
  'BACHELOR',
  'MASTER',
  'PHD',
]);

// Field of study (can select multiple)
export const fieldOfStudySchema = z.enum([
  'ENGINEERING',
  'MEDICINE',
  'BUSINESS',
  'ARTS',
  'SCIENCE',
  'LAW',
  'EDUCATION',
  'TECHNOLOGY',
]);

// Funding preference
export const fundingPreferenceSchema = z.enum([
  'FULLY_FUNDED_ONLY',
  'ANY',
]);

// Common languages
export const SUPPORTED_LANGUAGES = [
  'English',
  'Arabic',
  'French',
  'German',
  'Spanish',
  'Turkish',
  'Chinese',
  'Japanese',
  'Korean',
  'Russian',
  'Portuguese',
  'Italian',
  'Hindi',
  'Swahili',
  'Other',
] as const;

// Full matcher profile schema
export const matcherProfileSchema = z.object({
  // GPA Information
  gpaValue: z
    .number()
    .min(0, 'GPA cannot be negative')
    .max(100, 'GPA cannot exceed 100%'),
  gpaSystem: gpaSystemSchema,

  // Education
  currentLevel: currentLevelSchema,
  targetLevel: targetLevelSchema,
  fieldsOfStudy: z
    .array(fieldOfStudySchema)
    .min(1, 'Select at least one field of study')
    .max(4, 'Select at most 4 fields'),

  // Personal
  countryOfOrigin: z
    .string()
    .min(2, 'Country code must be at least 2 characters')
    .max(3, 'Country code must be at most 3 characters'),
  languages: z
    .array(z.string())
    .min(1, 'Select at least one language'),
  age: z
    .number()
    .int('Age must be a whole number')
    .min(15, 'Age must be at least 15')
    .max(60, 'Age must be at most 60')
    .nullable(),

  // Preferences
  fundingPreference: fundingPreferenceSchema,
  specialCircumstances: z
    .string()
    .max(500, 'Special circumstances must be less than 500 characters')
    .nullable(),
});

// Partial schema for step-by-step validation
export const gpaStepSchema = z.object({
  gpaValue: matcherProfileSchema.shape.gpaValue,
  gpaSystem: matcherProfileSchema.shape.gpaSystem,
});

export const educationStepSchema = z.object({
  currentLevel: matcherProfileSchema.shape.currentLevel,
  targetLevel: matcherProfileSchema.shape.targetLevel,
  fieldsOfStudy: matcherProfileSchema.shape.fieldsOfStudy,
});

export const personalStepSchema = z.object({
  countryOfOrigin: matcherProfileSchema.shape.countryOfOrigin,
  languages: matcherProfileSchema.shape.languages,
  age: matcherProfileSchema.shape.age,
});

export const preferencesStepSchema = z.object({
  fundingPreference: matcherProfileSchema.shape.fundingPreference,
  specialCircumstances: matcherProfileSchema.shape.specialCircumstances,
});

// Type exports
export type CurrentLevel = z.infer<typeof currentLevelSchema>;
export type TargetLevel = z.infer<typeof targetLevelSchema>;
export type FieldOfStudy = z.infer<typeof fieldOfStudySchema>;
export type FundingPreference = z.infer<typeof fundingPreferenceSchema>;
export type MatcherProfileInput = z.infer<typeof matcherProfileSchema>;
export type GPAStepInput = z.infer<typeof gpaStepSchema>;
export type EducationStepInput = z.infer<typeof educationStepSchema>;
export type PersonalStepInput = z.infer<typeof personalStepSchema>;
export type PreferencesStepInput = z.infer<typeof preferencesStepSchema>;

// Bilingual labels for fields
export const LEVEL_LABELS: Record<string, { en: string; ar: string }> = {
  HIGH_SCHOOL: { en: 'High School', ar: 'الثانوية العامة' },
  BACHELOR: { en: 'Bachelor\'s Degree', ar: 'البكالوريوس' },
  MASTER: { en: 'Master\'s Degree', ar: 'الماجستير' },
  PHD: { en: 'PhD / Doctorate', ar: 'الدكتوراه' },
};

export const FIELD_LABELS: Record<string, { en: string; ar: string }> = {
  ENGINEERING: { en: 'Engineering', ar: 'الهندسة' },
  MEDICINE: { en: 'Medicine & Health', ar: 'الطب والصحة' },
  BUSINESS: { en: 'Business & Economics', ar: 'الأعمال والاقتصاد' },
  ARTS: { en: 'Arts & Humanities', ar: 'الآداب والعلوم الإنسانية' },
  SCIENCE: { en: 'Natural Sciences', ar: 'العلوم الطبيعية' },
  LAW: { en: 'Law', ar: 'القانون' },
  EDUCATION: { en: 'Education', ar: 'التعليم' },
  TECHNOLOGY: { en: 'Technology & IT', ar: 'التكنولوجيا' },
};

export const FUNDING_LABELS: Record<string, { en: string; ar: string }> = {
  FULLY_FUNDED_ONLY: { en: 'Fully Funded Only', ar: 'ممولة بالكامل فقط' },
  ANY: { en: 'Any Funding Type', ar: 'أي نوع تمويل' },
};

export const LANGUAGE_LABELS: Record<string, { en: string; ar: string }> = {
  English: { en: 'English', ar: 'الإنجليزية' },
  Arabic: { en: 'Arabic', ar: 'العربية' },
  French: { en: 'French', ar: 'الفرنسية' },
  German: { en: 'German', ar: 'الألمانية' },
  Spanish: { en: 'Spanish', ar: 'الإسبانية' },
  Turkish: { en: 'Turkish', ar: 'التركية' },
  Chinese: { en: 'Chinese', ar: 'الصينية' },
  Japanese: { en: 'Japanese', ar: 'اليابانية' },
  Korean: { en: 'Korean', ar: 'الكورية' },
  Russian: { en: 'Russian', ar: 'الروسية' },
  Portuguese: { en: 'Portuguese', ar: 'البرتغالية' },
  Italian: { en: 'Italian', ar: 'الإيطالية' },
  Hindi: { en: 'Hindi', ar: 'الهندية' },
  Swahili: { en: 'Swahili', ar: 'السواحيلية' },
  Other: { en: 'Other', ar: 'أخرى' },
};
