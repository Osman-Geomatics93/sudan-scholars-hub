'use client';

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/contexts/chat-context';

interface ChatMessageProps {
  message: ChatMessageType;
  locale?: string;
}

export function ChatMessage({ message, locale = 'en' }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isRTL = locale === 'ar';

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isUser ? (isRTL ? 'flex-row' : 'flex-row-reverse') : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary-100 text-primary-600' : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
          isUser
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm',
          isRTL && isUser && 'rounded-tr-2xl rounded-tl-sm',
          isRTL && !isUser && 'rounded-tl-2xl rounded-tr-sm'
        )}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>

        {/* Source indicator for AI responses */}
        {message.source && !isUser && (
          <div className="mt-1.5 flex items-center gap-1 text-xs opacity-60">
            <span>
              {message.source === 'faq'
                ? (isRTL ? 'إجابة سريعة' : 'Quick answer')
                : (isRTL ? 'مساعد ذكي' : 'AI assistant')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator({ locale = 'en' }: { locale?: string }) {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
