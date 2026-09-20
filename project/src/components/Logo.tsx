import { Leaf } from 'lucide-react';

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button className="logo" aria-label="EcoTrack home" onClick={onClick} type="button">
      <span className="logo-mark">
        <Leaf size={18} strokeWidth={2.5} />
      </span>
      <span>Eco<span>Track</span></span>
    </button>
  );
}
