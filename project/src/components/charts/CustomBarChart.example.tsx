import React from 'react';
import { CustomBarChart } from './CustomBarChart';

/**
 * CustomBarChart Examples
 * 
 * This file demonstrates various usage patterns for the CustomBarChart component.
 */

export const CustomBarChartExamples: React.FC = () => {
  // Example 1: Carbon footprint breakdown by category
  const carbonBreakdownData = [
    { name: 'Transportation', value: 2.5, fill: '#118865' },
    { name: 'Electricity', value: 1.8, fill: '#1594a1' },
    { name: 'Food', value: 1.2, fill: '#e0932a' },
    { name: 'Waste', value: 0.8, fill: '#8b6fc0' },
    { name: 'Travel', value: 0.5, fill: '#d65b5b' },
  ];

  // Example 2: Monthly emissions data
  const monthlyData = [
    { name: 'Jan', value: 3.2, fill: '#118865' },
    { name: 'Feb', value: 2.9, fill: '#118865' },
    { name: 'Mar', value: 3.1, fill: '#118865' },
    { name: 'Apr', value: 2.7, fill: '#118865' },
    { name: 'May', value: 2.5, fill: '#118865' },
    { name: 'Jun', value: 2.4, fill: '#118865' },
  ];

  // Example 3: Compact chart for small spaces
  const compactData = [
    { name: 'A', value: 10, fill: '#118865' },
    { name: 'B', value: 15, fill: '#1594a1' },
    { name: 'C', value: 8, fill: '#e0932a' },
  ];

  return (
    <div style={{ padding: '40px', background: '#f8fbf7' }}>
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#173d39', marginBottom: '20px' }}>
          Example 1: Carbon Footprint Breakdown
        </h2>
        <div
          style={{
            background: 'white',
            border: '1px solid #d9e9e1',
            borderRadius: '18px',
            padding: '28px',
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#173d39' }}>
            Your Carbon Footprint by Category
          </h3>
          <p style={{ fontSize: '11px', color: '#82a098', marginBottom: '24px' }}>
            Breakdown by emission source (tonnes CO₂e/year)
          </p>
          <CustomBarChart data={carbonBreakdownData} />
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#173d39', marginBottom: '20px' }}>
          Example 2: Monthly Emissions Trend
        </h2>
        <div
          style={{
            background: 'white',
            border: '1px solid #d9e9e1',
            borderRadius: '18px',
            padding: '28px',
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#173d39' }}>
            Monthly Emissions
          </h3>
          <p style={{ fontSize: '11px', color: '#82a098', marginBottom: '24px' }}>
            Total emissions per month
          </p>
          <CustomBarChart data={monthlyData} height={320} />
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#173d39', marginBottom: '20px' }}>
          Example 3: Compact Chart
        </h2>
        <div
          style={{
            background: 'white',
            border: '1px solid #d9e9e1',
            borderRadius: '18px',
            padding: '20px',
            maxWidth: '500px',
          }}
        >
          <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#173d39' }}>
            Comparison Data
          </h3>
          <CustomBarChart
            data={compactData}
            height={180}
            maxBarSize={40}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#173d39', marginBottom: '20px' }}>
          Example 4: Custom Styling Options
        </h2>
        <div
          style={{
            background: 'white',
            border: '1px solid #d9e9e1',
            borderRadius: '18px',
            padding: '28px',
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#173d39' }}>
            Without Y-Axis
          </h3>
          <CustomBarChart
            data={carbonBreakdownData}
            showYAxis={false}
            height={240}
          />
        </div>
      </div>

      <div>
        <h2 style={{ color: '#173d39', marginBottom: '20px' }}>
          Example 5: Custom Tooltip
        </h2>
        <div
          style={{
            background: 'white',
            border: '1px solid #d9e9e1',
            borderRadius: '18px',
            padding: '28px',
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#173d39' }}>
            Percentage Formatter
          </h3>
          <CustomBarChart
            data={[
              { name: 'Option A', value: 45, fill: '#118865' },
              { name: 'Option B', value: 30, fill: '#1594a1' },
              { name: 'Option C', value: 25, fill: '#e0932a' },
            ]}
            tooltipFormatter={(value) => `${value}%`}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomBarChartExamples;
