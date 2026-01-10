import { z } from 'zod';

export const advertisementSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  titleAr: z
    .string()
    .min(2, 'Arabic title must be at least 2 characters')
    .max(200, 'Arabic title must be less than 200 characters'),
  imageUrl: z
    .string()
    .url('Image URL must be a valid URL')
    .max(500, 'Image URL must be less than 500 characters'),
  linkUrl: z
    .string()
    .url('Link URL must be a valid URL')
    .max(500, 'Link URL must be less than 500 characters')
    .nullable()
    .optional(),
  isActive: z
    .boolean()
    .default(true),
  order: z
    .number()
    .int()
    .min(0, 'Order must be a non-negative number')
    .max(1000, 'Order must be less than 1000')
    .optional(),
});

export const advertisementUpdateSchema = advertisementSchema.partial();

export type AdvertisementInput = z.infer<typeof advertisementSchema>;
export type AdvertisementUpdateInput = z.infer<typeof advertisementUpdateSchema>;
