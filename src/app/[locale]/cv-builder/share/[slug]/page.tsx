'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Loader2,
  Download,
  GraduationCap,
  Briefcase,
  Award,
  Languages,
  Wrench,
  FolderGit2,
  Trophy,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Resume } from '@/lib/cv-builder/types';

export default function PublicResumePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const slug = params?.slug as string;
  const isRTL = locale === 'ar';

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const labels = {
    notFound: isRTL ? 'لم يتم العثور على السيرة الذاتية' : 'Resume not found',
    notPublic: isRTL
      ? 'هذه السيرة الذاتية غير متاحة للعرض العام'
      : 'This resume is not publicly available',
    download: isRTL ? 'تحميل PDF' : 'Download PDF',
    education: isRTL ? 'التعليم' : 'Education',
    experience: isRTL ? 'الخبرة المهنية' : 'Professional Experience',
    skills: isRTL ? 'المهارات' : 'Skills',
    languages: isRTL ? 'اللغات' : 'Languages',
    certifications: isRTL ? 'الشهادات' : 'Certifications',
    projects: isRTL ? 'المشاريع' : 'Projects',
    awards: isRTL ? 'الجوائز والإنجازات' : 'Awards & Honors',
    present: isRTL ? 'الحالي' : 'Present',
    poweredBy: isRTL ? 'تم الإنشاء بواسطة' : 'Built with',
  };

  useEffect(() => {
    if (slug) {
      fetchResume();
    }
  }, [slug]);

  const fetchResume = async () => {
    try {
      // We need to create a public API endpoint for this
      const response = await fetch(`/api/cv-builder/public/${slug}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Resume not found');
      }
      const data = await response.json();
      setResume(data.resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.notFound);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date | null | undefined, showMonth = true) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (showMonth) {
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
      });
    }
    return date.getFullYear().toString();
  };

  if (loading) {
    return (
      <MainLayout locale={locale}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !resume) {
    return (
      <MainLayout locale={locale}>
        <Container size="md" className="pt-24 pb-16">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || labels.notFound}
            </h1>
            <Link href={`/${locale}`}>
              <Button>{isRTL ? 'العودة للرئيسية' : 'Go Home'}</Button>
            </Link>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout locale={locale}>
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container size="md" className="pt-20 pb-8 md:pt-24 md:pb-12">
          {/* Resume Card */}
          <Card className="overflow-hidden shadow-lg">
            {/* Header with primary color */}
            <div
              className="p-6 md:p-8 text-white"
              style={{ backgroundColor: resume.primaryColor }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {resume.fullName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                {resume.email && (
                  <a href={`mailto:${resume.email}`} className="flex items-center gap-1 hover:opacity-100">
                    <Mail className="w-4 h-4" />
                    {resume.email}
                  </a>
                )}
                {resume.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {resume.phone}
                  </span>
                )}
                {resume.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {resume.location}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                {resume.linkedIn && (
                  <a
                    href={resume.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:opacity-100 opacity-90"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {resume.website && (
                  <a
                    href={resume.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:opacity-100 opacity-90"
                  >
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
              </div>
            </div>

            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Summary */}
              {resume.summary && (
                <section>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isRTL && resume.summaryAr ? resume.summaryAr : resume.summary}
                  </p>
                </section>
              )}

              {/* Experience */}
              {resume.experience && resume.experience.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b">
                    <Briefcase className="w-5 h-5" style={{ color: resume.primaryColor }} />
                    {labels.experience}
                  </h2>
                  <div className="space-y-6">
                    {resume.experience.map((exp, index) => (
                      <div key={exp.id || index}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {exp.position}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {exp.company}
                              {exp.location && ` • ${exp.location}`}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(exp.startDate)} —{' '}
                            {exp.current ? labels.present : formatDate(exp.endDate)}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {resume.education && resume.education.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b">
                    <GraduationCap className="w-5 h-5" style={{ color: resume.primaryColor }} />
                    {labels.education}
                  </h2>
                  <div className="space-y-4">
                    {resume.education.map((edu, index) => (
                      <div key={edu.id || index}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {edu.degree} in {edu.field}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {edu.institution}
                              {edu.location && ` • ${edu.location}`}
                              {edu.gpa && ` • GPA: ${edu.gpa}`}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(edu.startDate)} —{' '}
                            {edu.current ? labels.present : formatDate(edu.endDate)}
                          </span>
                        </div>
                        {edu.achievements && (
                          <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">
                            {edu.achievements}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {resume.skills && resume.skills.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b">
                    <Wrench className="w-5 h-5" style={{ color: resume.primaryColor }} />
                    {labels.skills}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                      <Badge
                        key={skill.id || index}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {skill.name}
                        {skill.level && (
                          <span className="ml-1 opacity-70">({skill.level})</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {resume.languages && resume.languages.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b">
                    <Languages className="w-5 h-5" style={{ color: resume.primaryColor }} />
                    {labels.languages}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {resume.languages.map((lang, index) => (
                      <div key={lang.id || index} className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {lang.language}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1">
                          ({lang.proficiency})
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {resume.projects && resume.projects.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b">
                    <FolderGit2 className="w-5 h-5" style={{ color: resume.primaryColor }} />
                    {labels.projects}
                  </h2>
                  <div className="space-y-4">
                    {resume.projects.map((project, index) => (
                      <div key={project.id || index}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {project.name}
                            </h3>
                            {project.technologies && project.technologies.length > 0 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                {project.technologies.join(' • ')}
                              </p>
                            )}
                          </div>
                          {(project.startDate || project.endDate) && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {project.startDate && formatDate(project.startDate)}
                              {project.startDate && ' — '}
                              {project.current ? labels.present : project.endDate && formatDate(project.endDate)}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">
                            {project.description}
                          </p>
                        )}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-1 inline-block"
                          >
                            {project.url}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Awards & Honors */}
              {resume.awards && resume.awards.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b">
                    <Trophy className="w-5 h-5" style={{ color: resume.primaryColor }} />
                    {labels.awards}
                  </h2>
                  <div className="space-y-3">
                    {resume.awards.map((award, index) => (
                      <div key={award.id || index}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {award.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {award.issuer}
                            </p>
                          </div>
                          {award.date && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(award.date)}
                            </span>
                          )}
                        </div>
                        {award.description && (
                          <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">
                            {award.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {resume.certifications && resume.certifications.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b">
                    <Award className="w-5 h-5" style={{ color: resume.primaryColor }} />
                    {labels.certifications}
                  </h2>
                  <div className="space-y-3">
                    {resume.certifications.map((cert, index) => (
                      <div key={cert.id || index}>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {cert.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {cert.issuer}
                          {cert.issueDate && ` • ${formatDate(cert.issueDate)}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            {labels.poweredBy}{' '}
            <Link href={`/${locale}/cv-builder`} className="text-primary hover:underline">
              Sudan Scholars Hub CV Builder
            </Link>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
