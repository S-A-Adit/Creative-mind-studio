/**
 * InsightCard.tsx — Premium AI insight cards for the Virality Twin Workspace.
 *
 * Four categories: Shared Strengths · Missing Elements · Risk Patterns · Adjustments
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp,
  AlertOctagon,
  ShieldAlert,
  Wrench,
  ChevronDown,
  ArrowRight,
  Zap,
  AlertTriangle,
  TrendingUp,
  Info,
} from 'lucide-react';
import type { InsightItem, InsightCategory, InsightPriority } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Category config ──────────────────────────────────────────────────────────

const CAT_CFG: Record<InsightCategory, {
  label: string;
  icon: React.ReactNode;
  headerColor: string;
  borderColor: string;
  accentLine: string;
}> = {
  'shared-strength': {
    label:       'Shared Strengths',
    icon:        <ThumbsUp className="w-3.5 h-3.5" />,
    headerColor: '#10B981',
    borderColor: 'rgba(16,185,129,0.18)',
    accentLine:  'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)',
  },
  'missing-element': {
    label:       'Missing Elements',
    icon:        <AlertOctagon className="w-3.5 h-3.5" />,
    headerColor: '#F59E0B',
    borderColor: 'rgba(245,158,11,0.20)',
    accentLine:  'linear-gradient(90deg, transparent, rgba(245,158,11,0.45), transparent)',
  },
  'risk-pattern': {
    label:       'Risk Patterns',
    icon:        <ShieldAlert className="w-3.5 h-3.5" />,
    headerColor: '#EF4444',
    borderColor: 'rgba(239,68,68,0.18)',
    accentLine:  'linear-gradient(90deg, transparent, rgba(239,68,68,0.45), transparent)',
  },
  'adjustment': {
    label:       'Recommended Adjustments',
    icon:        <Wrench className="w-3.5 h-3.5" />,
    headerColor: '#8B5CF6',
    borderColor: 'rgba(139,92,246,0.22)',
    accentLine:  'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)',
  },
};

const PRIORITY_CFG: Record<InsightPriority, {
  label: string;
  badge: string;
  icon: React.ReactNode;
}> = {
  critical: { label: 'Critical', badge: 'text-red-400 bg-red-500/10 border-red-500/25',       icon: <Zap className="w-3 h-3" /> },
  high:     { label: 'High',     badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25', icon: <AlertTriangle className="w-3 h-3" /> },
  medium:   { label: 'Medium',   badge: 'text-amber-400 bg-amber-500/10 border-amber-500/25',  icon: <TrendingUp className="w-3 h-3" /> },
  low:      { label: 'Low',      badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20',  icon: <Info className="w-3 h-3" /> },
};

// ─── Single card ──────────────────────────────────────────────────────────────

interface InsightCardProps {
  insight: InsightItem;
  index: number;
  defaultExpanded?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  index,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const cat = CAT_CFG[insight.category];
  const pri = PRIORITY_CFG[insight.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.05, ease: EASE }}
      className="relative rounded-[14px] border overflow-hidden transition-all duration-200
        hover:brightness-110 bg-[#10101A]/90"
      style={{ borderColor: cat.borderColor }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: cat.accentLine }} />

      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        className="w-full flex items-start gap-3 p-4 text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-[14px]"
      >
        {/* Agent avatar */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-[9px] flex items-center justify-center text-[10px] font-bold font-mono border mt-0.5"
          style={{
            background: insight.agent.color + '22',
            borderColor: insight.agent.color + '35',
            color: insight.agent.color,
            borderStyle: 'dashed',
          }}
        >
          {insight.agent.initials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start flex-wrap gap-2 mb-1">
            <span className="text-[13px] font-semibold text-slate-100 leading-snug flex-1">
              {insight.title}
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${pri.badge}`}>
              {pri.icon}
              {pri.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
              style={{ color: cat.headerColor, background: cat.headerColor + '18' }}
            >
              {cat.icon} {cat.label}
            </span>
            <span className="text-[10px] text-slate-600 font-mono">by {insight.agent.name}</span>
          </div>
        </div>

        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-700 flex-shrink-0 mt-1"
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
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.05] pt-3">
              <p className="text-[12px] text-slate-300 leading-relaxed">{insight.description}</p>

              {/* Expected impact */}
              <div className="flex items-start gap-2 px-3 py-2 rounded-[9px] bg-emerald-500/06 border border-emerald-500/18">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-mono font-semibold text-emerald-500 uppercase tracking-widest">Expected Impact</span>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">{insight.expectedImpact}</p>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-[12px] font-medium
                  text-white border border-[#8B5CF6]/30 bg-[#7C3AED]/15
                  hover:bg-[#7C3AED]/25 transition-all duration-150"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Apply to Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Grouped insight sections ─────────────────────────────────────────────────

interface InsightSectionProps {
  category: InsightCategory;
  insights: InsightItem[];
  defaultExpanded?: boolean;
}

export const InsightSection: React.FC<InsightSectionProps> = ({
  category,
  insights,
  defaultExpanded = true,
}) => {
  const [sectionOpen, setSectionOpen] = useState(defaultExpanded);
  const cfg = CAT_CFG[category];
  const filtered = insights.filter(i => i.category === category);
  if (!filtered.length) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setSectionOpen(o => !o)}
        className="flex items-center gap-2.5 mb-3 w-full text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-lg"
      >
        <span style={{ color: cfg.headerColor }}>{cfg.icon}</span>
        <h4 className="font-display font-semibold text-[14px]" style={{ color: cfg.headerColor }}>
          {cfg.label}
        </h4>
        <span className="text-[10px] font-mono text-slate-600 ml-1">({filtered.length})</span>
        <motion.span
          animate={{ rotate: sectionOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-slate-700"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {sectionOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2.5 mb-6">
              {filtered.map((ins, i) => (
                <InsightCard key={ins.id} insight={ins} index={i} defaultExpanded={i === 0} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
