import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';

export const EDITORIAL_NAV = [
  { label: 'Services', to: '/services' },
  { label: 'For Professionals', to: '/professionals' },
  { label: 'Academy', to: '/academy' },
  { label: 'About', to: '/about' },
  { label: 'Resources', to: '/guides' },
  { label: 'Contact', to: 'mailto:support@serenest.in', external: true },
];

/**
 * Shared Serenest editorial header (used on /preview in this phase).
 * Booking CTA preserves existing /book route.
 */
export default function GlobalHeader({ homeTo = '/preview', showTestBanner = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="gh">
        {showTestBanner && (
          <div className="gh__banner" role="status">
            <strong>Test homepage</strong>
            <span>Live site unchanged →</span>
            <Link to="/">serenest.in/</Link>
          </div>
        )}
        <div className="ds-shell ds-shell--wide gh__inner">
          <Link to={homeTo} className="gh__brand" aria-label="Serenest — Home">
            <img src="/favicon.svg" alt="" width="30" height="30" />
            <span className="gh__wordmark">Serenest</span>
          </Link>

          <nav className="gh__nav" aria-label="Main navigation">
            {EDITORIAL_NAV.map((item) => (
              item.external ? (
                <a key={item.label} href={item.to}>{item.label}</a>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </nav>

          <Link className="ds-btn ds-btn--primary gh__cta" to="/book">
            Book an Appointment
          </Link>

          <button
            type="button"
            className={`gh__menu-btn${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="editorial-mobile-nav"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <MobileNavigation
          items={EDITORIAL_NAV}
          onClose={() => setMenuOpen(false)}
          homeTo={homeTo}
        />
      )}
    </>
  );
}
