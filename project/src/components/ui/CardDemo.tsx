import React from 'react';
import { Card } from './Card';
import { BarChart3, Sparkles, Sprout, Zap } from 'lucide-react';

/**
 * Card Component Demo
 * 
 * Visual demonstration of all Card component variants, padding options, and hover effects.
 * This file is for testing and demonstration purposes only.
 */
export const CardDemo: React.FC = () => {
  return (
    <div style={{ padding: '40px', background: '#f8fbf7' }}>
      <div className="container">
        <h1 style={{ marginBottom: '32px', color: '#173d39' }}>Card Component Demo</h1>
        
        {/* Default Cards with Different Padding */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '20px', color: '#173d39' }}>Default Cards - Padding Variants</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <Card padding="compact">
              <h3 style={{ color: '#173d39', marginBottom: '8px' }}>Compact Padding</h3>
              <p style={{ color: '#65827e', fontSize: '13px' }}>
                This card uses compact padding (20px). Ideal for dense layouts or smaller content.
              </p>
            </Card>
            
            <Card padding="standard">
              <h3 style={{ color: '#173d39', marginBottom: '8px' }}>Standard Padding</h3>
              <p style={{ color: '#65827e', fontSize: '13px' }}>
                This card uses standard padding (28px). The default option for most use cases.
              </p>
            </Card>
            
            <Card padding="large">
              <h3 style={{ color: '#173d39', marginBottom: '8px' }}>Large Padding</h3>
              <p style={{ color: '#65827e', fontSize: '13px' }}>
                This card uses large padding (34px). Best for hero sections or featured content.
              </p>
            </Card>
          </div>
        </section>

        {/* Feature Cards with Colored Backgrounds */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '20px', color: '#173d39' }}>Feature Cards with Hover Effects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <Card variant="feature-mint" hoverable>
              <div style={{ 
                display: 'grid', 
                placeItems: 'center', 
                width: '43px', 
                height: '43px', 
                marginBottom: '24px', 
                borderRadius: '13px', 
                background: 'white', 
                color: '#118865',
                boxShadow: '0 5px 12px rgba(44, 115, 75, .07)'
              }}>
                <BarChart3 size={20} />
              </div>
              <p style={{ color: '#7a9a8c', fontSize: '10px', fontWeight: 700, letterSpacing: '.11em', marginBottom: '12px' }}>
                01 / CALCULATE
              </p>
              <h3 style={{ color: '#173d39', fontSize: '18px', marginBottom: '10px' }}>Mint Background</h3>
              <p style={{ color: '#69887f', fontSize: '12px', lineHeight: '1.6' }}>
                Feature card with mint background (#eaf7ed). Hover to see animation effect.
              </p>
            </Card>
            
            <Card variant="feature-sky" hoverable>
              <div style={{ 
                display: 'grid', 
                placeItems: 'center', 
                width: '43px', 
                height: '43px', 
                marginBottom: '24px', 
                borderRadius: '13px', 
                background: 'white', 
                color: '#118865',
                boxShadow: '0 5px 12px rgba(44, 115, 75, .07)'
              }}>
                <Sparkles size={20} />
              </div>
              <p style={{ color: '#7a9a8c', fontSize: '10px', fontWeight: 700, letterSpacing: '.11em', marginBottom: '12px' }}>
                02 / UNDERSTAND
              </p>
              <h3 style={{ color: '#173d39', fontSize: '18px', marginBottom: '10px' }}>Sky Background</h3>
              <p style={{ color: '#69887f', fontSize: '12px', lineHeight: '1.6' }}>
                Feature card with sky background (#eaf5f5). Hover to see animation effect.
              </p>
            </Card>
            
            <Card variant="feature-cream" hoverable>
              <div style={{ 
                display: 'grid', 
                placeItems: 'center', 
                width: '43px', 
                height: '43px', 
                marginBottom: '24px', 
                borderRadius: '13px', 
                background: 'white', 
                color: '#118865',
                boxShadow: '0 5px 12px rgba(44, 115, 75, .07)'
              }}>
                <Sprout size={20} />
              </div>
              <p style={{ color: '#7a9a8c', fontSize: '10px', fontWeight: 700, letterSpacing: '.11em', marginBottom: '12px' }}>
                03 / IMPROVE
              </p>
              <h3 style={{ color: '#173d39', fontSize: '18px', marginBottom: '10px' }}>Cream Background</h3>
              <p style={{ color: '#69887f', fontSize: '12px', lineHeight: '1.6' }}>
                Feature card with cream background (#f8f4e9). Hover to see animation effect.
              </p>
            </Card>
          </div>
        </section>

        {/* Non-Hoverable Cards */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '20px', color: '#173d39' }}>Non-Hoverable Cards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  display: 'grid', 
                  placeItems: 'center', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '14px', 
                  background: '#eaf7ed', 
                  color: '#118865'
                }}>
                  <Zap size={24} />
                </div>
                <div>
                  <h3 style={{ color: '#173d39', fontSize: '18px', margin: 0 }}>Static Card</h3>
                  <p style={{ color: '#82a098', fontSize: '11px', margin: '4px 0 0' }}>No hover effect</p>
                </div>
              </div>
              <p style={{ color: '#65827e', fontSize: '13px', lineHeight: '1.6' }}>
                This card does not have the hoverable prop, so it won't animate on hover.
                Perfect for informational cards that don't need interaction.
              </p>
            </Card>
            
            <Card variant="feature-mint" padding="large">
              <h3 style={{ color: '#173d39', fontSize: '18px', marginBottom: '12px' }}>Combined Props</h3>
              <p style={{ color: '#65827e', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                This card combines variant="feature-mint" with padding="large" but without hoverable.
              </p>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '999px',
                background: '#118865',
                color: 'white',
                fontSize: '11px',
                fontWeight: 700
              }}>
                ✓ Example Badge
              </div>
            </Card>
          </div>
        </section>

        {/* Custom Styled Cards */}
        <section>
          <h2 style={{ marginBottom: '20px', color: '#173d39' }}>Cards with Custom Classes</h2>
          <Card className="custom-shadow" style={{ background: 'linear-gradient(135deg, #0d7a5a, #118865)', border: 'none', color: 'white' }}>
            <h3 style={{ color: 'white', fontSize: '22px', marginBottom: '12px' }}>Custom Styled Card</h3>
            <p style={{ color: '#d2ebd3', fontSize: '14px', lineHeight: '1.6' }}>
              The Card component accepts className prop for additional styling.
              This example shows a gradient background with custom colors.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CardDemo;
