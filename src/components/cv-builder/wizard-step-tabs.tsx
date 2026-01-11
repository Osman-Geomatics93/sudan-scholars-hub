'use client';

import { useRef, useEffect, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepStatus } from './use-step-completion';

interface Step {
  id: string;
  label: { en: string; ar: string };
}

interface WizardStepTabsProps {
  steps: Step[];
  currentStep: number;
  stepStatuses: StepStatus[];
  onStepClick: (stepIndex: number) => void;
  locale: string;
  disabled?: boolean;
}

export function WizardStepTabs({
  steps,
  currentStep,
  stepStatuses,
  onStepClick,
  locale,
  disabled = false,
}: WizardStepTabsProps) {
  const isRTL = locale === 'ar';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position for mobile arrows
  const updateScrollArrows = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const isScrollable = scrollWidth > clientWidth;

    if (isRTL) {
      setShowRightArrow(isScrollable && scrollLeft < 0);
      setShowLeftArrow(
        isScrollable && scrollLeft > -(scrollWidth - clientWidth)
      );
    } else {
      setShowLeftArrow(isScrollable && scrollLeft > 0);
      setShowRightArrow(
        isScrollable && scrollLeft < scrollWidth - clientWidth - 1
      );
    }
  };

  useEffect(() => {
    updateScrollArrows();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', updateScrollArrows);
    window.addEventListener('resize', updateScrollArrows);

    return () => {
      container?.removeEventListener('scroll', updateScrollArrows);
      window.removeEventListener('resize', updateScrollArrows);
    };
  }, [isRTL]);

  // Scroll active tab into view
  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeTab = container?.querySelector(
      `[data-step="${currentStep}"]`
    ) as HTMLElement;
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentStep]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 200;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent, stepIndex: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onStepClick(stepIndex);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = isRTL ? stepIndex - 1 : stepIndex + 1;
      if (nextIndex >= 0 && nextIndex < steps.length) {
        const nextTab = scrollContainerRef.current?.querySelector(
          `[data-step="${nextIndex}"]`
        ) as HTMLElement;
        nextTab?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = isRTL ? stepIndex + 1 : stepIndex - 1;
      if (prevIndex >= 0 && prevIndex < steps.length) {
        const prevTab = scrollContainerRef.current?.querySelector(
          `[data-step="${prevIndex}"]`
        ) as HTMLElement;
        prevTab?.focus();
      }
    }
  };

  return (
    <div className="relative mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left scroll arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white dark:bg-gray-800 shadow-md rounded-full border border-gray-200 dark:border-gray-700 lg:hidden"
          aria-label={isRTL ? 'تمرير لليسار' : 'Scroll left'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-2 px-8 lg:px-0 lg:flex-wrap lg:justify-center"
        role="tablist"
        aria-label={isRTL ? 'خطوات بناء السيرة الذاتية' : 'CV Builder Steps'}
      >
        {steps.map((step, index) => {
          const status = stepStatuses[index];
          const isCurrent = status === 'current';
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
              onClick={() => !disabled && onStepClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={disabled}
              className={cn(
                // Base styles
                'flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium',
                'transition-all duration-200 ease-in-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'whitespace-nowrap flex-shrink-0',
                // Current step
                isCurrent && [
                  'bg-primary-600 text-white shadow-md',
                  'dark:bg-primary-500',
                ],
                // Completed step
                isCompleted && [
                  'bg-primary-50 text-primary-700 hover:bg-primary-100',
                  'dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50',
                  'cursor-pointer',
                ],
                // Pending step
                isPending && [
                  'bg-gray-100 text-gray-500 hover:bg-gray-200',
                  'dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
                  'cursor-pointer',
                ],
                // Disabled
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Step indicator */}
              <span
                className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold',
                  'transition-all duration-200',
                  isCurrent && 'bg-white/20 text-white',
                  isCompleted && 'bg-primary-600 text-white dark:bg-primary-500',
                  isPending &&
                    'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                )}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
              </span>

              {/* Step label */}
              <span className="hidden sm:inline">
                {isRTL ? step.label.ar : step.label.en}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right scroll arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white dark:bg-gray-800 shadow-md rounded-full border border-gray-200 dark:border-gray-700 lg:hidden"
          aria-label={isRTL ? 'تمرير لليمين' : 'Scroll right'}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Progress bar - full width below tabs */}
      <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${((stepStatuses.filter((s) => s === 'completed').length + (stepStatuses.includes('current') ? 0.5 : 0)) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* Step counter */}
      <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        {isRTL
          ? `الخطوة ${currentStep + 1} من ${steps.length}`
          : `Step ${currentStep + 1} of ${steps.length}`}
      </div>
    </div>
  );
}
