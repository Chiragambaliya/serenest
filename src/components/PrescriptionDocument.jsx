import React from 'react';

/**
 * Print-ready A4 teleconsultation prescription.
 * Renders from a prescription row; empty fields show a blank rule so a
 * partially-filled Rx still reads like a formal document.
 */

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/** Label + value on a ruled line (form style). */
function Field({ label, value }) {
  return (
    <div className="rx-field">
      <span className="rx-field-label">{label}</span>
      <span className="rx-field-sep">:</span>
      <span className="rx-field-value">{value || ''}</span>
    </div>
  );
}

function bullets(text) {
  if (!text) return [];
  return String(text).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

export default function PrescriptionDocument({ prescription: p }) {
  const ref = (p.appointment_id || p.id || '').toString().slice(0, 8).toUpperCase();
  const meds = Array.isArray(p.medicines) ? p.medicines : [];
  const medRows = [...meds, ...Array(Math.max(0, 5 - meds.length)).fill(null)].slice(0, Math.max(5, meds.length));

  return (
    <div className="rx-doc">
      {/* ── Header ── */}
      <header className="rx-head">
        <div className="rx-brand">
          <svg viewBox="0 0 48 48" width="46" height="46" aria-hidden="true">
            <path d="M19 10c-3.2 0-5.6 2.1-5.6 4.6 0 1 .4 2 1.1 2.7-1.4.8-2.3 2-2.3 3.5 0 1.4.8 2.7 2 3.4-.6.7-1 1.6-1 2.6 0 2.4 2.2 4.3 5 4.3 1.1 0 2.1-.3 2.9-.8V12.3C20.3 10.9 19.7 10 19 10Z" fill="none" stroke="#176b6b" strokeWidth="1.6" strokeLinejoin="round"/>
            <path d="M29 10c3.2 0 5.6 2.1 5.6 4.6 0 1-.4 2-1.1 2.7 1.4.8 2.3 2 2.3 3.5 0 1.4-.8 2.7-2 3.4.6.7 1 1.6 1 2.6 0 2.4-2.2 4.3-5 4.3-1.1 0-2.1-.3-2.9-.8V12.3C27.7 10.9 28.3 10 29 10Z" fill="none" stroke="#176b6b" strokeWidth="1.6" strokeLinejoin="round"/>
            <path d="M24 30v8" stroke="#176b6b" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <div>
            <div className="rx-brand-name">Serenest</div>
            <div className="rx-brand-tag">Mental Wellness. Trusted Care.</div>
          </div>
        </div>

        <div className="rx-head-title">
          <div className="rx-title-main">PRESCRIPTION</div>
          <div className="rx-title-sub">TELECONSULTATION</div>
        </div>

        <div className="rx-head-meta">
          <Field label="Prescription ID" value={ref} />
          <Field label="Date" value={fmtDate(p.created_at)} />
          <Field label="Time" value={fmtTime(p.created_at)} />
          <Field label="Mode" value={p.mode} />
          <div className="rx-mode-hint">(Video / Audio / Chat)</div>
        </div>
      </header>

      {/* ── Patient + Doctor ── */}
      <div className="rx-two">
        <section className="rx-block">
          <div className="rx-block-title">● PATIENT DETAILS</div>
          <Field label="Name" value={p.patient_name} />
          <Field label="Age / Gender" value={p.patient_age_gender} />
          <Field label="Patient ID" value={ref} />
          <Field label="Contact" value={p.patient_contact} />
        </section>

        <section className="rx-block">
          <div className="rx-block-title">● DOCTOR DETAILS</div>
          <Field label="Doctor Name" value={p.professional_name} />
          <Field label="Qualification" value={p.doctor_qualification} />
          <Field label="Specialization" value={p.doctor_specialization} />
          <Field label="Reg. No (Medical Council)" value={p.doctor_reg_no} />
          <Field label="Contact" value={p.doctor_contact} />
        </section>
      </div>

      {/* ── Clinical summary + Advice ── */}
      <div className="rx-two rx-two--card">
        <section className="rx-card">
          <div className="rx-card-title">CLINICAL SUMMARY</div>
          <Field label="Chief Complaints" value={p.chief_complaints} />
          <Field label="Duration" value={p.complaint_duration} />
          <Field label="History / Summary" value={p.history_summary} />
          <Field label="Provisional Diagnosis" value={p.provisional_diagnosis} />
          <Field label="Risk Assessment" value={p.risk_assessment} />
        </section>

        <section className="rx-card">
          <div className="rx-card-title">ADVICE</div>
          <ul className="rx-bullets">
            {bullets(p.advice).length
              ? bullets(p.advice).map((b, i) => <li key={i}>{b}</li>)
              : [0, 1, 2, 3].map((i) => <li key={i} className="rx-bullet-blank" />)}
          </ul>
        </section>
      </div>

      {/* ── Medications ── */}
      <section className="rx-card rx-meds">
        <div className="rx-card-title">MEDICATIONS</div>
        <table className="rx-table">
          <thead>
            <tr>
              <th>S. No.</th><th>Medicine</th><th>Strength</th><th>Dose</th>
              <th>Frequency</th><th>Duration</th><th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            {medRows.map((m, i) => (
              <tr key={i}>
                <td>{i + 1}.</td>
                <td>{m?.name || ''}</td>
                <td>{m?.strength || ''}</td>
                <td>{m?.dosage || m?.dose || ''}</td>
                <td>{m?.frequency || ''}</td>
                <td>{m?.duration || ''}</td>
                <td>{m?.instructions || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Follow up + Emergency ── */}
      <div className="rx-two rx-two--card">
        <section className="rx-card">
          <div className="rx-card-title">📅 FOLLOW UP</div>
          <Field label="Review after" value={p.review_after} />
          <Field label="Date" value={fmtDate(p.follow_up_date)} />
        </section>
        <section className="rx-card">
          <div className="rx-card-title">⚠ EMERGENCY ADVICE</div>
          <ul className="rx-bullets">
            {bullets(p.emergency_advice).length
              ? bullets(p.emergency_advice).map((b, i) => <li key={i}>{b}</li>)
              : [0, 1].map((i) => <li key={i} className="rx-bullet-blank" />)}
          </ul>
        </section>
      </div>

      {/* ── Important + Signature ── */}
      <div className="rx-two rx-two--card">
        <section className="rx-card">
          <div className="rx-card-title">IMPORTANT</div>
          <ul className="rx-bullets">
            {bullets(p.important_notes).length
              ? bullets(p.important_notes).map((b, i) => <li key={i}>{b}</li>)
              : [0, 1, 2].map((i) => <li key={i} className="rx-bullet-blank" />)}
          </ul>
        </section>
        <section className="rx-card rx-sign">
          <div className="rx-card-title">DOCTOR SIGNATURE</div>
          <div className="rx-sign-row">
            <div className="rx-sign-lines">
              <div className="rx-sign-line" />
              <Field label="Name" value={p.professional_name} />
              <Field label="Reg. No." value={p.doctor_reg_no} />
            </div>
            <div className="rx-stamp">(Stamp)</div>
          </div>
        </section>
      </div>

      {/* ── Issued by + Disclaimer ── */}
      <div className="rx-two rx-foot">
        <section className="rx-block">
          <div className="rx-block-title rx-block-title--sm">▣ ISSUED BY</div>
          <Field label="Clinic / Organization Name" value={p.clinic_name || 'Serenest Education Pvt Ltd'} />
          <Field label="Address" value={p.clinic_address} />
          <Field label="Contact" value={p.clinic_contact || '7777936367'} />
          <Field label="Website / Email" value={p.clinic_website || 'serenest.in · support@serenest.in'} />
        </section>
        <section className="rx-block">
          <div className="rx-block-title rx-block-title--sm">DISCLAIMER</div>
          <p className="rx-disclaimer">
            This prescription is issued based on the information provided during the teleconsultation.
            It is valid only for the patient named above. This is not a substitute for in-person
            emergency care. In case of any medical emergency, please visit the nearest hospital immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
