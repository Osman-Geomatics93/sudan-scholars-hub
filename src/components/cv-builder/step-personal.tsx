'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resumePersonalSchema, type ResumePersonalInput } from '@/lib/validations/cv-builder';
import type { CVWizardData } from '@/lib/cv-builder/types';

interface StepPersonalProps {
  locale: string;
  data: CVWizardData;
  onDataChange: (data: Partial<CVWizardData>) => void;
}

export function StepPersonal({ locale, data, onDataChange }: StepPersonalProps) {
  const isRTL = locale === 'ar';

  const {
    register,
    formState: { errors },
    watch,
  } = useForm<ResumePersonalInput>({
    resolver: zodResolver(resumePersonalSchema),
    defaultValues: data.personal,
    mode: 'onChange',
  });

  // Watch all fields and update parent
  const watchedValues = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onDataChange({ personal: watchedValues });
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedValues, onDataChange]);

  const labels = {
    title: isRTL ? 'المعلومات الشخصية' : 'Personal Information',
    subtitle: isRTL ? 'أدخل معلومات الاتصال الخاصة بك' : 'Enter your contact information',
    fullName: isRTL ? 'الاسم الكامل' : 'Full Name',
    email: isRTL ? 'البريد الإلكتروني' : 'Email Address',
    phone: isRTL ? 'رقم الهاتف' : 'Phone Number',
    location: isRTL ? 'الموقع' : 'Location',
    linkedIn: isRTL ? 'رابط لينكد إن' : 'LinkedIn URL',
    website: isRTL ? 'الموقع الإلكتروني' : 'Website/Portfolio',
    optional: isRTL ? '(اختياري)' : '(Optional)',
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

      <div className="grid gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {labels.fullName} *
          </Label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder={isRTL ? 'أحمد محمد' : 'John Doe'}
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {labels.email} *
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="email@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {labels.phone} {labels.optional}
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="+1 234 567 8900"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {labels.location} {labels.optional}
          </Label>
          <Input
            id="location"
            {...register('location')}
            placeholder={isRTL ? 'الخرطوم، السودان' : 'City, Country'}
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedIn" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            {labels.linkedIn} {labels.optional}
          </Label>
          <Input
            id="linkedIn"
            type="url"
            {...register('linkedIn')}
            placeholder="https://linkedin.com/in/yourprofile"
            className={errors.linkedIn ? 'border-red-500' : ''}
          />
          {errors.linkedIn && (
            <p className="text-sm text-red-500">{errors.linkedIn.message}</p>
          )}
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {labels.website} {labels.optional}
          </Label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            placeholder="https://yourwebsite.com"
            className={errors.website ? 'border-red-500' : ''}
          />
          {errors.website && (
            <p className="text-sm text-red-500">{errors.website.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
