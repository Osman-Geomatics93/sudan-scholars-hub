import { z } from 'zod';

export const scholarshipSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  titleAr: z.string().min(1).max(200),
  university: z.string().min(1).max(200),
  universityAr: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  countryCode: z.string().min(2).max(10),
  countryAr: z.string().min(1).max(100),
  description: z.string().min(1),
  descriptionAr: z.string().min(1),
  eligibility: z.array(z.string()),
  eligibilityAr: z.array(z.string()),
  benefits: z.array(z.string()),
  benefitsAr: z.array(z.string()),
  requirements: z.array(z.string()),
  requirementsAr: z.array(z.string()),
  howToApply: z.string().min(1),
  howToApplyAr: z.string().min(1),
  duration: z.string().min(1).max(50),
  durationAr: z.string().min(1).max(50),
  deadline: z.string().datetime().or(z.date()),
  fundingType: z.enum(['FULLY_FUNDED', 'PARTIALLY_FUNDED']),
  levels: z.array(z.enum(['BACHELOR', 'MASTER', 'PHD'])).min(1),
  field: z.enum([
    'ENGINEERING',
    'MEDICINE',
    'BUSINESS',
    'ARTS',
    'SCIENCE',
    'LAW',
    'EDUCATION',
    'TECHNOLOGY',
  ]),
  applicationUrl: z.string().url(),
  image: z.string().url(),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
});

export const scholarshipUpdateSchema = scholarshipSchema.partial();

export type ScholarshipInput = z.infer<typeof scholarshipSchema>;
export type ScholarshipUpdateInput = z.infer<typeof scholarshipUpdateSchema>;
