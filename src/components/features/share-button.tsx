'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShareModal } from './share-modal';
import { ShareContent, ShareContentType, getShareableUrl } from '@/lib/share-utils';

interface ShareButtonProps {
  title: string;
  description: string;
  image: string;
  slug: string;
  type: ShareContentType;
  locale: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ShareButton({
  title,
  description,
  image,
  slug,
  type,
  locale,
  size = 'sm',
  className,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const content: ShareContent = {
    type,
    title,
    description,
    image,
    url: getShareableUrl(slug, type, locale),
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm dark:shadow-gray-900/50',
          size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
          className
        )}
        aria-label="Share"
      >
        <Share2 className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      </button>

      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={content}
        locale={locale}
      />
    </>
  );
}
