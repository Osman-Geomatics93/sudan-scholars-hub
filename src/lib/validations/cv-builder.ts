import { z } from 'zod';

// Template types
export const templateSchema = z.enum(['modern', 'classic', 'minimal']);

// Skill level schema
export const skillLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);

// Language proficiency schema
export const languageProficiencySchema = z.enum(['native', 'fluent', 'advanced', 'intermediate', 'basic']);

// Personal information schema
export const resumePersonalSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  linkedIn: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

// Education schema
export const resumeEducationSchema = z.object({
  institution: z.string().min(2, 'Institution name required').max(200),
  degree: z.string().min(2, 'Degree required').max(100),
  field: z.string().min(2, 'Field of study required').max(100),
  location: z.string().max(100).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean().default(false),
  gpa: z.string().max(20).optional().or(z.literal('')),
  achievements: z.string().max(1000).optional().or(z.literal('')),
});

// Experience schema
export const resumeExperienceSchema = z.object({
  company: z.string().min(2, 'Company name required').max(200),
  position: z.string().min(2, 'Position required').max(100),
  location: z.string().max(100).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean().default(false),
  description: z.string().max(2000).optional().or(z.literal('')),
});

// Skill schema
export const resumeSkillSchema = z.object({
  name: z.string().min(1, 'Skill name required').max(50),
  level: z.string().optional().or(z.literal('')),
  category: z.string().max(50).optional().or(z.literal('')),
});

// Language schema
export const resumeLanguageSchema = z.object({
  language: z.string().min(1, 'Language required').max(50),
  proficiency: z.string().min(1, 'Proficiency level required'),
});

// Certification schema
export const resumeCertificationSchema = z.object({
  name: z.string().min(2, 'Certification name required').max(200),
  issuer: z.string().min(2, 'Issuer required').max(200),
  issueDate: z.string().optional().or(z.literal('')),
  expiryDate: z.string().optional().or(z.literal('')),
  credentialId: z.string().max(100).optional().or(z.literal('')),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

// Project schema
export const resumeProjectSchema = z.object({
  name: z.string().min(2, 'Project name required').max(200),
  description: z.string().max(1000).optional().or(z.literal('')),
  technologies: z.array(z.string().max(50)).default([]),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean().default(false),
});

// Award schema
export const resumeAwardSchema = z.object({
  title: z.string().min(2, 'Award title required').max(200),
  issuer: z.string().min(2, 'Issuing organization required').max(200),
  date: z.string().optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
});

// Full resume create schema
export const resumeCreateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  personal: resumePersonalSchema,
  education: z.array(resumeEducationSchema).optional().default([]),
  experience: z.array(resumeExperienceSchema).optional().default([]),
  skills: z.array(resumeSkillSchema).optional().default([]),
  languages: z.array(resumeLanguageSchema).optional().default([]),
  certifications: z.array(resumeCertificationSchema).optional().default([]),
  projects: z.array(resumeProjectSchema).optional().default([]),
  awards: z.array(resumeAwardSchema).optional().default([]),
  summary: z.string().max(1000).optional().or(z.literal('')),
  summaryAr: z.string().max(1000).optional().or(z.literal('')),
  template: templateSchema.optional().default('modern'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional().default('#2563eb'),
});

// Resume update schema (all fields optional)
export const resumeUpdateSchema = resumeCreateSchema.partial().extend({
  isPublic: z.boolean().optional(),
});

// AI Summary request schema
export const aiSummaryRequestSchema = z.object({
  education: z.array(resumeEducationSchema).optional().default([]),
  experience: z.array(resumeExperienceSchema).optional().default([]),
  skills: z.array(resumeSkillSchema).optional().default([]),
  targetRole: z.string().max(100).optional(),
  language: z.enum(['en', 'ar']).default('en'),
});

// Share settings schema
export const shareSettingsSchema = z.object({
  isPublic: z.boolean(),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .optional(),
});

// Export types from schemas
export type ResumePersonalInput = z.infer<typeof resumePersonalSchema>;
export type ResumeEducationInput = z.infer<typeof resumeEducationSchema>;
export type ResumeExperienceInput = z.infer<typeof resumeExperienceSchema>;
export type ResumeSkillInput = z.infer<typeof resumeSkillSchema>;
export type ResumeLanguageInput = z.infer<typeof resumeLanguageSchema>;
export type ResumeCertificationInput = z.infer<typeof resumeCertificationSchema>;
export type ResumeProjectInput = z.infer<typeof resumeProjectSchema>;
export type ResumeAwardInput = z.infer<typeof resumeAwardSchema>;
export type ResumeCreateInput = z.infer<typeof resumeCreateSchema>;
export type ResumeUpdateInput = z.infer<typeof resumeUpdateSchema>;
export type AISummaryRequestInput = z.infer<typeof aiSummaryRequestSchema>;
export type ShareSettingsInput = z.infer<typeof shareSettingsSchema>;
export type TemplateType = z.infer<typeof templateSchema>;
