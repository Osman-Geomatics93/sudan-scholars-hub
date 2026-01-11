'use client';

import { useState } from 'react';
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CVWizardData, ResumeProjectInput } from '@/lib/cv-builder/types';

interface StepProjectsProps {
  locale: string;
  data: CVWizardData;
  onDataChange: (data: Partial<CVWizardData>) => void;
}

const emptyProject: ResumeProjectInput = {
  name: '',
  description: '',
  technologies: [],
  url: '',
  startDate: '',
  endDate: '',
  current: false,
};

export function StepProjects({ locale, data, onDataChange }: StepProjectsProps) {
  const isRTL = locale === 'ar';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    data.projects.length > 0 ? 0 : null
  );
  const [techInput, setTechInput] = useState<string>('');

  const labels = {
    title: isRTL ? 'المشاريع' : 'Projects',
    subtitle: isRTL ? 'أضف مشاريعك الأكاديمية والشخصية' : 'Add your academic and personal projects',
    addProject: isRTL ? 'إضافة مشروع' : 'Add Project',
    projectName: isRTL ? 'اسم المشروع' : 'Project Name',
    description: isRTL ? 'الوصف' : 'Description',
    technologies: isRTL ? 'التقنيات المستخدمة' : 'Technologies Used',
    addTech: isRTL ? 'أضف تقنية واضغط Enter' : 'Add technology and press Enter',
    projectUrl: isRTL ? 'رابط المشروع' : 'Project URL',
    startDate: isRTL ? 'تاريخ البدء' : 'Start Date',
    endDate: isRTL ? 'تاريخ الانتهاء' : 'End Date',
    current: isRTL ? 'مشروع جاري' : 'Ongoing project',
    optional: isRTL ? '(اختياري)' : '(Optional)',
    remove: isRTL ? 'حذف' : 'Remove',
    noProjects: isRTL ? 'لم تتم إضافة أي مشاريع بعد' : 'No projects added yet',
    descriptionPlaceholder: isRTL
      ? 'صف المشروع وأهدافه والنتائج الرئيسية...'
      : 'Describe the project, its goals, and key outcomes...',
    urlPlaceholder: isRTL ? 'https://github.com/username/project' : 'https://github.com/username/project',
  };

  const handleAddProject = () => {
    const newProjects = [...data.projects, { ...emptyProject }];
    onDataChange({ projects: newProjects });
    setExpandedIndex(newProjects.length - 1);
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = data.projects.filter((_, i) => i !== index);
    onDataChange({ projects: newProjects });
    if (expandedIndex === index) {
      setExpandedIndex(newProjects.length > 0 ? 0 : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdateProject = (index: number, field: keyof ResumeProjectInput, value: string | boolean | string[]) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onDataChange({ projects: newProjects });
  };

  const handleAddTechnology = (index: number) => {
    if (techInput.trim()) {
      const project = data.projects[index];
      const newTechnologies = [...project.technologies, techInput.trim()];
      handleUpdateProject(index, 'technologies', newTechnologies);
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (projectIndex: number, techIndex: number) => {
    const project = data.projects[projectIndex];
    const newTechnologies = project.technologies.filter((_, i) => i !== techIndex);
    handleUpdateProject(projectIndex, 'technologies', newTechnologies);
  };

  const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology(index);
    }
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

      {data.projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FolderGit2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{labels.noProjects}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <FolderGit2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {project.name || (isRTL ? 'مشروع جديد' : 'New Project')}
                    </p>
                    {project.technologies.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {project.technologies.slice(0, 3).join(', ')}
                        {project.technologies.length > 3 && '...'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveProject(index);
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
                      <Label>{labels.projectName} *</Label>
                      <Input
                        value={project.name}
                        onChange={(e) => handleUpdateProject(index, 'name', e.target.value)}
                        placeholder={isRTL ? 'نظام إدارة المحتوى' : 'Content Management System'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.projectUrl} {labels.optional}</Label>
                      <Input
                        value={project.url || ''}
                        onChange={(e) => handleUpdateProject(index, 'url', e.target.value)}
                        placeholder={labels.urlPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{labels.description} {labels.optional}</Label>
                    <Textarea
                      value={project.description || ''}
                      onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                      placeholder={labels.descriptionPlaceholder}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{labels.technologies}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        placeholder={labels.addTech}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddTechnology(index)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleRemoveTechnology(index, techIndex)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{labels.startDate} {labels.optional}</Label>
                      <Input
                        type="month"
                        value={project.startDate || ''}
                        onChange={(e) => handleUpdateProject(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{labels.endDate} {labels.optional}</Label>
                      <Input
                        type="month"
                        value={project.endDate || ''}
                        onChange={(e) => handleUpdateProject(index, 'endDate', e.target.value)}
                        disabled={project.current}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`project-current-${index}`}
                      checked={project.current}
                      onCheckedChange={(checked) => handleUpdateProject(index, 'current', !!checked)}
                    />
                    <Label htmlFor={`project-current-${index}`} className="cursor-pointer">
                      {labels.current}
                    </Label>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        onClick={handleAddProject}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        {labels.addProject}
      </Button>
    </div>
  );
}
