/**
 * AILearningLog.tsx — Chronological AI learning timeline
 *
 * Each card shows: prediction, actual result, difference, AI learning,
 * improvement applied, timestamp, impact level, and applied status.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, CheckCircle2, Clock, ChevronDown, ChevronUp,
  AlertCircle, TrendingUp, TrendingDown, BookOpen,
} from 'lucide-react';
import { LEARNING_LOG } from '../mockData';
import type { LearningEntry } from '../types';
import { ImpactBadge, SectionLabel } from './PerformanceShared';

// ─── Learning Card ────────────────────────────────────────────────────────────

interface LearningCardProps {
  entry: LearningEntry;
  index: number;
}

const LearningCard: React.FC<LearningCardProps> = ({ entry, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  const isPositive = entry.difference.startsWith('+');
  const diffColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.24, delay: index * 0.07 }}
      className={`relative rounded-2xl border overflow-hidden ${
        entry.applied
          ? 'border-emerald-500/15 bg-emerald-500/[0.03]'
          : 'border-white/[0.07] bg-[#151521]/60'
      }`}
    >
      {/* Timeline connector dot */}
      <div className="absolute left-5 top-5 w-2.5 h-2.5 rounded-full border-2 border-[#0B0B12] z-10"
        style={{ background: entry.impact === 'high' ? '#EF4444' : entry.impact === 'medium' ? '#F59E0B' : '#94A3B8' }}
      />

      {/* Card header */}
      <div
        className="pl-11 pr-4 pt-4 pb-3 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                {entry.category}
              </span>
              <ImpactBadge impact={entry.impact} />
              {entry.applied && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Applied
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-600" />
              <span className="text-[10px] font-mono text-slate-500">
                {new Date(entry.timestamp).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-xs font-mono font-bold"
              style={{ color: diffColor }}
            >
              {entry.difference}
            </span>
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            }
          </div>
        </div>
      </div>

      {/* Collapsed preview */}
      {!expanded && (
        <div className="pl-11 pr-4 pb-3">
          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
            {entry.prediction}
          </p>
        </div>
      )}

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="learning-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pl-11 pr-4 pb-4 border-t border-white/[0.05] pt-3 space-y-3">

              {/* Prediction */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain className="w-3 h-3 text-[#9D6CFF]" />
                </div>
                <div>
                  <SectionLabel className="block mb-0.5">Prediction</SectionLabel>
                  <p className="text-[12px] text-slate-300 leading-relaxed italic">"{entry.prediction}"</p>
                </div>
              </div>

              {/* Actual */}
              <div className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}
                >
                  {isPositive
                    ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                    : <TrendingDown className="w-3 h-3 text-rose-400" />
                  }
                </div>
                <div>
                  <SectionLabel className="block mb-0.5">Actual Result</SectionLabel>
                  <p className="text-[12px] text-slate-300 leading-relaxed italic">"{entry.actual}"</p>
                </div>
              </div>

              {/* AI Learning */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                </div>
                <div>
                  <SectionLabel className="block mb-0.5">AI Learning</SectionLabel>
                  <p className="text-[12px] text-slate-400 leading-relaxed">{entry.learning}</p>
                </div>
              </div>

              {/* Next improvement */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/15">
                <BookOpen className="w-3.5 h-3.5 text-[#9D6CFF] flex-shrink-0 mt-0.5" />
                <div>
                  <SectionLabel className="block mb-0.5 text-[#9D6CFF]">Next Improvement</SectionLabel>
                  <p className="text-[12px] text-slate-300 leading-relaxed">{entry.nextImprovement}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const AILearningLog: React.FC = () => {
  const appliedCount = LEARNING_LOG.filter(e => e.applied).length;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0B0B12]">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-4 h-4 text-[#9D6CFF]" />
          <h3 className="font-display font-semibold text-white text-base">AI Learning Log</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Chronological record of predictions, actual results, and what the AI learned from each.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Entries',  value: LEARNING_LOG.length, color: '#94A3B8' },
            { label: 'Applied',  value: appliedCount,         color: '#10B981' },
            { label: 'Pending',  value: LEARNING_LOG.length - appliedCount, color: '#F59E0B' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center"
            >
              <div className="text-xl font-display font-bold" style={{ color }}>{value}</div>
              <SectionLabel className="block mt-0.5">{label}</SectionLabel>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {/* Timeline vertical line */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#8B5CF6]/40 via-[#8B5CF6]/20 to-transparent pointer-events-none" />
          <div className="space-y-3">
            {LEARNING_LOG.map((entry, i) => (
              <LearningCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
