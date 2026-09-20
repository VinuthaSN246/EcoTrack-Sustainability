import { useState } from 'react';
import { Calculator, LayoutDashboard, Lightbulb, Menu, TrendingUp, User, X } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface NavbarProps {
  onNavigate: (page: 'home' | 'calculator' | 'results' | 'dashboard' | 'progress' | 'profile' | 'recommendations') => void;
  onGoDashboard: () => void;
  hasData: boolean;
  currentPage?: 'home' | 'calculator' | 'results' | 'dashboard' | 'progress' | 'profile' | 'recommendations';
}

export function Navbar({ onNavigate, onGoDashboard, hasData, currentPage = 'home' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (page: 'home' | 'calculator' | 'results' | 'dashboard' | 'progress' | 'profile' | 'recommendations') => {
    setMenuOpen(false);
    if (page === 'dashboard') {
      onGoDashboard();
    } else {
      onNavigate(page);
    }
  };

  const navItems = [
    { label: 'Home', page: 'home' as const, icon: Calculator },
    { label: 'Calculator', page: 'calculator' as const, icon: Calculator },
    { label: 'Dashboard', page: 'dashboard' as const, icon: LayoutDashboard },
    { label: 'Recommendations', page: 'recommendations' as const, icon: Lightbulb },
    { label: 'Progress', page: 'progress' as const, icon: TrendingUp },
    { label: 'Profile', page: 'profile' as const, icon: User },
  ];

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Logo onClick={() => handleNavClick('home')} />
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-link-button ${currentPage === item.page ? 'active' : ''}`}
              onClick={() => handleNavClick(item.page)}
              aria-current={currentPage === item.page ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}
