'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, onCheckedChange, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="checkbox"
            id={inputId}
            className={cn(
              'peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary-600 checked:border-primary-600 appearance-none transition-colors',
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          <Check className="absolute top-0 left-0 h-4 w-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
