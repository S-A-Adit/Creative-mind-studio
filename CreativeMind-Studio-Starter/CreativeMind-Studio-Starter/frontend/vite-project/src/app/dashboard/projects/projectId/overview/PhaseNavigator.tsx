/**
 * PhaseNavigator.tsx — Interactive horizontal workflow phase tracker.
 *
 * Shows 8 phases with status, responsible member, completion %, and blocking issues.
 * Active phase is highlighted. Completed phases show a check mark.
 */

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Circle,
  Loader,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { PhaseCard, PhaseId, PhaseStatus } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── Status config ────────────────────────────────────────────────────────────

const PHASE_STATUS: Record<PhaseStatus, {
  icon: React.ReactNode;
  dotColor: string;
  label: string;
  badgeClass: string;
}> = {
  'not-started': {
    icon: <Circle className="w-3.5 h-3.5" />,
    dotColor: '#475569',
    label: 'Not started',
    badgeClass: 'text-slate-600 bg-slate-700/20 border-slate-700/30',
  },
  'in-progress': {
    icon: <Loader className="w-3.5 h-3.5 animate-spin" />,
    dotColor: '#3B82F6',
    label: 'In progress',
    badgeClass: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
  },
  completed: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    dotColor: '#10B981',
    label: 'Completed',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  },
  blocked: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    dotColor: '#EF4444',
    label: 'Blocked',
    badgeClass: 'text-red-400 bg-red-500/10 border-red-500/25',
  },
};

// ─── Single Phase Card ────────────────────────────────────────────────────────

interface PhaseCardItemProps {
  phase: PhaseCard;
  isActive: boolean;
  index: number;
  onClick?: (id: PhaseId) => void;
}

const PhaseCardItem: React.FC<PhaseCardItemProps> = ({ phase, isActive, index, onClick }) => {
  const { icon, dotColor, badgeClass } = PHASE_STATUS[phase.status];
  const isCompleted = phase.status === 'completed';
  const isBlocked = phase.status === 'blocked';

  return (
    <motion.button
      type="button"
      onClick={() => onClick?.(phase.id)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: ease.snappy }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`
        relative flex-shrink-0 w-44 flex flex-col gap-3 p-4 rounded-[14px] border
        text-left transition-all duration-200 overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
        ${isActive
          ? 'border-[#8B5CF6]/50 bg-[#7C3AED]/08 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
          : isBlocked
          ? 'border-red-500/25 bg-[#10101A]/80'
          : isCompleted
          ? 'border-emerald-500/20 bg-[#10101A]/80'
          : 'border-white/[0.07] bg-[#10101A]/70 hover:border-white/[0.13]'
        }
      `}
      aria-current={isActive ? 'true' : undefined}
      aria-label={`${phase.label} — ${PHASE_STATUS[phase.status].label}`}
    >
      {/* Active glow line */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/70 to-transparent" />
      )}

      {/* Phase label + status icon */}
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[13px] font-semibold leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
          {phase.label}
        </span>
        <span style={{ color: dotColor }} className="flex-shrink-0 mt-0.5">
          {icon}
        </span>
      </div>

      {/* Completion bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono text-slate-700 uppercase tracking-wide">
            Completion
          </span>
          <span className={`text-[11px] font-mono font-semibold`} style={{ color: dotColor }}>
            {phase.completion}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: dotColor }}
            animate={{ width: `${phase.completion}%` }}
            transition={{ duration: 0.5, ease: ease.snappy, delay: index * 0.04 + 0.1 }}
          />
        </div>
      </div>

      {/* Member + status badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
            style={{ background: phase.responsible.color + '28', color: phase.responsible.color }}
          >
            {phase.responsible.initials}
          </div>
          <span className="text-[10px] text-slate-600 truncate max-w-[72px]">
            {phase.responsible.name.split(' ')[0]}
          </span>
        </div>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border whitespace-nowrap ${badgeClass}`}>
          {PHASE_STATUS[phase.status].label}
        </span>
      </div>

      {/* Blocking issue */}
      <AnimatePresence>
        {phase.blockingIssue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-1.5 text-[10px] text-red-400 leading-snug border-t border-red-500/15 pt-2.5"
          >
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{phase.blockingIssue}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last updated */}
      <span className="text-[9px] text-slate-700 font-mono">Updated {phase.lastUpdated}</span>
    </motion.button>
  );
};

// ─── Main navigator ───────────────────────────────────────────────────────────

interface PhaseNavigatorProps {
  phases: PhaseCard[];
  activePhaseId: PhaseId;
  onPhaseClick?: (id: PhaseId) => void;
}

export const PhaseNavigator: React.FC<PhaseNavigatorProps> = ({
  phases,
  activePhaseId,
  onPhaseClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' });
  };

  return (
    <section aria-label="Project phases">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
            Phase Navigator
          </h2>
          <p className="text-[12px] text-slate-500 font-mono mt-0.5">
            {phases.filter(p => p.status === 'completed').length} of {phases.length} phases complete
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-[8px] border border-white/[0.08] flex items-center justify-center
              text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150"
            aria-label="Scroll phases left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-[8px] border border-white/[0.08] flex items-center justify-center
              text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150"
            aria-label="Scroll phases right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
        role="tablist"
        aria-label="Project phases"
      >
        {phases.map((phase, i) => (
          <div key={phase.id} style={{ scrollSnapAlign: 'start' }}>
            <PhaseCardItem
              phase={phase}
              isActive={phase.id === activePhaseId}
              index={i}
              onClick={onPhaseClick}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
