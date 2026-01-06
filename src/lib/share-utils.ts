/**
 * Share utilities for generating social media share URLs
 * and handling native Web Share API
 */

export type SharePlatform = 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email';

export type ShareContentType = 'scholarship' | 'blog';

export interface ShareContent {
  type: ShareContentType;
  title: string;
  description: string;
  image: string;
  url: string;
}

interface ShareUrlParams {
  url: string;
  title: string;
  description?: string;
}

/**
 * Generate share URL for a specific platform
 */
export function generateShareUrl(platform: SharePlatform, params: ShareUrlParams): string {
  const { url, title, description } = params;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || '');

  const urls: Record<SharePlatform, string> = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%0A%0A${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
  };

  return urls[platform];
}

/**
 * Check if native Web Share API is available
 */
export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Attempt to use native Web Share API (mobile)
 * Returns true if share was successful, false otherwise
 */
export async function nativeShare(content: ShareContent): Promise<boolean> {
  if (!canUseNativeShare()) return false;

  try {
    await navigator.share({
      title: content.title,
      text: content.description,
      url: content.url,
    });
    return true;
  } catch {
    // User cancelled or share failed
    return false;
  }
}

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Get full shareable URL for content
 */
export function getShareableUrl(
  slug: string,
  type: ShareContentType,
  locale: string
): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL || '';

  const path = type === 'scholarship'
    ? `/${locale}/scholarships/${slug}`
    : `/${locale}/blog/${slug}`;

  return `${baseUrl}${path}`;
}
