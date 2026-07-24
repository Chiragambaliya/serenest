import { useState } from 'react'
import { ContactCta } from '../components/ContactCta'
import { PageHero } from '../components/PageHero'
import { usePageTitle } from '../hooks/usePageTitle'
import { faqs } from '../data/programs'

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' is-open' : ''}`}>
      <button type="button" className="faq-item__q" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open ? <p className="faq-item__a">{a}</p> : null}
    </div>
  )
}

export function FaqPage() {
  usePageTitle('FAQ')

  return (
    <>
      <PageHero eyebrow="FAQ" title="Clear answers" lede="What we teach, who it is for, and where clinical care begins." />
      <section className="section">
        <div className="container narrow">
          <div className="faq-list">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  )
}
