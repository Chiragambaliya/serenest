export function PageHero({ eyebrow, title, lede, actions }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lede ? <p className="page-hero__lede">{lede}</p> : null}
        {actions ? <div className="hero__actions">{actions}</div> : null}
      </div>
    </section>
  )
}
