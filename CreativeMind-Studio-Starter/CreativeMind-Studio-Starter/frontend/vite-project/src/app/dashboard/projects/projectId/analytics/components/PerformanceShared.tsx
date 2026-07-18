/**
 * PerformanceShared.tsx — Reusable UI primitives for the Performance Workspace
 *
 * All exports are React components to satisfy react-refresh rules.
 * Non-component constants live in analyticsConfig.ts.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TrendDirection, RecommendationPriority, TimeRange } from '../types';
import { PRIORITY_CONFIG, TREND_CONFIG, IMPACT_CONFIG } from './analyticsConfig';

// Re-export configs so consumers can import from one place
export { PRIORITY_CONFIG, TREND_CONFIG, CHART_COLORS, IMPACT_CONFIG } from './analyticsConfig';

// ─── SectionLabel ─────────────────────────────────────────────────────────────

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, className = '' }) => (
  <span className={`text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 font-mono ${className}`}>
    {children}
  </span>
);

// ─── TrendBadge ───────────────────────────────────────────────────────────────

interface TrendBadgeProps {
  change: number;
  size?: 'sm' | 'md';
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ change, size = 'md' }) => {
  const isUp = change > 0;
  const isDown = change < 0;
  const color = isUp ? '#10B981' : isDown ? '#EF4444' : '#94A3B8';
  const bg = isUp ? 'rgba(16,185,129,0.1)' : isDown ? 'rgba(239,68,68,0.1)' : 'rgba(148,163,184,0.1)';
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-bold rounded-full ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      }`}
      style={{ color, background: bg }}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {change > 0 ? '+' : ''}{change}%
    </span>
  );
};

// ─── PriorityBadge ────────────────────────────────────────────────────────────

interface PriorityBadgeProps {
  priority: RecommendationPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className="inline-flex text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
};

// ─── ConfidenceBar ────────────────────────────────────────────────────────────

interface ConfidenceBarProps {
  score: number; // 0–100
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  animated?: boolean;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  score,
  label,
  showLabel = true,
  size = 'md',
  animated = true,
}) => {
  const color =
    score >= 80 ? '#10B981'
    : score >= 65 ? '#8B5CF6'
    : score >= 50 ? '#F59E0B'
    : '#EF4444';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-1 rounded-full overflow-hidden bg-white/5 ${size === 'sm' ? 'h-1' : 'h-1.5'}`}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${score}%` }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      {showLabel && label !== undefined ? (
        <span
          className="text-[10px] font-mono font-bold w-8 text-right flex-shrink-0"
          style={{ color }}
        >
          {label}
        </span>
      ) : showLabel ? (
        <span
          className="text-[10px] font-mono font-bold w-8 text-right flex-shrink-0"
          style={{ color }}
        >
          {score}%
        </span>
      ) : null}
    </div>
  );
};

// ─── DnaTrendDot ──────────────────────────────────────────────────────────────

interface DnaTrendDotProps {
  trend: TrendDirection;
}

export const DnaTrendDot: React.FC<DnaTrendDotProps> = ({ trend }) => {
  const cfg = TREND_CONFIG[trend];
  return (
    <span
      className="text-xs font-bold font-mono"
      style={{ color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};

// ─── ImpactBadge ──────────────────────────────────────────────────────────────

interface ImpactBadgeProps {
  impact: 'high' | 'medium' | 'low';
}

export const ImpactBadge: React.FC<ImpactBadgeProps> = ({ impact }) => {
  const cfg = IMPACT_CONFIG[impact];
  return (
    <span
      className="inline-flex text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
};

// ─── MiniSparkline ────────────────────────────────────────────────────────────

interface MiniSparklineProps {
  data: number[];
  color: string;
  height?: number;
  width?: number;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color,
  height = 32,
  width = 80,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyline = pts.join(' ');

  // Area fill path
  const firstX = 0;
  const lastX = width;
  const area = `M${firstX},${height} ${pts.map(p => `L${p}`).join(' ')} L${lastX},${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Area fill */}
      <path d={area} fill={color} fillOpacity="0.12" />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last dot */}
      <circle
        cx={pts[pts.length - 1].split(',')[0]}
        cy={pts[pts.length - 1].split(',')[1]}
        r="2.5"
        fill={color}
      />
    </svg>
  );
};

// ─── CustomChartTooltip ───────────────────────────────────────────────────────

interface TooltipEntry {
  name: string;
  value: number | string;
  color: string;
  unit?: string;
}

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; unit?: string }>;
  label?: string;
  valueFormatter?: (v: number, name: string) => string;
}

export const CustomChartTooltip: React.FC<CustomChartTooltipProps> = ({
  active,
  payload,
  label,
  valueFormatter,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#0B0B12] border border-white/[0.12] rounded-xl px-3.5 py-3 shadow-2xl min-w-44">
      {label && (
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">{label}</p>
      )}
      {payload.map((entry: TooltipEntry, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1.5 last:mb-0">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-[11px] text-slate-400 font-mono">{entry.name}</span>
          </div>
          <span className="text-[12px] font-mono font-bold text-slate-100">
            {valueFormatter ? valueFormatter(entry.value as number, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── TimeRangeSelector ────────────────────────────────────────────────────────

const TIME_RANGES: Array<{ id: TimeRange; label: string }> = [
  { id: '7d',  label: '7D'  },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
  { id: 'all', label: 'All' },
];

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (t: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-0.5 p-0.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
    {TIME_RANGES.map(({ id, label }) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
          value === id
            ? 'bg-[#8B5CF6]/20 text-[#9D6CFF] border border-[#8B5CF6]/30'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

// ─── ComingSoonBadge ──────────────────────────────────────────────────────────

export const ComingSoonBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${className}`}
    style={{
      color: '#9D6CFF',
      background: 'rgba(139,92,246,0.08)',
      borderColor: 'rgba(139,92,246,0.25)',
    }}
  >
    Soon
  </span>
);

// ─── ChartCard wrapper ────────────────────────────────────────────────────────

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title, subtitle, action, children, className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`rounded-2xl border border-white/[0.07] bg-[#151521]/60 overflow-hidden ${className}`}
  >
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
      <div>
        <h3 className="font-display font-semibold text-sm text-white">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
    <div className="p-5">{children}</div>
  </motion.div>
);
