/**
 * ReviewShared.tsx — Shared UI primitives for the Review & Approval Room
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock, Eye, RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  ShieldCheck, ShieldAlert, ShieldOff, HelpCircle, Lock,
  Minus, Info, AlertOctagon
} from 'lucide-react';
import type { ReviewStatus, SeverityLevel, RiskRating, ApprovalStepState } from '../review/mockData';

// ─── Review Status Badge ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReviewStatus, {
  label: string; color: string; bg: string; border: string; icon: React.ElementType; tooltip: string;
}> = {
  pending:            { label: 'Pending',           color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.25)', icon: Clock,         tooltip: 'Awaiting assignment or action' },
  'in-review':        { label: 'In Review',         color: '#06B6D4', bg: 'rgba(6,182,212,0.10)',   border: 'rgba(6,182,212,0.25)',   icon: Eye,           tooltip: 'Currently being reviewed' },
  'changes-requested':{ label: 'Changes Requested', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', icon: RefreshCw,     tooltip: 'Revisions required before approval' },
  approved:           { label: 'Approved',          color: '#10B981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.25)', icon: CheckCircle2,  tooltip: 'Review passed and approved' },
  blocked:            { label: 'Blocked',           color: '#EF4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)',  icon: XCircle,       tooltip: 'Blocked — critical issue must be resolved' },
};

interface StatusBadgeProps {
  status: ReviewStatus;
  size?: 'xs' | 'sm' | 'md';
}

export const ReviewStatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const px = size === 'xs' ? 'px-1.5 py-0.5 text-[9px] gap-0.5'
            : size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1'
            : 'px-2.5 py-1 text-xs gap-1.5';
  const iconSize = size === 'xs' ? 8 : size === 'sm' ? 10 : 12;

  return (
    <span
      title={cfg.tooltip}
      className={`inline-flex items-center rounded-full font-semibold ${px}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
};

// ─── Severity Badge ───────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<SeverityLevel, {
  label: string; color: string; bg: string; icon: React.ElementType;
}> = {
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   icon: AlertOctagon },
  high:     { label: 'High',     color: '#F97316', bg: 'rgba(249,115,22,0.12)',  icon: AlertTriangle },
  medium:   { label: 'Medium',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: AlertTriangle },
  low:      { label: 'Low',      color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: Info },
  info:     { label: 'Info',     color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', icon: Info },
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'sm' }) => {
  const cfg = SEVERITY_CONFIG[severity];
  const Icon = cfg.icon;
  const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 10 : 12;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${px}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
    >
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
};

// ─── Risk Label ───────────────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskRating, {
  label: string; sublabel: string; color: string; bg: string; icon: React.ElementType;
}> = {
  'approved':          { label: 'Approved',              sublabel: 'No restrictions',            color: '#10B981', bg: 'rgba(16,185,129,0.10)',  icon: ShieldCheck },
  'conditions-apply':  { label: 'Conditions Apply',      sublabel: 'Review terms before use',    color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', icon: ShieldAlert },
  'replace-or-obtain': { label: 'Replace or Obtain',     sublabel: 'Licence required',           color: '#EF4444', bg: 'rgba(239,68,68,0.10)',  icon: ShieldOff },
  'unknown':           { label: 'Unknown',               sublabel: 'Status not determined',      color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', icon: HelpCircle },
};

interface RiskLabelProps {
  risk: RiskRating;
  showSublabel?: boolean;
  size?: 'sm' | 'md';
}

export const RiskLabel: React.FC<RiskLabelProps> = ({ risk, showSublabel = false, size = 'sm' }) => {
  const cfg = RISK_CONFIG[risk];
  const Icon = cfg.icon;
  const iconSize = size === 'sm' ? 11 : 14;
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg ${size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs'}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}25` }}
    >
      <Icon size={iconSize} style={{ flexShrink: 0 }} />
      <div>
        <span className="font-semibold">{cfg.label}</span>
        {showSublabel && <span className="opacity-70 ml-1">{cfg.sublabel}</span>}
      </div>
    </div>
  );
};

// ─── Step State Pill ──────────────────────────────────────────────────────────

const STEP_CONFIG: Record<ApprovalStepState, { label: string; color: string; icon: React.ElementType }> = {
  required: { label: 'Required', color: '#8B5CF6', icon: CheckCircle2 },
  optional: { label: 'Optional', color: '#3B82F6', icon: Minus },
  skipped:  { label: 'Skipped',  color: '#94A3B8', icon: Minus },
  locked:   { label: 'Locked',   color: '#64748B', icon: Lock },
};

interface StepStatePillProps {
  state: ApprovalStepState;
}

export const StepStatePill: React.FC<StepStatePillProps> = ({ state }) => {
  const cfg = STEP_CONFIG[state];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
      style={{ color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}25` }}
    >
      <Icon size={8} />
      {cfg.label}
    </span>
  );
};

// ─── Reviewer Avatar ──────────────────────────────────────────────────────────

interface ReviewerAvatarProps {
  initials: string;
  color: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const ReviewerAvatar: React.FC<ReviewerAvatarProps> = ({ initials, color, name, size = 'sm' }) => {
  const dims = { xs: 'w-5 h-5 text-[8px]', sm: 'w-6 h-6 text-[9px]', md: 'w-8 h-8 text-[10px]', lg: 'w-10 h-10 text-xs' };
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${dims[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
        style={{ background: `${color}20`, color, border: `1.5px solid ${color}40` }}
      >
        {initials}
      </div>
      {name && <span className="text-xs text-[#CBD5E1] font-medium">{name}</span>}
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  accent?: string;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title, subtitle, count, accent = '#8B5CF6', actions
}) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <div className="w-0.5 h-4 rounded-full" style={{ background: accent }} />
      <div>
        <h3 className="text-sm font-semibold text-[#F8FAFC]">{title}</h3>
        {subtitle && <p className="text-[11px] text-[#94A3B8]">{subtitle}</p>}
      </div>
      {count !== undefined && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-[#94A3B8] font-mono border border-white/8">
          {count}
        </span>
      )}
    </div>
    {actions}
  </div>
);

// ─── Animated Progress Bar ────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export const ReviewProgressBar: React.FC<ProgressBarProps> = ({
  value, color = '#8B5CF6', height = 'h-1.5', showLabel = false
}) => (
  <div className="flex items-center gap-2">
    <div className={`flex-1 ${height} bg-white/6 rounded-full overflow-hidden`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
    {showLabel && (
      <span className="text-[10px] font-mono" style={{ color }}>{value}%</span>
    )}
  </div>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────

interface QuickActionProps {
  label: string;
  icon: React.ElementType;
  color?: string;
  variant?: 'primary' | 'ghost' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
}

export const QuickActionBtn: React.FC<QuickActionProps> = ({
  label, icon: Icon, color, variant = 'ghost', onClick, disabled
}) => {
  const styles = {
    primary: `bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border border-[#8B5CF6]/30 shadow-lg shadow-[#7C3AED]/20`,
    ghost: `bg-white/4 text-[#CBD5E1] border border-white/8 hover:bg-white/7 hover:text-[#F8FAFC] hover:border-white/15`,
    danger: `bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/25 hover:bg-[#EF4444]/15`,
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${styles[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      style={color ? { color, background: `${color}12`, borderColor: `${color}30` } : {}}
    >
      <Icon size={12} />
      {label}
    </motion.button>
  );
};

// ─── Risk Table Cell ──────────────────────────────────────────────────────────

type RiskRatingRow = 'low' | 'medium' | 'high' | 'critical';

const ROW_RISK_CFG: Record<RiskRatingRow, { color: string; bg: string; label: string }> = {
  low:      { color: '#10B981', bg: 'rgba(16,185,129,0.10)',  label: 'Low' },
  medium:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', label: 'Medium' },
  high:     { color: '#F97316', bg: 'rgba(249,115,22,0.10)',  label: 'High' },
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   label: 'Critical' },
};

interface RiskRowBadgeProps { risk: RiskRatingRow }

export const RiskRowBadge: React.FC<RiskRowBadgeProps> = ({ risk }) => {
  const cfg = ROW_RISK_CFG[risk];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
};

// ─── Boolean Cell ─────────────────────────────────────────────────────────────

export const BoolCell: React.FC<{ value: boolean | 'conditional'; labels?: [string, string, string] }> = ({
  value, labels = ['Yes', 'Conditional', 'No']
}) => {
  if (value === 'conditional') {
    return <span className="text-[10px] font-semibold text-[#F59E0B] flex items-center gap-1"><AlertTriangle size={9} />{labels[1]}</span>;
  }
  return value
    ? <span className="text-[10px] font-semibold text-[#10B981] flex items-center gap-1"><CheckCircle2 size={9} />{labels[0]}</span>
    : <span className="text-[10px] font-semibold text-[#EF4444] flex items-center gap-1"><XCircle size={9} />{labels[2]}</span>;
};

// ─── Panel Tabs ───────────────────────────────────────────────────────────────

interface PanelTabsProps {
  tabs: { id: string; label: string; icon?: React.ElementType; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const PanelTabs: React.FC<PanelTabsProps> = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-0.5 bg-[#0B0B12] rounded-lg p-0.5 border border-white/5">
    {tabs.map(tab => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex-shrink-0 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            isActive ? 'text-[#F8FAFC]' : 'text-[#94A3B8] hover:text-[#CBD5E1]'
          }`}
        >
          {isActive && (
            <motion.span
              layoutId="review-tab-pill"
              className="absolute inset-0 rounded-md bg-[#151521] border border-white/10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          {Icon && <Icon size={11} className="relative z-10 flex-shrink-0" />}
          <span className="relative z-10">{tab.label}</span>
          {tab.count !== undefined && tab.count > 0 && (
            <span className="relative z-10 text-[9px] px-1 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] font-bold ml-0.5">
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
