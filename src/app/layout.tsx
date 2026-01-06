import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sudan Scholars Hub | بوابة منح السودان',
  description: 'Your gateway to scholarships and study opportunities for Sudanese students | بوابتك للمنح الدراسية وفرص الدراسة للطلاب السودانيين',
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
