/**
 * analyticsConfig.ts — Non-component constants for Performance Workspace
 *
 * Separated from PerformanceShared.tsx to satisfy react-refresh/only-export-components.
 */

import type { RecommendationPriority, TrendDirection } from '../types';

// ─── Priority config ──────────────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<
  RecommendationPriority,
  { label: string; color: string; bg: string; border: string }
> = {
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)'   },
  high:     { label: 'High',     color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)'  },
  medium:   { label: 'Medium',   color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)'  },
  low:      { label: 'Low',      color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.25)' },
};

// ─── Trend config ─────────────────────────────────────────────────────────────

export const TREND_CONFIG: Record<TrendDirection, { color: string; label: string }> = {
  up:   { color: '#10B981', label: '↑' },
  down: { color: '#EF4444', label: '↓' },
  flat: { color: '#94A3B8', label: '→' },
};

// ─── Chart palette ────────────────────────────────────────────────────────────

export const CHART_COLORS = {
  predicted:  '#8B5CF6',
  actual:     '#10B981',
  ctr:        '#3B82F6',
  secondary:  '#F59E0B',
  grid:       'rgba(255,255,255,0.05)',
  axis:       '#475569',
};

// ─── Impact config ────────────────────────────────────────────────────────────

export const IMPACT_CONFIG = {
  high:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   label: 'High Impact'   },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Medium Impact' },
  low:    { color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', label: 'Low Impact'    },
};
