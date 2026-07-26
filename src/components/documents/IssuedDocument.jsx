import React from 'react';
import CertificateDocument from './CertificateDocument';
import JoiningLetterDocument from './JoiningLetterDocument';
import ExperienceLetterDocument from './ExperienceLetterDocument';
import '../../styles/documents.css';

export default function IssuedDocument({ doc }) {
  if (!doc) return null;
  if (doc.doc_type === 'certificate') return <CertificateDocument doc={doc} />;
  if (doc.doc_type === 'joining_letter') return <JoiningLetterDocument doc={doc} />;
  if (doc.doc_type === 'experience_letter') return <ExperienceLetterDocument doc={doc} />;
  return (
    <div className="doc-sheet">
      <p>Unknown document type.</p>
    </div>
  );
}

export const DOC_TYPE_LABELS = {
  certificate: 'Certificate',
  joining_letter: 'Joining letter',
  experience_letter: 'Experience letter',
};
