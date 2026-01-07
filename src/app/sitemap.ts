import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://www.deltaroots.store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages for both locales
  const locales = ['en', 'ar'];
  const staticPages = [
    '',
    '/scholarships',
    '/about',
    '/contact',
    '/faq',
    '/blog',
    '/turkey',
    '/application-tips',
    '/study-guides',
    '/login',
  ];

  const staticUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' : 'weekly' as const,
      priority: page === '' ? 1 : page === '/scholarships' ? 0.9 : 0.8,
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
        changeFrequency: 'weekly' as const,
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
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    );
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticUrls, ...scholarshipUrls, ...blogUrls];
}
