import { z } from 'zod';

export const createQuestionSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  question: z.string().min(5, 'Question must be at least 5 characters').max(500),
  optionA: z.string().min(1, 'Option A is required').max(200),
  optionB: z.string().min(1, 'Option B is required').max(200),
  optionC: z.string().min(1, 'Option C is required').max(200),
  optionD: z.string().min(1, 'Option D is required').max(200),
  correctOption: z.enum(['A', 'B', 'C', 'D']),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
});

export const createBattleSchema = z.object({
  opponentId: z.string().min(1, 'Opponent is required'),
  subject: z.string().min(1, 'Subject is required'),
});

export const submitAnswersSchema = z.object({
  answers: z.array(z.object({
    questionIdx: z.number().int().min(0).max(9),
    answer: z.enum(['A', 'B', 'C', 'D']),
    timeMs: z.number().int().min(0),
  })).min(1).max(10),
});

export const battleActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('accept') }),
  z.object({ action: z.literal('decline') }),
  z.object({
    action: z.literal('submit'),
    answers: z.array(z.object({
      questionIdx: z.number().int().min(0).max(9),
      answer: z.enum(['A', 'B', 'C', 'D']),
      timeMs: z.number().int().min(0),
    })).min(1).max(10),
  }),
]);

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type CreateBattleInput = z.infer<typeof createBattleSchema>;
export type SubmitAnswersInput = z.infer<typeof submitAnswersSchema>;
