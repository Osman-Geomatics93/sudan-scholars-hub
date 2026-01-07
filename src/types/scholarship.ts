export type StudyLevel = 'BACHELOR' | 'MASTER' | 'PHD' | 'bachelor' | 'master' | 'phd';
export type FundingType = 'FULLY_FUNDED' | 'PARTIALLY_FUNDED' | 'fully-funded' | 'partially-funded';
export type FieldOfStudy =
  | 'ENGINEERING'
  | 'MEDICINE'
  | 'BUSINESS'
  | 'ARTS'
  | 'SCIENCE'
  | 'LAW'
  | 'EDUCATION'
  | 'TECHNOLOGY'
  | 'engineering'
  | 'medicine'
  | 'business'
  | 'arts'
  | 'science'
  | 'law'
  | 'education'
  | 'technology';

export interface Scholarship {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  university: string;
  universityAr: string;
  country: string;
  countryCode: string;
  countryAr: string;
  deadline: string;
  fundingType: FundingType;
  levels: StudyLevel[];
  field: FieldOfStudy;
  description: string;
  descriptionAr: string;
  eligibility: string[];
  eligibilityAr: string[];
  benefits: string[];
  benefitsAr: string[];
  requirements: string[];
  requirementsAr: string[];
  howToApply: string;
  howToApplyAr: string;
  applicationUrl: string;
  image: string;
  duration: string;
  durationAr: string;
  isFeatured: boolean;
  isNew?: boolean;
  createdAt: string;
}

export interface ScholarshipFilters {
  search?: string;
  level?: StudyLevel[];
  fundingType?: FundingType[];
  country?: string[];
  field?: FieldOfStudy[];
}

export interface Testimonial {
  id: string;
  name: string;
  nameAr: string;
  university: string;
  universityAr: string;
  country: string;
  countryAr: string;
  quote: string;
  quoteAr: string;
  avatar: string;
  scholarshipYear: number;
}

export interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  bio: string;
  bioAr: string;
  avatar: string;
  linkedin?: string;
  twitter?: string;
}
