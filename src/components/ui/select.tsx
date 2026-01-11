'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Simple Select (for forms with options array)
// ============================================

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const SimpleSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              'flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pe-10 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            suppressHydrationWarning
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

SimpleSelect.displayName = 'SimpleSelect';

// ============================================
// Compound Select Components (shadcn-style)
// ============================================

interface SelectContextValue {
  value: string;
  displayValue: string;
  onValueChange: (value: string, displayValue: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select compound components must be used within a Select');
  }
  return context;
}

// Select - the compound select wrapper
interface SelectRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Select({ value: controlledValue, defaultValue = '', onValueChange, children }: SelectRootProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [displayValue, setDisplayValue] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = React.useCallback((newValue: string, newDisplayValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    setDisplayValue(newDisplayValue);
    onValueChange?.(newValue);
    setOpen(false);
  }, [controlledValue, onValueChange]);

  return (
    <SelectContext.Provider value={{ value, displayValue, onValueChange: handleValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// SelectTrigger - the button that opens the dropdown
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform', open && 'rotate-180')} />
      </button>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

// SelectValue - displays the selected value
interface SelectValueProps {
  placeholder?: string;
}

function SelectValue({ placeholder }: SelectValueProps) {
  const { displayValue } = useSelectContext();

  if (!displayValue && placeholder) {
    return <span className="text-gray-500">{placeholder}</span>;
  }

  return <span>{displayValue}</span>;
}

// SelectContent - the dropdown container
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

function SelectContent({ children, className }: SelectContentProps) {
  const { open, setOpen } = useSelectContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        const parent = contentRef.current.parentElement;
        if (parent && !parent.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 min-w-[8rem] w-full mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg',
        'dark:bg-gray-800 dark:border-gray-600',
        className
      )}
    >
      <div className="p-1 max-h-60 overflow-auto">{children}</div>
    </div>
  );
}

// SelectItem - individual option
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function SelectItem({ value, children, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange } = useSelectContext();
  const isSelected = value === selectedValue;

  const handleClick = () => {
    const displayText = typeof children === 'string' ? children : value;
    onValueChange(value, displayText);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none',
        'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white',
        isSelected && 'bg-primary-50 dark:bg-primary-900/30',
        className
      )}
    >
      <span className="flex-1">{children}</span>
      {isSelected && (
        <Check className="h-4 w-4 text-primary-600" />
      )}
    </div>
  );
}

export {
  SimpleSelect,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};
