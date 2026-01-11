'use client';

import { useState } from 'react';
import { Check, Palette, Layout } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { CVWizardData, TemplateType } from '@/lib/cv-builder/types';

interface StepTemplateProps {
  locale: string;
  data: CVWizardData;
  onDataChange: (data: Partial<CVWizardData>) => void;
}

const templates: Array<{
  id: TemplateType;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  preview: string;
}> = [
  {
    id: 'modern',
    nameEn: 'Modern',
    nameAr: 'حديث',
    descEn: 'Two-column layout with a colored sidebar. Great for tech and creative roles.',
    descAr: 'تخطيط من عمودين مع شريط جانبي ملون. مثالي للأدوار التقنية والإبداعية.',
    preview: '/images/cv-templates/modern-preview.png',
  },
  {
    id: 'classic',
    nameEn: 'Classic',
    nameAr: 'كلاسيكي',
    descEn: 'Traditional single-column format. Perfect for academic and corporate applications.',
    descAr: 'تنسيق تقليدي من عمود واحد. مثالي للتطبيقات الأكاديمية والشركات.',
    preview: '/images/cv-templates/classic-preview.png',
  },
  {
    id: 'minimal',
    nameEn: 'Minimal',
    nameAr: 'بسيط',
    descEn: 'Clean and simple design. Maximum ATS compatibility.',
    descAr: 'تصميم نظيف وبسيط. أقصى توافق مع أنظمة تتبع المتقدمين.',
    preview: '/images/cv-templates/minimal-preview.png',
  },
];

const colorPresets = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#059669' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Teal', value: '#0d9488' },
];

export function StepTemplate({ locale, data, onDataChange }: StepTemplateProps) {
  const isRTL = locale === 'ar';
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(data.template);
  const [selectedColor, setSelectedColor] = useState(data.primaryColor);

  const labels = {
    title: isRTL ? 'اختر القالب' : 'Choose Template',
    subtitle: isRTL ? 'اختر تصميم سيرتك الذاتية وخصص الألوان' : 'Select your resume design and customize colors',
    selectTemplate: isRTL ? 'اختر القالب' : 'Select Template',
    customizeColor: isRTL ? 'تخصيص اللون' : 'Customize Color',
    primaryColor: isRTL ? 'اللون الأساسي' : 'Primary Color',
    preview: isRTL ? 'معاينة' : 'Preview',
    selected: isRTL ? 'محدد' : 'Selected',
  };

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    onDataChange({ template: templateId });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onDataChange({ primaryColor: color });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {labels.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {labels.subtitle}
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-gray-900 dark:text-white">{labels.selectTemplate}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-gray-400'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardContent className="p-4">
                {/* Template Preview Placeholder */}
                <div
                  className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: template.id === 'modern'
                      ? `linear-gradient(to right, ${selectedColor} 35%, #f3f4f6 35%)`
                      : template.id === 'classic'
                      ? '#ffffff'
                      : '#f9fafb',
                  }}
                >
                  {/* Simple template representation */}
                  <div className="absolute inset-2 flex flex-col">
                    {template.id === 'modern' && (
                      <>
                        <div
                          className="w-1/3 h-full absolute left-0 top-0 flex flex-col p-2"
                          style={{ backgroundColor: selectedColor }}
                        >
                          <div className="w-8 h-8 rounded-full bg-white/30 mb-2" />
                          <div className="h-2 bg-white/40 rounded w-3/4 mb-1" />
                          <div className="h-1 bg-white/30 rounded w-1/2 mb-3" />
                          <div className="h-1 bg-white/20 rounded w-full mb-1" />
                          <div className="h-1 bg-white/20 rounded w-full mb-1" />
                        </div>
                        <div className="ml-[35%] p-2">
                          <div className="h-2 bg-gray-300 rounded w-1/2 mb-2" />
                          <div className="h-1 bg-gray-200 rounded w-full mb-1" />
                          <div className="h-1 bg-gray-200 rounded w-3/4 mb-3" />
                          <div className="h-2 bg-gray-300 rounded w-1/3 mb-2" />
                          <div className="h-1 bg-gray-200 rounded w-full" />
                        </div>
                      </>
                    )}
                    {template.id === 'classic' && (
                      <div className="p-2 border border-gray-300 rounded h-full">
                        <div className="text-center border-b border-gray-300 pb-2 mb-2">
                          <div className="h-2 bg-gray-400 rounded w-1/2 mx-auto mb-1" />
                          <div className="h-1 bg-gray-300 rounded w-1/3 mx-auto" />
                        </div>
                        <div className="h-2 bg-gray-400 rounded w-1/4 mb-1" />
                        <div className="h-1 bg-gray-200 rounded w-full mb-1" />
                        <div className="h-1 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-gray-400 rounded w-1/4 mb-1" />
                        <div className="h-1 bg-gray-200 rounded w-full" />
                      </div>
                    )}
                    {template.id === 'minimal' && (
                      <div className="p-2 h-full">
                        <div className="h-3 bg-gray-400 rounded w-1/3 mb-2" />
                        <div className="h-1 bg-gray-300 rounded w-1/2 mb-4" />
                        <div className="border-t border-gray-300 pt-2">
                          <div className="h-1 bg-gray-300 rounded w-1/4 mb-1" />
                          <div className="h-1 bg-gray-200 rounded w-full mb-1" />
                          <div className="h-1 bg-gray-200 rounded w-3/4" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <h4 className="font-medium text-gray-900 dark:text-white">
                  {isRTL ? template.nameAr : template.nameEn}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {isRTL ? template.descAr : template.descEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Color Customization */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-gray-900 dark:text-white">{labels.customizeColor}</h3>
        </div>

        <div className="space-y-3">
          <Label>{labels.primaryColor}</Label>
          <div className="flex items-center gap-3 flex-wrap">
            {colorPresets.map((color) => (
              <button
                key={color.value}
                className={`w-8 h-8 rounded-full transition-all ${
                  selectedColor === color.value
                    ? 'ring-2 ring-offset-2 ring-gray-400'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(color.value)}
                title={color.name}
              />
            ))}
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-8 p-0 border-0 cursor-pointer"
              />
              <Input
                type="text"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-24"
                placeholder="#2563eb"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary of selections */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          {isRTL ? 'ملخص السيرة الذاتية' : 'Resume Summary'}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">{isRTL ? 'الاسم:' : 'Name:'}</span>
            <span className="ml-2 font-medium">{data.personal.fullName || '-'}</span>
          </div>
          <div>
            <span className="text-gray-500">{isRTL ? 'البريد:' : 'Email:'}</span>
            <span className="ml-2 font-medium">{data.personal.email || '-'}</span>
          </div>
          <div>
            <span className="text-gray-500">{isRTL ? 'التعليم:' : 'Education:'}</span>
            <span className="ml-2 font-medium">{data.education.length} {isRTL ? 'إدخالات' : 'entries'}</span>
          </div>
          <div>
            <span className="text-gray-500">{isRTL ? 'الخبرة:' : 'Experience:'}</span>
            <span className="ml-2 font-medium">{data.experience.length} {isRTL ? 'إدخالات' : 'entries'}</span>
          </div>
          <div>
            <span className="text-gray-500">{isRTL ? 'المهارات:' : 'Skills:'}</span>
            <span className="ml-2 font-medium">{data.skills.length} {isRTL ? 'مهارات' : 'skills'}</span>
          </div>
          <div>
            <span className="text-gray-500">{isRTL ? 'اللغات:' : 'Languages:'}</span>
            <span className="ml-2 font-medium">{data.languages.length} {isRTL ? 'لغات' : 'languages'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
