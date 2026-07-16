/**
 * LoadingSkeleton — configurable skeleton placeholder.
 * Pulse animation for content loading states.
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const ROUNDED = {
  sm:   'rounded-[6px]',
  md:   'rounded-[10px]',
  lg:   'rounded-[14px]',
  full: 'rounded-full',
};

/** Base skeleton block — use width/height via className */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', rounded = 'md' }) => (
  <div
    role="status"
    aria-label="Loading…"
    className={`animate-pulse bg-white/[0.05] ${ROUNDED[rounded]} ${className}`}
  />
);

/** Single-line text skeleton */
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`} role="status" aria-label="Loading text…">
    {Array.from({ length: lines }, (_, i) => (
      <div
        key={i}
        className={`h-3 animate-pulse bg-white/[0.05] rounded-full ${
          i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

/** Card-shaped skeleton */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    role="status"
    aria-label="Loading card…"
    className={`rounded-[16px] border border-white/[0.05] bg-[#0B0B12] p-5 space-y-3 ${className}`}
  >
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 flex-shrink-0" rounded="md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-2/3" rounded="full" />
        <Skeleton className="h-2 w-1/3" rounded="full" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex items-center gap-2">
      <Skeleton className="h-7 w-20 flex-shrink-0" rounded="md" />
      <Skeleton className="h-7 w-20 flex-shrink-0" rounded="md" />
    </div>
  </div>
);

/** Sidebar nav skeleton */
export const SkeletonSidebarNav: React.FC = () => (
  <div className="space-y-1.5 px-2 py-4" role="status" aria-label="Loading navigation…">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-2">
        <Skeleton className="w-4 h-4 flex-shrink-0" rounded="sm" />
        <Skeleton className="h-3 flex-1" rounded="full" />
      </div>
    ))}
  </div>
);

/** Grid of skeleton cards */
export const SkeletonGrid: React.FC<{ count?: number; className?: string }> = ({
  count = 6,
  className = '',
}) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    role="status"
    aria-label="Loading content…"
  >
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
