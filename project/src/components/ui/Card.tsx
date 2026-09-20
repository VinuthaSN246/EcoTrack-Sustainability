import React from 'react';

/**
 * Card Component Props
 * 
 * Provides consistent container styling for content grouping with multiple variants,
 * padding options, and optional hover effects.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: 'default' | 'feature-mint' | 'feature-sky' | 'feature-cream';
  /** Padding size */
  padding?: 'compact' | 'standard' | 'large';
  /** Enable hover animations */
  hoverable?: boolean;
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Card Component
 * 
 * A versatile card container component that supports multiple visual variants,
 * configurable padding, and optional hover effects. Uses design tokens for
 * consistent styling across the application.
 * 
 * **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**
 * 
 * @example
 * // Default card with standard padding
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * 
 * @example
 * // Feature card with mint background and hover effect
 * <Card variant="feature-mint" hoverable>
 *   <div className="feature-icon">
 *     <Icon />
 *   </div>
 *   <h3>Feature Title</h3>
 *   <p>Feature description</p>
 * </Card>
 * 
 * @example
 * // Compact card with cream background
 * <Card variant="feature-cream" padding="compact">
 *   <p>Compact content</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'standard',
  hoverable = false,
  children,
  className = '',
  ...props
}) => {
  // Base classes for all cards (from design tokens)
  const baseClasses = 'dash-card';
  
  // Variant-specific classes for background colors
  const variantClasses = {
    default: '',
    'feature-mint': 'feature-card-mint',
    'feature-sky': 'feature-card-sky',
    'feature-cream': 'feature-card-cream',
  };
  
  // Padding classes for different sizes
  const paddingClasses = {
    compact: 'p-5',     // 20px padding
    standard: 'p-7',    // 28px padding
    large: 'p-8',       // 34px padding (using closest Tailwind value)
  };
  
  // Add hover class if card should be interactive
  const hoverClass = hoverable ? 'feature-card' : '';
  
  return (
    <div
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default Card;
