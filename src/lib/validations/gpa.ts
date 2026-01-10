import { z } from 'zod';

// Valid GPA systems
export const gpaSystemSchema = z.enum([
  'us-4.0',
  'us-5.0',
  'percentage',
  'letter',
  'uk',
  'german',
  'french',
]);

// Letter grades
export const letterGradeSchema = z.enum([
  'A+', 'A', 'A-',
  'B+', 'B', 'B-',
  'C+', 'C', 'C-',
  'D+', 'D', 'D-',
  'F',
]);

// UK classification grades
export const ukGradeSchema = z.enum([
  'First',
  '2:1',
  '2:2',
  'Third',
  'Fail',
]);

// Converter input schema
export const converterInputSchema = z.object({
  fromSystem: gpaSystemSchema,
  toSystem: gpaSystemSchema,
  value: z.union([
    z.number().min(0).max(100),
    z.string().min(1),
  ]),
});

// Course schema for GPA calculator
export const courseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Course name is required').max(100, 'Course name is too long'),
  credits: z.number().int().min(1, 'Credits must be at least 1').max(20, 'Credits cannot exceed 20'),
  grade: letterGradeSchema,
});

// Course list schema
export const courseListSchema = z.array(courseSchema).min(1, 'At least one course is required');

// Validation for numeric GPA input based on system
export function validateGPAInput(value: string, system: string): { valid: boolean; error?: string } {
  const numValue = parseFloat(value);

  switch (system) {
    case 'us-4.0':
      if (isNaN(numValue) || numValue < 0 || numValue > 4.0) {
        return { valid: false, error: 'Enter a value between 0 and 4.0' };
      }
      break;
    case 'us-5.0':
      if (isNaN(numValue) || numValue < 0 || numValue > 5.0) {
        return { valid: false, error: 'Enter a value between 0 and 5.0' };
      }
      break;
    case 'percentage':
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        return { valid: false, error: 'Enter a value between 0 and 100' };
      }
      break;
    case 'german':
      if (isNaN(numValue) || numValue < 1.0 || numValue > 5.0) {
        return { valid: false, error: 'Enter a value between 1.0 and 5.0' };
      }
      break;
    case 'french':
      if (isNaN(numValue) || numValue < 0 || numValue > 20) {
        return { valid: false, error: 'Enter a value between 0 and 20' };
      }
      break;
    case 'letter':
    case 'uk':
      // These are handled by select dropdowns
      return { valid: true };
    default:
      return { valid: false, error: 'Invalid grading system' };
  }

  return { valid: true };
}

export type GPASystem = z.infer<typeof gpaSystemSchema>;
export type LetterGrade = z.infer<typeof letterGradeSchema>;
export type UKGrade = z.infer<typeof ukGradeSchema>;
export type Course = z.infer<typeof courseSchema>;
export type ConverterInput = z.infer<typeof converterInputSchema>;
