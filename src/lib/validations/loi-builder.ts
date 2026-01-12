import { z } from 'zod';

// Step 1: Hook & Direction
export const hookSchema = z.object({
  openingStatement: z
    .string()
    .min(50, 'Opening statement should be at least 50 characters')
    .max(500, 'Opening statement should not exceed 500 characters'),
  fieldOfInterest: z
    .string()
    .min(5, 'Field of interest is required')
    .max(100, 'Field of interest should not exceed 100 characters'),
  careerGoal: z
    .string()
    .min(20, 'Career goal should be at least 20 characters')
    .max(200, 'Career goal should not exceed 200 characters'),
});

// Step 2: Academic Preparation
export const academicSchema = z.object({
  currentEducation: z
    .string()
    .min(20, 'Current education should be at least 20 characters')
    .max(300, 'Current education should not exceed 300 characters'),
  relevantCourses: z
    .string()
    .min(20, 'Relevant courses should be at least 20 characters')
    .max(400, 'Relevant courses should not exceed 400 characters'),
  academicAchievements: z
    .string()
    .min(30, 'Academic achievements should be at least 30 characters')
    .max(500, 'Academic achievements should not exceed 500 characters'),
  skillsGained: z
    .string()
    .min(20, 'Skills gained should be at least 20 characters')
    .max(300, 'Skills gained should not exceed 300 characters'),
});

// Step 3: Why Turkiye Scholarships
export const whyScholarshipSchema = z.object({
  whatAttracted: z
    .string()
    .min(30, 'Explain what attracted you (at least 30 characters)')
    .max(400, 'This section should not exceed 400 characters'),
  alignmentWithGoals: z
    .string()
    .min(30, 'Explain alignment with goals (at least 30 characters)')
    .max(400, 'This section should not exceed 400 characters'),
  uniqueOffering: z
    .string()
    .min(20, 'Explain unique offering (at least 20 characters)')
    .max(300, 'This section should not exceed 300 characters'),
});

// Step 4: Why Turkey + Program
export const whyTurkeySchema = z.object({
  countryReasons: z
    .string()
    .min(30, 'Explain your reasons for Turkey (at least 30 characters)')
    .max(400, 'This section should not exceed 400 characters'),
  universityName: z
    .string()
    .min(3, 'University name is required')
    .max(150, 'University name should not exceed 150 characters'),
  programName: z
    .string()
    .min(3, 'Program name is required')
    .max(150, 'Program name should not exceed 150 characters'),
  whyThisProgram: z
    .string()
    .min(30, 'Explain why this program (at least 30 characters)')
    .max(500, 'This section should not exceed 500 characters'),
  specificDetails: z
    .string()
    .min(20, 'Add specific details (at least 20 characters)')
    .max(400, 'This section should not exceed 400 characters'),
});

// Step 5: Leadership (STAR Format)
export const leadershipSchema = z.object({
  situation: z
    .string()
    .min(30, 'Describe the situation (at least 30 characters)')
    .max(400, 'Situation should not exceed 400 characters'),
  task: z
    .string()
    .min(20, 'Describe your task (at least 20 characters)')
    .max(300, 'Task should not exceed 300 characters'),
  action: z
    .string()
    .min(30, 'Describe your actions (at least 30 characters)')
    .max(500, 'Actions should not exceed 500 characters'),
  result: z
    .string()
    .min(20, 'Describe the result (at least 20 characters)')
    .max(400, 'Result should not exceed 400 characters'),
  lessonsLearned: z
    .string()
    .min(20, 'Describe lessons learned (at least 20 characters)')
    .max(300, 'Lessons learned should not exceed 300 characters'),
});

// Step 6: Future Plan & Impact
export const futureSchema = z.object({
  shortTermGoals: z
    .string()
    .min(30, 'Describe short-term goals (at least 30 characters)')
    .max(400, 'Short-term goals should not exceed 400 characters'),
  longTermGoals: z
    .string()
    .min(30, 'Describe long-term goals (at least 30 characters)')
    .max(400, 'Long-term goals should not exceed 400 characters'),
  impactOnCommunity: z
    .string()
    .min(30, 'Describe community impact (at least 30 characters)')
    .max(400, 'Community impact should not exceed 400 characters'),
  measurableOutcomes: z
    .string()
    .min(20, 'Add measurable outcomes (at least 20 characters)')
    .max(300, 'Measurable outcomes should not exceed 300 characters'),
});

// Step 7: Closing
export const closingSchema = z.object({
  commitment: z
    .string()
    .min(20, 'Commitment statement is required (at least 20 characters)')
    .max(250, 'Commitment should not exceed 250 characters'),
  gratitude: z
    .string()
    .min(10, 'Gratitude statement is required (at least 10 characters)')
    .max(150, 'Gratitude should not exceed 150 characters'),
});

// Settings
export const settingsSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name is required')
    .max(100, 'Name should not exceed 100 characters'),
  tone: z.enum(['formal', 'balanced', 'personal']),
  language: z.enum(['en', 'tr']),
  targetWordCount: z.number().min(500).max(900),
});

// Complete LOI schema
export const loiCompleteSchema = z.object({
  hook: hookSchema,
  academic: academicSchema,
  whyScholarship: whyScholarshipSchema,
  whyTurkey: whyTurkeySchema,
  leadership: leadershipSchema,
  future: futureSchema,
  closing: closingSchema,
  settings: settingsSchema,
});

// Partial schemas for step-by-step validation (allows empty strings)
export const hookPartialSchema = z.object({
  openingStatement: z.string().max(500),
  fieldOfInterest: z.string().max(100),
  careerGoal: z.string().max(200),
});

export const academicPartialSchema = z.object({
  currentEducation: z.string().max(300),
  relevantCourses: z.string().max(400),
  academicAchievements: z.string().max(500),
  skillsGained: z.string().max(300),
});

export const whyScholarshipPartialSchema = z.object({
  whatAttracted: z.string().max(400),
  alignmentWithGoals: z.string().max(400),
  uniqueOffering: z.string().max(300),
});

export const whyTurkeyPartialSchema = z.object({
  countryReasons: z.string().max(400),
  universityName: z.string().max(150),
  programName: z.string().max(150),
  whyThisProgram: z.string().max(500),
  specificDetails: z.string().max(400),
});

export const leadershipPartialSchema = z.object({
  situation: z.string().max(400),
  task: z.string().max(300),
  action: z.string().max(500),
  result: z.string().max(400),
  lessonsLearned: z.string().max(300),
});

export const futurePartialSchema = z.object({
  shortTermGoals: z.string().max(400),
  longTermGoals: z.string().max(400),
  impactOnCommunity: z.string().max(400),
  measurableOutcomes: z.string().max(300),
});

export const closingPartialSchema = z.object({
  commitment: z.string().max(250),
  gratitude: z.string().max(150),
});

// Types
export type HookInput = z.infer<typeof hookSchema>;
export type AcademicInput = z.infer<typeof academicSchema>;
export type WhyScholarshipInput = z.infer<typeof whyScholarshipSchema>;
export type WhyTurkeyInput = z.infer<typeof whyTurkeySchema>;
export type LeadershipInput = z.infer<typeof leadershipSchema>;
export type FutureInput = z.infer<typeof futureSchema>;
export type ClosingInput = z.infer<typeof closingSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type LOICompleteInput = z.infer<typeof loiCompleteSchema>;
