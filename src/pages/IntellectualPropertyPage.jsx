import React from 'react';

const UPDATED = 'June 2026';

export default function IntellectualPropertyPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Legal</p>
            <h1 className="page-title">Copyright &amp; Intellectual Property Policy</h1>
            <p className="about-subtext">
              This policy explains who owns the content on Serenest, what you may and may not do with it,
              and how to report an infringement.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Ownership of Platform Content</h2>
              <p className="muted">The Serenest name, logo, website design, software, source code, written content, educational materials, graphics, and all other platform elements are the intellectual property of Serenest Education Pvt Ltd, protected under the Copyright Act 1957, the Trade Marks Act 1999, and applicable Indian and international IP law.</p>
              <p className="muted" style={{ marginTop: 8 }}>All rights are reserved. You may not reproduce, distribute, modify, or create derivative works from any Serenest-owned content without prior written permission.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>What You May Do</h2>
              <ul className="list">
                <li>Access and use the platform for your personal, non-commercial healthcare or professional purposes.</li>
                <li>Share a link to a public Serenest page (including professional profiles) on social media or in personal communications.</li>
                <li>Download or print content from our public pages for your own personal reference — not for redistribution.</li>
                <li>Quote brief excerpts with proper attribution to Serenest (e.g. in academic work or journalism).</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>What You May Not Do</h2>
              <ul className="list">
                <li>Scrape, crawl, or systematically extract data or content from the platform.</li>
                <li>Republish, resell, or commercially exploit any Serenest content.</li>
                <li>Remove or alter any copyright, trademark, or proprietary notices.</li>
                <li>Use the Serenest name, logo, or branding in any way that suggests endorsement or affiliation without written consent.</li>
                <li>Copy the platform's design, layout, or code to build a competing or derivative service.</li>
                <li>Use our content to train AI/ML models without express permission.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Content You Upload or Submit</h2>
              <p className="muted">When you submit content to Serenest (such as profile information, session notes, reviews, or applications), you retain ownership of that content but grant Serenest a non-exclusive, royalty-free licence to use, store, and process it for the purpose of operating the platform.</p>
              <p className="muted" style={{ marginTop: 8 }}>You warrant that any content you submit does not infringe a third party's intellectual property rights. If it does, you are solely responsible for any resulting claim.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Professional Content (Session Notes &amp; Prescriptions)</h2>
              <p className="muted">Clinical notes and prescriptions created by professionals during sessions on the platform remain the professional's clinical record. Serenest stores these records as a processor on behalf of the professional and the patient. Neither party may share, reproduce, or commercialise the other's clinical records.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Trademarks</h2>
              <p className="muted">"Serenest" and the Serenest logo are trademarks of Serenest Education Pvt Ltd. Use of these marks in any form — including in domain names, app names, or marketing — requires written permission. Unauthorised use may constitute passing off or trade mark infringement under Indian law.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Reporting an Infringement</h2>
              <p className="muted">If you believe that content on the Serenest platform infringes your intellectual property rights, please send a notice to <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a> with the subject line <strong>IP INFRINGEMENT NOTICE</strong> and include:</p>
              <ul className="list" style={{ marginTop: 8 }}>
                <li>A description of the copyrighted work or trademark you claim has been infringed.</li>
                <li>The URL or location on Serenest where the infringing content appears.</li>
                <li>Your contact details and a statement that you are the rights owner or authorised to act on their behalf.</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>We will investigate and respond within 15 working days. Repeated infringers will have their accounts terminated.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Governing Law</h2>
              <p className="muted">This policy is governed by the laws of India, including the Copyright Act 1957 and the Trade Marks Act 1999. Any disputes shall be subject to the exclusive jurisdiction of the courts of Rajkot, Gujarat.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
