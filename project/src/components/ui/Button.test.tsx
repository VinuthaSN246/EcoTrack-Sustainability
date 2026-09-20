import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

/**
 * Button Component Tests
 * 
 * Tests verify Requirements 11.1-11.7:
 * - Primary, ghost, and light variants
 * - Small, medium, and large sizes
 * - Icon positioning (left/right)
 * - Loading states
 * - Hover animations
 * - Disabled state handling
 */

describe('Button Component', () => {
  describe('Variants', () => {
    it('renders primary button with correct styling', () => {
      render(<Button variant="primary">Primary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('button');
      expect(button).not.toHaveClass('button-ghost', 'button-light');
    });

    it('renders ghost button with correct styling', () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'button-ghost');
    });

    it('renders light button with correct styling', () => {
      render(<Button variant="light">Light Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'button-light');
    });
  });

  describe('Sizes', () => {
    it('renders small button with correct styling', () => {
      render(<Button size="small">Small Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'button-small');
    });

    it('renders medium button (default) with correct styling', () => {
      render(<Button size="medium">Medium Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button');
      expect(button).not.toHaveClass('button-small', 'button-large');
    });

    it('renders large button with correct styling', () => {
      render(<Button size="large">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'button-large');
    });
  });

  describe('Icon Positioning', () => {
    it('renders icon on the right by default', () => {
      render(
        <Button icon={<ArrowRight data-testid="icon" />}>
          Button with Icon
        </Button>
      );
      const button = screen.getByRole('button');
      const icon = screen.getByTestId('icon');
      
      // Check that icon's parent has button-icon class
      expect(icon.parentElement).toHaveClass('button-icon');
      
      // Get all spans with class button-icon and button-content
      const iconSpan = button.querySelector('.button-icon');
      const contentSpan = button.querySelector('.button-content');
      
      expect(iconSpan).toBeInTheDocument();
      expect(contentSpan).toBeInTheDocument();
      
      // Icon span should appear after content span in DOM order
      const buttonChildren = Array.from(button.children);
      expect(buttonChildren.indexOf(iconSpan!)).toBeGreaterThan(
        buttonChildren.indexOf(contentSpan!)
      );
    });

    it('renders icon on the left when iconPosition is "left"', () => {
      render(
        <Button icon={<ArrowRight data-testid="icon" />} iconPosition="left">
          Button with Icon
        </Button>
      );
      const button = screen.getByRole('button');
      const icon = screen.getByTestId('icon');
      
      // Check that icon's parent has button-icon class and appears first
      expect(icon.parentElement).toHaveClass('button-icon');
      
      // Get all spans with class button-icon and button-content
      const iconSpan = button.querySelector('.button-icon');
      const contentSpan = button.querySelector('.button-content');
      
      expect(iconSpan).toBeInTheDocument();
      expect(contentSpan).toBeInTheDocument();
      
      // Icon span should appear before content span in DOM order
      const buttonChildren = Array.from(button.children);
      expect(buttonChildren.indexOf(iconSpan!)).toBeLessThan(
        buttonChildren.indexOf(contentSpan!)
      );
    });

    it('does not render icon when loading', () => {
      render(
        <Button icon={<ArrowRight data-testid="icon" />} loading>
          Loading Button
        </Button>
      );
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('hides icon when loading', () => {
      render(
        <Button icon={<ArrowRight data-testid="icon" />} loading>
          Loading
        </Button>
      );
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not trigger onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not trigger onClick when loading', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Button loading onClick={handleClick}>
          Loading Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Interaction', () => {
    it('triggers onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports custom type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('defaults to type="button"', () => {
      render(<Button>Default Type</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Custom Classes', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'custom-class');
    });

    it('combines variant, size, and custom classes', () => {
      render(
        <Button variant="ghost" size="small" className="custom-class">
          Combined
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'button-ghost', 'button-small', 'custom-class');
    });
  });

  describe('Content', () => {
    it('renders text content', () => {
      render(<Button>Button Text</Button>);
      expect(screen.getByText('Button Text')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <Button>
          <span>Complex</span> <strong>Content</strong>
        </Button>
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
