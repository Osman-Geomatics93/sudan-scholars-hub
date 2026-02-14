import { z } from 'zod';

export const createSessionSchema = z.object({
  title: z.string().min(1, 'Title is required / العنوان مطلوب').max(200),
  contextType: z.enum(['material', 'exam', 'paste', 'none']),
  contextId: z.string().optional().nullable(),
  contextText: z.string().max(60000, 'Text too long / النص طويل جداً').optional().nullable(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message is required / الرسالة مطلوبة').max(5000),
});

export const extractPdfSchema = z.object({
  url: z.string().url('Invalid URL / رابط غير صالح'),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
