import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label="Loading weather forecast">
      {/* Hero card skeleton */}
      <div className="skeleton-hero glass-card">
        <div className="skeleton-line shimmer title" />
        <div className="skeleton-line shimmer subtitle" />
        <div className="skeleton-row">
          <div className="skeleton-circle shimmer" />
          <div className="skeleton-line shimmer big-temp" />
        </div>
        <div className="skeleton-pills-row">
          <div className="skeleton-pill shimmer" />
          <div className="skeleton-pill shimmer" />
          <div className="skeleton-pill shimmer" />
        </div>
      </div>

      {/* Hourly skeleton */}
      <div className="skeleton-section glass-card">
        <div className="skeleton-line shimmer section-header-line" />
        <div className="skeleton-hourly-strip">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-hour-card shimmer" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="skeleton-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-metric-card glass-card shimmer" />
        ))}
      </div>
    </div>
  );
}
