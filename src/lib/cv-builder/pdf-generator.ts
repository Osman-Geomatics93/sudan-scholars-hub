import { renderToBuffer } from '@react-pdf/renderer';
import { ModernTemplate } from './templates/modern';
import { ClassicTemplate } from './templates/classic';
import { MinimalTemplate } from './templates/minimal';
import type { Resume } from './types';

export type ResumeWithRelations = Resume & {
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    gpa: string | null;
    achievements: string | null;
    order: number;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    description: string | null;
    order: number;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string | null;
    category: string | null;
    order: number;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
    order: number;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: Date | null;
    expiryDate: Date | null;
    credentialId: string | null;
    url: string | null;
    order: number;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string | null;
    technologies: string[];
    url: string | null;
    startDate: Date | null;
    endDate: Date | null;
    current: boolean;
    order: number;
  }>;
  awards: Array<{
    id: string;
    title: string;
    issuer: string;
    date: Date | null;
    description: string | null;
    order: number;
  }>;
};

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

export async function generateResumePDF(
  resume: ResumeWithRelations,
  locale: string = 'en'
): Promise<Buffer> {
  const templateType = (resume.template as keyof typeof templates) || 'modern';
  const Template = templates[templateType] || templates.modern;

  const document = Template({ resume, locale });
  const buffer = await renderToBuffer(document);

  return Buffer.from(buffer);
}
