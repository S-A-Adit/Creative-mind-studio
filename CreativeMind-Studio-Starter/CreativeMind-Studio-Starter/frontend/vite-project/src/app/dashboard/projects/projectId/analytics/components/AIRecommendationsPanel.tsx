/**
 * AIRecommendationsPanel.tsx — Premium AI recommendation cards
 *
 * Displays actionable recommendations with expected impact, confidence,
 * related metric, priority level, and category grouping.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, CheckCircle2, ChevronDown, ChevronUp, Target,
  TrendingUp, Filter,
} from 'lucide-react';
import { AI_RECOMMENDATIONS } from '../mockData';
import type { RecommendationPriority } from '../types';
import { PriorityBadge, ConfidenceBar, SectionLabel } from './PerformanceShared';
import { PRIORITY_CONFIG } from './analyticsConfig';

// ─── Recommendation Card ──────────────────────────────────────────────────────

interface RecCardProps {
  rec: typeof AI_RECOMMENDATIONS[number];
  index: number;
}

const RecCard: React.FC<RecCardProps> = ({ rec, index }) => {
  const [expanded, setExpanded] = useState(index < 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05 }}
      whileHover={{ y: -1 }}
      className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
        rec.applied
          ? 'border-emerald-500/15 bg-emerald-500/[0.03]'
          : rec.priority === 'critical'
          ? 'border-rose-500/20 bg-rose-500/[0.03]'
          : 'border-white/[0.07] bg-[#151521]/60 hover:border-white/[0.14]'
      }`}
    >
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <PriorityBadge priority={rec.priority} />
              <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                {rec.category}
              </span>
              {rec.applied && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Applied
                </span>
              )}
            </div>
            <p className={`text-sm font-medium leading-snug ${rec.applied ? 'text-slate-500 line-through' : 'text-white'}`}>
              {rec.title}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-mono text-slate-500">{rec.confidence}%</span>
            </div>
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            }
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-2">
          <ConfidenceBar score={rec.confidence} size="sm" showLabel={false} />
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="rec-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/[0.05] pt-3 space-y-3">
              <p className="text-[12px] text-slate-400 leading-relaxed">{rec.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                  <SectionLabel className="block mb-1">Related Metric</SectionLabel>
                  <p className="text-xs font-medium text-slate-200">{rec.relatedMetric}</p>
                </div>
                <div className="rounded-xl bg-[#10B981]/5 border border-[#10B981]/15 p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <SectionLabel className="text-emerald-500">Expected Impact</SectionLabel>
                  </div>
                  <p className="text-xs font-medium text-emerald-300">{rec.expectedImpact}</p>
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

const PRIORITY_ORDER: RecommendationPriority[] = ['critical', 'high', 'medium', 'low'];

export const AIRecommendationsPanel: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState<RecommendationPriority | 'all'>('all');

  const filtered = filterPriority === 'all'
    ? AI_RECOMMENDATIONS
    : AI_RECOMMENDATIONS.filter(r => r.priority === filterPriority);

  const pending = AI_RECOMMENDATIONS.filter(r => !r.applied);
  const applied = AI_RECOMMENDATIONS.filter(r => r.applied);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0B0B12]">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#9D6CFF]" />
          <h3 className="font-display font-semibold text-white text-base">AI Recommendations</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Prioritized suggestions to maximize performance on your next content.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Total',   value: AI_RECOMMENDATIONS.length, color: '#94A3B8' },
            { label: 'Pending', value: pending.length,             color: '#F59E0B' },
            { label: 'Applied', value: applied.length,             color: '#10B981' },
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

        {/* Priority filter */}
        <div className="flex items-center gap-1 flex-wrap">
          <Filter className="w-3 h-3 text-slate-500 mr-1" />
          {(['all', ...PRIORITY_ORDER] as Array<RecommendationPriority | 'all'>).map(p => {
            const count = p === 'all'
              ? AI_RECOMMENDATIONS.length
              : AI_RECOMMENDATIONS.filter(r => r.priority === p).length;
            if (p !== 'all' && count === 0) return null;
            const cfg = p !== 'all' ? PRIORITY_CONFIG[p] : null;
            return (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all border ${
                  filterPriority === p
                    ? 'bg-[#8B5CF6]/15 text-[#9D6CFF] border-[#8B5CF6]/30'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {p === 'all' ? `All (${count})` : `${cfg?.label} (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
            >
              <RecCard rec={rec} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
