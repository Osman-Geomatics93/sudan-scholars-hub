'use client';

import { useEffect } from 'react';
import { X, Calendar, MapPin, GraduationCap, Clock, Check, ExternalLink } from 'lucide-react';
import { useComparison } from '@/contexts/comparison-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLocalizedField, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface ComparisonModalProps {
  locale?: string;
}

export function ComparisonModal({ locale = 'en' }: ComparisonModalProps) {
  const { scholarships, removeFromCompare, isCompareModalOpen, closeCompareModal } = useComparison();

  const isRTL = locale === 'ar';

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCompareModal();
      }
    };

    if (isCompareModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isCompareModalOpen, closeCompareModal]);

  if (!isCompareModalOpen || scholarships.length < 2) {
    return null;
  }

  const getFundingLabel = (type: string) => {
    if (type === 'FULLY_FUNDED') {
      return isRTL ? 'ممولة بالكامل' : 'Fully Funded';
    }
    return isRTL ? 'ممولة جزئياً' : 'Partially Funded';
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      BACHELOR: { en: 'Bachelor', ar: 'بكالوريوس' },
      MASTER: { en: 'Master', ar: 'ماجستير' },
      PHD: { en: 'PhD', ar: 'دكتوراه' },
    };
    return isRTL ? labels[level]?.ar : labels[level]?.en;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCompareModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90dvh] mx-2 sm:mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {isRTL ? 'مقارنة المنح الدراسية' : 'Compare Scholarships'}
          </h2>
          <button
            onClick={closeCompareModal}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto max-h-[calc(90dvh-140px)]">
          <div className={`grid gap-3 sm:gap-4 p-3 sm:p-4 ${scholarships.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50 text-lg mb-1">
                      {getLocalizedField(scholarship, 'title', locale)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getLocalizedField(scholarship, 'university', locale)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCompare(scholarship.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title={isRTL ? 'إزالة' : 'Remove'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant={scholarship.fundingType === 'FULLY_FUNDED' ? 'success' : 'warning'}>
                    {getFundingLabel(scholarship.fundingType)}
                  </Badge>
                  {(scholarship.levels || []).map((level) => (
                    <Badge key={level} variant="info">
                      {getLevelLabel(level)}
                    </Badge>
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{getLocalizedField(scholarship, 'country', locale)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
                      {isRTL ? 'الموعد النهائي: ' : 'Deadline: '}
                      {formatDate(scholarship.deadline, locale)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>
                      {isRTL ? 'المدة: ' : 'Duration: '}
                      {getLocalizedField(scholarship, 'duration', locale)}
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-50 mb-2">
                    {isRTL ? 'المزايا' : 'Benefits'}
                  </h4>
                  <ul className="space-y-1.5">
                    {(isRTL ? scholarship.benefitsAr : scholarship.benefits)?.slice(0, 5).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-50 mb-2">
                    {isRTL ? 'شروط الأهلية' : 'Eligibility'}
                  </h4>
                  <ul className="space-y-1.5">
                    {(isRTL ? scholarship.eligibilityAr : scholarship.eligibility)?.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action */}
                <div className="pt-2">
                  <Link href={`/${locale}/scholarships/${scholarship.slug}`}>
                    <Button className="w-full" variant="outline">
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      <ExternalLink className="h-4 w-4 ms-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="ghost" onClick={closeCompareModal}>
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
}
