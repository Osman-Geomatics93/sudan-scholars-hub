import { z } from 'zod';

const socialLinksSchema = z.object({
  twitter: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  facebook: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
}).optional();

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  phone: z
    .string()
    .regex(/^[\d\s+\-()]*$/, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  educationLevel: z
    .enum(['', 'HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD'])
    .optional(),
  fieldOfStudy: z
    .enum(['', 'ENGINEERING', 'MEDICINE', 'BUSINESS', 'ARTS', 'SCIENCE', 'LAW', 'EDUCATION', 'TECHNOLOGY'])
    .optional(),
  socialLinks: socialLinksSchema,
  profileImage: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
