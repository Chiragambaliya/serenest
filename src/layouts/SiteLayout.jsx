import React, { useEffect, useState, useCallback } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import ProfessionalsSubNav from '../components/ProfessionalsSubNav';
import { useAuth } from '../lib/useAuth';

export default function SiteLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isHome = location.pathname === '/';
  const isPatient = user?.user_metadata?.role === 'patient';
  const patientFirstName = isPatient
    ? (user.user_metadata?.full_name || user.user_metadata?.name || '').split(' ')[0]
    : '';

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navClass = ({ isActive }) =>
    isActive ? 'srn-nav-link is-active' : 'srn-nav-link';

  const hideFloatingWhatsApp =
    location.pathname.startsWith('/book') ||
    location.pathname.startsWith('/professionals/apply') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/consultation');

  const headerTone = isHome && !scrolled && !menuOpen ? 'is-over-hero' : scrolled ? 'is-solid' : 'is-soft';

  return (
    <div className="srn-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={`srn-topbar ${headerTone}`}>
        <div className="srn-topbar-inner">
          <Link to="/" className="srn-logo" aria-label="Serenest — Home">
            <span className="srn-logo-mark" aria-hidden="true">
              S
            </span>
            <span className="srn-logo-text">Serenest</span>
          </Link>

          <nav className="srn-nav" aria-label="Main navigation">
            <NavLink to="/screening" className={navClass}>
              Understand
            </NavLink>
            <NavLink to="/services" className={navClass}>
              Care
            </NavLink>
            <NavLink to="/pricing" className={navClass}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
          </nav>

          <div className="srn-topbar-actions">
            {isPatient ? (
              <NavLink to="/patient/dashboard" className="srn-nav-link srn-nav-account">
                {patientFirstName || 'My care'}
              </NavLink>
            ) : (
              <NavLink to="/patient/login" className="srn-nav-link srn-nav-account">
                Sign in
              </NavLink>
            )}
            <Link className="srn-book-btn" to="/book">
              Book
            </Link>
            <button
              type="button"
              className={`srn-burger ${menuOpen ? 'is-open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {location.pathname.startsWith('/professionals') ? <ProfessionalsSubNav /> : null}

      {menuOpen ? (
        <div className="srn-drawer-backdrop" role="presentation" onClick={() => setMenuOpen(false)}>
          <aside className="srn-drawer" role="dialog" aria-label="Menu" onClick={(e) => e.stopPropagation()}>
            <div className="srn-drawer-head">
              <span className="srn-logo-text">Serenest</span>
              <button type="button" className="srn-drawer-x" aria-label="Close" onClick={() => setMenuOpen(false)}>
                ✕
              </button>
            </div>
            <nav className="srn-drawer-nav">
              <Link to="/screening" onClick={() => setMenuOpen(false)}>
                Understand yourself
              </Link>
              <Link to="/book" onClick={() => setMenuOpen(false)}>
                Book a session
              </Link>
              <Link to="/services" onClick={() => setMenuOpen(false)}>
                Care &amp; services
              </Link>
              <Link to="/pricing" onClick={() => setMenuOpen(false)}>
                Pricing
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link to="/blog" onClick={() => setMenuOpen(false)}>
                Guides
              </Link>
              <Link to="/patient/login" onClick={() => setMenuOpen(false)}>
                Patient sign in
              </Link>
              <hr className="srn-drawer-rule" />
              <Link to="/professionals" onClick={() => setMenuOpen(false)}>
                For professionals
              </Link>
              <Link to="/academy" onClick={() => setMenuOpen(false)}>
                Academy
              </Link>
              <Link to="/corporate" onClick={() => setMenuOpen(false)}>
                Corporate EAP
              </Link>
              <Link to="/careers" onClick={() => setMenuOpen(false)}>
                Careers
              </Link>
              <Link to="/privacy" onClick={() => setMenuOpen(false)}>
                Privacy
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}

      <main id="main">
        <Outlet />
      </main>

      <footer className="srn-foot">
        <div className="srn-foot-inner">
          <div className="srn-foot-brand">
            <div className="srn-logo-text">Serenest</div>
            <p>Clinical telepsychiatry across India. Care, professionals, and Academy under one company.</p>
          </div>
          <div className="srn-foot-cols">
            <div>
              <h4>Care</h4>
              <Link to="/book">Book</Link>
              <Link to="/screening">Mental Health Center</Link>
              <Link to="/burnout-check">Burnout Check</Link>
              <Link to="/evidence">Evidence Center</Link>
              <Link to="/pricing">Pricing</Link>
            </div>
            <div>
              <h4>Professionals</h4>
              <Link to="/professionals">Join Serenest</Link>
              <Link to="/academy">Academy</Link>
              <Link to="/academy/learn">Learning hub</Link>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/corporate">Corporate EAP</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/privacy">Privacy</Link>
              <a href="mailto:support@serenest.in">support@serenest.in</a>
            </div>
          </div>
          <div className="srn-foot-bottom">
            <p>© {new Date().getFullYear()} Serenest Education Pvt Ltd</p>
            <a href="https://wa.me/917777936367" target="_blank" rel="noreferrer">
              WhatsApp +91 77779 36367
            </a>
          </div>
        </div>
      </footer>

      {!hideFloatingWhatsApp ? (
        <a
          className="srn-wa"
          href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat on WhatsApp"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}
