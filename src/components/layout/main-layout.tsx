'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export function MainLayout({ children, locale }: MainLayoutProps) {
  const pathname = usePathname();

  // Don't show navbar/footer on admin pages
  const isAdminPage = pathname?.includes('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
