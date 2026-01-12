'use client';

import { useState, useMemo } from 'react';
import { Copy, Download, FileText, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { assembleLetter, getLetterWithHighlights } from '@/lib/loi-builder/letter-assembler';
import { calculateQualityScore, getWordCount, getTotalWordCount, TOTAL_WORD_TARGET } from '@/lib/loi-builder/quality-rules';
import { StrengthMeter } from './strength-meter';

interface LivePreviewProps {
  data: LOIWizardData;
  locale: string;
}

export function LivePreview({ data, locale }: LivePreviewProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const isRTL = locale === 'ar';

  const { letter, missingSteps } = useMemo(() => getLetterWithHighlights(data), [data]);
  const qualityScore = useMemo(() => calculateQualityScore(data), [data]);
  const wordCount = useMemo(() => getTotalWordCount(data), [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      // Dynamically import docx generator
      const { generateLOIDocx } = await import('@/lib/loi-builder/docx-generator');
      const blob = await generateLOIDocx(data);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Letter_of_Intent_${data.settings.fullName.replace(/\s+/g, '_') || 'draft'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      // Dynamically import pdf generator
      const { generateLOIPdf } = await import('@/lib/loi-builder/pdf-generator');
      const blob = await generateLOIPdf(data);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Letter_of_Intent_${data.settings.fullName.replace(/\s+/g, '_') || 'draft'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const isWordCountInRange = wordCount >= TOTAL_WORD_TARGET.min && wordCount <= TOTAL_WORD_TARGET.max;

  return (
    <div className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer lg:cursor-default"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {isRTL ? 'معاينة مباشرة' : 'Live Preview'}
          </h3>
        </div>
        <button className="lg:hidden p-1" aria-label={isCollapsed ? 'Expand' : 'Collapse'}>
          {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Collapsible content */}
      <div className={`${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        {/* Strength meter */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <StrengthMeter score={qualityScore} showDetails locale={locale} />
        </div>

        {/* Missing sections warning */}
        {missingSteps.length > 0 && (
          <div className="mx-4 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <strong>{isRTL ? 'أقسام ناقصة:' : 'Missing sections:'}</strong>{' '}
              {missingSteps.join(', ')}
            </p>
          </div>
        )}

        {/* Letter preview */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <div
            className="prose prose-sm dark:prose-invert max-w-none font-serif text-sm leading-relaxed"
            dir={data.settings.language === 'tr' ? 'ltr' : 'ltr'}
          >
            <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed bg-transparent p-0 m-0 text-gray-800 dark:text-gray-200">
              {letter || (isRTL ? 'ابدأ بملء الخطوات لمعاينة خطابك...' : 'Start filling in the steps to preview your letter...')}
            </pre>
          </div>
        </div>

        {/* Word count and actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {/* Word count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isRTL ? 'عدد الكلمات:' : 'Word count:'}
            </span>
            <span className={`text-sm font-medium ${isWordCountInRange ? 'text-green-600' : 'text-amber-600'}`}>
              {wordCount} / {TOTAL_WORD_TARGET.min}-{TOTAL_WORD_TARGET.max}
            </span>
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 me-1 text-green-500" />
                  {isRTL ? 'تم النسخ!' : 'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 me-1" />
                  {isRTL ? 'نسخ' : 'Copy'}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDocx}
              disabled={isExporting || wordCount < 100}
              className="flex-1"
            >
              <Download className="w-4 h-4 me-1" />
              DOCX
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={isExporting || wordCount < 100}
              className="flex-1"
            >
              <Download className="w-4 h-4 me-1" />
              PDF
            </Button>
          </div>

          {wordCount < 100 && (
            <p className="mt-2 text-xs text-gray-500">
              {isRTL ? 'أكمل 100 كلمة على الأقل لتفعيل التصدير' : 'Complete at least 100 words to enable export'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
