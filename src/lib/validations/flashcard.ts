import { z } from 'zod';

export const createDeckSchema = z.object({
  title: z.string().min(1, 'Title is required / العنوان مطلوب').max(200),
  description: z.string().max(2000).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  isPublic: z.boolean().optional().default(false),
});

export const updateDeckSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  isPublic: z.boolean().optional(),
});

export const createCardSchema = z.object({
  front: z.string().min(1, 'Front text is required / النص الأمامي مطلوب').max(2000),
  back: z.string().min(1, 'Back text is required / النص الخلفي مطلوب').max(2000),
});

export const reviewCardSchema = z.object({
  quality: z.number().int().min(0).max(5),
});

export const generateCardsSchema = z.object({
  text: z.string().min(50, 'Text must be at least 50 characters / النص يجب أن يكون 50 حرفاً على الأقل').max(20000),
  count: z.number().int().min(1).max(30).optional().default(10),
  language: z.enum(['en', 'ar']).optional().default('en'),
  deckId: z.string().optional(),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
