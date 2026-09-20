import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 * 
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7**
 * 
 * A reusable button component with multiple variants, sizes, and states.
 * Supports primary, ghost, and light variants with icon positioning and loading states.
 * Implements hover animations (translateY -2px, enhanced shadow).
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   * - primary: Green background, white text, shadow (default)
   * - ghost: Transparent background, border, colored text
   * - light: White background, green text
   */
  variant?: 'primary' | 'ghost' | 'light';
  
  /**
   * Button size
   * - small: Compact padding (11px 16px), 11px font
   * - medium: Standard padding (14px 21px), 12px font (default)
   * - large: Large padding (16px 28px), 14px font
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Optional icon to display in the button
   */
  icon?: React.ReactNode;
  
  /**
   * Icon position relative to text
   * - left: Icon before text
   * - right: Icon after text (default)
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * Loading state - shows spinner and disables button
   */
  loading?: boolean;
  
  /**
   * Button content
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'right',
  disabled = false,
  loading = false,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  // Base button classes
  const baseClasses = 'button';
  
  // Variant classes
  const variantClasses: Record<typeof variant, string> = {
    primary: '',
    ghost: 'button-ghost',
    light: 'button-light',
  };
  
  // Size classes
  const sizeClasses: Record<typeof size, string> = {
    small: 'button-small',
    medium: '',
    large: 'button-large',
  };
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  // Determine if button should be disabled
  const isDisabled = disabled || loading;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <Loader2 
          size={size === 'small' ? 14 : size === 'large' ? 18 : 16} 
          className="spin" 
          aria-label="Loading"
        />
      )}
      
      {/* Icon on the left */}
      {!loading && icon && iconPosition === 'left' && (
        <span className="button-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {/* Button text content */}
      <span className="button-content">{children}</span>
      
      {/* Icon on the right */}
      {!loading && icon && iconPosition === 'right' && (
        <span className="button-icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
