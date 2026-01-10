import { z } from 'zod';

export const universityAdmissionSchema = z.object({
  // University Info
  universityNameEn: z.string().min(1, 'English name is required').max(200),
  universityNameTr: z.string().min(1, 'Turkish name is required').max(200),
  universityNameAr: z.string().min(1, 'Arabic name is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  cityAr: z.string().min(1, 'City (Arabic) is required').max(100),

  // Program Info
  degree: z.enum(['bachelor', 'master', 'phd', 'all']),
  specialization: z.string().max(200).optional().nullable(),

  // Dates
  registrationStart: z.string().datetime().or(z.date()),
  registrationEnd: z.string().datetime().or(z.date()),
  resultsDate: z.string().datetime().or(z.date()),

  // Certificates & Application
  acceptedCertificates: z.array(z.string()).min(1, 'At least one certificate is required'),
  detailsUrl: z.string().url('Valid URL is required'),
  applicationType: z.enum(['yos', 'direct', 'sat', 'turkiye-burslari', 'graduate-institute', 'online-portal', 'ales-based']),
  localRanking: z.number().int().positive('Ranking must be positive'),

  // Application Fee
  applicationFee: z.number().positive().optional().nullable(),
  applicationFeeCurrency: z.enum(['TRY', 'USD', 'EUR']).optional().nullable(),
  isFreeApplication: z.boolean().default(true),

  // Calendar Type & Summer Program Fields
  calendarType: z.enum(['bachelor', 'masters-phd', 'summer']).default('bachelor'),
  programDuration: z.string().max(50).optional().nullable(), // For summer programs
  languageOfInstruction: z.array(z.string()).default(['Turkish']),

  // Status
  isActive: z.boolean().optional().default(true),
});

export const universityAdmissionUpdateSchema = universityAdmissionSchema.partial();

export type UniversityAdmissionInput = z.infer<typeof universityAdmissionSchema>;
export type UniversityAdmissionUpdateInput = z.infer<typeof universityAdmissionUpdateSchema>;
