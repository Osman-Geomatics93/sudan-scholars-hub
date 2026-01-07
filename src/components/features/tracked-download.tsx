'use client';

import { ReactNode } from 'react';
import { useAnalytics } from '@/contexts/analytics-context';

interface TrackedDownloadProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TrackedDownload({ href, children, className }: TrackedDownloadProps) {
  const { trackDownload } = useAnalytics();

  const handleClick = () => {
    trackDownload(href);
  };

  return (
    <a
      href={href}
      download
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
