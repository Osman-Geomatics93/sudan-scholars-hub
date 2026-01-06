import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale: string = 'en') {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getDaysUntilDeadline(dateString: string): number {
  const deadline = new Date(dateString);
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isDeadlineSoon(dateString: string, daysThreshold: number = 30): boolean {
  const days = getDaysUntilDeadline(dateString);
  return days > 0 && days <= daysThreshold;
}

export function getLocalizedField<T extends Record<string, any>>(
  item: T,
  field: string,
  locale: string
): string {
  if (locale === 'ar') {
    const arField = `${field}Ar` as keyof T;
    return (item[arField] as string) || (item[field as keyof T] as string);
  }
  return item[field as keyof T] as string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
