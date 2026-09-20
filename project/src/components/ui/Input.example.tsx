/**
 * Input and FormField Component Usage Examples
 * 
 * This file demonstrates how to use the Input and FormField components
 * in various scenarios throughout the EcoTrack application.
 */

import React, { useState } from 'react';
import { Input, FormField } from './index';

export const InputExamples: React.FC = () => {
  const [transportDistance, setTransportDistance] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateDistance = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, distance: 'Distance is required' }));
    } else if (isNaN(Number(value)) || Number(value) < 0) {
      setErrors(prev => ({ ...prev, distance: 'Please enter a valid positive number' }));
    } else {
      setErrors(prev => {
        const { distance, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="calc-form-panel" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div className="form-fields">
        {/* Example 1: Basic input with helper text */}
        <FormField
          label="Daily Commute Distance"
          helperText="Enter your average daily commuting distance in kilometers"
          required
        >
          <Input
            type="number"
            placeholder="0"
            value={transportDistance}
            onChange={(e) => {
              setTransportDistance(e.target.value);
              validateDistance(e.target.value);
            }}
            error={!!errors.distance}
          />
        </FormField>

        {/* Example 2: Input with error state */}
        <FormField
          label="Email Address"
          helperText="We'll send your carbon footprint report to this email"
          error={errors.email}
          required
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            error={!!errors.email}
          />
        </FormField>

        {/* Example 3: Number input with unit */}
        <FormField
          label="Monthly Electricity Usage"
          helperText="Find this on your electricity bill (in kWh)"
        >
          <Input
            type="number"
            placeholder="350"
            min="0"
          />
        </FormField>

        {/* Example 4: Simple text input */}
        <FormField label="Full Name">
          <Input
            type="text"
            placeholder="John Doe"
          />
        </FormField>

        {/* Example 5: Standalone input (without FormField wrapper) */}
        <div>
          <label className="field-label" htmlFor="search-input">
            Quick Search
          </label>
          <Input
            id="search-input"
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Styling Notes:
 * 
 * The Input and FormField components use the following CSS classes
 * defined in index.css:
 * 
 * - .field-group: Container for the entire form field
 * - .field-label: Label text styling
 * - .field-help: Helper text styling (muted color)
 * - .field-input: Base input styling (light background, border)
 * - .field-input:focus: Focus state (green border, white background)
 * - .input-error: Error state (red border, light red background)
 * - .field-error: Error message styling (red text)
 * 
 * Focus Animation:
 * - Border color transitions to green (#118865)
 * - Background transitions to white
 * - Transition duration: 200ms ease
 * 
 * Error State:
 * - Border color: #e85b5b (red)
 * - Background color: #fef6f6 (light red)
 * - Error text color: #e85b5b
 */
