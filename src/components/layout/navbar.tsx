'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Menu, X, GraduationCap, User, Bookmark, LogOut, ChevronDown, BookOpen, HelpCircle, Lightbulb, Globe, Calendar, Building2, FileQuestion, Calculator, Sparkles } from 'lucide-react';
import { Container } from './container';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/features/language-switcher';
import { ThemeToggle } from '@/components/features/theme-toggle';
import { cn } from '@/lib/utils';

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isTurkeyOpen, setIsTurkeyOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const resourcesMenuRef = useRef<HTMLDivElement>(null);
  const turkeyMenuRef = useRef<HTMLDivElement>(null);

  const isRTL = locale === 'ar';
  const isLoggedIn = status === 'authenticated' && session?.user;
  const isAdmin = (session?.user as any)?.isAdmin;

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll detection for navbar transformation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (resourcesMenuRef.current && !resourcesMenuRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
      if (turkeyMenuRef.current && !turkeyMenuRef.current.contains(event.target as Node)) {
        setIsTurkeyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/scholarships`, label: t('scholarships') },
    { href: `/${locale}/calendar`, label: isRTL ? 'التقويم' : 'Calendar' },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const turkeyMainLink = { href: `/${locale}/turkey`, label: t('turkeyMain'), icon: Globe };

  const turkeyCalendarLinks = [
    { href: `/${locale}/turkey/admissions-calendar`, label: t('admissionsCalendar'), icon: Calendar },
    { href: `/${locale}/turkey/masters-phd-calendar`, label: t('graduateCalendar'), icon: BookOpen },
    { href: `/${locale}/turkey/summer-calendar`, label: t('summerCalendar'), icon: Calendar },
  ];

  const turkeyUniversityLinks = [
    { href: `/${locale}/turkey/universities/public`, label: t('publicUniversities'), icon: Building2 },
    { href: `/${locale}/turkey/universities/private`, label: t('privateUniversities'), icon: Building2 },
    { href: `/${locale}/turkey/universities/ranking`, label: t('universityRanking'), icon: GraduationCap },
    { href: `/${locale}/turkey/universities/trade-off`, label: t('tradeOff'), icon: HelpCircle },
    { href: `/${locale}/turkey/universities/recognized-sudan`, label: t('recognizedSudan'), icon: GraduationCap },
  ];

  const turkeyYosLinks = [
    { href: `/${locale}/turkey/yos-exam/questions`, label: t('yosQuestions'), icon: FileQuestion },
    { href: `/${locale}/turkey/yos-exam/unified`, label: t('yosUnified'), icon: FileQuestion },
  ];

  const resourceLinks = [
    { href: `/${locale}/matcher`, label: isRTL ? 'مطابق المنح الذكي' : 'AI Matcher', icon: Sparkles },
    { href: `/${locale}/gpa-calculator`, label: isRTL ? 'حاسبة المعدل' : 'GPA Calculator', icon: Calculator },
    { href: `/${locale}/blog`, label: isRTL ? 'المدونة' : 'Blog', icon: BookOpen },
    { href: `/${locale}/faq`, label: isRTL ? 'الأسئلة الشائعة' : 'FAQ', icon: HelpCircle },
    { href: `/${locale}/application-tips`, label: isRTL ? 'نصائح التقديم' : 'Application Tips', icon: Lightbulb },
    { href: `/${locale}/study-guides`, label: isRTL ? 'أدلة الدراسة' : 'Study Guides', icon: Globe },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 ease-out",
      scrolled
        ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
        : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md",
      "border-b border-white/20 dark:border-gray-700/30"
    )}>
      <Container>
        <div className={cn(
          "flex items-center justify-between transition-all duration-500",
          scrolled ? "h-14" : "h-16"
        )}>
          {/* Logo */}
          <Link href={`/${locale}`} className="group flex items-center shrink-0">
            {/* Mobile: Icon only */}
            <div className="relative md:hidden">
              <Image
                src="/images/logo-icon.webp"
                alt="Sudan Scholars Hub"
                width={40}
                height={40}
                className="rounded-lg group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            {/* Desktop: Full horizontal logo */}
            <div className="hidden md:block">
              <Image
                src="/images/logo-horizontal.webp"
                alt="Sudan Scholars Hub"
                width={180}
                height={45}
                className="h-9 lg:h-10 w-auto dark:hidden group-hover:scale-[1.02] transition-transform duration-300"
                priority
              />
              <Image
                src="/images/logo-horizontal-dark.png"
                alt="Sudan Scholars Hub"
                width={180}
                height={45}
                className="h-9 lg:h-10 w-auto hidden dark:block group-hover:scale-[1.02] transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0 lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-1.5 lg:px-4 py-2 text-xs lg:text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-300 group whitespace-nowrap"
              >
                <span className="relative z-10">{link.label}</span>
                {/* Animated underline */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                {/* Background highlight */}
                <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </Link>
            ))}

            {/* Turkey Dropdown */}
            <div className="relative" ref={turkeyMenuRef}>
              <button
                onClick={() => setIsTurkeyOpen(!isTurkeyOpen)}
                className="relative flex items-center gap-1 px-1.5 lg:px-4 py-2 text-xs lg:text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-300 group whitespace-nowrap"
                suppressHydrationWarning
              >
                <span className="relative z-10">{t('turkey')}</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', isTurkeyOpen && 'rotate-180')} />
                {/* Background highlight */}
                <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </button>

              {/* Mega Menu */}
              {isTurkeyOpen && (
                <div className={cn(
                  "fixed md:absolute mt-4 w-[calc(100vw-1rem)] md:w-[500px] lg:w-[650px]",
                  "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
                  "border border-gray-200/50 dark:border-gray-700/50",
                  "rounded-2xl shadow-2xl shadow-black/10 p-4 md:p-6 z-50",
                  "left-2 right-2 md:left-auto md:right-0",
                  "top-16 md:top-auto"
                )}>
                  {/* Header with Turkey flag */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-3xl">🇹🇷</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('turkey')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isRTL ? 'اكتشف الجامعات والفرص التعليمية' : 'Explore universities and opportunities'}
                      </p>
                    </div>
                  </div>

                  {/* Grid of 4 sections - responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Section 1: Overview - Featured Card */}
                    <div>
                      <Link
                        href={turkeyMainLink.href}
                        className="block p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200/50 dark:border-red-700/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group/featured"
                        onClick={() => setIsTurkeyOpen(false)}
                      >
                        <Globe className="w-8 h-8 text-red-500 mb-3 group-hover/featured:scale-110 transition-transform duration-300" />
                        <h4 className="font-semibold text-red-700 dark:text-red-400">
                          {isRTL ? 'اكتشف تركيا' : 'Explore Turkey'}
                        </h4>
                        <p className="text-sm text-red-600/70 dark:text-red-300/70 mt-1">
                          {isRTL ? 'بوابتك للتعليم التركي' : 'Your gateway to Turkish education'}
                        </p>
                      </Link>
                    </div>

                    {/* Section 2: Calendars */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('calendars')}</h4>
                      </div>
                      <div className="space-y-1">
                        {turkeyCalendarLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 text-sm hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group/item"
                            onClick={() => setIsTurkeyOpen(false)}
                          >
                            <link.icon className="w-4 h-4 text-gray-400 group-hover/item:text-primary-500 transition-colors duration-200" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Section 3: Universities */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                          <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('universities')}</h4>
                      </div>
                      <div className="space-y-1">
                        {turkeyUniversityLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 text-sm hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group/item"
                            onClick={() => setIsTurkeyOpen(false)}
                          >
                            <link.icon className="w-4 h-4 text-gray-400 group-hover/item:text-primary-500 transition-colors duration-200" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Section 4: YÖS Exam */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <FileQuestion className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('yosExam')}</h4>
                      </div>
                      <div className="space-y-1">
                        {turkeyYosLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 text-sm hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group/item"
                            onClick={() => setIsTurkeyOpen(false)}
                          >
                            <link.icon className="w-4 h-4 text-gray-400 group-hover/item:text-primary-500 transition-colors duration-200" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesMenuRef}>
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="relative flex items-center gap-1 px-1.5 lg:px-4 py-2 text-xs lg:text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-300 group whitespace-nowrap"
                suppressHydrationWarning
              >
                <span className="relative z-10">{isRTL ? 'الموارد' : 'Resources'}</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', isResourcesOpen && 'rotate-180')} />
                {/* Background highlight */}
                <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </button>

              {isResourcesOpen && (
                <div className="absolute end-0 mt-2 w-56 max-w-[90vw] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-black/10 p-2 z-50 overflow-hidden">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group/item"
                      onClick={() => setIsResourcesOpen(false)}
                    >
                      <link.icon className="h-5 w-5 text-gray-400 group-hover/item:text-primary-500 transition-colors duration-200" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3 shrink-0">
            <ThemeToggle locale={locale} />
            <LanguageSwitcher locale={locale} />

            {!mounted || status === 'loading' ? (
              <div className="h-10 w-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
            ) : isLoggedIn ? (
              // User Menu
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-0.5 rounded-full transition-all duration-300 group"
                  suppressHydrationWarning
                >
                  {/* Avatar with gradient ring */}
                  <div className="relative">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    {/* Gradient ring */}
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            width={36}
                            height={36}
                            className="rounded-full w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={cn('h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300', isUserMenuOpen && 'rotate-180')} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute end-0 mt-2 w-56 max-w-[90vw] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20 border-b border-gray-100/50 dark:border-gray-700/50">
                    <p className="font-semibold text-gray-900 dark:text-gray-50 truncate">
                      {session.user?.name || (isRTL ? 'مستخدم' : 'User')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
                  </div>

                  <div className="p-2">
                    {!isAdmin && (
                      <>
                        <Link
                          href={`/${locale}/profile`}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-200 group/item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-5 w-5 text-gray-400 group-hover/item:text-primary-500 transition-colors duration-200" />
                          {isRTL ? 'الملف الشخصي' : 'Profile'}
                        </Link>
                        <Link
                          href={`/${locale}/profile`}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-200 group/item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Bookmark className="h-5 w-5 text-gray-400 group-hover/item:text-primary-500 transition-colors duration-200" />
                          {isRTL ? 'المنح المحفوظة' : 'Saved Scholarships'}
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-200 group/item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-5 w-5 text-gray-400 group-hover/item:text-primary-500 transition-colors duration-200" />
                        {isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}
                      </Link>
                    )}
                  </div>

                    <div className="border-t border-gray-100/50 dark:border-gray-700/50 p-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all duration-200 group/item"
                        suppressHydrationWarning
                      >
                        <LogOut className="h-5 w-5 group-hover/item:scale-110 transition-transform duration-200" />
                        {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login Button
              <Link href={`/${locale}/login`}>
                <Button variant="outline" size="sm" className="lg:px-4">
                  <User className="h-4 w-4 lg:me-2" />
                  <span className="hidden lg:inline">{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button - Animated hamburger to X */}
          <button
            className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            suppressHydrationWarning
            aria-label="Toggle menu"
          >
            <span className={cn(
              "w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 absolute",
              isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
            )} />
            <span className={cn(
              "w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300",
              isOpen && "opacity-0 scale-0"
            )} />
            <span className={cn(
              "w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 absolute",
              isOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
            )} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-y-auto transition-all duration-300 overscroll-contain',
            isOpen ? 'max-h-[calc(100vh-4rem)] pb-24' : 'max-h-0 overflow-hidden'
          )}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Turkey Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
                {t('turkey')}
              </p>
              {/* Turkey Main Page */}
              <Link
                href={turkeyMainLink.href}
                className="flex items-center gap-2 py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm mb-2"
                onClick={() => setIsOpen(false)}
              >
                <turkeyMainLink.icon className="h-4 w-4" />
                {turkeyMainLink.label}
              </Link>
              {/* Calendars */}
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-3 mb-2 px-3">
                {t('calendars')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {turkeyCalendarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* Universities */}
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-3 mb-2 px-3">
                {t('universities')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {turkeyUniversityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* YöS Exam */}
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-3 mb-2 px-3">
                {t('yosExam')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {turkeyYosLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Resources Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
                {isRTL ? 'الموارد' : 'Resources'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile User Section */}
            {!mounted ? (
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="h-10 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ) : isLoggedIn ? (
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
                <div className="flex items-center gap-3 py-2">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">{session.user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session.user?.email}</p>
                  </div>
                </div>

                {!isAdmin && (
                  <Link
                    href={`/${locale}/profile`}
                    className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Bookmark className="h-5 w-5" />
                    {isRTL ? 'المنح المحفوظة' : 'Saved Scholarships'}
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href={`/${locale}/admin`}
                    className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 py-2 text-red-600 dark:text-red-400 w-full"
                  suppressHydrationWarning
                >
                  <LogOut className="h-5 w-5" />
                  {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                </button>

                {/* Theme and Language for logged-in users */}
                <div className="flex items-center gap-3 pt-4 pb-8 border-t border-gray-100 dark:border-gray-800">
                  <ThemeToggle locale={locale} />
                  <LanguageSwitcher locale={locale} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-4 pb-8 border-t border-gray-100 dark:border-gray-800">
                <ThemeToggle locale={locale} />
                <LanguageSwitcher locale={locale} />
                <Link href={`/${locale}/login`} className="flex-1">
                  <Button className="w-full">
                    <User className="h-4 w-4 me-2" />
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
