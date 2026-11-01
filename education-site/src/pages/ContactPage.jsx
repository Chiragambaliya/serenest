import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { usePageTitle } from '../hooks/usePageTitle'

export function ContactPage() {
  usePageTitle('Contact')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [message, setMessage] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`Serenest Education — enquiry from ${name || 'website'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nOrganisation: ${org}\n\n${message}`,
    )
    window.location.href = `mailto:support@serenest.in?subject=${subject}&body=${body}`
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you need"
        lede="Programmes, cohorts, workplace sessions, or campus workshops — we reply with a clear next step."
      />
      <section className="section">
        <div className="container contact-grid">
          <form className="contact-form" onSubmit={onSubmit}>
            <label className="field">
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="field">
              <span>Organisation (optional)</span>
              <input value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" />
            </label>
            <label className="field">
              <span>How can we help?</span>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="e.g. Clinical Excellence cohort for 20 psychologists…"
              />
            </label>
            <button type="submit" className="btn btn--primary">
              Email Serenest Education
            </button>
          </form>
          <aside className="side-card">
            <p className="side-card__label">Direct</p>
            <p>
              <a href="mailto:support@serenest.in">support@serenest.in</a>
            </p>
            <p className="side-card__label">Clinical care</p>
            <p>
              For consultations, visit{' '}
              <a href="https://www.serenest.in" target="_blank" rel="noreferrer">
                serenest.in
              </a>
              .
            </p>
            <p className="side-card__label">Emergencies</p>
            <p>This site is not a crisis service. In India, dial 112 or 108.</p>
          </aside>
        </div>
      </section>
    </>
  )
}
