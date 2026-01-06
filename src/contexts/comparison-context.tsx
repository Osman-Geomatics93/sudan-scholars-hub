'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Scholarship } from '@/types/scholarship';

const MAX_COMPARE_ITEMS = 3;

interface ComparisonContextType {
  scholarships: Scholarship[];
  selectedIds: string[];
  addToCompare: (scholarship: Scholarship) => boolean;
  removeFromCompare: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
  canAddMore: boolean;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

interface ComparisonProviderProps {
  children: ReactNode;
}

export function ComparisonProvider({ children }: ComparisonProviderProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const selectedIds = scholarships.map((s) => s.id);
  const canAddMore = scholarships.length < MAX_COMPARE_ITEMS;

  const addToCompare = useCallback((scholarship: Scholarship): boolean => {
    if (scholarships.length >= MAX_COMPARE_ITEMS) {
      return false;
    }
    if (scholarships.some((s) => s.id === scholarship.id)) {
      return false;
    }
    setScholarships((prev) => [...prev, scholarship]);
    return true;
  }, [scholarships]);

  const removeFromCompare = useCallback((id: string) => {
    setScholarships((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearComparison = useCallback(() => {
    setScholarships([]);
    setIsCompareModalOpen(false);
  }, []);

  const isInComparison = useCallback((id: string): boolean => {
    return scholarships.some((s) => s.id === id);
  }, [scholarships]);

  const openCompareModal = useCallback(() => {
    if (scholarships.length >= 2) {
      setIsCompareModalOpen(true);
    }
  }, [scholarships.length]);

  const closeCompareModal = useCallback(() => {
    setIsCompareModalOpen(false);
  }, []);

  return (
    <ComparisonContext.Provider
      value={{
        scholarships,
        selectedIds,
        addToCompare,
        removeFromCompare,
        clearComparison,
        isInComparison,
        canAddMore,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
