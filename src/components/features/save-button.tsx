'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  scholarshipId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SaveButton({ scholarshipId, className, size = 'md' }: SaveButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [mounted, setMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const isLoggedIn = status === 'authenticated' && session?.user;
  const isAdmin = (session?.user as any)?.isAdmin;
  const canSave = isLoggedIn && !isAdmin;

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if scholarship is saved
  useEffect(() => {
    if (mounted && canSave) {
      checkSavedStatus();
    }
  }, [mounted, canSave, scholarshipId]);

  async function checkSavedStatus() {
    try {
      const res = await fetch(`/api/user/saved-scholarships/check?scholarshipId=${scholarshipId}`);
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved);
        setSavedId(data.savedScholarship?.id || null);
      }
    } catch (error) {
      console.error('Failed to check saved status:', error);
    }
  }

  async function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(`/${locale}/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isAdmin) {
      return; // Admins can't save scholarships
    }

    setIsLoading(true);

    try {
      if (isSaved && savedId) {
        // Remove from saved
        const res = await fetch(`/api/user/saved-scholarships/${savedId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsSaved(false);
          setSavedId(null);
        }
      } else {
        // Add to saved
        const res = await fetch('/api/user/saved-scholarships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scholarshipId }),
        });
        if (res.ok) {
          const data = await res.json();
          setIsSaved(true);
          setSavedId(data.savedScholarship.id);
        }
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Always render the same initial state to avoid hydration mismatch
  const showSaved = mounted && isSaved;

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading || !mounted}
      className={cn(
        'rounded-full flex items-center justify-center transition-all',
        'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        showSaved
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500',
        (isLoading || !mounted) && 'opacity-50 cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      title={showSaved ? 'Remove from saved' : 'Save scholarship'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          showSaved && 'fill-current',
          isLoading && 'animate-pulse'
        )}
      />
    </button>
  );
}
