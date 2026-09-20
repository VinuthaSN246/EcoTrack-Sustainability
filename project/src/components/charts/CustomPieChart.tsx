import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * CustomPieChart Props Interface
 * 
 * Validates Requirements: 6.2, 18.1, 18.4, 18.6
 */
export interface PieChartDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface CustomPieChartProps {
  /** Array of data points to display in the pie chart */
  data: PieChartDataPoint[];
  /** Inner radius for donut style (in pixels) */
  innerRadius?: number;
  /** Outer radius for donut style (in pixels) */
  outerRadius?: number;
  /** Padding angle between slices (in degrees) */
  paddingAngle?: number;
  /** Width of the chart container */
  width?: number | `${number}%`;
  /** Height of the chart container */
  height?: number | `${number}%`;
  /** Whether to show tooltips on hover */
  showTooltip?: boolean;
  /** Custom tooltip formatter function */
  tooltipFormatter?: (value: number, name: string) => string;
  /** Center X position (percentage or pixel value) */
  cx?: number | string;
  /** Center Y position (percentage or pixel value) */
  cy?: number | string;
}

/**
 * CustomPieChart Component
 * 
 * A reusable pie/donut chart component that wraps Recharts with consistent styling
 * aligned with the EcoTrack design system.
 * 
 * Features:
 * - Donut style with configurable inner/outer radius
 * - Category color-coding from design tokens
 * - 3° padding angle between slices
 * - No stroke between slices for clean appearance
 * - Tooltips with consistent design
 * 
 * @param props - CustomPieChartProps
 */
export const CustomPieChart: React.FC<CustomPieChartProps> = ({
  data,
  innerRadius = 56,
  outerRadius = 88,
  paddingAngle = 3,
  width = '100%',
  height = '100%',
  showTooltip = true,
  tooltipFormatter,
  cx = '50%',
  cy = '50%',
}) => {
  // Default tooltip formatter
  const defaultTooltipFormatter = (value: number, name: string): string => {
    return `${value.toFixed(2)} tonnes CO₂e`;
  };

  const formatter = tooltipFormatter || defaultTooltipFormatter;

  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        {/* Pie/Donut with category color-coding */}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          stroke="none"
          animationDuration={600}
          animationEasing="ease-in-out"
        >
          {data.map((entry, index) => (
            <Cell key={`pie-cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>

        {/* Tooltip with consistent design */}
        {showTooltip && (
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #d9e9e1',
              fontSize: '12px',
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 8px 20px rgba(20, 78, 48, 0.08)',
              padding: '8px 12px',
            }}
            formatter={(value, name) => {
              const numValue = typeof value === 'number' ? value : 0;
              const strName = typeof name === 'string' ? name : '';
              return [formatter(numValue, strName), strName];
            }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
