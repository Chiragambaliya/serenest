import React from 'react';

/**
 * Honest stand-in for photography that doesn't exist yet. Deliberately
 * plain — a flat neutral fill and a small caption naming the exact asset
 * needed — not decorative filler art pretending to be a finished image.
 */
export default function ImagePlaceholder({
  asset,
  direction,
  className = '',
  src,
  alt = '',
  loading = 'lazy',
  objectPosition = 'center',
  width = 1536,
  height = 1024,
}) {
  if (src) {
    return (
      <img
        className={`editorial-image ${className}`}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        style={{ objectPosition }}
      />
    );
  }

  return (
    <div className={`image-placeholder ${className}`}>
      <span className="image-placeholder__label">
        Image needed: {asset}
        {direction ? <span className="image-placeholder__direction">{direction}</span> : null}
      </span>
    </div>
  );
}
