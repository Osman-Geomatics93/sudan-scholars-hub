import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://www.deltaroots.store';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sudan Scholars Hub | بوابة منح السودان',
    template: '%s | Sudan Scholars Hub',
  },
  description: 'Your gateway to scholarships and study opportunities for Sudanese students. Find fully funded scholarships in Turkey, UK, USA, Germany and more. | بوابتك للمنح الدراسية وفرص الدراسة للطلاب السودانيين',
  keywords: [
    'scholarships for Sudanese students',
    'Sudan scholarships',
    'Türkiye Burslari',
    'Turkey scholarship',
    'fully funded scholarships',
    'study abroad Sudan',
    'منح دراسية للسودانيين',
    'منحة تركيا',
    'منح دراسية ممولة بالكامل',
    'الدراسة في الخارج',
    'منح السودان',
  ],
  authors: [{ name: 'Sudan Scholars Hub' }],
  creator: 'Sudan Scholars Hub',
  publisher: 'Sudan Scholars Hub',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SD',
    url: siteUrl,
    siteName: 'Sudan Scholars Hub',
    title: 'Sudan Scholars Hub | بوابة منح السودان',
    description: 'Your gateway to scholarships and study opportunities for Sudanese students. Find fully funded scholarships worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sudan Scholars Hub - Scholarship Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sudan Scholars Hub | بوابة منح السودان',
    description: 'Your gateway to scholarships and study opportunities for Sudanese students.',
    images: ['/og-image.png'],
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-google-verification-code',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': `${siteUrl}/en`,
      'ar': `${siteUrl}/ar`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
