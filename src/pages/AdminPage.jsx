import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PrescriptionDocument from '../components/PrescriptionDocument';

// ── API helper ──────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL ?? '';
const WA_CHANNEL = import.meta.env.VITE_WA_CHANNEL_LINK ?? '';

async function adminFetch(path, secret, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': secret,
      ...(opts.headers ?? {}),
    },
  });
  const json = await res.json().catch(() => ({ ok: false, error: 'Invalid response' }));
  if (!json.ok) {
    const e = new Error(json.error ?? 'Request failed');
    e.status = res.status;
    throw e;
  }
  return json;
}

// ── Small components ────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'var(--brand-500)' }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderTop: `3px solid ${color}`,
      borderRadius: 12,
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ fontSize: '2.1rem', fontWeight: 800, color, lineHeight: 1.1, letterSpacing: '-0.03em' }}>{value ?? '—'}</span>
      {sub && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</span>}
    </div>
  );
}

function Badge({ status }) {
  const map = {
    pending:   { bg: '#fff3cd', color: '#856404' },
    confirmed: { bg: '#d1e7dd', color: '#0a3622' },
    completed: { bg: '#cfe2ff', color: '#084298' },
    cancelled: { bg: '#f8d7da', color: '#842029' },
    approved:  { bg: '#d1e7dd', color: '#0a3622' },
    rejected:  { bg: '#f8d7da', color: '#842029' },
  };
  const s = map[status] ?? { bg: '#e9ecef', color: '#495057' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 99,
      fontSize: '0.72rem',
      fontWeight: 700,
      textTransform: 'capitalize',
      background: s.bg,
      color: s.color,
    }}>{status}</span>
  );
}

function Pill({ n, color = '#dc3545' }) {
  return (
    <span style={{ marginLeft: 6, background: color, color: '#fff', borderRadius: 99, padding: '1px 6px', fontSize: '0.7rem', fontWeight: 700 }}>{n}</span>
  );
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ── Tabs & nav groups ────────────────────────────────────────────────────────
const TAB_GROUPS = [
  {
    label: null,
    items: [{ id: 'overview', label: 'Overview', icon: '◈' }],
  },
  {
    label: 'Patients',
    items: [
      { id: 'bookings',   label: 'Bookings',   icon: '◻' },
      { id: 'screenings', label: 'Screenings', icon: '◻' },
      { id: 'signups',    label: 'Signups',    icon: '◻' },
    ],
  },
  {
    label: 'Professionals',
    items: [
      { id: 'professionals', label: 'Professionals', icon: '◻' },
      { id: 'applications',  label: 'Applications',  icon: '◻' },
      { id: 'hr',            label: 'HR / Hiring',   icon: '◻' },
    ],
  },
  {
    label: 'Communications',
    items: [
      { id: 'messages',    label: 'Messages',    icon: '◻' },
      { id: 'subscribers', label: 'Subscribers', icon: '◻' },
    ],
  },
  {
    label: 'Academy',
    items: [
      { id: 'learners', label: 'Academy', icon: '◻' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { id: 'traffic', label: 'Traffic', icon: '◻' },
      { id: 'website', label: 'Website', icon: '◻' },
    ],
  },
  {
    label: 'Social',
    items: [
      { id: 'social', label: 'Social Media', icon: '◻' },
    ],
  },
];

// Flat TABS array derived from groups (used for label lookups)
const TABS = TAB_GROUPS.flatMap((g) => g.items);

const TAB_ICONS = {
  overview: '◈',
  traffic: '▲',
  website: '◎',
  bookings: '▷',
  professionals: '◆',
  applications: '◇',
  hr: '◈',
  messages: '◉',
  screenings: '◌',
  subscribers: '◦',
  learners: '◈',
  signups: '◌',
};

const TAB_HELP = {
  overview: 'Quick KPI view and shortcuts to each workflow.',
  traffic: 'Who is visiting — visit counts, top pages, referrers, and devices (anonymous analytics).',
  website: 'Every public route — open in a new tab, copy links for QA or campaigns, ping API health.',
  bookings: 'Search bookings, update status, and manage patient requests.',
  professionals: 'View approved professionals and update their profiles.',
  applications: 'Review professional onboarding applications.',
  hr: 'Manage job applications, postings, interviews, and offers.',
  messages: 'Read incoming contact/enquiry messages.',
  screenings: 'Review self-screening submissions and callback leads.',
  subscribers: 'People who opted in to email updates — export and reach out.',
  learners: 'Registered Serenest Academy accounts — your learner audience.',
  signups: 'View and export waitlist signups.',
};

const ROLE_LABELS = {
  psychiatrist: 'Psychiatrist',
  psychologist: 'Psychologist',
  therapist:    'Therapist',
  counsellor:   'Counsellor',
};

const ROLE_COLORS = {
  psychiatrist: '#6f42c1',
  psychologist: '#0d6efd',
  therapist:    '#198754',
  counsellor:   '#e67e22',
};

/** Slug must exist in `src/lib/blogPosts.js` — used as a concrete example link. */
const SAMPLE_BLOG_SLUG = 'documenting-risk-safety-telehealth';

const SITE_PAGE_GROUPS = [
  {
    title: 'Core & trust',
    pages: [
      { label: 'Home', path: '/', hint: 'Landing, navigation, Serenest Guide' },
      { label: 'About', path: '/about', hint: 'Mission & organisation' },
      { label: 'Team', path: '/team', hint: 'Clinical team' },
      { label: 'Services', path: '/services', hint: 'Conditions & care types' },
      { label: 'Pricing', path: '/pricing', hint: 'Fees & on-page FAQ' },
      { label: 'FAQ', path: '/faq', hint: 'Policies & common questions' },
    ],
  },
  {
    title: 'Patient journey',
    pages: [
      { label: 'Book a session', path: '/book', hint: 'Multi-step booking' },
      { label: 'Find a professional', path: '/patient/find-professional', hint: 'Directory & filters' },
      { label: 'Self-screening', path: '/screening', hint: 'PHQ-9 / GAD-7' },
      {
        label: 'Consultation room (sample)',
        path: '/consultation/00000000-0000-4000-8000-000000000001',
        hint: 'Replace UUID with a real appointment id from bookings / Supabase before sharing',
      },
    ],
  },
  {
    title: 'Professionals hub',
    pages: [
      { label: 'For professionals', path: '/professionals', hint: 'Clinician landing' },
      { label: 'Clinician learning', path: '/professionals/learning', hint: 'All modules' },
      { label: 'Learning — pharmacology', path: '/professionals/learning#learning-pharmacology', hint: 'Deep link' },
      { label: 'Learning — psychology', path: '/professionals/learning#learning-psychology', hint: 'Deep link' },
      { label: 'Pro resources', path: '/professionals/resources', hint: 'Downloads & links' },
      { label: 'Clinical guidelines', path: '/professionals/guidelines', hint: 'Practice expectations' },
      { label: 'Apply as professional', path: '/professionals/apply', hint: 'Onboarding wizard' },
    ],
  },
  {
    title: 'Serenest Academy',
    pages: [
      { label: 'Academy home', path: '/academy', hint: 'Literacy & learning landing (merged into main site)' },
      { label: 'Academy → tracks', path: '/academy#tracks', hint: 'Anchor: programmes overview' },
      { label: 'Academy → audiences', path: '/academy#audiences', hint: 'Public / clinicians / orgs' },
      { label: 'Academy → contact', path: '/academy#contact', hint: 'Partnerships & collaboration' },
      { label: 'Academy → learn (legacy redirect)', path: '/academy/learn', hint: 'Redirects to /professionals/learning' },
    ],
  },
  {
    title: 'Content & legal',
    pages: [
      { label: 'Blog index', path: '/blog', hint: 'All posts' },
      { label: 'Sample blog post', path: `/blog/${SAMPLE_BLOG_SLUG}`, hint: 'Example slug; see blogPosts.js for all' },
      { label: 'Privacy policy', path: '/privacy', hint: 'Legal / controller' },
      { label: '404 test', path: '/this-route-should-not-exist', hint: 'Sanity-check error page (expect Not found)' },
    ],
  },
];

const ALL_SITE_HUB_GROUPS = SITE_PAGE_GROUPS;

// ── Main page ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [secret, setSecret]   = useState(() => sessionStorage.getItem('adm_s') ?? '');
  const [input, setInput]     = useState('');
  const [authErr, setAuthErr] = useState('');
  const [tab, setTab]         = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close the mobile sidebar drawer on Escape
  const handleSidebarKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setMobileSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    window.addEventListener('keydown', handleSidebarKeyDown);
    return () => window.removeEventListener('keydown', handleSidebarKeyDown);
  }, [mobileSidebarOpen, handleSidebarKeyDown]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  // App-like: jump to the top of the screen when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [tab]);

  const [stats, setStats]             = useState(null);
  const [bookings, setBookings]       = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [apps, setApps]               = useState([]);
  const [jobs, setJobs]               = useState([]);
  const [messages, setMessages]       = useState([]);
  const [screenings, setScreenings]   = useState([]);
  const [signups, setSignups]         = useState([]);
  const [traffic, setTraffic]         = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [learners, setLearners]       = useState([]);
  const [noteEdit, setNoteEdit]       = useState({});
  const [proFilter, setProFilter]     = useState('all');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingBusyId, setBookingBusyId] = useState(null);
  const [editPro, setEditPro]         = useState(null);
  const [editProData, setEditProData] = useState({});
  const [assignBooking, setAssignBooking] = useState(null);
  const [prescribeBooking, setPrescribeBooking] = useState(null);
  const [rxForm, setRxForm] = useState(null);
  const [rxSaving, setRxSaving] = useState(false);
  const [rxSending, setRxSending] = useState(false);
  const [rxError, setRxError] = useState(null);
  const [rxSuccess, setRxSuccess] = useState(null);
  const [rxPreview, setRxPreview] = useState(false);
  const [rxMeta, setRxMeta] = useState(null); // { id, is_locked, locked_at }
  const [rxLoadingExisting, setRxLoadingExisting] = useState(false);

  // Academy content sub-state
  const [academyTab, setAcademyTab]       = useState('learners');
  const [acContent, setAcContent]         = useState([]);
  const [acForm, setAcForm]               = useState({ type: 'announcement', title: '', body: '', link: '', link_label: 'Learn more', pinned: false, is_active: true });
  const [acEditing, setAcEditing]         = useState(null); // id of item being edited
  const [acEditData, setAcEditData]       = useState({});
  const [acBusy, setAcBusy]               = useState(false);
  const [acError, setAcError]             = useState('');
  const [acShowForm, setAcShowForm]       = useState(false);

  // Academy AI content generation state
  const [acGenOpen, setAcGenOpen]       = useState(false);
  const [acGenLoading, setAcGenLoading] = useState(false);
  const [acGenError, setAcGenError]     = useState('');
  const [acGenResult, setAcGenResult]   = useState(null); // { items[] }
  const [acGenSaved, setAcGenSaved]     = useState(false);
  const [acGenFocus, setAcGenFocus]     = useState('');
  const [acGenCount, setAcGenCount]     = useState(4);

  // HR sub-state
  const [hrTab, setHrTab]               = useState('applications');
  const [jobPostings, setJobPostings]   = useState([]);
  const [interviews, setInterviews]     = useState([]);
  const [showNewJob, setShowNewJob]     = useState(false);
  const [newJob, setNewJob]             = useState({ title:'', department:'', location:'Remote', type:'full_time', description:'', requirements:'', salary_range:'' });
  const [editJob, setEditJob]           = useState(null);
  const [editJobData, setEditJobData]   = useState({});
  const [scheduleFor, setScheduleFor]   = useState(null);
  const [newInterview, setNewInterview] = useState({ round:1, interview_type:'video', scheduled_at:'', duration_min:45, interviewer_name:'', meeting_link:'', notes:'' });
  const [offerFor, setOfferFor]         = useState(null);
  const [offerData, setOfferData]       = useState({ offer_salary:'', offer_date:'', offer_deadline:'', joining_date:'' });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Social media state
  const [socialPosts, setSocialPosts]     = useState([]);
  const [socialStatus, setSocialStatus]   = useState(null);
  const [socialForm, setSocialForm]       = useState({
    platform: 'both', caption: '', hashtags: '', image_url: '',
    scheduled_at: '', status: 'scheduled',
  });
  const [socialShowForm, setSocialShowForm] = useState(false);
  const [socialBusy, setSocialBusy]         = useState(false);
  const [socialError, setSocialError]       = useState('');
  const [socialEditing, setSocialEditing]   = useState(null);
  const [socialEditData, setSocialEditData] = useState({});

  // AI content generation state
  const [genOpen, setGenOpen]           = useState(false);
  const [genLoading, setGenLoading]     = useState(false);
  const [genError, setGenError]         = useState('');
  const [genResult, setGenResult]       = useState(null);   // { theme, posts[] }
  const [genSaved, setGenSaved]         = useState(false);
  const [genFocus, setGenFocus]         = useState('');
  const [genStartDate, setGenStartDate] = useState(() => {
    const d = new Date();
    const diff = (1 - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().slice(0, 10);
  });

  const [siteHubFilter, setSiteHubFilter] = useState('');
  const [siteCopied, setSiteCopied]       = useState('');
  const [healthProbe, setHealthProbe]     = useState(null);
  const [health, setHealth]               = useState(null);

  // read messages tracked client-side (localStorage) — no DB column needed
  const [readMsgIds, setReadMsgIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('adm_read_msgs') ?? '[]')); }
    catch { return new Set(); }
  });

  const authed = Boolean(secret);

  // ── fetch helpers ──────────────────────────────────────────
  const load = useCallback(async (which = 'all') => {
    if (!secret) return;
    setLoading(true);
    setError(null);

    const errors = [];
    const safe = async (fn) => {
      try { await fn(); } catch (e) {
        if (e.status === 401) { signOut(); return; }
        errors.push(e.message);
      }
    };

    await Promise.all([
      (which === 'all' || which === 'stats') && safe(async () => {
        const r = await adminFetch('/api/admin/stats', secret);
        setStats(r.stats);
      }),
      (which === 'all' || which === 'bookings') && safe(async () => {
        const r = await adminFetch('/api/bookings', secret);
        setBookings(r.bookings ?? []);
      }),
      (which === 'all' || which === 'applications') && safe(async () => {
        const r = await adminFetch('/api/professionals/applications', secret);
        setApps(r.applications ?? []);
      }),
      (which === 'all' || which === 'professionals') && safe(async () => {
        const r = await adminFetch('/api/professionals/list', secret);
        setProfessionals(r.professionals ?? []);
      }),
      (which === 'all' || which === 'hr') && safe(async () => {
        const [rApps, rPostings, rInterviews] = await Promise.all([
          adminFetch('/api/jobs/applications', secret),
          adminFetch('/api/jobs/all', secret),
          adminFetch('/api/hiring/interviews', secret),
        ]);
        setJobs(rApps.applications ?? []);
        setJobPostings(rPostings.jobs ?? []);
        setInterviews(rInterviews.interviews ?? []);
      }),
      (which === 'all' || which === 'messages') && safe(async () => {
        const r = await adminFetch('/api/contacts', secret);
        setMessages(r.messages ?? []);
      }),
      (which === 'all' || which === 'signups') && safe(async () => {
        const r = await adminFetch('/api/signups', secret);
        setSignups(r.signups ?? []);
      }),
      (which === 'all' || which === 'screenings') && safe(async () => {
        const r = await adminFetch('/api/screening', secret);
        setScreenings(r.screenings ?? []);
      }),
      (which === 'all' || which === 'traffic') && safe(async () => {
        const r = await adminFetch('/api/track/stats', secret);
        setTraffic(r);
      }),
      (which === 'all' || which === 'subscribers') && safe(async () => {
        const r = await adminFetch('/api/subscribers', secret);
        setSubscribers(r.subscribers ?? []);
      }),
      (which === 'all' || which === 'learners') && safe(async () => {
        const r = await adminFetch('/api/academy/learners', secret);
        setLearners(r.learners ?? []);
      }),
      (which === 'all' || which === 'learners') && safe(async () => {
        const r = await adminFetch('/api/academy/content/all', secret);
        setAcContent(r.content ?? []);
      }),
      (which === 'all' || which === 'social') && safe(async () => {
        const [r, s] = await Promise.all([
          adminFetch('/api/social/posts', secret),
          adminFetch('/api/social/status', secret),
        ]);
        setSocialPosts(r.posts ?? []);
        setSocialStatus(s);
      }),
    ].filter(Boolean));

    if (errors.length) setError([...new Set(errors)].join(' · '));
    setLoading(false);
  }, [secret]);

  useEffect(() => {
    if (authed) load('all');
  }, [authed, load]);

  // Lead-pipeline health check — warns when a channel that captures or alerts
  // on leads is unconfigured in production.
  useEffect(() => {
    if (!authed) return;
    fetch(`${BASE}/api/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {});
  }, [authed]);

  const healthIssues = useMemo(() => {
    if (!health) return [];
    const issues = [];
    if (health.db !== 'connected') {
      issues.push('Database is NOT configured (SUPABASE_URL + SUPABASE_SERVICE_KEY) — bookings and screenings are only being saved to the on-server fallback file, which is lost on redeploy.');
    }
    if (health.notifications !== 'enabled' && health.team_whatsapp !== 'enabled') {
      issues.push('No lead alerts are configured — new bookings will not email (RESEND_API_KEY + NOTIFY_EMAIL) or WhatsApp (CALLMEBOT_*) anyone. You will only see leads by checking this dashboard.');
    } else if (health.notifications !== 'enabled') {
      issues.push('Team email alerts are off (set RESEND_API_KEY + NOTIFY_EMAIL) — lead alerts currently arrive on WhatsApp only.');
    }
    return issues;
  }, [health]);

  const filteredSiteHub = useMemo(() => {
    const q = siteHubFilter.trim().toLowerCase();
    if (!q) return ALL_SITE_HUB_GROUPS;
    return ALL_SITE_HUB_GROUPS.map((group) => ({
      ...group,
      pages: group.pages.filter((p) =>
        `${group.title} ${p.label} ${p.path} ${p.hint ?? ''}`.toLowerCase().includes(q),
      ),
    })).filter((g) => g.pages.length > 0);
  }, [siteHubFilter]);

  const copySiteUrl = useCallback((fullUrl) => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setSiteCopied(fullUrl);
      window.setTimeout(() => setSiteCopied(''), 1800);
    }).catch(() => {
      setError('Could not copy to clipboard — check browser permissions.');
    });
  }, []);

  const pingApiHealth = useCallback(async () => {
    setHealthProbe(null);
    try {
      const root = BASE.replace(/\/$/, '');
      const url = root ? `${root}/api/health` : '/api/health';
      const res = await fetch(url);
      const body = await res.json().catch(() => ({}));
      setHealthProbe({ requestedUrl: url, httpOk: res.ok, status: res.status, body });
    } catch (e) {
      setHealthProbe({ ok: false, error: e?.message ?? String(e) });
    }
  }, []);

  // ── auth ───────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    setAuthErr('');
    try {
      await adminFetch('/api/admin/stats', input.trim());
      sessionStorage.setItem('adm_s', input.trim());
      setSecret(input.trim());
    } catch {
      setAuthErr('Wrong admin secret. Check your .env ADMIN_SECRET.');
    }
  }

  function signOut() {
    sessionStorage.removeItem('adm_s');
    setSecret('');
    setInput('');
    setStats(null);
    setBookings([]);
    setApps([]);
    setProfessionals([]);
    setJobs([]);
    setMessages([]);
    setScreenings([]);
    setSignups([]);
    setTraffic(null);
    setSubscribers([]);
    setLearners([]);
    setSiteHubFilter('');
    setSiteCopied('');
    setHealthProbe(null);
  }

  // ── job status + notes update ──────────────────────────────
  async function updateJobStatus(id, status) {
    try {
      await adminFetch(`/api/jobs/applications/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status } : j));
      load('stats');
    } catch (e) { setError(e.message); }
  }

  async function saveJobNote(id) {
    const hr_notes = noteEdit[id] ?? '';
    try {
      await adminFetch(`/api/jobs/applications/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ hr_notes }),
      });
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, hr_notes } : j));
      setNoteEdit((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } catch (e) { setError(e.message); }
  }

  // ── HR: job postings ──────────────────────────────────────
  async function createJobPosting() {
    try {
      const r = await adminFetch('/api/jobs', secret, { method: 'POST', body: JSON.stringify(newJob) });
      setJobPostings((p) => [r.job, ...p]);
      setShowNewJob(false);
      setNewJob({ title:'', department:'', location:'Remote', type:'full_time', description:'', requirements:'', salary_range:'' });
    } catch (e) { setError(e.message); }
  }

  async function saveJobPosting(id) {
    try {
      const r = await adminFetch(`/api/jobs/${id}`, secret, { method: 'PATCH', body: JSON.stringify(editJobData) });
      setJobPostings((p) => p.map((j) => j.id === id ? r.job : j));
      setEditJob(null); setEditJobData({});
    } catch (e) { setError(e.message); }
  }

  async function toggleJobOpen(id, is_open) {
    try {
      const r = await adminFetch(`/api/jobs/${id}`, secret, { method: 'PATCH', body: JSON.stringify({ is_open }) });
      setJobPostings((p) => p.map((j) => j.id === id ? r.job : j));
    } catch (e) { setError(e.message); }
  }

  async function deleteJobPosting(id) {
    try {
      await adminFetch(`/api/jobs/${id}`, secret, { method: 'DELETE' });
      setJobPostings((p) => p.filter((j) => j.id !== id));
    } catch (e) { setError(e.message); }
  }

  // ── HR: interviews ─────────────────────────────────────────
  async function scheduleInterview(applicationId) {
    try {
      const r = await adminFetch('/api/hiring/interviews', secret, {
        method: 'POST',
        body: JSON.stringify({ ...newInterview, application_id: applicationId }),
      });
      setInterviews((p) => [...p, r.interview]);
      setJobs((p) => p.map((j) => j.id === applicationId ? { ...j, status: 'interviewing' } : j));
      setScheduleFor(null);
      setNewInterview({ round:1, interview_type:'video', scheduled_at:'', duration_min:45, interviewer_name:'', meeting_link:'', notes:'' });
    } catch (e) { setError(e.message); }
  }

  async function setInterviewOutcome(id, outcome) {
    try {
      const r = await adminFetch(`/api/hiring/interviews/${id}`, secret, {
        method: 'PATCH', body: JSON.stringify({ outcome }),
      });
      setInterviews((p) => p.map((i) => i.id === id ? r.interview : i));
    } catch (e) { setError(e.message); }
  }

  // ── HR: offers ─────────────────────────────────────────────
  async function extendOffer(applicationId) {
    try {
      const r = await adminFetch(`/api/hiring/offer/${applicationId}`, secret, {
        method: 'POST', body: JSON.stringify(offerData),
      });
      setJobs((p) => p.map((j) => j.id === applicationId ? r.application : j));
      setOfferFor(null);
      setOfferData({ offer_salary:'', offer_date:'', offer_deadline:'', joining_date:'' });
    } catch (e) { setError(e.message); }
  }

  async function rejectWithReason(applicationId, reason) {
    try {
      await adminFetch(`/api/hiring/reject/${applicationId}`, secret, {
        method: 'POST', body: JSON.stringify({ rejection_reason: reason }),
      });
      setJobs((p) => p.map((j) => j.id === applicationId ? { ...j, status: 'rejected', rejection_reason: reason } : j));
    } catch (e) { setError(e.message); }
  }

  // ── professionals management ───────────────────────────────
  async function saveProfessional(id) {
    try {
      await adminFetch(`/api/professionals/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify(editProData),
      });
      setProfessionals((prev) => prev.map((p) => p.id === id ? { ...p, ...editProData } : p));
      setEditPro(null);
      setEditProData({});
    } catch (e) { setError(e.message); }
  }

  async function deactivateProfessional(id) {
    try {
      await adminFetch(`/api/professionals/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'rejected' }),
      });
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
      load('stats');
    } catch (e) { setError(e.message); }
  }

  async function assignProfessional(bookingId, professionalId) {
    try {
      await adminFetch(`/api/bookings/${bookingId}/assign`, secret, {
        method: 'POST',
        body: JSON.stringify({ professional_id: professionalId }),
      });
      setBookings((prev) => prev.map((b) => b.id === bookingId
        ? { ...b, professional_id: professionalId, status: 'confirmed' } : b));
      setAssignBooking(null);
    } catch (e) { setError(e.message); }
  }

  // ── prescriptions ───────────────────────────────────────────
  const RX_EMPTY_MED = { name: '', strength: '', dosage: '', frequency: '', duration: '', instructions: '' };
  const SITE_ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://serenest.in';

  function blankRxForm(booking) {
    return {
      patient_name: booking.patient_name || '',
      patient_age_gender: '',
      patient_contact: booking.patient_phone || '',
      professional_name: '',
      doctor_qualification: '',
      doctor_specialization: '',
      doctor_reg_no: '',
      doctor_contact: '',
      mode: booking.mode || '',
      chief_complaints: '',
      complaint_duration: '',
      history_summary: '',
      provisional_diagnosis: '',
      risk_assessment: '',
      medicines: [{ ...RX_EMPTY_MED }],
      advice: '',
      review_after: '',
      follow_up_date: '',
      emergency_advice: '',
      important_notes: '',
      clinic_name: 'Serenest Education Pvt Ltd',
      clinic_address: '',
      clinic_contact: '7777936367',
      clinic_website: 'https://serenest.in',
    };
  }

  function closePrescribe() {
    setPrescribeBooking(null);
    setRxForm(null);
    setRxPreview(false);
    setRxError(null);
    setRxSuccess(null);
    setRxMeta(null);
    setRxLoadingExisting(false);
  }

  function rxViewUrl(appointmentId) {
    return `${SITE_ORIGIN}/consultation/${appointmentId}/prescription`;
  }

  function rxWhatsAppShareUrl(booking) {
    const url = rxViewUrl(booking.id);
    const ref = String(booking.id).slice(0, 8).toUpperCase();
    const phone = String(booking.patient_phone || '').replace(/\D/g, '');
    const digits = phone.length === 10 ? `91${phone}` : phone;
    const text = `Hi ${booking.patient_name || ''}, your Serenest prescription is ready.\n\nView / print / save as PDF:\n${url}\n\nRef: ${ref}`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }

  async function openPrescribe(booking) {
    setPrescribeBooking(booking);
    setRxError(null);
    setRxSuccess(null);
    setRxPreview(false);
    setRxMeta(null);
    setRxForm(blankRxForm(booking));
    setRxLoadingExisting(true);
    try {
      const r = await adminFetch(`/api/prescriptions/${booking.id}`, secret);
      const existing = r.prescription;
      if (existing) {
        const meds = Array.isArray(existing.medicines) && existing.medicines.length
          ? existing.medicines.map((m) => ({ ...RX_EMPTY_MED, ...m }))
          : [{ ...RX_EMPTY_MED }];
        setRxForm({
          ...blankRxForm(booking),
          patient_name: existing.patient_name || booking.patient_name || '',
          patient_age_gender: existing.patient_age_gender || '',
          patient_contact: existing.patient_contact || booking.patient_phone || '',
          professional_name: existing.professional_name || '',
          doctor_qualification: existing.doctor_qualification || '',
          doctor_specialization: existing.doctor_specialization || '',
          doctor_reg_no: existing.doctor_reg_no || '',
          doctor_contact: existing.doctor_contact || '',
          mode: existing.mode || booking.mode || '',
          chief_complaints: existing.chief_complaints || '',
          complaint_duration: existing.complaint_duration || '',
          history_summary: existing.history_summary || '',
          provisional_diagnosis: existing.provisional_diagnosis || '',
          risk_assessment: existing.risk_assessment || '',
          medicines: meds,
          advice: existing.advice || '',
          review_after: existing.review_after || '',
          follow_up_date: existing.follow_up_date || '',
          emergency_advice: existing.emergency_advice || '',
          important_notes: existing.important_notes || '',
          clinic_name: existing.clinic_name || 'Serenest Education Pvt Ltd',
          clinic_address: existing.clinic_address || '',
          clinic_contact: existing.clinic_contact || '7777936367',
          clinic_website: existing.clinic_website || 'https://serenest.in',
        });
        setRxMeta({
          id: existing.id,
          is_locked: Boolean(existing.is_locked),
          locked_at: existing.locked_at || null,
        });
        if (existing.is_locked) {
          setRxSuccess(`Locked prescription loaded. Patient link: ${rxViewUrl(booking.id)}`);
        }
      }
    } catch (e) {
      // Non-fatal — start with a blank form if load fails
      console.warn('Could not load existing prescription', e.message);
    } finally {
      setRxLoadingExisting(false);
    }
  }

  function setRx(key, value) {
    setRxForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateRxMedicine(index, key, value) {
    setRxForm((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m, i) => (i === index ? { ...m, [key]: value } : m)),
    }));
  }

  function addRxMedicine() {
    setRxForm((prev) => ({ ...prev, medicines: [...prev.medicines, { ...RX_EMPTY_MED }] }));
  }

  function removeRxMedicine(index) {
    setRxForm((prev) => ({ ...prev, medicines: prev.medicines.filter((_, i) => i !== index) }));
  }

  function buildRxPayload() {
    const medicines = rxForm.medicines
      .map((m) => ({ ...m, name: (m.name || '').trim() }))
      .filter((m) => m.name);
    return {
      medicines,
      body: {
        ...rxForm,
        appointment_id: prescribeBooking.id,
        medicines,
        follow_up_date: rxForm.follow_up_date || null,
      },
    };
  }

  function applyRxResult(r, { sent } = {}) {
    if (r.prescription) {
      setRxMeta({
        id: r.prescription.id,
        is_locked: Boolean(r.prescription.is_locked),
        locked_at: r.prescription.locked_at || null,
      });
    }
    const link = rxViewUrl(prescribeBooking.id);
    if (r.send_error) {
      setRxError(null);
      setRxSuccess(`Prescription saved, but not emailed: ${r.send_error} Use WhatsApp link or fix email, then retry. Link: ${link}`);
      return;
    }
    setRxError(null);
    if (sent) {
      setRxSuccess(
        r.patient_email
          ? `Saved, locked, and emailed to ${r.patient_email}. Link: ${link}`
          : `Saved and locked. Link: ${link}`,
      );
    } else {
      setRxSuccess(`Prescription saved. Patient link: ${link}`);
    }
  }

  async function submitPrescription({ send = false } = {}) {
    setRxError(null);
    setRxSuccess(null);
    if (rxMeta?.is_locked && !send) {
      setRxError('This prescription is locked. Use Re-send or share the patient link.');
      return;
    }
    if (rxMeta?.is_locked && send) {
      // Re-send only — no edit
      setRxSending(true);
      try {
        const r = await adminFetch(`/api/prescriptions/${prescribeBooking.id}/send`, secret, {
          method: 'POST',
          body: '{}',
        });
        applyRxResult(r, { sent: true });
      } catch (e) {
        setRxError(e.message);
      } finally {
        setRxSending(false);
      }
      return;
    }

    const { medicines, body } = buildRxPayload();
    if (medicines.length === 0) {
      setRxError('Add at least one medicine.');
      return;
    }

    if (send) setRxSending(true);
    else setRxSaving(true);
    try {
      const r = await adminFetch('/api/prescriptions', secret, {
        method: 'POST',
        body: JSON.stringify({ ...body, send, lock: send }),
      });
      applyRxResult(r, { sent: Boolean(send && r.sent) });
      if (send && r.prescription?.is_locked) {
        setRxPreview(true);
      }
    } catch (e) {
      setRxError(e.message);
    } finally {
      setRxSaving(false);
      setRxSending(false);
    }
  }

  async function lockPrescription() {
    if (!rxMeta?.id) {
      setRxError('Save the prescription before locking.');
      return;
    }
    setRxSaving(true);
    setRxError(null);
    try {
      const r = await adminFetch(`/api/prescriptions/${rxMeta.id}/lock`, secret, {
        method: 'PATCH',
        body: '{}',
      });
      applyRxResult(r);
      setRxSuccess(`Prescription locked. Patient link: ${rxViewUrl(prescribeBooking.id)}`);
    } catch (e) {
      setRxError(e.message);
    } finally {
      setRxSaving(false);
    }
  }

  async function copyRxLink() {
    const url = rxViewUrl(prescribeBooking.id);
    try {
      await navigator.clipboard.writeText(url);
      setRxSuccess(`Link copied: ${url}`);
    } catch {
      setRxSuccess(`Patient link: ${url}`);
    }
  }

  // ── booking status update ──────────────────────────────────
  async function updateBookingStatus(id, status) {
    setBookingBusyId(id);
    try {
      await adminFetch(`/api/bookings/${id}/status`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      load('stats');
    } catch (e) {
      setError(e.message);
    } finally {
      setBookingBusyId(null);
    }
  }

  // ── delete booking ─────────────────────────────────────────
  async function deleteBooking(id) {
    setBookingBusyId(id);
    try {
      await adminFetch(`/api/bookings/${id}`, secret, { method: 'DELETE' });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      load('stats');
    } catch (e) {
      setError(e.message);
    } finally {
      setBookingBusyId(null);
    }
  }

  // ── CSV export helper ──────────────────────────────────────
  function downloadCsv(rows, filename) {
    const csv = rows.map((row) =>
      row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','),
    ).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = filename;
    a.click();
  }

  // ── contact messages ───────────────────────────────────────
  function markMessageRead(id) {
    setReadMsgIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('adm_read_msgs', JSON.stringify([...next]));
      return next;
    });
  }

  async function deleteMessage(id) {
    try {
      await adminFetch(`/api/contacts/${id}`, secret, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  // ── application status update ──────────────────────────────
  async function updateAppStatus(id, status) {
    try {
      await adminFetch(`/api/professionals/applications/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
      load('stats');
    } catch (e) {
      setError(e.message);
    }
  }

  // ── login screen ───────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-page admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-head">
            <div className="admin-login-mark">🛡</div>
            <h1>Admin Panel</h1>
            <p>Enter your admin secret to continue</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div>
              <label className="admin-field-label" htmlFor="admin-secret">Admin Secret</label>
              <input
                id="admin-secret"
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Your ADMIN_SECRET from .env"
                autoComplete="current-password"
                className={`admin-input ${authErr ? 'admin-input--error' : ''}`}
              />
              {authErr && <p className="admin-field-error">{authErr}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-full">Sign in</button>
          </form>

          <p className="admin-login-back">
            <Link to="/">← Back to website</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── dashboard ──────────────────────────────────────────────
  const activeTabLabel = TABS.find((t) => t.id === tab)?.label ?? 'Dashboard';

  return (
    <div className="admin-page admin-dashboard">
      <div className="admin-shell">
        {/* Mobile sidebar overlay backdrop */}
        {mobileSidebarOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside className={`admin-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-mark" aria-hidden="true">S</div>
            <div>
              <strong>Serenest</strong>
              <span className="admin-sidebar-env">Admin</span>
            </div>
            <button
              type="button"
              className="admin-sidebar-close"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close navigation"
            >✕</button>
          </div>

          <nav className="admin-nav" aria-label="Admin sections">
            {TAB_GROUPS.map((group) => (
              <div key={group.label ?? '_root'} className="admin-nav-group">
                {group.label && (
                  <p className="admin-nav-group-label">{group.label}</p>
                )}
                {group.items.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`admin-nav-item ${tab === t.id ? 'is-active' : ''}`}
                    onClick={() => { setTab(t.id); if (t.id !== 'overview') load(t.id); setMobileSidebarOpen(false); }}
                  >
                    <span className="admin-nav-label">{t.label}</span>
                    {t.id === 'bookings'      && stats?.pending_bookings     > 0 && <Pill n={stats.pending_bookings} />}
                    {t.id === 'professionals' && stats?.active_professionals > 0 && <Pill n={stats.active_professionals} color="#198754" />}
                    {t.id === 'applications'  && stats?.pending_applications > 0 && <Pill n={stats.pending_applications} />}
                    {t.id === 'hr'            && stats?.new_jobs             > 0 && <Pill n={stats.new_jobs} />}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button
              type="button"
              onClick={() => load(tab === 'overview' ? 'all' : tab)}
              disabled={loading}
              className="admin-footer-btn"
            >
              <span style={{ display: 'inline-block', transition: 'transform 0.5s', transform: loading ? 'rotate(360deg)' : 'none' }}>↻</span>
              {loading ? 'Refreshing…' : 'Refresh data'}
            </button>
            <button type="button" onClick={signOut} className="admin-footer-btn admin-footer-btn--signout">
              Sign out
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                className="admin-topbar-menu-btn"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open navigation"
              >☰</button>
              <div>
                <h1 className="admin-topbar-title">{TAB_ICONS[tab]} {activeTabLabel}</h1>
                <p className="admin-topbar-help">{TAB_HELP[tab]}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'none' }} id="adm-clock" />
              <button
                type="button"
                onClick={() => load(tab === 'overview' ? 'all' : tab)}
                disabled={loading}
                className="btn btn-ghost btn-sm admin-topbar-refresh"
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <span style={{ display: 'inline-block', transition: 'transform 0.5s', transform: loading ? 'rotate(360deg)' : 'none' }}>↻</span>
                {loading ? 'Loading…' : 'Refresh'}
              </button>
            </div>
          </header>

          <div className="admin-content" key={tab}>
            {healthIssues.length > 0 && (
              <div className="admin-alert" style={{ background: '#fffbeb', border: '1px solid #f59e0b', color: '#92400e' }}>
                <strong>⚠ Setup incomplete — you may be losing clients:</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: '1.2rem' }}>
                  {healthIssues.map((issue) => <li key={issue} style={{ marginTop: 4 }}>{issue}</li>)}
                </ul>
              </div>
            )}
            {error && (
              <div className="admin-alert">
                ⚠ {error}
              </div>
            )}

            {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--text)' }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <StatCard label="Total Bookings"      value={stats?.bookings}           sub={`${stats?.pending_bookings ?? 0} pending`} />
              <StatCard label="Active Professionals" value={stats?.active_professionals} sub="approved & onboarded" color="var(--brand-600)" />
              <StatCard label="Prof. Applications" value={stats?.applications}  sub={`${stats?.pending_applications ?? 0} pending`} color="var(--brand-700)" />
              <StatCard label="Job Applications"   value={stats?.jobs}          sub={`${stats?.new_jobs ?? 0} new`} color="#e67e22" />
              <StatCard label="Contact Messages"   value={stats?.messages}      color="#6f42c1" />
              <StatCard label="Waitlist Signups"   value={stats?.signups}       color="#0d6efd" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'bookings',      icon: '📅', label: 'Manage Bookings',        desc: 'View, confirm & assign appointments' },
                { id: 'professionals', icon: '🩺', label: 'Professionals',          desc: 'Manage psychiatrists, psychologists & therapists' },
                { id: 'applications',  icon: '👩‍⚕️', label: 'Applications',          desc: 'Approve or reject professional sign-ups' },
                { id: 'hr',            icon: '🧑‍💼', label: 'HR / Hiring',           desc: 'Review and manage job applications' },
                { id: 'messages',      icon: '💬', label: 'Contact Messages',       desc: 'Read enquiries from patients & orgs' },
                { id: 'screenings',    icon: '🧠', label: 'Screenings',             desc: 'PHQ-9 / GAD-7 exports & safety flags' },
                { id: 'signups',       icon: '📋', label: 'Waitlist',               desc: 'People who signed up before launch' },
                { id: 'website',       icon: '🌐', label: 'Website & pages',        desc: 'Every route — open, copy links, health check' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    if (item.id !== 'overview' && item.id !== 'website') load(item.id);
                  }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TRAFFIC ── */}
        {tab === 'traffic' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>Traffic</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: 760 }}>
              Anonymous web analytics — page views, where visitors came from, and device type.
              Visitors can’t be identified by name; for emails, see <strong>Subscribers</strong>,
              <strong> Bookings</strong>, or <strong>Messages</strong>.
            </p>

            {!traffic ? (
              <EmptyState icon="📈" text="No traffic data yet — visits appear here as people browse the site." />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                  <StatCard label="Today" value={traffic.totals?.today} sub={`${traffic.totals?.today_unique ?? 0} unique`} />
                  <StatCard label="Last 7 days" value={traffic.totals?.week} sub={`${traffic.totals?.week_unique ?? 0} unique`} color="var(--brand-600)" />
                  <StatCard label="Last 30 days" value={traffic.totals?.month} sub={`${traffic.totals?.month_unique ?? 0} unique`} color="var(--brand-700)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                  <TrafficList title="Top pages (7d)" rows={traffic.top_pages} />
                  <TrafficList title="Top referrers (7d)" rows={traffic.top_referrers} />
                  <TrafficList title="Devices (7d)" rows={traffic.devices} />
                </div>

                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 10 }}>Recent visits</h3>
                {(!traffic.recent || traffic.recent.length === 0) ? (
                  <EmptyState icon="🕘" text="No recent visits" />
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>{['Time', 'Page', 'Referrer', 'Device', 'Country'].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {traffic.recent.map((v, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={tdStyle}><small>{fmt(v.created_at)}</small></td>
                            <td style={tdStyle}><code style={{ fontSize: '0.8rem' }}>{v.path}</code></td>
                            <td style={tdStyle}><small>{v.referrer ? (() => { try { return new URL(v.referrer).hostname.replace(/^www\./, ''); } catch { return v.referrer; } })() : 'Direct'}</small></td>
                            <td style={tdStyle}>{v.device || '—'}</td>
                            <td style={tdStyle}>{v.country || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── WEBSITE (every public page) ── */}
        {tab === 'website' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>Website & pages</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 12, maxWidth: 800, lineHeight: 1.55 }}>
              QA every route on the <strong>live site</strong> from this browser origin, copy URLs for campaigns or support,
              and verify the backend health endpoint. Deep links (anchors) open the correct section after navigation.
            </p>
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: 14,
              padding: '10px 12px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 16px',
              alignItems: 'center',
            }}>
              <span>
                <strong style={{ color: 'var(--text)' }}>Origin:</strong>{' '}
                <code style={{ fontSize: '0.78rem' }}>{typeof window !== 'undefined' ? window.location.origin : ''}</code>
              </span>
              <span aria-hidden="true" style={{ opacity: 0.35 }}>|</span>
              <span>
                <strong style={{ color: 'var(--text)' }}>API base</strong> (<code>VITE_API_URL</code>):{' '}
                <code style={{ fontSize: '0.78rem' }}>{BASE || '(same origin)'}</code>
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              Serenest Academy lives at <code style={{ fontSize: '0.78rem' }}>/academy</code> — same
              deploy as Serenest clinical (no separate site / env var any more).
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '1.25rem', alignItems: 'center' }}>
              <input
                type="search"
                value={siteHubFilter}
                onChange={(e) => setSiteHubFilter(e.target.value)}
                placeholder="Filter by page name, path, or section…"
                aria-label="Filter site pages"
                style={{
                  flex: '1 1 220px',
                  maxWidth: 420,
                  padding: '0.58rem 0.72rem',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: '0.88rem',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <button type="button" className="btn btn-ghost btn-sm" onClick={pingApiHealth}>
                Ping /api/health
              </button>
              <a
                href={`${typeof window !== 'undefined' ? window.location.origin : ''}/`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
              >
                Open homepage ↗
              </a>
              <Link to="/screening" target="_blank" className="btn btn-ghost btn-sm">Screening ↗</Link>
              <Link to="/book" target="_blank" className="btn btn-ghost btn-sm">Book flow ↗</Link>
            </div>

            {healthProbe ? (
              <div style={{
                marginBottom: '1.25rem',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: healthProbe.error || healthProbe.httpOk === false ? '#fdecea' : 'var(--surface)',
                fontSize: '0.8rem',
                maxHeight: 220,
                overflow: 'auto',
              }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Health response</div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.76rem' }}>
                  {JSON.stringify(healthProbe, null, 2)}
                </pre>
              </div>
            ) : null}

            {filteredSiteHub.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                border: '1px dashed var(--border)',
                borderRadius: 12,
              }}>
                No pages match your filter.
              </div>
            ) : (
              filteredSiteHub.map((group) => (
                <div key={group.title} style={{ marginBottom: '1.75rem' }}>
                  <h3 style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    color: 'var(--text-muted)',
                    marginBottom: 12,
                  }}>
                    {group.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {group.pages.map((p) => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const fullUrl = p.external ? p.path : `${origin}${p.path}`;
                      const copyDone = siteCopied === fullUrl;
                      return (
                        <div
                          key={`${group.title}-${p.label}-${p.path}`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(140px, 1fr) minmax(200px, 2.2fr) auto',
                            gap: 12,
                            alignItems: 'center',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 10,
                            padding: '12px 14px',
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{p.label}</div>
                          <div style={{ minWidth: 0 }}>
                            <code style={{ fontSize: '0.78rem', wordBreak: 'break-word' }}>
                              {p.path}
                            </code>
                            {p.hint ? (
                              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.45 }}>
                                {p.hint}
                              </div>
                            ) : null}
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <a
                              href={fullUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-primary btn-sm"
                            >
                              Open ↗
                            </a>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => copySiteUrl(fullUrl)}
                            >
                              {copyDone ? 'Copied ✓' : 'Copy URL'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {tab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Bookings <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({bookings.length})</span></h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => downloadCsv(
                    [
                      ['Patient', 'Phone', 'Email', 'Type', 'Mode', 'Date', 'Time', 'Status', 'Paid', 'Amount', 'Created'],
                      ...bookings.map((b) => [b.patient_name, b.patient_phone, b.patient_email, b.practitioner_type, b.mode, b.preferred_date, b.preferred_time, b.status, b.payment_status, b.amount_paid, fmt(b.created_at)]),
                    ],
                    'serenest-bookings.csv',
                  )}
                  className="btn btn-ghost btn-sm"
                >
                  Export CSV
                </button>
                <Link to="/book" className="btn btn-primary btn-sm">+ New booking</Link>
              </div>
            </div>

            <div className="admin-filter-bar" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '0.75rem',
              marginBottom: '1rem',
              display: 'grid',
              gridTemplateColumns: '1.2fr auto',
              gap: 10,
            }}>
              <input
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search by patient name, phone, email, type, or mode"
                style={{
                  width: '100%',
                  padding: '0.58rem 0.72rem',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: '0.86rem',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setBookingFilter(s)}
                    style={{
                      border: 'none',
                      borderRadius: 99,
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: bookingFilter === s ? 'var(--brand-500)' : 'var(--bg-subtle, #f5f7f9)',
                      color: bookingFilter === s ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {s === 'all' ? 'All statuses' : s}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const q = bookingSearch.trim().toLowerCase();
              const filteredBookings = bookings.filter((b) => {
                const statusOk = bookingFilter === 'all' ? true : b.status === bookingFilter;
                if (!statusOk) return false;
                if (!q) return true;
                const hay = [
                  b.patient_name, b.patient_phone, b.patient_email,
                  b.practitioner_type, b.mode, b.preferred_time,
                ]
                  .filter(Boolean)
                  .join(' ')
                  .toLowerCase();
                return hay.includes(q);
              });

              return filteredBookings.length === 0 ? (
              <EmptyState
                icon="📅"
                text={bookings.length === 0 ? 'No bookings yet' : 'No bookings match your search or filter'}
              />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {['Patient', 'Type', 'Mode', 'Date', 'Status', 'Actions'].map((h) => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>
                          <strong>{b.patient_name}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>{b.patient_phone}{b.patient_email ? ` · ${b.patient_email}` : ''}</small><br />
                          <small style={{ color: 'var(--text-muted)' }}>{fmt(b.created_at)}</small>
                        </td>
                        <td style={tdStyle}>{b.practitioner_type}</td>
                        <td style={tdStyle}>{b.mode}</td>
                        <td style={tdStyle}>{fmtDate(b.preferred_date)}<br /><small>{b.preferred_time}</small></td>
                        <td style={tdStyle}>
                          <Badge status={b.status} />
                          {b.payment_status === 'paid' && (
                            <span style={{ display: 'inline-block', marginTop: 4, background: '#d1e7dd', color: '#0a3622', padding: '1px 8px', borderRadius: 99, fontSize: '0.68rem', fontWeight: 700 }}>
                              ✓ Paid{b.amount_paid ? ` ₹${b.amount_paid}` : ''}
                            </span>
                          )}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {b.status === 'pending'   && <ActionBtn label={bookingBusyId === b.id ? 'Updating…' : 'Confirm'}  onClick={() => updateBookingStatus(b.id, 'confirmed')}  color="#198754" disabled={bookingBusyId === b.id} />}
                            {b.status !== 'completed' && b.status !== 'cancelled' && <ActionBtn label={bookingBusyId === b.id ? 'Updating…' : 'Complete'} onClick={() => updateBookingStatus(b.id, 'completed')} color="#0d6efd" disabled={bookingBusyId === b.id} />}
                            {b.status !== 'cancelled' && <ActionBtn label={bookingBusyId === b.id ? 'Updating…' : 'Cancel'}   onClick={() => updateBookingStatus(b.id, 'cancelled')}  color="#dc3545" disabled={bookingBusyId === b.id} />}
                            {b.status === 'confirmed' && (
                              <Link to={`/consultation/${b.id}?mode=${b.mode}`} target="_blank" className="btn btn-sm btn-ghost" style={{ fontSize: '0.75rem' }}>
                                🎥 Room
                              </Link>
                            )}
                            {(b.status === 'confirmed' || b.status === 'completed') && (
                              <ActionBtn label="📋 Issue Rx" onClick={() => openPrescribe(b)} color="#6f42c1" />
                            )}
                            <ActionBtn
                              label="🗑"
                              onClick={() => { if (window.confirm(`Delete booking for ${b.patient_name}? This cannot be undone.`)) deleteBooking(b.id); }}
                              color="#6c757d"
                              disabled={bookingBusyId === b.id}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              );
            })()}

            {/* ── Issue prescription modal ── */}
            {prescribeBooking && rxForm && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '1.5rem 1rem', overflowY: 'auto' }}>
                <div style={{ background: 'var(--surface)', borderRadius: 14, padding: '1.5rem', maxWidth: rxPreview ? 880 : 600, width: '100%', maxHeight: '92vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, gap: 8 }}>
                    <h3 style={{ fontWeight: 800, margin: 0 }}>
                      {rxMeta?.is_locked ? 'Prescription (locked)' : rxMeta?.id ? 'Edit prescription' : 'Issue prescription'}
                    </h3>
                    <button onClick={() => setRxPreview((v) => !v)} className="btn btn-ghost btn-sm">
                      {rxPreview ? '← Edit' : '👁 Preview'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    For: <strong>{prescribeBooking.patient_name}</strong> — {prescribeBooking.practitioner_type} · {fmtDate(prescribeBooking.preferred_date)}
                    {prescribeBooking.patient_email ? (
                      <> · <span style={{ color: 'var(--text)' }}>{prescribeBooking.patient_email}</span></>
                    ) : (
                      <> · <span style={{ color: '#b45309' }}>no email on booking</span></>
                    )}
                  </p>
                  {rxLoadingExisting && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Loading existing prescription…</p>
                  )}
                  {rxMeta?.is_locked && (
                    <p style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#92400e', padding: '8px 10px', borderRadius: 8, marginBottom: '0.75rem' }}>
                      This prescription is locked and cannot be edited. You can still re-send the email or share the patient link.
                    </p>
                  )}

                  {rxPreview ? (
                    <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                      <PrescriptionDocument prescription={{
                        ...rxForm,
                        appointment_id: prescribeBooking.id,
                        created_at: new Date().toISOString(),
                      }} />
                    </div>
                  ) : (
                    <fieldset disabled={rxMeta?.is_locked} style={{ border: 0, margin: 0, padding: 0, minWidth: 0, opacity: rxMeta?.is_locked ? 0.72 : 1 }}>
                      <RxGroup title="Patient details" />
                      <div style={rxGridStyle}>
                        <RxField label="Name" value={rxForm.patient_name} onChange={(v) => setRx('patient_name', v)} />
                        <RxField label="Age / Gender" value={rxForm.patient_age_gender} onChange={(v) => setRx('patient_age_gender', v)} placeholder="32 / Male" />
                        <RxField label="Contact" value={rxForm.patient_contact} onChange={(v) => setRx('patient_contact', v)} />
                        <RxField label="Mode" value={rxForm.mode} onChange={(v) => setRx('mode', v)} placeholder="video / audio / chat" />
                      </div>

                      <RxGroup title="Doctor details" />
                      <div style={rxGridStyle}>
                        <RxField label="Doctor name" value={rxForm.professional_name} onChange={(v) => setRx('professional_name', v)} placeholder="Dr. …" />
                        <RxField label="Qualification" value={rxForm.doctor_qualification} onChange={(v) => setRx('doctor_qualification', v)} placeholder="MBBS, MD" />
                        <RxField label="Specialization" value={rxForm.doctor_specialization} onChange={(v) => setRx('doctor_specialization', v)} placeholder="Psychiatry" />
                        <RxField label="Reg. No (Medical Council)" value={rxForm.doctor_reg_no} onChange={(v) => setRx('doctor_reg_no', v)} />
                        <RxField label="Doctor contact" value={rxForm.doctor_contact} onChange={(v) => setRx('doctor_contact', v)} />
                      </div>

                      <RxGroup title="Clinical summary" />
                      <div style={rxGridStyle}>
                        <RxField label="Chief complaints" value={rxForm.chief_complaints} onChange={(v) => setRx('chief_complaints', v)} wide />
                        <RxField label="Duration" value={rxForm.complaint_duration} onChange={(v) => setRx('complaint_duration', v)} />
                        <RxField label="Provisional diagnosis" value={rxForm.provisional_diagnosis} onChange={(v) => setRx('provisional_diagnosis', v)} />
                        <RxArea label="History / summary" value={rxForm.history_summary} onChange={(v) => setRx('history_summary', v)} />
                        <RxArea label="Risk assessment" value={rxForm.risk_assessment} onChange={(v) => setRx('risk_assessment', v)} />
                      </div>

                      <RxGroup title="Medications" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '0.75rem' }}>
                        {rxForm.medicines.map((m, i) => (
                          <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 6, marginBottom: 6 }}>
                              <input value={m.name} onChange={(e) => updateRxMedicine(i, 'name', e.target.value)} placeholder="Medicine" style={rxMedInputStyle} />
                              <input value={m.strength} onChange={(e) => updateRxMedicine(i, 'strength', e.target.value)} placeholder="Strength" style={rxMedInputStyle} />
                              <input value={m.dosage} onChange={(e) => updateRxMedicine(i, 'dosage', e.target.value)} placeholder="Dose" style={rxMedInputStyle} />
                              <input value={m.frequency} onChange={(e) => updateRxMedicine(i, 'frequency', e.target.value)} placeholder="Frequency" style={rxMedInputStyle} />
                              <input value={m.duration} onChange={(e) => updateRxMedicine(i, 'duration', e.target.value)} placeholder="Duration" style={rxMedInputStyle} />
                              <button type="button" onClick={() => removeRxMedicine(i)} className="btn btn-sm btn-ghost" style={{ color: '#dc3545' }}>✕</button>
                            </div>
                            <input value={m.instructions} onChange={(e) => updateRxMedicine(i, 'instructions', e.target.value)} placeholder="Instructions (e.g. after food)"
                              style={{ ...rxMedInputStyle, width: '100%', boxSizing: 'border-box' }} />
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addRxMedicine} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>+ Add medicine</button>

                      <RxGroup title="Advice & follow-up" />
                      <div style={rxGridStyle}>
                        <RxArea label="Advice (one per line)" value={rxForm.advice} onChange={(v) => setRx('advice', v)} wide rows={3} />
                        <RxField label="Review after" value={rxForm.review_after} onChange={(v) => setRx('review_after', v)} placeholder="2 weeks" />
                        <RxField label="Follow-up date" type="date" value={rxForm.follow_up_date} onChange={(v) => setRx('follow_up_date', v)} />
                        <RxArea label="Emergency advice (one per line)" value={rxForm.emergency_advice} onChange={(v) => setRx('emergency_advice', v)} wide />
                        <RxArea label="Important (one per line)" value={rxForm.important_notes} onChange={(v) => setRx('important_notes', v)} wide />
                      </div>

                      <RxGroup title="Issued by (optional — defaults applied)" />
                      <div style={rxGridStyle}>
                        <RxField label="Clinic / organization" value={rxForm.clinic_name} onChange={(v) => setRx('clinic_name', v)} placeholder="Serenest Education Pvt Ltd" />
                        <RxField label="Address" value={rxForm.clinic_address} onChange={(v) => setRx('clinic_address', v)} />
                        <RxField label="Contact" value={rxForm.clinic_contact} onChange={(v) => setRx('clinic_contact', v)} placeholder="7777936367" />
                        <RxField label="Website / email" value={rxForm.clinic_website} onChange={(v) => setRx('clinic_website', v)} />
                      </div>
                    </fieldset>
                  )}

                  {rxError && <p style={{ color: '#dc3545', fontSize: '0.82rem', margin: '0.75rem 0' }}>{rxError}</p>}
                  {rxSuccess && (
                    <div style={{ background: '#d1e7dd', color: '#0a3622', fontSize: '0.82rem', padding: '10px 12px', borderRadius: 8, margin: '0.75rem 0', lineHeight: 1.45 }}>
                      {rxSuccess}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1rem' }}>
                    {!rxMeta?.is_locked && (
                      <button onClick={() => submitPrescription({ send: false })} disabled={rxSaving || rxSending || rxLoadingExisting} className="btn btn-primary btn-sm">
                        {rxSaving ? 'Saving…' : 'Save prescription'}
                      </button>
                    )}
                    <button
                      onClick={() => submitPrescription({ send: true })}
                      disabled={rxSaving || rxSending || rxLoadingExisting || (!rxMeta?.is_locked && !prescribeBooking.patient_email)}
                      className="btn btn-sm"
                      style={{ background: '#0f766e', color: '#fff', border: 'none' }}
                      title={!prescribeBooking.patient_email ? 'Booking has no patient email — use WhatsApp share' : 'Save, email patient, and lock'}
                    >
                      {rxSending
                        ? 'Sending…'
                        : rxMeta?.is_locked
                          ? 'Re-send email'
                          : 'Save & send to patient'}
                    </button>
                    <a
                      href={rxWhatsAppShareUrl(prescribeBooking)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-ghost"
                      style={{ textDecoration: 'none' }}
                    >
                      WhatsApp link
                    </a>
                    <button type="button" onClick={copyRxLink} className="btn btn-ghost btn-sm">Copy link</button>
                    {!rxMeta?.is_locked && rxMeta?.id && (
                      <button type="button" onClick={lockPrescription} disabled={rxSaving || rxSending} className="btn btn-ghost btn-sm">
                        Lock only
                      </button>
                    )}
                    <a
                      href={rxViewUrl(prescribeBooking.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ textDecoration: 'none' }}
                    >
                      Open patient view
                    </a>
                    <button onClick={closePrescribe} className="btn btn-ghost btn-sm">Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROFESSIONALS ── */}
        {tab === 'professionals' && (() => {
          const filtered = proFilter === 'all'
            ? professionals
            : professionals.filter((p) => p.role === proFilter);

          return (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                  Active Professionals <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({filtered.length})</span>
                </h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['all', 'psychiatrist', 'psychologist', 'therapist', 'counsellor'].map((r) => (
                    <button key={r} onClick={() => setProFilter(r)}
                      style={{
                        padding: '4px 12px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: proFilter === r ? (ROLE_COLORS[r] ?? 'var(--brand-500)') : 'var(--surface)',
                        color: proFilter === r ? '#fff' : 'var(--text)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      }}
                    >
                      {r === 'all' ? 'All' : ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role breakdown pills */}
              {professionals.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {Object.entries(ROLE_LABELS).map(([role, label]) => {
                    const count = professionals.filter((p) => p.role === role).length;
                    if (!count) return null;
                    return (
                      <span key={role} style={{ padding: '4px 12px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700, background: (ROLE_COLORS[role] ?? '#888') + '18', color: ROLE_COLORS[role] ?? '#888' }}>
                        {label}: {count}
                      </span>
                    );
                  })}
                </div>
              )}

              {filtered.length === 0 ? (
                <EmptyState icon="🩺" text={professionals.length === 0 ? 'No approved professionals yet — approve applications first' : `No ${proFilter}s found`} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                  {filtered.map((p) => {
                    const isEditing = editPro === p.id;
                    const bookingList = Array.isArray(p.appointments) ? p.appointments : [];
                    const activeCount = bookingList.filter((b) => b.status === 'confirmed').length;
                    const totalCount  = bookingList.length;

                    return (
                      <div key={p.id} style={{
                        background: 'var(--surface)',
                        border: `1px solid ${isEditing ? 'var(--brand-500)' : 'var(--border)'}`,
                        borderRadius: 12,
                        padding: '1.25rem',
                        display: 'flex', flexDirection: 'column', gap: 10,
                        transition: 'border-color 0.2s',
                      }}>
                        {/* Name + role */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{p.full_name}</div>
                            <span style={{
                              display: 'inline-block', marginTop: 3,
                              padding: '2px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
                              background: (ROLE_COLORS[p.role] ?? '#888') + '18',
                              color: ROLE_COLORS[p.role] ?? '#888',
                            }}>{ROLE_LABELS[p.role] ?? p.role}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeCount} active · {totalCount} total sessions</span>
                          </div>
                        </div>

                        {/* Contact + location */}
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                          {p.phone && <span>📞 {p.phone}</span>}
                          {p.email && <span>✉ {p.email}</span>}
                          {p.city  && <span>📍 {p.city}</span>}
                          {p.clinic && <span>🏥 {p.clinic}</span>}
                        </div>

                        {/* Details grid */}
                        {!isEditing ? (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '0.82rem' }}>
                            <InfoRow label="Fee"          value={p.fee_inr ? `₹${p.fee_inr} / ${p.duration_min ?? 50} min` : '—'} />
                            <InfoRow label="Languages"    value={p.languages || '—'} />
                            <InfoRow label="Modes"        value={p.modes || '—'} />
                            <InfoRow label="Availability" value={p.availability || '—'} />
                            {p.specialities && <InfoRow label="Specialities" value={p.specialities} style={{ gridColumn: '1/-1' }} />}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                              { key: 'fee_inr',      label: 'Fee (INR)',    placeholder: '1500' },
                              { key: 'duration_min', label: 'Session (min)', placeholder: '50' },
                              { key: 'languages',    label: 'Languages',   placeholder: 'English, Hindi' },
                              { key: 'modes',        label: 'Modes',       placeholder: 'video, audio, chat' },
                              { key: 'availability', label: 'Availability', placeholder: 'Mon-Fri 9am-6pm' },
                              { key: 'specialities', label: 'Specialities', placeholder: 'Anxiety, Depression' },
                              { key: 'city',         label: 'City',        placeholder: 'Mumbai' },
                              { key: 'clinic',       label: 'Clinic',      placeholder: 'Clinic name' },
                            ].map(({ key, label, placeholder }) => (
                              <div key={key}>
                                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 3 }}>{label}</label>
                                <input
                                  value={editProData[key] !== undefined ? editProData[key] : (p[key] ?? '')}
                                  onChange={(e) => setEditProData((prev) => ({ ...prev, [key]: e.target.value }))}
                                  placeholder={placeholder}
                                  style={{ width: '100%', padding: '5px 8px', fontSize: '0.85rem', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text)', boxSizing: 'border-box' }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                          {!isEditing ? (
                            <>
                              <ActionBtn label="Edit Profile" onClick={() => { setEditPro(p.id); setEditProData({}); }} color="var(--brand-600)" />
                              <ActionBtn label="Assign to Booking" onClick={() => setAssignBooking(p)} color="#0d6efd" />
                              <ActionBtn label="Deactivate" onClick={() => { if (window.confirm(`Deactivate ${p.full_name}?`)) deactivateProfessional(p.id); }} color="#dc3545" />
                            </>
                          ) : (
                            <>
                              <button onClick={() => saveProfessional(p.id)} className="btn btn-primary btn-sm">Save changes</button>
                              <button onClick={() => { setEditPro(null); setEditProData({}); }} className="btn btn-ghost btn-sm">Cancel</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Assign to booking modal */}
              {assignBooking && (
                <div style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
                }}>
                  <div style={{ background: 'var(--surface)', borderRadius: 14, padding: '1.5rem', maxWidth: 480, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                    <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Assign {assignBooking.full_name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Select a pending booking to assign this professional to:</p>
                    {bookings.filter((b) => b.status === 'pending').length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No pending bookings to assign.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {bookings.filter((b) => b.status === 'pending').map((b) => (
                          <button key={b.id} onClick={() => assignProfessional(b.id, assignBooking.id)} style={{
                            background: 'var(--bg)', border: '1px solid var(--border)',
                            borderRadius: 8, padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                            transition: 'border-color 0.15s',
                          }}>
                            <strong>{b.patient_name}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>{b.practitioner_type} · {b.mode} · {fmtDate(b.preferred_date)} {b.preferred_time}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setAssignBooking(null)} className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }}>Close</button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── APPLICATIONS ── */}
        {tab === 'applications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Professional Applications <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({apps.length})</span></h2>
              <Link to="/professionals/apply" className="btn btn-primary btn-sm">+ Add application</Link>
            </div>

            {apps.length === 0 ? (
              <EmptyState icon="👩‍⚕️" text="No applications yet" />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {['Applicant', 'Role', 'City', 'Fee', 'Languages', 'Status', 'Actions'].map((h) => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>
                          <strong>{a.full_name}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>{a.phone}{a.email ? ` · ${a.email}` : ''}</small><br />
                          <small style={{ color: 'var(--text-muted)' }}>{fmt(a.created_at)}</small>
                        </td>
                        <td style={tdStyle}>{a.role_label ?? a.role}</td>
                        <td style={tdStyle}>{a.city || '—'}</td>
                        <td style={tdStyle}>₹{a.fee_inr || '—'}<br /><small>{a.duration_min ? `${a.duration_min} min` : ''}</small></td>
                        <td style={tdStyle}>{a.languages || '—'}</td>
                        <td style={tdStyle}><Badge status={a.status} /></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {a.status !== 'approved' && <ActionBtn label="Approve" onClick={() => updateAppStatus(a.id, 'approved')} color="#198754" />}
                            {a.status !== 'rejected' && <ActionBtn label="Reject"  onClick={() => updateAppStatus(a.id, 'rejected')} color="#dc3545" />}
                            {a.status !== 'pending'  && <ActionBtn label="Reset"   onClick={() => updateAppStatus(a.id, 'pending')}  color="#6c757d" />}
                            {a.status === 'approved' && a.phone && (() => {
                              const phone = String(a.phone).replace(/\D/g, '');
                              const fullPhone = phone.length === 10 ? `91${phone}` : phone;
                              const name = (a.full_name || '').split(' ')[0];
                              const role = a.role_label ?? a.role ?? 'professional';
                              const msg = `Hi ${name}! You've been approved as a ${role} on Serenest.\n\nJoin our professional community here: ${WA_CHANNEL}\n\nWelcome aboard! We'll be in touch with next steps.\n— Serenest Team`;
                              return (
                                <a
                                  href={`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    borderRadius: 6,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: '#25d366',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  WA Welcome
                                </a>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── HR / HIRING ── */}
        {tab === 'hr' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem' }}>HR / Hiring</h2>

            {/* HR sub-tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
              {[
                { id: 'applications', label: `Applications (${jobs.length})` },
                { id: 'postings',     label: `Job Postings (${jobPostings.length})` },
                { id: 'interviews',   label: `Interviews (${interviews.length})` },
              ].map((st) => (
                <button key={st.id} onClick={() => setHrTab(st.id)} style={{
                  padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.88rem', fontWeight: hrTab === st.id ? 700 : 500,
                  color: hrTab === st.id ? 'var(--brand-600)' : 'var(--text-muted)',
                  borderBottom: hrTab === st.id ? '2px solid var(--brand-500)' : '2px solid transparent',
                  marginBottom: -2, transition: 'all 0.15s',
                }}>{st.label}</button>
              ))}
            </div>

            {/* ── SUB: APPLICATIONS ── */}
            {hrTab === 'applications' && (
              <div>
                {/* Pipeline funnel */}
                {jobs.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {[
                      { s:'new', c:'#0d6efd' }, { s:'reviewing', c:'#6f42c1' },
                      { s:'shortlisted', c:'#e67e22' }, { s:'interviewing', c:'#fd7e14' },
                      { s:'hired', c:'#198754' }, { s:'rejected', c:'#dc3545' },
                    ].map(({ s, c }) => {
                      const count = jobs.filter((j) => j.status === s).length;
                      if (!count) return null;
                      return (
                        <span key={s} style={{ padding: '4px 14px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700, background: c + '18', color: c }}>
                          {s}: {count}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                  <button onClick={() => {
                    const csv = ['Name,Email,Phone,Department,Role,Status,Applied', ...jobs.map((j) => `"${j.full_name}","${j.email}","${j.phone ?? ''}","${j.department}","${j.role}","${j.status}","${fmtDate(j.created_at)}"`)] .join('\n');
                    const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv); a.download = 'applications.csv'; a.click();
                  }} className="btn btn-ghost btn-sm">Export CSV</button>
                </div>

                {jobs.length === 0 ? <EmptyState icon="🧑‍💼" text="No job applications yet" /> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {jobs.map((j) => {
                      const appInterviews = interviews.filter((i) => i.application_id === j.id);
                      return (
                        <div key={j.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'1.25rem 1.5rem' }}>
                          {/* Header */}
                          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:8 }}>
                            <div>
                              <strong style={{ fontSize:'1rem' }}>{j.full_name}</strong>
                              <span style={{ marginLeft:10, fontSize:'0.82rem', color:'var(--text-muted)' }}>{j.email}</span>
                              {j.phone && <span style={{ marginLeft:8, fontSize:'0.82rem', color:'var(--text-muted)' }}>{j.phone}</span>}
                              {j.city  && <span style={{ marginLeft:8, fontSize:'0.82rem', color:'var(--text-muted)' }}>📍 {j.city}</span>}
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <Badge status={j.status} />
                              <small style={{ color:'var(--text-muted)' }}>{fmt(j.created_at)}</small>
                            </div>
                          </div>

                          {/* Role + links */}
                          <div style={{ marginBottom:8, fontSize:'0.88rem' }}>
                            <span style={{ fontWeight:700, color:'var(--brand-600)' }}>{j.department}</span>
                            <span style={{ color:'var(--text-muted)', margin:'0 6px' }}>›</span>
                            <span>{j.role}</span>
                            {j.linkedin_url  && <a href={j.linkedin_url}  target="_blank" rel="noreferrer" style={{ marginLeft:12, color:'#0077b5', fontSize:'0.82rem' }}>LinkedIn ↗</a>}
                            {j.portfolio_url && <a href={j.portfolio_url} target="_blank" rel="noreferrer" style={{ marginLeft:8, color:'var(--brand-600)', fontSize:'0.82rem' }}>Portfolio ↗</a>}
                            {j.resume_url    && <a href={j.resume_url}    target="_blank" rel="noreferrer" style={{ marginLeft:8, color:'#6f42c1', fontSize:'0.82rem' }}>Resume ↗</a>}
                          </div>

                          {j.cover_note && <p style={{ margin:'0 0 10px', fontSize:'0.85rem', lineHeight:1.6, background:'var(--bg-subtle,#f8f9fa)', borderRadius:6, padding:'8px 10px' }}>{j.cover_note}</p>}

                          {/* Interviews for this applicant */}
                          {appInterviews.length > 0 && (
                            <div style={{ margin:'8px 0', padding:'8px 12px', background:'var(--bg-subtle,#f8f9fa)', borderRadius:8 }}>
                              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:6 }}>Interviews</div>
                              {appInterviews.map((iv) => (
                                <div key={iv.id} style={{ fontSize:'0.82rem', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:4 }}>
                                  <span>Round {iv.round} · {iv.interview_type}</span>
                                  <span style={{ color:'var(--text-muted)' }}>{fmt(iv.scheduled_at)}</span>
                                  {iv.interviewer_name && <span>👤 {iv.interviewer_name}</span>}
                                  {iv.meeting_link && <a href={iv.meeting_link} target="_blank" rel="noreferrer" style={{ color:'var(--brand-600)', fontSize:'0.8rem' }}>Join ↗</a>}
                                  <Badge status={iv.outcome} />
                                  {iv.outcome === 'pending' && (
                                    <div style={{ display:'flex', gap:4 }}>
                                      <ActionBtn label="Pass"    onClick={() => setInterviewOutcome(iv.id, 'pass')}    color="#198754" />
                                      <ActionBtn label="Fail"    onClick={() => setInterviewOutcome(iv.id, 'fail')}    color="#dc3545" />
                                      <ActionBtn label="No-show" onClick={() => setInterviewOutcome(iv.id, 'no_show')} color="#6c757d" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Offer details */}
                          {j.offer_salary && (
                            <div style={{ margin:'8px 0', padding:'8px 12px', background:'#d1e7dd', borderRadius:8, fontSize:'0.85rem' }}>
                              💼 Offer: <strong>{j.offer_salary}</strong>
                              {j.offer_deadline && <span style={{ marginLeft:8, color:'#0a3622' }}>Deadline: {fmtDate(j.offer_deadline)}</span>}
                              {j.joining_date   && <span style={{ marginLeft:8, color:'#0a3622' }}>Joining: {fmtDate(j.joining_date)}</span>}
                              {j.offer_accepted === true  && <span style={{ marginLeft:8, fontWeight:700, color:'#198754' }}>✓ Accepted</span>}
                              {j.offer_accepted === false && <span style={{ marginLeft:8, fontWeight:700, color:'#dc3545' }}>✗ Declined</span>}
                            </div>
                          )}

                          {/* HR notes */}
                          <div style={{ marginBottom:10, marginTop:8 }}>
                            <div style={{ display:'flex', gap:6 }}>
                              <input
                                value={noteEdit[j.id] !== undefined ? noteEdit[j.id] : (j.hr_notes ?? '')}
                                onChange={(e) => setNoteEdit((p) => ({ ...p, [j.id]: e.target.value }))}
                                placeholder="HR notes…"
                                style={{ flex:1, padding:'6px 10px', fontSize:'0.85rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)' }}
                              />
                              {noteEdit[j.id] !== undefined && <button onClick={() => saveJobNote(j.id)} className="btn btn-sm btn-primary">Save</button>}
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {j.status !== 'reviewing'   && <ActionBtn label="Reviewing"   onClick={() => updateJobStatus(j.id,'reviewing')}   color="#6f42c1" />}
                            {j.status !== 'shortlisted' && <ActionBtn label="Shortlist"   onClick={() => updateJobStatus(j.id,'shortlisted')} color="#e67e22" />}
                            <ActionBtn label="+ Interview" onClick={() => setScheduleFor(j)} color="#fd7e14" />
                            {j.status !== 'hired' && !j.offer_salary && <ActionBtn label="Extend Offer" onClick={() => setOfferFor(j)} color="#198754" />}
                            {j.status !== 'rejected' && <ActionBtn label="Reject" onClick={() => { const r = prompt('Rejection reason (optional):'); rejectWithReason(j.id, r ?? ''); }} color="#dc3545" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── SUB: JOB POSTINGS ── */}
            {hrTab === 'postings' && (
              <div>
                <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
                  <button onClick={() => setShowNewJob(true)} className="btn btn-primary btn-sm">+ New Job Posting</button>
                </div>

                {/* Create form */}
                {showNewJob && (
                  <div style={{ background:'var(--surface)', border:'2px solid var(--brand-500)', borderRadius:12, padding:'1.5rem', marginBottom:'1.5rem' }}>
                    <h3 style={{ fontWeight:800, marginBottom:'1rem' }}>Create Job Posting</h3>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                      {[
                        { k:'title',        label:'Job Title *',     ph:'e.g. Frontend Engineer' },
                        { k:'department',   label:'Department *',    ph:'e.g. Technology' },
                        { k:'location',     label:'Location',        ph:'Remote / Mumbai / Hybrid' },
                        { k:'salary_range', label:'Salary Range',    ph:'e.g. ₹8–12 LPA' },
                      ].map(({ k, label, ph }) => (
                        <div key={k}>
                          <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>{label}</label>
                          <input value={newJob[k]} onChange={(e) => setNewJob((p) => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                            style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' }} />
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Type</label>
                        <select value={newJob.type} onChange={(e) => setNewJob((p) => ({ ...p, type: e.target.value }))}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)' }}>
                          <option value="full_time">Full-time</option>
                          <option value="part_time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                      <div style={{ gridColumn:'1/-1' }}>
                        <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Description</label>
                        <textarea value={newJob.description} onChange={(e) => setNewJob((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Role overview…"
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', resize:'vertical', boxSizing:'border-box' }} />
                      </div>
                      <div style={{ gridColumn:'1/-1' }}>
                        <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Requirements</label>
                        <textarea value={newJob.requirements} onChange={(e) => setNewJob((p) => ({ ...p, requirements: e.target.value }))} rows={3} placeholder="Skills and experience needed…"
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', resize:'vertical', boxSizing:'border-box' }} />
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, marginTop:'1rem' }}>
                      <button onClick={createJobPosting} className="btn btn-primary btn-sm">Publish</button>
                      <button onClick={() => setShowNewJob(false)} className="btn btn-ghost btn-sm">Cancel</button>
                    </div>
                  </div>
                )}

                {jobPostings.length === 0 ? <EmptyState icon="📋" text="No job postings yet" /> : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                    {jobPostings.map((jp) => (
                      <div key={jp.id} style={{ background:'var(--surface)', border:`1px solid ${jp.is_open ? 'var(--border)' : '#dee2e6'}`, borderRadius:10, padding:'1rem 1.25rem', opacity: jp.is_open ? 1 : 0.65 }}>
                        {editJob === jp.id ? (
                          <div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.75rem' }}>
                              {[
                                { k:'title', label:'Title' }, { k:'department', label:'Department' },
                                { k:'location', label:'Location' }, { k:'salary_range', label:'Salary Range' },
                              ].map(({ k, label }) => (
                                <div key={k}>
                                  <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:2 }}>{label}</label>
                                  <input value={editJobData[k] !== undefined ? editJobData[k] : (jp[k] ?? '')}
                                    onChange={(e) => setEditJobData((p) => ({ ...p, [k]: e.target.value }))}
                                    style={{ width:'100%', padding:'5px 8px', fontSize:'0.85rem', border:'1px solid var(--border)', borderRadius:5, background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' }} />
                                </div>
                              ))}
                              {['description','requirements'].map((k) => (
                                <div key={k} style={{ gridColumn:'1/-1' }}>
                                  <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:2 }}>{k}</label>
                                  <textarea value={editJobData[k] !== undefined ? editJobData[k] : (jp[k] ?? '')}
                                    onChange={(e) => setEditJobData((p) => ({ ...p, [k]: e.target.value }))} rows={3}
                                    style={{ width:'100%', padding:'5px 8px', fontSize:'0.85rem', border:'1px solid var(--border)', borderRadius:5, background:'var(--bg)', color:'var(--text)', resize:'vertical', boxSizing:'border-box' }} />
                                </div>
                              ))}
                            </div>
                            <div style={{ display:'flex', gap:6 }}>
                              <button onClick={() => saveJobPosting(jp.id)} className="btn btn-primary btn-sm">Save</button>
                              <button onClick={() => { setEditJob(null); setEditJobData({}); }} className="btn btn-ghost btn-sm">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:6 }}>
                              <div>
                                <strong style={{ fontSize:'1rem' }}>{jp.title}</strong>
                                <span style={{ marginLeft:10, fontSize:'0.82rem', background: jp.is_open ? '#d1e7dd' : '#e9ecef', color: jp.is_open ? '#0a3622' : '#6c757d', padding:'2px 8px', borderRadius:99, fontWeight:700 }}>
                                  {jp.is_open ? 'Open' : 'Closed'}
                                </span>
                              </div>
                              <small style={{ color:'var(--text-muted)' }}>{fmt(jp.created_at)}</small>
                            </div>
                            <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'flex', flexWrap:'wrap', gap:'4px 12px', marginBottom:8 }}>
                              <span>🏢 {jp.department}</span>
                              <span>📍 {jp.location}</span>
                              <span>⏰ {jp.type.replace('_',' ')}</span>
                              {jp.salary_range && <span>💰 {jp.salary_range}</span>}
                            </div>
                            {jp.description && <p style={{ fontSize:'0.85rem', margin:'0 0 8px', lineHeight:1.6 }}>{jp.description}</p>}
                            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                              <ActionBtn label="Edit" onClick={() => { setEditJob(jp.id); setEditJobData({}); }} color="var(--brand-600)" />
                              <ActionBtn label={jp.is_open ? 'Close Posting' : 'Re-open'} onClick={() => toggleJobOpen(jp.id, !jp.is_open)} color={jp.is_open ? '#6c757d' : '#198754'} />
                              <ActionBtn label="Delete" onClick={() => { if (window.confirm('Delete this posting?')) deleteJobPosting(jp.id); }} color="#dc3545" />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SUB: INTERVIEWS ── */}
            {hrTab === 'interviews' && (
              <div>
                {interviews.length === 0 ? <EmptyState icon="🎙" text="No interviews scheduled yet" /> : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                    {interviews.map((iv) => (
                      <div key={iv.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'1rem 1.25rem' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:6 }}>
                          <div>
                            <strong>{iv.job_applications?.full_name ?? '—'}</strong>
                            <span style={{ marginLeft:8, fontSize:'0.82rem', color:'var(--text-muted)' }}>{iv.job_applications?.department} › {iv.job_applications?.role}</span>
                          </div>
                          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                            <Badge status={iv.outcome} />
                            <small style={{ color:'var(--text-muted)' }}>Round {iv.round}</small>
                          </div>
                        </div>
                        <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'flex', flexWrap:'wrap', gap:'4px 12px', marginBottom:8 }}>
                          <span>📅 {fmt(iv.scheduled_at)}</span>
                          <span>⏱ {iv.duration_min} min</span>
                          <span>📱 {iv.interview_type}</span>
                          {iv.interviewer_name && <span>👤 {iv.interviewer_name}</span>}
                        </div>
                        {iv.meeting_link && <a href={iv.meeting_link} target="_blank" rel="noreferrer" style={{ fontSize:'0.82rem', color:'var(--brand-600)', display:'block', marginBottom:8 }}>🔗 {iv.meeting_link}</a>}
                        {iv.notes && <p style={{ fontSize:'0.82rem', margin:'0 0 8px', color:'var(--text)' }}>{iv.notes}</p>}
                        {iv.outcome_notes && <p style={{ fontSize:'0.82rem', margin:'0 0 8px', background:'var(--bg-subtle,#f8f9fa)', padding:'6px 10px', borderRadius:6 }}>Outcome note: {iv.outcome_notes}</p>}
                        {iv.outcome === 'pending' && (
                          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                            <ActionBtn label="Pass"    onClick={() => setInterviewOutcome(iv.id,'pass')}    color="#198754" />
                            <ActionBtn label="Fail"    onClick={() => setInterviewOutcome(iv.id,'fail')}    color="#dc3545" />
                            <ActionBtn label="No-show" onClick={() => setInterviewOutcome(iv.id,'no_show')} color="#6c757d" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Schedule Interview Modal ── */}
            {scheduleFor && (
              <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
                <div style={{ background:'var(--surface)', borderRadius:14, padding:'1.5rem', maxWidth:460, width:'100%', overflowY:'auto', maxHeight:'90vh' }}>
                  <h3 style={{ fontWeight:800, marginBottom:4 }}>Schedule Interview</h3>
                  <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1rem' }}>For: <strong>{scheduleFor.full_name}</strong> — {scheduleFor.department} › {scheduleFor.role}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                    {[
                      { k:'scheduled_at',     label:'Date & Time *',     type:'datetime-local' },
                      { k:'interviewer_name', label:'Interviewer Name',   type:'text', ph:'e.g. Dr. Priya Sharma' },
                      { k:'meeting_link',     label:'Meeting Link',       type:'url',  ph:'https://meet.google.com/...' },
                      { k:'notes',            label:'Notes',              type:'text', ph:'Preparation instructions…' },
                    ].map(({ k, label, type, ph }) => (
                      <div key={k}>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>{label}</label>
                        <input type={type} value={newInterview[k]} onChange={(e) => setNewInterview((p) => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' }} />
                      </div>
                    ))}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                      <div>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Round</label>
                        <input type="number" min={1} max={5} value={newInterview.round} onChange={(e) => setNewInterview((p) => ({ ...p, round: +e.target.value }))}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)' }} />
                      </div>
                      <div>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Type</label>
                        <select value={newInterview.interview_type} onChange={(e) => setNewInterview((p) => ({ ...p, interview_type: e.target.value }))}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)' }}>
                          <option value="video">Video</option>
                          <option value="phone">Phone</option>
                          <option value="in_person">In Person</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:'1rem' }}>
                    <button onClick={() => scheduleInterview(scheduleFor.id)} className="btn btn-primary btn-sm">Schedule</button>
                    <button onClick={() => setScheduleFor(null)} className="btn btn-ghost btn-sm">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Extend Offer Modal ── */}
            {offerFor && (
              <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
                <div style={{ background:'var(--surface)', borderRadius:14, padding:'1.5rem', maxWidth:400, width:'100%' }}>
                  <h3 style={{ fontWeight:800, marginBottom:4 }}>Extend Offer</h3>
                  <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1rem' }}>For: <strong>{offerFor.full_name}</strong></p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                    {[
                      { k:'offer_salary',   label:'Salary / CTC *',  type:'text',  ph:'e.g. ₹12 LPA' },
                      { k:'offer_date',     label:'Offer Date',       type:'date' },
                      { k:'offer_deadline', label:'Response Deadline', type:'date' },
                      { k:'joining_date',   label:'Joining Date',     type:'date' },
                    ].map(({ k, label, type, ph }) => (
                      <div key={k}>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>{label}</label>
                        <input type={type} value={offerData[k]} onChange={(e) => setOfferData((p) => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:'1rem' }}>
                    <button onClick={() => extendOffer(offerFor.id)} className="btn btn-primary btn-sm">Send Offer</button>
                    <button onClick={() => setOfferFor(null)} className="btn btn-ghost btn-sm">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab === 'messages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                Contact Messages <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({messages.length})</span>
                {messages.filter((m) => !readMsgIds.has(m.id)).length > 0 && (
                  <Pill n={messages.filter((m) => !readMsgIds.has(m.id)).length} />
                )}
              </h2>
              <button
                onClick={() => downloadCsv(
                  [
                    ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Received'],
                    ...messages.map((m) => [m.name, m.email, m.phone, m.subject, m.message, fmt(m.created_at)]),
                  ],
                  'serenest-messages.csv',
                )}
                className="btn btn-ghost btn-sm"
              >
                Export CSV
              </button>
            </div>
            {messages.length === 0 ? (
              <EmptyState icon="💬" text="No messages yet" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.map((m) => {
                  const isRead = readMsgIds.has(m.id);
                  return (
                    <div key={m.id} style={{
                      background: isRead ? 'var(--surface)' : 'var(--bg-subtle, #f8f9fc)',
                      border: `1px solid ${isRead ? 'var(--border)' : 'var(--brand-300, #8da86e)'}`,
                      borderRadius: 10,
                      padding: '1rem 1.25rem',
                      opacity: isRead ? 0.75 : 1,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {!isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-500, #5a7a3a)', display: 'inline-block', flexShrink: 0 }} />}
                          <strong>{m.name}</strong>
                          {m.email && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.email}</span>}
                          {m.phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.phone}</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <small style={{ color: 'var(--text-muted)' }}>{fmt(m.created_at)}</small>
                          {m.email && (
                            <a
                              href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Your enquiry to Serenest')}`}
                              style={{ fontSize: '0.78rem', padding: '2px 10px', borderRadius: 99, border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)', background: 'var(--surface)' }}
                            >
                              ↩ Reply
                            </a>
                          )}
                          <button
                            onClick={() => markMessageRead(m.id)}
                            title={isRead ? 'Mark unread' : 'Mark as read'}
                            style={{ fontSize: '0.78rem', padding: '2px 10px', borderRadius: 99, border: '1px solid var(--border)', cursor: 'pointer', background: 'var(--surface)', color: 'var(--text)' }}
                          >
                            {isRead ? '○ Unread' : '✓ Read'}
                          </button>
                          <button
                            onClick={() => { if (window.confirm(`Delete message from ${m.name}?`)) deleteMessage(m.id); }}
                            title="Delete message"
                            style={{ fontSize: '0.78rem', padding: '2px 8px', borderRadius: 99, border: '1px solid #dc3545', cursor: 'pointer', background: 'transparent', color: '#dc3545' }}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                      {m.subject && <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.9rem' }}>{m.subject}</div>}
                      <p style={{ margin: 0, color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>{m.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SCREENINGS ── */}
        {tab === 'screenings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                Self-screenings <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({screenings.length})</span>
              </h2>
              <button
                onClick={() => {
                  const csv = [
                    'Name,Phone,Email,PHQ-9,PHQ Severity,GAD-7,GAD Severity,Wants Callback,Submitted',
                    ...screenings.map((s) => [
                      s.name ?? '',
                      s.phone ?? '',
                      s.email ?? '',
                      s.phq9_score ?? '',
                      s.phq9_severity ?? '',
                      s.gad7_score ?? '',
                      s.gad7_severity ?? '',
                      s.wants_callback ? 'yes' : 'no',
                      fmt(s.created_at),
                    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
                  ].join('\n');
                  const a = document.createElement('a');
                  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                  a.download = 'serenest-screenings.csv';
                  a.click();
                }}
                className="btn btn-ghost btn-sm"
              >
                Export CSV
              </button>
            </div>

            {screenings.length === 0 ? (
              <EmptyState icon="🧠" text="No screenings yet" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {screenings.map((s) => {
                  const sev = (label) => {
                    const map = {
                      Minimal:              { bg: '#d1e7dd', color: '#0a3622' },
                      Mild:                 { bg: '#cfe2ff', color: '#084298' },
                      Moderate:             { bg: '#ffe5d0', color: '#8a4a00' },
                      'Moderately Severe':  { bg: '#ffd8c2', color: '#9a3b00' },
                      Severe:               { bg: '#f8d7da', color: '#842029' },
                    };
                    return map[label] ?? { bg: '#e9ecef', color: '#495057' };
                  };
                  const phqStyle = sev(s.phq9_severity);
                  const gadStyle = sev(s.gad7_severity);
                  const safety = (Array.isArray(s.phq9_answers) ? s.phq9_answers[8] : 0) > 0;

                  return (
                    <div key={s.id} style={{
                      background: 'var(--surface)',
                      border: `1px solid ${safety ? '#dc3545' : 'var(--border)'}`,
                      borderRadius: 12,
                      padding: '1rem 1.25rem',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(180px, 1.4fr) repeat(2, minmax(160px, 1fr)) auto',
                      gap: '1rem',
                      alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {s.name ?? <em style={{ color: 'var(--text-muted)' }}>Anonymous</em>}
                          {safety && <span title="Safety flag — Q9 indicated self-harm" style={{ background: '#dc3545', color: '#fff', padding: '1px 7px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 800 }}>⚠ SAFETY</span>}
                          {s.wants_callback && <span style={{ background: '#fff3cd', color: '#856404', padding: '1px 7px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 700 }}>Wants callback</span>}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {s.phone && <span>📞 {s.phone}</span>}
                          {s.email && <span>✉ {s.email}</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{fmt(s.created_at)}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>PHQ-9 (Depression)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{s.phq9_score ?? '—'}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}> / 27</span></div>
                        {s.phq9_severity && <span style={{ display: 'inline-block', marginTop: 4, background: phqStyle.bg, color: phqStyle.color, padding: '1px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700 }}>{s.phq9_severity}</span>}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>GAD-7 (Anxiety)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{s.gad7_score ?? '—'}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}> / 21</span></div>
                        {s.gad7_severity && <span style={{ display: 'inline-block', marginTop: 4, background: gadStyle.bg, color: gadStyle.color, padding: '1px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700 }}>{s.gad7_severity}</span>}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {s.phone && (
                          <a
                            href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(`Hi ${s.name ? s.name.split(' ')[0] : 'there'}, this is Serenest reaching out about your recent self-screening. Would you like to talk to one of our professionals?`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm"
                            style={{ background: '#25D366', color: '#fff', borderColor: '#25D366', fontSize: '0.8rem' }}
                          >
                            💬 WhatsApp
                          </a>
                        )}
                        {s.phone && (
                          <a href={`tel:${s.phone}`} className="btn btn-sm btn-ghost" style={{ fontSize: '0.8rem' }}>📞 Call</a>
                        )}
                      </div>

                      {s.optional_screenings && typeof s.optional_screenings === 'object' && (
                        <div style={{ gridColumn: '1 / -1', paddingTop: 8, borderTop: '1px dashed var(--border)', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Also screened:</span>
                          {s.optional_screenings.isi && (
                            <span style={{ background: '#f1ebe1', padding: '2px 8px', borderRadius: 99, fontSize: '0.75rem' }}>Sleep ISI {s.optional_screenings.isi.score}</span>
                          )}
                          {s.optional_screenings.audit_c && (
                            <span style={{ background: '#f1ebe1', padding: '2px 8px', borderRadius: 99, fontSize: '0.75rem' }}>AUDIT-C {s.optional_screenings.audit_c.score}/12</span>
                          )}
                          {s.optional_screenings.scoff && (
                            <span style={{ background: '#f1ebe1', padding: '2px 8px', borderRadius: 99, fontSize: '0.75rem' }}>SCOFF {s.optional_screenings.scoff.yes_count} yes</span>
                          )}
                          {s.optional_screenings.ptsd_screen && (
                            <span style={{ background: '#f1ebe1', padding: '2px 8px', borderRadius: 99, fontSize: '0.75rem' }}>
                              Trauma {s.optional_screenings.ptsd_screen.event ? `${s.optional_screenings.ptsd_screen.symptom_yes_count}/5` : '—'}
                            </span>
                          )}
                          {s.optional_screenings.who5 && (
                            <span style={{ background: '#f1ebe1', padding: '2px 8px', borderRadius: 99, fontSize: '0.75rem' }}>
                              WHO-5 {s.optional_screenings.who5.index}/100
                            </span>
                          )}
                          {s.optional_screenings.stop_bang && (
                            <span style={{ background: '#f1ebe1', padding: '2px 8px', borderRadius: 99, fontSize: '0.75rem' }}>
                              STOP-BANG {s.optional_screenings.stop_bang.yes_count}/8
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SUBSCRIBERS ── */}
        {tab === 'learners' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem' }}>Academy</h2>

            {/* Academy sub-tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
              {[
                { id: 'learners', label: `Learners (${learners.length})` },
                { id: 'content',  label: `Content (${acContent.length})` },
              ].map((st) => (
                <button key={st.id} onClick={() => setAcademyTab(st.id)} style={{
                  padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.88rem', fontWeight: academyTab === st.id ? 700 : 500,
                  color: academyTab === st.id ? 'var(--brand-600)' : 'var(--text-muted)',
                  borderBottom: academyTab === st.id ? '2px solid var(--brand-500)' : '2px solid transparent',
                  marginBottom: -2, transition: 'all 0.15s',
                }}>{st.label}</button>
              ))}
            </div>

            {/* ── SUB: LEARNERS ── */}
            {academyTab === 'learners' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => {
                      const csv = ['Name,Email,Role,Confirmed,Joined', ...learners.map((l) => `"${l.full_name ?? ''}","${l.email ?? ''}","${l.role ?? ''}","${l.confirmed ? 'yes' : 'no'}","${fmtDate(l.created_at)}"`)].join('\n');
                      const a = document.createElement('a');
                      a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                      a.download = 'serenest-academy-learners.csv';
                      a.click();
                    }}
                    className="btn btn-ghost btn-sm"
                  >Export CSV</button>
                </div>
                {learners.length === 0 ? (
                  <EmptyState icon="🎓" text="No Academy accounts yet — the /academy/login page feeds this list" />
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>{['Name', 'Email', 'Role', 'Status', 'Joined'].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {learners.map((l) => (
                          <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={tdStyle}>{l.full_name || '—'}</td>
                            <td style={tdStyle}><a href={`mailto:${l.email}`} style={{ color: 'var(--brand-600)' }}>{l.email}</a></td>
                            <td style={tdStyle}>{l.role || '—'}</td>
                            <td style={tdStyle}>{l.confirmed ? <Badge status="confirmed" /> : <Badge status="pending" />}</td>
                            <td style={tdStyle}>{fmt(l.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── SUB: CONTENT ── */}
            {academyTab === 'content' && (() => {
              const TYPE_COLORS = { announcement: '#0d6efd', program_update: '#198754', event: '#e67e22' };
              const TYPE_LABELS = { announcement: 'Announcement', program_update: 'Program Update', event: 'Event' };

              async function saveNew() {
                if (!acForm.title.trim()) { setAcError('Title is required.'); return; }
                setAcBusy(true); setAcError('');
                try {
                  const r = await adminFetch('/api/academy/content', secret, { method: 'POST', body: JSON.stringify(acForm) });
                  setAcContent((prev) => [r.item, ...prev]);
                  setAcForm({ type: 'announcement', title: '', body: '', link: '', link_label: 'Learn more', pinned: false, is_active: true });
                  setAcShowForm(false);
                } catch (e) { setAcError(e.message); }
                setAcBusy(false);
              }

              async function generateAcademyItems() {
                setAcGenLoading(true); setAcGenError(''); setAcGenResult(null); setAcGenSaved(false);
                try {
                  const r = await adminFetch('/api/academy/content/generate', secret, {
                    method: 'POST',
                    body: JSON.stringify({ focus: acGenFocus || null, count: acGenCount }),
                  });
                  setAcGenResult(r);
                } catch (e) { setAcGenError(e.message); }
                finally { setAcGenLoading(false); }
              }

              async function saveGeneratedItems() {
                if (!acGenResult?.items?.length) return;
                setAcGenLoading(true); setAcGenError('');
                try {
                  const saved = [];
                  for (const item of acGenResult.items) {
                    const r = await adminFetch('/api/academy/content', secret, { method: 'POST', body: JSON.stringify({ ...item, is_active: true }) });
                    saved.push(r.item);
                  }
                  setAcContent((prev) => [...saved.reverse(), ...prev]);
                  setAcGenSaved(true);
                  setAcGenResult(null);
                  setAcGenOpen(false);
                } catch (e) { setAcGenError(e.message); }
                finally { setAcGenLoading(false); }
              }

              async function saveEdit(id) {
                setAcBusy(true); setAcError('');
                try {
                  const r = await adminFetch(`/api/academy/content/${id}`, secret, { method: 'PATCH', body: JSON.stringify(acEditData) });
                  setAcContent((prev) => prev.map((x) => x.id === id ? r.item : x));
                  setAcEditing(null);
                } catch (e) { setAcError(e.message); }
                setAcBusy(false);
              }

              async function toggleField(id, field, val) {
                try {
                  const r = await adminFetch(`/api/academy/content/${id}`, secret, { method: 'PATCH', body: JSON.stringify({ [field]: val }) });
                  setAcContent((prev) => prev.map((x) => x.id === id ? r.item : x));
                } catch (e) { setAcError(e.message); }
              }

              async function deleteItem(id) {
                if (!window.confirm('Delete this content item?')) return;
                setAcBusy(true); setAcError('');
                try {
                  await adminFetch(`/api/academy/content/${id}`, secret, { method: 'DELETE' });
                  setAcContent((prev) => prev.filter((x) => x.id !== id));
                } catch (e) { setAcError(e.message); }
                setAcBusy(false);
              }

              const fieldStyle = { width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.88rem', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' };
              const labelStyle = { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' };

              const TYPE_BADGE = {
                announcement:   { bg: '#eff6ff', color: '#1d4ed8' },
                program_update: { bg: '#f0fdf4', color: '#15803d' },
                event:          { bg: '#fff7ed', color: '#c2410c' },
              };

              return (
                <div>
                  {acError && <p style={{ color: '#dc3545', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{acError}</p>}

                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
                    <h2 style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>Academy Content</h2>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ background: 'linear-gradient(135deg,#5a8f40,#3a6028)', display: 'flex', alignItems: 'center', gap: 6 }}
                        onClick={() => { setAcGenOpen((v) => !v); setAcShowForm(false); setAcGenError(''); }}
                      >
                        ✨ {acGenOpen ? 'Close AI generator' : 'Generate with AI'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setAcShowForm((v) => !v); setAcGenOpen(false); setAcError(''); }}>
                        {acShowForm ? 'Cancel' : '+ Manual entry'}
                      </button>
                    </div>
                  </div>

                  {/* ── AI GENERATOR PANEL ── */}
                  {acGenOpen && (
                    <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#f8fafc)', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>✨</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>AI Academy Content Generator</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Claude writes announcements, program updates, and events. You review, then publish.</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 12 }}>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Theme / context <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></span>
                          <input className="admin-input" placeholder="e.g. New cohort opening, fellowship enrollment, guest lecture…"
                            value={acGenFocus} onChange={(e) => setAcGenFocus(e.target.value)} />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Count</span>
                          <select className="admin-input" value={acGenCount} onChange={(e) => setAcGenCount(Number(e.target.value))}>
                            <option value={3}>3 items</option>
                            <option value={4}>4 items</option>
                            <option value={5}>5 items</option>
                            <option value={6}>6 items</option>
                          </select>
                        </label>
                      </div>
                      {acGenError && <div style={{ color: '#b91c1c', fontSize: '0.82rem', marginBottom: 10 }}>{acGenError}</div>}
                      {!acGenResult ? (
                        <button className="btn btn-primary" disabled={acGenLoading} onClick={generateAcademyItems}
                          style={{ width: '100%', justifyContent: 'center' }}>
                          {acGenLoading ? '✨ Claude is writing content…' : `✨ Generate ${acGenCount} content items`}
                        </button>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                            {acGenResult.items.map((item, i) => {
                              const badge = TYPE_BADGE[item.type] ?? { bg: '#f1f5f9', color: '#475569' };
                              return (
                                <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '0.85rem' }}>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: badge.bg, color: badge.color }}>
                                      {item.type === 'announcement' ? '📢' : item.type === 'program_update' ? '📚' : '🗓'} {item.type.replace('_', ' ')}
                                    </span>
                                    {item.pinned && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#fef9c3', color: '#854d0e' }}>📌 Will be pinned</span>}
                                  </div>
                                  <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</p>
                                  {item.body && <p style={{ margin: '0 0 4px', fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.body}</p>}
                                  {item.link && <p style={{ margin: 0, fontSize: '0.78rem', color: '#3b82f6' }}>{item.link_label || 'Link'} → {item.link}</p>}
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => { setAcGenResult(null); setAcGenSaved(false); }}>Regenerate</button>
                            <button className="btn btn-primary" disabled={acGenLoading || acGenSaved} onClick={saveGeneratedItems}
                              style={{ flex: 1, justifyContent: 'center' }}>
                              {acGenLoading ? 'Publishing…' : acGenSaved ? '✓ Published!' : `✅ Publish all ${acGenResult.items.length} items`}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New-item form */}
                  {acShowForm && (
                    <div style={{ background: 'var(--surface-raised, #f8fafc)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>New Content Item</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Type</label>
                          <select style={fieldStyle} value={acForm.type} onChange={(e) => setAcForm((f) => ({ ...f, type: e.target.value }))}>
                            <option value="announcement">Announcement</option>
                            <option value="program_update">Program Update</option>
                            <option value="event">Event</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Title *</label>
                          <input style={fieldStyle} value={acForm.title} onChange={(e) => setAcForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. New module added to CBT track" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Body (optional)</label>
                          <textarea style={{ ...fieldStyle, minHeight: 72, resize: 'vertical' }} value={acForm.body} onChange={(e) => setAcForm((f) => ({ ...f, body: e.target.value }))} placeholder="Brief description shown on the academy page…" />
                        </div>
                        <div>
                          <label style={labelStyle}>Link URL (optional)</label>
                          <input style={fieldStyle} value={acForm.link} onChange={(e) => setAcForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://… or /academy/program/…" />
                        </div>
                        <div>
                          <label style={labelStyle}>Link Label</label>
                          <input style={fieldStyle} value={acForm.link_label} onChange={(e) => setAcForm((f) => ({ ...f, link_label: e.target.value }))} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="checkbox" id="ac-pinned" checked={acForm.pinned} onChange={(e) => setAcForm((f) => ({ ...f, pinned: e.target.checked }))} />
                          <label htmlFor="ac-pinned" style={{ fontSize: '0.88rem', cursor: 'pointer' }}>Pin to top of academy page</label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="checkbox" id="ac-active" checked={acForm.is_active} onChange={(e) => setAcForm((f) => ({ ...f, is_active: e.target.checked }))} />
                          <label htmlFor="ac-active" style={{ fontSize: '0.88rem', cursor: 'pointer' }}>Active (visible to learners)</label>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={() => setAcShowForm(false)} className="btn btn-ghost btn-sm">Cancel</button>
                        <button onClick={saveNew} disabled={acBusy} className="btn btn-primary btn-sm">{acBusy ? 'Saving…' : 'Publish'}</button>
                      </div>
                    </div>
                  )}

                  {/* Content list */}
                  {acContent.length === 0 ? (
                    <EmptyState icon="📢" text="No content yet — click 'New Update' to publish an announcement or program update" />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {acContent.map((item) => (
                        <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem 1.1rem', opacity: item.is_active ? 1 : 0.55 }}>
                          {acEditing === item.id ? (
                            /* Inline edit form */
                            <div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 1rem', marginBottom: '0.75rem' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label style={labelStyle}>Title</label>
                                  <input style={fieldStyle} value={acEditData.title ?? item.title} onChange={(e) => setAcEditData((d) => ({ ...d, title: e.target.value }))} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label style={labelStyle}>Body</label>
                                  <textarea style={{ ...fieldStyle, minHeight: 64, resize: 'vertical' }} value={acEditData.body ?? item.body ?? ''} onChange={(e) => setAcEditData((d) => ({ ...d, body: e.target.value }))} />
                                </div>
                                <div>
                                  <label style={labelStyle}>Link URL</label>
                                  <input style={fieldStyle} value={acEditData.link ?? item.link ?? ''} onChange={(e) => setAcEditData((d) => ({ ...d, link: e.target.value }))} />
                                </div>
                                <div>
                                  <label style={labelStyle}>Link Label</label>
                                  <input style={fieldStyle} value={acEditData.link_label ?? item.link_label ?? 'Learn more'} onChange={(e) => setAcEditData((d) => ({ ...d, link_label: e.target.value }))} />
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button onClick={() => setAcEditing(null)} className="btn btn-ghost btn-sm">Cancel</button>
                                <button onClick={() => saveEdit(item.id)} disabled={acBusy} className="btn btn-primary btn-sm">{acBusy ? 'Saving…' : 'Save'}</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: (TYPE_COLORS[item.type] ?? '#aaa') + '18', color: TYPE_COLORS[item.type] ?? '#aaa' }}>{TYPE_LABELS[item.type] ?? item.type}</span>
                                  {item.pinned && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#fef9c3', color: '#854d0e' }}>📌 Pinned</span>}
                                  {!item.is_active && <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#f1f5f9', color: '#64748b' }}>Hidden</span>}
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{fmtDate(item.created_at)}</span>
                                </div>
                                <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: '0 0 2px' }}>{item.title}</p>
                                {item.body && <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'pre-wrap' }}>{item.body}</p>}
                                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--brand-600)' }}>{item.link_label || item.link} →</a>}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                                <button onClick={() => toggleField(item.id, 'pinned', !item.pinned)} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: item.pinned ? '#854d0e' : 'var(--text-muted)' }}>{item.pinned ? 'Unpin' : 'Pin'}</button>
                                <button onClick={() => toggleField(item.id, 'is_active', !item.is_active)} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: item.is_active ? '#198754' : 'var(--text-muted)' }}>{item.is_active ? 'Hide' : 'Show'}</button>
                                <button onClick={() => { setAcEditing(item.id); setAcEditData({}); }} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: '0.78rem' }}>Edit</button>
                                <button onClick={() => deleteItem(item.id)} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid #fecaca', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#dc2626' }}>Delete</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {tab === 'subscribers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                Email Subscribers <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({subscribers.length})</span>
              </h2>
              <button
                onClick={() => {
                  const csv = ['Email,Source,Date', ...subscribers.map((s) => `"${s.email}","${s.source ?? ''}","${fmtDate(s.created_at)}"`)].join('\n');
                  const a = document.createElement('a');
                  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                  a.download = 'serenest-subscribers.csv';
                  a.click();
                }}
                className="btn btn-ghost btn-sm"
              >
                Export CSV
              </button>
            </div>

            {subscribers.length === 0 ? (
              <EmptyState icon="✉️" text="No subscribers yet — the footer email form feeds this list" />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>{['Email', 'Source', 'Subscribed'].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}><a href={`mailto:${s.email}`} style={{ color: 'var(--brand-600)' }}>{s.email}</a></td>
                        <td style={tdStyle}>{s.source || '—'}</td>
                        <td style={tdStyle}>{fmt(s.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── SIGNUPS ── */}
        {tab === 'signups' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                Waitlist Signups <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({signups.length})</span>
              </h2>
              <button
                onClick={() => {
                  const csv = ['Email,Mobile,Date', ...signups.map((s) => `${s.email},${s.mobile},${fmtDate(s.created_at)}`)].join('\n');
                  const a = document.createElement('a');
                  a.href = 'data:text/csv,' + encodeURIComponent(csv);
                  a.download = 'serenest-signups.csv';
                  a.click();
                }}
                className="btn btn-ghost btn-sm"
              >
                Export CSV
              </button>
            </div>

            {signups.length === 0 ? (
              <EmptyState icon="📋" text="No signups yet" />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {['Email', 'Mobile', 'Signed up'].map((h) => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>{s.email}</td>
                        <td style={tdStyle}>{s.mobile}</td>
                        <td style={tdStyle}>{fmt(s.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── SOCIAL MEDIA TAB ─────────────────────────────────── */}
        {tab === 'social' && (() => {
          const STATUS_COLORS = {
            scheduled: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
            posted:    { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
            failed:    { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444' },
            partial:   { bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' },
            draft:     { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' },
          };

          const fmtScheduled = (dt) => {
            const d = new Date(dt);
            return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
          };

          const PLATFORM_LABELS = { instagram: '📷 Instagram', linkedin: '💼 LinkedIn', both: '📷+💼 Both' };

          async function saveNewPost() {
            setSocialBusy(true); setSocialError('');
            try {
              const r = await adminFetch('/api/social/posts', secret, {
                method: 'POST', body: JSON.stringify(socialForm),
              });
              setSocialPosts((p) => [r.post, ...p]);
              setSocialShowForm(false);
              setSocialForm({ platform: 'both', caption: '', hashtags: '', image_url: '', scheduled_at: '', status: 'scheduled' });
            } catch (e) { setSocialError(e.message); }
            finally { setSocialBusy(false); }
          }

          async function saveEdit(id) {
            setSocialBusy(true); setSocialError('');
            try {
              const r = await adminFetch(`/api/social/posts/${id}`, secret, {
                method: 'PATCH', body: JSON.stringify(socialEditData),
              });
              setSocialPosts((p) => p.map((x) => x.id === id ? r.post : x));
              setSocialEditing(null);
            } catch (e) { setSocialError(e.message); }
            finally { setSocialBusy(false); }
          }

          async function deletePost(id) {
            if (!window.confirm('Delete this post?')) return;
            await adminFetch(`/api/social/posts/${id}`, secret, { method: 'DELETE' });
            setSocialPosts((p) => p.filter((x) => x.id !== id));
          }

          async function publishNow(id) {
            setSocialBusy(true); setSocialError('');
            try {
              const r = await adminFetch(`/api/social/posts/${id}/publish`, secret, { method: 'POST' });
              setSocialPosts((p) => p.map((x) => x.id === id ? { ...x, status: r.status, posted_at: new Date().toISOString() } : x));
              if (r.errors?.length) setSocialError(r.errors.join(' | '));
            } catch (e) { setSocialError(e.message); }
            finally { setSocialBusy(false); }
          }

          const upcoming = socialPosts.filter((p) => p.status === 'scheduled');
          const posted   = socialPosts.filter((p) => p.status === 'posted');
          const failed   = socialPosts.filter((p) => ['failed','partial'].includes(p.status));

          // ── AI generate helpers ──────────────────────────────
          async function generatePosts() {
            setGenLoading(true); setGenError(''); setGenResult(null); setGenSaved(false);
            const recentTopics = socialPosts.slice(0, 20).map((p) => p.caption.slice(0, 60));
            const weekNumber = Math.ceil((socialPosts.length + 1) / 6);
            try {
              const r = await adminFetch('/api/social/generate', secret, {
                method: 'POST',
                body: JSON.stringify({ weekNumber, startDate: genStartDate, recentTopics, focus: genFocus || null }),
              });
              setGenResult(r);
            } catch (e) { setGenError(e.message); }
            finally { setGenLoading(false); }
          }

          async function saveGeneratedPosts() {
            if (!genResult?.posts) return;
            setGenLoading(true); setGenError('');
            try {
              const r = await adminFetch('/api/social/generate/save', secret, {
                method: 'POST',
                body: JSON.stringify({ posts: genResult.posts }),
              });
              setSocialPosts((p) => [...r.posts, ...p]);
              setGenSaved(true);
              setGenResult(null);
              setGenOpen(false);
            } catch (e) { setGenError(e.message); }
            finally { setGenLoading(false); }
          }

          return (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>Social Media</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: 'linear-gradient(135deg,#5a8f40,#3a6028)', display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={() => { setGenOpen((v) => !v); setSocialShowForm(false); }}
                  >
                    ✨ {genOpen ? 'Close AI generator' : 'Generate with AI'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setSocialShowForm((v) => !v); setGenOpen(false); }}>
                    {socialShowForm ? 'Cancel' : '+ Manual post'}
                  </button>
                </div>
              </div>

              {/* ── AI GENERATOR PANEL ── */}
              {genOpen && (
                <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#f8fafc)', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>✨</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>AI Content Generator</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Claude writes 6 platform-native posts for next week. You review, edit if needed, then schedule.</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Week starting (Monday)</span>
                      <input className="admin-input" type="date" value={genStartDate}
                        onChange={(e) => setGenStartDate(e.target.value)} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Theme / focus <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></span>
                      <input className="admin-input" placeholder="e.g. World Mental Health Day, Academy launch…"
                        value={genFocus} onChange={(e) => setGenFocus(e.target.value)} />
                    </label>
                  </div>
                  {genError && <div style={{ color: '#b91c1c', fontSize: '0.82rem', marginBottom: 10 }}>{genError}</div>}
                  {!genResult ? (
                    <button className="btn btn-primary" disabled={genLoading} onClick={generatePosts}
                      style={{ width: '100%', justifyContent: 'center' }}>
                      {genLoading ? '✨ Claude is writing your posts…' : '✨ Generate 6 posts'}
                    </button>
                  ) : (
                    <div>
                      <div style={{ background: '#dcfce7', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: '0.85rem', fontWeight: 600, color: '#15803d' }}>
                        ✓ Theme: {genResult.theme}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                        {genResult.posts.map((p, i) => (
                          <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '0.85rem' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: p.platform === 'instagram' ? '#fdf2f8' : '#eff6ff', color: p.platform === 'instagram' ? '#9d174d' : '#1d4ed8', padding: '2px 8px', borderRadius: 10 }}>
                                {p.platform === 'instagram' ? '📷 Instagram' : '💼 LinkedIn'}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(p.scheduled_at).toLocaleString('en-IN', { weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                              <span style={{ fontSize: '0.72rem', color: '#5a8f40', fontWeight: 600 }}>{p.pillar}</span>
                            </div>
                            <p style={{ margin: '0 0 4px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: 1.5, maxHeight: 120, overflow: 'hidden' }}>{p.caption.slice(0, 300)}{p.caption.length > 300 ? '…' : ''}</p>
                            {p.hashtags && <p style={{ margin: 0, fontSize: '0.75rem', color: '#3b82f6' }}>{p.hashtags}</p>}
                            {p.image_brief && <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>📸 {p.image_brief}</p>}
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setGenResult(null)}>Regenerate</button>
                        <button className="btn btn-primary" disabled={genLoading || genSaved} onClick={saveGeneratedPosts}
                          style={{ flex: 1, justifyContent: 'center' }}>
                          {genLoading ? 'Scheduling…' : genSaved ? '✓ Scheduled!' : '✅ Schedule all 6 posts'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Credential status */}
              {socialStatus && (
                <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  {[['LinkedIn', socialStatus.linkedin], ['Instagram', socialStatus.instagram]].map(([name, ok]) => (
                    <span key={name} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                      background: ok ? '#f0fdf4' : '#fef2f2',
                      color: ok ? '#15803d' : '#b91c1c',
                      border: `1px solid ${ok ? '#bbf7d0' : '#fecaca'}`,
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: ok ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                      {name}: {ok ? 'Connected' : 'Not configured'}
                    </span>
                  ))}
                  {(!socialStatus.linkedin || !socialStatus.instagram) && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                      → Add missing env vars: LINKEDIN_ACCESS_TOKEN + LINKEDIN_ORG_URN · INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_USER_ID
                    </span>
                  )}
                </div>
              )}

              {socialError && <div className="admin-alert" style={{ marginBottom: '1rem' }}>{socialError}</div>}

              {/* New post form */}
              {socialShowForm && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, margin: '0 0 1rem' }}>Schedule new post</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Platform</span>
                        <select className="admin-input" value={socialForm.platform}
                          onChange={(e) => setSocialForm((f) => ({ ...f, platform: e.target.value }))}>
                          <option value="both">Both (Instagram + LinkedIn)</option>
                          <option value="instagram">Instagram only</option>
                          <option value="linkedin">LinkedIn only</option>
                        </select>
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Schedule date &amp; time</span>
                        <input className="admin-input" type="datetime-local" value={socialForm.scheduled_at}
                          onChange={(e) => setSocialForm((f) => ({ ...f, scheduled_at: e.target.value }))} />
                      </label>
                    </div>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Caption</span>
                      <textarea className="admin-input" rows={4} placeholder="Write your post caption…" value={socialForm.caption}
                        onChange={(e) => setSocialForm((f) => ({ ...f, caption: e.target.value }))}
                        style={{ resize: 'vertical' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Hashtags</span>
                      <input className="admin-input" placeholder="#mentalhealth #MentalHealthIndia" value={socialForm.hashtags}
                        onChange={(e) => setSocialForm((f) => ({ ...f, hashtags: e.target.value }))} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Image URL <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(public HTTPS URL — required for Instagram)</span></span>
                      <input className="admin-input" placeholder="https://…/image.jpg" value={socialForm.image_url}
                        onChange={(e) => setSocialForm((f) => ({ ...f, image_url: e.target.value }))} />
                    </label>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSocialShowForm(false)}>Cancel</button>
                      <button className="btn btn-primary btn-sm" disabled={socialBusy || !socialForm.caption.trim() || !socialForm.scheduled_at}
                        onClick={saveNewPost}>
                        {socialBusy ? 'Saving…' : 'Schedule'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming */}
              <h3 style={{ fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                Scheduled ({upcoming.length})
              </h3>
              {upcoming.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No upcoming posts — schedule one above.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                  {upcoming.map((post) => (
                    <SocialPostCard key={post.id} post={post} statusColors={STATUS_COLORS}
                      platformLabels={PLATFORM_LABELS} fmtScheduled={fmtScheduled}
                      onPublish={publishNow} onDelete={deletePost}
                      isEditing={socialEditing === post.id}
                      editData={socialEditData}
                      onEdit={() => { setSocialEditing(post.id); setSocialEditData({ caption: post.caption, hashtags: post.hashtags || '', image_url: post.image_url || '', scheduled_at: post.scheduled_at?.slice(0,16), platform: post.platform }); }}
                      onCancelEdit={() => setSocialEditing(null)}
                      onEditChange={(k, v) => setSocialEditData((d) => ({ ...d, [k]: v }))}
                      onSaveEdit={() => saveEdit(post.id)}
                      busy={socialBusy}
                    />
                  ))}
                </div>
              )}

              {/* Failed */}
              {failed.length > 0 && (
                <>
                  <h3 style={{ fontWeight: 700, fontSize: '0.75rem', margin: '0 0 0.75rem', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Failed / Partial ({failed.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                    {failed.map((post) => (
                      <SocialPostCard key={post.id} post={post} statusColors={STATUS_COLORS}
                        platformLabels={PLATFORM_LABELS} fmtScheduled={fmtScheduled}
                        onPublish={publishNow} onDelete={deletePost}
                        isEditing={false} busy={socialBusy}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Posted history */}
              <h3 style={{ fontWeight: 700, fontSize: '0.75rem', margin: '0 0 0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Posted ({posted.length})
              </h3>
              {posted.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Nothing posted yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {posted.slice(0, 20).map((post) => (
                    <SocialPostCard key={post.id} post={post} statusColors={STATUS_COLORS}
                      platformLabels={PLATFORM_LABELS} fmtScheduled={fmtScheduled}
                      onDelete={deletePost} isEditing={false} busy={false}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

          </div>
        </div>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="admin-mobile-nav" aria-label="Mobile admin navigation">
        {[
          { id: 'overview',      label: 'Overview',  icon: '◈' },
          { id: 'bookings',      label: 'Bookings',  icon: '▷' },
          { id: 'professionals', label: 'Team',      icon: '◆' },
          { id: 'messages',      label: 'Messages',  icon: '◉' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-mobile-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => { setTab(t.id); if (t.id !== 'overview') load(t.id); }}
          >
            <span className="admin-mobile-tab-icon">{t.icon}</span>
            <span className="admin-mobile-tab-label">{t.label}</span>
            {t.id === 'bookings' && stats?.pending_bookings > 0 && (
              <span className="admin-mobile-badge">{stats.pending_bookings}</span>
            )}
          </button>
        ))}
        <button
          type="button"
          className="admin-mobile-tab"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <span className="admin-mobile-tab-icon">☰</span>
          <span className="admin-mobile-tab-label">Menu</span>
        </button>
      </nav>
    </div>
  );
}

function SocialPostCard({ post, statusColors, platformLabels, fmtScheduled, onPublish, onDelete, isEditing, editData, onEdit, onCancelEdit, onEditChange, onSaveEdit, busy }) {
  const sc = statusColors[post.status] ?? statusColors.draft;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.dot}40`, borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{platformLabels[post.platform]}</span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {post.posted_at ? `Posted ${fmtScheduled(post.posted_at)}` : `Scheduled ${fmtScheduled(post.scheduled_at)}`}
        </span>
      </div>

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea className="admin-input" rows={3} value={editData.caption ?? ''} onChange={(e) => onEditChange('caption', e.target.value)} style={{ resize: 'vertical' }} />
          <input className="admin-input" placeholder="Hashtags" value={editData.hashtags ?? ''} onChange={(e) => onEditChange('hashtags', e.target.value)} />
          <input className="admin-input" placeholder="Image URL" value={editData.image_url ?? ''} onChange={(e) => onEditChange('image_url', e.target.value)} />
          <input className="admin-input" type="datetime-local" value={editData.scheduled_at ?? ''} onChange={(e) => onEditChange('scheduled_at', e.target.value)} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={onCancelEdit}>Cancel</button>
            <button className="btn btn-primary btn-sm" disabled={busy} onClick={onSaveEdit}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <p style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{post.caption}</p>
          {post.hashtags && <p style={{ margin: 0, fontSize: '0.8rem', color: '#3b82f6' }}>{post.hashtags}</p>}
          {post.image_url && (
            <img src={post.image_url} alt="post" style={{ maxHeight: 120, borderRadius: 8, objectFit: 'cover', maxWidth: '100%' }} onError={(e) => { e.target.style.display='none'; }} />
          )}
          {post.error_message && <p style={{ margin: 0, fontSize: '0.78rem', color: '#b91c1c', background: '#fef2f2', padding: '4px 8px', borderRadius: 6 }}>{post.error_message}</p>}
          {post.linkedin_post_id && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>LinkedIn post ID: {post.linkedin_post_id}</p>}
          {post.instagram_post_id && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instagram post ID: {post.instagram_post_id}</p>}
        </>
      )}

      {!isEditing && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {onPublish && post.status !== 'posted' && (
            <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => onPublish(post.id)}>Post now</button>
          )}
          {onEdit && post.status === 'scheduled' && (
            <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>
          )}
          {onDelete && (
            <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => onDelete(post.id)}>Delete</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Shared style constants ──────────────────────────────────────────────────
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'var(--surface)',
  borderRadius: 10,
  overflow: 'hidden',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  fontSize: '0.88rem',
};

const thStyle = {
  background: 'var(--bg-subtle, #f5f5f5)',
  padding: '0.7rem 1rem',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  borderBottom: '1px solid var(--border)',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '0.75rem 1rem',
  verticalAlign: 'top',
  lineHeight: 1.5,
};

const rxGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' };
const rxLabelStyle = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 3 };
const rxInputStyle = { width: '100%', padding: '7px 10px', fontSize: '0.86rem', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text)', boxSizing: 'border-box' };
const rxMedInputStyle = { padding: '5px 8px', fontSize: '0.84rem', border: '1px solid var(--border)', borderRadius: 5, background: 'var(--bg)', color: 'var(--text)', minWidth: 0 };

function RxGroup({ title }) {
  return (
    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px', paddingBottom: 4, borderBottom: '1px solid var(--border)' }}>
      {title}
    </div>
  );
}

function RxField({ label, value, onChange, type = 'text', placeholder, wide }) {
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <label style={rxLabelStyle}>{label}</label>
      <input type={type} value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={rxInputStyle} />
    </div>
  );
}

function RxArea({ label, value, onChange, placeholder, rows = 2, wide }) {
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <label style={rxLabelStyle}>{label}</label>
      <textarea value={value || ''} placeholder={placeholder} rows={rows} onChange={(e) => onChange(e.target.value)} style={{ ...rxInputStyle, resize: 'vertical' }} />
    </div>
  );
}

function TrafficList({ title, rows }) {
  const max = rows && rows.length ? Math.max(...rows.map((r) => r[1])) : 0;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem 1.25rem' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>{title}</div>
      {(!rows || rows.length === 0) ? (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No data yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map(([label, count]) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 3 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '78%' }} title={label}>{label}</span>
                <strong>{count}</strong>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: 'var(--bg-subtle)', overflow: 'hidden' }}>
                <div style={{ width: `${max ? (count / max) * 100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-500), var(--brand-700))' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '3rem',
      textAlign: 'center',
      color: 'var(--text-muted)',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <p style={{ margin: 0, fontWeight: 500 }}>{text}</p>
    </div>
  );
}

function InfoRow({ label, value, style = {} }) {
  return (
    <div style={style}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{value}</div>
    </div>
  );
}

function ActionBtn({ label, onClick, color, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '4px 11px',
        borderRadius: 7,
        border: `1.5px solid ${color}`,
        background: disabled ? '#f2f4f6' : 'transparent',
        color: disabled ? '#aaa' : color,
        fontSize: '0.74rem',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.13s',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.target.style.background = color;
        e.target.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.target.style.background = 'transparent';
        e.target.style.color = color;
      }}
    >
      {label}
    </button>
  );
}
