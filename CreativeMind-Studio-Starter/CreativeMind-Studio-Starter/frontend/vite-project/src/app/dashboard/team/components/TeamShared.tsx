/**
 * TeamShared.tsx — Shared UI primitives for the Team Workspace
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { ROLE_CONFIG, STATUS_CONFIG, getCapacityColor } from './roleUtils';
import type { WorkspaceRole, OnlineStatus } from '../types';

// ─── MemberAvatar ─────────────────────────────────────────────────────────────

interface MemberAvatarProps {
  initials: string;
  status?: OnlineStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { outer: 'w-8 h-8 text-xs',    dot: 'w-2.5 h-2.5 border' },
  md: { outer: 'w-10 h-10 text-sm',  dot: 'w-3 h-3 border'     },
  lg: { outer: 'w-12 h-12 text-sm',  dot: 'w-3.5 h-3.5 border' },
  xl: { outer: 'w-16 h-16 text-base', dot: 'w-4 h-4 border-2'  },
};

// Avatar colour derived from initials — deterministic
const AVATAR_GRADIENTS = [
  'from-violet-600 to-purple-700',
  'from-rose-500 to-pink-700',
  'from-cyan-500 to-teal-700',
  'from-amber-500 to-orange-700',
  'from-emerald-500 to-green-700',
  'from-blue-500 to-indigo-700',
  'from-fuchsia-500 to-violet-700',
  'from-orange-400 to-rose-600',
];

function avatarGradient(initials: string): string {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  initials, status, size = 'md',
}) => {
  const sz = sizeMap[size];
  const gradient = avatarGradient(initials);
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sz.outer} rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center font-display font-bold text-white shadow-md`}>
        {initials}
      </div>
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${sz.dot} rounded-full border-[#0B0B12] ${STATUS_CONFIG[status].dotClass}`}
        />
      )}
    </div>
  );
};

// ─── RoleBadge ────────────────────────────────────────────────────────────────

interface RoleBadgeProps {
  role: WorkspaceRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const cfg = ROLE_CONFIG[role];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-full border ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── StatusDot ────────────────────────────────────────────────────────────────

interface StatusDotProps {
  status: OnlineStatus;
  showLabel?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, showLabel = false }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <motion.span
        className={`inline-block w-2 h-2 rounded-full ${cfg.dotClass}`}
        animate={status === 'online' ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      {showLabel && <span className="text-[11px] font-mono" style={{ color: cfg.color }}>{cfg.label}</span>}
    </span>
  );
};

// ─── WorkloadBar ──────────────────────────────────────────────────────────────

interface WorkloadBarProps {
  value: number;   // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const WorkloadBar: React.FC<WorkloadBarProps> = ({ value, showLabel = true, size = 'md' }) => {
  const color = getCapacityColor(value);
  const h = size === 'sm' ? 'h-1' : 'h-1.5';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`flex-1 ${h} rounded-full overflow-hidden bg-white/5`}>
        <motion.div
          className={`h-full rounded-full`}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] font-mono font-bold w-7 text-right flex-shrink-0" style={{ color }}>
          {value}%
        </span>
      )}
    </div>
  );
};

// ─── PermissionToggle ────────────────────────────────────────────────────────

interface PermissionToggleProps {
  value: boolean;
  label: string;
  description?: string;
  disabled?: boolean;
  onChange?: (val: boolean) => void;
}

export const PermissionToggle: React.FC<PermissionToggleProps> = ({
  value, label, description, disabled = false, onChange,
}) => {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div>
        <p className="text-xs font-medium text-slate-200">{label}</p>
        {description && <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        disabled={disabled}
        onClick={() => onChange?.(!value)}
        className={`relative w-8 h-4.5 rounded-full transition-colors duration-200 flex-shrink-0 mt-0.5 focus:outline-none ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        } ${value ? 'bg-brand-purple' : 'bg-slate-700'}`}
        style={{ width: 32, height: 18 }}
      >
        <div
          className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: value ? 'translateX(15px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
};

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title, message, confirmLabel = 'Confirm', onConfirm, onCancel, variant = 'danger',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#13131E] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
      >
        <h3 className="font-display font-semibold text-slate-100 text-base mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">{message}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              variant === 'danger'
                ? 'bg-rose-500/90 hover:bg-rose-500 text-white'
                : 'bg-amber-500/90 hover:bg-amber-500 text-black'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── SectionLabel ─────────────────────────────────────────────────────────────

export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <span className={`text-[10px] font-mono font-semibold uppercase tracking-[0.12em] text-slate-500 ${className}`}>
    {children}
  </span>
);

// ─── ProjectStatusBadge ───────────────────────────────────────────────────────

type ProjectStatus = 'in-progress' | 'review' | 'published' | 'draft';

const PROJECT_STATUS: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  'in-progress': { label: 'In Progress', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  'review':      { label: 'In Review',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)'  },
  'published':   { label: 'Published',   color: '#10B981', bg: 'rgba(16,185,129,0.12)'  },
  'draft':       { label: 'Draft',       color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
};

export const ProjectStatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const cfg = PROJECT_STATUS[status];
  return (
    <span
      className="inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
};

// ─── PermissionCheckItem ──────────────────────────────────────────────────────

export const PermissionCheckItem: React.FC<{ allowed: boolean; label: string }> = ({
  allowed, label,
}) => (
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
      allowed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-600'
    }`}>
      {allowed
        ? <Check className="w-2.5 h-2.5" />
        : <X className="w-2.5 h-2.5" />
      }
    </span>
    <span className={`text-xs ${allowed ? 'text-slate-300' : 'text-slate-600 line-through'}`}>
      {label}
    </span>
  </div>
);

// ─── Invite Modal ─────────────────────────────────────────────────────────────

interface InviteModalProps {
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<WorkspaceRole>('viewer');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="bg-[#13131E] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-slate-100 text-base">Invite Team Member</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-purple/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Assign Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as WorkspaceRole)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-purple/50 transition-colors appearance-none"
            >
              {(Object.keys(ROLE_CONFIG) as WorkspaceRole[]).map(r => (
                <option key={r} value={r} className="bg-[#13131E]">{ROLE_CONFIG[r].label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              disabled={!email}
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
