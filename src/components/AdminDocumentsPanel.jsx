import React, { useEffect, useMemo, useState } from 'react';
import IssuedDocument, { DOC_TYPE_LABELS } from './documents/IssuedDocument';
import { ACADEMY_PROGRAMS } from '../lib/academyPrograms';

const EMPTY = {
  doc_type: 'joining_letter',
  recipient_name: '',
  recipient_email: '',
  recipient_phone: '',
  professional_id: '',
  program_slug: 'clinical-excellence',
  program_title: '',
  completion_date: '',
  role_title: '',
  department: '',
  join_date: '',
  end_date: '',
  employment_type: 'Platform clinician',
  signatory_name: 'Dr. Chirag Aambalia',
  signatory_title: 'Psychiatrist & Founder',
  body_extra: '',
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminDocumentsPanel({ secret, adminFetch, apps = [] }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ ...EMPTY, join_date: todayISO(), completion_date: todayISO() });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('all');

  const approvedPros = useMemo(
    () => (apps || []).filter((a) => a.status === 'approved'),
    [apps],
  );

  const load = async () => {
    if (!secret) return;
    setLoading(true);
    setError('');
    try {
      const r = await adminFetch('/api/documents', secret);
      setDocs(r.documents || []);
    } catch (e) {
      setError(e.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [secret]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onPickProfessional = (id) => {
    const pro = approvedPros.find((p) => p.id === id);
    setForm((f) => ({
      ...f,
      professional_id: id,
      recipient_name: pro?.full_name || f.recipient_name,
      recipient_email: pro?.email || f.recipient_email,
      recipient_phone: pro?.phone || f.recipient_phone,
      role_title: pro?.role_label || pro?.role || f.role_title,
    }));
  };

  const onPickProgram = (slug) => {
    const p = ACADEMY_PROGRAMS.find((x) => x.slug === slug);
    setForm((f) => ({
      ...f,
      program_slug: slug,
      program_title: p?.title || f.program_title,
    }));
  };

  useEffect(() => {
    if (form.doc_type === 'certificate' && !form.program_title) {
      onPickProgram(form.program_slug || 'clinical-excellence');
    }
  }, [form.doc_type]);

  const previewDoc = useMemo(() => ({
    ...form,
    ref_code: form.ref_code || 'PREVIEW',
    status: 'draft',
    created_at: new Date().toISOString(),
    issuer_name: 'Serenest Education Pvt Ltd',
  }), [form]);

  const issue = async ({ send = false, lock = true } = {}) => {
    setSaving(true);
    setNotice('');
    setError('');
    try {
      const payload = {
        ...form,
        professional_id: form.professional_id || null,
        send,
        lock: send ? undefined : lock,
      };
      const r = await adminFetch('/api/documents', secret, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const path = r.view_path || `/documents/${r.document?.id}`;
      let msg = `Saved ${DOC_TYPE_LABELS[r.document.doc_type] || 'document'} (${r.document.ref_code}).`;
      if (r.sent) msg += ' Email sent.';
      else if (r.send_error) msg += ` Email: ${r.send_error}`;
      msg += ` Link: ${path}`;
      setNotice(msg);
      setForm({ ...EMPTY, doc_type: form.doc_type, join_date: todayISO(), completion_date: todayISO() });
      await load();
    } catch (e) {
      setError(e.message || 'Could not issue document');
    } finally {
      setSaving(false);
    }
  };

  const filtered = filter === 'all' ? docs : docs.filter((d) => d.doc_type === filter);

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.35rem' }}>Issue documents</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 54 }}>
          Certificates, joining letters, and experience letters. Preview → Issue → Print/PDF link.
        </p>
      </header>

      {error ? <div className="callout" style={{ borderColor: '#f8d7da' }}><p style={{ margin: 0 }}>{error}</p></div> : null}
      {notice ? <div className="callout"><p style={{ margin: 0 }}>{notice}</p></div> : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: '1.5rem' }}>
        <form
          className="admin-card"
          style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}
          onSubmit={(e) => { e.preventDefault(); issue({ send: false, lock: true }); }}
        >
          <label style={labelStyle}>
            Document type
            <select
              value={form.doc_type}
              onChange={(e) => setField('doc_type', e.target.value)}
              style={inputStyle}
            >
              <option value="joining_letter">Joining letter</option>
              <option value="experience_letter">Experience letter</option>
              <option value="certificate">Academy certificate</option>
            </select>
          </label>

          <label style={labelStyle}>
            From approved professional (optional)
            <select
              value={form.professional_id}
              onChange={(e) => onPickProfessional(e.target.value)}
              style={inputStyle}
            >
              <option value="">— Manual entry —</option>
              {approvedPros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} · {p.role_label || p.role}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Recipient name *
            <input
              required
              value={form.recipient_name}
              onChange={(e) => setField('recipient_name', e.target.value)}
              style={inputStyle}
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <label style={labelStyle}>
              Email
              <input
                type="email"
                value={form.recipient_email}
                onChange={(e) => setField('recipient_email', e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Phone
              <input
                value={form.recipient_phone}
                onChange={(e) => setField('recipient_phone', e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>

          {form.doc_type === 'certificate' ? (
            <>
              <label style={labelStyle}>
                Program
                <select
                  value={form.program_slug}
                  onChange={(e) => onPickProgram(e.target.value)}
                  style={inputStyle}
                >
                  {ACADEMY_PROGRAMS.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.title}</option>
                  ))}
                </select>
              </label>
              <label style={labelStyle}>
                Completion date
                <input
                  type="date"
                  value={form.completion_date}
                  onChange={(e) => setField('completion_date', e.target.value)}
                  style={inputStyle}
                />
              </label>
            </>
          ) : (
            <>
              <label style={labelStyle}>
                Designation / role
                <input
                  value={form.role_title}
                  onChange={(e) => setField('role_title', e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Clinical Psychologist"
                />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <label style={labelStyle}>
                  Join date
                  <input
                    type="date"
                    value={form.join_date}
                    onChange={(e) => setField('join_date', e.target.value)}
                    style={inputStyle}
                  />
                </label>
                {form.doc_type === 'experience_letter' ? (
                  <label style={labelStyle}>
                    End date (blank = present)
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={(e) => setField('end_date', e.target.value)}
                      style={inputStyle}
                    />
                  </label>
                ) : (
                  <label style={labelStyle}>
                    Engagement type
                    <input
                      value={form.employment_type}
                      onChange={(e) => setField('employment_type', e.target.value)}
                      style={inputStyle}
                    />
                  </label>
                )}
              </div>
              {form.doc_type === 'experience_letter' ? (
                <label style={labelStyle}>
                  Engagement type
                  <input
                    value={form.employment_type}
                    onChange={(e) => setField('employment_type', e.target.value)}
                    style={inputStyle}
                  />
                </label>
              ) : null}
            </>
          )}

          <label style={labelStyle}>
            Extra paragraph (optional)
            <textarea
              rows={3}
              value={form.body_extra}
              onChange={(e) => setField('body_extra', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Issue & lock'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={saving}
              onClick={() => issue({ send: true })}
            >
              Issue, email & lock
            </button>
          </div>
        </form>

        <div style={{ minWidth: 0 }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Live preview
          </p>
          <div style={{ maxHeight: 720, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 8, background: '#ebe4d8', padding: '1rem' }}>
            <IssuedDocument doc={previewDoc} />
          </div>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Issued documents</h3>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...inputStyle, width: 'auto', margin: 0 }}>
            <option value="all">All types</option>
            <option value="joining_letter">Joining letters</option>
            <option value="experience_letter">Experience letters</option>
            <option value="certificate">Certificates</option>
          </select>
          <button type="button" className="btn btn-ghost" onClick={load} style={{ marginLeft: 'auto' }}>Refresh</button>
        </div>

        {loading ? <p className="muted">Loading…</p> : null}
        {!loading && filtered.length === 0 ? <p className="muted">No documents yet.</p> : null}

        <div style={{ display: 'grid', gap: '0.65rem' }}>
          {filtered.map((d) => (
            <div
              key={d.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '0.75rem',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: 10,
                background: 'var(--surface)',
              }}
            >
              <div>
                <strong>{DOC_TYPE_LABELS[d.doc_type] || d.doc_type}</strong>
                {' · '}
                {d.recipient_name}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {d.ref_code} · {d.status}
                  {d.program_title ? ` · ${d.program_title}` : ''}
                  {d.role_title ? ` · ${d.role_title}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a className="btn btn-ghost" href={d.view_path || `/documents/${d.id}`} target="_blank" rel="noreferrer">
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const labelStyle = {
  display: 'grid',
  gap: 6,
  marginBottom: '0.85rem',
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
};

const inputStyle = {
  width: '100%',
  padding: '0.55rem 0.7rem',
  borderRadius: 8,
  border: '1px solid var(--border)',
  fontSize: '0.92rem',
  fontWeight: 500,
  color: 'var(--ink)',
  background: '#fff',
};
