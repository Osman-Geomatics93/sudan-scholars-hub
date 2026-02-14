import { z } from 'zod';

export const professorReviewSchema = z.object({
  professorName: z.string()
    .min(2, 'Professor name must be at least 2 characters / اسم الأستاذ يجب أن يكون حرفين على الأقل')
    .max(200, 'Professor name is too long / اسم الأستاذ طويل جداً'),
  universityId: z.string().min(1, 'University is required / الجامعة مطلوبة'),
  universityName: z.string().min(1, 'University name is required'),
  courseName: z.string()
    .min(1, 'Course name is required / اسم المقرر مطلوب')
    .max(200, 'Course name is too long / اسم المقرر طويل جداً'),
  rating: z.number().int().min(1, 'Rating must be 1-5 / التقييم يجب أن يكون من 1 إلى 5').max(5),
  difficulty: z.number().int().min(1, 'Difficulty must be 1-5 / الصعوبة يجب أن تكون من 1 إلى 5').max(5),
  wouldTakeAgain: z.boolean(),
  comment: z.string().max(2000, 'Comment is too long / التعليق طويل جداً').optional().nullable(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags / الحد الأقصى 10 وسوم').default([]),
  isAnonymous: z.boolean().default(false),
});

export type ProfessorReviewInput = z.infer<typeof professorReviewSchema>;
