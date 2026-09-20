import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/**
 * CustomBarChart Props Interface
 * 
 * Validates Requirements: 5.3, 6.2, 18.1, 18.2, 18.6
 */
export interface BarChartDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface CustomBarChartProps {
  /** Array of data points to display in the chart */
  data: BarChartDataPoint[];
  /** Height of the chart in pixels */
  height?: number;
  /** Chart margin configuration */
  margin?: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  };
  /** Maximum width for each bar */
  maxBarSize?: number;
  /** Border radius for bar corners [top-left, top-right, bottom-right, bottom-left] */
  barRadius?: number | [number, number, number, number];
  /** Whether to show the X axis */
  showXAxis?: boolean;
  /** Whether to show the Y axis */
  showYAxis?: boolean;
  /** Whether to show tooltips on hover */
  showTooltip?: boolean;
  /** Custom tooltip formatter function */
  tooltipFormatter?: (value: number, name: string) => string;
}

/**
 * CustomBarChart Component
 * 
 * A reusable bar chart component that wraps Recharts with consistent styling
 * aligned with the EcoTrack design system.
 * 
 * Features:
 * - Design token colors for bars
 * - Muted text styling for axes
 * - Subtle line styling
 * - Rounded bar corners
 * - Tooltips with consistent design
 * 
 * @param props - CustomBarChartProps
 */
export const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  height = 280,
  margin = { top: 16, right: 12, left: -16, bottom: 0 },
  maxBarSize = 64,
  barRadius = [8, 8, 0, 0],
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  tooltipFormatter,
}) => {
  // Default tooltip formatter
  const defaultTooltipFormatter = (value: number, name: string): string => {
    return `${value.toFixed(2)} tonnes CO₂e`;
  };

  const formatter = tooltipFormatter || defaultTooltipFormatter;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={margin}>
        {/* X Axis with muted styling */}
        {showXAxis && (
          <XAxis
            dataKey="name"
            tick={{
              fontSize: 11,
              fill: '#82a098',
              fontFamily: 'DM Sans, sans-serif',
            }}
            axisLine={{ stroke: '#d9e9e1' }}
            tickLine={false}
          />
        )}

        {/* Y Axis with subtle styling */}
        {showYAxis && (
          <YAxis
            tick={{
              fontSize: 11,
              fill: '#82a098',
              fontFamily: 'DM Sans, sans-serif',
            }}
            axisLine={false}
            tickLine={false}
          />
        )}

        {/* Tooltip with consistent design */}
        {showTooltip && (
          <Tooltip
            cursor={{ fill: '#f0f5f2' }}
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

        {/* Bar with rounded corners and color coding */}
        <Bar
          dataKey="value"
          radius={barRadius}
          maxBarSize={maxBarSize}
          animationDuration={600}
          animationEasing="ease-in-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
