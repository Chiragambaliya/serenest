import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import IssuedDocument, { DOC_TYPE_LABELS } from '../components/documents/IssuedDocument';

const BASE = import.meta.env.VITE_API_URL ?? '';

export default function DocumentPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`${BASE}/api/documents/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) throw new Error(json.error || 'Could not load document');
        setDoc(json.document);
      })
      .catch((e) => setError(e.message || 'Could not load document'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page doc-page-wrap">
        <div className="container"><p className="muted">Loading document…</p></div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="page doc-page-wrap">
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="callout">
            <div className="callout-title">Document unavailable</div>
            <p className="muted" style={{ margin: 0 }}>
              {error || 'This document was not found, or has been revoked.'}
            </p>
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-ghost" to="/">Back home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const label = DOC_TYPE_LABELS[doc.doc_type] || 'Document';

  return (
    <div className="page doc-page-wrap">
      <div className="container">
        <div className="doc-toolbar">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Print / Save as PDF
          </button>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {label} · {doc.ref_code}
          </span>
          <Link className="btn btn-ghost" to="/">Back home</Link>
        </div>
      </div>
      <IssuedDocument doc={doc} />
    </div>
  );
}
