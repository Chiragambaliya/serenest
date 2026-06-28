import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';

const ROLE_LABEL = {
  psychiatrist: 'Psychiatrist',
  psychologist: 'Clinical Psychologist',
  therapist:    'Therapist',
  counsellor:   'Counsellor',
};

const ROLE_COLOR = {
  psychiatrist: '#6f42c1',
  psychologist: '#0d6efd',
  therapist:    '#198754',
  counsellor:   '#e67e22',
};

const MODE_LABEL = { video: '🎥 Video', audio: '🎧 Audio', chat: '💬 Chat' };

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ color: '#f59e0b', fontSize: '1rem', letterSpacing: 1 }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function DoctorProfilePage() {
  const { slug } = useParams();
  const [pro, setPro]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetch(`/api/professionals/profiles/${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.professional) setPro(d.professional); else setError('Profile not found.'); })
      .catch(() => setError('Could not load profile.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useSEO({
    path: `/doctors/${slug}`,
    title: pro ? `${pro.name} — ${ROLE_LABEL[pro.role] ?? pro.role} | Serenest` : 'Doctor Profile | Serenest',
    description: pro?.bio?.slice(0, 155) ?? 'Book an online session with a verified mental health professional at Serenest.',
  });

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (error || !pro) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{error ?? 'Profile not found.'}</p>
      <Link to="/patient/find-professional" className="btn btn-primary">Browse all professionals</Link>
    </div>
  );

  const roleColor = ROLE_COLOR[pro.role] ?? '#4a5a30';

  return (
    <main className="doctor-profile-page">
      <div className="doctor-profile-inner">

        {/* ── Hero card ── */}
        <div className="dp-hero">
          <div className="dp-avatar-wrap">
            {pro.photo_url
              ? <img src={pro.photo_url} alt={pro.name} className="dp-avatar" />
              : <div className="dp-avatar dp-avatar--initials" style={{ background: roleColor + '22', color: roleColor }}>
                  {pro.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
            }
            {pro.is_featured && <span className="dp-featured-badge">⭐ Featured</span>}
          </div>

          <div className="dp-hero-info">
            <span className="dp-role-chip" style={{ background: roleColor + '18', color: roleColor }}>
              {ROLE_LABEL[pro.role] ?? pro.role}
            </span>
            <h1 className="dp-name">{pro.name}</h1>
            {pro.tagline && <p className="dp-tagline">"{pro.tagline}"</p>}
            <p className="dp-quals">{pro.qualifications}</p>

            <div className="dp-stats">
              {pro.rating > 0 && (
                <div className="dp-stat">
                  <StarRating rating={pro.rating} />
                  <span>{pro.rating.toFixed(1)} rating</span>
                </div>
              )}
              {pro.session_count > 0 && (
                <div className="dp-stat">
                  <strong>{pro.session_count.toLocaleString('en-IN')}+</strong>
                  <span>sessions</span>
                </div>
              )}
              {pro.experience_years > 0 && (
                <div className="dp-stat">
                  <strong>{pro.experience_years} yrs</strong>
                  <span>experience</span>
                </div>
              )}
            </div>

            <Link to={`/book?professional=${pro.slug}`} className="btn btn-primary dp-book-btn">
              Book a session — ₹{pro.session_fee?.toLocaleString('en-IN')}
            </Link>
          </div>
        </div>

        <div className="dp-body">
          {/* About */}
          {pro.bio && (
            <section className="dp-section">
              <h2>About</h2>
              <p>{pro.bio}</p>
            </section>
          )}

          {/* Specialties */}
          {pro.specialties?.length > 0 && (
            <section className="dp-section">
              <h2>Specialties</h2>
              <div className="dp-chips">
                {pro.specialties.map((s) => (
                  <span key={s} className="dp-chip">{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* Session details */}
          <section className="dp-section">
            <h2>Session details</h2>
            <div className="dp-detail-grid">
              {pro.session_types?.length > 0 && (
                <div className="dp-detail-item">
                  <span className="dp-detail-label">Formats</span>
                  <span>{pro.session_types.map((m) => MODE_LABEL[m] ?? m).join(' · ')}</span>
                </div>
              )}
              {pro.languages?.length > 0 && (
                <div className="dp-detail-item">
                  <span className="dp-detail-label">Languages</span>
                  <span>{pro.languages.join(', ')}</span>
                </div>
              )}
              <div className="dp-detail-item">
                <span className="dp-detail-label">Fee per session</span>
                <span>₹{pro.session_fee?.toLocaleString('en-IN')}</span>
              </div>
              <div className="dp-detail-item">
                <span className="dp-detail-label">Booking</span>
                <span>Pay-per-session · No subscription</span>
              </div>
            </div>
          </section>
        </div>

        {/* CTA strip */}
        <div className="dp-cta-strip">
          <div>
            <p className="dp-cta-heading">Ready to book with {pro.name.split(' ')[0]}?</p>
            <p className="dp-cta-sub">Sessions from ₹{pro.session_fee?.toLocaleString('en-IN')} · Cancel anytime</p>
          </div>
          <Link to={`/book?professional=${pro.slug}`} className="btn btn-primary">Book a session</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/patient/find-professional" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ← Browse all professionals
          </Link>
        </div>
      </div>
    </main>
  );
}
