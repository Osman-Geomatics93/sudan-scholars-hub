import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Paths that require admin authentication
const adminProtectedPaths = ['/admin'];
const publicAdminPaths = ['/admin/login'];

// Paths that require user authentication
const userProtectedPaths = ['/profile'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get session token
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value;

  // Check if it's an admin path (accounting for locale prefix)
  const isAdminPath = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/admin`) ||
      pathname === `/${locale}/admin`
  );

  const isPublicAdminPath = locales.some((locale) =>
    publicAdminPaths.some((path) => pathname === `/${locale}${path}`)
  );

  // Check if it's a user-protected path
  const isUserProtectedPath = locales.some((locale) =>
    userProtectedPaths.some(
      (path) =>
        pathname.startsWith(`/${locale}${path}`) ||
        pathname === `/${locale}${path}`
    )
  );

  // For admin paths (except login), check authentication
  if (isAdminPath && !isPublicAdminPath) {
    if (!sessionToken) {
      const locale = pathname.split('/')[1];
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For user-protected paths, redirect to user login
  if (isUserProtectedPath) {
    if (!sessionToken) {
      const locale = pathname.split('/')[1];
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*'],
};
