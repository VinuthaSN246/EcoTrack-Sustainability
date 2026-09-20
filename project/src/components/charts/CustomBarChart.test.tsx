import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CustomBarChart } from './CustomBarChart';

describe('CustomBarChart', () => {
  const mockData = [
    { name: 'Transportation', value: 2.5, fill: '#118865' },
    { name: 'Electricity', value: 1.8, fill: '#1594a1' },
    { name: 'Food', value: 1.2, fill: '#e0932a' },
    { name: 'Waste', value: 0.8, fill: '#8b6fc0' },
    { name: 'Travel', value: 0.5, fill: '#d65b5b' },
  ];

  it('renders without crashing', () => {
    const { container } = render(<CustomBarChart data={mockData} />);
    expect(container).toBeTruthy();
    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it('renders with empty data', () => {
    const { container } = render(<CustomBarChart data={[]} />);
    expect(container).toBeTruthy();
    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it('renders with custom height', () => {
    const { container } = render(
      <CustomBarChart data={mockData} height={400} />
    );
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toHaveStyle({ height: '400px' });
  });

  it('applies default height when not specified', () => {
    const { container } = render(<CustomBarChart data={mockData} />);
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toHaveStyle({ height: '280px' });
  });

  it('renders ResponsiveContainer component', () => {
    const { container } = render(<CustomBarChart data={mockData} />);
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeTruthy();
  });

  it('accepts data prop correctly', () => {
    // This test verifies the component accepts the data prop without errors
    expect(() => render(<CustomBarChart data={mockData} />)).not.toThrow();
  });

  it('handles single data point', () => {
    const singleData = [{ name: 'Test', value: 5.0, fill: '#118865' }];
    const { container } = render(<CustomBarChart data={singleData} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it('accepts custom margin prop', () => {
    const customMargin = { top: 20, right: 20, left: 0, bottom: 10 };
    expect(() => 
      render(<CustomBarChart data={mockData} margin={customMargin} />)
    ).not.toThrow();
  });

  it('accepts custom maxBarSize prop', () => {
    expect(() => 
      render(<CustomBarChart data={mockData} maxBarSize={50} />)
    ).not.toThrow();
  });

  it('accepts custom barRadius prop', () => {
    expect(() => 
      render(<CustomBarChart data={mockData} barRadius={[10, 10, 0, 0]} />)
    ).not.toThrow();
  });

  it('renders with showXAxis false', () => {
    expect(() => 
      render(<CustomBarChart data={mockData} showXAxis={false} />)
    ).not.toThrow();
  });

  it('renders with showYAxis false', () => {
    expect(() => 
      render(<CustomBarChart data={mockData} showYAxis={false} />)
    ).not.toThrow();
  });

  it('renders with showTooltip false', () => {
    expect(() => 
      render(<CustomBarChart data={mockData} showTooltip={false} />)
    ).not.toThrow();
  });

  it('accepts custom tooltip formatter', () => {
    const customFormatter = (value: number) => `${value}%`;
    expect(() => 
      render(<CustomBarChart data={mockData} tooltipFormatter={customFormatter} />)
    ).not.toThrow();
  });

  it('renders with all custom props', () => {
    const { container } = render(
      <CustomBarChart
        data={mockData}
        height={350}
        margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        maxBarSize={50}
        barRadius={10}
        showXAxis={true}
        showYAxis={true}
        showTooltip={true}
      />
    );
    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it('uses design token colors from data', () => {
    const designTokenData = [
      { name: 'Transport', value: 2.0, fill: '#118865' }, // --color-transport
      { name: 'Electricity', value: 1.5, fill: '#1594a1' }, // --color-electricity
      { name: 'Food', value: 1.0, fill: '#e0932a' }, // --color-food
    ];
    expect(() => 
      render(<CustomBarChart data={designTokenData} />)
    ).not.toThrow();
  });
});
