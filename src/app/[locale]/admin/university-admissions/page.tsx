'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  GraduationCap,
  School,
  Sun,
  LayoutGrid,
} from 'lucide-react';
import { SkeletonTable } from '@/components/ui/skeleton';
import { getRegistrationStatus, calendarTypes } from '@/lib/admissions-data';

interface UniversityAdmission {
  id: string;
  universityNameEn: string;
  universityNameTr: string;
  universityNameAr: string;
  city: string;
  cityAr: string;
  degree: string;
  registrationStart: string;
  registrationEnd: string;
  resultsDate: string;
  acceptedCertificates: string[];
  detailsUrl: string;
  applicationType: string;
  localRanking: number;
  applicationFee: number | null;
  applicationFeeCurrency: string | null;
  isFreeApplication: boolean;
  isActive: boolean;
  calendarType: string;
  programDuration: string | null;
  languageOfInstruction: string[];
}

type CalendarFilter = 'all' | 'bachelor' | 'masters-phd' | 'summer';

export default function UniversityAdmissionsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [admissions, setAdmissions] = useState<UniversityAdmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [calendarFilter, setCalendarFilter] = useState<CalendarFilter>('all');

  useEffect(() => {
    fetchAdmissions();
  }, []);

  async function fetchAdmissions() {
    try {
      const res = await fetch('/api/admin/university-admissions');
      if (res.ok) {
        const data = await res.json();
        setAdmissions(data.admissions);
      }
    } catch (error) {
      console.error('Failed to fetch admissions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/university-admissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        setAdmissions((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isActive: !isActive } : a))
        );
      }
    } catch (error) {
      console.error('Failed to toggle active:', error);
    }
  }

  async function deleteAdmission(id: string) {
    if (!confirm('Are you sure you want to delete this admission?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/university-admissions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAdmissions((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete admission:', error);
    }
  }

  // Filter by search and calendar type
  const filteredAdmissions = admissions.filter((a) => {
    const matchesSearch =
      a.universityNameEn.toLowerCase().includes(search.toLowerCase()) ||
      a.universityNameAr.includes(search) ||
      a.city.toLowerCase().includes(search.toLowerCase());

    const matchesCalendar =
      calendarFilter === 'all' || a.calendarType === calendarFilter;

    return matchesSearch && matchesCalendar;
  });

  // Count admissions by calendar type
  const countByType = {
    all: admissions.length,
    bachelor: admissions.filter((a) => a.calendarType === 'bachelor').length,
    'masters-phd': admissions.filter((a) => a.calendarType === 'masters-phd').length,
    summer: admissions.filter((a) => a.calendarType === 'summer').length,
  };

  const getStatusBadge = (startDate: string, endDate: string) => {
    const status = getRegistrationStatus(startDate, endDate);
    const statusConfig = {
      open: {
        label: 'Open',
        className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      },
      'ending-soon': {
        label: 'Ending Soon',
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      },
      upcoming: {
        label: 'Upcoming',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      },
      ended: {
        label: 'Ended',
        className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
      },
    };
    const config = statusConfig[status];
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getCalendarTypeBadge = (type: string) => {
    const typeConfig: Record<string, { icon: typeof GraduationCap; label: string; className: string }> = {
      bachelor: {
        icon: GraduationCap,
        label: 'Bachelor',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      },
      'masters-phd': {
        icon: School,
        label: 'Masters/PhD',
        className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      },
      summer: {
        icon: Sun,
        label: 'Summer',
        className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      },
    };
    const config = typeConfig[type] || typeConfig.bachelor;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.className}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const calendarTabs: { value: CalendarFilter; label: string; icon: typeof LayoutGrid; color: string }[] = [
    { value: 'all', label: 'All', icon: LayoutGrid, color: 'bg-gray-600' },
    { value: 'bachelor', label: 'Bachelor', icon: GraduationCap, color: 'bg-blue-600' },
    { value: 'masters-phd', label: 'Masters & PhD', icon: School, color: 'bg-purple-600' },
    { value: 'summer', label: 'Summer', icon: Sun, color: 'bg-orange-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <SkeletonTable columns={7} rows={8} showHeader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            University Admissions
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {filteredAdmissions.length} of {admissions.length} admissions
          </p>
        </div>
        <Link
          href={`/${locale}/admin/university-admissions/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Add Admission
        </Link>
      </div>

      {/* Calendar Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {calendarTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = calendarFilter === tab.value;
          const count = countByType[tab.value];
          return (
            <button
              key={tab.value}
              onClick={() => setCalendarFilter(tab.value)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? `${tab.color} text-white shadow-md`
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search admissions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-gray-800">
        <table className="w-full">
          <thead className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                University
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Registration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAdmissions.map((admission) => (
              <tr key={admission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {admission.universityNameEn}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                      {admission.universityNameAr}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {admission.city}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {getCalendarTypeBadge(admission.calendarType)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(admission.registrationStart).toLocaleDateString()} -{' '}
                      {new Date(admission.registrationEnd).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {admission.isFreeApplication ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Free
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <DollarSign className="h-4 w-4" />
                      {admission.applicationFee} {admission.applicationFeeCurrency}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {getStatusBadge(admission.registrationStart, admission.registrationEnd)}
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        admission.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {admission.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(admission.id, admission.isActive)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600"
                      title={admission.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {admission.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/${locale}/admin/university-admissions/${admission.id}/edit`}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteAdmission(admission.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAdmissions.length === 0 && (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            {search || calendarFilter !== 'all'
              ? 'No admissions match your filters'
              : 'No admissions to display'}
          </div>
        )}
      </div>
    </div>
  );
}
