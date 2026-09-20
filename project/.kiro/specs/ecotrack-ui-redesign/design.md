# Design Document: EcoTrack UI Redesign

## Overview

This design document outlines the technical implementation strategy for redesigning the EcoTrack carbon footprint tracking application's user interface. The redesign transforms all existing pages (Landing, Calculator, Dashboard, Recommendations, Progress, Profile) to match a modern, clean design reference while maintaining existing functionality and enhancing user experience.

### Scope

**In Scope:**
- Complete design system foundation (tokens, colors, typography, spacing)
- Component library architecture with reusable React components
- Redesign of all six application pages
- Responsive layout implementation for mobile/tablet/desktop
- Chart and visualization components using Recharts
- Animation and transition system
- Accessibility compliance (WCAG 2.1 AA)

**Out of Scope:**
- Backend API changes or modifications
- ML model adjustments or training data changes
- Database schema modifications
- Authentication system changes (beyond UI updates)
- New feature development beyond visual redesign

### Technology Stack

The redesign leverages the existing technology stack:
- **Frontend Framework:** React 18.3.1 with TypeScript 5.5.3
- **Styling:** Tailwind CSS 3.4.1 + Custom CSS
- **Icons:** Lucide React 0.446.0
- **Charts:** Recharts 3.10.1
- **Build Tool:** Vite 5.4.2
- **Backend:** Flask (unchanged)

### Design Philosophy

The redesign follows three core principles:

1. **Clarity First:** Every element serves a clear purpose, with visual hierarchy guiding users through complex data
2. **Sustainable Aesthetics:** Green color palette and organic shapes reinforce environmental themes without being heavy-handed
3. **Progressive Enhancement:** Core functionality works everywhere, enhanced features layer on for modern browsers

## Architecture

### System Architecture Layers

The UI redesign follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                  Application Pages Layer                 │
│  Landing | Calculator | Dashboard | Progress | Profile  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│               Component Library Layer                    │
│   Buttons | Cards | Forms | Charts | Navigation        │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│               Design System Foundation                   │
│   Tokens | Colors | Typography | Spacing | Shadows     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                CSS Framework (Tailwind)                  │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

The implementation will organize code as follows:

```
src/
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── OptionCard.tsx
│   │   └── ...
│   ├── charts/                  # Chart components
│   │   ├── BarChart.tsx
│   │   ├── LineChart.tsx
│   │   ├── PieChart.tsx
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   └── features/                # Feature-specific components
│       ├── ProgressIndicator.tsx
│       ├── CategoryIcon.tsx
│       └── ...
├── pages/                       # Page-level components
│   ├── LandingPage.tsx
│   ├── CalculatorPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProgressPage.tsx
│   └── ProfilePage.tsx
├── styles/
│   ├── design-tokens.css        # CSS custom properties
│   ├── components.css           # Component-specific styles
│   └── index.css                # Global styles
├── types/                       # TypeScript types
└── services/                    # API services (unchanged)
```

### Component Hierarchy

Components follow a hierarchical structure from atomic to page-level:

**Atomic Components:**
- Button, Input, Label, Icon, Badge

**Molecular Components:**
- Card, OptionCard, FormField, ChartTooltip

**Organism Components:**
- Navbar, Footer, FormSection, DashboardMetrics, RecommendationList

**Page Templates:**
- LandingPage, CalculatorPage, DashboardPage, ProgressPage, ProfilePage

## Components and Interfaces

### Design System Foundation

#### Design Tokens

Design tokens are implemented as CSS custom properties for consistency and maintainability:

**Color Tokens:**
```css
:root {
  /* Primary palette */
  --color-green: #118865;
  --color-green-dark: #087053;
  --color-green-light: #eaf7ed;
  
  /* Neutral palette */
  --color-ink: #173d39;
  --color-muted: #65827e;
  --color-line: #d9e9e1;
  --color-cream: #f4f8ed;
  --color-background: #f8fbf7;
  
  /* Semantic colors */
  --color-success: #118865;
  --color-warning: #e0932a;
  --color-error: #e85b5b;
  
  /* Chart colors */
  --color-transport: #118865;
  --color-electricity: #1594a1;
  --color-food: #e0932a;
  --color-waste: #8b6fc0;
  --color-travel: #d65b5b;
}
```

**Typography Tokens:**
```css
:root {
  /* Font families */
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'Fraunces', serif;
  
  /* Font sizes */
  --text-xs: 10px;
  --text-sm: 11px;
  --text-base: 13px;
  --text-lg: 15px;
  --text-xl: 18px;
  --text-2xl: 22px;
  --text-3xl: 34px;
  --text-4xl: 48px;
  --text-5xl: 70px;
  
  /* Font weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line heights */
  --leading-tight: 1.0;
  --leading-snug: 1.1;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
}
```

**Spacing Tokens:**
```css
:root {
  /* Spacing scale (8px base) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-7: 56px;
  --space-8: 64px;
  
  /* Component-specific spacing */
  --padding-sm: 12px;
  --padding-md: 20px;
  --padding-lg: 28px;
  --padding-xl: 34px;
}
```

**Border Radius Tokens:**
```css
:root {
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 18px;
  --radius-xl: 21px;
  --radius-pill: 999px;
}
```

**Shadow Tokens:**
```css
:root {
  --shadow-sm: 0 5px 12px rgba(44, 115, 75, 0.07);
  --shadow-md: 0 8px 18px rgba(17, 136, 101, 0.15);
  --shadow-lg: 0 12px 22px rgba(17, 136, 101, 0.20);
  --shadow-xl: 0 15px 30px rgba(32, 85, 61, 0.08);
}
```

**Transition Tokens:**
```css
:root {
  --transition-fast: 200ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
  --transition-smooth: 600ms ease-in-out;
}
```

#### TypeScript Interfaces

**Button Component Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'light';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

**Card Component Props:**
```typescript
interface CardProps {
  variant?: 'default' | 'feature-mint' | 'feature-sky' | 'feature-cream';
  padding?: 'compact' | 'standard' | 'large';
  hoverable?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Form Field Component Props:**
```typescript
interface FormFieldProps {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
```

**Chart Component Props:**
```typescript
interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  height?: number;
  margin?: { top: number; right: number; left: number; bottom: number };
}

interface LineChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  height?: number;
  color?: string;
}

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  innerRadius?: number;
  outerRadius?: number;
}
```

### Core UI Components

#### Button Component

The Button component provides consistent interaction patterns across the application.

**Implementation Strategy:**
```typescript
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'right',
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'button';
  const variantClasses = {
    primary: '',
    ghost: 'button-ghost',
    light: 'button-light',
  };
  const sizeClasses = {
    small: 'button-small',
    medium: '',
    large: 'button-large',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <Loader2 size={16} className="spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};
```

**Styling:**
- Primary: Green background, white text, shadow
- Ghost: Transparent background, border, colored text
- Light: White background, green text
- Hover: Translate Y -2px, enhanced shadow
- Disabled: 40% opacity, no hover effects

#### Card Component

The Card component provides consistent container styling for content grouping.

**Implementation Strategy:**
```typescript
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'standard',
  hoverable = false,
  children,
  className = '',
}) => {
  const baseClasses = 'dash-card';
  const variantClasses = {
    default: '',
    'feature-mint': 'feature-card-mint',
    'feature-sky': 'feature-card-sky',
    'feature-cream': 'feature-card-cream',
  };
  const paddingClasses = {
    compact: 'p-5',
    standard: 'p-7',
    large: 'p-8',
  };
  const hoverClass = hoverable ? 'feature-card' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
```

**Styling:**
- Border: 1px solid line color
- Border Radius: 18px
- Background: White (default), colored for feature variants
- Padding: 20px (compact), 28px (standard), 34px (large)
- Hover (if hoverable): Translate Y -5px, enhanced shadow

#### Input Component

The Input component provides form field styling with validation states.

**Implementation Strategy:**
```typescript
export const Input: React.FC<InputProps> = ({
  error = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'field-input';
  const errorClass = error ? 'input-error' : '';

  return (
    <input
      className={`${baseClasses} ${errorClass} ${className}`}
      {...props}
    />
  );
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  helperText,
  error,
  required,
  children,
}) => {
  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {required && <span className="text-error">*</span>}
      </label>
      {helperText && <p className="field-help">{helperText}</p>}
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};
```

**Styling:**
- Border: 1px solid line color
- Border Radius: 12px
- Background: Light cream (default), white (focus)
- Focus: Green border
- Error: Red border, light red background

#### OptionCard Component

The OptionCard component provides selectable card-based input controls.

**Implementation Strategy:**
```typescript
interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  selected,
  onClick,
  icon,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={`option-card ${selected ? 'option-selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="option-icon">{icon}</span>}
      <span>{label}</span>
      {selected && <Check size={16} className="option-check" />}
    </button>
  );
};
```

**Styling:**
- Default: Light background, border
- Hover: Green border, light green background
- Selected: Green border, green background, green text, checkmark icon
- Icon: Left-aligned, optional
- Checkmark: Right-aligned, only when selected

### Chart Components

#### BarChart Component

Wraps Recharts BarChart with consistent styling.

**Implementation Strategy:**
```typescript
export const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  height = 280,
  margin = { top: 16, right: 12, left: -16, bottom: 0 },
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={margin}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
          axisLine={{ stroke: '#d9e9e1' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: '#f0f5f2' }}
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #d9e9e1',
            fontSize: '12px',
            fontFamily: 'DM Sans',
            boxShadow: '0 8px 20px rgba(20,78,48,.08)',
          }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
```

**Styling:**
- Bar Radius: 8px top corners
- Max Bar Width: 64px
- Colors: Category-specific from design tokens
- Axis: Muted text, subtle lines
- Tooltip: White background, rounded, shadow

#### LineChart Component

Wraps Recharts LineChart for trend visualization.

**Implementation Strategy:**
```typescript
export const CustomLineChart: React.FC<LineChartProps> = ({
  data,
  height = 240,
  color = '#118865',
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
          axisLine={{ stroke: '#d9e9e1' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #d9e9e1',
            fontSize: '12px',
            fontFamily: 'DM Sans',
            boxShadow: '0 8px 20px rgba(20,78,48,.08)',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

**Styling:**
- Line: Smooth curve, 2px width
- Dots: 4px radius, category color
- Active Dot: 6px radius on hover
- Axis: Same styling as BarChart
- Tooltip: Same styling as BarChart

#### PieChart Component

Wraps Recharts PieChart for distribution visualization.

**Implementation Strategy:**
```typescript
export const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  innerRadius = 56,
  outerRadius = 88,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry, idx) => (
            <Cell key={`pie-cell-${idx}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #d9e9e1',
            fontSize: '12px',
            fontFamily: 'DM Sans',
            boxShadow: '0 8px 20px rgba(20,78,48,.08)',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
```

**Styling:**
- Donut style: Inner radius 56px, outer radius 88px
- Padding Angle: 3° between slices
- No stroke between slices
- Colors: Category-specific
- Tooltip: Same as other charts

### Layout Components

#### Navbar Component

The Navbar provides consistent navigation across all pages.

**Implementation Strategy:**
```typescript
interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <nav className="nav-wrap">
          <button className="logo" onClick={() => onNavigate('home')}>
            <span className="logo-mark">
              <Leaf size={18} />
            </span>
            <span>Eco<span>Track</span></span>
          </button>
          
          <div className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            <button
              className="nav-link-button"
              onClick={() => onNavigate('calculator')}
            >
              Calculator
            </button>
            <button
              className="nav-link-button"
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>
            <button
              className="nav-link-button"
              onClick={() => onNavigate('progress')}
            >
              Progress
            </button>
            {user && (
              <button
                className="nav-link-button"
                onClick={() => onNavigate('profile')}
              >
                Profile
              </button>
            )}
          </div>
          
          <div className="nav-actions">
            {user ? (
              <span className="text-link">
                <UserIcon size={14} />
                {user.name}
              </span>
            ) : (
              <Button variant="ghost" size="small" onClick={() => onNavigate('login')}>
                Sign In
              </Button>
            )}
          </div>
          
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>
    </header>
  );
};
```

**Styling:**
- Height: 82px (desktop), 70px (mobile)
- Logo: Green leaf icon, bold text
- Navigation Links: Muted color, green on hover
- Current Page: Bold, green color
- Mobile: Hamburger menu, overlay navigation

#### Footer Component

The Footer provides consistent branding and links.

**Implementation Strategy:**
```typescript
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="logo">
              <span className="logo-mark">
                <Leaf size={18} />
              </span>
              <span>Eco<span>Track</span></span>
            </div>
            <p>Small choices. Big impact.</p>
          </div>
          
          <nav className="footer-links">
            <button className="footer-link-button">About</button>
            <button className="footer-link-button">Privacy</button>
            <button className="footer-link-button">Terms</button>
            <button className="footer-link-button">Contact</button>
          </nav>
          
          <p className="copyright">
            © {currentYear} EcoTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
```

**Styling:**
- Border Top: 1px line color
- Padding: 31px vertical
- Layout: Flexbox, space-between
- Links: Muted color, green on hover
- Mobile: Stack vertically

#### Container Component

The Container provides consistent page width and centering.

**Implementation Strategy:**
```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`container ${className}`}>
      {children}
    </div>
  );
};
```

**Styling:**
- Max Width: 1160px
- Horizontal Padding: 32px
- Centering: Auto margins
- Mobile: Reduce padding to 20px

## Data Models

### Design-Related Type Definitions

The redesign introduces new TypeScript types for UI-specific concerns:

**Theme Types:**
```typescript
type ColorToken = 
  | 'green' | 'green-dark' | 'green-light'
  | 'ink' | 'muted' | 'line' | 'cream' | 'background'
  | 'success' | 'warning' | 'error'
  | 'transport' | 'electricity' | 'food' | 'waste' | 'travel';

type SpacingToken = 
  | 'space-1' | 'space-2' | 'space-3' | 'space-4'
  | 'space-5' | 'space-6' | 'space-7' | 'space-8';

type RadiusToken = 'radius-sm' | 'radius-md' | 'radius-lg' | 'radius-xl' | 'radius-pill';

type ShadowToken = 'shadow-sm' | 'shadow-md' | 'shadow-lg' | 'shadow-xl';
```

**Component Variant Types:**
```typescript
type ButtonVariant = 'primary' | 'ghost' | 'light';
type ButtonSize = 'small' | 'medium' | 'large';

type CardVariant = 'default' | 'feature-mint' | 'feature-sky' | 'feature-cream';
type CardPadding = 'compact' | 'standard' | 'large';
```

**Chart Data Types:**
```typescript
interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

interface CategoryBreakdown extends ChartDataPoint {
  icon: React.ComponentType;
  percentage: number;
}
```

**Animation Types:**
```typescript
interface AnimationConfig {
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

type TransitionSpeed = 'fast' | 'base' | 'slow' | 'smooth';
```

**Responsive Breakpoint Types:**
```typescript
type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface ResponsiveValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}
```

### Existing Data Models (Unchanged)

The redesign maintains compatibility with existing data structures:

**FormData Interface** (from types.ts):
```typescript
interface FormData {
  transportType: string;
  dailyDistance: string;
  travelDays: string;
  electricity: string;
  homeType: string;
  dietType: string;
  foodWaste: string;
  wastePerWeek: string;
  recycling: string;
  flightsPerYear: string;
}
```

**CarbonResult Interface** (from carbonCalculator.ts):
```typescript
interface CarbonResult {
  totalCO2: number;
  transportationCO2: number;
  electricityCO2: number;
  foodCO2: number;
  wasteCO2: number;
  travelCO2: number;
  categoryPercentages: {
    transportation: number;
    electricity: number;
    food: number;
    waste: number;
    travel: number;
  };
}
```

**User Interface** (from api.ts):
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

## Error Handling

### UI Error States

The redesign implements consistent error handling patterns:

#### Form Validation Errors

**Strategy:**
- Display validation errors inline below form fields
- Highlight invalid fields with red border and light red background
- Show error icon next to error message
- Prevent form submission when validation fails
- Clear errors on input change after user starts correcting

**Implementation:**
```typescript
interface FormError {
  field: string;
  message: string;
}

const validateField = (field: string, value: string): string | null => {
  // Validation logic
  if (!value) return 'This field is required';
  if (field === 'email' && !isValidEmail(value)) return 'Invalid email address';
  if (field === 'number' && isNaN(Number(value))) return 'Please enter a valid number';
  return null;
};
```

**Visual Treatment:**
- Red text (#e85b5b)
- Red border on input
- Light red background (#fef6f6)
- Error icon (AlertCircle from Lucide)

#### API Error Handling

**Strategy:**
- Display toast notifications for network errors
- Show inline error messages for failed operations
- Provide retry buttons for recoverable errors
- Log errors to console for debugging (development only)

**Implementation:**
```typescript
const handleApiError = (error: Error): void => {
  console.error('API Error:', error);
  
  // Display user-friendly message
  if (error.message.includes('network')) {
    showToast('Unable to connect. Please check your internet connection.', 'error');
  } else if (error.message.includes('timeout')) {
    showToast('Request timed out. Please try again.', 'error');
  } else {
    showToast('Something went wrong. Please try again later.', 'error');
  }
};
```

#### Loading States

**Strategy:**
- Show loading spinners for async operations
- Disable interactive elements during loading
- Display skeleton loaders for content being fetched
- Provide loading progress indicators for multi-step operations

**Implementation:**
```typescript
const LoadingSpinner: React.FC = () => (
  <Loader2 size={24} className="spin" />
);

const SkeletonCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-header" />
    <div className="skeleton-body" />
  </div>
);
```

**Visual Treatment:**
- Animated spinner (green color)
- Pulse animation for skeletons
- Reduced opacity (60%) for disabled elements
- "Loading..." text with spinner

#### Empty States

**Strategy:**
- Display friendly messages when no data is available
- Provide call-to-action to guide users
- Use illustrations or icons to make empty states engaging
- Offer alternative actions when primary content is unavailable

**Implementation:**
```typescript
const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {action && <div className="empty-state-action">{action}</div>}
  </div>
);
```

**Visual Treatment:**
- Centered layout
- Muted colors (#82a098)
- Large icon (48px)
- Clear call-to-action button

### Accessibility Error Handling

**Strategy:**
- Announce errors to screen readers using ARIA live regions
- Ensure error messages are programmatically associated with form fields
- Provide clear focus management after errors
- Use sufficient color contrast for error states

**Implementation:**
```typescript
<div role="alert" aria-live="polite" aria-atomic="true">
  {error && <span>{error}</span>}
</div>

<input
  aria-invalid={!!error}
  aria-describedby={error ? `${id}-error` : undefined}
/>
{error && <span id={`${id}-error`}>{error}</span>}
```

## Testing Strategy

### Testing Approach Overview

The UI redesign requires a different testing strategy compared to algorithmic features. Since this is primarily a visual redesign focused on UI rendering, layout, and styling, **property-based testing is NOT appropriate**. Instead, we will use:

1. **Snapshot Testing** for component visual regression
2. **Component Testing** for interaction behavior
3. **Integration Testing** for page-level functionality
4. **Visual Regression Testing** for design consistency
5. **Accessibility Testing** for WCAG compliance
6. **Manual Testing** for responsive design and cross-browser compatibility

### Component Testing

**Objective:** Verify that individual components render correctly and handle user interactions as expected.

**Tools:**
- React Testing Library for component testing
- Jest for test runner and assertions
- @testing-library/user-event for simulating user interactions

**Test Coverage:**
- Button component: Variants, sizes, click handlers, disabled states
- Card component: Variants, padding options, hover effects
- Input component: Validation states, focus behavior, error display
- OptionCard component: Selection behavior, disabled state
- Chart components: Data rendering, tooltip display

**Example Test:**
```typescript
describe('Button Component', () => {
  it('renders primary button with correct styling', () => {
    render(<Button variant="primary">Click Me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).not.toHaveClass('button-ghost');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

### Snapshot Testing

**Objective:** Detect unintended visual changes in component rendering.

**Tools:**
- Jest snapshot testing
- React Testing Library for component rendering

**Test Coverage:**
- All UI components in various states
- Page layouts in different viewport sizes
- Card variants and color schemes
- Chart component rendering

**Example Test:**
```typescript
describe('Card Component Snapshots', () => {
  it('renders default card', () => {
    const { container } = render(
      <Card>
        <h3>Title</h3>
        <p>Content</p>
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders feature-mint variant', () => {
    const { container } = render(
      <Card variant="feature-mint">
        <h3>Title</h3>
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

### Integration Testing

**Objective:** Verify that page-level components integrate correctly with state management and data flow.

**Tools:**
- React Testing Library
- MSW (Mock Service Worker) for API mocking
- Jest for test runner

**Test Coverage:**
- Calculator page: Multi-step form navigation, validation, submission
- Dashboard page: Data display, chart rendering, interactions
- Progress page: Historical data display, trend visualization
- Landing page: Navigation, CTA interactions

**Example Test:**
```typescript
describe('Calculator Page Integration', () => {
  it('navigates through form steps', async () => {
    render(<CalculatorPage onComplete={jest.fn()} onNavigate={jest.fn()} />);
    
    // Step 1: Transportation
    await userEvent.selectOptions(screen.getByLabelText(/transport/i), 'Car');
    await userEvent.type(screen.getByLabelText(/distance/i), '20');
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 2: Electricity
    await userEvent.type(screen.getByLabelText(/electricity/i), '300');
    await userEvent.selectOptions(screen.getByLabelText(/home type/i), 'Apartment');
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Verify progress
    expect(screen.getByText(/step 2/i)).toBeInTheDocument();
  });

  it('displays validation errors', async () => {
    render(<CalculatorPage onComplete={jest.fn()} onNavigate={jest.fn()} />);
    
    // Try to proceed without filling required fields
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });
});
```

### Visual Regression Testing

**Objective:** Detect visual changes across the entire UI to ensure design consistency.

**Tools:**
- Playwright for browser automation
- Percy or Chromatic for visual diffing
- Storybook for component isolation

**Test Coverage:**
- All pages in desktop, tablet, and mobile viewports
- All component variants and states
- Chart visualizations with sample data
- Responsive layout breakpoints

**Example Configuration:**
```typescript
// playwright.config.ts
export default {
  projects: [
    { name: 'Desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'Tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'Mobile', use: { viewport: { width: 375, height: 667 } } },
  ],
};

// Example test
test('Landing page visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('landing-page.png');
});
```

### Accessibility Testing

**Objective:** Ensure the redesigned UI meets WCAG 2.1 AA accessibility standards.

**Tools:**
- axe-core via jest-axe for automated testing
- pa11y for CI/CD integration
- Manual testing with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing

**Test Coverage:**
- Color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Keyboard navigation for all interactive elements
- Focus indicators visible and clear
- ARIA labels for icons and charts
- Form field labels and error associations
- Semantic HTML structure

**Example Test:**
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('Button component has no accessibility violations', async () => {
    const { container } = render(<Button>Click Me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Form inputs have associated labels', () => {
    render(
      <FormField label="Email" helperText="Enter your email">
        <Input type="email" id="email" />
      </FormField>
    );
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
  });

  it('Navigation is keyboard accessible', async () => {
    render(<Navbar currentPage="home" onNavigate={jest.fn()} />);
    const firstLink = screen.getByText(/calculator/i);
    firstLink.focus();
    expect(firstLink).toHaveFocus();
  });
});
```

### Manual Testing Checklist

**Responsive Design:**
- [ ] Test all pages on mobile (375px, 414px)
- [ ] Test all pages on tablet (768px, 1024px)
- [ ] Test all pages on desktop (1440px, 1920px)
- [ ] Verify breakpoint transitions are smooth
- [ ] Check horizontal scrolling (should not occur)

**Cross-Browser Compatibility:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Animation & Transitions:**
- [ ] Button hover effects work smoothly
- [ ] Card hover effects work smoothly
- [ ] Chart animations play on initial load
- [ ] Progress indicators animate correctly
- [ ] Respect prefers-reduced-motion setting

**Performance:**
- [ ] Page load times under 3 seconds
- [ ] Chart rendering is smooth (no janky animations)
- [ ] Large datasets don't cause performance issues
- [ ] No memory leaks in long-running sessions

**User Flows:**
- [ ] Complete calculator flow end-to-end
- [ ] Navigate between all pages
- [ ] Sign in/sign up flows
- [ ] Save calculation and view history
- [ ] View recommendations and progress

### Test Implementation Timeline

**Phase 1: Component Tests (Week 1)**
- Implement unit tests for all UI components
- Achieve 80%+ code coverage for component library
- Set up snapshot testing baseline

**Phase 2: Integration Tests (Week 2)**
- Implement page-level integration tests
- Test form flows and data submission
- Mock API calls with MSW

**Phase 3: Visual Regression (Week 3)**
- Set up Playwright and Percy/Chromatic
- Capture baseline screenshots for all pages
- Configure CI/CD pipeline for visual diffs

**Phase 4: Accessibility (Week 4)**
- Run automated accessibility tests
- Perform manual screen reader testing
- Fix any accessibility violations
- Document accessibility compliance

**Phase 5: Manual Testing (Week 5)**
- Complete responsive design testing
- Test cross-browser compatibility
- Verify animation performance
- Conduct user acceptance testing

### Test Maintenance Strategy

**Snapshot Updates:**
- Review snapshot changes in pull requests
- Update snapshots only when intentional design changes occur
- Document reasons for snapshot updates in commit messages

**Test Data:**
- Use realistic test data that matches production scenarios
- Maintain test data fixtures for consistent testing
- Update test data when data models change

**CI/CD Integration:**
- Run component and integration tests on every commit
- Run visual regression tests on pull requests
- Block merges if tests fail or accessibility violations exist
- Generate test coverage reports

**Documentation:**
- Maintain testing documentation in repository
- Document testing patterns and conventions
- Provide examples for common testing scenarios
- Update documentation when testing approach changes

## Implementation Plan

### Phase 1: Design System Foundation (Week 1)

**Objective:** Establish the core design system with tokens, styles, and utilities.

**Tasks:**
1. Create design-tokens.css with all CSS custom properties
2. Update index.css with global styles and utility classes
3. Configure Tailwind CSS for custom design tokens
4. Create TypeScript type definitions for design tokens
5. Document design system usage in README

**Deliverables:**
- design-tokens.css file
- Updated index.css with new global styles
- TypeScript types for design tokens
- Design system documentation

**Testing:**
- Verify CSS custom properties are accessible
- Test token usage in sample components
- Validate responsive breakpoints

### Phase 2: Component Library (Weeks 2-3)

**Objective:** Build reusable UI components based on design system.

**Tasks:**
1. Implement Button component with variants
2. Implement Card component with variants
3. Implement Input and FormField components
4. Implement OptionCard component
5. Implement chart wrapper components (BarChart, LineChart, PieChart)
6. Implement layout components (Navbar, Footer, Container)
7. Create Storybook stories for all components
8. Write component unit tests

**Deliverables:**
- src/components/ui/ directory with all UI components
- src/components/charts/ directory with chart components
- src/components/layout/ directory with layout components
- Storybook configuration and stories
- Component unit tests with 80%+ coverage

**Testing:**
- Unit tests for each component
- Snapshot tests for visual regression
- Accessibility tests with jest-axe
- Storybook visual testing

### Phase 3: Page Redesigns (Weeks 4-6)

**Objective:** Redesign all application pages using component library.

**Week 4: Landing & Calculator Pages**
1. Redesign LandingPage.tsx
   - Hero section with Earth illustration
   - Feature cards grid
   - How it works section
   - CTA section
2. Redesign CalculatorPage.tsx
   - Multi-step form layout
   - Progress sidebar
   - Form sections with validation
   - Navigation controls

**Week 5: Dashboard & Recommendations Pages**
1. Redesign DashboardPage.tsx (Results display)
   - Metric cards
   - Carbon breakdown chart
   - Category breakdown
   - Pie chart distribution
   - Recommendations section
2. Extract RecommendationsPage.tsx if needed

**Week 6: Progress & Profile Pages**
1. Create ProgressPage.tsx
   - Line chart for historical data
   - Eco score display
   - Achievements section
   - Trend indicators
2. Create ProfilePage.tsx
   - User information display
   - Settings options
   - Impact summary

**Deliverables:**
- All page components redesigned
- Page-level integration tests
- Responsive layouts for all pages
- Updated navigation flow

**Testing:**
- Integration tests for each page
- Visual regression tests
- Responsive design testing
- User flow testing

### Phase 4: Responsive & Accessibility (Week 7)

**Objective:** Ensure responsive design and accessibility compliance.

**Tasks:**
1. Implement responsive breakpoints for all components
2. Test responsive layouts on multiple devices
3. Optimize mobile navigation (hamburger menu)
4. Run accessibility audits with axe-core
5. Fix accessibility violations
6. Test keyboard navigation
7. Test with screen readers (NVDA, VoiceOver)
8. Verify color contrast ratios
9. Add ARIA labels where needed

**Deliverables:**
- Responsive CSS for all breakpoints
- Mobile navigation implementation
- Accessibility compliance report
- Fixed accessibility violations

**Testing:**
- Manual responsive testing on real devices
- Automated accessibility tests
- Manual screen reader testing
- Keyboard navigation testing

### Phase 5: Animation & Polish (Week 8)

**Objective:** Add animations, transitions, and final polish.

**Tasks:**
1. Implement hover animations for buttons and cards
2. Add chart animation on initial load
3. Implement progress indicator animations
4. Add loading state animations
5. Implement smooth page transitions
6. Optimize animation performance
7. Add prefers-reduced-motion support
8. Final design polish and tweaks

**Deliverables:**
- Animation CSS and transitions
- Loading state components
- Prefers-reduced-motion implementation
- Performance optimization

**Testing:**
- Animation performance testing
- Reduced motion testing
- Cross-browser animation testing

### Phase 6: Testing & QA (Week 9)

**Objective:** Comprehensive testing and quality assurance.

**Tasks:**
1. Complete all unit tests
2. Complete all integration tests
3. Set up visual regression testing pipeline
4. Run cross-browser compatibility tests
5. Conduct user acceptance testing
6. Fix bugs and issues
7. Optimize performance
8. Final code review

**Deliverables:**
- Complete test suite
- Bug fixes and optimizations
- Performance improvements
- QA report

**Testing:**
- All automated tests passing
- Visual regression baseline established
- Cross-browser testing complete
- User acceptance criteria met

### Phase 7: Documentation & Deployment (Week 10)

**Objective:** Document the redesign and deploy to production.

**Tasks:**
1. Update component documentation
2. Create usage examples and guides
3. Document accessibility features
4. Update README and contribution guidelines
5. Prepare deployment checklist
6. Deploy to staging environment
7. Conduct final smoke testing
8. Deploy to production
9. Monitor for issues

**Deliverables:**
- Complete documentation
- Deployment checklist
- Staging deployment
- Production deployment
- Monitoring setup

**Testing:**
- Smoke tests in staging
- Production monitoring
- Post-deployment verification

### Milestones & Success Criteria

**Milestone 1 (End of Week 3):** Component library complete
- All UI components implemented
- Component tests passing
- Storybook stories created

**Milestone 2 (End of Week 6):** All pages redesigned
- All 6 pages match design reference
- Integration tests passing
- Responsive layouts working

**Milestone 3 (End of Week 7):** Accessibility compliant
- No accessibility violations
- Screen reader compatible
- Keyboard navigable

**Milestone 4 (End of Week 9):** Ready for production
- All tests passing
- Performance optimized
- Cross-browser compatible

**Milestone 5 (End of Week 10):** Production deployment
- Deployed to production
- Monitoring in place
- Documentation complete

## Risk Assessment & Mitigation

### Technical Risks

**Risk: CSS Conflicts with Existing Styles**
- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:** Use CSS modules or scoped styles, perform thorough regression testing
- **Contingency:** Gradually migrate styles, maintain fallback to old styles if needed

**Risk: Chart Library Performance Issues**
- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:** Test with large datasets, optimize chart rendering, implement virtualization if needed
- **Contingency:** Consider alternative chart library if Recharts has performance issues

**Risk: Responsive Design Edge Cases**
- **Likelihood:** Medium
- **Impact:** Low
- **Mitigation:** Test on wide range of devices, use flexible layouts, implement progressive enhancement
- **Contingency:** Provide simplified mobile layout if complex responsive design fails

**Risk: Browser Compatibility Issues**
- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:** Use autoprefixer, test on all target browsers, avoid cutting-edge CSS features
- **Contingency:** Provide polyfills or fallbacks for unsupported features

**Risk: Accessibility Violations**
- **Likelihood:** Low
- **Impact:** High
- **Mitigation:** Use automated testing tools, manual screen reader testing, follow WCAG guidelines
- **Contingency:** Prioritize fixes for critical violations, document known issues

### Project Risks

**Risk: Design Changes During Implementation**
- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:** Get design approval upfront, freeze design during implementation, document change process
- **Contingency:** Allocate buffer time for design iterations, use component approach for easy updates

**Risk: Timeline Delays**
- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:** Build buffer into schedule, identify critical path, parallel work where possible
- **Contingency:** Reduce scope to MVP features, defer non-critical enhancements

**Risk: Integration Issues with Backend**
- **Likelihood:** Low
- **Impact:** Low
- **Mitigation:** Maintain API contracts, use mock data for development, coordinate with backend team
- **Contingency:** Implement adapter layer to handle API changes

**Risk: User Resistance to New Design**
- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:** Conduct user testing, gather feedback, provide smooth transition
- **Contingency:** Offer classic view option, gather user feedback for improvements

## Appendix

### Color Palette Reference

**Primary Colors:**
- Green: #118865 (primary actions, branding)
- Green Dark: #087053 (hover states, emphasis)
- Green Light: #eaf7ed (backgrounds, highlights)

**Neutral Colors:**
- Ink: #173d39 (primary text)
- Muted: #65827e (secondary text)
- Line: #d9e9e1 (borders, dividers)
- Cream: #f4f8ed (alternate backgrounds)
- Background: #f8fbf7 (page background)

**Semantic Colors:**
- Success: #118865 (same as primary green)
- Warning: #e0932a (above-average metrics)
- Error: #e85b5b (validation errors)

**Category Colors:**
- Transport: #118865 (green)
- Electricity: #1594a1 (teal)
- Food: #e0932a (orange)
- Waste: #8b6fc0 (purple)
- Travel: #d65b5b (red)

### Typography Reference

**Font Families:**
- Body: DM Sans (sans-serif)
- Display: Fraunces (serif)

**Font Sizes:**
- Extra Small: 10px
- Small: 11px
- Base: 13px
- Large: 15px
- Extra Large: 18px
- 2XL: 22px
- 3XL: 34px
- 4XL: 48px
- 5XL: 70px

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

**Line Heights:**
- Tight: 1.0 (headings)
- Snug: 1.1 (large text)
- Normal: 1.5 (standard text)
- Relaxed: 1.7 (body text)

### Responsive Breakpoints

**Mobile:** < 800px
- Single column layouts
- Hamburger navigation
- Stacked cards
- Reduced font sizes
- Compact spacing

**Tablet:** 800px - 1200px
- Two-column layouts where appropriate
- Standard navigation
- Moderate spacing

**Desktop:** ≥ 1200px
- Multi-column layouts
- Full navigation
- Generous spacing
- Maximum content width: 1160px

**Extra Small (Mobile):** < 430px
- Ultra-compact layouts
- Minimum font sizes
- Essential content only

### Icon Reference

**Navigation & Actions:**
- Leaf: Branding, environmental theme
- ArrowRight: Forward navigation, CTAs
- ArrowLeft: Back navigation
- Check: Completion, success, selection
- X: Close, dismiss
- Menu: Mobile navigation toggle

**Categories:**
- Car: Transportation
- Home: Electricity
- Utensils: Food
- Recycle: Waste
- Plane: Air Travel

**Features:**
- BarChart3: Calculate feature
- Sparkles: Understand feature (AI insights)
- Sprout: Improve feature (progress)
- Lightbulb: Insights, recommendations
- Brain: ML predictions
- Gauge: Eco score

**Status & Feedback:**
- CircleCheck: Validation success
- TrendingUp: Increase, above average
- TrendingDown: Decrease, below average
- Minus: No change, equal
- Loader2: Loading state
- AlertCircle: Error, warning

### Accessibility Checklist

**Color & Contrast:**
- [ ] 4.5:1 contrast ratio for normal text
- [ ] 3:1 contrast ratio for large text (18px+)
- [ ] Color not used as only means of conveying information
- [ ] Focus indicators visible with 3:1 contrast

**Keyboard Navigation:**
- [ ] All interactive elements keyboard accessible
- [ ] Logical tab order
- [ ] Focus visible on all focusable elements
- [ ] Keyboard shortcuts documented
- [ ] No keyboard traps

**Screen Readers:**
- [ ] Semantic HTML elements used
- [ ] ARIA labels for icons and graphics
- [ ] ARIA live regions for dynamic content
- [ ] Form fields have associated labels
- [ ] Error messages announced
- [ ] Chart data available in alternative format

**Structure:**
- [ ] Heading hierarchy (H1, H2, H3) follows logical order
- [ ] Landmark regions defined (nav, main, footer)
- [ ] Lists use proper list markup
- [ ] Tables use proper table markup (if applicable)

**Forms:**
- [ ] All form fields have labels
- [ ] Required fields indicated
- [ ] Error messages associated with fields
- [ ] Field instructions provided
- [ ] Validation errors clear and actionable

**Media:**
- [ ] Images have alt text
- [ ] Decorative images have empty alt
- [ ] Icons have aria-label or sr-only text
- [ ] Charts have text alternatives

**Motion:**
- [ ] Animations respect prefers-reduced-motion
- [ ] No auto-playing animations over 5 seconds
- [ ] Users can pause animations

### Browser Support Matrix

**Fully Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

**Partially Supported (graceful degradation):**
- Chrome 80-89 (some CSS features may not work)
- Firefox 78-87 (some CSS features may not work)
- Safari 13 (some CSS features may not work)

**Not Supported:**
- Internet Explorer (any version)
- Legacy mobile browsers

### Performance Targets

**Page Load:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.0s
- Cumulative Layout Shift: < 0.1

**Runtime:**
- 60fps animations
- < 100ms response to user interactions
- < 500ms chart rendering

**Bundle Size:**
- Total JS: < 200KB gzipped
- Total CSS: < 50KB gzipped
- Critical CSS: < 15KB inline

### References

**Design System Inspiration:**
- Material Design (component patterns)
- Tailwind CSS (utility-first approach)
- Radix UI (accessibility patterns)

**Accessibility Guidelines:**
- WCAG 2.1 Level AA
- WAI-ARIA Authoring Practices

**Tools & Libraries:**
- React 18 Documentation
- TypeScript Handbook
- Recharts Documentation
- Lucide Icons
- React Testing Library
