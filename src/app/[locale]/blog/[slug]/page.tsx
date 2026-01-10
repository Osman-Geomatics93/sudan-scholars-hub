'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, User, Tag, Loader2, Share2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { ShareModal } from '@/components/features/share-modal';
import { ShareContent } from '@/lib/share-utils';
import DOMPurify from 'isomorphic-dompurify';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  image: string;
  category: string;
  categoryAr: string;
  author: string;
  authorAr: string;
  readTime: string;
  readTimeAr: string;
  tags: string[];
  publishedAt: string;
}

export default function BlogDetailPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const slug = pathname.split('/')[3]; // /en/blog/[slug]
  const isRTL = locale === 'ar';

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) {
          throw new Error('Blog post not found');
        }
        const data = await res.json();
        setBlogPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Simple markdown-to-HTML converter for basic formatting
  const renderContent = (content: string) => {
    // Convert markdown headings
    let html = content
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-10 mb-6">$1</h1>')
      // Convert bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Convert italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert bullet points
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">$1</li>')
      // Convert numbered lists
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-2 list-decimal">$1</li>')
      // Convert paragraphs (lines separated by double newlines)
      .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
      // Convert single newlines to line breaks
      .replace(/\n/g, '<br />');

    // Wrap list items in ul tags
    html = html.replace(/(<li.*?<\/li>)+/g, '<ul class="list-disc mb-4 space-y-1">$&</ul>');

    // Wrap in paragraph tags
    html = `<p class="text-gray-700 leading-relaxed mb-4">${html}</p>`;

    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "h1", "h2", "h3", "h4", "a", "blockquote"], ALLOWED_ATTR: ["href", "class", "target", "rel"] });
  };

  if (loading) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Container>
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Container>
          <div className="py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              {isRTL ? 'المقال غير موجود' : 'Article Not Found'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isRTL
                ? 'عذراً، لم نتمكن من العثور على المقال المطلوب'
                : "Sorry, we couldn't find the article you're looking for"}
            </p>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700"
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {isRTL ? 'العودة إلى المدونة' : 'Back to Blog'}
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 lg:h-[500px] w-full">
        <Image
          src={blogPost.image}
          alt={isRTL ? blogPost.titleAr : blogPost.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Container className="relative h-full">
          <div className="absolute bottom-8 left-0 right-0 px-4 md:px-6">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {isRTL ? 'العودة إلى المدونة' : 'Back to Blog'}
            </Link>
            <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full mb-4">
              {isRTL ? blogPost.categoryAr : blogPost.category}
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
              {isRTL ? blogPost.titleAr : blogPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{isRTL ? blogPost.authorAr : blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blogPost.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{isRTL ? blogPost.readTimeAr : blogPost.readTime}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container size="md">
        <article className="py-12">
          {/* Tags */}
          {blogPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-medium">
            {isRTL ? blogPost.excerptAr : blogPost.excerpt}
          </p>

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderContent(isRTL ? blogPost.contentAr : blogPost.content),
            }}
          />

          {/* Author Box */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-50">
                  {isRTL ? blogPost.authorAr : blogPost.author}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'فريق مركز منح السودان'
                    : 'Sudan Scholars Hub Team'}
                </p>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              {isRTL ? 'شارك المقال:' : 'Share this article:'}
            </span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Share2 className="h-4 w-4" />
              {isRTL ? 'مشاركة' : 'Share'}
            </button>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t dark:border-gray-700">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {isRTL ? 'عرض جميع المقالات' : 'View All Articles'}
            </Link>
          </div>
        </article>
      </Container>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600">
        <Container size="sm">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isRTL ? 'هل استفدت من هذا المقال؟' : 'Found This Article Helpful?'}
            </h2>
            <p className="text-primary-100 mb-6 max-w-md mx-auto">
              {isRTL
                ? 'اشترك في نشرتنا الإخبارية للحصول على المزيد من النصائح والمقالات'
                : 'Subscribe to our newsletter for more tips and articles'}
            </p>
            <Link
              href={`/${locale}/scholarships`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isRTL ? 'تصفح المنح الدراسية' : 'Browse Scholarships'}
            </Link>
          </div>
        </Container>
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        content={{
          type: 'blog',
          title: isRTL ? blogPost.titleAr : blogPost.title,
          description: isRTL ? blogPost.excerptAr : blogPost.excerpt,
          image: blogPost.image,
          url: typeof window !== 'undefined'
            ? `${window.location.origin}/${locale}/blog/${blogPost.slug}`
            : '',
        }}
        locale={locale}
      />
    </div>
  );
}
