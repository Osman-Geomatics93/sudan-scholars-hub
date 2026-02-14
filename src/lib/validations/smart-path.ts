import { z } from 'zod';

export const generatePathSchema = z.object({
  durationDays: z.number().int().min(3).max(90).optional().default(14),
  focusSubjects: z.array(z.string().min(1).max(200)).optional(),
  language: z.enum(['en', 'ar']).optional().default('en'),
});

export const updateDaySchema = z.object({
  status: z.enum(['completed', 'struggled', 'skipped']),
  userNotes: z.string().max(2000).optional().nullable(),
});

export type GeneratePathInput = z.infer<typeof generatePathSchema>;
export type UpdateDayInput = z.infer<typeof updateDaySchema>;
