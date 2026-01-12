'use client';

import { useRef, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEPS } from '@/lib/loi-builder/types';
import type { StepStatus } from './use-step-completion';

interface WizardStepTabsProps {
  currentStep: number;
  stepStatuses: StepStatus[];
  onStepClick: (stepIndex: number) => void;
  locale: string;
  completedCount: number;
}

export function WizardStepTabs({
  currentStep,
  stepStatuses,
  onStepClick,
  locale,
  completedCount,
}: WizardStepTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === 'ar';

  // Scroll to current step on mount and step change
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeTab = container.querySelector(`[data-step="${currentStep}"]`);
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentStep]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const scrollDirection = isRTL
      ? direction === 'left' ? scrollAmount : -scrollAmount
      : direction === 'left' ? -scrollAmount : scrollAmount;

    container.scrollBy({ left: scrollDirection, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent, stepIndex: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = isRTL ? stepIndex - 1 : stepIndex + 1;
      if (nextIndex >= 0 && nextIndex < STEPS.length) {
        onStepClick(nextIndex);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = isRTL ? stepIndex + 1 : stepIndex - 1;
      if (prevIndex >= 0 && prevIndex < STEPS.length) {
        onStepClick(prevIndex);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onStepClick(stepIndex);
    }
  };

  const progress = ((completedCount + 0.5) / STEPS.length) * 100;

  return (
    <div className="relative">
      {/* Scroll buttons for mobile */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 shadow-md rounded-full p-1 lg:hidden"
        aria-label={isRTL ? 'Scroll right' : 'Scroll left'}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 shadow-md rounded-full p-1 lg:hidden"
        aria-label={isRTL ? 'Scroll left' : 'Scroll right'}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Step tabs */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-2 px-8 lg:px-0"
        role="tablist"
        aria-label="Letter of Intent Steps"
      >
        {STEPS.map((step, index) => {
          const status = stepStatuses[index];
          const isCurrent = index === currentStep;
          const isCompleted = status === 'completed';
          const isPending = status === 'pending';

          return (
            <button
              key={step.id}
              data-step={index}
              role="tab"
              aria-selected={isCurrent}
              aria-controls={`step-panel-${step.id}`}
              tabIndex={isCurrent ? 0 : -1}
              onClick={() => onStepClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200',
                'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'min-w-[120px] justify-center',
                isCurrent && 'bg-primary-600 text-white shadow-md',
                isCompleted && !isCurrent && 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
                isPending && !isCurrent && 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              )}
            >
              {/* Step indicator */}
              <span
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                  isCurrent && 'bg-white text-primary-600',
                  isCompleted && !isCurrent && 'bg-primary-600 text-white',
                  isPending && !isCurrent && 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  index + 1
                )}
              </span>

              {/* Step label */}
              <span className="text-sm font-medium">
                {step.label[locale as 'en' | 'ar']}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        {isRTL
          ? `الخطوة ${currentStep + 1} من ${STEPS.length}`
          : `Step ${currentStep + 1} of ${STEPS.length}`}
        {completedCount > 0 && (
          <span className="ms-2 text-primary-600">
            ({completedCount} {isRTL ? 'مكتملة' : 'completed'})
          </span>
        )}
      </div>
    </div>
  );
}
