'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Trash2, Minimize2 } from 'lucide-react';
import { useChat } from '@/contexts/chat-context';
import { ChatMessage, TypingIndicator } from './chat-message';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const { messages, isOpen, isLoading, toggleChat, closeChat, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message);
  };

  // Don't show on admin pages
  if (pathname?.includes('/admin')) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={cn(
          'fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl',
          isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6',
          'bottom-4 sm:bottom-6',
          isOpen && 'scale-0 opacity-0'
        )}
        aria-label={isRTL ? 'فتح المحادثة' : 'Open chat'}
      >
        <MessageCircle className="h-6 w-6" />
        {/* Pulse animation */}
        <span className="absolute h-full w-full animate-ping rounded-full bg-primary-400 opacity-20" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed z-50 flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300',
          isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6',
          'bottom-4 sm:bottom-6',
          isOpen
            ? 'h-[500px] w-[350px] sm:w-[380px] opacity-100 scale-100'
            : 'h-0 w-0 opacity-0 scale-90 pointer-events-none'
        )}
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">
                {isRTL ? 'مساعد المنح' : 'Scholarship Assistant'}
              </h3>
              <p className="text-xs text-white/80">
                {isRTL ? 'متصل الآن' : 'Online now'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearMessages}
              className="rounded-lg p-2 hover:bg-white/20 transition-colors"
              title={isRTL ? 'مسح المحادثة' : 'Clear chat'}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={closeChat}
              className="rounded-lg p-2 hover:bg-white/20 transition-colors"
              title={isRTL ? 'إغلاق' : 'Close'}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} locale={locale} />
          ))}
          {isLoading && <TypingIndicator locale={locale} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {(isRTL ? quickActionsAr : quickActionsEn).map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(action)}
                  className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900 dark:hover:text-primary-300 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t dark:border-gray-800 p-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRTL ? 'اكتب رسالتك...' : 'Type your message...'}
              className="flex-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              disabled={isLoading}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-all hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className={cn('h-4 w-4', isRTL && 'rotate-180')} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const quickActionsEn = [
  'What scholarships are available?',
  'Türkiye Burslari benefits',
  'How to apply?',
  'Document requirements'
];

const quickActionsAr = [
  'ما المنح المتاحة؟',
  'مزايا تركيا بورسلاري',
  'كيف أقدم؟',
  'المستندات المطلوبة'
];
