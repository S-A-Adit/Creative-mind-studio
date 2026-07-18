/**
 * StoryOutline.tsx — Left panel collapsible story structure board.
 *
 * Displays all seven story stages with completion status, scene count,
 * duration, assigned writer, linked sources and a progress bar.
 * Clicking a section focuses the corresponding script blocks.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  CheckCircle2,
  Clock,
  Link2,
  Film,
  Bot,
  User,
  Lock,
  AlertTriangle,
  Circle,
  Pencil,
  Eye,
} from 'lucide-react';
import type { StorySection, SectionStatus, StoryStage } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Stage config ─────────────────────────────────────────────────────────────

const STAGE_CFG: Record<StoryStage, { label: string; color: string; emoji: string }> = {
  hook:        { label: 'Hook',        color: '#EF4444', emoji: '🎣' },
  setup:       { label: 'Setup',       color: '#F59E0B', emoji: '🏗️' },
  conflict:    { label: 'Conflict',    color: '#F97316', emoji: '⚡' },
  development: { label: 'Development', color: '#06B6D4', emoji: '📈' },
  reveal:      { label: 'Reveal',      color: '#8B5CF6', emoji: '💡' },
  resolution:  { label: 'Resolution',  color: '#10B981', emoji: '🕊️' },
  cta:         { label: 'CTA',         color: '#EC4899', emoji: '🎯' },
};

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<SectionStatus, {
  icon: React.ReactNode;
  label: string;
  badge: string;
}> = {
  'not-started':    { icon: <Circle className="w-3 h-3" />,        label: 'Not Started',     badge: 'text-slate-500 bg-slate-500/10 border-slate-500/20' },
  'in-progress':    { icon: <Pencil className="w-3 h-3" />,        label: 'In Progress',     badge: 'text-blue-400  bg-blue-500/10  border-blue-500/25'  },
  'draft':          { icon: <Pencil className="w-3 h-3" />,        label: 'Draft',           badge: 'text-amber-400 bg-amber-500/10 border-amber-500/25' },
  'review':         { icon: <Eye className="w-3 h-3" />,           label: 'In Review',       badge: 'text-violet-400 bg-violet-500/10 border-violet-500/25' },
  'approved':       { icon: <CheckCircle2 className="w-3 h-3" />,  label: 'Approved',        badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  'locked':         { icon: <Lock className="w-3 h-3" />,          label: 'Locked',          badge: 'text-slate-400 bg-slate-600/10 border-slate-600/20' },
  'needs-revision': { icon: <AlertTriangle className="w-3 h-3" />, label: 'Needs Revision',  badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25' },
};

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── Single section card ──────────────────────────────────────────────────────

interface SectionCardProps {
  section: StorySection;
  index: number;
  isActive: boolean;
  onSelect: (id: string) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  section, index, isActive, onSelect,
}) => {
  const [expanded, setExpanded] = useState(index < 2);
  const stageCfg  = STAGE_CFG[section.stage];
  const statusCfg = STATUS_CFG[section.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.24, delay: index * 0.05, ease: EASE }}
      className={`rounded-[14px] border overflow-hidden transition-all duration-200
        ${isActive
          ? 'border-[#8B5CF6]/50 shadow-[0_0_20px_rgba(139,92,246,0.12)]'
          : 'border-white/[0.07] hover:border-white/[0.14]'
        }`}
      style={{ background: isActive ? 'rgba(124,58,237,0.06)' : '#10101A' }}
    >
      {/* Stage accent line */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${stageCfg.color}60, transparent)` }} />

      {/* Header row */}
      <button
        type="button"
        onClick={() => { onSelect(section.id); setExpanded(e => !e); }}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
        aria-expanded={expanded}
      >
        {/* Stage label pill */}
        <div
          className="flex-shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center text-[13px]"
          style={{ background: stageCfg.color + '20', border: `1px solid ${stageCfg.color}35` }}
        >
          <span>{stageCfg.emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-[13px] text-slate-100 truncate">
              {section.title}
            </span>
            <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[9px] font-mono font-semibold
              px-1.5 py-0.5 rounded-full border ${statusCfg.badge}`}>
              {statusCfg.icon}
              {statusCfg.label}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden w-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${section.completionPercent}%` }}
              transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }}
              className="h-full rounded-full"
              style={{ backgroundColor: stageCfg.color }}
            />
          </div>
        </div>

        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-600 flex-shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 space-y-2.5 border-t border-white/[0.05]">
              {/* Synopsis */}
              <p className="text-[11px] text-slate-500 leading-snug pt-2.5">
                {section.synopsis}
              </p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { icon: <Film className="w-3 h-3" />,   label: `${section.sceneCount} scene${section.sceneCount !== 1 ? 's' : ''}` },
                  { icon: <Clock className="w-3 h-3" />,  label: fmtDuration(section.estimatedDurationSec) },
                  { icon: <Link2 className="w-3 h-3" />,  label: `${section.linkedSourceIds.length} source${section.linkedSourceIds.length !== 1 ? 's' : ''}` },
                  { icon: section.assignedWriter.isAi ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />, label: section.assignedWriter.name },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
                    <span style={{ color: i === 3 ? section.assignedWriter.color : undefined }}>{m.icon}</span>
                    <span className="truncate" style={{ color: i === 3 ? section.assignedWriter.color : undefined }}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Completion */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-600">{section.completionPercent}% complete</span>
                <span className="text-slate-600">{section.blockIds.length} blocks</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Public component ─────────────────────────────────────────────────────────

interface StoryOutlineProps {
  sections: StorySection[];
  activeSectionId: string | null;
  onSelectSection: (id: string) => void;
}

export const StoryOutline: React.FC<StoryOutlineProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
}) => {
  const totalDuration = sections.reduce((a, s) => a + s.estimatedDurationSec, 0);
  const avgCompletion = Math.round(sections.reduce((a, s) => a + s.completionPercent, 0) / sections.length);

  return (
    <div className="space-y-3">
      {/* Summary strip */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Overall Progress</span>
            <span className="text-[10px] font-mono text-slate-400">{avgCompletion}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${avgCompletion}%` }}
              transition={{ duration: 1, ease: EASE }}
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]"
            />
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-[9px] font-mono text-slate-600">Est. total</p>
          <p className="text-[11px] font-mono text-slate-400">{fmtDuration(totalDuration)}</p>
        </div>
      </div>

      {/* Section cards */}
      <div className="space-y-2">
        {sections.map((section, i) => (
          <SectionCard
            key={section.id}
            section={section}
            index={i}
            isActive={activeSectionId === section.id}
            onSelect={onSelectSection}
          />
        ))}
      </div>
    </div>
  );
};
