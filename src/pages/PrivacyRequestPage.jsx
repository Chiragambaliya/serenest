import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { privacy } from '../lib/api';

const REQUEST_TYPES = [
  { id: 'access', label: 'Access my data', hint: 'A summary of personal data we hold about you.' },
  { id: 'correction', label: 'Correct my data', hint: 'Fix a name, phone, email, or other inaccuracy.' },
  { id: 'erasure', label: 'Erase my data', hint: 'Delete what the law does not require us to keep.' },
  { id: 'withdraw_consent', label: 'Withdraw consent', hint: 'Stop optional processing such as analytics or follow-up.' },
  { id: 'nominate', label: 'Nominate someone', hint: 'Name a person who may exercise your rights if you cannot.' },
  { id: 'grievance', label: 'Privacy grievance', hint: 'Raise a complaint about how your data was handled.' },
];

export default function PrivacyRequestPage() {
  useSEO({ path: '/privacy/request', ...ROUTE_SEO['/privacy/request'] });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState('access');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await privacy.request({
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        request_type: requestType,
        details: details.trim(),
      });
      setReceipt(res);
    } catch (err) {
      setError(err.message || 'Could not send your request. Please try again or email support@serenest.in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Privacy</p>
            <h1 className="page-title">Data rights request</h1>
            <p className="about-subtext">
              Use this form to exercise your rights under the Digital Personal Data Protection Act, 2023.
              We acknowledge requests promptly and aim to complete standard requests within 30 days.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>
              Do not send identity documents or clinical details here unless we ask for them.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          {receipt ? (
            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>We received your request</h2>
              <p className="muted">
                {receipt.message || 'We will respond within 30 days.'}
                {receipt.request?.id ? ` Reference: ${receipt.request.id}.` : ''}
              </p>
              <p className="muted" style={{ marginTop: 12 }}>
                Clinical records may be retained for the legally required period even when other data is erased.
                See our <Link to="/data-retention">Data Retention Policy</Link>.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                <Link className="btn btn-primary" to="/privacy">Back to privacy policy</Link>
                <Link className="btn btn-ghost" to="/grievance-policy">Grievance process</Link>
              </div>
            </div>
          ) : (
            <form className="tile" style={{ padding: '1.5rem' }} onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">Full name</span>
                <input
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="field" style={{ marginTop: 14 }}>
                <span className="field-label">Email</span>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="We'll reply here when possible"
                />
              </label>

              <label className="field" style={{ marginTop: 14 }}>
                <span className="field-label">Phone</span>
                <input
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Required if you do not share an email"
                />
              </label>

              <fieldset style={{ border: 0, padding: 0, margin: '18px 0 0' }}>
                <legend className="field-label" style={{ marginBottom: 8 }}>What do you need?</legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {REQUEST_TYPES.map((type) => (
                    <label key={type.id} className="consent" style={{ alignItems: 'flex-start' }}>
                      <input
                        type="radio"
                        name="request_type"
                        value={type.id}
                        checked={requestType === type.id}
                        onChange={() => setRequestType(type.id)}
                      />
                      <span>
                        <strong>{type.label}</strong>
                        <span className="muted" style={{ display: 'block', fontSize: '0.85rem' }}>{type.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="field" style={{ marginTop: 16 }}>
                <span className="field-label">Details</span>
                <textarea
                  className="input textarea"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={5}
                  required
                  minLength={8}
                  placeholder="Tell us the email or phone on the account and what you need us to do."
                />
              </label>

              {error ? <p style={{ color: '#a02622', fontSize: '0.88rem', marginTop: 12 }}>{error}</p> : null}

              <div className="booking-actions" style={{ marginTop: 18 }}>
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Submit request'}
                </button>
                <Link className="btn btn-ghost" to="/privacy">Privacy policy</Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
