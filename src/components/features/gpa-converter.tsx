'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeftRight, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  GPA_SYSTEMS,
  GPASystem,
  convertGPA,
  toPercentage,
  formatGPAValue,
  LETTER_GRADES,
  UK_GRADES,
  REFERENCE_TABLE,
} from '@/lib/gpa-utils';
import { validateGPAInput } from '@/lib/validations/gpa';

interface GPAConverterProps {
  locale: string;
  onGPAChange?: (percent: number) => void;
}

export function GPAConverter({ locale, onGPAChange }: GPAConverterProps) {
  const isRTL = locale === 'ar';

  const [fromSystem, setFromSystem] = useState<GPASystem>('percentage');
  const [toSystem, setToSystem] = useState<GPASystem>('us-4.0');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showTable, setShowTable] = useState(false);

  // Get system config
  const getSystemConfig = (id: GPASystem) => GPA_SYSTEMS.find((s) => s.id === id);

  // System options for select
  const systemOptions = GPA_SYSTEMS.map((system) => ({
    value: system.id,
    label: isRTL ? system.name.ar : system.name.en,
  }));

  // Grade options for letter/UK systems
  const letterOptions = Object.keys(LETTER_GRADES).map((grade) => ({
    value: grade,
    label: grade,
  }));

  const ukOptions = Object.keys(UK_GRADES).map((grade) => ({
    value: grade,
    label: grade,
  }));

  // Handle conversion
  const handleConvert = useCallback(() => {
    if (!inputValue) {
      setResult('');
      setError('');
      return;
    }

    // Validate input
    const validation = validateGPAInput(inputValue, fromSystem);
    if (!validation.valid) {
      setError(validation.error || 'Invalid input');
      setResult('');
      return;
    }

    setError('');

    // Convert
    const value = fromSystem === 'letter' || fromSystem === 'uk' ? inputValue : parseFloat(inputValue);
    const converted = convertGPA(value, fromSystem, toSystem);
    setResult(formatGPAValue(converted, toSystem));

    // Notify parent of percentage value
    if (onGPAChange) {
      const percent = toPercentage(value, fromSystem);
      onGPAChange(percent);
    }
  }, [inputValue, fromSystem, toSystem, onGPAChange]);

  // Auto-convert on input/system change
  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  // Swap systems
  const handleSwap = () => {
    setFromSystem(toSystem);
    setToSystem(fromSystem);
    setInputValue('');
    setResult('');
    setError('');
  };

  // Get input placeholder
  const getPlaceholder = (system: GPASystem) => {
    const config = getSystemConfig(system);
    if (config?.isDiscrete) return '';
    return isRTL
      ? `أدخل القيمة (${config?.min} - ${config?.max})`
      : `Enter value (${config?.min} - ${config?.max})`;
  };

  const fromConfig = getSystemConfig(fromSystem);
  const toConfig = getSystemConfig(toSystem);

  return (
    <div className="space-y-6">
      {/* Converter Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
            {isRTL ? 'محول المعدل' : 'GPA Converter'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
            {/* From Section */}
            <div className="space-y-3">
              <Select
                label={isRTL ? 'من نظام' : 'From System'}
                value={fromSystem}
                onChange={(e) => {
                  setFromSystem(e.target.value as GPASystem);
                  setInputValue('');
                  setResult('');
                }}
                options={systemOptions}
              />

              {fromConfig?.isDiscrete ? (
                <Select
                  label={isRTL ? 'اختر الدرجة' : 'Select Grade'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  options={fromSystem === 'letter' ? letterOptions : ukOptions}
                />
              ) : (
                <Input
                  type="number"
                  step="0.1"
                  label={isRTL ? 'أدخل القيمة' : 'Enter Value'}
                  placeholder={getPlaceholder(fromSystem)}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  error={error}
                />
              )}
            </div>

            {/* Arrow / Swap Button */}
            <div className="flex justify-center py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                className="rounded-full p-2"
                title={isRTL ? 'تبديل' : 'Swap'}
              >
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* To Section */}
            <div className="space-y-3">
              <Select
                label={isRTL ? 'إلى نظام' : 'To System'}
                value={toSystem}
                onChange={(e) => setToSystem(e.target.value as GPASystem)}
                options={systemOptions}
              />

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isRTL ? 'النتيجة' : 'Result'}
                </label>
                <div className="px-4 py-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg text-lg font-semibold text-primary min-h-[48px] flex items-center">
                  {result || (isRTL ? 'أدخل قيمة للتحويل' : 'Enter a value to convert')}
                </div>
              </div>
            </div>
          </div>

          {/* System descriptions */}
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{isRTL ? fromConfig?.description.ar : fromConfig?.description.en}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{isRTL ? toConfig?.description.ar : toConfig?.description.en}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Table Toggle */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => setShowTable(!showTable)}
          className="text-primary hover:text-primary/80"
        >
          {showTable
            ? (isRTL ? 'إخفاء جدول المرجع' : 'Hide Reference Table')
            : (isRTL ? 'عرض جدول المرجع السريع' : 'Show Quick Reference Table')}
        </Button>
      </div>

      {/* Reference Table */}
      {showTable && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isRTL ? 'جدول المرجع السريع' : 'Quick Reference Table'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-3 py-2 text-start font-semibold">4.0 GPA</th>
                    <th className="px-3 py-2 text-start font-semibold">{isRTL ? 'النسبة' : 'Percent'}</th>
                    <th className="px-3 py-2 text-start font-semibold">{isRTL ? 'الحرف' : 'Letter'}</th>
                    <th className="px-3 py-2 text-start font-semibold">UK</th>
                    <th className="px-3 py-2 text-start font-semibold">{isRTL ? 'ألماني' : 'German'}</th>
                    <th className="px-3 py-2 text-start font-semibold">{isRTL ? 'فرنسي' : 'French'}</th>
                  </tr>
                </thead>
                <tbody>
                  {REFERENCE_TABLE.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b dark:border-gray-700 ${
                        idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                      }`}
                    >
                      <td className="px-3 py-2">{row.gpa40}</td>
                      <td className="px-3 py-2">{row.percent}%</td>
                      <td className="px-3 py-2">{row.letter}</td>
                      <td className="px-3 py-2">{row.uk}</td>
                      <td className="px-3 py-2">{row.german}</td>
                      <td className="px-3 py-2">{row.french}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
