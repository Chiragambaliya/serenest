import React from 'react';
import { DocumentLetterhead, DocumentSignoff, fmtDate } from './DocumentShell';

export default function JoiningLetterDocument({ doc }) {
  const first = (doc.recipient_name || 'Colleague').trim().split(/\s+/)[0];

  return (
    <article className="doc-sheet" aria-label="Joining letter">
      <DocumentLetterhead doc={doc} />
      <p className="doc-kicker">Joining letter</p>
      <h1 className="doc-title">Welcome to Serenest</h1>
      <div className="doc-body">
        <p>Dear {first},</p>
        <p>
          We are pleased to confirm your association with{' '}
          <strong>{doc.issuer_name || 'Serenest Education Pvt Ltd'}</strong> as a{' '}
          <strong>{doc.role_title || 'Mental Health Professional'}</strong>
          {doc.department ? ` (${doc.department})` : ''}, effective{' '}
          <strong>{fmtDate(doc.join_date)}</strong>.
        </p>
        <p>
          {doc.employment_type
            ? `Engagement type: ${doc.employment_type}. `
            : ''}
          You will practise on Serenest&apos;s clinical platform with the tools, documentation
          standards, and privacy expectations shared during onboarding.
        </p>
        {doc.body_extra ? <p>{doc.body_extra}</p> : null}
        <p>
          Please keep this letter for your records. For questions, write to{' '}
          <strong>support@serenest.in</strong> or WhatsApp +91 77779 36367.
        </p>
        <p>Welcome aboard.</p>
      </div>
      <table className="doc-meta-table">
        <tbody>
          <tr>
            <th scope="row">Name</th>
            <td>{doc.recipient_name}</td>
          </tr>
          <tr>
            <th scope="row">Designation</th>
            <td>{doc.role_title || '—'}</td>
          </tr>
          <tr>
            <th scope="row">Joining date</th>
            <td>{fmtDate(doc.join_date)}</td>
          </tr>
          <tr>
            <th scope="row">Engagement</th>
            <td>{doc.employment_type || 'Platform clinician'}</td>
          </tr>
        </tbody>
      </table>
      <DocumentSignoff doc={doc} />
      <p className="doc-footer-note">
        This joining letter confirms association with Serenest for clinical practice on the
        platform. Terms of engagement, fees, and availability are as agreed separately.
      </p>
    </article>
  );
}
