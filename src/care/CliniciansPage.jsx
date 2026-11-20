import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { professionals as professionalsApi } from '../lib/api';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { SPECIALTIES, isSpecialty, specialtyLabel } from './specialties';

export default function CliniciansPage() {
  useSEO({ path: '/patient/find-professional', ...ROUTE_SEO['/patient/find-professional'] });
  const [people, setPeople] = useState([]);
  const [status, setStatus] = useState('loading');
  const [role, setRole] = useState('all');

  useEffect(() => {
    professionalsApi.directory()
      .then((json) => {
        setPeople(json.professionals ?? []);
        setStatus('ready');
      })
      .catch(() => setStatus('unavailable'));
  }, []);

  const shown = useMemo(
    () => people.filter((person) => role === 'all' || person.role === role),
    [people, role],
  );

  return (
    <div className="care-shell">
      <section className="care-section">
        <p className="care-kicker">Clinicians</p>
        <h2>Verified specialists.</h2>
        <p>Filter by specialty, then request a slot. You pay after we confirm.</p>
        <label className="care-field">
          <span>Specialty</span>
          <select className="care-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">All specialties</option>
            {SPECIALTIES.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </label>
      </section>
      {status === 'loading' && <p>Loading clinicians…</p>}
      {status === 'unavailable' && <p>The directory is unavailable right now. You can still request a match.</p>}
      {status === 'ready' && shown.length === 0 && <p>No verified clinician is listed for this specialty yet. We can match you.</p>}
      <div className="care-grid care-grid--people">
        {shown.map((person) => (
          <article className="care-card" key={person.id}>
            <p className="care-kicker">{isSpecialty(person.role) ? specialtyLabel(person.role) : (person.role_label || 'Clinician')}</p>
            <h3>{person.full_name}</h3>
            <p>{[person.city, person.fee_inr ? `₹${person.fee_inr}` : null].filter(Boolean).join(' · ') || 'Fee confirmed with your booking'}</p>
            <Link className="care-index__go" to={`/book?pid=${person.id}&pname=${encodeURIComponent(person.full_name || '')}&prole=${encodeURIComponent(person.role || '')}&prolabel=${encodeURIComponent(person.role_label || specialtyLabel(person.role))}&pfee=${encodeURIComponent(person.fee_inr || '')}`}>
              Request →
            </Link>
          </article>
        ))}
      </div>
      <div className="care-actions">
        <Link className="care-btn care-btn--primary" to="/book">Request any specialist</Link>
        <Link className="care-btn care-btn--ghost" to="/professionals/apply">Join as a clinician</Link>
      </div>
    </div>
  );
}
