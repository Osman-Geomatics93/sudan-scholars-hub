'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BookOpen, Check, X, Trash2, ExternalLink, Clock, FileText, GraduationCap, MapPin } from 'lucide-react';

interface StudyMaterial {
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
  createdAt: string;
}

type TabFilter = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';

export default function StudyMaterialsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>('PENDING');
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, [activeTab]);

  async function fetchMaterials() {
    try {
      setLoading(true);
      const statusParam = activeTab !== 'ALL' ? `&status=${activeTab}` : '';
      const res = await fetch(`/api/admin/study-materials?limit=100${statusParam}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials);
        setPendingCount(data.pendingCount);
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  }

  async function approveMaterial(id: string) {
    try {
      const res = await fetch(`/api/admin/study-materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (res.ok) {
        setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, status: 'APPROVED', reviewedAt: new Date().toISOString() } : m));
        setPendingCount((prev) => Math.max(0, prev - 1));
        if (selectedMaterial?.id === id) {
          setSelectedMaterial((prev) => prev ? { ...prev, status: 'APPROVED', reviewedAt: new Date().toISOString() } : prev);
        }
      }
    } catch (error) {
      console.error('Failed to approve material:', error);
    }
  }

  async function rejectMaterial(id: string) {
    try {
      const res = await fetch(`/api/admin/study-materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', rejectionNote: rejectionNote || undefined }),
      });
      if (res.ok) {
        setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, status: 'REJECTED', rejectionNote, reviewedAt: new Date().toISOString() } : m));
        setPendingCount((prev) => Math.max(0, prev - 1));
        setShowRejectModal(null);
        setRejectionNote('');
        if (selectedMaterial?.id === id) {
          setSelectedMaterial((prev) => prev ? { ...prev, status: 'REJECTED', rejectionNote, reviewedAt: new Date().toISOString() } : prev);
        }
      }
    } catch (error) {
      console.error('Failed to reject material:', error);
    }
  }

  async function deleteMaterial(id: string) {
    const msg = isRTL ? 'هل أنت متأكد من حذف هذه المادة نهائياً؟' : 'Are you sure you want to permanently delete this material?';
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`/api/admin/study-materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const material = materials.find((m) => m.id === id);
        if (material?.status === 'PENDING') {
          setPendingCount((prev) => Math.max(0, prev - 1));
        }
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        if (selectedMaterial?.id === id) setSelectedMaterial(null);
      }
    } catch (error) {
      console.error('Failed to delete material:', error);
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
    video: 'bg-purple-100 text-purple-700',
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

  if (loading && materials.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          {isRTL ? 'المواد الدراسية' : 'Study Materials'}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {isRTL
            ? `${pendingCount} مواد بانتظار المراجعة`
            : `${pendingCount} materials pending review`}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedMaterial(null); }}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-900 text-primary-700 dark:text-primary-400 border border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-900 -mb-px'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
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
        {/* Materials list */}
        <div className="rounded-xl bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-900/50">
          <div className="max-h-[700px] divide-y divide-gray-100 dark:divide-gray-800 overflow-y-auto">
            {materials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <BookOpen className="h-12 w-12 mb-3" />
                <p className="text-sm font-medium">
                  {isRTL ? 'لا توجد مواد' : 'No materials found'}
                </p>
              </div>
            ) : (
              materials.map((mat) => (
                <div
                  key={mat.id}
                  className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedMaterial?.id === mat.id ? 'bg-primary-50 dark:bg-primary-950/50' : ''
                  }`}
                  onClick={() => setSelectedMaterial(mat)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50 truncate">{mat.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[mat.type] || 'bg-gray-100 text-gray-700'}`}>
                          {mat.type.toUpperCase()}
                        </span>
                        {activeTab === 'ALL' && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[mat.status]}`}>
                            {isRTL ? statusLabels[mat.status].ar : statusLabels[mat.status].en}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{mat.subject}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{mat.countryName} &rsaquo; {mat.universityName} &rsaquo; {mat.degreeName} &rsaquo; {mat.semester}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(mat.uploadedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {isRTL ? roleLabels[mat.uploaderRole]?.ar : roleLabels[mat.uploaderRole]?.en}
                        </span>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {mat.status === 'PENDING' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); approveMaterial(mat.id); }}
                            className="rounded-lg p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors"
                            title={isRTL ? 'موافقة' : 'Approve'}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowRejectModal(mat.id); }}
                            className="rounded-lg p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                            title={isRTL ? 'رفض' : 'Reject'}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
                        title={isRTL ? 'فتح الرابط' : 'Open URL'}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMaterial(mat.id); }}
                        className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 transition-colors"
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
        <div className="rounded-xl bg-white dark:bg-gray-900 p-6 shadow-sm dark:shadow-gray-900/50">
          {selectedMaterial ? (
            <div>
              <div className="mb-6 border-b dark:border-gray-700 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{selectedMaterial.title}</h2>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[selectedMaterial.status]}`}>
                    {isRTL ? statusLabels[selectedMaterial.status].ar : statusLabels[selectedMaterial.status].en}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMaterial.subject}</p>
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'النوع' : 'Type'}</dt>
                  <dd><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[selectedMaterial.type] || 'bg-gray-100 text-gray-700'}`}>{selectedMaterial.type.toUpperCase()}</span></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'رُفعت بواسطة' : 'Uploaded by'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{isRTL ? roleLabels[selectedMaterial.uploaderRole]?.ar : roleLabels[selectedMaterial.uploaderRole]?.en}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'الدولة' : 'Country'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.countryName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'الجامعة' : 'University'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.universityName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'المرحلة' : 'Degree'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.degreeName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'الفصل' : 'Semester'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.semester}</dd>
                </div>
                {selectedMaterial.facultyId && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'الكلية' : 'Faculty'}</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.facultyId}</dd>
                  </div>
                )}
                {selectedMaterial.specialtyId && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'التخصص' : 'Specialty'}</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.specialtyId}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'تاريخ الرفع' : 'Uploaded'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{formatDate(selectedMaterial.uploadedAt)}</dd>
                </div>
                {selectedMaterial.reviewedAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">{isRTL ? 'تاريخ المراجعة' : 'Reviewed'}</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{formatDate(selectedMaterial.reviewedAt)}</dd>
                  </div>
                )}
                {selectedMaterial.description && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">{isRTL ? 'الوصف' : 'Description'}</dt>
                    <dd className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">{selectedMaterial.description}</dd>
                  </div>
                )}
                {selectedMaterial.rejectionNote && (
                  <div>
                    <dt className="text-red-500 dark:text-red-400 mb-1">{isRTL ? 'سبب الرفض' : 'Rejection Note'}</dt>
                    <dd className="text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg p-3 text-sm">{selectedMaterial.rejectionNote}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={selectedMaterial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 dark:bg-primary-500 px-4 py-2 text-sm text-white transition-colors hover:bg-primary-700 dark:hover:bg-primary-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  {isRTL ? 'فتح الرابط' : 'Open URL'}
                </a>
                {selectedMaterial.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => approveMaterial(selectedMaterial.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-800 px-4 py-2 text-sm text-green-700 dark:text-green-400 transition-colors hover:bg-green-50 dark:hover:bg-green-950/50"
                    >
                      <Check className="h-4 w-4" />
                      {isRTL ? 'موافقة' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(selectedMaterial.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800 px-4 py-2 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/50"
                    >
                      <X className="h-4 w-4" />
                      {isRTL ? 'رفض' : 'Reject'}
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteMaterial(selectedMaterial.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isRTL ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="mt-2">
                  {isRTL ? 'اختر مادة لعرض تفاصيلها' : 'Select a material to view details'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rejection modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowRejectModal(null)}>
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
              {isRTL ? 'رفض المادة' : 'Reject Material'}
            </h3>
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder={isRTL ? 'سبب الرفض (اختياري)...' : 'Rejection reason (optional)...'}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 p-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setShowRejectModal(null); setRejectionNote(''); }}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => rejectMaterial(showRejectModal)}
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
