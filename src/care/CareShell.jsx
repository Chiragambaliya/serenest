import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { CARE_PHONE_DISPLAY, CARE_TEL_HREF, careWaHref } from '../lib/patientReach';
import './care.css';

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/patient/find-professional', label: 'Clinicians' },
  { to: '/screening', label: 'Screening' },
  { to: '/pricing', label: 'Fees' },
  { to: '/contact', label: 'Contact' },
];

export default function CareShell() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const account = user ? '/patient/dashboard' : '/patient/login';

  return (
    <div className="care-site">
      <a className="care-skip" href="#main">Skip to content</a>
      <header className="care-header">
        <div className="care-header__inner">
          <Link to="/" className="care-brand" aria-label="Serenest home">
            <strong>Serenest</strong>
            <span>Clinical care</span>
          </Link>
          <nav className="care-nav" aria-label="Care">
            {LINKS.map((item) => (
              <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
            ))}
            <NavLink to={account}>{user ? 'Account' : 'Sign in'}</NavLink>
            <NavLink className="care-nav__book" to="/book">Book an appointment</NavLink>
          </nav>
          <button type="button" className="care-menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
        <div className={`care-drawer${open ? ' is-open' : ''}`}>
          {LINKS.map((item) => (
            <Link key={item.to} to={item.to}>{item.label}</Link>
          ))}
          <Link to={account}>{user ? 'Account' : 'Sign in'}</Link>
          <Link to="/book">Book an appointment</Link>
        </div>
      </header>
      <main id="main" className="care-main">
        <Outlet />
      </main>
      <footer className="care-footer">
        <div className="care-footer__inner">
          <p>Serenest Private Limited · clinical care with verified specialists. Not an academy and not an emergency service.</p>
          <nav aria-label="Footer">
            <Link to="/book">Book</Link>
            <Link to="/services">Services</Link>
            <Link to="/patient/find-professional">Clinicians</Link>
            <Link to="/screening">Screening</Link>
            <Link to="/pricing">Fees</Link>
            <Link to="/professionals">For clinicians</Link>
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <a href={CARE_TEL_HREF}>{CARE_PHONE_DISPLAY}</a>
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
