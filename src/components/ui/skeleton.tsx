import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)}
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4 mb-4" />

        {/* Info rows with icon placeholders */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBlogCard() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <Skeleton className="h-5 w-16 rounded-full mb-3" />

        {/* Title */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-4/5 mb-3" />

        {/* Excerpt */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />

        {/* Meta */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBlogFeatured() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="lg:flex">
        {/* Image */}
        <div className="lg:w-1/2">
          <Skeleton className="h-64 lg:h-full lg:min-h-[400px] w-full rounded-none" />
        </div>

        {/* Content */}
        <div className="lg:w-1/2 p-6 lg:p-8">
          {/* Category */}
          <Skeleton className="h-5 w-24 rounded-full mb-4" />

          {/* Title */}
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-4/5 mb-4" />

          {/* Excerpt */}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />

          {/* Author & Meta */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <Skeleton className="h-12 w-12 rounded-full" />

        <div className="flex-1">
          {/* Value */}
          <Skeleton className="h-8 w-20 mb-2" />
          {/* Label */}
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonTableProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  showSearch?: boolean;
}

function SkeletonTable({ columns = 4, rows = 5, showHeader = true, showSearch = false }: SkeletonTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Search bar */}
      {showSearch && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Skeleton className="h-10 w-64" />
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-4"
              style={{ width: `${Math.random() * 40 + 60}px` }}
            />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className="h-4"
                style={{ width: `${Math.random() * 60 + 40}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonProfile() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <Skeleton className="h-24 w-24 rounded-full" />

          <div className="flex-1 text-center sm:text-start">
            {/* Name */}
            <Skeleton className="h-7 w-48 mb-2 mx-auto sm:mx-0" />
            {/* Email */}
            <Skeleton className="h-4 w-64 mb-3 mx-auto sm:mx-0" />
            {/* Bio */}
            <Skeleton className="h-4 w-full max-w-md mb-1" />
            <Skeleton className="h-4 w-3/4 max-w-sm" />
          </div>

          {/* Edit button */}
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Saved Scholarships */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonSavedItem key={i} />
        ))}
      </div>
    </div>
  );
}

function SkeletonSavedItem() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex gap-4">
        {/* Image */}
        <Skeleton className="h-20 w-28 rounded-md shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <Skeleton className="h-5 w-3/4 mb-2" />
          {/* University */}
          <Skeleton className="h-4 w-1/2 mb-2" />
          {/* Date */}
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Status badge */}
        <Skeleton className="h-6 w-20 rounded-full shrink-0" />
      </div>
    </div>
  );
}

function SkeletonCalendar() {
  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Calendar Grid */}
      <div className="lg:col-span-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 rounded-md bg-gray-50 dark:bg-gray-900">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      {/* Title */}
      <Skeleton className="h-6 w-40 mb-6" />

      {/* Chart placeholder */}
      <div className="h-64 flex items-end justify-around gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t-sm"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-around mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

function SkeletonContactList() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-start gap-3">
            {/* Avatar */}
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />

            <div className="flex-1 min-w-0">
              {/* Name & Date */}
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              {/* Subject */}
              <Skeleton className="h-4 w-3/4 mb-1" />
              {/* Preview */}
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonContactDetail() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Skeleton className="h-6 w-64 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* Message Body */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full mt-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function SkeletonTestimonial() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:p-6">
      {/* Header with avatar */}
      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
        <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
        <div>
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>

      {/* Quote */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

function SkeletonFilterSidebar() {
  return (
    <div className="space-y-6">
      {/* Filter Group 1 */}
      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Filter Group 2 */}
      <div>
        <Skeleton className="h-5 w-28 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Filter Group 3 */}
      <div>
        <Skeleton className="h-5 w-20 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonBlogCard,
  SkeletonBlogFeatured,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonProfile,
  SkeletonSavedItem,
  SkeletonCalendar,
  SkeletonChart,
  SkeletonContactList,
  SkeletonContactDetail,
  SkeletonTestimonial,
  SkeletonFilterSidebar,
};
