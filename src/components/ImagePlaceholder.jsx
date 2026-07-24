import React from 'react';

/**
 * Honest stand-in for photography that doesn't exist yet. Deliberately
 * plain — a flat neutral fill and a small caption naming the exact asset
 * needed — not decorative filler art pretending to be a finished image.
 */
export default function ImagePlaceholder({ asset, className = '' }) {
  return (
    <div className={`image-placeholder ${className}`}>
      <span className="image-placeholder__label">Image needed: {asset}</span>
    </div>
  );
}
