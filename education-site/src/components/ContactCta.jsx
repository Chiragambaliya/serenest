import { Link } from 'react-router-dom'

export function ContactCta({
  title = 'Ready to learn with clinical rigour?',
  lede = 'Tell us who you are training and what outcome you need. We will propose a clear programme outline.',
}) {
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{lede}</p>
        </div>
        <div className="cta-band__actions">
          <Link className="btn btn--light" to="/contact">
            Get in touch
          </Link>
          <Link className="btn btn--ghost-light" to="/programmes/clinical-excellence">
            View flagship course
          </Link>
        </div>
      </div>
    </section>
  )
}
