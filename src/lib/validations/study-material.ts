import { z } from 'zod';

export const studyMaterialSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters / العنوان يجب أن يكون حرفين على الأقل')
    .max(200, 'Title is too long / العنوان طويل جداً'),
  type: z.enum(['pdf', 'docx', 'pptx', 'video', 'folder'], {
    error: 'Invalid material type / نوع المادة غير صالح',
  }),
  url: z.string()
    .url('Please enter a valid URL / يرجى إدخال رابط صحيح')
    .max(2000, 'URL is too long / الرابط طويل جداً'),
  subject: z.string()
    .min(1, 'Subject is required / المادة مطلوبة')
    .max(200, 'Subject is too long / المادة طويلة جداً'),
  description: z.string().max(2000, 'Description is too long / الوصف طويل جداً').optional().nullable(),
  facultyId: z.string().max(100).optional().nullable(),
  specialtyId: z.string().max(100).optional().nullable(),
  uploaderRole: z.enum(['student', 'teacher', 'ta', 'other']).default('student'),
  countryId: z.string().min(1, 'Country is required / الدولة مطلوبة'),
  countryName: z.string().min(1, 'Country name is required'),
  universityId: z.string().min(1, 'University is required / الجامعة مطلوبة'),
  universityName: z.string().min(1, 'University name is required'),
  degreeId: z.string().min(1, 'Degree is required / المرحلة الدراسية مطلوبة'),
  degreeName: z.string().min(1, 'Degree name is required'),
  semester: z.string().min(1, 'Semester is required / الفصل الدراسي مطلوب'),
});

export type StudyMaterialInput = z.infer<typeof studyMaterialSchema>;
