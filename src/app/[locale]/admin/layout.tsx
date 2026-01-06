'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Mail,
  Users,
  LogOut,
  Menu,
  X,
  Quote,
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const locale = pathname.split('/')[1];

  // Don't show sidebar on login page - but still hide parent navbar/footer
  if (pathname.includes('/admin/login')) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-100" suppressHydrationWarning>
        {children}
      </div>
    );
  }

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/scholarships`,
      label: 'Scholarships',
      labelAr: 'المنح الدراسية',
      icon: GraduationCap,
    },
    {
      href: `/${locale}/admin/blog`,
      label: 'Blog',
      labelAr: 'المدونة',
      icon: FileText,
    },
    {
      href: `/${locale}/admin/testimonials`,
      label: 'Testimonials',
      labelAr: 'شهادات الطلاب',
      icon: Quote,
    },
    {
      href: `/${locale}/admin/contacts`,
      label: 'Messages',
      labelAr: 'الرسائل',
      icon: Mail,
    },
    {
      href: `/${locale}/admin/subscribers`,
      label: 'Subscribers',
      labelAr: 'المشتركين',
      icon: Users,
    },
  ];

  const isRTL = locale === 'ar';

  return (
    <div className={`fixed inset-0 z-[100] bg-gray-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 z-50 h-full w-64 max-w-[85vw] bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 lg:max-w-none ${
          sidebarOpen
            ? 'translate-x-0'
            : isRTL
            ? 'translate-x-full'
            : '-translate-x-full'
        } ${isRTL ? 'right-0' : 'left-0'}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href={`/${locale}/admin`} className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-gray-900">
                {isRTL ? 'لوحة الإدارة' : 'Admin Panel'}
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== `/${locale}/admin` &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {isRTL ? item.labelAr : item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`h-full overflow-auto ${isRTL ? 'lg:mr-64' : 'lg:ml-64'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}`}
              target="_blank"
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              {isRTL ? 'عرض الموقع' : 'View Site'}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
