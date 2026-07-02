import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const UPDATED = 'June 2026';

const DOCS = [
  {
    group: 'Core Policies',
    items: [
      { title: 'Privacy Policy', path: '/privacy', desc: 'How we collect, use, and protect your personal data under the DPDP Act 2023.' },
      { title: 'Terms & Conditions', path: '/terms', desc: 'The general terms governing your use of the Serenest platform.' },
      { title: 'Refund & Cancellation Policy', path: '/refund-policy', desc: 'When and how refunds are issued for cancelled or disrupted sessions.' },
      { title: 'Payment & Billing Policy', path: '/payment-policy', desc: 'Payment methods, GST, professional payouts, and billing disputes.' },
      { title: 'Cookie Policy', path: '/cookie-policy', desc: 'What cookies we use and how you can control them.' },
    ],
  },
  {
    group: 'For Patients',
    items: [
      { title: 'Patient Terms of Use', path: '/patient/terms', desc: 'Your rights and responsibilities as a patient on Serenest.' },
      { title: 'Teleconsultation Consent', path: '/consent', desc: 'What you consent to when you attend an online consultation.' },
      { title: 'Emergency Disclaimer', path: '/emergency-disclaimer', desc: 'Serenest is not an emergency service. Crisis helplines and guidance inside.' },
    ],
  },
  {
    group: 'For Professionals',
    items: [
      { title: 'Professional Terms & Conditions', path: '/professionals/terms', desc: 'Terms for independent professionals listing services on Serenest.' },
      { title: 'Professional Code of Conduct', path: '/professionals/code-of-conduct', desc: 'Clinical ethics, patient safety, and conduct standards for all professionals.' },
    ],
  },
  {
    group: 'Data & IP',
    items: [
      { title: 'Data Retention Policy', path: '/data-retention', desc: 'How long we keep your data and how to request deletion.' },
      { title: 'Copyright & Intellectual Property', path: '/intellectual-property', desc: 'Ownership of platform content and how to report an infringement.' },
    ],
  },
  {
    group: 'Community',
    items: [
      { title: 'Community Guidelines', path: '/community-guidelines', desc: 'Conduct standards for everyone — patients, professionals, and visitors.' },
      { title: 'Grievance Policy', path: '/grievance-policy', desc: 'How to raise a complaint and our process for resolving it.' },
    ],
  },
];

export default function LegalPage() {
  useSEO({ path: '/legal', ...ROUTE_SEO['/legal'] });
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Legal</p>
            <h1 className="page-title">Legal &amp; Policies</h1>
            <p className="about-subtext">
              All of Serenest's legal documents, policies, and guidelines in one place.
              We've written them to be clear and readable — not just to satisfy legal requirements.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd · Rajkot, Gujarat, India</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {DOCS.map((group) => (
              <div key={group.group}>
                <h2 style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{group.group}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {group.items.map((doc) => (
                    <Link
                      key={doc.path}
                      to={doc.path}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="tile" style={{ padding: '1.1rem 1.25rem', height: '100%', transition: 'box-shadow 0.15s' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--teal-700)', marginBottom: 4 }}>{doc.title}</div>
                        <p className="muted" style={{ margin: 0, fontSize: '0.83rem', lineHeight: 1.55 }}>{doc.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: 14, textAlign: 'center' }}>
            <p className="muted" style={{ margin: 0 }}>
              Questions about any of these policies? Email us at{' '}
              <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a>
              {' '}— we respond within 2 business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
