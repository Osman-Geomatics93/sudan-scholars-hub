'use client';

import { AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { detectCliches, detectGenericPhrases, calculateSpecificityScore, getImprovementSuggestion } from '@/lib/loi-builder/quality-rules';

interface QualityHintProps {
  text: string;
  fieldType: string;
  language?: 'en' | 'tr';
}

export function QualityHint({ text, fieldType, language = 'en' }: QualityHintProps) {
  if (!text || text.trim().length < 5) {
    return null;
  }

  const cliches = detectCliches(text, language);
  const generic = detectGenericPhrases(text);
  const specificity = calculateSpecificityScore(text);
  const suggestion = getImprovementSuggestion(text, fieldType);

  // No issues
  if (cliches.length === 0 && generic.length === 0 && specificity >= 40) {
    return (
      <div className="mt-2 flex items-start gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>Good! You&apos;ve included specific details.</span>
      </div>
    );
  }

  const hints: React.ReactNode[] = [];

  // Cliche warnings
  if (cliches.length > 0) {
    hints.push(
      <div key="cliche" className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Cliche detected: &quot;{cliches[0]}&quot;. Try being more specific and personal.
        </span>
      </div>
    );
  }

  // Generic phrase warnings
  if (generic.length > 0 && cliches.length === 0) {
    hints.push(
      <div key="generic" className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          &quot;{generic[0]}&quot; is generic. Add a specific example that demonstrates this.
        </span>
      </div>
    );
  }

  // Suggestion for improvement
  if (suggestion && hints.length === 0) {
    hints.push(
      <div key="suggestion" className="flex items-start gap-2 text-blue-600 dark:text-blue-400">
        <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{suggestion}</span>
      </div>
    );
  }

  if (hints.length === 0) {
    return null;
  }

  return <div className="mt-2 space-y-1 text-sm">{hints}</div>;
}
