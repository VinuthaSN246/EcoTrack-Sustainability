import { Check } from 'lucide-react';

export interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * OptionCard Component
 * 
 * A selectable card-based input control for form options.
 * Displays with icon (optional), label, and checkmark when selected.
 * 
 * Features:
 * - Green border and background when selected
 * - Checkmark icon display on selection
 * - Hover effects with border color change
 * - Optional icon support
 * - Disabled state support
 * 
 * @param label - The text label displayed on the card
 * @param selected - Whether the card is currently selected
 * @param onClick - Callback function when card is clicked
 * @param icon - Optional icon element to display (left-aligned)
 * @param disabled - Whether the card is disabled
 */
export function OptionCard({
  label,
  selected,
  onClick,
  icon,
  disabled = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={`option-card ${selected ? 'option-selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${label}${selected ? ', selected' : ''}`}
    >
      {icon && <span className="option-icon">{icon}</span>}
      <span>{label}</span>
      {selected && <Check size={16} className="option-check" aria-hidden="true" />}
    </button>
  );
}
