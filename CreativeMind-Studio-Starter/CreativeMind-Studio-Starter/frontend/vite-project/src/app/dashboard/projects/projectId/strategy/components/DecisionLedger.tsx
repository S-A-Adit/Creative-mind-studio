/**
 * DecisionLedger.tsx — Premium strategy decision history timeline for the War Room.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import type { LedgerEntry, StrategyAgent } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

const IMPACT_CFG = {
  positive: { icon: <TrendingUp className="w-3.5 h-3.5" />,  badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', dot: '#10B981' },
  negative: { icon: <TrendingDown className="w-3.5 h-3.5" />, badge: 'text-red-400 bg-red-500/10 border-red-500/25',           dot: '#EF4444' },
  neutral:  { icon: <Minus className="w-3.5 h-3.5" />,        badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20',     dot: '#94A3B8' },
};

// ─── Single entry ─────────────────────────────────────────────────────────────

const LedgerRow: React.FC<{
  entry: LedgerEntry;
  agents: StrategyAgent[];
  index: number;
  isLast: boolean;
}> = ({ entry, agents, index, isLast }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const impact = IMPACT_CFG[entry.finalImpact];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.055, ease: EASE }}
      className="relative flex gap-4"
    >
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold font-mono z-10 border"
          style={{ background: impact.dot + '25', borderColor: impact.dot + '40', color: impact.dot }}
        >
          {entry.round}
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-1" style={{ background: `${impact.dot}25` }} />
        )}
      </div>

      {/* Card */}
      <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-5'}`}>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          className="w-full text-left rounded-[14px] border overflow-hidden
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
            transition-all duration-200
            hover:border-white/[0.14] hover:bg-[#151521]/80"
          style={{ borderColor: impact.dot + '22', background: 'rgba(16,16,26,0.8)' }}
        >
          {/* Header */}
          <div className="flex items-start gap-3 p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
                  Round {entry.round}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${impact.badge}`}>
                  {impact.icon}
                  {entry.finalImpact}
                </span>
              </div>
              <p className="text-[13px] font-semibold text-slate-200 leading-tight line-clamp-1">
                {entry.changeMade}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 italic">
                Was: "{entry.originalIdea}"
              </p>
            </div>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-700 flex-shrink-0 mt-1"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </div>

          {/* Expanded detail */}
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
                  {[
                    { label: 'Criticism', value: entry.criticismRaised, color: '#EF4444' },
                    { label: 'Change Made', value: entry.changeMade, color: '#10B981' },
                    { label: 'Reason', value: entry.reason, color: '#8B5CF6' },
                    { label: 'Impact', value: entry.impactLabel, color: impact.dot },
                  ].map(row => (
                    <div key={row.label}>
                      <span
                        className="text-[9px] font-mono font-semibold uppercase tracking-widest"
                        style={{ color: row.color }}
                      >
                        {row.label}
                      </span>
                      <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{row.value}</p>
                    </div>
                  ))}

                  {/* Approved by */}
                  <div>
                    <span className="text-[9px] font-mono font-semibold text-slate-600 uppercase tracking-widest">
                      Approved by
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {entry.approvedBy.map(agentId => {
                        const ag = agents.find(a => a.id === agentId);
                        if (!ag) return null;
                        return (
                          <span
                            key={agentId}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border"
                            style={{ color: ag.color, background: ag.color + '15', borderColor: ag.color + '30' }}
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {ag.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

// ─── Section ─────────────────────────────────────────────────────────────────

interface DecisionLedgerProps {
  entries: LedgerEntry[];
  agents: StrategyAgent[];
}

export const DecisionLedger: React.FC<DecisionLedgerProps> = ({ entries, agents }) => (
  <section aria-label="Decision ledger">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-display font-semibold text-[15px] text-white tracking-tight">
          Decision Ledger
        </h3>
        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
          {entries.length} decisions recorded · {entries.filter(e => e.finalImpact === 'positive').length} positive
        </p>
      </div>
    </div>

    <div>
      {entries.map((entry, i) => (
        <LedgerRow
          key={entry.id}
          entry={entry}
          agents={agents}
          index={i}
          isLast={i === entries.length - 1}
        />
      ))}
    </div>
  </section>
);
