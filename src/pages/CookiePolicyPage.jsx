import React from 'react';
import { Link } from 'react-router-dom';

const UPDATED = 'June 2026';

const COOKIES = [
  { name: 'Session / auth', essential: true, purpose: 'Keeps you logged in securely across pages.' },
  { name: 'CSRF protection', essential: true, purpose: 'Prevents cross-site request forgery attacks.' },
  { name: 'Cookie consent', essential: true, purpose: 'Stores your cookie preference so we don\'t ask repeatedly.' },
  { name: 'Analytics (self-hosted)', essential: false, purpose: 'Aggregated page-view counts to understand which content is useful. No personal data shared externally.' },
  { name: 'UTM / referral', essential: false, purpose: 'Tracks campaign source (e.g. from a link in a WhatsApp message) for a single session.' },
];

export default function CookiePolicyPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Legal</p>
            <h1 className="page-title">Cookie Policy</h1>
            <p className="about-subtext">
              Serenest uses a minimal number of cookies. This page explains what they are, why we use them, and how you can control them.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>What are cookies?</h2>
              <p className="muted">Cookies are small text files stored on your device by your browser when you visit a website. They help the site function correctly, remember your preferences, and (optionally) analyse usage patterns. Serenest uses only cookies that are necessary to provide the service or that you explicitly accept.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14 }}>Cookies we use</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {COOKIES.map((c) => (
                  <div key={c.name} style={{ display: 'flex', gap: 12, padding: '0.9rem 1rem', background: 'var(--bg-subtle)', borderRadius: 10, alignItems: 'flex-start' }}>
                    <span style={{
                      display: 'inline-block', flexShrink: 0, marginTop: 2,
                      padding: '2px 8px', borderRadius: 99, fontSize: '0.68rem', fontWeight: 700,
                      background: c.essential ? '#d1fae5' : '#dbeafe',
                      color: c.essential ? '#065f46' : '#1e40af',
                    }}>
                      {c.essential ? 'Essential' : 'Non-essential'}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.purpose}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Third-party cookies</h2>
              <p className="muted">Serenest does not use Google Analytics, Meta Pixel, or any third-party advertising cookies. We do not sell or share cookie data with advertisers. If you use a video consultation, the video provider (e.g. Daily.co) may set its own cookies necessary for the session — these are governed by that provider's privacy policy.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>How to control cookies</h2>
              <p className="muted">You can accept or decline non-essential cookies via the consent banner shown on your first visit. You can also control cookies through your browser settings:</p>
              <ul className="list">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>Disabling essential cookies will break core platform functionality including login and booking.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Contact</h2>
              <p className="muted">For questions about cookies or data handling, see our <Link to="/privacy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Privacy Policy</Link> or email <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
