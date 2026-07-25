import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Accessible mobile navigation drawer for the editorial header.
 */
export default function MobileNavigation({ items, onClose, homeTo = '/preview' }) {
  return (
    <div className="mn" role="presentation" onClick={onClose}>
      <aside
        id="editorial-mobile-nav"
        className="mn__panel"
        role="dialog"
        aria-label="Mobile navigation"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mn__head">
          <Link to={homeTo} className="gh__brand" onClick={onClose} aria-label="Serenest — Home">
            <img src="/favicon.svg" alt="" width="28" height="28" />
            <span className="gh__wordmark">Serenest</span>
          </Link>
          <button type="button" className="mn__close" aria-label="Close menu" onClick={onClose}>
            ×
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          {items.map((item) => (
            item.external ? (
              <a key={item.label} href={item.to} onClick={onClose}>{item.label}</a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        <Link className="ds-btn ds-btn--primary mn__cta" to="/book" onClick={onClose}>
          Book an Appointment
        </Link>
      </aside>
    </div>
  );
}
