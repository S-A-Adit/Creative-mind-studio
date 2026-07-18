/**
 * EditorShared.tsx — Shared reusable UI primitives for the Video Editor Workspace
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, XCircle, Clock, Eye, Zap,
  Film, Image, Music, Volume2, Shield, Cpu
} from 'lucide-react';
import type { EditingStatus, AssetReadiness, VisualType } from '../mockData';

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<EditingStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  'approved':    { label: 'Approved',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle2 },
  'review':      { label: 'In Review',    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  icon: Eye },
  'in-progress': { label: 'In Progress',  color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',  icon: Zap },
  'not-started': { label: 'Not Started',  color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', icon: Clock },
  'blocked':     { label: 'Blocked',      color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   icon: XCircle },
};

interface EditingStatusBadgeProps {
  status: EditingStatus;
  size?: 'sm' | 'md';
}

export const EditingStatusBadge: React.FC<EditingStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${px}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33` }}
    >
      <Icon size={size === 'sm' ? 10 : 12} />
      {cfg.label}
    </span>
  );
};

// ─── Asset Readiness Badge ────────────────────────────────────────────────────

const READINESS_CONFIG: Record<AssetReadiness, { label: string; color: string; bg: string }> = {
  'ready':   { label: 'Ready',   color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  'partial': { label: 'Partial', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  'missing': { label: 'Missing', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  'at-risk': { label: 'At Risk', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
};

interface AssetReadinessBadgeProps {
  readiness: AssetReadiness;
}

export const AssetReadinessBadge: React.FC<AssetReadinessBadgeProps> = ({ readiness }) => {
  const cfg = READINESS_CONFIG[readiness];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33` }}
    >
      {cfg.label}
    </span>
  );
};

// ─── Visual Type Badge ────────────────────────────────────────────────────────

const VISUAL_COLORS: Record<VisualType, string> = {
  'Talking Head':      '#8B5CF6',
  'Documentary':       '#3B82F6',
  'Interview':         '#06B6D4',
  'B-roll Montage':    '#10B981',
  'Motion Graphics':   '#F59E0B',
  'Screen Recording':  '#94A3B8',
  'Archival Footage':  '#F97316',
  'Text Explainer':    '#EC4899',
};

interface VisualTypeBadgeProps {
  type: VisualType;
}

export const VisualTypeBadge: React.FC<VisualTypeBadgeProps> = ({ type }) => {
  const color = VISUAL_COLORS[type] ?? '#94A3B8';
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
    >
      {type}
    </span>
  );
};

// ─── Asset Type Icon ──────────────────────────────────────────────────────────

const ASSET_ICONS: Record<string, React.ElementType> = {
  footage: Film,
  image: Image,
  audio: Music,
  graphic: Cpu,
  sfx: Volume2,
};

const ASSET_STATUS_COLORS: Record<string, string> = {
  approved: '#10B981',
  missing: '#EF4444',
  'copyright-risk': '#F59E0B',
  'ai-generated': '#8B5CF6',
};

interface AssetStatusTagProps {
  type: string;
  status: string;
  name: string;
}

export const AssetStatusTag: React.FC<AssetStatusTagProps> = ({ type, status, name }) => {
  const Icon = ASSET_ICONS[type] ?? Film;
  const color = ASSET_STATUS_COLORS[status] ?? '#94A3B8';
  const labels: Record<string, string> = {
    approved: 'Approved', missing: 'Missing',
    'copyright-risk': 'Copyright Risk', 'ai-generated': 'AI Generated',
  };
  return (
    <div
      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs"
      style={{ background: `${color}10`, border: `1px solid ${color}25` }}
    >
      <Icon size={12} style={{ color }} />
      <span className="text-[#CBD5E1] truncate max-w-[140px]" title={name}>{name}</span>
      <span className="ml-auto text-[10px] font-semibold" style={{ color }}>
        {labels[status] ?? status}
      </span>
    </div>
  );
};

// ─── Warning Count ────────────────────────────────────────────────────────────

interface WarningCountProps {
  count: number;
}

export const WarningCount: React.FC<WarningCountProps> = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
      <AlertTriangle size={9} />
      {count}
    </span>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  actions?: React.ReactNode;
  accent?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title, subtitle, count, actions, accent = '#8B5CF6'
}) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <div className="w-0.5 h-4 rounded-full" style={{ background: accent }} />
      <div>
        <h3 className="text-sm font-semibold text-[#F8FAFC]">{title}</h3>
        {subtitle && <p className="text-[11px] text-[#94A3B8]">{subtitle}</p>}
      </div>
      {count !== undefined && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#94A3B8] font-mono border border-white/10">
          {count}
        </span>
      )}
    </div>
    {actions && <div>{actions}</div>}
  </div>
);

// ─── Panel Tab ────────────────────────────────────────────────────────────────

interface PanelTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  size?: 'sm' | 'md';
}

export const PanelTabs: React.FC<PanelTabsProps> = ({ tabs, activeTab, onChange, size = 'md' }) => (
  <div className="flex gap-0.5 bg-[#0B0B12] rounded-lg p-0.5 border border-white/5">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`relative rounded-md transition-all duration-200 font-medium ${
          size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
        } ${activeTab === tab ? 'text-[#F8FAFC]' : 'text-[#94A3B8] hover:text-[#CBD5E1]'}`}
      >
        {activeTab === tab && (
          <motion.span
            layoutId="editor-tab-pill"
            className="absolute inset-0 rounded-md bg-[#151521] border border-white/10"
            transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.2 }}
          />
        )}
        <span className="relative z-10">{tab}</span>
      </button>
    ))}
  </div>
);

// ─── Pacing Indicator ────────────────────────────────────────────────────────

const PACING_COLORS = { slow: '#3B82F6', medium: '#F59E0B', fast: '#10B981' };

interface PacingDotProps {
  pacing: 'slow' | 'medium' | 'fast';
}

export const PacingDot: React.FC<PacingDotProps> = ({ pacing }) => {
  const color = PACING_COLORS[pacing];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold capitalize"
      style={{ color }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {pacing}
    </span>
  );
};

// ─── Editor Avatar ────────────────────────────────────────────────────────────

const EDITOR_COLORS: Record<string, string> = {
  'Mia Torres':   '#8B5CF6',
  'Carlos Vega':  '#3B82F6',
  'Sarah K.':     '#F59E0B',
  'James R.':     '#10B981',
  'Unassigned':   '#64748B',
};

interface EditorAvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

export const EditorAvatar: React.FC<EditorAvatarProps> = ({ name, size = 'sm' }) => {
  const color = EDITOR_COLORS[name] ?? '#94A3B8';
  const initials = name === 'Unassigned' ? '?' : name.split(' ').map(p => p[0]).join('').slice(0, 2);
  const dim = size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold ${dim}`}
      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {initials}
    </span>
  );
};

// ─── Metric Stat ──────────────────────────────────────────────────────────────

interface MetricStatProps {
  label: string;
  value: string | number;
  color?: string;
}

export const MetricStat: React.FC<MetricStatProps> = ({ label, value, color = '#8B5CF6' }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wide">{label}</span>
    <span className="text-sm font-bold font-mono" style={{ color }}>{value}</span>
  </div>
);

// ─── Pulse Marker ────────────────────────────────────────────────────────────

interface PulseMarkerProps {
  color: string;
  label?: string;
}

export const PulseMarker: React.FC<PulseMarkerProps> = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <span className="relative flex h-2.5 w-2.5">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ background: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ background: color }}
      />
    </span>
    {label && <span className="text-[10px] text-[#94A3B8]">{label}</span>}
  </div>
);

// ─── Shield icon for copyright ────────────────────────────────────────────────

export const CopyrightRiskIcon: React.FC = () => (
  <span title="Copyright Risk" className="inline-flex text-amber-400">
    <Shield size={12} />
  </span>
);
