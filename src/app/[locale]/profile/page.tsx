'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bookmark,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  LogOut,
  Trash2,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { ProfileEditForm } from '@/components/features/profile-edit-form';

interface SavedScholarship {
  id: string;
  status: string;
  notes: string | null;
  savedAt: string;
  scholarship: {
    id: string;
    slug: string;
    title: string;
    titleAr: string;
    university: string;
    universityAr: string;
    country: string;
    countryAr: string;
    deadline: string;
    fundingType: string;
    level: string;
    image: string;
  };
}

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  website?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  educationLevel: string | null;
  fieldOfStudy: string | null;
  socialLinks: SocialLinks | null;
  profileImage: string | null;
  googleImage: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  saved: number;
  applying: number;
  applied: number;
  accepted: number;
  rejected: number;
}

const statusOptions = [
  { value: 'SAVED', label: 'Saved', labelAr: 'محفوظ' },
  { value: 'APPLYING', label: 'Applying', labelAr: 'قيد التقديم' },
  { value: 'APPLIED', label: 'Applied', labelAr: 'تم التقديم' },
  { value: 'ACCEPTED', label: 'Accepted', labelAr: 'مقبول' },
  { value: 'REJECTED', label: 'Rejected', labelAr: 'مرفوض' },
];

export default function ProfilePage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'en';
  const { data: session, status: sessionStatus } = useSession();
  const isRTL = locale === 'ar';

  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [savedScholarships, setSavedScholarships] = useState<SavedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push(`/${locale}/login`);
      return;
    }

    if (sessionStatus === 'authenticated' && (session?.user as any)?.isAdmin) {
      router.push(`/${locale}/admin`);
      return;
    }

    if (sessionStatus === 'authenticated') {
      fetchProfile();
      fetchSavedScholarships();
    }
  }, [sessionStatus, session, locale, router]);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }

  async function fetchSavedScholarships() {
    try {
      const res = await fetch('/api/user/saved-scholarships');
      if (res.ok) {
        const data = await res.json();
        setSavedScholarships(data.savedScholarships);
      }
    } catch (error) {
      console.error('Failed to fetch saved scholarships:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/user/saved-scholarships/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSavedScholarships((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status } : s))
        );
        fetchProfile(); // Update stats
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  async function removeSaved(id: string) {
    if (!confirm(isRTL ? 'هل تريد إزالة هذه المنحة؟' : 'Remove this scholarship?')) {
      return;
    }

    try {
      const res = await fetch(`/api/user/saved-scholarships/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSavedScholarships((prev) => prev.filter((s) => s.id !== id));
        fetchProfile(); // Update stats
      }
    } catch (error) {
      console.error('Failed to remove saved:', error);
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${locale}` });
  };

  const handleSaveProfile = async (data: any) => {
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to save profile');
    }

    const responseData = await res.json();
    setUser(responseData.user);
  };

  const filteredScholarships =
    activeTab === 'all'
      ? savedScholarships
      : savedScholarships.filter((s) => s.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SAVED':
        return <Badge><Bookmark className="h-3 w-3 me-1" />{isRTL ? 'محفوظ' : 'Saved'}</Badge>;
      case 'APPLYING':
        return <Badge variant="warning"><Clock className="h-3 w-3 me-1" />{isRTL ? 'قيد التقديم' : 'Applying'}</Badge>;
      case 'APPLIED':
        return <Badge variant="info"><Send className="h-3 w-3 me-1" />{isRTL ? 'تم التقديم' : 'Applied'}</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 me-1" />{isRTL ? 'مقبول' : 'Accepted'}</Badge>;
      case 'REJECTED':
        return <Badge variant="error"><XCircle className="h-3 w-3 me-1" />{isRTL ? 'مرفوض' : 'Rejected'}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <Container>
          <div className="py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.name || (isRTL ? 'مستخدم' : 'User')}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 me-2" />
                {isRTL ? 'تعديل الملف' : 'Edit Profile'}
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 me-2" />
                {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Edit Form or Stats */}
      <Container>
        <div className="py-8">
          {isEditing && user ? (
            <ProfileEditForm
              user={user}
              locale={locale}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
          <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { key: 'total', label: isRTL ? 'الكل' : 'Total', value: stats?.total || 0 },
              { key: 'saved', label: isRTL ? 'محفوظ' : 'Saved', value: stats?.saved || 0 },
              { key: 'applying', label: isRTL ? 'قيد التقديم' : 'Applying', value: stats?.applying || 0 },
              { key: 'applied', label: isRTL ? 'تم التقديم' : 'Applied', value: stats?.applied || 0 },
              { key: 'accepted', label: isRTL ? 'مقبول' : 'Accepted', value: stats?.accepted || 0 },
            ].map((stat) => (
              <Card
                key={stat.key}
                className={`p-4 text-center cursor-pointer transition-colors ${
                  activeTab === (stat.key === 'total' ? 'all' : stat.key.toUpperCase())
                    ? 'border-primary-500 bg-primary-50'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(stat.key === 'total' ? 'all' : stat.key.toUpperCase())}
              >
                <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Saved Scholarships */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isRTL ? 'المنح المحفوظة' : 'Saved Scholarships'}
          </h2>

          {filteredScholarships.length === 0 ? (
            <Card className="p-12 text-center">
              <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">
                {isRTL ? 'لا توجد منح محفوظة' : 'No saved scholarships'}
              </p>
              <Link href={`/${locale}/scholarships`}>
                <Button>{isRTL ? 'تصفح المنح' : 'Browse Scholarships'}</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredScholarships.map((saved) => (
                <Card key={saved.id} className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="relative w-full md:w-40 h-32 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={saved.scholarship.image}
                        alt={isRTL ? saved.scholarship.titleAr : saved.scholarship.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 160px"
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <Link
                          href={`/${locale}/scholarships/${saved.scholarship.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {isRTL ? saved.scholarship.titleAr : saved.scholarship.title}
                        </Link>
                        {getStatusBadge(saved.status)}
                      </div>

                      <p className="text-gray-600 text-sm mb-2">
                        {isRTL ? saved.scholarship.universityAr : saved.scholarship.university} •{' '}
                        {isRTL ? saved.scholarship.countryAr : saved.scholarship.country}
                      </p>

                      <p className="text-sm text-gray-500 mb-4">
                        {isRTL ? 'الموعد النهائي:' : 'Deadline:'}{' '}
                        {new Date(saved.scholarship.deadline).toLocaleDateString(
                          isRTL ? 'ar-SA' : 'en-US'
                        )}
                      </p>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Select
                          value={saved.status}
                          onChange={(e) => updateStatus(saved.id, e.target.value)}
                          options={statusOptions.map((opt) => ({
                            value: opt.value,
                            label: isRTL ? opt.labelAr : opt.label,
                          }))}
                          className="w-40"
                        />

                        <Link href={`/${locale}/scholarships/${saved.scholarship.slug}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 me-1" />
                            {isRTL ? 'عرض' : 'View'}
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSaved(saved.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 me-1" />
                          {isRTL ? 'إزالة' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          </>
          )}
        </div>
      </Container>
    </div>
  );
}
