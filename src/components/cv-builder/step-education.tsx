'use client';

import { useState } from 'react';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import type { CVWizardData, ResumeEducationInput } from '@/lib/cv-builder/types';

interface StepEducationProps {
  locale: string;
  data: CVWizardData;
  onDataChange: (data: Partial<CVWizardData>) => void;
}

const emptyEducation: ResumeEducationInput = {
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  gpa: '',
  achievements: '',
};

export function StepEducation({ locale, data, onDataChange }: StepEducationProps) {
  const isRTL = locale === 'ar';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    data.education.length > 0 ? 0 : null
  );

  const labels = {
    title: isRTL ? 'التعليم' : 'Education',
    subtitle: isRTL ? 'أضف خلفيتك التعليمية' : 'Add your educational background',
    addEducation: isRTL ? 'إضافة تعليم' : 'Add Education',
    institution: isRTL ? 'المؤسسة التعليمية' : 'Institution',
    degree: isRTL ? 'الدرجة العلمية' : 'Degree',
    field: isRTL ? 'مجال الدراسة' : 'Field of Study',
    location: isRTL ? 'الموقع' : 'Location',
    startDate: isRTL ? 'تاريخ البدء' : 'Start Date',
    endDate: isRTL ? 'تاريخ الانتهاء' : 'End Date',
    current: isRTL ? 'أدرس حالياً' : 'Currently studying here',
    gpa: isRTL ? 'المعدل' : 'GPA',
    achievements: isRTL ? 'الإنجازات' : 'Achievements/Activities',
    optional: isRTL ? '(اختياري)' : '(Optional)',
    remove: isRTL ? 'حذف' : 'Remove',
    noEducation: isRTL ? 'لم تتم إضافة أي تعليم بعد' : 'No education added yet',
  };

  const handleAddEducation = () => {
    const newEducation = [...data.education, { ...emptyEducation }];
    onDataChange({ education: newEducation });
    setExpandedIndex(newEducation.length - 1);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = data.education.filter((_, i) => i !== index);
    onDataChange({ education: newEducation });
    if (expandedIndex === index) {
      setExpandedIndex(newEducation.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdateEducation = (index: number, field: keyof ResumeEducationInput, value: string | boolean) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onDataChange({ education: newEducation });
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

      {data.education.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{labels.noEducation}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <Card key={index} className="overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {edu.institution || (isRTL ? 'مؤسسة جديدة' : 'New Institution')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveEducation(index);
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
                      <Label>{labels.institution} *</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                        placeholder={isRTL ? 'جامعة الخرطوم' : 'University of Example'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.degree} *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                        placeholder={isRTL ? 'بكالوريوس' : "Bachelor's"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.field} *</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => handleUpdateEducation(index, 'field', e.target.value)}
                        placeholder={isRTL ? 'علوم الحاسوب' : 'Computer Science'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.location} {labels.optional}</Label>
                      <Input
                        value={edu.location || ''}
                        onChange={(e) => handleUpdateEducation(index, 'location', e.target.value)}
                        placeholder={isRTL ? 'الخرطوم، السودان' : 'City, Country'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.startDate} *</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => handleUpdateEducation(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.endDate}</Label>
                      <Input
                        type="month"
                        value={edu.endDate || ''}
                        onChange={(e) => handleUpdateEducation(index, 'endDate', e.target.value)}
                        disabled={edu.current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`current-${index}`}
                      checked={edu.current}
                      onCheckedChange={(checked) => handleUpdateEducation(index, 'current', !!checked)}
                    />
                    <Label htmlFor={`current-${index}`} className="cursor-pointer">
                      {labels.current}
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.gpa} {labels.optional}</Label>
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) => handleUpdateEducation(index, 'gpa', e.target.value)}
                      placeholder="3.8/4.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.achievements} {labels.optional}</Label>
                    <Textarea
                      value={edu.achievements || ''}
                      onChange={(e) => handleUpdateEducation(index, 'achievements', e.target.value)}
                      placeholder={isRTL ? 'الأنشطة، الجوائز، المشاريع...' : 'Activities, awards, projects...'}
                      rows={3}
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
        onClick={handleAddEducation}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        {labels.addEducation}
      </Button>
    </div>
  );
}
