'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  Loader2,
  Download,
  Share2,
  Eye,
  Copy,
  Check,
  Globe,
  Lock,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { CVWizard } from '@/components/cv-builder/cv-wizard';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { CVWizardData, Resume } from '@/lib/cv-builder/types';

export default function EditCVPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const resumeId = params?.id as string;
  const isRTL = locale === 'ar';

  const { data: session, status } = useSession();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  const labels = {
    title: isRTL ? 'تعديل السيرة الذاتية' : 'Edit Resume',
    back: isRTL ? 'العودة' : 'Back',
    download: isRTL ? 'تحميل PDF' : 'Download PDF',
    share: isRTL ? 'مشاركة' : 'Share',
    shareSettings: isRTL ? 'إعدادات المشاركة' : 'Share Settings',
    public: isRTL ? 'عام' : 'Public',
    private: isRTL ? 'خاص' : 'Private',
    makePublic: isRTL ? 'اجعل السيرة الذاتية عامة' : 'Make resume public',
    publicDescription: isRTL
      ? 'سيتمكن أي شخص من رؤية سيرتك الذاتية عبر الرابط العام'
      : 'Anyone with the link can view your resume',
    shareLink: isRTL ? 'رابط المشاركة' : 'Share Link',
    copyLink: isRTL ? 'نسخ الرابط' : 'Copy Link',
    copied: isRTL ? 'تم النسخ!' : 'Copied!',
    preview: isRTL ? 'معاينة' : 'Preview',
    notFound: isRTL ? 'لم يتم العثور على السيرة الذاتية' : 'Resume not found',
    loginRequired: isRTL
      ? 'يرجى تسجيل الدخول لتعديل السيرة الذاتية'
      : 'Please log in to edit a resume',
    login: isRTL ? 'تسجيل الدخول' : 'Log In',
  };

  useEffect(() => {
    if (status === 'authenticated' && resumeId) {
      fetchResume();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, resumeId]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/cv-builder/${resumeId}`);
      if (!response.ok) {
        throw new Error('Resume not found');
      }
      const data = await response.json();
      setResume(data.resume);
      setIsPublic(data.resume.isPublic);
    } catch (err) {
      setError(labels.notFound);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/cv-builder/${resumeId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const handleTogglePublic = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/cv-builder/${resumeId}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsPublic(data.resume.isPublic);
        if (resume) {
          setResume({ ...resume, isPublic: data.resume.isPublic, slug: data.resume.slug });
        }
      }
    } catch (error) {
      console.error('Error updating share settings:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyLink = () => {
    if (resume) {
      const shareUrl = `${window.location.origin}/${locale}/cv-builder/share/${resume.slug}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const convertToWizardData = (resume: Resume): Partial<CVWizardData> => {
    return {
      personal: {
        fullName: resume.fullName,
        email: resume.email,
        phone: resume.phone || '',
        location: resume.location || '',
        linkedIn: resume.linkedIn || '',
        website: resume.website || '',
      },
      education: resume.education?.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        location: edu.location || '',
        startDate: new Date(edu.startDate).toISOString().slice(0, 7),
        endDate: edu.endDate ? new Date(edu.endDate).toISOString().slice(0, 7) : '',
        current: edu.current,
        gpa: edu.gpa || '',
        achievements: edu.achievements || '',
      })) || [],
      experience: resume.experience?.map((exp) => ({
        company: exp.company,
        position: exp.position,
        location: exp.location || '',
        startDate: new Date(exp.startDate).toISOString().slice(0, 7),
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 7) : '',
        current: exp.current,
        description: exp.description || '',
      })) || [],
      skills: resume.skills?.map((skill) => ({
        name: skill.name,
        level: skill.level || '',
        category: skill.category || '',
      })) || [],
      languages: resume.languages?.map((lang) => ({
        language: lang.language,
        proficiency: lang.proficiency,
      })) || [],
      certifications: resume.certifications?.map((cert) => ({
        name: cert.name,
        issuer: cert.issuer,
        issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().slice(0, 7) : '',
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().slice(0, 7) : '',
        credentialId: cert.credentialId || '',
        url: cert.url || '',
      })) || [],
      projects: resume.projects?.map((project) => ({
        name: project.name,
        description: project.description || '',
        technologies: project.technologies || [],
        url: project.url || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().slice(0, 7) : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().slice(0, 7) : '',
        current: project.current,
      })) || [],
      awards: resume.awards?.map((award) => ({
        title: award.title,
        issuer: award.issuer,
        date: award.date ? new Date(award.date).toISOString().slice(0, 7) : '',
        description: award.description || '',
      })) || [],
      summary: resume.summary || '',
      summaryAr: resume.summaryAr || '',
      template: resume.template as CVWizardData['template'],
      primaryColor: resume.primaryColor,
    };
  };

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <MainLayout locale={locale}>
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10">
          <Container size="md" className="pt-24 pb-16">
            <div className="text-center">
              <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {labels.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {labels.loginRequired}
              </p>
              <Link href={`/${locale}/login`}>
                <Button size="lg">{labels.login}</Button>
              </Link>
            </div>
          </Container>
        </div>
      </MainLayout>
    );
  }

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
              {labels.notFound}
            </h1>
            <Link href={`/${locale}/cv-builder`}>
              <Button>{labels.back}</Button>
            </Link>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout locale={locale}>
      <div
        className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container size="lg" className="pt-20 pb-8 md:pt-24 md:pb-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Link href={`/${locale}/cv-builder`}>
                  <Button variant="ghost" className="gap-2 mb-2">
                    {isRTL ? (
                      <>
                        {labels.back}
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="w-4 h-4" />
                        {labels.back}
                      </>
                    )}
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {resume.title}
                </h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                  <Download className="w-4 h-4" />
                  {labels.download}
                </Button>
                {isPublic && (
                  <Link href={`/${locale}/cv-builder/share/${resume.slug}`}>
                    <Button variant="outline" className="gap-2">
                      <Eye className="w-4 h-4" />
                      {labels.preview}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Share Settings */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isPublic ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {isPublic ? (
                      <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {labels.shareSettings}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {labels.publicDescription}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="public"
                      checked={isPublic}
                      onCheckedChange={handleTogglePublic}
                      disabled={updating}
                    />
                    <Label htmlFor="public">
                      {isPublic ? labels.public : labels.private}
                    </Label>
                  </div>
                  {isPublic && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          {labels.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {labels.copyLink}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wizard */}
          <CVWizard
            locale={locale}
            existingData={convertToWizardData(resume)}
            resumeId={resumeId}
          />
        </Container>
      </div>
    </MainLayout>
  );
}
