'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ClipboardList, Check, X, Trash2, ExternalLink, Clock, FileText, GraduationCap, MapPin } from 'lucide-react';

interface PastExam {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string | null;
  subject: string;
  facultyId: string | null;
  specialtyId: string | null;
  uploaderRole: string;
  countryId: string;
  countryName: string;
  universityId: string;
  universityName: string;
  degreeId: string;
  degreeName: string;
  semester: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionNote: string | null;
  reviewedAt: string | null;
  uploadedAt: string;
  editedAt: string | null;
  examType: string;
  year: string;
  professorName: string | null;
  viewCount: number;
  downloadCount: number;
}

type TabFilter = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';

const examTypeLabels: Record<string, { en: string; ar: string; color: string }> = {
  MIDTERM: { en: 'Midterm', ar: 'نصفي', color: 'bg-blue-100 text-blue-700' },
  FINAL: { en: 'Final', ar: 'نهائي', color: 'bg-red-100 text-red-700' },
  QUIZ: { en: 'Quiz', ar: 'كويز', color: 'bg-yellow-100 text-yellow-700' },
  ASSIGNMENT: { en: 'Assignment', ar: 'واجب', color: 'bg-purple-100 text-purple-700' },
  PRACTICAL: { en: 'Practical', ar: 'عملي', color: 'bg-green-100 text-green-700' },
};

export default function PastExamsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  const [exams, setExams] = useState<PastExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>('PENDING');
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedExam, setSelectedExam] = useState<PastExam | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, [activeTab]);

  async function fetchExams() {
    try {
      setLoading(true);
      const statusParam = activeTab !== 'ALL' ? `&status=${activeTab}` : '';
      const res = await fetch(`/api/admin/past-exams?limit=100${statusParam}`);
      if (res.ok) {
        const data = await res.json();
        setExams(data.exams);
        setPendingCount(data.pendingCount);
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  }

  async function approveExam(id: string) {
    try {
      const res = await fetch(`/api/admin/past-exams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (res.ok) {
        setExams((prev) => prev.map((e) => e.id === id ? { ...e, status: 'APPROVED', reviewedAt: new Date().toISOString() } : e));
        setPendingCount((prev) => Math.max(0, prev - 1));
        if (selectedExam?.id === id) {
          setSelectedExam((prev) => prev ? { ...prev, status: 'APPROVED', reviewedAt: new Date().toISOString() } : prev);
        }
      }
    } catch (error) {
      console.error('Failed to approve exam:', error);
    }
  }

  async function rejectExam(id: string) {
    try {
      const res = await fetch(`/api/admin/past-exams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', rejectionNote: rejectionNote || undefined }),
      });
      if (res.ok) {
        setExams((prev) => prev.map((e) => e.id === id ? { ...e, status: 'REJECTED', rejectionNote, reviewedAt: new Date().toISOString() } : e));
        setPendingCount((prev) => Math.max(0, prev - 1));
        setShowRejectModal(null);
        setRejectionNote('');
        if (selectedExam?.id === id) {
          setSelectedExam((prev) => prev ? { ...prev, status: 'REJECTED', rejectionNote, reviewedAt: new Date().toISOString() } : prev);
        }
      }
    } catch (error) {
      console.error('Failed to reject exam:', error);
    }
  }

  async function deleteExam(id: string) {
    const msg = isRTL ? 'هل أنت متأكد من حذف هذا الامتحان نهائياً؟' : 'Are you sure you want to permanently delete this exam?';
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`/api/admin/past-exams/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const exam = exams.find((e) => e.id === id);
        if (exam?.status === 'PENDING') {
          setPendingCount((prev) => Math.max(0, prev - 1));
        }
        setExams((prev) => prev.filter((e) => e.id !== id));
        if (selectedExam?.id === id) setSelectedExam(null);
      }
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  const typeColors: Record<string, string> = {
    pdf: 'bg-red-100 text-red-700',
    docx: 'bg-blue-100 text-blue-700',
    pptx: 'bg-orange-100 text-orange-700',
    folder: 'bg-green-100 text-green-700',
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, { en: string; ar: string }> = {
    PENDING: { en: 'Pending', ar: 'قيد المراجعة' },
    APPROVED: { en: 'Approved', ar: 'مقبول' },
    REJECTED: { en: 'Rejected', ar: 'مرفوض' },
  };

  const roleLabels: Record<string, { en: string; ar: string }> = {
    student: { en: 'Student', ar: 'طالب' },
    teacher: { en: 'Professor', ar: 'أستاذ' },
    ta: { en: 'TA', ar: 'معيد' },
    other: { en: 'Other', ar: 'أخرى' },
  };

  const tabs: { key: TabFilter; en: string; ar: string }[] = [
    { key: 'PENDING', en: 'Pending', ar: 'قيد المراجعة' },
    { key: 'APPROVED', en: 'Approved', ar: 'مقبول' },
    { key: 'REJECTED', en: 'Rejected', ar: 'مرفوض' },
    { key: 'ALL', en: 'All', ar: 'الكل' },
  ];

  if (loading && exams.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl shadow-sm animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? 'الامتحانات السابقة' : 'Past Exams'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isRTL
            ? `${pendingCount} امتحانات بانتظار المراجعة`
            : `${pendingCount} exams pending review`}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedExam(null); }}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg ${
              activeTab === tab.key
                ? 'bg-white text-primary-700 border border-gray-200 border-b-white -mb-px'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isRTL ? tab.ar : tab.en}
            {tab.key === 'PENDING' && pendingCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-yellow-500 px-1.5 text-xs font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exams list */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="max-h-[700px] divide-y divide-gray-100 overflow-y-auto">
            {exams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <ClipboardList className="h-12 w-12 mb-3" />
                <p className="text-sm font-medium">
                  {isRTL ? 'لا توجد امتحانات' : 'No exams found'}
                </p>
              </div>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                    selectedExam?.id === exam.id ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => setSelectedExam(exam)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{exam.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[exam.type] || 'bg-gray-100 text-gray-700'}`}>
                          {exam.type.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${examTypeLabels[exam.examType]?.color || 'bg-gray-100 text-gray-700'}`}>
                          {isRTL ? examTypeLabels[exam.examType]?.ar : examTypeLabels[exam.examType]?.en}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs font-medium">
                          {exam.year}
                        </span>
                        {activeTab === 'ALL' && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[exam.status]}`}>
                            {isRTL ? statusLabels[exam.status].ar : statusLabels[exam.status].en}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{exam.subject}</p>
                      {exam.professorName && (
                        <p className="text-xs text-gray-500 mb-1">
                          {isRTL ? 'أ.' : 'Prof.'} {exam.professorName}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{exam.countryName} &rsaquo; {exam.universityName} &rsaquo; {exam.degreeName} &rsaquo; {exam.semester}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(exam.uploadedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {isRTL ? roleLabels[exam.uploaderRole]?.ar : roleLabels[exam.uploaderRole]?.en}
                        </span>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {exam.status === 'PENDING' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); approveExam(exam.id); }}
                            className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                            title={isRTL ? 'موافقة' : 'Approve'}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowRejectModal(exam.id); }}
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                            title={isRTL ? 'رفض' : 'Reject'}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <a
                        href={exam.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                        title={isRTL ? 'فتح الرابط' : 'Open URL'}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteExam(exam.id); }}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title={isRTL ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          {selectedExam ? (
            <div>
              <div className="mb-6 border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedExam.title}</h2>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[selectedExam.status]}`}>
                    {isRTL ? statusLabels[selectedExam.status].ar : statusLabels[selectedExam.status].en}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{selectedExam.subject}</p>
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'نوع الامتحان' : 'Exam Type'}</dt>
                  <dd><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${examTypeLabels[selectedExam.examType]?.color}`}>{isRTL ? examTypeLabels[selectedExam.examType]?.ar : examTypeLabels[selectedExam.examType]?.en}</span></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'السنة' : 'Year'}</dt>
                  <dd className="text-gray-900">{selectedExam.year}</dd>
                </div>
                {selectedExam.professorName && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">{isRTL ? 'اسم الأستاذ' : 'Professor'}</dt>
                    <dd className="text-gray-900">{selectedExam.professorName}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'النوع' : 'File Type'}</dt>
                  <dd><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[selectedExam.type] || 'bg-gray-100 text-gray-700'}`}>{selectedExam.type.toUpperCase()}</span></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'رُفعت بواسطة' : 'Uploaded by'}</dt>
                  <dd className="text-gray-900">{isRTL ? roleLabels[selectedExam.uploaderRole]?.ar : roleLabels[selectedExam.uploaderRole]?.en}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'الدولة' : 'Country'}</dt>
                  <dd className="text-gray-900">{selectedExam.countryName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'الجامعة' : 'University'}</dt>
                  <dd className="text-gray-900">{selectedExam.universityName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'المرحلة' : 'Degree'}</dt>
                  <dd className="text-gray-900">{selectedExam.degreeName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'الفصل' : 'Semester'}</dt>
                  <dd className="text-gray-900">{selectedExam.semester}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'المشاهدات' : 'Views'}</dt>
                  <dd className="text-gray-900">{selectedExam.viewCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'التحميلات' : 'Downloads'}</dt>
                  <dd className="text-gray-900">{selectedExam.downloadCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{isRTL ? 'تاريخ الرفع' : 'Uploaded'}</dt>
                  <dd className="text-gray-900">{formatDate(selectedExam.uploadedAt)}</dd>
                </div>
                {selectedExam.reviewedAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">{isRTL ? 'تاريخ المراجعة' : 'Reviewed'}</dt>
                    <dd className="text-gray-900">{formatDate(selectedExam.reviewedAt)}</dd>
                  </div>
                )}
                {selectedExam.description && (
                  <div>
                    <dt className="text-gray-500 mb-1">{isRTL ? 'الوصف' : 'Description'}</dt>
                    <dd className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 text-sm">{selectedExam.description}</dd>
                  </div>
                )}
                {selectedExam.rejectionNote && (
                  <div>
                    <dt className="text-red-500 mb-1">{isRTL ? 'سبب الرفض' : 'Rejection Note'}</dt>
                    <dd className="text-red-700 bg-red-50 rounded-lg p-3 text-sm">{selectedExam.rejectionNote}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={selectedExam.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white transition-colors hover:bg-primary-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  {isRTL ? 'فتح الرابط' : 'Open URL'}
                </a>
                {selectedExam.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => approveExam(selectedExam.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm text-green-700 transition-colors hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                      {isRTL ? 'موافقة' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(selectedExam.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      {isRTL ? 'رفض' : 'Reject'}
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteExam(selectedExam.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isRTL ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">
                  {isRTL ? 'اختر امتحان لعرض تفاصيله' : 'Select an exam to view details'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rejection modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowRejectModal(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isRTL ? 'رفض الامتحان' : 'Reject Exam'}
            </h3>
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder={isRTL ? 'سبب الرفض (اختياري)...' : 'Rejection reason (optional)...'}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setShowRejectModal(null); setRejectionNote(''); }}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => rejectExam(showRejectModal)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                {isRTL ? 'تأكيد الرفض' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
