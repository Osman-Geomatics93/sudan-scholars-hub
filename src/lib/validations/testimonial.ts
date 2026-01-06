import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameAr: z.string().min(2, 'Arabic name must be at least 2 characters'),
  university: z.string().min(2, 'University must be at least 2 characters'),
  universityAr: z.string().min(2, 'Arabic university must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  countryAr: z.string().min(2, 'Arabic country must be at least 2 characters'),
  quote: z.string().min(10, 'Quote must be at least 10 characters'),
  quoteAr: z.string().min(10, 'Arabic quote must be at least 10 characters'),
  avatar: z.string().url('Avatar must be a valid URL'),
  scholarshipYear: z.number().int().min(2000).max(2030),
  isPublished: z.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
