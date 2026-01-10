'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Check } from 'lucide-react';
import { Select } from '@/components/ui/select';
import {
  LEVEL_LABELS,
  FIELD_LABELS,
  type CurrentLevel,
  type TargetLevel,
  type FieldOfStudy,
  type MatcherProfileInput,
} from '@/lib/validations/matcher';

interface StepEducationProps {
  locale: string;
  data: Partial<MatcherProfileInput>;
  onDataChange: (data: Partial<MatcherProfileInput>) => void;
}

const CURRENT_LEVELS: CurrentLevel[] = ['HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD'];
const TARGET_LEVELS: TargetLevel[] = ['BACHELOR', 'MASTER', 'PHD'];
const FIELDS: FieldOfStudy[] = [
  'ENGINEERING',
  'MEDICINE',
  'BUSINESS',
  'ARTS',
  'SCIENCE',
  'LAW',
  'EDUCATION',
  'TECHNOLOGY',
];

export function StepEducation({ locale, data, onDataChange }: StepEducationProps) {
  const isRTL = locale === 'ar';

  const [currentLevel, setCurrentLevel] = useState<CurrentLevel>(
    (data.currentLevel as CurrentLevel) || 'HIGH_SCHOOL'
  );
  const [targetLevel, setTargetLevel] = useState<TargetLevel>(
    (data.targetLevel as TargetLevel) || 'BACHELOR'
  );
  const [selectedFields, setSelectedFields] = useState<FieldOfStudy[]>(
    (data.fieldsOfStudy as FieldOfStudy[]) || []
  );

  // Update parent on changes
  useEffect(() => {
    onDataChange({
      currentLevel,
      targetLevel,
      fieldsOfStudy: selectedFields,
    });
  }, [currentLevel, targetLevel, selectedFields, onDataChange]);

  // Level options
  const currentLevelOptions = CURRENT_LEVELS.map((level) => ({
    value: level,
    label: isRTL ? LEVEL_LABELS[level].ar : LEVEL_LABELS[level].en,
  }));

  const targetLevelOptions = TARGET_LEVELS.map((level) => ({
    value: level,
    label: isRTL ? LEVEL_LABELS[level].ar : LEVEL_LABELS[level].en,
  }));

  // Handle field selection
  const toggleField = (field: FieldOfStudy) => {
    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        return prev.filter((f) => f !== field);
      }
      if (prev.length >= 4) {
        // Max 4 fields
        return prev;
      }
      return [...prev, field];
    });
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isRTL ? 'مستواك التعليمي' : 'Your Education Level'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isRTL
            ? 'حدد مستواك الحالي والدرجة التي تريد الحصول عليها'
            : 'Select your current level and the degree you want to pursue'}
        </p>
      </div>

      {/* Current Level */}
      <Select
        label={isRTL ? 'المستوى التعليمي الحالي' : 'Current Education Level'}
        value={currentLevel}
        onChange={(e) => setCurrentLevel(e.target.value as CurrentLevel)}
        options={currentLevelOptions}
      />

      {/* Target Level */}
      <Select
        label={isRTL ? 'الدرجة المستهدفة' : 'Target Degree'}
        value={targetLevel}
        onChange={(e) => setTargetLevel(e.target.value as TargetLevel)}
        options={targetLevelOptions}
      />

      {/* Fields of Study */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {isRTL ? 'مجالات الدراسة المفضلة' : 'Preferred Fields of Study'}
          <span className="text-gray-500 text-xs ml-2">
            {isRTL ? `(${selectedFields.length}/4)` : `(${selectedFields.length}/4)`}
          </span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {isRTL
            ? 'اختر حتى 4 مجالات تهمك'
            : 'Select up to 4 fields you are interested in'}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {FIELDS.map((field) => {
            const isSelected = selectedFields.includes(field);
            return (
              <button
                key={field}
                type="button"
                onClick={() => toggleField(field)}
                className={`
                  p-3 rounded-lg border text-sm font-medium transition-all text-start
                  ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }
                  ${!isSelected && selectedFields.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={!isSelected && selectedFields.length >= 4}
              >
                <div className="flex items-center justify-between">
                  <span>{isRTL ? FIELD_LABELS[field].ar : FIELD_LABELS[field].en}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>

        {selectedFields.length === 0 && (
          <p className="text-xs text-red-500 mt-2">
            {isRTL ? 'يرجى اختيار مجال واحد على الأقل' : 'Please select at least one field'}
          </p>
        )}
      </div>
    </div>
  );
}
