'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { GraduationCap, Facebook, Twitter, Linkedin, Github, Globe } from 'lucide-react';
import { Container } from './container';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const quickLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/scholarships`, label: tNav('scholarships') },
    { href: `/${locale}/about`, label: tNav('about') },
    { href: `/${locale}/contact`, label: tNav('contact') },
  ];

  const resources = [
    { href: `/${locale}/gpa-calculator`, label: locale === 'ar' ? 'حاسبة المعدل' : 'GPA Calculator' },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/faq`, label: t('faq') },
    { href: `/${locale}/application-tips`, label: t('tips') },
    { href: `/${locale}/study-guides`, label: t('guides') },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/osman-o-a-ibrahim-a02a9a197', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/Osman-Geomatics93', label: 'GitHub' },
    { icon: Facebook, href: 'https://www.facebook.com/www.osmangood/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/Osman_Ibrahim93', label: 'X (Twitter)' },
    { icon: Globe, href: 'https://osman-geomatics93.online/', label: 'Portfolio' },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 border-t border-gray-800 dark:border-gray-900">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href={`/${locale}`} className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/logo-icon.webp"
                  alt="Sudan Scholars Hub"
                  width={44}
                  height={44}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-white">
                  {locale === 'ar' ? 'بوابة منح السودان' : 'Sudan Scholars Hub'}
                </span>
              </Link>
              <p className="text-sm text-gray-400 mb-6">{t('description')}</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('resources')}</h3>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('connect')}</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="mailto:424236@ogr.ktu.edu.tr" className="hover:text-primary-400 transition-colors">
                    424236@ogr.ktu.edu.tr
                  </a>
                </li>
                <li>
                  <a href="tel:+249966699667" className="hover:text-primary-400 transition-colors">
                    +249 966 699 667
                  </a>
                </li>
                <li>{locale === 'ar' ? 'كوناكلار، شارع غازي مصطفى كمال رقم 23، 61010 طرابزون، تركيا' : 'Konaklar, Gazi Mustafa Kemal Cd. No:23, 61010 Trabzon, Türkiye'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()}{' '}
              {locale === 'ar' ? 'بوابة منح السودان' : 'Sudan Scholars Hub'}. {t('copyright')}.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary-400 transition-colors">
                {t('privacy')}
              </Link>
              <Link href="#" className="hover:text-primary-400 transition-colors">
                {t('terms')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
