import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo'

const primaryNav = [
  { to: '/programmes', label: 'Programmes' },
  { to: '/programmes/clinical-excellence', label: 'Clinical Excellence' },
  { to: '/for-professionals', label: 'For clinicians' },
  { to: '/for-organisations', label: 'For organisations' },
  { to: '/about', label: 'About' },
]

const footerCols = [
  {
    title: 'Learn',
    links: [
      { to: '/programmes/clinical-excellence', label: 'Clinical Excellence' },
      { to: '/programmes', label: 'All programmes' },
      { to: '/for-professionals', label: 'For clinicians' },
      { to: '/for-organisations', label: 'For organisations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact' },
    ],
  },
]

function navClass({ isActive }) {
  return isActive ? 'nav__link is-active' : 'nav__link'
}

function NavItems({ onNavigate }) {
  return (
    <>
      {primaryNav.map(({ to, label }) => (
        <NavLink key={to} to={to} className={navClass} onClick={onNavigate}>
          {label}
        </NavLink>
      ))}
      <NavLink
        to="/contact"
        className={({ isActive }) => (isActive ? 'nav__cta is-active' : 'nav__cta')}
        onClick={onNavigate}
      >
        Get in touch
      </NavLink>
    </>
  )
}

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand" onClick={close}>
            <Logo size={36} />
            <span className="brand__text">
              <span className="brand__name">Serenest</span>
              <span className="brand__sub">Education</span>
            </span>
          </Link>

          <nav className="nav nav--desktop" aria-label="Primary">
            <NavItems onNavigate={close} />
          </nav>

          <button
            type="button"
            className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <>
          <button type="button" className="nav-backdrop" aria-label="Close menu" onClick={close} />
          <aside id="mobile-drawer" className="nav-drawer" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="nav-drawer__head">
              <span>Menu</span>
              <button type="button" className="nav-drawer__close" onClick={close} aria-label="Close">
                ×
              </button>
            </div>
            <nav className="nav nav--mobile" aria-label="Primary mobile">
              <NavItems onNavigate={close} />
            </nav>
          </aside>
        </>
      ) : null}

      <main id="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Logo size={34} />
            <div>
              <strong>Serenest Education</strong>
              <p>Clinical-grade learning for mind and practice. Part of the Serenest ecosystem.</p>
            </div>
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <p className="footer__label">{col.title}</p>
              <nav className="footer__nav" aria-label={col.title}>
                {col.links.map((l) => (
                  <Link key={l.to} to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
          <div>
            <p className="footer__label">Contact</p>
            <a className="footer__mail" href="mailto:support@serenest.in">
              support@serenest.in
            </a>
            <p className="footer__note">Education only — not emergency care. In crisis, dial 112 / 108.</p>
          </div>
        </div>
        <div className="container footer__bottom">
          <p>© {new Date().getFullYear()} Serenest Education Pvt Ltd</p>
          <a href="https://www.serenest.in" target="_blank" rel="noreferrer">
            Clinical care on serenest.in →
          </a>
        </div>
      </footer>
    </div>
  )
}
