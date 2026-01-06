'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Menu, X, GraduationCap, User, Bookmark, LogOut, ChevronDown, BookOpen, HelpCircle, Lightbulb, Globe } from 'lucide-react';
import { Container } from './container';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/features/language-switcher';
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
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const resourcesMenuRef = useRef<HTMLDivElement>(null);

  const isRTL = locale === 'ar';
  const isLoggedIn = status === 'authenticated' && session?.user;
  const isAdmin = (session?.user as any)?.isAdmin;

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
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
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/scholarships`, label: t('scholarships') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const resourceLinks = [
    { href: `/${locale}/blog`, label: isRTL ? 'المدونة' : 'Blog', icon: BookOpen },
    { href: `/${locale}/faq`, label: isRTL ? 'الأسئلة الشائعة' : 'FAQ', icon: HelpCircle },
    { href: `/${locale}/application-tips`, label: isRTL ? 'نصائح التقديم' : 'Application Tips', icon: Lightbulb },
    { href: `/${locale}/study-guides`, label: isRTL ? 'أدلة الدراسة' : 'Study Guides', icon: Globe },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              {locale === 'ar' ? 'بوابة منح السودان' : 'Sudan Scholars Hub'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesMenuRef}>
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center gap-1 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                suppressHydrationWarning
              >
                {isRTL ? 'الموارد' : 'Resources'}
                <ChevronDown className={cn('h-4 w-4 transition-transform', isResourcesOpen && 'rotate-180')} />
              </button>

              {isResourcesOpen && (
                <div className="absolute end-0 mt-2 w-56 max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                      onClick={() => setIsResourcesOpen(false)}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher locale={locale} />

            {!mounted || status === 'loading' ? (
              <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
            ) : isLoggedIn ? (
              // User Menu
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  suppressHydrationWarning
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                  <ChevronDown className={cn('h-4 w-4 text-gray-500 transition-transform', isUserMenuOpen && 'rotate-180')} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute end-0 mt-2 w-56 max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900 truncate">
                        {session.user?.name || (isRTL ? 'مستخدم' : 'User')}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{session.user?.email}</p>
                    </div>

                    {!isAdmin && (
                      <>
                        <Link
                          href={`/${locale}/profile`}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          {isRTL ? 'الملف الشخصي' : 'Profile'}
                        </Link>
                        <Link
                          href={`/${locale}/profile`}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Bookmark className="h-4 w-4" />
                          {isRTL ? 'المنح المحفوظة' : 'Saved Scholarships'}
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        {isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                        suppressHydrationWarning
                      >
                        <LogOut className="h-4 w-4" />
                        {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login Button
              <Link href={`/${locale}/login`}>
                <Button variant="outline">
                  <User className="h-4 w-4 me-2" />
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
            suppressHydrationWarning
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-[700px] pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Resources Section */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {isRTL ? 'الموارد' : 'Resources'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 py-2 px-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors text-sm"
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
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="h-10 w-24 animate-pulse bg-gray-200 rounded" />
              </div>
            ) : isLoggedIn ? (
              <div className="border-t border-gray-100 pt-4 space-y-2">
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
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-sm text-gray-500">{session.user?.email}</p>
                  </div>
                </div>

                {!isAdmin && (
                  <Link
                    href={`/${locale}/profile`}
                    className="flex items-center gap-3 py-2 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <Bookmark className="h-5 w-5" />
                    {isRTL ? 'المنح المحفوظة' : 'Saved Scholarships'}
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href={`/${locale}/admin`}
                    className="flex items-center gap-3 py-2 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 py-2 text-red-600 w-full"
                  suppressHydrationWarning
                >
                  <LogOut className="h-5 w-5" />
                  {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
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
