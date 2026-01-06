import { z } from 'zod';

export const blogPostSchema = z.object({
  slug: z.string().min(1).max(200),

  // English content
  title: z.string().min(1).max(300),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  category: z.string().min(1).max(100),
  author: z.string().min(1).max(100),
  readTime: z.string().min(1).max(50),

  // Arabic content
  titleAr: z.string().min(1).max(300),
  excerptAr: z.string().min(1).max(500),
  contentAr: z.string().min(1),
  categoryAr: z.string().min(1).max(100),
  authorAr: z.string().min(1).max(100),
  readTimeAr: z.string().min(1).max(50),

  // Media & Tags
  image: z.string().url(),
  tags: z.array(z.string()),

  // Status
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
