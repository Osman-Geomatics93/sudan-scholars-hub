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
} from 'lucide-react';

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

export default function AdminProfessorReviewsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  const [reviews, setReviews] = useState<ProfessorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [selectedReview, setSelectedReview] = useState<ProfessorReview | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/professor-reviews?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setTotal(data.total || 0);
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
  }, [search]);

  async function deleteReview(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/professor-reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        if (selectedReview?.id === id) setSelectedReview(null);
        setTotal((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    } finally {
      setActionLoading(null);
      setShowDeleteModal(null);
    }
  }

  const filteredReviews = reviews;

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
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? 'إدارة تقييمات الأساتذة' : 'Manage Professor Reviews'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isRTL
            ? `${total} تقييم إجمالاً`
            : `${total} reviews total`}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          placeholder={isRTL ? 'البحث بالأستاذ، المادة، الجامعة...' : 'Search by professor, course, university...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-lg border border-gray-300 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
          }`}
        />
      </div>

      {/* Two-column layout: list + detail */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Review List */}
        <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto">
          {filteredReviews.length === 0 ? (
            <div className="rounded-xl bg-white py-12 text-center text-gray-500 shadow-sm">
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              {isRTL ? 'لا توجد تقييمات' : 'No reviews found'}
            </div>
          ) : (
            filteredReviews.map((review) => (
              <button
                key={review.id}
                onClick={() => setSelectedReview(review)}
                className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                  selectedReview?.id === review.id
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{review.professorName}</h3>
                  <div className="shrink-0 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                  <BookOpen className="inline h-3 w-3 mr-1" /> {review.courseName}
                </p>
                <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
                  <Building2 className="inline h-3 w-3 mr-1" /> {review.universityName}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {review.isAnonymous ? (isRTL ? 'مجهول' : 'Anonymous') : (review.user?.name || 'Unknown')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(review.createdAt).toLocaleDateString(isRTL ? 'ar' : 'en')}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selectedReview ? (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              {/* Professor & University */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedReview.professorName}</h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedReview.universityName}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{selectedReview.courseName}</span>
                </div>
              </div>

              {/* Rating & Difficulty */}
              <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {isRTL ? 'التقييم' : 'Rating'}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating value={selectedReview.rating} />
                    <span className="text-sm font-semibold text-gray-700">{selectedReview.rating}/5</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {isRTL ? 'الصعوبة' : 'Difficulty'}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating value={selectedReview.difficulty} color="text-red-400" />
                    <span className="text-sm font-semibold text-gray-700">{selectedReview.difficulty}/5</span>
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
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {isRTL ? 'الوسوم' : 'Tags'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedReview.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment */}
              {selectedReview.comment && (
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    {isRTL ? 'التعليق' : 'Comment'}
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>
              )}

              {/* User info */}
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                {selectedReview.user?.image ? (
                  <img src={selectedReview.user.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedReview.isAnonymous
                      ? (isRTL ? 'مجهول' : 'Anonymous')
                      : (selectedReview.user?.name || 'Unknown User')}
                  </p>
                  <p className="text-sm text-gray-500">{selectedReview.user?.email}</p>
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
              <div className="border-t pt-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  {isRTL ? 'إجراءات الإدارة' : 'Admin Actions'}
                </p>
                <div className="flex flex-wrap gap-2">
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
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
              <MessageSquare className="mb-3 h-10 w-10" />
              <p>{isRTL ? 'اختر تقييماً لعرض التفاصيل' : 'Select a review to view details'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowDeleteModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {isRTL ? 'حذف التقييم' : 'Delete Review'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'هذا الإجراء لا يمكن التراجع عنه. سيتم إخطار صاحب التقييم.' : 'This action cannot be undone. The reviewer will be notified.'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
