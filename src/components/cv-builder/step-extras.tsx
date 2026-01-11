'use client';

import { useState } from 'react';
import { Award, Sparkles, Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { CVWizardData, ResumeCertificationInput } from '@/lib/cv-builder/types';

interface StepExtrasProps {
  locale: string;
  data: CVWizardData;
  onDataChange: (data: Partial<CVWizardData>) => void;
}

const emptyCertification: ResumeCertificationInput = {
  name: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  url: '',
};

export function StepExtras({ locale, data, onDataChange }: StepExtrasProps) {
  const isRTL = locale === 'ar';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const labels = {
    title: isRTL ? 'معلومات إضافية' : 'Additional Information',
    subtitle: isRTL ? 'أضف الشهادات والملخص المهني' : 'Add certifications and professional summary',
    certifications: isRTL ? 'الشهادات' : 'Certifications',
    addCertification: isRTL ? 'إضافة شهادة' : 'Add Certification',
    certName: isRTL ? 'اسم الشهادة' : 'Certification Name',
    issuer: isRTL ? 'الجهة المانحة' : 'Issuing Organization',
    issueDate: isRTL ? 'تاريخ الإصدار' : 'Issue Date',
    expiryDate: isRTL ? 'تاريخ الانتهاء' : 'Expiry Date',
    credentialId: isRTL ? 'رقم الشهادة' : 'Credential ID',
    credentialUrl: isRTL ? 'رابط التحقق' : 'Credential URL',
    optional: isRTL ? '(اختياري)' : '(Optional)',
    noCertifications: isRTL ? 'لم تتم إضافة شهادات' : 'No certifications added',
    summary: isRTL ? 'الملخص المهني' : 'Professional Summary',
    summaryPlaceholder: isRTL
      ? 'اكتب ملخصاً موجزاً عن خبراتك ومهاراتك ومؤهلاتك...'
      : 'Write a brief summary of your experience, skills, and qualifications...',
    generateWithAI: isRTL ? 'إنشاء بالذكاء الاصطناعي' : 'Generate with AI',
    generatingSummary: isRTL ? 'جاري الإنشاء...' : 'Generating...',
    summaryTip: isRTL
      ? 'نصيحة: يمكنك استخدام الذكاء الاصطناعي لإنشاء ملخص مهني بناءً على تعليمك وخبراتك.'
      : 'Tip: You can use AI to generate a professional summary based on your education and experience.',
    needDataError: isRTL
      ? 'يرجى إضافة التعليم أو الخبرة المهنية أولاً لإنشاء الملخص'
      : 'Please add education or experience first to generate a summary',
    aiError: isRTL
      ? 'فشل في إنشاء الملخص. يرجى المحاولة مرة أخرى.'
      : 'Failed to generate summary. Please try again.',
  };

  const handleAddCertification = () => {
    const newCertifications = [...data.certifications, { ...emptyCertification }];
    onDataChange({ certifications: newCertifications });
    setExpandedIndex(newCertifications.length - 1);
  };

  const handleRemoveCertification = (index: number) => {
    const newCertifications = data.certifications.filter((_, i) => i !== index);
    onDataChange({ certifications: newCertifications });
    if (expandedIndex === index) {
      setExpandedIndex(newCertifications.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdateCertification = (index: number, field: keyof ResumeCertificationInput, value: string) => {
    const newCertifications = [...data.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    onDataChange({ certifications: newCertifications });
  };

  const handleGenerateSummary = async () => {
    setSummaryError(null);

    // Check if there's enough data before making the API call
    if ((!data.education || data.education.length === 0) && (!data.experience || data.experience.length === 0)) {
      setSummaryError(labels.needDataError);
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/cv-builder/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          education: data.education,
          experience: data.experience,
          skills: data.skills,
          language: locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const result = await response.json();
      onDataChange({ summary: result.summary });
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryError(error instanceof Error && error.message.includes('education or experience')
        ? labels.needDataError
        : labels.aiError);
    } finally {
      setIsGeneratingSummary(false);
    }
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

      {/* Professional Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-gray-900 dark:text-white">{labels.summary}</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="gap-2"
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {labels.generatingSummary}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {labels.generateWithAI}
              </>
            )}
          </Button>
        </div>
        <Textarea
          value={data.summary || ''}
          onChange={(e) => {
            onDataChange({ summary: e.target.value });
            if (summaryError) setSummaryError(null);
          }}
          placeholder={labels.summaryPlaceholder}
          rows={4}
        />
        {summaryError && (
          <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
            {summaryError}
          </p>
        )}
        <p className="text-xs text-gray-500">{labels.summaryTip}</p>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Certifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-gray-900 dark:text-white">{labels.certifications}</h3>
        </div>

        {data.certifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Award className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{labels.noCertifications}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.certifications.map((cert, index) => (
              <Card key={index} className="overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">
                        {cert.name || (isRTL ? 'شهادة جديدة' : 'New Certification')}
                      </p>
                      <p className="text-sm text-gray-500">{cert.issuer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCertification(index);
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
                        <Label>{labels.certName} *</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => handleUpdateCertification(index, 'name', e.target.value)}
                          placeholder={isRTL ? 'AWS Solutions Architect' : 'AWS Solutions Architect'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{labels.issuer} *</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => handleUpdateCertification(index, 'issuer', e.target.value)}
                          placeholder={isRTL ? 'Amazon Web Services' : 'Amazon Web Services'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{labels.issueDate} {labels.optional}</Label>
                        <Input
                          type="month"
                          value={cert.issueDate || ''}
                          onChange={(e) => handleUpdateCertification(index, 'issueDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{labels.expiryDate} {labels.optional}</Label>
                        <Input
                          type="month"
                          value={cert.expiryDate || ''}
                          onChange={(e) => handleUpdateCertification(index, 'expiryDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{labels.credentialId} {labels.optional}</Label>
                        <Input
                          value={cert.credentialId || ''}
                          onChange={(e) => handleUpdateCertification(index, 'credentialId', e.target.value)}
                          placeholder="ABC123XYZ"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{labels.credentialUrl} {labels.optional}</Label>
                        <Input
                          type="url"
                          value={cert.url || ''}
                          onChange={(e) => handleUpdateCertification(index, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          onClick={handleAddCertification}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          {labels.addCertification}
        </Button>
      </div>
    </div>
  );
}
