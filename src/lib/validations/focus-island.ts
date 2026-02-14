import { z } from 'zod';

export const updateThemeSchema = z.object({
  theme: z.enum(['forest', 'ocean', 'space', 'desert']),
});

export const triggerGrowthSchema = z.object({
  studyMinutes: z.number().int().min(1, 'Must study at least 1 minute'),
  source: z.enum(['manual', 'pomodoro', 'session']).optional().default('manual'),
});

export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
export type TriggerGrowthInput = z.infer<typeof triggerGrowthSchema>;
