import { z } from 'zod';

export const createTestSchema = z.object({
  examType: z.enum(['ielts', 'toefl']),
  section: z.enum(['reading', 'writing', 'listening', 'speaking']),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional().nullable(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  timeMinutes: z.number().int().min(1).max(240),
  content: z.record(z.string(), z.unknown()),
});

export const submitAttemptSchema = z.object({
  testId: z.string().min(1, 'Test ID is required'),
  answers: z.record(z.string(), z.unknown()),
  timeSpentSec: z.number().int().min(0).optional(),
});

export const gradeWritingSchema = z.object({
  testId: z.string().min(1),
  attemptId: z.string().min(1),
  taskResponse: z.string().min(10, 'Response must be at least 10 characters').max(50000),
});

export const gradeSpeakingSchema = z.object({
  testId: z.string().min(1),
  attemptId: z.string().min(1),
  transcription: z.string().min(5, 'Transcription must be at least 5 characters').max(50000),
});

export const reviewVocabSchema = z.object({
  vocabId: z.string().min(1, 'Vocab ID is required'),
  quality: z.number().int().min(0).max(5),
});

export const listTestsSchema = z.object({
  examType: z.enum(['ielts', 'toefl']).optional(),
  section: z.enum(['reading', 'writing', 'listening', 'speaking']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export const createMaterialSchema = z.object({
  examType: z.enum(['ielts', 'toefl', 'both']),
  section: z.enum(['reading', 'writing', 'listening', 'speaking', 'general']),
  materialType: z.enum(['pdf', 'video', 'audio', 'document', 'link', 'folder']),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  url: z.string().trim().url('Please enter a valid URL').max(2000),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  language: z.enum(['en', 'ar', 'both']).optional().default('en'),
  tags: z.array(z.string().trim().max(50)).max(20).optional(),
});
