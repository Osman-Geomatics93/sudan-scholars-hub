'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Trash2,
  Star,
  User,
  Calendar,
  BookOpen,
  GraduationCap,
  Building2,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  MessageSquare,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
} from 'lucide-react';

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface ProfessorReview {
  id: string;
  professorName: string;
  universityId: string;
  universityName: string;
  courseName: string;
  rating: number;
  difficulty: number;
  wouldTakeAgain: boolean;
  comment: string | null;
  tags: string[];
  isAnonymous: boolean;
  userId: string;
  userName: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

function StarRating({ value, max = 5, color = 'text-yellow-400' }: { value: number; max?: number; color?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < value ? `${color} fill-current` : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status, isRTL }: { status: string; isRTL: boolean }) {
  const config = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: isRTL ? 'قيد المراجعة' : 'Pending' },
    APPROVED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: isRTL ? 'مقبول' : 'Approved' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: isRTL ? 'مرفوض' : 'Rejected' },
  }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: status };

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export default function AdminProfessorReviewsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  const [reviews, setReviews] = useState<ProfessorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('PENDING');
  const [selectedReview, setSelectedReview] = useState<ProfessorReview | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/professor-reviews?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setTotal(data.total || 0);
        setPendingCount(data.pendingCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReviews();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter]);

  async function approveReview(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/professor-reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (res.ok) {
        if (selectedReview?.id === id) {
          setSelectedReview((prev) => prev ? { ...prev, status: 'APPROVED', reviewedAt: new Date().toISOString(), rejectionNote: null } : null);
        }
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectReview(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/professor-reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', rejectionNote: rejectionNote || null }),
      });
      if (res.ok) {
        fetchReviews();
        if (selectedReview?.id === id) {
          setSelectedReview((prev) => prev ? { ...prev, status: 'REJECTED', reviewedAt: new Date().toISOString(), rejectionNote: rejectionNote || null } : null);
        }
      }
    } catch (error) {
      console.error('Failed to reject review:', error);
    } finally {
      setActionLoading(null);
      setShowRejectModal(null);
      setRejectionNote('');
    }
  }

  async function deleteReview(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/professor-reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        if (selectedReview?.id === id) setSelectedReview(null);
        setTotal((prev) => prev - 1);
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    } finally {
      setActionLoading(null);
      setShowDeleteModal(null);
    }
  }

  const statusTabs: { key: StatusFilter; label: string; labelAr: string }[] = [
    { key: 'PENDING', label: 'Pending', labelAr: 'قيد المراجعة' },
    { key: 'APPROVED', label: 'Approved', labelAr: 'مقبول' },
    { key: 'REJECTED', label: 'Rejected', labelAr: 'مرفوض' },
    { key: 'ALL', label: 'All', labelAr: 'الكل' },
  ];

  if (loading && reviews.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {isRTL ? 'إدارة تقييمات الأساتذة' : 'Manage Professor Reviews'}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {isRTL
            ? `${total} تقييم إجمالاً`
            : `${total} reviews total`}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`relative inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              statusFilter === tab.key
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {isRTL ? tab.labelAr : tab.label}
            {tab.key === 'PENDING' && pendingCount > 0 && (
              <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold leading-none ${
                statusFilter === 'PENDING'
                  ? 'bg-white text-primary-600'
                  : 'bg-yellow-500 text-white'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          placeholder={isRTL ? 'البحث بالأستاذ، المادة، الجامعة...' : 'Search by professor, course, university...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
          }`}
        />
      </div>

      {/* Two-column layout: list + detail */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Review List */}
        <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto">
          {reviews.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-gray-900 py-12 text-center text-gray-500 dark:text-gray-400 shadow-sm dark:shadow-gray-900/50">
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
              {isRTL ? 'لا توجد تقييمات' : 'No reviews found'}
            </div>
          ) : (
            reviews.map((review) => (
              <button
                key={review.id}
                onClick={() => setSelectedReview(review)}
                className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                  selectedReview?.id === review.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 line-clamp-1">{review.professorName}</h3>
                  <StatusBadge status={review.status} isRTL={isRTL} />
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                  <BookOpen className="inline h-3 w-3 mr-1" /> {review.courseName}
                </p>
                <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
                  <Building2 className="inline h-3 w-3 mr-1" /> {review.universityName}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {review.isAnonymous ? (isRTL ? 'مجهول' : 'Anonymous') : (review.user?.name || 'Unknown')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(review.createdAt).toLocaleDateString(isRTL ? 'ar' : 'en')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{review.rating}/5</span>
                  </div>
                </div>
                {/* Quick action buttons for PENDING reviews in list */}
                {review.status === 'PENDING' && (
                  <div className="mt-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => approveReview(review.id)}
                      disabled={actionLoading === review.id}
                      className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {isRTL ? 'قبول' : 'Approve'}
                    </button>
                    <button
                      onClick={() => { setShowRejectModal(review.id); setRejectionNote(''); }}
                      disabled={actionLoading === review.id}
                      className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="h-3 w-3" />
                      {isRTL ? 'رفض' : 'Reject'}
                    </button>
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selectedReview ? (
            <div className="rounded-xl bg-white dark:bg-gray-900 p-6 shadow-sm dark:shadow-gray-900/50">
              {/* Status badge at top */}
              <div className="mb-4 flex items-center justify-between">
                <StatusBadge status={selectedReview.status} isRTL={isRTL} />
                {selectedReview.reviewedAt && (
                  <span className="text-xs text-gray-400">
                    {isRTL ? 'تمت المراجعة: ' : 'Reviewed: '}
                    {new Date(selectedReview.reviewedAt).toLocaleString(isRTL ? 'ar' : 'en')}
                  </span>
                )}
              </div>

              {/* Professor & University */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">{selectedReview.professorName}</h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedReview.universityName}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-4 w-4" />
                  <span>{selectedReview.courseName}</span>
                </div>
              </div>

              {/* Rating & Difficulty */}
              <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {isRTL ? 'التقييم' : 'Rating'}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating value={selectedReview.rating} />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedReview.rating}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {isRTL ? 'الصعوبة' : 'Difficulty'}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating value={selectedReview.difficulty} color="text-red-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedReview.difficulty}/5</span>
                  </div>
                </div>
              </div>

              {/* Would Take Again */}
              <div className="mb-4 flex items-center gap-2">
                {selectedReview.wouldTakeAgain ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {isRTL ? 'يأخذه مرة أخرى' : 'Would take again'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                    <ThumbsDown className="h-3.5 w-3.5" />
                    {isRTL ? 'لن يأخذه مرة أخرى' : 'Would not take again'}
                  </span>
                )}
              </div>

              {/* Tags */}
              {selectedReview.tags && selectedReview.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {isRTL ? 'الوسوم' : 'Tags'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedReview.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-50 dark:bg-primary-950/50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment */}
              {selectedReview.comment && (
                <div className="mb-4 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {isRTL ? 'التعليق' : 'Comment'}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>
              )}

              {/* Rejection Note */}
              {selectedReview.status === 'REJECTED' && selectedReview.rejectionNote && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {isRTL ? 'سبب الرفض' : 'Rejection Note'}
                  </p>
                  <p className="text-sm text-red-700 whitespace-pre-wrap">{selectedReview.rejectionNote}</p>
                </div>
              )}

              {/* User info */}
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-700 p-3">
                {selectedReview.user?.image ? (
                  <img src={selectedReview.user.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-50">
                    {selectedReview.isAnonymous
                      ? (isRTL ? 'مجهول' : 'Anonymous')
                      : (selectedReview.user?.name || 'Unknown User')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedReview.user?.email}</p>
                  {selectedReview.isAnonymous && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      {isRTL ? '(تم النشر بشكل مجهول)' : '(Posted anonymously)'}
                    </p>
                  )}
                </div>
                <span className="ml-auto text-sm text-gray-400">
                  {new Date(selectedReview.createdAt).toLocaleString(isRTL ? 'ar' : 'en')}
                </span>
              </div>

              {/* Action buttons */}
              <div className="border-t dark:border-gray-700 pt-4">
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  {isRTL ? 'إجراءات الإدارة' : 'Admin Actions'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* Approve (only for PENDING) */}
                  {selectedReview.status === 'PENDING' && (
                    <button
                      onClick={() => approveReview(selectedReview.id)}
                      disabled={actionLoading === selectedReview.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {isRTL ? 'قبول التقييم' : 'Approve Review'}
                    </button>
                  )}
                  {/* Reject (only for PENDING) */}
                  {selectedReview.status === 'PENDING' && (
                    <button
                      onClick={() => { setShowRejectModal(selectedReview.id); setRejectionNote(''); }}
                      disabled={actionLoading === selectedReview.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      {isRTL ? 'رفض التقييم' : 'Reject Review'}
                    </button>
                  )}
                  {/* Delete */}
                  <button
                    onClick={() => setShowDeleteModal(selectedReview.id)}
                    disabled={actionLoading === selectedReview.id}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isRTL ? 'حذف التقييم' : 'Delete Review'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 shadow-sm dark:shadow-gray-900/50">
              <MessageSquare className="mb-3 h-10 w-10" />
              <p>{isRTL ? 'اختر تقييماً لعرض التفاصيل' : 'Select a review to view details'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowRejectModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <XCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-50">
                  {isRTL ? 'رفض التقييم' : 'Reject Review'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL ? 'سيتم إخطار صاحب التقييم بالرفض.' : 'The reviewer will be notified about the rejection.'}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isRTL ? 'سبب الرفض (اختياري)' : 'Rejection note (optional)'}
              </label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                rows={3}
                placeholder={isRTL ? 'اكتب سبب الرفض هنا...' : 'Enter reason for rejection...'}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(null)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => rejectReview(showRejectModal)}
                disabled={actionLoading === showRejectModal}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {isRTL ? 'تأكيد الرفض' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowDeleteModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-50">
                  {isRTL ? 'حذف التقييم' : 'Delete Review'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL ? 'هذا الإجراء لا يمكن التراجع عنه. سيتم إخطار صاحب التقييم.' : 'This action cannot be undone. The reviewer will be notified.'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => deleteReview(showDeleteModal)}
                disabled={actionLoading === showDeleteModal}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isRTL ? 'حذف نهائي' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
