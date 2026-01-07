import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters / الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'Name is too long / الاسم طويل جداً'),
  email: z.string()
    .email('Please enter a valid email / يرجى إدخال بريد إلكتروني صحيح'),
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters / الموضوع يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'Subject is too long / الموضوع طويل جداً'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters / الرسالة يجب أن تكون 10 أحرف على الأقل')
    .max(5000, 'Message is too long / الرسالة طويلة جداً'),
});

export type ContactInput = z.infer<typeof contactSchema>;
