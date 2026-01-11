'use client';

import { useState, useEffect } from 'react';
import { User, MapPin, Languages, Calendar, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SimpleSelect as Select } from '@/components/ui/select';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type MatcherProfileInput } from '@/lib/validations/matcher';

// Common countries for Sudan Scholars Hub
const COUNTRIES = [
  { code: 'SD', name: { en: 'Sudan', ar: 'السودان' } },
  { code: 'EG', name: { en: 'Egypt', ar: 'مصر' } },
  { code: 'SA', name: { en: 'Saudi Arabia', ar: 'السعودية' } },
  { code: 'AE', name: { en: 'UAE', ar: 'الإمارات' } },
  { code: 'JO', name: { en: 'Jordan', ar: 'الأردن' } },
  { code: 'LB', name: { en: 'Lebanon', ar: 'لبنان' } },
  { code: 'SY', name: { en: 'Syria', ar: 'سوريا' } },
  { code: 'IQ', name: { en: 'Iraq', ar: 'العراق' } },
  { code: 'YE', name: { en: 'Yemen', ar: 'اليمن' } },
  { code: 'PS', name: { en: 'Palestine', ar: 'فلسطين' } },
  { code: 'LY', name: { en: 'Libya', ar: 'ليبيا' } },
  { code: 'TN', name: { en: 'Tunisia', ar: 'تونس' } },
  { code: 'DZ', name: { en: 'Algeria', ar: 'الجزائر' } },
  { code: 'MA', name: { en: 'Morocco', ar: 'المغرب' } },
  { code: 'SS', name: { en: 'South Sudan', ar: 'جنوب السودان' } },
  { code: 'SO', name: { en: 'Somalia', ar: 'الصومال' } },
  { code: 'ER', name: { en: 'Eritrea', ar: 'إريتريا' } },
  { code: 'ET', name: { en: 'Ethiopia', ar: 'إثيوبيا' } },
  { code: 'NG', name: { en: 'Nigeria', ar: 'نيجيريا' } },
  { code: 'KE', name: { en: 'Kenya', ar: 'كينيا' } },
  { code: 'TD', name: { en: 'Chad', ar: 'تشاد' } },
  { code: 'OTHER', name: { en: 'Other', ar: 'أخرى' } },
];

interface StepPersonalProps {
  locale: string;
  data: Partial<MatcherProfileInput>;
  onDataChange: (data: Partial<MatcherProfileInput>) => void;
}

export function StepPersonal({ locale, data, onDataChange }: StepPersonalProps) {
  const isRTL = locale === 'ar';

  const [country, setCountry] = useState<string>(data.countryOfOrigin || 'SD');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    data.languages || ['Arabic', 'English']
  );
  const [age, setAge] = useState<string>(data.age?.toString() || '');

  // Update parent on changes
  useEffect(() => {
    onDataChange({
      countryOfOrigin: country,
      languages: selectedLanguages,
      age: age ? parseInt(age, 10) : null,
    });
  }, [country, selectedLanguages, age, onDataChange]);

  // Country options
  const countryOptions = COUNTRIES.map((c) => ({
    value: c.code,
    label: isRTL ? c.name.ar : c.name.en,
  }));

  // Toggle language selection
  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(lang)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((l) => l !== lang);
      }
      return [...prev, lang];
    });
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isRTL ? 'معلوماتك الشخصية' : 'Personal Information'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isRTL
            ? 'هذه المعلومات تساعدنا في إيجاد المنح المناسبة لك'
            : 'This information helps us find scholarships suitable for you'}
        </p>
      </div>

      {/* Country of Origin */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRTL ? 'بلد الإقامة/الجنسية' : 'Country of Origin/Nationality'}
          </label>
        </div>
        <Select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          options={countryOptions}
        />
      </div>

      {/* Languages */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRTL ? 'اللغات التي تتحدثها' : 'Languages You Speak'}
          </label>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {isRTL
            ? 'اختر جميع اللغات التي تجيدها'
            : 'Select all languages you are proficient in'}
        </p>

        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="flex items-center gap-1">
                  {isRTL ? LANGUAGE_LABELS[lang]?.ar || lang : LANGUAGE_LABELS[lang]?.en || lang}
                  {isSelected && <Check className="w-3 h-3" />}
                </span>
              </button>
            );
          })}
        </div>

        {selectedLanguages.length === 0 && (
          <p className="text-xs text-red-500 mt-2">
            {isRTL ? 'يرجى اختيار لغة واحدة على الأقل' : 'Please select at least one language'}
          </p>
        )}
      </div>

      {/* Age */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRTL ? 'العمر' : 'Age'}
            <span className="text-gray-400 text-xs mx-2">
              ({isRTL ? 'اختياري' : 'Optional'})
            </span>
          </label>
        </div>
        <Input
          type="number"
          min="15"
          max="60"
          placeholder={isRTL ? 'أدخل عمرك' : 'Enter your age'}
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isRTL
            ? 'بعض المنح لها حدود عمرية (مثل المنحة التركية: أقل من 21 للبكالوريوس)'
            : 'Some scholarships have age limits (e.g., Turkish scholarship: under 21 for Bachelor)'}
        </p>
      </div>
    </div>
  );
}
