'use client';

import { useState } from 'react';
import { Trophy, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { CVWizardData, ResumeAwardInput } from '@/lib/cv-builder/types';

interface StepAwardsProps {
  locale: string;
  data: CVWizardData;
  onDataChange: (data: Partial<CVWizardData>) => void;
}

const emptyAward: ResumeAwardInput = {
  title: '',
  issuer: '',
  date: '',
  description: '',
};

export function StepAwards({ locale, data, onDataChange }: StepAwardsProps) {
  const isRTL = locale === 'ar';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    data.awards.length > 0 ? 0 : null
  );

  const labels = {
    title: isRTL ? 'الجوائز والإنجازات' : 'Awards & Honors',
    subtitle: isRTL ? 'أضف جوائزك وإنجازاتك الأكاديمية والمهنية' : 'Add your academic and professional achievements',
    addAward: isRTL ? 'إضافة جائزة' : 'Add Award',
    awardTitle: isRTL ? 'اسم الجائزة' : 'Award Title',
    issuer: isRTL ? 'الجهة المانحة' : 'Issuing Organization',
    date: isRTL ? 'تاريخ الحصول' : 'Date Received',
    description: isRTL ? 'الوصف' : 'Description',
    optional: isRTL ? '(اختياري)' : '(Optional)',
    remove: isRTL ? 'حذف' : 'Remove',
    noAwards: isRTL ? 'لم تتم إضافة أي جوائز بعد' : 'No awards added yet',
    titlePlaceholder: isRTL ? 'جائزة التميز الأكاديمي' : 'Academic Excellence Award',
    issuerPlaceholder: isRTL ? 'جامعة الخرطوم' : 'University of Example',
    descriptionPlaceholder: isRTL
      ? 'وصف مختصر للجائزة والسبب في الحصول عليها...'
      : 'Brief description of the award and why you received it...',
  };

  const handleAddAward = () => {
    const newAwards = [...data.awards, { ...emptyAward }];
    onDataChange({ awards: newAwards });
    setExpandedIndex(newAwards.length - 1);
  };

  const handleRemoveAward = (index: number) => {
    const newAwards = data.awards.filter((_, i) => i !== index);
    onDataChange({ awards: newAwards });
    if (expandedIndex === index) {
      setExpandedIndex(newAwards.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdateAward = (index: number, field: keyof ResumeAwardInput, value: string) => {
    const newAwards = [...data.awards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    onDataChange({ awards: newAwards });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {labels.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {labels.subtitle}
        </p>
      </div>

      {data.awards.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{labels.noAwards}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.awards.map((award, index) => (
            <Card key={index} className="overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">
                      {award.title || (isRTL ? 'جائزة جديدة' : 'New Award')}
                    </p>
                    {award.issuer && (
                      <p className="text-sm text-gray-500">{award.issuer}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAward(index);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {expandedIndex === index && (
                <CardContent className="pt-0 pb-4 px-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{labels.awardTitle} *</Label>
                      <Input
                        value={award.title}
                        onChange={(e) => handleUpdateAward(index, 'title', e.target.value)}
                        placeholder={labels.titlePlaceholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.issuer} *</Label>
                      <Input
                        value={award.issuer}
                        onChange={(e) => handleUpdateAward(index, 'issuer', e.target.value)}
                        placeholder={labels.issuerPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{labels.date} {labels.optional}</Label>
                    <Input
                      type="month"
                      value={award.date || ''}
                      onChange={(e) => handleUpdateAward(index, 'date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{labels.description} {labels.optional}</Label>
                    <Textarea
                      value={award.description || ''}
                      onChange={(e) => handleUpdateAward(index, 'description', e.target.value)}
                      placeholder={labels.descriptionPlaceholder}
                      rows={2}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        onClick={handleAddAward}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        {labels.addAward}
      </Button>
    </div>
  );
}
