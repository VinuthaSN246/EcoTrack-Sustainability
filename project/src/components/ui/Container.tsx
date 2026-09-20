import React from 'react';

export interface ContainerProps {
  /**
   * Content to render inside the container
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes to apply
   */
  className?: string;

  /**
   * HTML element to render as (defaults to 'div')
   */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Container Component
 *
 * A layout wrapper that constrains content to a maximum width of 1160px
 * with responsive horizontal padding (32px desktop, 20px mobile).
 *
 * Uses the existing `.container` CSS class from index.css which provides:
 * - width: min(1160px, calc(100% - 64px))
 * - margin: 0 auto (centering)
 * - Responsive: width: min(100% - 40px, 600px) on mobile
 *
 * @example
 * ```tsx
 * <Container>
 *   <h1>Page Content</h1>
 * </Container>
 *
 * <Container as="section" className="my-section">
 *   <p>Section content</p>
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component className={`container ${className}`.trim()}>
      {children}
    </Component>
  );
};
