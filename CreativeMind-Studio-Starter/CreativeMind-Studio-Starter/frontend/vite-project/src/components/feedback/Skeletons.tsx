/**
 * Skeletons.tsx — Premium loading skeleton system
 *
 * Exports:
 *  Skeleton, SkeletonText     — primitives (re-export from shared)
 *  CardSkeleton               — project / notification card
 *  TableSkeleton              — data table rows
 *  ChartSkeleton              — chart area placeholder
 *  TimelineSkeleton           — activity timeline
 *  ListSkeleton               — simple list rows
 *  FormSkeleton               — form field group
 *  KpiSkeleton                — stat/KPI row
 *  PageSkeleton               — full-page skeleton layout
 */

import React from 'react';
import { motion } from 'framer-motion';

// ─── Base shimmer atom ─────────────────────────────────────────────────────────

interface ShimmerProps {
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  delay?: number;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className = '',
  rounded = 'md',
  delay = 0,
}) => {
  const roundedCls = {
    none: '',
    sm:   'rounded',
    md:   'rounded-lg',
    lg:   'rounded-xl',
    xl:   'rounded-2xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay }}
      aria-hidden="true"
      className={`bg-white/[0.055] ${roundedCls} ${className}`}
    />
  );
};

// ─── Re-exported primitive ────────────────────────────────────────────────────

export { Skeleton, SkeletonText, SkeletonCard as _SkeletonCard } from '../shared/LoadingSkeleton';

// ─── Card Skeleton ─────────────────────────────────────────────────────────────

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    role="status"
    aria-label="Loading…"
    className={`rounded-2xl border border-white/[0.06] bg-[#0E0E1A] p-5 space-y-4 ${className}`}
  >
    {/* Header row */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Shimmer className="w-11 h-11" rounded="xl" />
        <div className="space-y-2">
          <Shimmer className="h-3.5 w-32" rounded="full" />
          <Shimmer className="h-2.5 w-20" rounded="full" delay={0.1} />
        </div>
      </div>
      <Shimmer className="h-6 w-16" rounded="lg" delay={0.05} />
    </div>
    {/* Body */}
    <div className="space-y-2">
      <Shimmer className="h-2.5 w-full" rounded="full" delay={0.1} />
      <Shimmer className="h-2.5 w-5/6" rounded="full" delay={0.15} />
      <Shimmer className="h-2.5 w-3/4" rounded="full" delay={0.2} />
    </div>
    {/* Progress bar */}
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <Shimmer className="h-2 w-16" rounded="full" delay={0.1} />
        <Shimmer className="h-2 w-10" rounded="full" delay={0.1} />
      </div>
      <Shimmer className="h-1.5 w-full" rounded="full" delay={0.15} />
    </div>
    {/* Footer tags */}
    <div className="flex items-center gap-2 pt-1">
      <Shimmer className="h-6 w-18" rounded="lg" delay={0.1} />
      <Shimmer className="h-6 w-22" rounded="lg" delay={0.15} />
      <Shimmer className="ml-auto h-7 w-7" rounded="lg" delay={0.2} />
    </div>
  </div>
);

// ─── Table Skeleton ────────────────────────────────────────────────────────────

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 6,
  cols = 5,
  className = '',
}) => (
  <div
    role="status"
    aria-label="Loading table…"
    className={`rounded-2xl border border-white/[0.06] bg-[#0E0E1A] overflow-hidden ${className}`}
  >
    {/* Header */}
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
      {Array.from({ length: cols }, (_, i) => (
        <Shimmer key={i} className={`h-3 ${i === 0 ? 'w-32' : 'flex-1'}`} rounded="full" delay={i * 0.05} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, r) => (
      <div key={r} className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-0">
        <div className="flex items-center gap-3 w-32 flex-shrink-0">
          <Shimmer className="w-7 h-7" rounded="full" delay={r * 0.04} />
          <Shimmer className="h-3 flex-1" rounded="full" delay={r * 0.04 + 0.05} />
        </div>
        {Array.from({ length: cols - 1 }, (_, c) => (
          <Shimmer
            key={c}
            className={`h-3 flex-1 ${c === cols - 2 ? 'w-16' : ''}`}
            rounded="full"
            delay={r * 0.04 + c * 0.03}
          />
        ))}
      </div>
    ))}
  </div>
);

// ─── Chart Skeleton ────────────────────────────────────────────────────────────

export const ChartSkeleton: React.FC<{ className?: string; variant?: 'bar' | 'line' | 'area' }> = ({
  className = '',
  variant = 'bar',
}) => (
  <div
    role="status"
    aria-label="Loading chart…"
    className={`rounded-2xl border border-white/[0.06] bg-[#0E0E1A] p-5 space-y-4 ${className}`}
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Shimmer className="h-4 w-36" rounded="lg" />
        <Shimmer className="h-2.5 w-24" rounded="full" delay={0.05} />
      </div>
      <div className="flex items-center gap-2">
        <Shimmer className="h-7 w-20" rounded="lg" delay={0.05} />
        <Shimmer className="h-7 w-20" rounded="lg" delay={0.1} />
      </div>
    </div>

    {/* Chart area */}
    <div className="h-44 flex items-end gap-2 pt-4 border-b border-white/[0.05]">
      {variant === 'bar'
        ? Array.from({ length: 12 }, (_, i) => {
            const h = [40, 65, 50, 80, 55, 90, 70, 45, 75, 60, 85, 50][i];
            return (
              <Shimmer
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%` } as React.CSSProperties}
                rounded="sm"
                delay={i * 0.03}
              />
            );
          })
        : <Shimmer className="w-full h-full" rounded="lg" delay={0.1} />
      }
    </div>

    {/* X-axis labels */}
    <div className="flex items-center gap-2">
      {Array.from({ length: 6 }, (_, i) => (
        <Shimmer key={i} className="h-2 flex-1" rounded="full" delay={i * 0.05} />
      ))}
    </div>
  </div>
);

// ─── Timeline Skeleton ────────────────────────────────────────────────────────

export const TimelineSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className = '',
}) => (
  <div role="status" aria-label="Loading timeline…" className={`space-y-0 ${className}`}>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex gap-4">
        {/* Spine */}
        <div className="flex flex-col items-center flex-shrink-0 w-9">
          <Shimmer className="w-7 h-7" rounded="full" delay={i * 0.06} />
          {i < rows - 1 && <div className="w-px flex-1 mt-1 bg-white/[0.06] min-h-[32px]" />}
        </div>
        {/* Content */}
        <div className="flex-1 pb-6 space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <Shimmer className="h-3.5 w-48" rounded="full" delay={i * 0.06 + 0.05} />
            <Shimmer className="h-2.5 w-16" rounded="full" delay={i * 0.06 + 0.08} />
          </div>
          <Shimmer className="h-2.5 w-full" rounded="full" delay={i * 0.06 + 0.1} />
          <Shimmer className="h-2.5 w-4/5" rounded="full" delay={i * 0.06 + 0.13} />
          <div className="flex gap-2 pt-1">
            <Shimmer className="h-5 w-20" rounded="lg" delay={i * 0.06 + 0.15} />
            <Shimmer className="h-5 w-16" rounded="lg" delay={i * 0.06 + 0.18} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── List Skeleton ─────────────────────────────────────────────────────────────

export const ListSkeleton: React.FC<{ rows?: number; className?: string; avatar?: boolean }> = ({
  rows = 6,
  avatar = true,
  className = '',
}) => (
  <div
    role="status"
    aria-label="Loading list…"
    className={`rounded-2xl border border-white/[0.06] bg-[#0E0E1A] overflow-hidden divide-y divide-white/[0.04] ${className}`}
  >
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex items-center gap-3 px-5 py-3.5">
        {avatar && <Shimmer className="w-9 h-9 flex-shrink-0" rounded="full" delay={i * 0.04} />}
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3 w-3/5" rounded="full" delay={i * 0.04 + 0.05} />
          <Shimmer className="h-2.5 w-2/5" rounded="full" delay={i * 0.04 + 0.08} />
        </div>
        <Shimmer className="h-6 w-16 flex-shrink-0" rounded="lg" delay={i * 0.04 + 0.1} />
      </div>
    ))}
  </div>
);

// ─── Form Skeleton ─────────────────────────────────────────────────────────────

export const FormSkeleton: React.FC<{ fields?: number; className?: string }> = ({
  fields = 5,
  className = '',
}) => (
  <div role="status" aria-label="Loading form…" className={`space-y-5 ${className}`}>
    {Array.from({ length: fields }, (_, i) => (
      <div key={i} className="space-y-2">
        <Shimmer className="h-3 w-24" rounded="full" delay={i * 0.06} />
        <Shimmer className="h-10 w-full" rounded="xl" delay={i * 0.06 + 0.05} />
        {i === 1 && <Shimmer className="h-2.5 w-2/3" rounded="full" delay={i * 0.06 + 0.1} />}
      </div>
    ))}
    <div className="flex items-center gap-3 pt-2">
      <Shimmer className="h-10 w-32" rounded="xl" delay={0.3} />
      <Shimmer className="h-10 w-24" rounded="xl" delay={0.35} />
    </div>
  </div>
);

// ─── KPI Skeleton ──────────────────────────────────────────────────────────────

export const KpiSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 4,
  className = '',
}) => (
  <div
    role="status"
    aria-label="Loading metrics…"
    className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
  >
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0E0E1A] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <Shimmer className="h-2.5 w-20" rounded="full" delay={i * 0.06} />
          <Shimmer className="w-8 h-8" rounded="lg" delay={i * 0.06 + 0.05} />
        </div>
        <Shimmer className="h-7 w-28" rounded="lg" delay={i * 0.06 + 0.1} />
        <Shimmer className="h-2.5 w-full" rounded="full" delay={i * 0.06 + 0.15} />
      </div>
    ))}
  </div>
);

// ─── Page Skeleton (full layout) ───────────────────────────────────────────────

export const PageSkeleton: React.FC = () => (
  <div className="w-full min-h-full px-6 md:px-8 py-8 space-y-8" role="status" aria-label="Loading page…">
    {/* Page header */}
    <div className="space-y-2">
      <Shimmer className="h-7 w-56" rounded="xl" />
      <Shimmer className="h-3.5 w-80" rounded="full" delay={0.05} />
    </div>
    {/* KPIs */}
    <KpiSkeleton />
    {/* Two-column */}
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
      <div className="xl:col-span-3 space-y-8">
        <CardSkeleton />
        <ListSkeleton />
      </div>
      <div className="xl:col-span-2 space-y-8">
        <ChartSkeleton />
        <TimelineSkeleton rows={4} />
      </div>
    </div>
  </div>
);
