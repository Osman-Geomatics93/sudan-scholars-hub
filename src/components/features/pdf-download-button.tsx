'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateScholarshipPDF } from '@/lib/pdf-generator';

interface ScholarshipData {
  title: string;
  titleAr?: string;
  university: string;
  universityAr?: string;
  country: string;
  countryAr?: string;
  description: string;
  descriptionAr?: string;
  eligibility: string[];
  eligibilityAr?: string[];
  benefits: string[];
  benefitsAr?: string[];
  requirements: string[];
  requirementsAr?: string[];
  howToApply: string;
  howToApplyAr?: string;
  duration?: string;
  durationAr?: string;
  deadline?: Date | string;
  fundingType?: string;
  levels?: string[];
  field?: string;
  applicationUrl?: string;
}

interface PDFDownloadButtonProps {
  scholarship: ScholarshipData;
  locale: 'en' | 'ar';
  variant?: 'icon' | 'full';
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
}

export function PDFDownloadButton({
  scholarship,
  locale,
  variant = 'full',
  size = 'md',
  className,
  label,
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 100));

      generateScholarshipPDF(scholarship, { locale });

      // Track download event
      try {
        await fetch('/api/analytics/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scholarshipId: (scholarship as { id?: string }).id,
            type: 'pdf',
          }),
        });
      } catch {
        // Silently fail analytics tracking
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const defaultLabel = locale === 'ar' ? 'تحميل PDF' : 'Download PDF';
  const buttonLabel = label || defaultLabel;

  if (variant === 'icon') {
    return (
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={cn(
          'flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-primary-600 hover:bg-white transition-colors shadow-sm disabled:opacity-50',
          size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
          className
        )}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        {isGenerating ? (
          <Loader2 className={cn('animate-spin', size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} />
        ) : (
          <Download className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={cn(
        'flex items-center justify-center gap-2 w-full py-2 text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50',
        className
      )}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {buttonLabel}
    </button>
  );
}
