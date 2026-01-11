'use client';

import { useState } from 'react';
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import type { CVWizardData, ResumeExperienceInput } from '@/lib/cv-builder/types';

interface StepExperienceProps {
  locale: string;
  data: CVWizardData;
  onDataChange: (data: Partial<CVWizardData>) => void;
}

const emptyExperience: ResumeExperienceInput = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

export function StepExperience({ locale, data, onDataChange }: StepExperienceProps) {
  const isRTL = locale === 'ar';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    data.experience.length > 0 ? 0 : null
  );

  const labels = {
    title: isRTL ? 'الخبرة المهنية' : 'Work Experience',
    subtitle: isRTL ? 'أضف خبراتك المهنية السابقة' : 'Add your professional experience',
    addExperience: isRTL ? 'إضافة خبرة' : 'Add Experience',
    company: isRTL ? 'الشركة' : 'Company',
    position: isRTL ? 'المنصب' : 'Position/Title',
    location: isRTL ? 'الموقع' : 'Location',
    startDate: isRTL ? 'تاريخ البدء' : 'Start Date',
    endDate: isRTL ? 'تاريخ الانتهاء' : 'End Date',
    current: isRTL ? 'أعمل هنا حالياً' : 'Currently working here',
    description: isRTL ? 'الوصف' : 'Description',
    descriptionHint: isRTL
      ? 'صف مسؤولياتك وإنجازاتك. استخدم النقاط عند الإمكان.'
      : 'Describe your responsibilities and achievements. Use bullet points when possible.',
    optional: isRTL ? '(اختياري)' : '(Optional)',
    remove: isRTL ? 'حذف' : 'Remove',
    noExperience: isRTL ? 'لم تتم إضافة أي خبرة بعد' : 'No experience added yet',
    skipNote: isRTL
      ? 'إذا لم تكن لديك خبرة مهنية، يمكنك تخطي هذه الخطوة'
      : 'If you have no work experience, you can skip this step',
  };

  const handleAddExperience = () => {
    const newExperience = [...data.experience, { ...emptyExperience }];
    onDataChange({ experience: newExperience });
    setExpandedIndex(newExperience.length - 1);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperience = data.experience.filter((_, i) => i !== index);
    onDataChange({ experience: newExperience });
    if (expandedIndex === index) {
      setExpandedIndex(newExperience.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdateExperience = (index: number, field: keyof ResumeExperienceInput, value: string | boolean) => {
    const newExperience = [...data.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onDataChange({ experience: newExperience });
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

      {data.experience.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{labels.noExperience}</p>
          <p className="text-sm mt-2">{labels.skipNote}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <Card key={index} className="overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {exp.position || (isRTL ? 'منصب جديد' : 'New Position')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {exp.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveExperience(index);
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
                      <Label>{labels.position} *</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
                        placeholder={isRTL ? 'مهندس برمجيات' : 'Software Engineer'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.company} *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                        placeholder={isRTL ? 'شركة المثال' : 'Example Company'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.location} {labels.optional}</Label>
                      <Input
                        value={exp.location || ''}
                        onChange={(e) => handleUpdateExperience(index, 'location', e.target.value)}
                        placeholder={isRTL ? 'الخرطوم، السودان' : 'City, Country'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.startDate} *</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.endDate}</Label>
                      <Input
                        type="month"
                        value={exp.endDate || ''}
                        onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`current-exp-${index}`}
                      checked={exp.current}
                      onCheckedChange={(checked) => handleUpdateExperience(index, 'current', !!checked)}
                    />
                    <Label htmlFor={`current-exp-${index}`} className="cursor-pointer">
                      {labels.current}
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.description} {labels.optional}</Label>
                    <Textarea
                      value={exp.description || ''}
                      onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                      placeholder={labels.descriptionHint}
                      rows={4}
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
        onClick={handleAddExperience}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        {labels.addExperience}
      </Button>
    </div>
  );
}
