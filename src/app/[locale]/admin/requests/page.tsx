'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCcw,
  ClipboardList,
  User,
  Calendar,
  BookOpen,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

type RequestStatus = 'OPEN' | 'FULFILLED' | 'CLOSED';

interface MaterialRequest {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  status: RequestStatus;
  fulfilledBy: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface StatusCounts {
  OPEN: number;
  FULFILLED: number;
  CLOSED: number;
  ALL: number;
}

const STATUS_CONFIG = {
  OPEN: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Open', labelAr: 'مفتوح' },
  FULFILLED: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Fulfilled', labelAr: 'تم التلبية' },
  CLOSED: { color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500', label: 'Closed', labelAr: 'مغلق' },
};

export default function AdminRequestsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const isRTL = locale === 'ar';

  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<RequestStatus | 'ALL'>('ALL');
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({ OPEN: 0, FULFILLED: 0, CLOSED: 0, ALL: 0 });
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState<{ id: string; action: RequestStatus } | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests?status=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        setStatusCounts(data.statusCounts || { OPEN: 0, FULFILLED: 0, CLOSED: 0, ALL: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: RequestStatus, note?: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: note }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) => prev.map((r) => (r.id === id ? data.request : r)));
        if (selectedRequest?.id === id) setSelectedRequest(data.request);
        // Refresh counts
        fetchRequests();
      }
    } catch (error) {
      console.error('Failed to update request:', error);
    } finally {
      setActionLoading(null);
      setShowNoteModal(null);
      setAdminNote('');
    }
  }

  async function deleteRequest(id: string) {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا الطلب نهائياً؟' : 'Are you sure you want to permanently delete this request?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        if (selectedRequest?.id === id) setSelectedRequest(null);
        fetchRequests();
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
    } finally {
      setActionLoading(null);
    }
  }

  const filteredRequests = requests.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.subject?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { key: RequestStatus | 'ALL'; label: string; labelAr: string }[] = [
    { key: 'ALL', label: 'All', labelAr: 'الكل' },
    { key: 'OPEN', label: 'Open', labelAr: 'مفتوح' },
    { key: 'FULFILLED', label: 'Fulfilled', labelAr: 'تم التلبية' },
    { key: 'CLOSED', label: 'Closed', labelAr: 'مغلق' },
  ];

  if (loading && requests.length === 0) {
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
          {isRTL ? 'إدارة الطلبات' : 'Manage Requests'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isRTL
            ? `${statusCounts.ALL} طلب — ${statusCounts.OPEN} مفتوح`
            : `${statusCounts.ALL} requests — ${statusCounts.OPEN} open`}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedRequest(null); }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-primary-600 text-primary-700 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isRTL ? tab.labelAr : tab.label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {statusCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          placeholder={isRTL ? 'البحث في الطلبات...' : 'Search requests...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-lg border border-gray-300 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
          }`}
        />
      </div>

      {/* Two-column layout: list + detail */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Request List */}
        <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="rounded-xl bg-white py-12 text-center text-gray-500 shadow-sm">
              <ClipboardList className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              {isRTL ? 'لا توجد طلبات' : 'No requests found'}
            </div>
          ) : (
            filteredRequests.map((req) => {
              const cfg = STATUS_CONFIG[req.status];
              return (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                    selectedRequest?.id === req.id
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{req.title}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color}`}>
                      {isRTL ? cfg.labelAr : cfg.label}
                    </span>
                  </div>
                  {req.subject && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                      <BookOpen className="inline h-3 w-3 mr-1" /> {req.subject}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {req.user?.name || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString(isRTL ? 'ar' : 'en')}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selectedRequest ? (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              {/* Status badge */}
              <div className="mb-4 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${STATUS_CONFIG[selectedRequest.status].color}`}>
                  <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[selectedRequest.status].dot}`} />
                  {isRTL ? STATUS_CONFIG[selectedRequest.status].labelAr : STATUS_CONFIG[selectedRequest.status].label}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(selectedRequest.createdAt).toLocaleString(isRTL ? 'ar' : 'en')}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedRequest.title}</h2>

              {/* Subject */}
              {selectedRequest.subject && (
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{selectedRequest.subject}</span>
                </div>
              )}

              {/* Description */}
              {selectedRequest.description && (
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRequest.description}</p>
                </div>
              )}

              {/* User info */}
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                {selectedRequest.user?.image ? (
                  <img src={selectedRequest.user.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{selectedRequest.user?.name || 'Unknown User'}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.user?.email}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t pt-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  {isRTL ? 'إجراءات الإدارة' : 'Admin Actions'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* Mark as Fulfilled */}
                  {selectedRequest.status !== 'FULFILLED' && (
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'FULFILLED')}
                      disabled={actionLoading === selectedRequest.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {isRTL ? 'تلبية' : 'Mark Fulfilled'}
                    </button>
                  )}

                  {/* Close with note */}
                  {selectedRequest.status !== 'CLOSED' && (
                    <button
                      onClick={() => setShowNoteModal({ id: selectedRequest.id, action: 'CLOSED' })}
                      disabled={actionLoading === selectedRequest.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      {isRTL ? 'إغلاق' : 'Close'}
                    </button>
                  )}

                  {/* Reopen */}
                  {selectedRequest.status !== 'OPEN' && (
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'OPEN')}
                      disabled={actionLoading === selectedRequest.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {isRTL ? 'إعادة فتح' : 'Reopen'}
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => deleteRequest(selectedRequest.id)}
                    disabled={actionLoading === selectedRequest.id}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isRTL ? 'حذف نهائي' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
              <MessageSquare className="mb-3 h-10 w-10" />
              <p>{isRTL ? 'اختر طلباً لعرض التفاصيل' : 'Select a request to view details'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Close with note modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => { setShowNoteModal(null); setAdminNote(''); }}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <AlertTriangle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {isRTL ? 'إغلاق الطلب' : 'Close Request'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isRTL ? 'سيتم إخطار صاحب الطلب' : 'The requester will be notified'}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {isRTL ? 'ملاحظة (اختياري)' : 'Note (optional)'}
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                placeholder={isRTL ? 'سبب الإغلاق...' : 'Reason for closing...'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowNoteModal(null); setAdminNote(''); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => updateStatus(showNoteModal.id, showNoteModal.action, adminNote)}
                disabled={actionLoading === showNoteModal.id}
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {isRTL ? 'إغلاق الطلب' : 'Close Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
