// CV Builder Types

export type TemplateType = 'modern' | 'classic' | 'minimal';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type LanguageProficiency = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';

export interface ResumeEducation {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  gpa?: string;
  achievements?: string;
  order: number;
}

export interface ResumeExperience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  description?: string;
  order: number;
}

export interface ResumeSkill {
  id?: string;
  name: string;
  level?: SkillLevel | string;
  category?: string;
  order: number;
}

export interface ResumeLanguage {
  id?: string;
  language: string;
  proficiency: LanguageProficiency | string;
  order: number;
}

export interface ResumeCertification {
  id?: string;
  name: string;
  issuer: string;
  issueDate?: Date | string | null;
  expiryDate?: Date | string | null;
  credentialId?: string;
  url?: string;
  order: number;
}

export interface ResumeProject {
  id?: string;
  name: string;
  description?: string;
  technologies: string[];
  url?: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  current: boolean;
  order: number;
}

export interface ResumeAward {
  id?: string;
  title: string;
  issuer: string;
  date?: Date | string | null;
  description?: string;
  order: number;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  slug: string;

  // Personal Information
  fullName: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedIn?: string | null;
  website?: string | null;

  // Professional Summary
  summary?: string | null;
  summaryAr?: string | null;

  // Template & Settings
  template: TemplateType;
  isPublic: boolean;
  primaryColor: string;

  // Metadata
  lastExportedAt?: Date | string | null;
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;

  // Relations (included when fetched)
  education?: ResumeEducation[];
  experience?: ResumeExperience[];
  skills?: ResumeSkill[];
  languages?: ResumeLanguage[];
  certifications?: ResumeCertification[];
  projects?: ResumeProject[];
  awards?: ResumeAward[];
}

// Input types for creating/updating
export interface ResumePersonalInput {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  website?: string;
}

export interface ResumeEducationInput {
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string; // ISO date string
  endDate?: string;
  current: boolean;
  gpa?: string;
  achievements?: string;
}

export interface ResumeExperienceInput {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface ResumeSkillInput {
  name: string;
  level?: SkillLevel | string;
  category?: string;
}

export interface ResumeLanguageInput {
  language: string;
  proficiency: LanguageProficiency | string;
}

export interface ResumeCertificationInput {
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface ResumeProjectInput {
  name: string;
  description?: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
}

export interface ResumeAwardInput {
  title: string;
  issuer: string;
  date?: string;
  description?: string;
}

export interface ResumeCreateInput {
  title?: string;
  personal: ResumePersonalInput;
  education?: ResumeEducationInput[];
  experience?: ResumeExperienceInput[];
  skills?: ResumeSkillInput[];
  languages?: ResumeLanguageInput[];
  certifications?: ResumeCertificationInput[];
  projects?: ResumeProjectInput[];
  awards?: ResumeAwardInput[];
  summary?: string;
  summaryAr?: string;
  template?: TemplateType;
  primaryColor?: string;
}

export interface ResumeUpdateInput extends Partial<ResumeCreateInput> {
  isPublic?: boolean;
}

// Wizard step data
export interface CVWizardData {
  personal: ResumePersonalInput;
  education: ResumeEducationInput[];
  experience: ResumeExperienceInput[];
  skills: ResumeSkillInput[];
  languages: ResumeLanguageInput[];
  certifications: ResumeCertificationInput[];
  projects: ResumeProjectInput[];
  awards: ResumeAwardInput[];
  summary?: string;
  summaryAr?: string;
  template: TemplateType;
  primaryColor: string;
}

// API Response types
export interface ResumeListResponse {
  resumes: Resume[];
  totalCount: number;
}

export interface ResumeDetailResponse {
  resume: Resume;
}

export interface AISummaryRequest {
  education: ResumeEducationInput[];
  experience: ResumeExperienceInput[];
  skills: ResumeSkillInput[];
  targetRole?: string;
  language: 'en' | 'ar';
}

export interface AISummaryResponse {
  summary: string;
  language: 'en' | 'ar';
}

// Template props
export interface TemplateProps {
  resume: Resume;
  locale: string;
}

// PDF Export options
export interface PDFExportOptions {
  template: TemplateType;
  primaryColor?: string;
  locale?: string;
}
