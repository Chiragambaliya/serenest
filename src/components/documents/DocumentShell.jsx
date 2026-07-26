import React from 'react';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function DocumentLetterhead({ doc }) {
  return (
    <header className="doc-letterhead">
      <div className="doc-brand">
        <span className="doc-brand-mark" aria-hidden="true">S</span>
        <div>
          <div className="doc-brand-name">Serenest</div>
          <div className="doc-brand-tag">
            {doc.issuer_name || 'Serenest Education Pvt Ltd'}
          </div>
        </div>
      </div>
      <div className="doc-letterhead-meta">
        <div>Ref: <strong>{doc.ref_code || 'DRAFT'}</strong></div>
        <div>Date: {fmtDate(doc.issued_at || doc.created_at)}</div>
        {doc.status === 'revoked' ? <div style={{ color: '#842029' }}>REVOKED</div> : null}
      </div>
    </header>
  );
}

export function DocumentSignoff({ doc }) {
  return (
    <div className="doc-sign">
      <div className="doc-sign__block">
        <p className="doc-kicker" style={{ letterSpacing: '0.08em' }}>For Serenest</p>
        <p className="doc-sign__name">{doc.signatory_name || 'Dr. Chirag Aambalia'}</p>
        <p className="doc-sign__title">{doc.signatory_title || 'Psychiatrist & Founder'}</p>
      </div>
      <div className="doc-sign__block">
        <p className="doc-kicker" style={{ letterSpacing: '0.08em' }}>Organisation</p>
        <p className="doc-sign__name" style={{ marginTop: '2.25rem' }}>
          {doc.issuer_name || 'Serenest Education Pvt Ltd'}
        </p>
        <p className="doc-sign__title">India</p>
      </div>
    </div>
  );
}

export { fmtDate };
