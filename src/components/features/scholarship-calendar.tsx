'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Clock,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getLocalizedField, formatDate, getDaysUntilDeadline } from '@/lib/utils';

interface CalendarScholarship {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  university: string;
  universityAr: string;
  country: string;
  countryAr: string;
  deadline: string;
  image: string;
  fundingType: string;
  levels: string[];
}

interface ScholarshipCalendarProps {
  scholarships: CalendarScholarship[];
  locale: string;
}

type ViewMode = 'calendar' | 'timeline';

export function ScholarshipCalendar({ scholarships, locale }: ScholarshipCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isRTL = locale === 'ar';

  // Get month/year display
  const monthNames = isRTL
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = isRTL
    ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group scholarships by date
  const scholarshipsByDate = useMemo(() => {
    const grouped: Record<string, CalendarScholarship[]> = {};
    scholarships.forEach((s) => {
      const dateKey = new Date(s.deadline).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(s);
    });
    return grouped;
  }, [scholarships]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: (Date | null)[] = [];

    // Add padding for days before first of month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [currentDate]);

  // Navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get deadline color based on days remaining
  const getDeadlineColor = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    if (days <= 7) return 'bg-red-500';
    if (days <= 30) return 'bg-amber-500';
    return 'bg-green-500';
  };

  // Get scholarships for selected date
  const selectedDateScholarships = selectedDate
    ? scholarshipsByDate[selectedDate.toDateString()] || []
    : [];

  return (
    <div className="space-y-4">
      {/* Header with view toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          {isRTL ? 'تقويم المنح الدراسية' : 'Scholarship Calendar'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            {isRTL ? 'التقويم' : 'Calendar'}
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <List className="h-4 w-4" />
            {isRTL ? 'الجدول الزمني' : 'Timeline'}
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <Card className="lg:col-span-2 p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={isRTL ? goToNextMonth : goToPrevMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={goToToday}
                  className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                >
                  {isRTL ? 'اليوم' : 'Today'}
                </button>
              </div>
              <button
                onClick={isRTL ? goToPrevMonth : goToNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-12 sm:h-16" />;
                }

                const dateKey = date.toDateString();
                const deadlines = scholarshipsByDate[dateKey] || [];
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate?.toDateString() === dateKey;
                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                return (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDate(date)}
                    disabled={deadlines.length === 0}
                    className={`h-12 sm:h-16 p-1 rounded-lg text-sm transition-all relative ${
                      isSelected
                        ? 'bg-primary-100 dark:bg-primary-900 ring-2 ring-primary-500'
                        : deadlines.length > 0
                        ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                        : 'cursor-default'
                    } ${isPast && deadlines.length === 0 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full ${
                        isToday
                          ? 'bg-primary-600 text-white'
                          : ''
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {deadlines.length > 0 && (
                      <div className="flex justify-center gap-0.5 mt-1">
                        {deadlines.slice(0, 3).map((s, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${getDeadlineColor(s.deadline)}`}
                          />
                        ))}
                        {deadlines.length > 3 && (
                          <span className="text-[10px] text-gray-500">+{deadlines.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>{isRTL ? '< 7 أيام' : '< 7 days'}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{isRTL ? '7-30 يوم' : '7-30 days'}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{isRTL ? '> 30 يوم' : '> 30 days'}</span>
              </div>
            </div>
          </Card>

          {/* Selected date details */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-4">
              {selectedDate
                ? formatDate(selectedDate.toISOString(), locale)
                : isRTL
                ? 'اختر تاريخاً'
                : 'Select a date'}
            </h3>
            {selectedDateScholarships.length > 0 ? (
              <div className="space-y-3">
                {selectedDateScholarships.map((s) => (
                  <Link
                    key={s.id}
                    href={`/${locale}/scholarships/${s.slug}`}
                    className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={s.image}
                          alt={getLocalizedField(s, 'title', locale)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-50 text-sm line-clamp-2">
                          {getLocalizedField(s, 'title', locale)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {getLocalizedField(s, 'university', locale)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {selectedDate
                  ? isRTL
                    ? 'لا توجد مواعيد نهائية في هذا اليوم'
                    : 'No deadlines on this date'
                  : isRTL
                  ? 'انقر على تاريخ لعرض المنح الدراسية'
                  : 'Click on a date to view scholarships'}
              </p>
            )}
          </Card>
        </div>
      ) : (
        /* Timeline View */
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-6">
            {isRTL ? 'المواعيد النهائية القادمة' : 'Upcoming Deadlines'}
          </h3>
          <div className="space-y-4">
            {scholarships.length > 0 ? (
              scholarships.map((scholarship) => {
                const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                return (
                  <Link
                    key={scholarship.id}
                    href={`/${locale}/scholarships/${scholarship.slug}`}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Date indicator */}
                    <div className="shrink-0 text-center">
                      <div
                        className={`w-3 h-3 rounded-full mx-auto mb-2 ${getDeadlineColor(scholarship.deadline)}`}
                      />
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {new Date(scholarship.deadline).toLocaleDateString(
                          isRTL ? 'ar-EG' : 'en-US',
                          { month: 'short', day: 'numeric' }
                        )}
                      </div>
                    </div>

                    {/* Scholarship info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                          <Image
                            src={scholarship.image}
                            alt={getLocalizedField(scholarship, 'title', locale)}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-50 line-clamp-1">
                            {getLocalizedField(scholarship, 'title', locale)}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3.5 w-3.5" />
                              {getLocalizedField(scholarship, 'university', locale)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {getLocalizedField(scholarship, 'country', locale)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={daysLeft <= 7 ? 'error' : daysLeft <= 30 ? 'warning' : 'success'}
                              className="text-xs"
                            >
                              <Clock className="h-3 w-3 me-1" />
                              {daysLeft} {isRTL ? 'يوم متبقي' : 'days left'}
                            </Badge>
                            {scholarship.fundingType === 'FULLY_FUNDED' && (
                              <Badge variant="success" className="text-xs">
                                {isRTL ? 'ممولة بالكامل' : 'Fully Funded'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                {isRTL
                  ? 'لا توجد مواعيد نهائية قادمة'
                  : 'No upcoming deadlines'}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
