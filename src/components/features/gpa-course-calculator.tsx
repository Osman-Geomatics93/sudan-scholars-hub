'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SimpleSelect as Select } from '@/components/ui/select';
import {
  Course,
  calculateWeightedGPA,
  LETTER_GRADES,
  GPA_SYSTEMS,
  GPASystem,
  toPercentage,
  fromPercentage,
  formatGPAValue,
} from '@/lib/gpa-utils';

interface GPACourseCalculatorProps {
  locale: string;
  onGPAChange?: (percent: number) => void;
}

export function GPACourseCalculator({ locale, onGPAChange }: GPACourseCalculatorProps) {
  const isRTL = locale === 'ar';

  const [courses, setCourses] = useState<Course[]>([
    { id: crypto.randomUUID(), name: '', credits: 3, grade: 'A' },
  ]);
  const [targetSystem, setTargetSystem] = useState<GPASystem>('us-4.0');
  const [result, setResult] = useState<{ gpa: number; totalCredits: number; percent: number } | null>(null);

  // Letter grade options
  const gradeOptions = Object.keys(LETTER_GRADES).map((grade) => ({
    value: grade,
    label: grade,
  }));

  // Target system options (exclude letter and uk for output)
  const systemOptions = GPA_SYSTEMS
    .filter((s) => !s.isDiscrete)
    .map((system) => ({
      value: system.id,
      label: isRTL ? system.name.ar : system.name.en,
    }));

  // Credit options (1-6)
  const creditOptions = [1, 2, 3, 4, 5, 6].map((num) => ({
    value: String(num),
    label: String(num),
  }));

  // Add new course
  const addCourse = () => {
    setCourses([
      ...courses,
      { id: crypto.randomUUID(), name: '', credits: 3, grade: 'A' },
    ]);
  };

  // Remove course
  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  // Update course
  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  // Calculate GPA
  useEffect(() => {
    const validCourses = courses.filter((c) => c.grade && c.credits > 0);
    if (validCourses.length === 0) {
      setResult(null);
      return;
    }

    const calculated = calculateWeightedGPA(validCourses, targetSystem);
    setResult(calculated);

    if (onGPAChange && calculated.percent > 0) {
      onGPAChange(calculated.percent);
    }
  }, [courses, targetSystem, onGPAChange]);

  // Get equivalent values
  const getEquivalents = () => {
    if (!result) return [];

    return GPA_SYSTEMS
      .filter((s) => s.id !== targetSystem)
      .slice(0, 4)
      .map((system) => ({
        name: isRTL ? system.name.ar : system.name.en,
        value: formatGPAValue(fromPercentage(result.percent, system.id), system.id),
      }));
  };

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              {isRTL ? 'حاسبة المعدل من المواد' : 'Calculate GPA from Courses'}
            </CardTitle>

            <Select
              label=""
              value={targetSystem}
              onChange={(e) => setTargetSystem(e.target.value as GPASystem)}
              options={systemOptions}
              className="w-48"
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Course List */}
          <div className="space-y-4">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-[1fr,100px,120px,48px] gap-3 text-sm font-medium text-gray-600 dark:text-gray-400 px-1">
              <span>{isRTL ? 'اسم المادة' : 'Course Name'}</span>
              <span>{isRTL ? 'الساعات' : 'Credits'}</span>
              <span>{isRTL ? 'الدرجة' : 'Grade'}</span>
              <span></span>
            </div>

            {/* Course Rows */}
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="grid grid-cols-1 md:grid-cols-[1fr,100px,120px,48px] gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <Input
                  placeholder={isRTL ? `المادة ${index + 1}` : `Course ${index + 1}`}
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  className="md:col-span-1"
                />

                <Select
                  label=""
                  value={String(course.credits)}
                  onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value))}
                  options={creditOptions}
                />

                <Select
                  label=""
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  options={gradeOptions}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length === 1}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {/* Add Course Button */}
            <Button
              variant="outline"
              onClick={addCourse}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 me-2" />
              {isRTL ? 'إضافة مادة' : 'Add Course'}
            </Button>
          </div>

          {/* Results */}
          {result && result.totalCredits > 0 && (
            <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Main Result */}
                <div className="text-center md:text-start">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {isRTL ? 'المعدل المحسوب' : 'Calculated GPA'}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {formatGPAValue(result.gpa, targetSystem)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {isRTL ? `إجمالي الساعات: ${result.totalCredits}` : `Total Credits: ${result.totalCredits}`}
                  </p>
                </div>

                {/* Percentage */}
                <div className="text-center md:text-start">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {isRTL ? 'النسبة المئوية' : 'Percentage'}
                  </p>
                  <p className="text-3xl font-bold text-secondary">
                    {result.percent}%
                  </p>
                </div>
              </div>

              {/* Equivalents */}
              <div className="mt-4 pt-4 border-t border-primary/20">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {isRTL ? 'المعادل في أنظمة أخرى:' : 'Equivalent in other systems:'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {getEquivalents().map((eq, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm border border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-gray-500 dark:text-gray-400">{eq.name}:</span>{' '}
                      <span className="font-semibold">{eq.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!result || result.totalCredits === 0) && (
            <div className="mt-6 p-8 text-center text-gray-500 dark:text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? 'أضف مواد لحساب المعدل' : 'Add courses to calculate GPA'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
