import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SNAPSHOT_DIMENSIONS, loadSnapshotSession } from '../../lib/mentalHealthCenter';
import { getTool } from '../../lib/screeningTools';
import { getLandingPathForTool } from '../../lib/checkEvidence';

/**
 * Multi-dimension Mental Health Snapshot.
 * Live dimensions only in the grid; planned tools stay out of the way.
 */
export default function MentalHealthSnapshot({ refreshKey = 0 }) {
  const session = useMemo(() => loadSnapshotSession(), [refreshKey]);
  const live = SNAPSHOT_DIMENSIONS.filter((d) => d.status === 'live');
  const plannedCount = SNAPSHOT_DIMENSIONS.filter((d) => d.status === 'planned').length;

  return (
    <div>
      <div className="mhc-snapshot" role="list" aria-label="Mental health dimensions">
        {live.map((dim) => {
          const tool = dim.toolId ? getTool(dim.toolId) : null;
          const href = tool
            ? getLandingPathForTool(tool.id) || `/screening/tool/${tool.slug}`
            : undefined;

          const saved = session[dim.id];

          const inner = (
            <>
              <span className="mhc-snap-label">{dim.label}</span>
              <span className="mhc-snap-q">{dim.question}</span>
              <span className={`mhc-snap-status${saved ? ' has-result' : ''}`}>
                {saved ? saved.bandLabel || 'Checked this session' : 'Not checked yet'}
              </span>
            </>
          );

          if (!href) {
            return (
              <div key={dim.id} className="mhc-snap-cell" role="listitem">
                {inner}
              </div>
            );
          }

          return (
            <Link key={dim.id} to={href} className="mhc-snap-cell" role="listitem">
              {inner}
            </Link>
          );
        })}
      </div>
      {plannedCount > 0 ? (
        <p className="mhc-snap-more">
          Sleep and digital wellbeing checks are planned — this snapshot will grow without a redesign.
        </p>
      ) : null}
    </div>
  );
}
