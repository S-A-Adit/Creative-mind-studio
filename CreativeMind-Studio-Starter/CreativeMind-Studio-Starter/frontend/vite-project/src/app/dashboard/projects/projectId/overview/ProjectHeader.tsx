/**
 * ProjectHeader.tsx — Hero header for the Project Overview page.
 *
 * Displays:  Thumbnail · Title · Description · Meta row · Status badge ·
 *            Progress ring · Quick action buttons
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Clock,
  Monitor,
  ChevronDown,
  Share2,
  UserPlus,
  Compass,
  MoreHorizontal,
  CheckCircle2,
  Play,
  Eye,
  Archive,
  PauseCircle,
} from 'lucide-react';
import type { ProjectOverviewData, OverviewProjectStatus } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDeadline(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(date: Date): number {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86_400_000));
}

const STATUS_CONFIG: Record<OverviewProjectStatus, { label: string; dot: string; badge: string }> = {
  draft:       { label: 'Draft',       dot: 'bg-slate-500',  badge: 'text-slate-400  bg-slate-500/10  border-slate-500/25' },
  'in-progress':{ label: 'In Progress', dot: 'bg-blue-500',   badge: 'text-blue-400   bg-blue-500/10   border-blue-500/25'  },
  review:      { label: 'In Review',   dot: 'bg-amber-500',  badge: 'text-amber-400  bg-amber-500/10  border-amber-500/25' },
  'on-hold':   { label: 'On Hold',     dot: 'bg-orange-500', badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25'},
  published:   { label: 'Published',   dot: 'bg-emerald-500',badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'},
  archived:    { label: 'Archived',    dot: 'bg-slate-600',  badge: 'text-slate-500  bg-slate-600/10  border-slate-600/25' },
};

// ─── SVG Progress Ring ────────────────────────────────────────────────────────

const ProgressRing: React.FC<{ progress: number; size?: number; stroke?: number }> = ({
  progress,
  size = 72,
  stroke = 5,
}) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (progress / 100) * circ), 80);
    return () => clearTimeout(t);
  }, [progress, circ]);

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
      />
      {/* Fill */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)' }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#9D6CFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ─── Quick action button ──────────────────────────────────────────────────────

const QuickActionBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}> = ({ icon, label, primary, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.15 }}
    className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-medium
      transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
      ${primary
        ? 'bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF] text-white border border-[#8B5CF6]/30 shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_22px_rgba(139,92,246,0.45)]'
        : 'bg-white/[0.04] border border-white/[0.09] text-slate-300 hover:bg-white/[0.07] hover:border-white/[0.16] hover:text-white'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </motion.button>
);

// ─── Status badge with dropdown (UI only) ─────────────────────────────────────

const StatusBadge: React.FC<{ status: OverviewProjectStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[12px] font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </div>
  );
};

// ─── Meta pill ────────────────────────────────────────────────────────────────

const MetaPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
    <span className="text-slate-700">{icon}</span>
    <span className="text-slate-600 hidden sm:inline">{label}:</span>
    <span className="text-slate-300 font-medium">{value}</span>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

interface ProjectHeaderProps {
  project: ProjectOverviewData;
  onOpenStrategy?: () => void;
  onInviteTeam?: () => void;
  onShare?: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onOpenStrategy,
  onInviteTeam,
  onShare,
}) => {
  const days = daysUntil(project.deadline);
  const cfg = STATUS_CONFIG[project.status];
  const moreRef = useRef<HTMLDivElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: ease.snappy }}
      className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-sm overflow-hidden"
    >
      {/* Gradient top banner */}
      <div className={`h-1.5 bg-gradient-to-r ${project.thumbnailGradient}`} />

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">

          {/* ── Thumbnail ── */}
          <motion.div
            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${project.thumbnailGradient}
              flex items-center justify-center border border-white/[0.12] shadow-lg`}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            <Play className="w-7 h-7 text-white/80 fill-white/40" />
          </motion.div>

          {/* ── Text block ── */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display font-bold text-[22px] sm:text-[26px] text-white leading-tight tracking-tight">
                {project.title}
              </h1>
              <StatusBadge status={project.status} />
            </div>

            <p className="text-[13px] text-slate-500 leading-relaxed mb-4 max-w-2xl line-clamp-2">
              {project.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4">
              <MetaPill
                icon={<Monitor className="w-3.5 h-3.5" />}
                label="Platform"
                value={project.platform}
              />
              <MetaPill
                icon={<Clock className="w-3.5 h-3.5" />}
                label="Duration"
                value={project.duration}
              />
              <MetaPill
                icon={<Users className="w-3.5 h-3.5" />}
                label="Audience"
                value={project.targetAudience}
              />
              <MetaPill
                icon={<div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: project.owner.color + '30', color: project.owner.color }}
                >
                  {project.owner.initials[0]}
                </div>}
                label="Owner"
                value={project.owner.name}
              />
              <div className="flex items-center gap-1.5 text-[12px]">
                <Calendar className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-slate-300 font-medium">{formatDeadline(project.deadline)}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${
                  days < 7
                    ? 'text-red-400 bg-red-500/10 border-red-500/25'
                    : days < 14
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/25'
                    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                }`}>
                  {days}d left
                </span>
              </div>
            </div>
          </div>

          {/* ── Progress ring ── */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div className="relative">
              <ProgressRing progress={project.overallProgress} size={72} stroke={5} />
              <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-[15px] text-white">
                {project.overallProgress}%
              </span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider text-center">
              Progress
            </span>
          </div>
        </div>

        {/* ── Quick Actions row ── */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-white/[0.06]">
          <QuickActionBtn
            primary
            icon={<Compass className="w-3.5 h-3.5" />}
            label="Strategy Room"
            onClick={onOpenStrategy}
          />
          <QuickActionBtn
            icon={<UserPlus className="w-3.5 h-3.5" />}
            label="Invite Team"
            onClick={onInviteTeam}
          />
          <QuickActionBtn
            icon={<Share2 className="w-3.5 h-3.5" />}
            label="Share"
            onClick={onShare}
          />

          {/* More actions */}
          <div className="relative" ref={moreRef}>
            <motion.button
              type="button"
              onClick={() => setMoreOpen(o => !o)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[13px] font-medium
                bg-white/[0.04] border border-white/[0.09] text-slate-400
                hover:bg-white/[0.07] hover:text-slate-200 transition-all duration-200"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </motion.button>

            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-1.5 left-0 z-30 bg-[#0B0B12] border border-white/[0.1]
                  rounded-[12px] shadow-2xl min-w-44 py-1 overflow-hidden"
              >
                {[
                  { icon: <Eye className="w-3.5 h-3.5" />, label: 'Preview' },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Mark as Review' },
                  { icon: <PauseCircle className="w-3.5 h-3.5" />, label: 'Put on Hold' },
                  { icon: <Archive className="w-3.5 h-3.5" />, label: 'Archive', danger: true },
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setMoreOpen(false)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-left
                      transition-colors duration-150
                      ${'danger' in item && item.danger
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-slate-300 hover:bg-white/[0.05]'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Status badge far right */}
          <div className="ml-auto flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-[11px] font-mono ${cfg.badge} px-2.5 py-1 rounded-full border`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
