import { Logo } from '@/components/Logo';

export function Footer({ onNavigate }: { onNavigate: (page: 'home' | 'calculator' | 'results' | 'dashboard') => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <Logo onClick={() => onNavigate('home')} />
            <p>Small choices. Big impact.</p>
          </div>
          
          <nav className="footer-links">
            <button type="button" className="footer-link-button" onClick={() => onNavigate('home')}>About</button>
            <button type="button" className="footer-link-button" onClick={() => onNavigate('home')}>Privacy</button>
            <button type="button" className="footer-link-button" onClick={() => onNavigate('home')}>Terms</button>
            <button type="button" className="footer-link-button" onClick={() => onNavigate('home')}>Contact</button>
          </nav>
          
          <p className="copyright">
            © {currentYear} EcoTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
