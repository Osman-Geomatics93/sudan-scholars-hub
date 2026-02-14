import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Providers } from '@/components/providers';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { CookieConsent } from '@/components/analytics/cookie-consent';
import { ChatWidget } from '@/components/chatbot/chat-widget';

const siteUrl = 'https://www.deltaroots.store';

const localeMetadata = {
  en: {
    title: {
      default: 'Sudan Scholars Hub | Scholarships for Sudanese Students',
      template: '%s | Sudan Scholars Hub',
    },
    description:
      'Your gateway to scholarships and study opportunities for Sudanese students. Find fully funded scholarships in Turkey, UK, USA, Germany and more.',
    keywords: [
      'scholarships for Sudanese students',
      'Sudan scholarships',
      'Türkiye Burslari',
      'Turkey scholarship',
      'fully funded scholarships',
      'study abroad Sudan',
      'scholarship portal',
      'international scholarships',
      'university admissions',
      'student opportunities',
    ],
    ogLocale: 'en_US',
    ogAltLocale: 'ar_SD',
    ogTitle: 'Sudan Scholars Hub | Scholarships for Sudanese Students',
    ogDescription:
      'Your gateway to scholarships and study opportunities for Sudanese students. Find fully funded scholarships worldwide.',
    ogImageAlt: 'Sudan Scholars Hub - Scholarship Portal',
    twitterTitle: 'Sudan Scholars Hub | Scholarships for Sudanese Students',
    twitterDescription:
      'Your gateway to scholarships and study opportunities for Sudanese students.',
  },
  ar: {
    title: {
      default: 'بوابة منح السودان | منح دراسية للطلاب السودانيين',
      template: '%s | بوابة منح السودان',
    },
    description:
      'بوابتك للمنح الدراسية وفرص الدراسة للطلاب السودانيين. اكتشف منح دراسية ممولة بالكامل في تركيا وبريطانيا وأمريكا وألمانيا والمزيد.',
    keywords: [
      'منح دراسية للسودانيين',
      'منح السودان',
      'منحة تركيا',
      'المنحة التركية',
      'منح دراسية ممولة بالكامل',
      'الدراسة في الخارج',
      'منح دراسية',
      'فرص دراسية',
      'قبولات جامعية',
      'منح للطلاب السودانيين',
    ],
    ogLocale: 'ar_SD',
    ogAltLocale: 'en_US',
    ogTitle: 'بوابة منح السودان | منح دراسية للطلاب السودانيين',
    ogDescription:
      'بوابتك للمنح الدراسية وفرص الدراسة للطلاب السودانيين. اكتشف منح دراسية ممولة بالكامل حول العالم.',
    ogImageAlt: 'بوابة منح السودان - بوابة المنح الدراسية',
    twitterTitle: 'بوابة منح السودان | منح دراسية للطلاب السودانيين',
    twitterDescription:
      'بوابتك للمنح الدراسية وفرص الدراسة للطلاب السودانيين.',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const meta = localeMetadata[locale as keyof typeof localeMetadata] ?? localeMetadata.en;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      alternateLocale: meta.ogAltLocale,
      url: `${siteUrl}/${locale}`,
      siteName: 'Sudan Scholars Hub',
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: meta.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Osman_Ibrahim93',
      creator: '@Osman_Ibrahim93',
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
        'x-default': `${siteUrl}/ar`,
      },
    },
  };
}

function JsonLd({ locale }: { locale: string }) {
  const meta = localeMetadata[locale as keyof typeof localeMetadata] ?? localeMetadata.en;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sudan Scholars Hub',
    url: siteUrl,
    logo: `${siteUrl}/og-image.png`,
    sameAs: [
      'https://www.facebook.com/www.osmangood/',
      'https://x.com/Osman_Ibrahim93',
      'https://www.linkedin.com/in/osman-o-a-ibrahim-a02a9a197',
      'https://github.com/Osman-Geomatics93',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+249966699667',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sudan Scholars Hub',
    url: `${siteUrl}/${locale}`,
    description: meta.description,
    inLanguage: locale === 'ar' ? 'ar-SD' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}/scholarships?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd locale={locale} />
      <GoogleAnalytics />
      <Providers>
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
          <CookieConsent />
          <ChatWidget />
        </NextIntlClientProvider>
      </Providers>
    </div>
  );
}
