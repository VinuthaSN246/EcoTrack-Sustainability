import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * Input Component
 * 
 * A styled text input field with support for error states and focus animations.
 * 
 * Features:
 * - Green border on focus with white background
 * - Red border and light red background on error
 * - Smooth transitions for state changes
 * - Fully accessible with proper ARIA attributes
 * 
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter value"
 *   error={!!errorMessage}
 *   aria-invalid={!!errorMessage}
 *   aria-describedby={errorMessage ? "error-id" : undefined}
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className = '', ...props }, ref) => {
    const baseClasses = 'field-input';
    const errorClass = error ? 'input-error' : '';

    return (
      <input
        ref={ref}
        className={`${baseClasses} ${errorClass} ${className}`.trim()}
        aria-invalid={error}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
