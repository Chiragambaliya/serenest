import React from 'react';
import { Link } from 'react-router-dom';
import { getLandingPathForTool } from '../../lib/checkEvidence';

export default function CheckCard({ tool }) {
  const href = getLandingPathForTool(tool.id) || `/screening/tool/${tool.slug}`;
  return (
    <Link to={href} className="mhc-card">
      <div className="mhc-card-top">
        <div>
          <h3 className="mhc-card-title">{tool.humanTitle}</h3>
          <p className="mhc-card-scale">{tool.name}</p>
        </div>
        <span className="mhc-card-time">~{tool.minutes} min</span>
      </div>
      <p>{tool.whatItChecks || tool.blurb}</p>
      <p className="mhc-card-meta">
        <strong>Who it’s for:</strong> {tool.audience}
      </p>
      <span className="mhc-card-cta">Begin →</span>
    </Link>
  );
}
