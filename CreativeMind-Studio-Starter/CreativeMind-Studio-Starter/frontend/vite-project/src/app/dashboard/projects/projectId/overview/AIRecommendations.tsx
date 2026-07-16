/**
 * AIRecommendations.tsx — AI-generated recommendation panel for Project Overview.
 *
 * Shows priority-ordered cards with agent attribution and a suggested action CTA.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  Zap,
  AlertTriangle,
  TrendingUp,
  Info,
} from 'lucide-react';
import type { AIRecommendation, RecommendationPriority } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── Priority config ──────────────────────────────────────────────────────────

const PRIORITY_CFG: Record<RecommendationPriority, {
  label: string;
  icon: React.ReactNode;
  badge: string;
  border: string;
  accentLine: string;
}> = {
  urgent: {
    label: 'Urgent',
    icon: <Zap className="w-3 h-3" />,
    badge: 'text-red-400 bg-red-500/10 border-red-500/25',
    border: 'border-red-500/22',
    accentLine: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.55), transparent)',
  },
  high: {
    label: 'High',
    icon: <AlertTriangle className="w-3 h-3" />,
    badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25',
    border: 'border-orange-500/18',
    accentLine: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.45), transparent)',
  },
  medium: {
    label: 'Medium',
    icon: <TrendingUp className="w-3 h-3" />,
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    border: 'border-white/[0.07]',
    accentLine: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)',
  },
  low: {
    label: 'Low',
    icon: <Info className="w-3 h-3" />,
    badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    border: 'border-white/[0.06]',
    accentLine: 'transparent',
  },
};

// ─── Single recommendation card ───────────────────────────────────────────────

const RecommendationCard: React.FC<{
  rec: AIRecommendation;
  index: number;
}> = ({ rec, index }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const cfg = PRIORITY_CFG[rec.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05, ease: ease.snappy }}
      className={`relative rounded-[14px] border bg-[#10101A]/80 backdrop-blur-sm overflow-hidden
        transition-all duration-200 hover:bg-[#151521]/80 ${cfg.border}`}
    >
      {/* Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: cfg.accentLine }} />

      {/* Header (always visible) */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-3 p-4 text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-[14px]"
        aria-expanded={expanded}
      >
        {/* Agent avatar */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-[9px] flex items-center justify-center
            text-[10px] font-bold border mt-0.5"
          style={{
            background: rec.agent.color + '25',
            borderColor: rec.agent.color + '35',
            color: rec.agent.color,
            borderStyle: 'dashed',
          }}
        >
          {rec.agent.initials}
        </div>

        {/* Title + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start flex-wrap gap-2 mb-1">
            <span className="text-[13px] font-semibold text-slate-100 leading-snug flex-1">
              {rec.title}
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold
              px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.badge}`}>
              {cfg.icon}
              {cfg.label}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 font-mono">
            by {rec.agent.name}
          </span>
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-slate-600 mt-1"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: ease.snappy }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.05] pt-3">
              <p className="text-[12px] text-slate-400 leading-relaxed">
                {rec.body}
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[9px]
                  text-[12px] font-medium text-white
                  bg-gradient-to-r from-[#7C3AED]/80 to-[#9D6CFF]/80
                  border border-[#8B5CF6]/30
                  hover:from-[#7C3AED] hover:to-[#9D6CFF]
                  transition-all duration-150"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {rec.action}
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Section ─────────────────────────────────────────────────────────────────

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ recommendations }) => (
  <section aria-label="AI recommendations">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
          AI Recommendations
        </h2>
        <p className="text-[12px] text-slate-500 font-mono mt-0.5">
          {recommendations.filter(r => r.priority === 'urgent' || r.priority === 'high').length} high-priority actions
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-[#9D6CFF]"
        />
        <span className="text-[11px] font-mono text-[#9D6CFF]">AI Active</span>
      </div>
    </div>

    <div className="flex flex-col gap-2.5">
      {recommendations.map((rec, i) => (
        <RecommendationCard key={rec.id} rec={rec} index={i} />
      ))}
    </div>
  </section>
);
