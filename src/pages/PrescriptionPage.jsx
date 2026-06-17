import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { prescriptions } from '../lib/api';
import PrescriptionDocument from '../components/PrescriptionDocument';

export default function PrescriptionPage() {
  const { appointmentId } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appointmentId) return;
    setLoading(true);
    setError(null);
    prescriptions
      .get(appointmentId)
      .then((res) => setPrescription(res.prescription))
      .catch((e) => setError(e.message || 'Could not load prescription.'))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="page"><section className="section"><div className="container">
        <p className="muted">Loading your prescription…</p>
      </div></section></div>
    );
  }

  if (error) {
    return (
      <div className="page"><section className="section"><div className="container" style={{ maxWidth: 680 }}>
        <div className="callout">
          <div className="callout-title">Couldn't load this prescription</div>
          <p className="muted" style={{ margin: 0 }}>{error}</p>
        </div>
      </div></section></div>
    );
  }

  if (!prescription) {
    return (
      <div className="page"><section className="section"><div className="container" style={{ maxWidth: 680 }}>
        <div className="callout">
          <div className="callout-title">Not issued yet</div>
          <p className="muted" style={{ margin: 0 }}>
            Your professional hasn&apos;t issued a prescription for this consultation yet. It will appear
            here once they do — check back after your session, or ask us on WhatsApp.
          </p>
          <div style={{ marginTop: 16 }}>
            <a
              className="btn btn-primary"
              href={`https://wa.me/917777936367?text=${encodeURIComponent(`Hi, could you share the prescription for my consultation (Ref: ${appointmentId?.slice(0, 8).toUpperCase()})?`)}`}
              target="_blank"
              rel="noreferrer"
            >
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </div></section></div>
    );
  }

  return (
    <div className="page rx-page-wrap">
      <div className="container">
        <div className="rx-toolbar">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            🖨 Print / Save as PDF
          </button>
          <Link className="btn btn-ghost" to="/">Back to home</Link>
        </div>
      </div>
      <PrescriptionDocument prescription={prescription} />
    </div>
  );
}
