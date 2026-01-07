import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://www.deltaroots.store';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'ar'];

  // Static pages
  const staticPages: { path: string; changeFrequency: ChangeFrequency; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/scholarships', changeFrequency: 'daily', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/turkey', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/application-tips', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/study-guides', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/login', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );

  // Dynamic scholarship pages
  let scholarshipUrls: MetadataRoute.Sitemap = [];
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    scholarshipUrls = locales.flatMap((locale) =>
      scholarships.map((scholarship) => ({
        url: `${BASE_URL}/${locale}/scholarships/${scholarship.slug}`,
        lastModified: scholarship.updatedAt,
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.7,
      }))
    );
  } catch (error) {
    console.error('Error fetching scholarships for sitemap:', error);
  }

  // Dynamic blog pages
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    blogUrls = locales.flatMap((locale) =>
      blogPosts.map((post) => ({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.6,
      }))
    );
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticUrls, ...scholarshipUrls, ...blogUrls];
}
