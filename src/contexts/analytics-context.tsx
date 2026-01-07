'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsContextType {
  sessionId: string;
  trackDownload: (filePath: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

function generateSessionId(): string {
  // Check for existing session ID in sessionStorage
  if (typeof window !== 'undefined') {
    const existing = sessionStorage.getItem('analytics_session_id');
    if (existing) return existing;

    // Generate a unique session ID
    const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('analytics_session_id', newId);
    return newId;
  }
  return '';
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [sessionId, setSessionId] = useState<string>('');
  const pathname = usePathname();

  // Initialize session on mount
  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!sessionId || !pathname) return;

    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            path: pathname,
            referrer: document.referrer || null,
            locale: pathname.split('/')[1] || 'en',
          }),
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error('Failed to track page view:', error);
      }
    };

    // Small delay to avoid tracking during navigation transitions
    const timeoutId = setTimeout(trackPageView, 100);
    return () => clearTimeout(timeoutId);
  }, [sessionId, pathname]);

  const trackDownload = async (filePath: string) => {
    if (!sessionId) return;

    try {
      await fetch('/api/analytics/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          filePath,
          referrerPage: pathname,
        }),
      });
    } catch (error) {
      // Silently fail
      console.error('Failed to track download:', error);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ sessionId, trackDownload }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
}
