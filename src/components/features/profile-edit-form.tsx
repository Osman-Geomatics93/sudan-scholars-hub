'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Upload,
  X,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  website?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  educationLevel: string | null;
  fieldOfStudy: string | null;
  socialLinks: SocialLinks | null;
  profileImage: string | null;
  googleImage: string | null;
}

interface ProfileEditFormProps {
  user: UserProfile;
  locale: string;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const EDUCATION_LEVELS = ['HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD'] as const;
const FIELDS_OF_STUDY = [
  'ENGINEERING',
  'MEDICINE',
  'BUSINESS',
  'ARTS',
  'SCIENCE',
  'LAW',
  'EDUCATION',
  'TECHNOLOGY',
] as const;

export function ProfileEditForm({ user, locale, onSave, onCancel }: ProfileEditFormProps) {
  const t = useTranslations('profile');
  const isRTL = locale === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
    educationLevel: user.educationLevel || '',
    fieldOfStudy: user.fieldOfStudy || '',
    socialLinks: {
      twitter: user.socialLinks?.twitter || '',
      linkedin: user.socialLinks?.linkedin || '',
      facebook: user.socialLinks?.facebook || '',
      website: user.socialLinks?.website || '',
    },
    profileImage: user.profileImage || '',
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch('/api/user/profile/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, profileImage: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await onSave(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || t('error'));
    } finally {
      setSaving(false);
    }
  };

  const displayImage = formData.profileImage || user.googleImage || user.image;

  const getEducationLabel = (level: string) => {
    const labels: Record<string, string> = {
      HIGH_SCHOOL: t('highSchool'),
      BACHELOR: t('bachelor'),
      MASTER: t('master'),
      PHD: t('phd'),
    };
    return labels[level] || level;
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      ENGINEERING: t('engineering'),
      MEDICINE: t('medicine'),
      BUSINESS: t('business'),
      ARTS: t('arts'),
      SCIENCE: t('science'),
      LAW: t('law'),
      EDUCATION: t('educationField'),
      TECHNOLOGY: t('technology'),
    };
    return labels[field] || field;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Profile Picture */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary-600" />
          {t('profilePicture')}
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="h-10 w-10" />
                </div>
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 me-2" />
              {formData.profileImage ? t('changePicture') : t('uploadPicture')}
            </Button>
            {formData.profileImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 me-2" />
                {t('removePicture')}
              </Button>
            )}
            <p className="text-xs text-gray-500">{t('uploadHint')}</p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary-600" />
          {t('personalInfo')}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('name')}
            </label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('namePlaceholder')}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('phone')}
            </label>
            <div className="relative">
              <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t('phonePlaceholder')}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('location')}
            </label>
            <div className="relative">
              <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t('locationPlaceholder')}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('bio')}
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder={t('bioPlaceholder')}
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/500 - {t('bioHint')}
            </p>
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary-600" />
          {t('education')}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('educationLevel')}
            </label>
            <div className="relative">
              <GraduationCap className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">{t('selectLevel')}</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {getEducationLabel(level)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('fieldOfStudy')}
            </label>
            <div className="relative">
              <BookOpen className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleInputChange}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">{t('selectField')}</option>
                {FIELDS_OF_STUDY.map((field) => (
                  <option key={field} value={field}>
                    {getFieldLabel(field)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary-600" />
          {t('socialLinks')}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('twitter')}
            </label>
            <div className="relative">
              <Twitter className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                placeholder={t('twitterPlaceholder')}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('linkedin')}
            </label>
            <div className="relative">
              <Linkedin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder={t('linkedinPlaceholder')}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('facebook')}
            </label>
            <div className="relative">
              <Facebook className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder={t('facebookPlaceholder')}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('website')}
            </label>
            <div className="relative">
              <Globe className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={formData.socialLinks.website}
                onChange={(e) => handleSocialChange('website', e.target.value)}
                placeholder={t('websitePlaceholder')}
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          <Check className="h-5 w-5" />
          {t('saved')}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancelEdit')}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 me-2 animate-spin" />
              {t('saving')}
            </>
          ) : (
            t('saveChanges')
          )}
        </Button>
      </div>
    </form>
  );
}
