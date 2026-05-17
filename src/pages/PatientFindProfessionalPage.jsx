import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { professionals as professionalsApi } from '../lib/api';

const ROLES = [
  { id: 'all',          label: 'All',          icon: '✨', color: '#0d9488' },
  { id: 'psychiatrist', label: 'Psychiatrist', icon: '🩺', color: '#6f42c1' },
  { id: 'psychologist', label: 'Psychologist', icon: '🧠', color: '#0d6efd' },
  { id: 'therapist',    label: 'Therapist',    icon: '💬', color: '#198754' },
  { id: 'counsellor',   label: 'Counsellor',   icon: '🌱', color: '#e67e22' },
];

const SORT_OPTIONS = [
  { id: 'newest',     label: 'Newest first' },
  { id: 'fee_asc',    label: 'Fee: low → high' },
  { id: 'fee_desc',   label: 'Fee: high → low' },
  { id: 'name_asc',   label: 'Name A → Z' },
];

const ROLE_COLORS = {
  psychiatrist: '#6f42c1',
  psychologist: '#0d6efd',
  therapist:    '#198754',
  counsellor:   '#e67e22',
};

const ROLE_LABELS = {
  psychiatrist: 'Psychiatrist',
  psychologist: 'Psychologist',
  therapist:    'Therapist',
  counsellor:   'Counsellor',
};

function normalizeList(value) {
  if (!value) return [];
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
}

/** Modes are often saved as "Video, Audio, Chat" or "Video / Audio / Chat". */
function normalizeModes(value) {
  if (!value) return [];
  const s = String(value).trim();
  if (!s) return [];
  const commaParts = s.split(',').map((x) => x.trim()).filter(Boolean);
  if (commaParts.length > 1) return commaParts;
  const slashParts = s.split(/\s*\/\s*/).map((x) => x.trim()).filter(Boolean);
  return slashParts.length > 1 ? slashParts : commaParts;
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

function mapToProfessional(a) {
  return {
    id: a.id,
    created_at: a.created_at,
    name: a.full_name || 'Professional',
    role: a.role || 'counsellor',
    roleLabel: ROLE_LABELS[a.role] || a.role_label || 'Professional',
    city: a.city || '',
    clinic: a.clinic || '',
    fee: a.fee_inr ? Number(a.fee_inr) : null,
    duration: a.duration_min ? Number(a.duration_min) : 50,
    languages: normalizeList(a.languages),
    specialities: normalizeList(a.specialities),
    modes: normalizeModes(a.modes).length ? normalizeModes(a.modes) : ['Video', 'Audio', 'Chat'],
    availability: a.availability || '',
    degree: a.degree || '',
  };
}

// ── Avatar component ───────────────────────────────────────────
function Avatar({ name, role, size = 56 }) {
  const initials = getInitials(name);
  const color = ROLE_COLORS[role] || '#0d9488';
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff',
      fontSize: size * 0.36,
      fontWeight: 800,
      letterSpacing: '0.02em',
      flexShrink: 0,
      boxShadow: `0 4px 12px ${color}44`,
      border: '3px solid #fff',
    }}>
      {initials}
    </div>
  );
}

export default function PatientFindProfessionalPage() {
  // ── Filters ────────────────────────────────────────────────
  const [role, setRole]         = useState('all');
  const [language, setLanguage] = useState('Any');
  const [city, setCity]         = useState('');
  const [search, setSearch]     = useState('');
  const [maxFee, setMaxFee]     = useState(3000);
  const [sortBy, setSortBy]     = useState('newest');

  // ── Data ────────────────────────────────────────────────────
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    professionalsApi
      .directory()
      .then((json) => {
        setProfessionals((json.professionals ?? []).map(mapToProfessional));
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // ── Computed lists ─────────────────────────────────────────
  const languages = useMemo(() => {
    const set = new Set();
    for (const p of professionals) for (const l of p.languages) set.add(l);
    return ['Any', ...Array.from(set).sort()];
  }, [professionals]);

  const cities = useMemo(() => {
    const set = new Set();
    for (const p of professionals) if (p.city) set.add(p.city);
    return Array.from(set).sort();
  }, [professionals]);

  const counts = useMemo(() => {
    const c = { all: professionals.length };
    for (const p of professionals) c[p.role] = (c[p.role] ?? 0) + 1;
    return c;
  }, [professionals]);

  // ── Filtering + sorting ────────────────────────────────────
  const shown = useMemo(() => {
    const cityNeedle = city.trim().toLowerCase();
    const q = search.trim().toLowerCase();
    let list = professionals.filter((p) => {
      if (role !== 'all' && p.role !== role) return false;
      if (language !== 'Any' && !p.languages.some((l) => l.toLowerCase() === language.toLowerCase())) return false;
      if (cityNeedle && !p.city.toLowerCase().includes(cityNeedle)) return false;
      if (typeof p.fee === 'number' && p.fee > maxFee) return false;
      if (q) {
        const blob = `${p.name} ${p.roleLabel} ${p.city} ${p.specialities.join(' ')} ${p.degree}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });

    list = [...list];
    if (sortBy === 'fee_asc')  list.sort((a, b) => (a.fee ?? Infinity) - (b.fee ?? Infinity));
    if (sortBy === 'fee_desc') list.sort((a, b) => (b.fee ?? -Infinity) - (a.fee ?? -Infinity));
    if (sortBy === 'name_asc') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [professionals, role, language, city, maxFee, search, sortBy]);

  function clearFilters() {
    setRole('all'); setLanguage('Any'); setCity(''); setSearch(''); setMaxFee(3000); setSortBy('newest');
  }

  const activeFilterCount =
    (role !== 'all' ? 1 : 0) +
    (language !== 'Any' ? 1 : 0) +
    (city ? 1 : 0) +
    (search ? 1 : 0) +
    (maxFee !== 3000 ? 1 : 0);

  return (
    <div className="page" style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 320px)', minHeight: '100vh' }}>
      {/* ── Page header ────────────────────────────────────── */}
      <section style={{ padding: '3rem 0 1.5rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 720 }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Find your match</p>
          <h1 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 12, letterSpacing: '-0.02em' }}>
            The right professional, <span style={{ background: 'linear-gradient(135deg, #14b8a6, #0f766e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>matched to you</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.55 }}>
            Browse Serenest-verified psychiatrists, psychologists, therapists and counsellors. Filter by language, city and budget.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* ── Search bar ──────────────────────────────────── */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '14px 18px',
          boxShadow: '0 8px 24px rgba(15, 118, 110, 0.08)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: '1.25rem',
          maxWidth: 720,
          margin: '0 auto 1.25rem',
        }}>
          <span style={{ fontSize: '1.1rem' }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, speciality, city…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: '0.95rem', color: 'var(--text)',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>✕</button>
          )}
        </div>

        {/* ── Role tabs ───────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {ROLES.map((r) => {
            const active = role === r.id;
            const count = counts[r.id] ?? 0;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px',
                  borderRadius: 99,
                  border: active ? `2px solid ${r.color}` : '2px solid transparent',
                  background: active ? `${r.color}12` : '#fff',
                  color: active ? r.color : 'var(--text)',
                  fontSize: '0.9rem',
                  fontWeight: active ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: active ? `0 4px 12px ${r.color}33` : '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{r.icon}</span>
                {r.label}
                {count > 0 && <span style={{
                  background: active ? r.color : 'var(--bg-subtle, #f0fdfa)',
                  color: active ? '#fff' : 'var(--text-muted)',
                  borderRadius: 99,
                  padding: '1px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}>{count}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Filters row ─────────────────────────────────── */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '14px 18px',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          alignItems: 'end',
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={selectStyle}>
              {languages.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={cities[0] ? `e.g. ${cities[0]}` : 'Any city'}
              list="city-list"
              style={selectStyle}
            />
            <datalist id="city-list">
              {cities.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              Max fee: <span style={{ color: 'var(--brand-600)' }}>₹{maxFee}</span>
            </label>
            <input
              type="range"
              min={500} max={5000} step={100}
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-500, #14b8a6)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Sort</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
              {SORT_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Result count + clear ────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            {loading ? 'Loading…' : (
              <>Showing <strong style={{ color: 'var(--text)' }}>{shown.length}</strong> of {professionals.length} verified professionals</>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} style={{
              background: 'none', border: '1px solid var(--border)',
              padding: '6px 12px', borderRadius: 8, fontSize: '0.82rem',
              cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 500,
            }}>
              ✕ Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* ── Content states ──────────────────────────────── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Finding professionals…</p>
          </div>
        ) : error ? (
          <EmptyState icon="⚠" title="Couldn't load professionals" body={error} />
        ) : professionals.length === 0 ? (
          <EmptyState
            icon="🩺"
            title="No verified professionals yet"
            body="We're onboarding carefully. In the meantime, you can request a session and we'll match you."
            cta={<Link className="btn btn-primary" to="/book">Book a session</Link>}
          />
        ) : shown.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No professionals match your filters"
            body="Try widening your search — different language, higher fee, or a nearby city."
            cta={<button onClick={clearFilters} className="btn btn-primary">Reset filters</button>}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            {shown.map((p) => <ProfessionalCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Professional Card ────────────────────────────────────────────
function ProfessionalCard({ p }) {
  const roleColor = ROLE_COLORS[p.role] || '#0d9488';
  return (
    <article style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(15, 118, 110, 0.05)',
      cursor: 'default',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${roleColor}25`; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 118, 110, 0.05)'; }}
    >
      {/* Top: avatar + name + price */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0, flex: 1 }}>
          <Avatar name={p.name} role={p.role} />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 3, lineHeight: 1.2, color: 'var(--text)' }}>{p.name}</h3>
            <div style={{ fontSize: '0.78rem', color: roleColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {p.roleLabel}
            </div>
            {p.degree && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.degree}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
            {p.fee ? `₹${p.fee}` : '—'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.duration} min</div>
        </div>
      </div>

      {/* City + clinic */}
      {(p.city || p.clinic) && (
        <div style={{ display: 'flex', gap: 12, fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          {p.city   && <span>📍 {p.city}</span>}
          {p.clinic && <span>🏥 {p.clinic}</span>}
        </div>
      )}

      {/* Languages */}
      {p.languages.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {p.languages.slice(0, 4).map((l) => (
            <span key={l} style={{
              background: '#f0fdfa', color: 'var(--brand-700)',
              padding: '3px 10px', borderRadius: 99,
              fontSize: '0.72rem', fontWeight: 600,
            }}>{l}</span>
          ))}
        </div>
      )}

      {/* Specialities */}
      {p.specialities.length > 0 && (
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Specialises in</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {p.specialities.slice(0, 5).map((s) => (
              <span key={s} style={{
                background: 'var(--bg-subtle, #f8f9fa)', color: 'var(--text)',
                padding: '3px 9px', borderRadius: 6,
                fontSize: '0.74rem', fontWeight: 500,
                border: '1px solid var(--border)',
              }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Modes */}
      <div style={{ display: 'flex', gap: 6 }}>
        {p.modes.slice(0, 3).map((m) => {
          const icon = m.toLowerCase().includes('video') ? '📹' : m.toLowerCase().includes('audio') ? '🎙' : m.toLowerCase().includes('chat') ? '💬' : '✨';
          return (
            <span key={m} style={{
              fontSize: '0.74rem', color: 'var(--text-muted)',
              display: 'inline-flex', alignItems: 'center', gap: 3,
            }}>{icon} {m}</span>
          );
        })}
      </div>

      {/* Availability */}
      {p.availability && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border)', paddingTop: 8 }}>
          🕐 <strong style={{ color: 'var(--text)' }}>Available:</strong> {p.availability}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
        <Link
          to={`/book?pid=${encodeURIComponent(p.id)}&pname=${encodeURIComponent(p.name)}&prole=${encodeURIComponent(p.role)}&prolabel=${encodeURIComponent(p.roleLabel)}&pfee=${encodeURIComponent(p.fee ?? '')}&pduration=${encodeURIComponent(p.duration ?? '')}`}
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center', display: 'flex' }}
        >
          Book session →
        </Link>
        <a
          href={`https://wa.me/917777936367?text=${encodeURIComponent(`Hi, I'd like to book a session with ${p.name} (${p.roleLabel})`)}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#25D366', color: '#fff',
            border: 'none', borderRadius: 8,
            padding: '8px 14px', textDecoration: 'none',
            fontSize: '0.85rem', fontWeight: 600,
          }}
          aria-label="WhatsApp"
        >
          💬
        </a>
      </div>
    </article>
  );
}

// ── Empty State ─────────────────────────────────────────────────
function EmptyState({ icon, title, body, cta }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '3.5rem 2rem',
      textAlign: 'center',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: cta ? '1.5rem' : 0, fontSize: '0.92rem' }}>{body}</p>
      {cta}
    </div>
  );
}

// ── Style constants ─────────────────────────────────────────────
const selectStyle = {
  width: '100%',
  padding: '8px 11px',
  fontSize: '0.9rem',
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: '#fff',
  color: 'var(--text)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
