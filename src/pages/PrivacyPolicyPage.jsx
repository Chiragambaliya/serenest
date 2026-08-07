import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { openPrivacyChoices } from '../lib/privacyConsent';

const PRINCIPLES = [
  {
    title: 'No sale of your data',
    body: 'We do not sell personal or health information, and we do not use advertising trackers.',
  },
  {
    title: 'Least-access care',
    body: 'Access is limited to you, your treating professional, and authorised staff who need it to operate the service.',
  },
  {
    title: 'Choice before analytics',
    body: 'Optional analytics remain off unless you allow them. You can change that choice at any time.',
  },
];

const DATA_USES = [
  {
    title: 'Account and contact',
    body: 'Name, phone, optional email, login details, and communication preferences. Used to create your account, verify access, and contact you about care.',
  },
  {
    title: 'Appointments and care',
    body: 'Bookings, assessment responses, clinical notes, and prescriptions where applicable. Used to deliver care and maintain clinical continuity.',
  },
  {
    title: 'Payments and support',
    body: 'Transaction references, invoices, and messages you send to support. Used for billing, assistance, and dispute resolution.',
  },
  {
    title: 'Security and optional usage',
    body: 'Basic device and access logs protect the service. Page and referral analytics are collected only if you opt in; they must not include clinical answers.',
  },
];

const RIGHTS = [
  { title: 'Access', body: 'Ask what personal data we hold about you.' },
  { title: 'Correction', body: 'Ask us to correct incomplete or inaccurate details.' },
  { title: 'Deletion', body: 'Request deletion, subject to medical and financial record duties.' },
  { title: 'Grievance', body: 'Raise a privacy concern and receive a clear response.' },
];

const SERVICE_PROVIDERS = [
  {
    category: 'Cloud hosting, database and authentication',
    providers: 'Render and Supabase',
    purpose: 'Host the service, secure accounts, and store platform records.',
  },
  {
    category: 'Video consultation',
    providers: 'Daily.co',
    purpose: 'Provide live video, audio, and consultation-room infrastructure.',
  },
  {
    category: 'Payments',
    providers: 'Razorpay',
    purpose: 'Process payments and return transaction status. Serenest does not store full card details.',
  },
  {
    category: 'Email and communications',
    providers: 'Resend and configured messaging providers',
    purpose: 'Send appointment, account, support, and operational communications.',
  },
  {
    category: 'Optional analytics',
    providers: 'Google Analytics, when enabled and consented to',
    purpose: 'Measure page usage. Advertising storage and personalisation are disabled.',
  },
];

const NOTICE_LINKS = [
  ['scope', 'Scope and controller'],
  ['sources', 'Data and sources'],
  ['grounds', 'Purposes and grounds'],
  ['sharing', 'Sharing and providers'],
  ['transfers', 'International processing'],
  ['retention', 'Retention and deletion'],
  ['security', 'Security and incidents'],
  ['rights', 'Your legal rights'],
  ['children', 'Children and guardians'],
  ['clinical', 'Clinical and automated tools'],
  ['updates', 'Changes and contact'],
];

export default function PrivacyPolicyPage() {
  useSEO({ path: '/privacy', ...ROUTE_SEO['/privacy'] });
  return (
    <div className="page privacy-page">
      <section className="privacy-page__hero">
        <div className="container privacy-page__hero-grid">
          <div>
            <p className="kicker">Privacy at Serenest</p>
            <h1 className="privacy-page__title">Your health information is yours.</h1>
            <p className="privacy-page__lede">
              Mental healthcare requires trust. This notice explains, in plain language, what Serenest
              collects, why we need it, who can see it, and the choices you control.
            </p>
            <p className="privacy-page__meta">
              Effective 7 August 2026 · Data controller: Serenest Education Pvt Ltd, India
            </p>
          </div>
          <aside className="privacy-promise" aria-label="Our privacy promise">
            <span className="privacy-promise__label">Our promise</span>
            <p>Care first. Collect less. Never turn sensitive information into advertising.</p>
            <small>Questions? support@serenest.in</small>
          </aside>
        </div>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-principles-title">
        <div className="container">
          <header className="privacy-section__head">
            <span className="privacy-section__label">01 · Commitments</span>
            <h2 id="privacy-principles-title">Privacy principles you can hold us to.</h2>
          </header>
          <div className="privacy-principles">
            {PRINCIPLES.map((item, index) => (
              <article className="privacy-card" key={item.title}>
                <span className="privacy-card__number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="privacy-section privacy-section--dark" aria-labelledby="privacy-data-title">
        <div className="container">
          <header className="privacy-section__head">
            <span className="privacy-section__label">02 · Data map</span>
            <h2 id="privacy-data-title">What we use, and what it is for.</h2>
          </header>
          <div className="privacy-data-grid">
            {DATA_USES.map((item) => (
              <article className="privacy-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="privacy-page__actions">
            <Link className="btn btn-ghost" to="/data-retention">See retention periods →</Link>
            <Link className="btn btn-ghost" to="/cookie-policy">Read cookie details →</Link>
          </div>
        </div>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-rights-title">
        <div className="container">
          <header className="privacy-section__head">
            <span className="privacy-section__label">03 · Your rights</span>
            <h2 id="privacy-rights-title">You stay in control.</h2>
          </header>
          <div className="privacy-rights">
            {RIGHTS.map((item, index) => (
              <article className="privacy-card" key={item.title}>
                <span className="privacy-card__number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="privacy-page__actions">
            <button className="btn btn-primary" type="button" onClick={openPrivacyChoices}>
              Manage privacy choices
            </button>
            <a className="btn btn-ghost" href="mailto:support@serenest.in?subject=Privacy%20request">
              Make a privacy request
            </a>
            <Link className="btn btn-ghost" to="/grievance-policy">Grievance process</Link>
          </div>
          <div className="callout" style={{ marginTop: 40 }}>
            <div className="callout-title">Security and necessary disclosure</div>
            <p className="muted" style={{ margin: 0 }}>
              We use encryption in transit, access controls, and audit logs. No system is risk-free.
              We may disclose data when required by law, to protect someone from serious harm, or to
              providers that process data for us under appropriate safeguards. If you believe your account
              is compromised, email <a href="mailto:support@serenest.in">support@serenest.in</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="privacy-section privacy-notice" aria-labelledby="complete-notice-title">
        <div className="container">
          <header className="privacy-section__head">
            <span className="privacy-section__label">04 · Full notice</span>
            <h2 id="complete-notice-title">The complete legal detail.</h2>
          </header>

          <div className="privacy-notice__layout">
            <nav className="privacy-notice__nav" aria-label="Privacy notice contents">
              <p>On this page</p>
              <ol>
                {NOTICE_LINKS.map(([id, label], index) => (
                  <li key={id}>
                    <a href={`#privacy-${id}`}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="privacy-notice__body">
              <article id="privacy-scope" className="privacy-notice__article">
                <span className="privacy-notice__number">01</span>
                <h3>Scope and data controller</h3>
                <p>
                  This Privacy Policy applies to serenest.in, Serenest accounts, appointment and
                  teleconsultation services, mental-health checks, professional and Academy services,
                  support channels, and related communications. It applies to website visitors, patients,
                  guardians, professionals, learners, and people who contact us.
                </p>
                <p>
                  Serenest Education Pvt Ltd (&quot;Serenest&quot;, &quot;we&quot;, &quot;us&quot;) is the
                  Data Fiduciary responsible for deciding why and how personal data is processed. For
                  privacy questions or requests, email{' '}
                  <a href="mailto:support@serenest.in">support@serenest.in</a>. This policy should be read
                  with our <Link to="/terms">Terms</Link>, <Link to="/consent">Teleconsultation Consent</Link>,
                  and <Link to="/data-retention">Data Retention Policy</Link>.
                </p>
              </article>

              <article id="privacy-sources" className="privacy-notice__article">
                <span className="privacy-notice__number">02</span>
                <h3>Personal data and where it comes from</h3>
                <p>We may receive personal data from:</p>
                <ul>
                  <li>
                    <strong>You or your guardian:</strong> identity and contact details, age or date of
                    birth, account credentials, booking choices, messages, forms, consent records,
                    assessment answers, health history, documents, and payment references.
                  </li>
                  <li>
                    <strong>Your treating professional:</strong> appointment status, clinical notes,
                    diagnoses, care plans, prescriptions, referrals, and records created during care.
                  </li>
                  <li>
                    <strong>Your device:</strong> IP address, browser and device type, security and access
                    logs, error data, cookie choices, and—only with permission—page and referral analytics.
                  </li>
                  <li>
                    <strong>Service providers:</strong> authentication status, payment confirmation,
                    communication delivery status, and consultation-room events needed to operate the service.
                  </li>
                </ul>
                <p>
                  Please provide only data that is accurate and relevant. Do not submit another
                  person&apos;s health information unless you are authorised to act for them.
                </p>
              </article>

              <article id="privacy-grounds" className="privacy-notice__article">
                <span className="privacy-notice__number">03</span>
                <h3>Why we process data and the applicable grounds</h3>
                <p>
                  We process personal data for specified, lawful purposes: to create and secure accounts;
                  arrange and deliver care; maintain medical and prescription records; process payments;
                  communicate about services; answer support and grievance requests; prevent fraud and
                  misuse; maintain reliability; and comply with legal, tax, medical, and regulatory duties.
                </p>
                <p>
                  Depending on the context, processing is based on your consent, on data you voluntarily
                  provide for a specified service, on compliance with law or a court order, on responding
                  to a medical emergency or threat to life, or on another legitimate use permitted by the
                  Digital Personal Data Protection Act, 2023 and applicable rules. Optional analytics and
                  promotional communications depend on consent and can be withdrawn.
                </p>
                <div className="privacy-note">
                  <strong>When data is required.</strong> Fields marked as required are needed to provide
                  the requested service or meet a legal or clinical duty. If you do not provide them, we
                  may be unable to create an account, confirm a booking, process payment, or safely deliver care.
                </div>
              </article>

              <article id="privacy-sharing" className="privacy-notice__article">
                <span className="privacy-notice__number">04</span>
                <h3>Who receives data</h3>
                <p>
                  We do not sell personal or health information. We disclose only what is reasonably
                  necessary to treating professionals, authorised Serenest personnel, contracted service
                  providers, professional advisers, payment and fraud-prevention partners, and public
                  authorities when disclosure is legally required or necessary to protect life and safety.
                  Employers, insurers, and family members do not receive your clinical information merely
                  because they ask for it; disclosure requires your direction or another lawful basis.
                </p>
                <div className="privacy-table-wrap">
                  <table className="privacy-table">
                    <caption>Principal service-provider categories</caption>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Provider</th>
                        <th>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SERVICE_PROVIDERS.map((provider) => (
                        <tr key={provider.category}>
                          <td>{provider.category}</td>
                          <td>{provider.providers}</td>
                          <td>{provider.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>
                  Providers process data under their own legal obligations and/or our instructions.
                  Provider availability may change as the service evolves; material changes will be
                  reflected in this notice.
                </p>
              </article>

              <article id="privacy-transfers" className="privacy-notice__article">
                <span className="privacy-notice__number">05</span>
                <h3>International processing</h3>
                <p>
                  Some service providers may process or support data from locations outside India.
                  Where cross-border processing occurs, we select providers with appropriate security
                  commitments, limit the data shared, use contractual and access safeguards, and comply
                  with transfer restrictions notified under Indian law. Contact us for current information
                  about a provider used for your service.
                </p>
              </article>

              <article id="privacy-retention" className="privacy-notice__article">
                <span className="privacy-notice__number">06</span>
                <h3>Retention, deletion, and anonymisation</h3>
                <p>
                  We retain each category only for its stated purpose, legal or medical record duty,
                  security needs, or dispute resolution. Clinical and billing records may need to remain
                  restricted even after account deletion. When retention is no longer required, data is
                  securely deleted or irreversibly anonymised. Deletion from encrypted backups occurs
                  through the normal backup lifecycle rather than immediately.
                </p>
                <p>
                  See the <Link to="/data-retention">Data Retention Policy</Link> for category-specific
                  periods and exceptions.
                </p>
              </article>

              <article id="privacy-security" className="privacy-notice__article">
                <span className="privacy-notice__number">07</span>
                <h3>Security and personal-data incidents</h3>
                <p>
                  We use safeguards appropriate to the nature of the data, including encrypted transport,
                  restricted access, authentication controls, logging, backups, rate limits, and provider
                  security reviews. Personnel and professionals must access data only for authorised purposes.
                  No online service can guarantee absolute security.
                </p>
                <p>
                  We investigate suspected personal-data breaches, take steps to contain and remediate
                  them, preserve relevant records, and notify affected people and the Data Protection Board
                  of India when required by applicable law. Report suspected unauthorised access immediately
                  to <a href="mailto:support@serenest.in?subject=Urgent%20privacy%20incident">support@serenest.in</a>.
                </p>
              </article>

              <article id="privacy-rights" className="privacy-notice__article">
                <span className="privacy-notice__number">08</span>
                <h3>Your rights and how to exercise them</h3>
                <p>Subject to applicable law, you may:</p>
                <ul>
                  <li>request a summary of personal data being processed and relevant disclosures;</li>
                  <li>correct, complete, or update inaccurate personal data;</li>
                  <li>request erasure where retention is not required for a specified purpose or by law;</li>
                  <li>withdraw consent as easily as it was given, without affecting earlier lawful processing;</li>
                  <li>use our grievance process and, after exhausting it, approach the competent authority; and</li>
                  <li>nominate another individual to exercise your rights in the event of death or incapacity.</li>
                </ul>
                <p>
                  Email <a href="mailto:support@serenest.in?subject=Data%20rights%20request">support@serenest.in</a>{' '}
                  with the subject &quot;Data rights request&quot;, the email or phone linked to your account,
                  and the right you wish to exercise. Do not email identity documents unless requested.
                  We may ask for proportionate information to verify identity or authority. We acknowledge
                  requests promptly and aim to complete standard requests within 30 days; complex or
                  legally restricted requests may take longer, and we will explain why.
                </p>
                <p>
                  For unresolved concerns, follow our <Link to="/grievance-policy">Grievance Policy</Link>.
                  You may approach the Data Protection Board of India where the law permits after first
                  using Serenest&apos;s grievance process.
                </p>
              </article>

              <article id="privacy-children" className="privacy-notice__article">
                <span className="privacy-notice__number">09</span>
                <h3>Children and people represented by guardians</h3>
                <p>
                  A person under 18 must use clinical services through a parent or lawful guardian unless
                  an applicable legal exception permits otherwise. We may take reasonable steps to verify
                  the guardian and their authority before processing the child&apos;s data. We do not use
                  children&apos;s data for targeted advertising, tracking, or behavioural monitoring.
                  Guardians may exercise privacy rights on the child&apos;s behalf, subject to clinical,
                  safeguarding, and legal duties.
                </p>
              </article>

              <article id="privacy-clinical" className="privacy-notice__article">
                <span className="privacy-notice__number">10</span>
                <h3>Clinical confidentiality, screening, and automated tools</h3>
                <p>
                  Consultation records are confidential but may be disclosed where required by law,
                  professional duty, a court order, safeguarding obligations, or a serious and imminent
                  threat to life. Sessions are not recorded by Serenest unless a separate, explicit consent
                  process is provided.
                </p>
                <p>
                  Self-screening tools may calculate a score using fixed clinical rules. A score is not a
                  diagnosis and does not replace professional assessment. Serenest does not use a solely
                  automated system to make treatment, prescribing, or emergency-care decisions. Where an
                  AI-assisted feature is offered, it will be identified in context and must not be used as
                  a substitute for clinical care.
                </p>
              </article>

              <article id="privacy-updates" className="privacy-notice__article">
                <span className="privacy-notice__number">11</span>
                <h3>Policy changes and contact</h3>
                <p>
                  We may update this policy when services, providers, or legal requirements change. The
                  effective date at the top identifies the current version. If a change materially affects
                  how existing personal data is used, we will provide an appropriate notice and seek fresh
                  consent where required.
                </p>
                <div className="privacy-contact-card">
                  <p><strong>Serenest Education Pvt Ltd</strong></p>
                  <p>Data Fiduciary and platform operator · India</p>
                  <p><a href="mailto:support@serenest.in">support@serenest.in</a> · <a href="tel:+917777936367">+91 77779 36367</a></p>
                  <p>Privacy and grievance contact: Dr. Chirag Aambalia, Grievance Officer</p>
                </div>
                <p className="privacy-notice__source">
                  This notice is designed with reference to India&apos;s Digital Personal Data Protection
                  Act, 2023, applicable rules, the Information Technology Act, 2000 and rules made under it,
                  and healthcare record and professional-confidentiality obligations.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

