# CustomBarChart Component

A reusable bar chart component built with Recharts that follows the EcoTrack design system.

## Overview

The `CustomBarChart` component wraps Recharts' `BarChart` with consistent styling aligned with EcoTrack's design tokens. It provides a standardized way to display bar charts throughout the application with proper color coding, axis styling, and tooltips.

## Features

- ✅ **Design Token Integration**: Uses EcoTrack design system colors
- ✅ **Rounded Bar Corners**: Configurable radius for modern appearance
- ✅ **Styled Axes**: Muted text colors and subtle lines
- ✅ **Custom Tooltips**: Consistent tooltip styling with shadows and borders
- ✅ **Responsive**: Automatically adjusts to container width
- ✅ **Flexible Configuration**: Extensive props for customization
- ✅ **TypeScript Support**: Full type safety with interfaces
- ✅ **Accessibility**: Semantic markup and proper ARIA attributes

## Installation

The component is located at `src/components/charts/CustomBarChart.tsx` and can be imported from the charts module:

```typescript
import { CustomBarChart } from '@/components/charts';
// or
import { CustomBarChart } from '@/components/charts/CustomBarChart';
```

## Basic Usage

```typescript
import { CustomBarChart } from '@/components/charts';

const data = [
  { name: 'Transportation', value: 2.5, fill: '#118865' },
  { name: 'Electricity', value: 1.8, fill: '#1594a1' },
  { name: 'Food', value: 1.2, fill: '#e0932a' },
  { name: 'Waste', value: 0.8, fill: '#8b6fc0' },
  { name: 'Travel', value: 0.5, fill: '#d65b5b' },
];

function MyComponent() {
  return <CustomBarChart data={data} />;
}
```

## Props

### `data` (required)

**Type**: `BarChartDataPoint[]`

Array of data points to display in the chart. Each data point must have:
- `name` (string): The label for the bar (shown on X-axis)
- `value` (number): The numeric value for the bar height
- `fill` (string): The color for the bar (hex, rgb, or design token)

```typescript
interface BarChartDataPoint {
  name: string;
  value: number;
  fill: string;
}
```

### `height`

**Type**: `number`  
**Default**: `280`

Height of the chart in pixels.

```typescript
<CustomBarChart data={data} height={400} />
```

### `margin`

**Type**: `{ top: number; right: number; left: number; bottom: number }`  
**Default**: `{ top: 16, right: 12, left: -16, bottom: 0 }`

Margin configuration for the chart. Negative values can be used to extend the chart area.

```typescript
<CustomBarChart 
  data={data} 
  margin={{ top: 20, right: 20, left: 0, bottom: 10 }} 
/>
```

### `maxBarSize`

**Type**: `number`  
**Default**: `64`

Maximum width for each bar in pixels. Prevents bars from becoming too wide in sparse datasets.

```typescript
<CustomBarChart data={data} maxBarSize={50} />
```

### `barRadius`

**Type**: `number | [number, number, number, number]`  
**Default**: `[8, 8, 0, 0]`

Border radius for bar corners. Can be a single number for all corners or an array of `[topLeft, topRight, bottomRight, bottomLeft]`.

```typescript
// Round top corners only
<CustomBarChart data={data} barRadius={[8, 8, 0, 0]} />

// Round all corners
<CustomBarChart data={data} barRadius={10} />
```

### `showXAxis`

**Type**: `boolean`  
**Default**: `true`

Whether to display the X-axis with labels.

```typescript
<CustomBarChart data={data} showXAxis={false} />
```

### `showYAxis`

**Type**: `boolean`  
**Default**: `true`

Whether to display the Y-axis with values.

```typescript
<CustomBarChart data={data} showYAxis={false} />
```

### `showTooltip`

**Type**: `boolean`  
**Default**: `true`

Whether to show tooltips on hover.

```typescript
<CustomBarChart data={data} showTooltip={false} />
```

### `tooltipFormatter`

**Type**: `(value: number, name: string) => string`  
**Default**: `(value) => ${value.toFixed(2)} tonnes CO₂e`

Custom function to format tooltip values.

```typescript
<CustomBarChart 
  data={data} 
  tooltipFormatter={(value) => `${value}%`} 
/>
```

## Examples

### Carbon Footprint Breakdown

```typescript
const carbonData = [
  { name: 'Transportation', value: 2.5, fill: '#118865' },
  { name: 'Electricity', value: 1.8, fill: '#1594a1' },
  { name: 'Food', value: 1.2, fill: '#e0932a' },
  { name: 'Waste', value: 0.8, fill: '#8b6fc0' },
  { name: 'Travel', value: 0.5, fill: '#d65b5b' },
];

<CustomBarChart data={carbonData} height={320} />
```

### Monthly Trend (Same Color)

```typescript
const monthlyData = [
  { name: 'Jan', value: 3.2, fill: '#118865' },
  { name: 'Feb', value: 2.9, fill: '#118865' },
  { name: 'Mar', value: 3.1, fill: '#118865' },
  { name: 'Apr', value: 2.7, fill: '#118865' },
  { name: 'May', value: 2.5, fill: '#118865' },
  { name: 'Jun', value: 2.4, fill: '#118865' },
];

<CustomBarChart 
  data={monthlyData} 
  height={280}
  tooltipFormatter={(value) => `${value} tonnes`}
/>
```

### Compact Chart

```typescript
const compactData = [
  { name: 'A', value: 10, fill: '#118865' },
  { name: 'B', value: 15, fill: '#1594a1' },
  { name: 'C', value: 8, fill: '#e0932a' },
];

<CustomBarChart 
  data={compactData} 
  height={180}
  maxBarSize={40}
  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
/>
```

### Without Axes

```typescript
<CustomBarChart 
  data={carbonData} 
  showXAxis={false}
  showYAxis={false}
  height={200}
/>
```

## Design Tokens

The component uses the following design tokens from the EcoTrack design system:

### Colors

- **Transportation**: `#118865` (`--color-transport`)
- **Electricity**: `#1594a1` (`--color-electricity`)
- **Food**: `#e0932a` (`--color-food`)
- **Waste**: `#8b6fc0` (`--color-waste`)
- **Travel**: `#d65b5b` (`--color-travel`)
- **Muted Text**: `#82a098` (`--color-muted`)
- **Border**: `#d9e9e1` (`--color-line`)

### Typography

- **Font Family**: `DM Sans, sans-serif` (`--font-body`)
- **Font Size**: `11px` (axis labels)
- **Font Size**: `12px` (tooltip text)

### Spacing & Borders

- **Border Radius**: `12px` (tooltip)
- **Shadow**: `0 8px 20px rgba(20, 78, 48, 0.08)` (tooltip)

## Styling

The chart automatically applies consistent styling:

### Axis Styling
- **Text Color**: Muted (`#82a098`)
- **Font Size**: `11px`
- **Font Family**: `DM Sans`
- **Line Color**: `#d9e9e1`
- **No tick lines**: Clean appearance

### Tooltip Styling
- **Background**: White
- **Border**: `1px solid #d9e9e1`
- **Border Radius**: `12px`
- **Shadow**: Subtle elevation shadow
- **Padding**: `8px 12px`
- **Font**: `12px DM Sans`

### Bar Styling
- **Rounded Corners**: Top corners rounded by default
- **Max Width**: `64px` (prevents overly wide bars)
- **Animation**: Smooth `600ms` ease-in-out
- **Cursor Highlight**: Light fill on hover

## Accessibility

The component includes accessibility features:

- Semantic SVG elements
- Proper ARIA attributes (provided by Recharts)
- Keyboard-accessible tooltips
- Sufficient color contrast for text
- Responsive and scalable

## Requirements Covered

This component validates the following requirements from the design specification:

- **5.3**: Display breakdown bar chart showing emissions by category
- **6.2**: Display horizontal bar charts showing relative contribution
- **18.1**: Use Recharts library for rendering charts
- **18.2**: Render bar charts with rounded corners and consistent colors
- **18.6**: Display tooltip with detailed values on hover

## Testing

The component includes comprehensive tests covering:

- ✅ Basic rendering
- ✅ Empty data handling
- ✅ Custom height application
- ✅ Default props
- ✅ Prop acceptance (margin, maxBarSize, barRadius, etc.)
- ✅ Axis visibility toggles
- ✅ Tooltip configuration
- ✅ Design token color usage

Run tests with:

```bash
npm test -- CustomBarChart.test.tsx
```

## Integration with Dashboard

Example usage in the Dashboard page:

```typescript
import { CustomBarChart } from '@/components/charts';
import type { CarbonResult } from '@/types';

function DashboardPage({ result }: { result: CarbonResult }) {
  const breakdownData = [
    { 
      name: 'Transportation', 
      value: result.transportationCO2, 
      fill: '#118865' 
    },
    { 
      name: 'Electricity', 
      value: result.electricityCO2, 
      fill: '#1594a1' 
    },
    { 
      name: 'Food', 
      value: result.foodCO2, 
      fill: '#e0932a' 
    },
    { 
      name: 'Waste', 
      value: result.wasteCO2, 
      fill: '#8b6fc0' 
    },
    { 
      name: 'Travel', 
      value: result.travelCO2, 
      fill: '#d65b5b' 
    },
  ];

  return (
    <div className="dash-card">
      <h3 className="results-card-title">Carbon Footprint Breakdown</h3>
      <p className="results-card-subtitle">
        Emissions by category (tonnes CO₂e/year)
      </p>
      <CustomBarChart data={breakdownData} />
    </div>
  );
}
```

## Related Components

- **CustomLineChart**: For time-series data (Task 4.2)
- **CustomPieChart**: For distribution visualization (Task 4.3)

## Notes

- The component is fully responsive and adapts to its container width
- Animation duration is set to 600ms for smooth rendering
- The default tooltip formatter assumes carbon footprint data (tonnes CO₂e)
- Empty data arrays are handled gracefully
- The component works with any numeric data, not just carbon footprint values

## License

Part of the EcoTrack application. See project root for license information.
