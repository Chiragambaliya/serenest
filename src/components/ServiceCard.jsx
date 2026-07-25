import React from 'react';
import { Link } from 'react-router-dom';
import EdIcon from './EdIcon';

/** Service entry card linking to a future/current service page. */
export default function ServiceCard({ title, body, to, icon }) {
  return (
    <Link to={to} className="ed-service">
      {icon && (
        <span className="ds-icon" aria-hidden="true">
          <EdIcon name={icon} size={20} />
        </span>
      )}
      <h3>{title}</h3>
      <p>{body}</p>
      <span className="ed-service__more">Learn more</span>
    </Link>
  );
}
