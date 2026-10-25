import React, { useState } from 'react';
import { dpdp } from '../lib/api';
import {
  DPDP_FIDUCIARY,
  DPDP_ITEMIZED_NOTICE,
  DPDP_NOTICE_VERSION,
  DPDP_REQUEST_TYPES,
} from '../lib/dpdp';
import { setPrivacyChoice } from '../lib/privacyConsent';

/**
 * Interactive Self-Service DPDP Act, 2023 Data Principal Rights &
 * Consent Withdrawal Portal (Sections 5, 6(4), 11, 12, 13, and 14).
 */
export default function DpdpRightsPortal({ defaultType = 'withdraw_consent', compact = false }) {
  const [requestType, setRequestType] = useState(defaultType);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('');
  const [nomineeContact, setNomineeContact] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);

  const activeMeta = DPDP_REQUEST_TYPES.find((t) => t.id === requestType) || DPDP_REQUEST_TYPES[0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await dpdp.submitRequest({
        request_type: requestType,
        name: name.trim(),
        phone,
        email: email.trim(),
        details: details.trim(),
        nominee_name: nomineeName.trim(),
        nominee_relation: nomineeRelation.trim(),
        nominee_contact: nomineeContact.trim(),
      });

      // If withdrawing consent under Section 6(4), also immediately revoke
      // browser analytics consent and clear local session check-in storage.
      if (requestType === 'withdraw_consent') {
        setPrivacyChoice('essential');
        try {
          sessionStorage.removeItem('serenest_mh_snapshot_v1');
        } catch {
          // ignore
        }
      }

      if (res?.request) {
        setReceipt(res.request);
      }
    } catch (err) {
      setError(err?.message || 'Could not submit your DPDP request right now. Please try again or email support@serenest.in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="dpdp-rights-portal" className="ai-triage-card" style={{ scrollMarginTop: 96 }} aria-labelledby="dpdp-portal-heading">
      <div className="ai-triage-head">
        <div className="ai-triage-head__copy">
          <span className="ai-triage-eyebrow">
            <span className="ai-triage-spark" aria-hidden="true">⚖</span>
            DPDP Act, 2023 Compliance · Notice {DPDP_NOTICE_VERSION}
          </span>
          <h2 id="dpdp-portal-heading" className="ai-triage-title">
            Data Principal Rights &amp; Consent Withdrawal Portal
          </h2>
          <p className="ai-triage-sub">
            Under India’s Digital Personal Data Protection Act, 2023 (Sections 5, 6, 11, 12, 13 &amp; 14), you can withdraw consent, request a summary of your personal data, correct or erase records, nominate a representative, or raise a grievance online with one click.
          </p>
        </div>
      </div>

      <div className="ai-triage-body">
        {!compact && (
          <div className="ai-analysis-box">
            <div className="ai-analysis-box__label">
              Section 5 Itemized Notice — What personal data Serenest collects &amp; why
            </div>
            <div className="dpdp-notice-grid">
              {DPDP_ITEMIZED_NOTICE.items.map((item) => (
                <div key={item.category} className="dpdp-notice-item">
                  <strong>{item.category}</strong>
                  <p style={{ margin: '4px 0', fontSize: '12.5px', color: 'var(--ink-2)' }}>
                    <em>Data:</em> {item.examples}
                  </p>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                    <em>Specified purpose:</em> {item.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="ai-analysis-box__label" style={{ marginBottom: 8 }}>
            Select the right you wish to exercise under the DPDP Act, 2023
          </div>
          <div className="dpdp-rights-grid" role="radiogroup" aria-label="DPDP request type">
            {DPDP_REQUEST_TYPES.map((t) => {
              const active = requestType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`choice-card choice-card--stacked ${active ? 'is-selected' : ''}`}
                  onClick={() => {
                    setRequestType(t.id);
                    setReceipt(null);
                    setError('');
                  }}
                >
                  <span className="choice-card-title">
                    {t.label}
                    <span className="choice-ai-pill">{t.section}</span>
                  </span>
                  <span className="choice-card-hint">{t.shortDesc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {receipt ? (
          <div className="srn-ai-capture srn-ai-capture--done" role="status">
            <div className="srn-ai-capture__badge">
              ✓ DPDP Request Registered · Reference {receipt.id}
            </div>
            <p className="srn-ai-capture__copy">
              Thank you, <strong>{receipt.name}</strong>. Your <strong>{receipt.request_label}</strong> request under <strong>{receipt.dpdp_section}</strong> of the Digital Personal Data Protection Act, 2023 has been logged ({new Date(receipt.created_at).toLocaleString('en-IN')}).
              {receipt.request_type === 'withdraw_consent' && (
                <> Optional browser analytics and local session check-in storage on this device have also been cleared immediately.</>
              )}
            </p>
            <p className="srn-ai-capture__copy" style={{ fontSize: '12px', opacity: 0.88 }}>
              <strong>SLA &amp; Escalation:</strong> {activeMeta.sla} Grievance Officer: <strong>{DPDP_FIDUCIARY.grievanceOfficer}</strong> ({DPDP_FIDUCIARY.email}). If unresolved after exhausting our grievance redressal mechanism, you may approach the <strong>{DPDP_FIDUCIARY.escalationBody}</strong>.
            </p>
            <div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setReceipt(null);
                  setDetails('');
                }}
              >
                Submit another request
              </button>
            </div>
          </div>
        ) : (
          <form className="ai-fast-acquire" onSubmit={handleSubmit}>
            <div className="ai-fast-acquire__head">
              <strong>
                Submit {activeMeta.label} ({activeMeta.section})
              </strong>
              <span>{activeMeta.sla}</span>
            </div>

            <div className="form-grid" style={{ marginBottom: 0 }}>
              <label className="field">
                <span className="field-label">Your full name *</span>
                <input
                  type="text"
                  className="input"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </label>

              <label className="field">
                <span className="field-label">10-digit mobile (+91) *</span>
                <input
                  type="tel"
                  className="input"
                  placeholder="10-digit Indian mobile"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  autoComplete="tel-national"
                />
              </label>

              <label className="field">
                <span className="field-label">Email address (optional)</span>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>

              <label className="field">
                <span className="field-label">Booking Ref / Details (optional)</span>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Booking Ref or specific correction/erasure note"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </label>

              {requestType === 'nomination' && (
                <>
                  <label className="field">
                    <span className="field-label">Nominee full name (Section 14) *</span>
                    <input
                      type="text"
                      className="input"
                      placeholder="Full name of nominee"
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span className="field-label">Relationship &amp; nominee contact</span>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Spouse / Parent · +91 98XXXXXXXX"
                      value={nomineeRelation}
                      onChange={(e) => {
                        setNomineeRelation(e.target.value);
                        setNomineeContact(e.target.value);
                      }}
                    />
                  </label>
                </>
              )}
            </div>

            {error && <p className="ai-triage-error" role="alert">{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Data Fiduciary: <strong>{DPDP_FIDUCIARY.name}</strong> · Grievance Officer: <strong>{DPDP_FIDUCIARY.grievanceOfficer}</strong>
              </span>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting DPDP request…' : `Submit ${activeMeta.label} Request →`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
