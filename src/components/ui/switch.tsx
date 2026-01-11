'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked);
    };

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
          checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <span
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </label>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
