'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Download,
  Eye,
  Share2,
  Loader2,
  Calendar,
  Lock,
  Globe,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResumeListItem {
  id: string;
  title: string;
  slug: string;
  fullName: string;
  template: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    education: number;
    experience: number;
    skills: number;
  };
}

export default function CVBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const isRTL = locale === 'ar';

  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const labels = {
    title: isRTL ? 'مُنشئ السيرة الذاتية' : 'CV Builder',
    subtitle: isRTL
      ? 'أنشئ سيرة ذاتية احترافية متوافقة مع أنظمة تتبع المتقدمين'
      : 'Create professional ATS-friendly resumes',
    createNew: isRTL ? 'إنشاء سيرة ذاتية جديدة' : 'Create New Resume',
    noResumes: isRTL ? 'لم يتم إنشاء سير ذاتية بعد' : 'No resumes created yet',
    startCreating: isRTL
      ? 'ابدأ بإنشاء سيرتك الذاتية الأولى'
      : 'Start by creating your first resume',
    edit: isRTL ? 'تعديل' : 'Edit',
    delete: isRTL ? 'حذف' : 'Delete',
    download: isRTL ? 'تحميل' : 'Download',
    preview: isRTL ? 'معاينة' : 'Preview',
    share: isRTL ? 'مشاركة' : 'Share',
    public: isRTL ? 'عام' : 'Public',
    private: isRTL ? 'خاص' : 'Private',
    views: isRTL ? 'مشاهدات' : 'views',
    lastUpdated: isRTL ? 'آخر تحديث' : 'Last updated',
    loginRequired: isRTL
      ? 'يرجى تسجيل الدخول لإنشاء سيرة ذاتية'
      : 'Please log in to create a resume',
    login: isRTL ? 'تسجيل الدخول' : 'Log In',
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResumes();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/cv-builder');
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذه السيرة الذاتية؟' : 'Are you sure you want to delete this resume?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/cv-builder/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/cv-builder/${id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  return (
    <MainLayout locale={locale}>
      <div
        className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container size="lg" className="pt-20 pb-8 md:pt-24 md:pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {labels.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {labels.subtitle}
              </p>
            </div>
            <Link href={`/${locale}/cv-builder/new`}>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {labels.createNew}
              </Button>
            </Link>
          </div>

          {/* Resume List */}
          {resumes.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {labels.noResumes}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {labels.startCreating}
                </p>
                <Link href={`/${locale}/cv-builder/new`}>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    {labels.createNew}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {resumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {resume.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {resume.fullName}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {labels.lastUpdated}: {formatDate(resume.updatedAt)}
                            </span>
                            <Badge
                              variant="secondary"
                              className={
                                resume.isPublic
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : ''
                              }
                            >
                              {resume.isPublic ? (
                                <>
                                  <Globe className="w-3 h-3 mr-1" />
                                  {labels.public}
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  {labels.private}
                                </>
                              )}
                            </Badge>
                            {resume.isPublic && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {resume.viewCount} {labels.views}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/${locale}/cv-builder/${resume.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="w-4 h-4" />
                            {labels.edit}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleDownload(resume.id)}
                        >
                          <Download className="w-4 h-4" />
                          {labels.download}
                        </Button>
                        {resume.isPublic && (
                          <Link href={`/${locale}/cv-builder/share/${resume.slug}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Share2 className="w-4 h-4" />
                              {labels.share}
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(resume.id)}
                          disabled={deleting === resume.id}
                        >
                          {deleting === resume.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </div>
    </MainLayout>
  );
}
