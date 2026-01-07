'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { ComparisonProvider } from '@/contexts/comparison-context';
import { AnalyticsProvider } from '@/contexts/analytics-context';
import { ChatProvider } from '@/contexts/chat-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <SessionProvider>
        <AnalyticsProvider>
          <ChatProvider>
            <ComparisonProvider>{children}</ComparisonProvider>
          </ChatProvider>
        </AnalyticsProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
