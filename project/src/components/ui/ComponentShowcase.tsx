/**
 * Component Showcase
 * 
 * Visual demonstration of Input and FormField components
 * showing all states: default, focus, error, required, etc.
 */

import React, { useState } from 'react';
import { Input, FormField } from './index';

export const ComponentShowcase: React.FC = () => {
  const [values, setValues] = useState({
    email: '',
    distance: '',
    electricity: '',
    name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    if (field === 'email' && values.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }
    
    if (field === 'distance' && values.distance) {
      const num = Number(values.distance);
      if (isNaN(num) || num < 0) {
        setErrors(prev => ({ ...prev, distance: 'Please enter a valid positive number' }));
      }
    }
  };

  return (
    <div className="calc-page">
      <div className="app-shell">
        <div className="calc-hero">
          <div className="container">
            <div className="calc-hero-inner">
              <div className="pill">
                <span className="pulse-dot" />
                COMPONENT SHOWCASE
              </div>
              <h1 className="calc-title">
                Input & FormField Components
              </h1>
              <p className="calc-intro">
                Visual demonstration of all component states and variations
              </p>
            </div>
          </div>
        </div>

        <div className="calc-body">
          <div className="container">
            <div className="calc-form-panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '32px', fontSize: '22px', color: 'var(--ink)' }}>
                Form Field Examples
              </h2>

              <div className="form-fields">
                {/* Example 1: Basic FormField with Input */}
                <FormField
                  label="Full Name"
                  helperText="Enter your first and last name"
                >
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={values.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </FormField>

                {/* Example 2: Required field with validation */}
                <FormField
                  label="Email Address"
                  helperText="We'll send your carbon footprint report here"
                  error={touched.email ? errors.email : undefined}
                  required
                >
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={touched.email && !!errors.email}
                  />
                </FormField>

                {/* Example 3: Number input with validation */}
                <FormField
                  label="Daily Commute Distance"
                  helperText="Enter your average daily commuting distance in kilometers"
                  error={touched.distance ? errors.distance : undefined}
                  required
                >
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={values.distance}
                    onChange={(e) => handleChange('distance', e.target.value)}
                    onBlur={() => handleBlur('distance')}
                    error={touched.distance && !!errors.distance}
                  />
                </FormField>

                {/* Example 4: Number input with unit */}
                <FormField
                  label="Monthly Electricity Usage"
                  helperText="Find this on your utility bill (in kWh)"
                >
                  <Input
                    type="number"
                    placeholder="350"
                    min="0"
                    value={values.electricity}
                    onChange={(e) => handleChange('electricity', e.target.value)}
                  />
                </FormField>

                {/* Static examples section */}
                <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--line)' }}>
                  <h3 style={{ marginBottom: '24px', fontSize: '18px', color: 'var(--ink)' }}>
                    Static State Examples
                  </h3>

                  {/* Focus state demonstration */}
                  <FormField label="Focus State Demo">
                    <Input 
                      type="text" 
                      placeholder="Click to see green border and white background"
                    />
                  </FormField>

                  {/* Error state demonstration */}
                  <FormField 
                    label="Error State Demo"
                    error="This field has a validation error"
                  >
                    <Input 
                      type="text" 
                      placeholder="This input has an error"
                      error={true}
                    />
                  </FormField>

                  {/* Disabled state demonstration */}
                  <FormField 
                    label="Disabled State Demo"
                    helperText="This field is disabled"
                  >
                    <Input 
                      type="text" 
                      placeholder="Disabled input"
                      disabled
                    />
                  </FormField>
                </div>
              </div>

              {/* State display panel */}
              <div style={{ 
                marginTop: '48px', 
                padding: '24px', 
                background: '#f8fbf7', 
                borderRadius: '12px',
                border: '1px solid var(--line)'
              }}>
                <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '700' }}>
                  Current State
                </h3>
                <pre style={{ 
                  fontSize: '12px', 
                  color: 'var(--muted)',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  {JSON.stringify({ values, errors, touched }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
