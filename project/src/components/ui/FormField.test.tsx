/**
 * FormField and Input Component Integration Tests
 * 
 * These tests verify that the Input and FormField components
 * render correctly and handle user interactions as expected.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input, FormField } from './index';
import '@testing-library/jest-dom';

describe('Input Component', () => {
  it('renders with basic props', () => {
    render(<Input placeholder="Enter value" />);
    const input = screen.getByPlaceholderText('Enter value');
    expect(input).toBeInTheDocument();
  });

  it('applies error class when error prop is true', () => {
    render(<Input placeholder="Test" error={true} />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('input-error');
  });

  it('sets aria-invalid when error is true', () => {
    render(<Input placeholder="Test" error={true} />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not apply error class when error prop is false', () => {
    render(<Input placeholder="Test" error={false} />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).not.toHaveClass('input-error');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe('FormField Component', () => {
  it('renders label and input', () => {
    render(
      <FormField label="Email">
        <Input placeholder="Enter email" />
      </FormField>
    );
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('displays helper text when provided', () => {
    render(
      <FormField label="Name" helperText="Enter your full name">
        <Input />
      </FormField>
    );
    
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(
      <FormField label="Email" error="Invalid email">
        <Input />
      </FormField>
    );
    
    const errorMessage = screen.getByText('Invalid email');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('field-error');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('shows required indicator when required is true', () => {
    render(
      <FormField label="Name" required>
        <Input />
      </FormField>
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('associates label with input using htmlFor', () => {
    render(
      <FormField label="Test Field" id="test-input">
        <Input />
      </FormField>
    );
    
    const label = screen.getByText('Test Field');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('links error message with input via aria-describedby', () => {
    render(
      <FormField label="Email" error="Invalid email" id="email-field">
        <Input />
      </FormField>
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('email-field-error'));
  });

  it('links helper text with input via aria-describedby', () => {
    render(
      <FormField label="Name" helperText="Enter full name" id="name-field">
        <Input />
      </FormField>
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('name-field-helper'));
  });

  it('includes both helper and error in aria-describedby', () => {
    render(
      <FormField 
        label="Email" 
        helperText="We'll never share your email"
        error="Invalid format"
        id="email-field"
      >
        <Input />
      </FormField>
    );
    
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('email-field-helper');
    expect(describedBy).toContain('email-field-error');
  });
});

describe('FormField and Input Integration', () => {
  it('passes error state from FormField to Input', () => {
    const { rerender } = render(
      <FormField label="Email" error="Invalid">
        <Input placeholder="test@example.com" error={true} />
      </FormField>
    );
    
    const input = screen.getByPlaceholderText('test@example.com');
    expect(input).toHaveClass('input-error');
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  it('maintains accessibility with all features enabled', () => {
    render(
      <FormField 
        label="Distance"
        helperText="Enter kilometers"
        error="Must be positive"
        required
        id="distance-field"
      >
        <Input 
          type="number" 
          placeholder="0" 
          error={true}
        />
      </FormField>
    );
    
    // Check label
    const label = screen.getByText('Distance');
    expect(label).toHaveAttribute('for', 'distance-field');
    
    // Check required indicator
    expect(screen.getByText('*')).toBeInTheDocument();
    
    // Check helper text
    expect(screen.getByText('Enter kilometers')).toBeInTheDocument();
    
    // Check error message
    const errorMsg = screen.getByText('Must be positive');
    expect(errorMsg).toHaveAttribute('role', 'alert');
    
    // Check input
    const input = screen.getByPlaceholderText('0');
    expect(input).toHaveClass('input-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });
});
