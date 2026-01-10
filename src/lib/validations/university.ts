import { z } from 'zod';

export const universitySchema = z.object({
  name: z
    .string()
    .min(2, 'University name must be at least 2 characters')
    .max(200, 'University name must be less than 200 characters'),
  nameAr: z
    .string()
    .min(2, 'Arabic name must be at least 2 characters')
    .max(200, 'Arabic name must be less than 200 characters'),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must be less than 100 characters'),
  countryAr: z
    .string()
    .min(2, 'Arabic country must be at least 2 characters')
    .max(100, 'Arabic country must be less than 100 characters'),
  qsRank: z
    .number()
    .int()
    .positive('QS rank must be a positive number')
    .max(10000, 'QS rank must be less than 10000')
    .nullable()
    .optional(),
  timesRank: z
    .number()
    .int()
    .positive('Times rank must be a positive number')
    .max(10000, 'Times rank must be less than 10000')
    .nullable()
    .optional(),
  logo: z
    .string()
    .url('Logo must be a valid URL')
    .max(500, 'Logo URL must be less than 500 characters')
    .nullable()
    .optional(),
  website: z
    .string()
    .url('Website must be a valid URL')
    .max(500, 'Website URL must be less than 500 characters')
    .nullable()
    .optional(),
});

export const universityUpdateSchema = universitySchema.partial();

export type UniversityInput = z.infer<typeof universitySchema>;
export type UniversityUpdateInput = z.infer<typeof universityUpdateSchema>;
