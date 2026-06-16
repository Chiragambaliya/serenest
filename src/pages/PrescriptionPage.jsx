import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { prescriptions } from '../lib/api';

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

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

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Prescription</p>
            <h1 className="page-title">Your prescription</h1>
            <p className="about-subtext">
              Reference: <strong>{appointmentId?.slice(0, 8).toUpperCase()}</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 680 }}>
          {loading && <p className="muted">Loading your prescription…</p>}

          {!loading && error && (
            <div className="callout">
              <div className="callout-title">Couldn't load this prescription</div>
              <p className="muted" style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          {!loading && !error && !prescription && (
            <div className="callout">
              <div className="callout-title">Not issued yet</div>
              <p className="muted" style={{ margin: 0 }}>
                Your professional hasn't issued a prescription for this consultation yet. It will appear
                here once they do — check back after your session, or ask them on WhatsApp.
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
          )}

          {!loading && !error && prescription && (
            <div className="tile" style={{ padding: '1.5rem' }}>
              <div className="confirm-grid" style={{ marginBottom: 16 }}>
                <div className="confirm-card">
                  <div className="confirm-row">
                    <span className="confirm-k">Patient</span>
                    <span className="confirm-v">{prescription.patient_name || '—'}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-k">Issued by</span>
                    <span className="confirm-v">{prescription.professional_name || '—'}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-k">Date</span>
                    <span className="confirm-v">{fmtDate(prescription.created_at)}</span>
                  </div>
                  {prescription.follow_up_date && (
                    <div className="confirm-row">
                      <span className="confirm-k">Follow-up</span>
                      <span className="confirm-v">{fmtDate(prescription.follow_up_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              <h3 style={{ marginBottom: 10 }}>Medicines</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                {(prescription.medicines ?? []).map((m, i) => (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontWeight: 700 }}>{m.name}</div>
                    <div className="muted" style={{ fontSize: '0.88rem' }}>
                      {[m.dosage, m.frequency, m.duration].filter(Boolean).join(' · ')}
                    </div>
                    {m.instructions && <div style={{ fontSize: '0.85rem', marginTop: 4 }}>{m.instructions}</div>}
                  </div>
                ))}
              </div>

              {prescription.advice && (
                <div className="callout" style={{ marginBottom: 16 }}>
                  <div className="callout-title">Advice</div>
                  <p className="muted" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{prescription.advice}</p>
                </div>
              )}

              <p className="fineprint">
                This prescription was issued for a telepsychiatry/telepsychology consultation on Serenest.
                Do not alter dosages without speaking to your professional. If you experience side effects,
                contact your professional or seek medical attention.
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  🖨 Print / Save as PDF
                </button>
                <Link className="btn btn-ghost" to="/">Back to home</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
