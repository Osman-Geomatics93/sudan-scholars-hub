'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Mail, MailOpen, Trash2, Eye } from 'lucide-react';
import { SkeletonContactList, SkeletonContactDetail } from '@/components/ui/skeleton';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const isRTL = locale === 'ar';

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch('/api/admin/contacts');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }

  async function deleteMessage(id: string) {
    if (
      !confirm(
        isRTL
          ? 'هل أنت متأكد من حذف هذه الرسالة؟'
          : 'Are you sure you want to delete this message?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const message = messages.find((m) => m.id === id);
        if (message && !message.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }

  function openMessage(message: ContactMessage) {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message.id);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonContactList />
          <SkeletonContactDetail />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRTL ? 'الرسائل' : 'Messages'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isRTL
            ? `${unreadCount} رسائل غير مقروءة من ${messages.length}`
            : `${unreadCount} unread of ${messages.length} messages`}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Messages list */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="max-h-[600px] divide-y divide-gray-200 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                  selectedMessage?.id === message.id ? 'bg-primary-50' : ''
                } ${!message.isRead ? 'bg-blue-50/50' : ''}`}
                onClick={() => openMessage(message)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        message.isRead ? 'bg-gray-100' : 'bg-primary-100'
                      }`}
                    >
                      {message.isRead ? (
                        <MailOpen className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-medium text-gray-900 ${
                          !message.isRead ? 'font-semibold' : ''
                        }`}
                      >
                        {message.name}
                      </p>
                      <p className="truncate text-sm text-gray-600">
                        {message.subject}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleDateString(
                          isRTL ? 'ar-SA' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message.id);
                    }}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                {isRTL ? 'لا توجد رسائل' : 'No messages'}
              </div>
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          {selectedMessage ? (
            <div>
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedMessage.subject}
                </h2>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <span>{selectedMessage.name}</span>
                  <span>&bull;</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary-600 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(selectedMessage.createdAt).toLocaleDateString(
                    isRTL ? 'ar-SA' : 'en-US',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </p>
              </div>
              <div className="whitespace-pre-wrap text-gray-700">
                {selectedMessage.message}
              </div>
              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
                >
                  {isRTL ? 'رد' : 'Reply'}
                </a>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isRTL ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              <div className="text-center">
                <Eye className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">
                  {isRTL
                    ? 'اختر رسالة لعرضها'
                    : 'Select a message to view'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
