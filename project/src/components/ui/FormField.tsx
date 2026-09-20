import React from 'react';

export interface FormFieldProps {
  /**
   * The label text displayed above the input field
   */
  label: string;
  
  /**
   * Optional helper text displayed below the label to guide users
   */
  helperText?: string;
  
  /**
   * Error message to display when validation fails
   */
  error?: string;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
  
  /**
   * The input element or other form control to render
   */
  children: React.ReactNode;
  
  /**
   * Optional HTML id for the field (used for label association)
   */
  id?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * FormField Component
 * 
 * A complete form field wrapper that provides:
 * - Label with optional required indicator
 * - Helper text for user guidance
 * - Error message display
 * - Proper accessibility with label association
 * 
 * The component handles the visual hierarchy and spacing between
 * label, helper text, input, and error message.
 * 
 * @example
 * ```tsx
 * <FormField
 *   label="Distance Traveled"
 *   helperText="Enter your average daily distance in kilometers"
 *   error={errors.distance}
 *   required
 * >
 *   <Input
 *     type="number"
 *     placeholder="0"
 *     error={!!errors.distance}
 *   />
 * </FormField>
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  helperText,
  error,
  required = false,
  children,
  id,
  className = '',
}) => {
  // Generate unique IDs for accessibility
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  // Clone children to pass IDs for proper ARIA associations
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        id: fieldId,
        'aria-describedby': [
          helperText ? helperId : null,
          error ? errorId : null,
        ]
          .filter(Boolean)
          .join(' ') || undefined,
      });
    }
    return child;
  });

  return (
    <div className={`field-group ${className}`.trim()}>
      <label htmlFor={fieldId} className="field-label">
        {label}
        {required && <span className="text-error" aria-label="required"> *</span>}
      </label>
      
      {helperText && (
        <p id={helperId} className="field-help">
          {helperText}
        </p>
      )}
      
      {childrenWithProps}
      
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
