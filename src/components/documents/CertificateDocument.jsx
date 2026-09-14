import React from 'react';
import { DocumentLetterhead, DocumentSignoff, fmtDate } from './DocumentShell';

export default function CertificateDocument({ doc }) {
  return (
    <article className="doc-sheet doc-sheet--certificate" aria-label="Certificate of completion">
      <DocumentLetterhead doc={doc} />
      <p className="doc-badge">Certificate of completion</p>
      <h1 className="doc-title">Serenest Academy</h1>
      <div className="doc-ornament" aria-hidden="true" />
      <p className="doc-subtitle">This is to certify that</p>
      <p className="doc-recipient">{doc.recipient_name}</p>
      <div className="doc-body">
        <p>
          has successfully completed the program
        </p>
        <p className="doc-recipient" style={{ fontSize: '1.45rem', marginTop: 0 }}>
          {doc.program_title || 'Academy Program'}
        </p>
        <p>
          on {fmtDate(doc.completion_date)}.
          {doc.body_extra ? ` ${doc.body_extra}` : ''}
        </p>
      </div>
      <table className="doc-meta-table" style={{ maxWidth: 420, marginInline: 'auto', textAlign: 'left' }}>
        <tbody>
          <tr>
            <th scope="row">Program</th>
            <td>{doc.program_title || '—'}</td>
          </tr>
          <tr>
            <th scope="row">Completion date</th>
            <td>{fmtDate(doc.completion_date)}</td>
          </tr>
          <tr>
            <th scope="row">Reference</th>
            <td>{doc.ref_code || 'DRAFT'}</td>
          </tr>
        </tbody>
      </table>
      <DocumentSignoff doc={doc} />
      <p className="doc-footer-note">
        This certificate is issued by Serenest Education Pvt Ltd and marks completion of a
        specific program of study. It does not replace a recognised degree, professional
        registration, supervised clinical requirements, or legal scope of practice.
      </p>
    </article>
  );
}
