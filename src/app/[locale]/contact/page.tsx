'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github, Globe, ChevronDown, ChevronUp, Send, Users } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('contact');

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.error || (locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.'));
      }
    } catch (err) {
      setError(locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: locale === 'ar' ? 'البريد الإلكتروني' : 'Email',
      value: '424236@ogr.ktu.edu.tr',
      href: 'mailto:424236@ogr.ktu.edu.tr'
    },
    {
      icon: Phone,
      label: locale === 'ar' ? 'الهاتف' : 'Phone',
      value: '+249 966 699 667',
      href: 'tel:+249966699667'
    },
    {
      icon: MapPin,
      label: locale === 'ar' ? 'العنوان' : 'Address',
      value: locale === 'ar'
        ? 'كوناكلار، شارع غازي مصطفى كمال رقم 23، 61010 طرابزون، تركيا'
        : 'Konaklar, Gazi Mustafa Kemal Cd. No:23, 61010 Trabzon, Türkiye',
      href: 'https://maps.google.com/?q=Konaklar,+Gazi+Mustafa+Kemal+Cd.+No:23,+61010+Trabzon,+Turkey'
    },
  ];

  const socialLinks = [
    { icon: Send, href: 'https://t.me/+uNRCkz0PUfQzOGZk', label: 'Telegram', color: 'hover:bg-[#0088cc]/10 hover:text-[#0088cc]' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/osman-o-a-ibrahim-a02a9a197', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/Osman-Geomatics93', label: 'GitHub' },
    { icon: Facebook, href: 'https://www.facebook.com/www.osmangood/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/Osman_Ibrahim93', label: 'X (Twitter)' },
    { icon: Globe, href: 'https://osman-geomatics93.online/', label: 'Portfolio' },
  ];

  const faqs = [
    { question: t('faq1Q'), answer: t('faq1A') },
    { question: t('faq2Q'), answer: t('faq2A') },
    { question: t('faq3Q'), answer: t('faq3A') },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-20">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-display text-gray-900 dark:text-white mb-4">{t('heroTitle')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('heroSubtitle')}</p>
          </div>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-6 md:p-8">
              <h2 className="text-h3 text-gray-900 dark:text-gray-50 mb-6">{t('formTitle')}</h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-900 dark:text-gray-50 font-medium">{t('successMessage')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                  <Input
                    label={t('nameLabel')}
                    placeholder={t('namePlaceholder')}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    label={t('emailLabel')}
                    placeholder={t('emailPlaceholder')}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                  />
                  <Input
                    label={t('subjectLabel')}
                    placeholder={t('subjectPlaceholder')}
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    required
                  />
                  <Textarea
                    label={t('messageLabel')}
                    placeholder={t('messagePlaceholder')}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    required
                  />
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    {t('submitButton')}
                  </Button>
                </form>
              )}
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-h3 text-gray-900 dark:text-gray-50 mb-6">{t('infoTitle')}</h2>
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <a
                      key={info.label}
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 group-hover:bg-primary-200 transition-colors">
                        <info.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{info.label}</div>
                        <div className="font-medium text-gray-900 dark:text-gray-50 group-hover:text-primary-600 transition-colors">{info.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Telegram Community Card */}
              <a
                href="https://t.me/+uNRCkz0PUfQzOGZk"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="p-5 bg-gradient-to-r from-[#0088cc] to-[#00a0e3] text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Send className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {locale === 'ar' ? 'انضم لقناتنا على تيليجرام' : 'Join Our Telegram Channel'}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {locale === 'ar'
                          ? 'احصل على آخر أخبار المنح الدراسية والنصائح مباشرة'
                          : 'Get latest scholarship news and tips directly'}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 group-hover:bg-white/30 transition-colors">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {locale === 'ar' ? 'انضم الآن' : 'Join Now'}
                      </span>
                    </div>
                  </div>
                </Card>
              </a>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">{t('socialTitle')}</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition-colors",
                        social.color || "hover:bg-primary-100 hover:text-primary-600"
                      )}
                      aria-label={social.label}
                      title={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-lg overflow-hidden h-48 md:h-64 lg:h-72 shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2999.8968073728847!2d39.72382!3d40.98808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40643c5bce1f32a7%3A0x7fe5b62c5e5b9e5a!2sKonaklar%2C%20Gazi%20Mustafa%20Kemal%20Cd.%2C%2061010%20Ortahisar%2FTrabzon%2C%20T%C3%BCrkiye!5e0!3m2!1sen!2s!4v1704067200000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={locale === 'ar' ? 'موقعنا على الخريطة' : 'Our Location on Map'}
                ></iframe>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-gray-50 dark:bg-gray-950">
        <Container size="md">
          <h2 className="text-h2 text-gray-900 dark:text-gray-50 text-center mb-8">{t('faqTitle')}</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className={cn('overflow-hidden transition-colors', expandedFaq === index && 'border-primary-300')}
              >
                <button
                  className="w-full p-4 md:p-6 flex items-center justify-between text-start"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-50">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                  )}
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    expandedFaq === index ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <p className="px-4 md:px-6 pb-4 md:pb-6 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
