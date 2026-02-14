import { z } from 'zod';

export const createStudySessionSchema = z.object({
  subject: z.string().min(1, 'Subject is required / المادة مطلوبة').max(200),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').max(1440),
  date: z.string().optional(), // ISO date string, defaults to now
  notes: z.string().max(2000).optional().nullable(),
  source: z.enum(['manual', 'pomodoro']).optional().default('manual'),
});

export const createGoalSchema = z.object({
  type: z.enum(['daily', 'weekly']),
  targetMinutes: z.number().int().min(1).max(10080), // max 1 week in minutes
});

export const createExamSchema = z.object({
  title: z.string().min(1, 'Title is required / العنوان مطلوب').max(200),
  subject: z.string().min(1, 'Subject is required / المادة مطلوبة').max(200),
  date: z.string().min(1, 'Date is required / التاريخ مطلوب'),
  notes: z.string().max(2000).optional().nullable(),
  color: z.string().max(20).optional().default('#3B82F6'),
});

export const updateExamSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subject: z.string().min(1).max(200).optional(),
  date: z.string().optional(),
  notes: z.string().max(2000).optional().nullable(),
  color: z.string().max(20).optional(),
});

export type CreateStudySessionInput = z.infer<typeof createStudySessionSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type CreateExamInput = z.infer<typeof createExamSchema>;
