import { Link } from 'react-router-dom'
import { programs } from '../data/programs'

export function ProgramGrid({ filter }) {
  const list = filter ? programs.filter((p) => p.audience === filter) : programs

  return (
    <div className="prog-grid">
      {list.map((p) => (
        <article key={p.id} className={`prog-card${p.featured ? ' prog-card--featured' : ''}`}>
          <span className="prog-card__badge">{p.badge}</span>
          <h3>{p.title}</h3>
          <p className="prog-card__meta">{p.meta}</p>
          <p>{p.desc}</p>
          <Link className="prog-card__link" to={p.href || '/programmes'}>
            {p.featured ? 'Open flagship →' : 'Learn more →'}
          </Link>
        </article>
      ))}
    </div>
  )
}
