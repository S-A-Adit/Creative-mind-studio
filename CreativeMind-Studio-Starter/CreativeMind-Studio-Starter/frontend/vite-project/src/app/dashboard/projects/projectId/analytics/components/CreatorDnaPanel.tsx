/**
 * CreatorDnaPanel.tsx — Premium Creator DNA dashboard
 *
 * Displays 10 AI-derived insights about the creator's best-performing
 * patterns: hook style, duration, platform, topic, audience, tone,
 * pacing, thumbnail, editing, and next experiment.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Clock, Monitor, Brain, Users, Mic,
  Activity, Image, Scissors, FlaskConical,
  ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Dna,
} from 'lucide-react';
import { CREATOR_DNA } from '../mockData';
import type { DnaInsight } from '../types';
import { ConfidenceBar, SectionLabel } from './PerformanceShared';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const DNA_ICONS: Record<string, React.ElementType> = {
  zap:       Zap,
  clock:     Clock,
  monitor:   Monitor,
  brain:     Brain,
  users:     Users,
  mic:       Mic,
  activity:  Activity,
  image:     Image,
  scissors:  Scissors,
  flask:     FlaskConical,
};

const TREND_ICONS: Record<string, React.ElementType> = {
  up:   TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const TREND_COLORS: Record<string, string> = {
  up:   '#10B981',
  down: '#EF4444',
  flat: '#94A3B8',
};

// ─── DNA Insight Card ─────────────────────────────────────────────────────────

interface DnaCardProps {
  insight: DnaInsight;
  index: number;
}

const DnaCard: React.FC<DnaCardProps> = ({ insight, index }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = DNA_ICONS[insight.icon] ?? Zap;
  const TrendIcon = TREND_ICONS[insight.trend] ?? Minus;
  const trendColor = TREND_COLORS[insight.trend] ?? '#94A3B8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05 }}
      whileHover={{ y: -1 }}
      className="rounded-2xl border border-white/[0.07] bg-[#151521]/60 overflow-hidden transition-all duration-200 hover:border-white/[0.14]"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#9D6CFF]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <SectionLabel>{insight.label}</SectionLabel>
            <TrendIcon className="w-3 h-3 flex-shrink-0" style={{ color: trendColor }} />
          </div>
          <p className="text-sm font-medium text-white leading-snug truncate pr-2">
            {insight.value}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs font-mono font-bold"
            style={{
              color: insight.confidence >= 80 ? '#10B981' : insight.confidence >= 65 ? '#8B5CF6' : '#F59E0B',
            }}
          >
            {insight.confidence}%
          </span>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          }
        </div>
      </div>

      {/* Confidence bar */}
      <div className="px-4 pb-3">
        <ConfidenceBar score={insight.confidence} size="sm" showLabel={false} />
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="dna-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/[0.05] pt-3 space-y-3">
              {/* Evidence */}
              <div>
                <SectionLabel className="block mb-1">Supporting Evidence</SectionLabel>
                <p className="text-[12px] text-slate-400 leading-relaxed">{insight.evidence}</p>
              </div>

              {/* AI Recommendation */}
              <div className="p-3 rounded-xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/15">
                <SectionLabel className="block mb-1 text-[#9D6CFF]">AI Recommendation</SectionLabel>
                <p className="text-[12px] text-slate-300 leading-relaxed">{insight.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const CreatorDnaPanel: React.FC = () => {
  const avgConfidence = Math.round(
    CREATOR_DNA.reduce((s, d) => s + d.confidence, 0) / CREATOR_DNA.length
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0B0B12]">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Dna className="w-4 h-4 text-[#9D6CFF]" />
          <h3 className="font-display font-semibold text-white text-base">Creator DNA</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          AI-derived insights from {CREATOR_DNA.length} performance patterns across your content.
        </p>

        {/* Confidence summary */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
          <div className="flex items-center justify-between mb-2">
            <SectionLabel>Average Confidence</SectionLabel>
            <span
              className="text-sm font-mono font-bold"
              style={{ color: avgConfidence >= 75 ? '#10B981' : '#F59E0B' }}
            >
              {avgConfidence}%
            </span>
          </div>
          <ConfidenceBar score={avgConfidence} size="sm" showLabel={false} />
        </div>
      </div>

      {/* DNA Cards */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {CREATOR_DNA.map((insight, i) => (
          <DnaCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>
    </div>
  );
};
