import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowRight, Download, Heart, Plus, Sparkles } from 'lucide-react';

/**
 * Button Component Examples
 * 
 * Visual demonstration of all Button variants, sizes, and states.
 * This file serves as a reference for developers using the Button component.
 */

export const ButtonExamples: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '40px', color: 'var(--color-ink)' }}>
        Button Component Examples
      </h1>

      {/* Variants */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '22px', color: 'var(--color-ink)' }}>
          Variants
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="light">Light Button</Button>
        </div>
      </section>

      {/* Sizes */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '22px', color: 'var(--color-ink)' }}>
          Sizes
        </h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="small">Small Button</Button>
          <Button size="medium">Medium Button</Button>
          <Button size="large">Large Button</Button>
        </div>
      </section>

      {/* Icon Positioning */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '22px', color: 'var(--color-ink)' }}>
          Icon Positioning
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button icon={<ArrowRight size={16} />}>Icon Right (Default)</Button>
          <Button icon={<ArrowRight size={16} />} iconPosition="left">
            Icon Left
          </Button>
          <Button variant="ghost" icon={<Download size={16} />}>
            Download
          </Button>
          <Button variant="light" icon={<Plus size={16} />} iconPosition="left">
            Add New
          </Button>
        </div>
      </section>

      {/* Loading States */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '22px', color: 'var(--color-ink)' }}>
          Loading States
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button loading>Loading Primary</Button>
          <Button variant="ghost" loading>
            Loading Ghost
          </Button>
          <Button variant="light" loading>
            Loading Light
          </Button>
          <Button loading onClick={handleLoadingClick}>
            Click to Test
          </Button>
        </div>
      </section>

      {/* Disabled States */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '22px', color: 'var(--color-ink)' }}>
          Disabled States
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button disabled>Disabled Primary</Button>
          <Button variant="ghost" disabled>
            Disabled Ghost
          </Button>
          <Button variant="light" disabled>
            Disabled Light
          </Button>
          <Button disabled icon={<Heart size={16} />}>
            Disabled with Icon
          </Button>
        </div>
      </section>

      {/* Combinations */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '22px', color: 'var(--color-ink)' }}>
          Variant & Size Combinations
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ width: '80px', fontSize: '13px', color: 'var(--color-muted)' }}>
              Primary:
            </span>
            <Button variant="primary" size="small">
              Small
            </Button>
            <Button variant="primary" size="medium">
              Medium
            </Button>
            <Button variant="primary" size="large">
              Large
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ width: '80px', fontSize: '13px', color: 'var(--color-muted)' }}>
              Ghost:
            </span>
            <Button variant="ghost" size="small">
              Small
            </Button>
            <Button variant="ghost" size="medium">
              Medium
            </Button>
            <Button variant="ghost" size="large">
              Large
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ width: '80px', fontSize: '13px', color: 'var(--color-muted)' }}>
              Light:
            </span>
            <Button variant="light" size="small">
              Small
            </Button>
            <Button variant="light" size="medium">
              Medium
            </Button>
            <Button variant="light" size="large">
              Large
            </Button>
          </div>
        </div>
      </section>

      {/* Real-world Examples */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '22px', color: 'var(--color-ink)' }}>
          Real-world Use Cases
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              padding: '24px',
              border: '1px solid var(--color-line)',
              borderRadius: '18px',
              background: 'white',
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Calculate Your Footprint</h3>
            <p style={{ color: 'var(--color-muted)', marginBottom: '20px', fontSize: '14px' }}>
              Get started by calculating your carbon footprint in just a few minutes.
            </p>
            <Button icon={<Sparkles size={16} />}>Calculate My Footprint</Button>
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: '18px',
              background: 'var(--color-green)',
              color: 'white',
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'white' }}>
              Take Action Today
            </h3>
            <p style={{ color: '#d2ebd3', marginBottom: '20px', fontSize: '14px' }}>
              View personalized recommendations to reduce your environmental impact.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="light" icon={<ArrowRight size={16} />}>
                View Recommendations
              </Button>
              <Button variant="ghost" style={{ borderColor: 'rgba(255,255,255,.3)', color: 'white' }}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '22px', color: 'var(--color-ink)' }}>
          Interactive Demo
        </h2>
        <div
          style={{
            padding: '24px',
            border: '1px solid var(--color-line)',
            borderRadius: '18px',
            background: '#f8fbf7',
          }}
        >
          <Button loading={loading} onClick={handleLoadingClick} icon={<Download size={16} />}>
            {loading ? 'Processing...' : 'Click to Test Loading'}
          </Button>
          <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-muted)' }}>
            {loading
              ? 'Button is in loading state (2 seconds)'
              : 'Click the button to see the loading state'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ButtonExamples;
