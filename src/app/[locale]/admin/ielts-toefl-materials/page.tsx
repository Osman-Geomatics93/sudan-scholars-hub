'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BookOpen, Check, X, Trash2, ExternalLink, Clock, FileText, Tag, Eye, Download } from 'lucide-react';

interface IeltsToeflMaterial {
  id: string;
  title: string;
  examType: string;
  section: string;
  materialType: string;
  url: string;
  description: string | null;
  difficulty: string;
  language: string;
  tags: string[] | null;
  status: 'pending' | 'approved' | 'rejected';
  viewCount: number;
  downloadCount: number;
  userName: string | null;
  userEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

type TabFilter = 'pending' | 'approved' | 'rejected' | 'all';

const materialTypeIcons: Record<string, string> = {
  pdf: '\uD83D\uDCC4',
  video: '\uD83C\uDFAC',
  audio: '\uD83C\uDFA7',
  document: '\uD83D\uDCDD',
  link: '\uD83D\uDD17',
  folder: '\uD83D\uDCC1',
};

const examColors: Record<string, string> = {
  ielts: 'bg-blue-100 text-blue-700',
  toefl: 'bg-purple-100 text-purple-700',
  both: 'bg-indigo-100 text-indigo-700',
};

const sectionColors: Record<string, string> = {
  reading: 'bg-emerald-100 text-emerald-700',
  writing: 'bg-amber-100 text-amber-700',
  listening: 'bg-cyan-100 text-cyan-700',
  speaking: 'bg-rose-100 text-rose-700',
  general: 'bg-gray-100 text-gray-700',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, { en: string; ar: string }> = {
  pending: { en: 'Pending', ar: '\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629' },
  approved: { en: 'Approved', ar: '\u0645\u0642\u0628\u0648\u0644' },
  rejected: { en: 'Rejected', ar: '\u0645\u0631\u0641\u0648\u0636' },
};

export default function IeltsToeflMaterialsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  const [materials, setMaterials] = useState<IeltsToeflMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<IeltsToeflMaterial | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, [activeTab]);

  async function fetchMaterials() {
    try {
      setLoading(true);
      const statusParam = activeTab !== 'all' ? `&status=${activeTab}` : '';
      const res = await fetch(`/api/admin/ielts-toefl-materials?limit=100${statusParam}`);
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
      const res = await fetch(`/api/admin/ielts-toefl-materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (res.ok) {
        setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, status: 'approved' } : m));
        setPendingCount((prev) => Math.max(0, prev - 1));
        if (selectedMaterial?.id === id) {
          setSelectedMaterial((prev) => prev ? { ...prev, status: 'approved' } : prev);
        }
      }
    } catch (error) {
      console.error('Failed to approve material:', error);
    }
  }

  async function rejectMaterial(id: string) {
    try {
      const res = await fetch(`/api/admin/ielts-toefl-materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionNote: rejectionNote || undefined }),
      });
      if (res.ok) {
        setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, status: 'rejected' } : m));
        setPendingCount((prev) => Math.max(0, prev - 1));
        setShowRejectModal(null);
        setRejectionNote('');
        if (selectedMaterial?.id === id) {
          setSelectedMaterial((prev) => prev ? { ...prev, status: 'rejected' } : prev);
        }
      }
    } catch (error) {
      console.error('Failed to reject material:', error);
    }
  }

  async function deleteMaterial(id: string) {
    const msg = isRTL ? '\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0647 \u0627\u0644\u0645\u0627\u062F\u0629 \u0646\u0647\u0627\u0626\u064A\u0627\u064B\u061F' : 'Are you sure you want to permanently delete this material?';
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`/api/admin/ielts-toefl-materials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const material = materials.find((m) => m.id === id);
        if (material?.status === 'pending') {
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

  const tabs: { key: TabFilter; en: string; ar: string }[] = [
    { key: 'pending', en: 'Pending', ar: '\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629' },
    { key: 'approved', en: 'Approved', ar: '\u0645\u0642\u0628\u0648\u0644' },
    { key: 'rejected', en: 'Rejected', ar: '\u0645\u0631\u0641\u0648\u0636' },
    { key: 'all', en: 'All', ar: '\u0627\u0644\u0643\u0644' },
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
          {isRTL ? '\u0645\u0648\u0627\u062F IELTS/TOEFL' : 'IELTS/TOEFL Materials'}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {isRTL
            ? `${pendingCount} \u0645\u0648\u0627\u062F \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629`
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
            {tab.key === 'pending' && pendingCount > 0 && (
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
                  {isRTL ? '\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0648\u0627\u062F' : 'No materials found'}
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
                        <span className="text-lg" title={mat.materialType}>{materialTypeIcons[mat.materialType] || '\uD83D\uDCC4'}</span>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50 truncate">{mat.title}</h3>
                        {activeTab === 'all' && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[mat.status]}`}>
                            {isRTL ? statusLabels[mat.status].ar : statusLabels[mat.status].en}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${examColors[mat.examType] || 'bg-gray-100 text-gray-700'}`}>
                          {mat.examType.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${sectionColors[mat.section] || 'bg-gray-100 text-gray-700'}`}>
                          {mat.section}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[mat.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                          {mat.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(mat.createdAt)}
                        </span>
                        {mat.userName && (
                          <span className="truncate">{mat.userName}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {mat.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {mat.downloadCount}
                        </span>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {mat.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); approveMaterial(mat.id); }}
                            className="rounded-lg p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors"
                            title={isRTL ? '\u0645\u0648\u0627\u0641\u0642\u0629' : 'Approve'}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowRejectModal(mat.id); }}
                            className="rounded-lg p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                            title={isRTL ? '\u0631\u0641\u0636' : 'Reject'}
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
                        title={isRTL ? '\u0641\u062A\u062D \u0627\u0644\u0631\u0627\u0628\u0637' : 'Open URL'}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMaterial(mat.id); }}
                        className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 transition-colors"
                        title={isRTL ? '\u062D\u0630\u0641' : 'Delete'}
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
                  <span className="text-2xl">{materialTypeIcons[selectedMaterial.materialType] || '\uD83D\uDCC4'}</span>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{selectedMaterial.title}</h2>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[selectedMaterial.status]}`}>
                    {isRTL ? statusLabels[selectedMaterial.status].ar : statusLabels[selectedMaterial.status].en}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${examColors[selectedMaterial.examType]}`}>
                    {selectedMaterial.examType.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sectionColors[selectedMaterial.section]}`}>
                    {selectedMaterial.section}
                  </span>
                </div>
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? '\u0646\u0648\u0639 \u0627\u0644\u0645\u0627\u062F\u0629' : 'Material Type'}</dt>
                  <dd className="text-gray-900 capitalize">{selectedMaterial.materialType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? '\u0627\u0644\u0635\u0639\u0648\u0628\u0629' : 'Difficulty'}</dt>
                  <dd><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[selectedMaterial.difficulty]}`}>{selectedMaterial.difficulty}</span></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? '\u0627\u0644\u0644\u063A\u0629' : 'Language'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.language === 'en' ? 'English' : selectedMaterial.language === 'ar' ? '\u0627\u0644\u0639\u0631\u0628\u064A\u0629' : 'Both'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? '\u0631\u064F\u0641\u0639\u062A \u0628\u0648\u0627\u0633\u0637\u0629' : 'Uploaded by'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.userName || selectedMaterial.userEmail || 'Unknown'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? '\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0631\u0641\u0639' : 'Uploaded'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{formatDate(selectedMaterial.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? '\u0627\u0644\u0645\u0634\u0627\u0647\u062F\u0627\u062A' : 'Views'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.viewCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{isRTL ? '\u0627\u0644\u062A\u0646\u0632\u064A\u0644\u0627\u062A' : 'Downloads'}</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{selectedMaterial.downloadCount}</dd>
                </div>
                {selectedMaterial.tags && Array.isArray(selectedMaterial.tags) && selectedMaterial.tags.length > 0 && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {isRTL ? '\u0627\u0644\u0648\u0633\u0648\u0645' : 'Tags'}
                    </dt>
                    <dd className="flex flex-wrap gap-1">
                      {selectedMaterial.tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {selectedMaterial.description && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">{isRTL ? '\u0627\u0644\u0648\u0635\u0641' : 'Description'}</dt>
                    <dd className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">{selectedMaterial.description}</dd>
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
                  {isRTL ? '\u0641\u062A\u062D \u0627\u0644\u0631\u0627\u0628\u0637' : 'Open URL'}
                </a>
                {selectedMaterial.status === 'pending' && (
                  <>
                    <button
                      onClick={() => approveMaterial(selectedMaterial.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-800 px-4 py-2 text-sm text-green-700 dark:text-green-400 transition-colors hover:bg-green-50 dark:hover:bg-green-950/50"
                    >
                      <Check className="h-4 w-4" />
                      {isRTL ? '\u0645\u0648\u0627\u0641\u0642\u0629' : 'Approve'}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(selectedMaterial.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800 px-4 py-2 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/50"
                    >
                      <X className="h-4 w-4" />
                      {isRTL ? '\u0631\u0641\u0636' : 'Reject'}
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteMaterial(selectedMaterial.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isRTL ? '\u062D\u0630\u0641' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="mt-2">
                  {isRTL ? '\u0627\u062E\u062A\u0631 \u0645\u0627\u062F\u0629 \u0644\u0639\u0631\u0636 \u062A\u0641\u0627\u0635\u064A\u0644\u0647\u0627' : 'Select a material to view details'}
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
              {isRTL ? '\u0631\u0641\u0636 \u0627\u0644\u0645\u0627\u062F\u0629' : 'Reject Material'}
            </h3>
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder={isRTL ? '\u0633\u0628\u0628 \u0627\u0644\u0631\u0641\u0636 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)...' : 'Rejection reason (optional)...'}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 p-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
              rows={3}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setShowRejectModal(null); setRejectionNote(''); }}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isRTL ? '\u0625\u0644\u063A\u0627\u0621' : 'Cancel'}
              </button>
              <button
                onClick={() => rejectMaterial(showRejectModal)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                {isRTL ? '\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0631\u0641\u0636' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
