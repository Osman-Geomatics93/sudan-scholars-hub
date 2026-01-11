'use client';

import { useState } from 'react';
import { Wrench, Languages, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CVWizardData, ResumeSkillInput, ResumeLanguageInput } from '@/lib/cv-builder/types';

interface StepSkillsProps {
  locale: string;
  data: CVWizardData;
  onDataChange: (data: Partial<CVWizardData>) => void;
}

const skillLevels = [
  { value: 'beginner', labelEn: 'Beginner', labelAr: 'مبتدئ' },
  { value: 'intermediate', labelEn: 'Intermediate', labelAr: 'متوسط' },
  { value: 'advanced', labelEn: 'Advanced', labelAr: 'متقدم' },
  { value: 'expert', labelEn: 'Expert', labelAr: 'خبير' },
];

const languageProficiencies = [
  { value: 'native', labelEn: 'Native', labelAr: 'لغة أم' },
  { value: 'fluent', labelEn: 'Fluent', labelAr: 'طلاقة' },
  { value: 'advanced', labelEn: 'Advanced', labelAr: 'متقدم' },
  { value: 'intermediate', labelEn: 'Intermediate', labelAr: 'متوسط' },
  { value: 'basic', labelEn: 'Basic', labelAr: 'أساسي' },
];

export function StepSkills({ locale, data, onDataChange }: StepSkillsProps) {
  const isRTL = locale === 'ar';
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('intermediate');
  const [newLanguage, setNewLanguage] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState('intermediate');

  const labels = {
    title: isRTL ? 'المهارات واللغات' : 'Skills & Languages',
    subtitle: isRTL ? 'أضف مهاراتك واللغات التي تتقنها' : 'Add your skills and languages you speak',
    skills: isRTL ? 'المهارات' : 'Skills',
    addSkill: isRTL ? 'إضافة مهارة' : 'Add Skill',
    skillName: isRTL ? 'اسم المهارة' : 'Skill Name',
    skillLevel: isRTL ? 'المستوى' : 'Level',
    languages: isRTL ? 'اللغات' : 'Languages',
    addLanguage: isRTL ? 'إضافة لغة' : 'Add Language',
    languageName: isRTL ? 'اللغة' : 'Language',
    proficiency: isRTL ? 'الإتقان' : 'Proficiency',
    noSkills: isRTL ? 'لم تتم إضافة مهارات' : 'No skills added',
    noLanguages: isRTL ? 'لم تتم إضافة لغات' : 'No languages added',
    skillPlaceholder: isRTL ? 'مثل: JavaScript, التصميم, القيادة' : 'e.g., JavaScript, Design, Leadership',
    languagePlaceholder: isRTL ? 'مثل: الإنجليزية، العربية، التركية' : 'e.g., English, Arabic, Turkish',
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const skill: ResumeSkillInput = {
        name: newSkill.trim(),
        level: newSkillLevel,
      };
      onDataChange({ skills: [...data.skills, skill] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    onDataChange({ skills: newSkills });
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      const language: ResumeLanguageInput = {
        language: newLanguage.trim(),
        proficiency: newLanguageLevel,
      };
      onDataChange({ languages: [...data.languages, language] });
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const newLanguages = data.languages.filter((_, i) => i !== index);
    onDataChange({ languages: newLanguages });
  };

  const getSkillLevelLabel = (value: string) => {
    const level = skillLevels.find((l) => l.value === value);
    return isRTL ? level?.labelAr : level?.labelEn;
  };

  const getLanguageLevelLabel = (value: string) => {
    const level = languageProficiencies.find((l) => l.value === value);
    return isRTL ? level?.labelAr : level?.labelEn;
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

      {/* Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-gray-900 dark:text-white">{labels.skills}</h3>
        </div>

        {/* Skills List */}
        <div className="flex flex-wrap gap-2 min-h-[48px]">
          {data.skills.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noSkills}</p>
          ) : (
            data.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 gap-2 text-sm"
              >
                {skill.name}
                {skill.level && (
                  <span className="text-xs opacity-70">
                    ({getSkillLevelLabel(skill.level)})
                  </span>
                )}
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          )}
        </div>

        {/* Add Skill Form */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder={labels.skillPlaceholder}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
          </div>
          <Select value={newSkillLevel} onValueChange={setNewSkillLevel}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {skillLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {isRTL ? level.labelAr : level.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddSkill} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Languages Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-gray-900 dark:text-white">{labels.languages}</h3>
        </div>

        {/* Languages List */}
        <div className="flex flex-wrap gap-2 min-h-[48px]">
          {data.languages.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noLanguages}</p>
          ) : (
            data.languages.map((lang, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 gap-2 text-sm"
              >
                {lang.language}
                <span className="text-xs opacity-70">
                  ({getLanguageLevelLabel(lang.proficiency)})
                </span>
                <button
                  onClick={() => handleRemoveLanguage(index)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          )}
        </div>

        {/* Add Language Form */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder={labels.languagePlaceholder}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
            />
          </div>
          <Select value={newLanguageLevel} onValueChange={setNewLanguageLevel}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageProficiencies.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {isRTL ? level.labelAr : level.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddLanguage} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
