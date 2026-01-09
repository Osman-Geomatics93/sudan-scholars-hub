'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen, User } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { ShareButton } from '@/components/features/share-button';
import { SkeletonBlogFeatured, SkeletonBlogCard } from '@/components/ui/skeleton';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  image: string;
  category: string;
  categoryAr: string;
  author: string;
  authorAr: string;
  readTime: string;
  readTimeAr: string;
  tags: string[];
  isFeatured: boolean;
  publishedAt: string;
}

export default function BlogPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const res = await fetch('/api/blog');
        if (!res.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await res.json();
        setBlogPosts(data.blogPosts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const featuredPost = blogPosts.find((p) => p.isFeatured) || blogPosts[0];
  const otherPosts = blogPosts.filter((p) => p.id !== featuredPost?.id);

  if (loading) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
          <Container size="md">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
                {isRTL ? 'المدونة' : 'Blog'}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {isRTL
                  ? 'مقالات ونصائح وأدلة لمساعدتك في رحلتك نحو المنحة الدراسية'
                  : 'Articles, tips, and guides to help you on your scholarship journey'
                }
              </p>
            </div>
          </Container>
        </section>

        {/* Featured Post Skeleton */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <Container>
            <SkeletonBlogFeatured />
          </Container>
        </section>

        {/* Blog Cards Skeleton */}
        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <Container>
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonBlogCard key={i} />
              ))}
            </div>
          </Container>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
          <Container size="md">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {isRTL ? 'المدونة' : 'Blog'}
              </h1>
            </div>
          </Container>
        </section>
        <section className="py-16">
          <Container>
            <div className="rounded-lg bg-red-50 p-4 text-red-700 text-center">
              {isRTL ? 'فشل في تحميل المقالات' : 'Failed to load articles'}
            </div>
          </Container>
        </section>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
          <Container size="md">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {isRTL ? 'المدونة' : 'Blog'}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {isRTL
                  ? 'مقالات ونصائح وأدلة لمساعدتك في رحلتك نحو المنحة الدراسية'
                  : 'Articles, tips, and guides to help you on your scholarship journey'
                }
              </p>
            </div>
          </Container>
        </section>
        <section className="py-16">
          <Container>
            <div className="text-center text-gray-500">
              {isRTL ? 'لا توجد مقالات حالياً' : 'No articles available yet'}
            </div>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
        <Container size="md">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {isRTL ? 'المدونة' : 'Blog'}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {isRTL
                ? 'مقالات ونصائح وأدلة لمساعدتك في رحلتك نحو المنحة الدراسية'
                : 'Articles, tips, and guides to help you on your scholarship journey'
              }
            </p>
          </div>
        </Container>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-white">
          <Container>
            <Card className="overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="relative w-full lg:w-1/2 h-64 lg:h-auto lg:min-h-[400px]">
                  <Image
                    src={featuredPost.image}
                    alt={isRTL ? featuredPost.titleAr : featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 start-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                      {isRTL ? 'مميز' : 'Featured'}
                    </span>
                  </div>
                  <div className="absolute top-4 end-4">
                    <ShareButton
                      title={isRTL ? featuredPost.titleAr : featuredPost.title}
                      description={(isRTL ? featuredPost.excerptAr : featuredPost.excerpt).slice(0, 150)}
                      image={featuredPost.image}
                      slug={featuredPost.slug}
                      type="blog"
                      locale={locale}
                      size="md"
                    />
                  </div>
                </div>
                <div className="flex-1 p-6 lg:p-10 flex flex-col justify-center">
                  <span className="text-primary-600 font-medium text-sm mb-2">
                    {isRTL ? featuredPost.categoryAr : featuredPost.category}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {isRTL ? featuredPost.titleAr : featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {isRTL ? featuredPost.excerptAr : featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{isRTL ? featuredPost.authorAr : featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{isRTL ? featuredPost.readTimeAr : featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    {isRTL ? 'اقرأ المزيد' : 'Read More'}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      )}

      {/* All Posts */}
      {otherPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              {isRTL ? 'جميع المقالات' : 'All Articles'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <Link key={post.id} href={`/${locale}/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full">
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={isRTL ? post.titleAr : post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 start-3">
                        <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full">
                          {isRTL ? post.categoryAr : post.category}
                        </span>
                      </div>
                      <div className="absolute top-3 end-3">
                        <ShareButton
                          title={isRTL ? post.titleAr : post.title}
                          description={(isRTL ? post.excerptAr : post.excerpt).slice(0, 150)}
                          image={post.image}
                          slug={post.slug}
                          type="blog"
                          locale={locale}
                          size="sm"
                        />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {isRTL ? post.titleAr : post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {isRTL ? post.excerptAr : post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{isRTL ? post.readTimeAr : post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-12 md:py-16 bg-primary-600">
        <Container size="sm">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isRTL ? 'لا تفوّت أي مقال' : "Don't Miss Any Article"}
            </h2>
            <p className="text-primary-100 mb-6 max-w-md mx-auto">
              {isRTL
                ? 'اشترك في نشرتنا الإخبارية للحصول على أحدث المقالات والنصائح'
                : 'Subscribe to our newsletter to get the latest articles and tips'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={isRTL ? 'بريدك الإلكتروني' : 'Your email'}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                suppressHydrationWarning
              />
              <button className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                {isRTL ? 'اشترك' : 'Subscribe'}
              </button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
