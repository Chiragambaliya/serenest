import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const PRIMARY_PATH = '/online-psychiatrist-consultation-india';

const LANDING_FAQS = [
  {
    q: 'How do I get an online psychiatrist consultation in India?',
    a: 'Pick a slot on the Serenest booking page, complete a short intake (including PHQ-9 and GAD-7 self-screening if relevant), and join your appointment over secure video, audio, or chat. Sessions are typically 45 minutes with a verified psychiatrist.',
  },
  {
    q: 'Is online psychiatry consultation legal in India?',
    a: 'Yes. Registered medical practitioners can provide telepsychiatry consultations in India under the Telemedicine Practice Guidelines (2020) issued jointly by the Ministry of Health and the National Medical Commission. Clinicians follow these guidelines, including on prescribing.',
  },
  {
    q: 'Can a psychiatrist prescribe medication online in India?',
    a: 'In many cases, yes — a registered psychiatrist may issue a digital prescription after an appropriate consultation, following India’s Telemedicine Practice Guidelines. Some categories of medication (for example, controlled substances under Schedule X) or certain clinical situations may require in-person evaluation. The treating clinician decides what is appropriate based on your history and assessment.',
  },
  {
    q: 'How much does an online psychiatry consultation cost on Serenest?',
    a: 'Psychiatry consultations start at ₹499 per session. Final fees depend on the clinician you book with. Transparent, per-session pricing is shown before payment — see the Pricing page for current rates.',
  },
  {
    q: 'Can I consult a psychiatrist from Gujarat (Ahmedabad, Surat, Vadodara, Rajkot, Deesa) online?',
    a: 'Yes. Serenest is built for patients across India, including Gujarat. You can consult verified psychiatrists from any city or town with a stable internet connection. Sessions are available in English, Hindi, and Gujarati where the clinician supports the language.',
  },
  {
    q: 'What conditions can be addressed in an online psychiatry consultation?',
    a: 'Common areas include depression, anxiety disorders, OCD, PTSD, bipolar disorder, ADHD in adults, sleep difficulties, stress and burnout, and medication review or follow-up care. Severe or emergency presentations are not appropriate for telepsychiatry — see the emergency notice on this page.',
  },
  {
    q: 'Is online psychiatry as effective as in-person care?',
    a: 'For many common conditions, evidence supports telepsychiatry as a clinically useful option, especially for follow-up care, medication review, counselling, and continuity. Your clinician will tell you if in-person evaluation is recommended.',
  },
  {
    q: 'Is my consultation private and confidential?',
    a: 'Sessions are conducted over encrypted video and stored within Serenest’s privacy-first workflows on least-access principles. By default sessions are not recorded. See our Privacy Policy for details on what is collected and how it is protected.',
  },
];

export default function OnlinePsychiatristIndiaPage() {
  useSEO({ path: PRIMARY_PATH, ...ROUTE_SEO[PRIMARY_PATH] });

  return (
    <div>
      {/* ── Page Hero ──────────────────────────────────────── */}
      <section className="page-hero">
        <div className="page-hero-bg" aria-hidden="true" />
        <div className="container">
          <div className="page-hero-inner">
            <div className="section-kicker">Telepsychiatry across India</div>
            <h1 className="page-hero-title">
              Online psychiatrist consultation in India —{' '}
              <span className="gradient-text">private, verified, and clinician-led.</span>
            </h1>
            <p className="page-hero-lead">
              Book an online psychiatry consultation with verified Indian psychiatrists from anywhere
              in India, including Gujarat. Secure video, audio, or chat sessions with structured
              intake, validated screening (PHQ-9 / GAD-7), clinical assessment, and follow-up where
              appropriate — all built around clinical judgment, not algorithms.
            </p>
            <div className="page-hero-actions">
              <Link className="btn btn-primary btn-lg" to="/book">
                Book an online psychiatry consultation →
              </Link>
              <Link className="btn btn-ghost btn-lg" to="/screening">
                Free PHQ-9 / GAD-7 self-screening
              </Link>
            </div>
            <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(11,36,32,0.65)' }}>
              Available in English, Hindi, and Gujarati where the treating clinician supports the
              language. Sessions for patients across India.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Serenest (E-E-A-T) ─────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Built by a psychiatrist</div>
            <h2>Why patients choose Serenest for online psychiatry in India</h2>
            <p>
              Serenest is a psychiatrist-led telepsychiatry platform from{' '}
              <Link to="/about">Serenest Education Pvt Ltd</Link>. Every clinician on the platform
              is independently verified, with credentials, council registration, and clinical role
              documented before they ever take a patient call.
            </p>
          </div>

          <div className="grid-3">
            <article className="tile">
              <div className="tile-icon">✔️</div>
              <h3>Verified Indian psychiatrists</h3>
              <p>
                Every clinician’s council registration, qualifications, and specialty are
                checked before onboarding.{' '}
                <Link to="/team">Meet the team →</Link>
              </p>
            </article>
            <article className="tile">
              <div className="tile-icon">🔒</div>
              <h3>Private by design</h3>
              <p>
                Encrypted sessions, least-access data, and no third-party ad trackers on
                consultation pages. See our <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </article>
            <article className="tile">
              <div className="tile-icon">📊</div>
              <h3>Clinical, not chat-bot</h3>
              <p>
                Structured intake, PHQ-9 / GAD-7 screening, SOAP notes, and continuity of care
                across follow-ups. Not a triage chatbot — a clinician on the other end.
              </p>
            </article>
            <article className="tile">
              <div className="tile-icon">🌐</div>
              <h3>Pan-India access</h3>
              <p>
                Built to serve patients in metros and smaller cities alike — anywhere in India
                with a stable internet connection.
              </p>
            </article>
            <article className="tile">
              <div className="tile-icon">📝</div>
              <h3>Digital prescription, where appropriate</h3>
              <p>
                Issued under India’s Telemedicine Practice Guidelines, with the prescribing
                doctor’s registration details. Some conditions or medicines may require
                in-person evaluation.
              </p>
            </article>
            <article className="tile">
              <div className="tile-icon">📄</div>
              <h3>Records you can keep</h3>
              <p>
                Session summaries and prescriptions are stored against your account so future
                clinicians can pick up your care without starting over.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">How online psychiatry works on Serenest</div>
            <h2>From self-screening to your first online psychiatrist consultation</h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <ol className="steps">
              {[
                ['Take a free PHQ-9 / GAD-7 screening', 'A confidential 3-minute self-check using validated scales. Screening is a guide, not a diagnosis.', '/screening'],
                ['Pick your slot and pay securely', 'Choose a verified psychiatrist or counsellor and a time that suits you. UPI, cards, net banking.', '/book'],
                ['Join your online consultation', 'Encrypted video, audio, or chat. Most sessions run 30–45 minutes. Bring any past records.', null],
                ['Receive your care plan', 'The clinician shares a summary, follow-up advice, and a digital prescription when appropriate under the Telemedicine Practice Guidelines.', null],
                ['Continue follow-up online', 'Same clinician, same records. Medication review and counselling continue in the same workflow.', null],
              ].map(([title, desc, href], i) => (
                <li key={title} className="step">
                  <div className="step-num">{i + 1}</div>
                  <div className="step-body">
                    <strong>{title}</strong>
                    <p>
                      {desc}
                      {href ? (
                        <>
                          {' '}
                          <Link to={href}>Go →</Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Who it's for ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Who an online psychiatry consultation suits</div>
            <h2>Common reasons patients consult a psychiatrist online</h2>
            <p>
              Common, non-emergency presentations such as low mood, anxiety, sleep problems,
              medication review, and follow-up care often suit online psychiatry consultations.
              Severe or emergency presentations are not appropriate for telepsychiatry — see
              the emergency notice below.
            </p>
          </div>

          <div className="grid-2">
            {[
              ['😔', 'Persistent low mood or loss of interest', 'A psychiatrist can assess for depression, suggest validated screening, and discuss treatment options — therapy, medication, or both.'],
              ['😰', 'Anxiety, panic, or excessive worry', 'GAD-7 screening, structured assessment, and a stepped-care plan based on severity.'],
              ['💤', 'Sleep difficulties affecting daily life', 'Insomnia and sleep-related concerns are evaluated in the context of mood, anxiety, and other health factors.'],
              ['💊', 'Already on psychiatric medication — need a review', 'Bring your current prescription. The clinician reviews response, side-effects, and next steps in line with telemedicine guidelines.'],
              ['🏠', 'In a smaller city or town with no nearby psychiatrist', 'Pan-India access — connect with a verified psychiatrist from Gujarat or any other state.'],
              ['📈', 'You want clinical structure, not advice from forums', 'Validated tools, SOAP-style notes, and a single clinician across follow-ups.'],
            ].map(([icon, title, desc]) => (
              <article key={title} className="tile" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
                <div>
                  <h3 style={{ marginBottom: 8 }}>{title}</h3>
                  <p>{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety / limitations / emergencies ─────────────── */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Important safety information</div>
            <h2>What online psychiatry cannot do</h2>
            <p>
              Online psychiatry is useful for many people, but it has clear limits. Please read
              this section before booking.
            </p>
          </div>

          <div className="callout-box" style={{ marginTop: 8 }}>
            <span className="callout-box-icon">⚠️</span>
            <div>
              <div className="callout-box-title">Not for psychiatric emergencies</div>
              <p className="callout-box-text">
                Serenest is not an emergency service. If you, or someone you know, is in immediate
                danger — including thoughts of self-harm or suicide — please contact a
                local emergency number, go to your nearest hospital, or call iCall:{' '}
                <a href="tel:7777936367" style={{ fontWeight: 700 }}>7777936367</a>
                . In India, you can also reach iCall at icallhelp.in or AASRA at +91-9820466726.
              </p>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 24 }}>
            <article className="tile">
              <h3>No guaranteed diagnosis, cure, or prescription</h3>
              <p>
                Serenest does not promise a diagnosis, cure, or any specific treatment outcome.
                Whether a diagnosis is made, what care is recommended, and whether medication is
                prescribed is a clinical decision by the treating psychiatrist after a proper
                consultation.
              </p>
            </article>
            <article className="tile">
              <h3>Some situations need in-person care</h3>
              <p>
                Acute psychosis, severe self-harm risk, complex substance use, certain controlled
                medications, and some clinical situations may need in-person evaluation. Your
                clinician will tell you if telepsychiatry alone is not appropriate.
              </p>
            </article>
            <article className="tile">
              <h3>Screening is a guide, not a diagnosis</h3>
              <p>
                Self-screening tools such as PHQ-9 and GAD-7 help you and your clinician understand
                severity, but they do not diagnose any condition on their own. A diagnosis requires
                evaluation by a qualified clinician.
              </p>
            </article>
            <article className="tile">
              <h3>Telemedicine Practice Guidelines apply</h3>
              <p>
                Prescriptions — including for psychiatric medication — are issued under
                India’s Telemedicine Practice Guidelines (2020). Some medications cannot be
                prescribed online; others require certain conditions to be met. Clinical judgment
                always comes first.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Pan-India access ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Where patients consult from</div>
            <h2>Online psychiatry across India</h2>
            <p>
              Serenest patients connect from metros, smaller cities, and towns nationwide.
              Sessions are available in English and Hindi where the clinician supports the language.
            </p>
          </div>
          <div className="grid-3">
            <article className="tile">
              <h3>Major metros</h3>
              <p>Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and Ahmedabad.</p>
            </article>
            <article className="tile">
              <h3>Smaller cities &amp; towns</h3>
              <p>Patients consult from tier-2 and tier-3 cities and surrounding districts when local access is limited.</p>
            </article>
            <article className="tile">
              <h3>All states &amp; UTs</h3>
              <p>Serenest is built for pan-India telepsychiatry — not limited to one region or state.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="section alt" id="faq">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">FAQ</div>
            <h2>Online psychiatry consultation — questions patients ask</h2>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {LANDING_FAQS.map(({ q, a }) => (
              <details key={q} className="faq-item" style={{ marginBottom: 12 }}>
                <summary><strong>{q}</strong></summary>
                <p style={{ marginTop: 8 }}>{a}</p>
              </details>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/faq">See the full FAQ →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-body">
              <h2>Ready to book an online psychiatry consultation?</h2>
              <p>
                Take 3 minutes of self-screening, or go straight to booking. Verified Indian
                psychiatrists, transparent pricing, private by design.
              </p>
            </div>
            <div className="cta-banner-actions">
              <Link className="btn btn-primary btn-lg" to="/book">
                Book an online psychiatrist →
              </Link>
              <Link className="btn btn-outline btn-lg" to="/pricing">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
