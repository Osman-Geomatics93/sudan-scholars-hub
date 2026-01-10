'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Trophy, GraduationCap, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  checkEligibility,
  SCHOLARSHIP_REQUIREMENTS,
  ScholarshipRequirement,
  fromPercentage,
} from '@/lib/gpa-utils';

interface ScholarshipEligibilityProps {
  locale: string;
  gpaPercent: number | null;
  level?: 'BACHELOR' | 'MASTER' | 'PHD';
}

export function ScholarshipEligibility({ locale, gpaPercent, level }: ScholarshipEligibilityProps) {
  const isRTL = locale === 'ar';
  const [showAllNotEligible, setShowAllNotEligible] = useState(false);

  // Calculate eligibility
  const eligibility = useMemo(() => {
    if (gpaPercent === null || gpaPercent <= 0) return null;
    return checkEligibility(gpaPercent, level);
  }, [gpaPercent, level]);

  // Get level label
  const getLevelLabel = (lvl: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      BACHELOR: { en: 'Bachelor', ar: 'بكالوريوس' },
      MASTER: { en: 'Master', ar: 'ماجستير' },
      PHD: { en: 'PhD', ar: 'دكتوراه' },
    };
    return isRTL ? labels[lvl]?.ar : labels[lvl]?.en;
  };

  // Render scholarship card
  const renderScholarship = (
    scholarship: ScholarshipRequirement,
    status: 'eligible' | 'close' | 'notEligible'
  ) => {
    const statusConfig = {
      eligible: {
        icon: CheckCircle2,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        label: isRTL ? 'مؤهل' : 'Eligible',
      },
      close: {
        icon: AlertCircle,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
        label: isRTL ? 'قريب' : 'Close',
      },
      notEligible: {
        icon: XCircle,
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        label: isRTL ? 'غير مؤهل' : 'Not Eligible',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div
        key={scholarship.id}
        className={`p-4 rounded-lg border ${config.bg} transition-all hover:shadow-sm`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.color}`} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {isRTL ? scholarship.name.ar : scholarship.name.en}
              </h4>
              <Badge className={config.badge}>{config.label}</Badge>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{scholarship.country}</span>
              <span className="mx-1">•</span>
              <span>
                {isRTL ? 'الحد الأدنى:' : 'Min:'} {scholarship.minPercent}%
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isRTL ? scholarship.note.ar : scholarship.note.en}
            </p>

            <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-wrap gap-1">
                {scholarship.levels.map((lvl) => (
                  <span
                    key={lvl}
                    className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
                  >
                    {getLevelLabel(lvl)}
                  </span>
                ))}
              </div>
              {scholarship.website && (
                <a
                  href={scholarship.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  {isRTL ? 'الموقع' : 'Website'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // No GPA provided
  if (gpaPercent === null || gpaPercent <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            {isRTL ? 'أهلية المنح الدراسية' : 'Scholarship Eligibility'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>
              {isRTL
                ? 'أدخل معدلك لمعرفة المنح التي تؤهل لها'
                : 'Enter your GPA to see which scholarships you qualify for'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          {isRTL ? 'أهلية المنح الدراسية' : 'Scholarship Eligibility'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* GPA Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {isRTL ? 'معدلك الحالي' : 'Your Current GPA'}
          </p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-bold text-primary">{gpaPercent.toFixed(1)}%</span>
            <span className="text-gray-500 dark:text-gray-400">
              ({fromPercentage(gpaPercent, 'us-4.0')}/4.0 GPA)
            </span>
          </div>
        </div>

        {eligibility && (
          <div className="space-y-6">
            {/* Eligible Scholarships */}
            {eligibility.eligible.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {isRTL ? `مؤهل لـ ${eligibility.eligible.length} منح` : `Eligible for ${eligibility.eligible.length} Scholarships`}
                </h3>
                <div className="space-y-3">
                  {eligibility.eligible.map((s) => renderScholarship(s, 'eligible'))}
                </div>
              </div>
            )}

            {/* Close to Qualifying */}
            {eligibility.close.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {isRTL ? `قريب من التأهل لـ ${eligibility.close.length} منح` : `Close to ${eligibility.close.length} Scholarships`}
                </h3>
                <div className="space-y-3">
                  {eligibility.close.map((s) => renderScholarship(s, 'close'))}
                </div>
              </div>
            )}

            {/* Not Eligible */}
            {eligibility.notEligible.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  {isRTL ? `${eligibility.notEligible.length} منح أخرى` : `${eligibility.notEligible.length} Other Scholarships`}
                </h3>
                <div className="space-y-3">
                  {(showAllNotEligible ? eligibility.notEligible : eligibility.notEligible.slice(0, 3)).map((s) => renderScholarship(s, 'notEligible'))}
                </div>
                {eligibility.notEligible.length > 3 && (
                  <button
                    onClick={() => setShowAllNotEligible(!showAllNotEligible)}
                    className="mt-3 w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary flex items-center justify-center gap-1 transition-colors"
                  >
                    {showAllNotEligible ? (
                      <>
                        {isRTL ? 'عرض أقل' : 'Show Less'}
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        {isRTL ? `عرض ${eligibility.notEligible.length - 3} المزيد` : `Show ${eligibility.notEligible.length - 3} More`}
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Summary Stats */}
            <div className="pt-4 border-t dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {eligibility.eligible.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isRTL ? 'مؤهل' : 'Eligible'}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {eligibility.close.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isRTL ? 'قريب' : 'Close'}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-400">
                    {SCHOLARSHIP_REQUIREMENTS.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isRTL ? 'إجمالي' : 'Total'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
