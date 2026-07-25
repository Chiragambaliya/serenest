import React from 'react';
import { Link } from 'react-router-dom';
import { getCheckEvidence } from '../../lib/checkEvidence';

/** Privacy explanation for Mental Health Checks — never hide. */
export default function CheckPrivacyPanel({ toolId }) {
  const ev = getCheckEvidence(toolId);
  const p = ev?.privacy;
  if (!p) {
    return (
      <section className="mhc-edu" aria-labelledby="privacy-title">
        <h2 id="privacy-title">Privacy</h2>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
          This check runs in your browser. Contact details are not required to see results. See our{' '}
          <Link to="/privacy">Privacy policy</Link>.
        </p>
      </section>
    );
  }

  return (
    <section className="mhc-edu" aria-labelledby="privacy-title">
      <h2 id="privacy-title">Privacy</h2>
      <ul>
        <li>
          <strong>In your browser:</strong> {p.browser}
        </li>
        <li>
          <strong>What Serenest stores from this check:</strong> {p.stored}
        </li>
        <li>
          <strong>Why anything would be stored:</strong> {p.whyStored}
        </li>
        <li>
          <strong>Callbacks:</strong> {p.callback}
        </li>
        <li>
          <strong>WhatsApp:</strong> {p.whatsapp}
        </li>
        <li>
          <strong>Retention:</strong> {p.retention}{' '}
          <Link to="/privacy">Privacy</Link> · <Link to="/data-retention">Data retention</Link>
        </li>
      </ul>
    </section>
  );
}
