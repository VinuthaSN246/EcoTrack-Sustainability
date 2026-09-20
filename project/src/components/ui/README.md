# UI Components

This directory contains reusable UI components for the EcoTrack application.

## OptionCard

A selectable card-based input control for form options.

### Features

- **Visual States:**
  - Default: Light cream background (#f8fbf7), subtle border (#d9e9e1)
  - Hover: Green border (#118865), light green background (#eef8ef)
  - Selected: Green border, green background (#eaf7ed), green text, checkmark icon

- **Accessibility:**
  - Uses semantic button element
  - ARIA attributes (`aria-pressed`, `aria-label`)
  - Keyboard accessible
  - Screen reader friendly

- **Customization:**
  - Optional icon support (left-aligned)
  - Disabled state
  - Checkmark automatically shown when selected

### Usage

```tsx
import { OptionCard } from '@/components/ui/OptionCard';
import { Car } from 'lucide-react';

function MyForm() {
  const [selected, setSelected] = useState('');

  return (
    <div className="option-grid">
      <OptionCard
        label="Car"
        selected={selected === 'car'}
        onClick={() => setSelected('car')}
        icon={<Car size={16} />}
      />
      <OptionCard
        label="Bus"
        selected={selected === 'bus'}
        onClick={() => setSelected('bus')}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Text label displayed on the card |
| `selected` | `boolean` | Yes | - | Whether the card is selected |
| `onClick` | `() => void` | Yes | - | Callback when card is clicked |
| `icon` | `React.ReactNode` | No | - | Optional icon (left-aligned) |
| `disabled` | `boolean` | No | `false` | Whether the card is disabled |

### CSS Classes

The component uses the following CSS classes defined in `src/index.css`:

- `.option-card` - Base card styling
- `.option-selected` - Selected state styling
- `.option-icon` - Icon container styling
- `.option-check` - Checkmark icon styling

### Grid Layouts

For laying out multiple option cards, use these grid classes:

- `.option-grid` - 2 columns (default)
- `.option-grid-3` - 3 columns
- `.option-grid-4` - 4 columns

```tsx
<div className="option-grid-3">
  <OptionCard label="Option 1" selected={...} onClick={...} />
  <OptionCard label="Option 2" selected={...} onClick={...} />
  <OptionCard label="Option 3" selected={...} onClick={...} />
</div>
```

### Requirements Covered

This component satisfies the following requirements:

- **Requirement 4.3:** Option cards for multiple choice questions with icons and checkmarks
- **Requirement 4.5:** Green border, green text, and checkmark on selection
- **Requirement 17:** 200ms transition for hover effects

### Design Tokens Used

- Colors: `--color-green` (#118865), `--color-line` (#d9e9e1)
- Border Radius: `--radius-sm` (12px)
- Transitions: `--transition-fast` (200ms ease)
