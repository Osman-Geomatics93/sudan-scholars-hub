'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  X,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ShareContent,
  SharePlatform,
  generateShareUrl,
  copyToClipboard,
  canUseNativeShare,
  nativeShare,
} from '@/lib/share-utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareContent;
  locale: string;
}

interface SharePlatformConfig {
  key: SharePlatform;
  icon: typeof Facebook;
  bgColor: string;
  hoverColor: string;
}

const platforms: SharePlatformConfig[] = [
  {
    key: 'whatsapp',
    icon: MessageCircle,
    bgColor: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
  },
  {
    key: 'facebook',
    icon: Facebook,
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
  },
  {
    key: 'twitter',
    icon: Twitter,
    bgColor: 'bg-black',
    hoverColor: 'hover:bg-gray-800',
  },
  {
    key: 'linkedin',
    icon: Linkedin,
    bgColor: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-800',
  },
  {
    key: 'email',
    icon: Mail,
    bgColor: 'bg-gray-600',
    hoverColor: 'hover:bg-gray-700',
  },
];

export function ShareModal({ isOpen, onClose, content, locale }: ShareModalProps) {
  const t = useTranslations('share');
  const isRTL = locale === 'ar';
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  const handleShare = (platform: SharePlatform) => {
    const url = generateShareUrl(platform, {
      url: content.url,
      title: content.title,
      description: content.description,
    });

    if (platform === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(content.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const shared = await nativeShare(content);
    if (shared) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalTitle =
    content.type === 'scholarship' ? t('shareScholarship') : t('shareBlog');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <Card
        className="relative z-10 w-full max-w-md p-6 bg-white rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            id="share-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            {modalTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="flex gap-4 p-4 bg-gray-50 rounded-lg mb-6">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-200">
            <Image
              src={content.image}
              alt={content.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
              {content.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {content.description}
            </p>
          </div>
        </div>

        {/* Native Share Button (Mobile) */}
        {canUseNativeShare() && (
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={handleNativeShare}
          >
            {t('title')}
          </Button>
        )}

        {/* Share Options */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">{t('shareVia')}</p>
          <div className="grid grid-cols-5 gap-2">
            {platforms.map(({ key, icon: Icon, bgColor, hoverColor }) => (
              <button
                key={key}
                onClick={() => handleShare(key)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 p-3 rounded-lg text-white transition-colors',
                  bgColor,
                  hoverColor
                )}
                aria-label={`${t('title')} ${t(key)}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] leading-tight">{t(key)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Copy Link */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{t('copyLink')}</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={content.url}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600 truncate focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              variant={copied ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleCopy}
              className={cn(
                'shrink-0 min-w-[100px]',
                copied && 'bg-green-600 hover:bg-green-700'
              )}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 me-1" />
                  {t('copied')}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 me-1" />
                  {t('copyLink')}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
