import React from 'react';
import { DocumentLetterhead, DocumentSignoff, fmtDate } from './DocumentShell';

export default function ExperienceLetterDocument({ doc }) {
  const endLabel = doc.end_date ? fmtDate(doc.end_date) : 'present';

  return (
    <article className="doc-sheet" aria-label="Experience letter">
      <DocumentLetterhead doc={doc} />
      <p className="doc-kicker">Experience / service letter</p>
      <h1 className="doc-title">To whom it may concern</h1>
      <div className="doc-body">
        <p>
          This is to certify that <strong>{doc.recipient_name}</strong> has been associated
          with <strong>{doc.issuer_name || 'Serenest Education Pvt Ltd'}</strong> as a{' '}
          <strong>{doc.role_title || 'Mental Health Professional'}</strong>
          {doc.department ? ` in ${doc.department}` : ''}.
        </p>
        <p>
          Period of association: <strong>{fmtDate(doc.join_date)}</strong> to{' '}
          <strong>{endLabel}</strong>
          {doc.employment_type ? ` (${doc.employment_type})` : ''}.
        </p>
        <p>
          During this period, they provided clinical services through Serenest&apos;s
          telepsychiatry platform, including consultations, documentation, and adherence to
          our privacy and telemedicine practice expectations.
        </p>
        {doc.body_extra ? <p>{doc.body_extra}</p> : (
          <p>
            We found them diligent and professional in their conduct. We wish them success
            in their future endeavours.
          </p>
        )}
        <p>
          For verification, quote reference <strong>{doc.ref_code || 'DRAFT'}</strong> or
          write to support@serenest.in.
        </p>
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
            <th scope="row">From</th>
            <td>{fmtDate(doc.join_date)}</td>
          </tr>
          <tr>
            <th scope="row">To</th>
            <td>{endLabel}</td>
          </tr>
        </tbody>
      </table>
      <DocumentSignoff doc={doc} />
      <p className="doc-footer-note">
        Issued by Serenest Education Pvt Ltd for professional record purposes. This letter
        does not constitute a medical registration or practising licence.
      </p>
    </article>
  );
}
