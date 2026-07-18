/**
 * DistributionShared.tsx — Reusable UI primitives for the Distribution Room
 *
 * Exports (components only — satisfies react-refresh/only-export-components):
 *   StatusBadge         — coloured publication-status pill
 *   PlatformIcon        — SVG icon resolver for each platform
 *   ReadinessBar        — animated progress bar
 *   DiffTag             — highlight pill for comparison view
 *   SectionLabel        — small uppercase label
 *   ThumbnailStatusDot  — coloured dot for thumbnail state
 *   MemberAvatar        — initials avatar with colour
 *   InsightPill         — priority badge for recommendations
 *   ComingSoonBadge     — coming-soon indicator
 *
 * Non-component constants live in distributionConfig.ts.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  PlayCircle, Camera,
  Mail, Mic, FileText, Layout,
  CheckCircle2, Loader2, Send, Eye, Zap,
} from 'lucide-react';
import type { PublicationStatus, PlatformId, DiffType } from '../types';
import {
  STATUS_CONFIG,
  DIFF_CONFIG,
  PRIORITY_CONFIG,
  THUMB_COLORS,
  THUMB_LABELS,
  PLATFORM_COLORS,
} from './distributionConfig';

// Re-export STATUS_CONFIG so existing consumers don't need a separate import
export { STATUS_CONFIG } from './distributionConfig';

// Silence unused import warnings for the icon set used in STATUS_CONFIG at runtime
const _icons = { CheckCircle2, Loader2, Send, Eye, Zap };
void _icons;

// ─── StatusBadge ──────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: PublicationStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.Icon;
  const isGenerating = status === 'generating';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <Icon
        className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${isGenerating ? 'animate-spin' : ''}`}
      />
      {cfg.label}
    </span>
  );
};

// ─── Platform Icon ─────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  youtube: PlayCircle,
  instagram: Camera,

  mail: Mail,
  mic: Mic,
  'file-text': FileText,
  layout: Layout,
};

interface PlatformIconProps {
  platformId: PlatformId;
  iconName: string;
  size?: number;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platformId, iconName, size = 32 }) => {
  const Icon = PLATFORM_ICONS[iconName] || FileText;
  const colors = PLATFORM_COLORS[platformId];

  return (
    <div
      className="flex items-center justify-center rounded-xl flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: colors.bg,
        color: colors.text,
      }}
    >
      <Icon
        style={{
          width: Math.round(size * 0.55),
          height: Math.round(size * 0.55),
          color: colors.text,
        }}
      />
    </div>
  );
};

// ─── ReadinessBar ─────────────────────────────────────────────────────────────

interface ReadinessBarProps {
  score: number; // 0–100
  size?: 'sm' | 'md';
  showLabel?: boolean;
  animated?: boolean;
}

export const ReadinessBar: React.FC<ReadinessBarProps> = ({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
}) => {
  const color =
    score >= 90 ? '#10B981'
    : score >= 70 ? '#8B5CF6'
    : score >= 50 ? '#3B82F6'
    : score >= 30 ? '#F59E0B'
    : '#EF4444';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-1 rounded-full overflow-hidden bg-white/5 ${size === 'sm' ? 'h-1.5' : 'h-2'}`}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${score}%` }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      {showLabel && (
        <span
          className="text-[10px] font-mono font-semibold tabular-nums w-8 text-right flex-shrink-0"
          style={{ color }}
        >
          {score}%
        </span>
      )}
    </div>
  );
};

// ─── DiffTag ──────────────────────────────────────────────────────────────────

interface DiffTagProps {
  type: DiffType;
}

export const DiffTag: React.FC<DiffTagProps> = ({ type }) => {
  const cfg = DIFF_CONFIG[type];
  return (
    <span
      className="inline-flex text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
};

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

// ─── ThumbnailStatusDot ───────────────────────────────────────────────────────

interface ThumbnailStatusDotProps {
  status: 'ready' | 'generating' | 'missing' | 'approved';
}

export const ThumbnailStatusDot: React.FC<ThumbnailStatusDotProps> = ({ status }) => {
  const color = THUMB_COLORS[status] ?? '#94A3B8';
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono" style={{ color }}>
      <span
        className={`w-1.5 h-1.5 rounded-full inline-block ${status === 'generating' ? 'animate-pulse' : ''}`}
        style={{ background: color }}
      />
      {THUMB_LABELS[status]}
    </span>
  );
};

// ─── MemberAvatar ─────────────────────────────────────────────────────────────

interface MemberAvatarProps {
  initials: string;
  color: string;
  size?: number;
  name?: string;
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({ initials, color, size = 28, name }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
    style={{
      width: size,
      height: size,
      fontSize: Math.round(size * 0.36),
      background: color,
      border: '2px solid rgba(255,255,255,0.1)',
    }}
    title={name}
  >
    {initials}
  </div>
);

// ─── InsightPill ──────────────────────────────────────────────────────────────

interface InsightPillProps {
  priority: 'high' | 'medium' | 'low';
}

export const InsightPill: React.FC<InsightPillProps> = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
};

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
