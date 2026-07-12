import React from 'react';
import { Link } from 'react-router-dom';
import { getCheckEvidence } from '../../lib/checkEvidence';

/** Evidence block on result pages + link to Evidence Center. */
export default function CheckEvidencePanel({ toolId }) {
  const ev = getCheckEvidence(toolId);
  if (!ev) return null;

  return (
    <section className="mhc-edu" aria-labelledby="evidence-title">
      <h2 id="evidence-title">Evidence &amp; licensing</h2>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
        <strong>{ev.officialName}</strong>
        <br />
        Authors: {ev.authors} · Primary paper: {ev.year}
      </p>
      <ul>
        {ev.copyrightNotice ? <li>{ev.copyrightNotice}</li> : null}
        <li>
          <strong>Licensing:</strong> {ev.licensingStatus}
        </li>
        <li>
          <strong>Wording:</strong>{' '}
          {ev.wordingStatus === 'exact'
            ? 'Exact official item wording reproduced (not paraphrased).'
            : ev.wordingNotes}
        </li>
        <li>
          <strong>Why not a diagnosis:</strong> {ev.whyNotDiagnosis}
        </li>
        <li>
          <strong>Clinical review:</strong>{' '}
          {ev.clinicalReviewNotice ||
            'Evidence summary prepared from published and official instrument sources. Formal Serenest clinical review pending.'}
        </li>
      </ul>
      <p style={{ margin: '0.75rem 0 0', fontSize: '0.88rem' }}>
        <Link to={`/evidence/${ev.evidenceSlug}`}>Full evidence report →</Link>
        {' · '}
        <Link to="/evidence">Evidence Center</Link>
      </p>
    </section>
  );
}
