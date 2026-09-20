# Button Component

A reusable, accessible button component with multiple variants, sizes, and states designed for the EcoTrack UI redesign.

## Requirements Coverage

This component satisfies **Requirements 11.1-11.7**:
- ✅ 11.1: Primary button style with green background, white text, and rounded corners
- ✅ 11.2: Ghost button style with transparent background, border, and colored text
- ✅ 11.3: Light button style with white background and green text
- ✅ 11.4: Hover animations with translateY -2px and enhanced shadow
- ✅ 11.5: Disabled state with 40% opacity and no hover effects
- ✅ 11.6: Button sizes (small, medium, large) with appropriate padding
- ✅ 11.7: Icon positioning (left/right) support

## Features

### Variants
- **Primary** (default): Green background (#118865), white text, shadow
- **Ghost**: Transparent background with border, changes to white bg on hover
- **Light**: White background, green text, typically used on colored backgrounds

### Sizes
- **Small**: 11px 16px padding, 11px font size
- **Medium** (default): 14px 21px padding, 12px font size
- **Large**: 16px 28px padding, 14px font size

### States
- **Loading**: Shows spinner, disables interaction, hides icon
- **Disabled**: 40% opacity, no hover effects, no interaction
- **Normal**: Full interaction with hover animations

### Icon Support
- Icons can be positioned **left** or **right** (default)
- Icons are hidden during loading state
- Icons scale appropriately with button size

### Animations
- Hover: Translates Y by -2px, enhances shadow
- Transition: 200ms ease for transform, background, and box-shadow
- Disabled/loading states prevent animations

## Usage

### Basic Usage

```tsx
import { Button } from '@/components/ui';

// Simple button
<Button>Click Me</Button>

// With variant
<Button variant="ghost">Ghost Button</Button>

// With size
<Button size="large">Large Button</Button>
```

### With Icons

```tsx
import { Button } from '@/components/ui';
import { ArrowRight, Download, Plus } from 'lucide-react';

// Icon on the right (default)
<Button icon={<ArrowRight size={16} />}>
  Continue
</Button>

// Icon on the left
<Button icon={<Plus size={16} />} iconPosition="left">
  Add New
</Button>

// With different variants
<Button variant="ghost" icon={<Download size={16} />}>
  Download
</Button>
```

### Loading State

```tsx
import { Button } from '@/components/ui';

const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  await performAction();
  setLoading(false);
};

<Button loading={loading} onClick={handleClick}>
  {loading ? 'Processing...' : 'Submit'}
</Button>
```

### Disabled State

```tsx
import { Button } from '@/components/ui';

<Button disabled>Cannot Click</Button>

// Disabled with conditions
<Button disabled={!formValid}>Submit Form</Button>
```

### Combinations

```tsx
import { Button } from '@/components/ui';
import { Sparkles } from 'lucide-react';

// All features combined
<Button
  variant="primary"
  size="large"
  icon={<Sparkles size={18} />}
  loading={isCalculating}
  disabled={!hasData}
  onClick={handleCalculate}
>
  Calculate Footprint
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'ghost' \| 'light'` | `'primary'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `icon` | `React.ReactNode` | - | Optional icon element |
| `iconPosition` | `'left' \| 'right'` | `'right'` | Icon position relative to text |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `disabled` | `boolean` | `false` | Disables button interaction |
| `children` | `React.ReactNode` | required | Button content |
| `className` | `string` | `''` | Additional CSS classes |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `onClick` | `() => void` | - | Click event handler |

All standard HTML button attributes are also supported through props spreading.

## Accessibility

The Button component follows WCAG 2.1 AA accessibility guidelines:

- ✅ Semantic `<button>` element
- ✅ `aria-busy` attribute during loading state
- ✅ `aria-disabled` attribute when disabled
- ✅ `aria-label` on loading spinner
- ✅ Icons marked with `aria-hidden="true"`
- ✅ Sufficient color contrast ratios
- ✅ Keyboard accessible (focus visible)
- ✅ Touch target size meets 44x44px minimum

## Styling

The Button component uses CSS classes defined in `src/index.css`:

- `.button` - Base button styles
- `.button-small` - Small size variant
- `.button-large` - Large size variant
- `.button-ghost` - Ghost variant styles
- `.button-light` - Light variant styles
- `.spin` - Loading spinner animation

Custom styles can be added via the `className` prop.

## Testing

The Button component has comprehensive test coverage:

```bash
# Run Button tests
npm run test:run -- src/components/ui/Button.test.tsx

# Watch mode
npm test -- src/components/ui/Button.test.tsx
```

**Test Coverage:**
- ✅ All three variants render correctly
- ✅ All three sizes render correctly
- ✅ Icon positioning (left/right) works
- ✅ Loading state shows spinner and disables button
- ✅ Disabled state prevents interaction
- ✅ Click handlers work when enabled
- ✅ Custom classes apply correctly
- ✅ Complex children render properly

## Examples

See `Button.example.tsx` for a comprehensive visual showcase of all button variants, sizes, states, and real-world use cases.

## Design Tokens

The Button component uses the following design tokens:

```css
--color-green: #118865
--color-green-dark: #087053
--color-ink: #173d39
--color-line: #d9e9e1
--radius-button: 999px
--shadow-button: 0 8px 18px rgba(17, 136, 101, 0.15)
--shadow-button-hover: 0 12px 22px rgba(17, 136, 101, 0.20)
--transition-button: transform 200ms ease, background 200ms ease, box-shadow 200ms ease
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Mobile 90+

## Migration Notes

If replacing old button implementations:

1. Import from `@/components/ui` instead of old paths
2. Update `variant` prop values to match new API
3. Wrap icons in the `icon` prop instead of as children
4. Use `loading` prop instead of manual spinner logic
5. Update CSS classes if using custom styling

## Related Components

- **Card**: Container component with consistent styling
- **Input**: Form input component for user data entry
- **OptionCard**: Selectable card-based input control
