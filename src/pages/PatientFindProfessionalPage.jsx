import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const LS_APPS = 'serenest_professional_applications_v1';

const ROLES = [
  { id: 'counsellor', label: 'Counsellor' },
  { id: 'psychologist', label: 'Psychologist' },
  { id: 'therapist', label: 'Therapist' },
  { id: 'psychiatrist', label: 'Psychiatrist' },
];

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function loadApprovedProfessionals() {
  const data = safeJsonParse(localStorage.getItem(LS_APPS) ?? '[]', []);
  const apps = Array.isArray(data) ? data : [];
  return apps
    .filter((a) => a && a.status === 'approved')
    .map((a) => ({
      id: a.id,
      name: a.full_name || 'Professional',
      role: a.role || 'counsellor',
      roleLabel: a.role_label || a.role || 'Professional',
      city: a.city || '',
      fee: a.fee_inr ? Number(a.fee_inr) : null,
      duration: a.duration_min ? Number(a.duration_min) : null,
      languages: normalizeList(a.languages),
      specialities: normalizeList(a.specialities),
      modes: a.modes || 'Video / Audio / Chat',
      availability: a.availability || '',
    }));
}

export default function PatientFindProfessionalPage() {
  const [role, setRole] = useState('counsellor');
  const [language, setLanguage] = useState('Any');
  const [city, setCity] = useState('');
  const [maxFee, setMaxFee] = useState(2000);

  const professionals = useMemo(() => loadApprovedProfessionals(), []);

  const languages = useMemo(() => {
    const set = new Set();
    for (const p of professionals) for (const l of p.languages) set.add(l);
    return ['Any', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [professionals]);

  const cities = useMemo(() => {
    const set = new Set();
    for (const p of professionals) if (p.city) set.add(p.city);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [professionals]);

  const shown = useMemo(() => {
    const cityNeedle = city.trim().toLowerCase();
    return professionals.filter((p) => {
      if (role && p.role !== role) return false;
      if (language !== 'Any' && !p.languages.some((l) => l.toLowerCase() === language.toLowerCase())) return false;
      if (cityNeedle && !p.city.toLowerCase().includes(cityNeedle)) return false;
      if (typeof p.fee === 'number' && p.fee > maxFee) return false;
      return true;
    });
  }, [professionals, role, language, city, maxFee]);

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Patient</p>
            <h1 className="page-title">Find a professional</h1>
            <p className="about-subtext">
              Browse verified counsellors and other mental health professionals. You’ll only see profiles approved by Serenest.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tile pro-filter">
            <div className="pro-filter-grid">
              <label className="field" style={{ margin: 0 }}>
                <span className="field-label">Role</span>
                <div className="pro-tabs" role="tablist" aria-label="Role filter">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`pro-tab ${role === r.id ? 'is-active' : ''}`}
                      onClick={() => setRole(r.id)}
                      role="tab"
                      aria-selected={role === r.id}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </label>

              <label className="field" style={{ margin: 0 }}>
                <span className="field-label">Language</span>
                <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" style={{ margin: 0 }}>
                <span className="field-label">City</span>
                <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder={cities[0] ? `e.g. ${cities[0]}` : 'Any'} />
              </label>

              <label className="field" style={{ margin: 0 }}>
                <span className="field-label">Max fee (₹)</span>
                <input className="input" value={maxFee} onChange={(e) => setMaxFee(Number(e.target.value || 0))} inputMode="numeric" />
              </label>
            </div>

            <div className="pro-filter-foot">
              <div className="muted">
                Showing <strong>{shown.length}</strong> of <strong>{professionals.length}</strong> approved professionals
              </div>
              <Link className="btn btn-ghost" to="/book">
                Book without choosing →
              </Link>
            </div>
          </div>

          {professionals.length === 0 ? (
            <div className="callout">
              <div className="callout-title">No approved professionals yet</div>
              <p className="muted" style={{ margin: 0 }}>
                Add applications via <Link to="/professionals/apply">/professionals/apply</Link> and approve them in{' '}
                <Link to="/admin">/admin</Link>.
              </p>
            </div>
          ) : shown.length === 0 ? (
            <div className="callout">
              <div className="callout-title">No matches</div>
              <p className="muted" style={{ margin: 0 }}>
                Try changing role, city, language, or fee.
              </p>
            </div>
          ) : (
            <div className="pro-grid">
              {shown.map((p) => (
                <article key={p.id} className="tile pro-card">
                  <div className="pro-top">
                    <div>
                      <div className="pro-name">{p.name}</div>
                      <div className="pro-meta">
                        {p.roleLabel}
                        {p.city ? ` · ${p.city}` : ''}
                      </div>
                    </div>
                    <div className="pro-price">
                      <div className="pro-fee">₹{p.fee ?? '—'}</div>
                      <div className="pro-min">{p.duration ? `${p.duration} min` : '—'}</div>
                    </div>
                  </div>

                  <div className="pro-tags">
                    {p.languages.slice(0, 3).map((l) => (
                      <span key={l} className="pro-tag">
                        {l}
                      </span>
                    ))}
                    {p.languages.length === 0 && <span className="pro-tag">Language not set</span>}
                    <span className="pro-tag pro-tag-ghost">{p.modes}</span>
                  </div>

                  {p.specialities.length > 0 && (
                    <div className="pro-tags" style={{ marginTop: 10 }}>
                      {p.specialities.slice(0, 4).map((s) => (
                        <span key={s} className="pro-tag pro-tag-ghost">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {p.availability && <div className="pro-availability">Availability: {p.availability}</div>}

                  <div className="pro-actions">
                    <Link className="btn btn-ghost" to="/book">
                      View slots
                    </Link>
                    <Link className="btn btn-primary" to="/book">
                      Book now →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

