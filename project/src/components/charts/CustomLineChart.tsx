import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * CustomLineChart Props Interface
 * 
 * Validates Requirements: 8.1, 18.1, 18.3, 18.6
 */
export interface LineChartDataPoint {
  date: string;
  value: number;
}

export interface CustomLineChartProps {
  /** Array of time series data points to display in the chart */
  data: LineChartDataPoint[];
  /** Height of the chart in pixels */
  height?: number;
  /** Chart margin configuration */
  margin?: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  };
  /** Color for the line and data points */
  color?: string;
  /** Width of the line stroke */
  strokeWidth?: number;
  /** Radius of data point markers */
  dotRadius?: number;
  /** Radius of active data point marker on hover */
  activeDotRadius?: number;
  /** Whether to show the X axis */
  showXAxis?: boolean;
  /** Whether to show the Y axis */
  showYAxis?: boolean;
  /** Whether to show tooltips on hover */
  showTooltip?: boolean;
  /** Custom tooltip formatter function */
  tooltipFormatter?: (value: number) => string;
}

/**
 * CustomLineChart Component
 * 
 * A reusable line chart component that wraps Recharts with consistent styling
 * aligned with the EcoTrack design system. Used for trend visualization over time.
 * 
 * Features:
 * - Smooth curve styling with monotone interpolation
 * - 2px stroke width for clear visibility
 * - 4px radius data point markers
 * - Enhanced active dot on hover (6px)
 * - Consistent tooltip and axis styling
 * - Design token colors
 * 
 * @param props - CustomLineChartProps
 */
export const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  height = 240,
  margin = { top: 10, right: 10, left: 0, bottom: 0 },
  color = '#118865',
  strokeWidth = 2,
  dotRadius = 4,
  activeDotRadius = 6,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  tooltipFormatter,
}) => {
  // Default tooltip formatter
  const defaultTooltipFormatter = (value: number): string => {
    return `${value.toFixed(2)} tonnes CO₂e`;
  };

  const formatter = tooltipFormatter || defaultTooltipFormatter;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin}>
        {/* X Axis with muted styling */}
        {showXAxis && (
          <XAxis
            dataKey="date"
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
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #d9e9e1',
              fontSize: '12px',
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 8px 20px rgba(20, 78, 48, 0.08)',
              padding: '8px 12px',
            }}
            formatter={(value) => {
              const numValue = typeof value === 'number' ? value : 0;
              return [formatter(numValue), 'Value'];
            }}
          />
        )}

        {/* Line with smooth curve and data point markers */}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={strokeWidth}
          dot={{ r: dotRadius, fill: color }}
          activeDot={{ r: activeDotRadius }}
          animationDuration={600}
          animationEasing="ease-in-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
