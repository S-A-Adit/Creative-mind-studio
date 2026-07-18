/**
 * ScoreCard.tsx — Animated strategy scorecard with radial ring, trend, and AI explanation.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronDown } from 'lucide-react';
import type { ScoreCard as ScoreCardType, StrategyAgent } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, delay = 0) {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 900, 1);
        const e = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(e * target));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, delay]);
  return val;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ScoreCardProps {
  card: ScoreCardType;
  agent: StrategyAgent | undefined;
  index: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ card, agent, index }) => {
  const [expanded, setExpanded] = useState(false);
  const displayed = useCountUp(card.score, index * 80);
  const circ = 2 * Math.PI * 22;
  const isUp = card.trend > 0;
  const isNeutral = card.trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.055, ease: EASE }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group relative rounded-2xl border border-white/[0.07] bg-[#10101A]/80
        hover:border-white/[0.13] hover:bg-[#151521]/80
        transition-colors duration-200 overflow-hidden"
    >
      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)` }}
      />

      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-2xl"
        aria-expanded={expanded}
      >
        {/* Radial ring */}
        <div className="relative flex-shrink-0">
          <svg width={52} height={52} className="rotate-[-90deg]">
            <circle cx={26} cy={26} r={22} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
            <motion.circle
              cx={26} cy={26} r={22}
              fill="none" stroke={card.color}
              strokeWidth={4} strokeLinecap="round"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: circ - (card.score / 100) * circ }}
              transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-[13px]" style={{ color: card.color }}>
              {displayed}
            </span>
          </div>
        </div>

        {/* Label + trend */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-100 leading-tight mb-1">{card.label}</p>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded-full border ${
              isNeutral ? 'text-slate-500 bg-slate-800/40 border-slate-700/40'
              : isUp ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}>
              {isNeutral ? <Minus className="w-3 h-3" /> : isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isNeutral ? '—' : `${isUp ? '+' : ''}${card.trend}`}
            </div>
            {agent && (
              <span
                className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                style={{ color: agent.color, background: agent.color + '18' }}
              >
                {agent.name}
              </span>
            )}
          </div>
        </div>

        {/* Score bar */}
        <div className="w-14 flex-shrink-0">
          <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden mb-1">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: card.color }}
              animate={{ width: `${card.score}%` }}
              transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }} />
          </div>
          <p className="text-[9px] font-mono text-slate-700 text-right">/100</p>
        </div>

        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-700 flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      {/* Expanded explanation */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-4 pt-0 space-y-2 border-t border-white/[0.05]">
            <p className="text-[12px] text-slate-400 leading-relaxed pt-3">{card.explanation}</p>
            <div className="flex items-start gap-2 px-3 py-2 rounded-[9px] bg-amber-500/06 border border-amber-500/18">
              <span className="text-amber-500 text-[10px] font-mono font-semibold mt-0.5">IMPROVE</span>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">{card.improvement}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─── Score grid ───────────────────────────────────────────────────────────────

interface ScorecardsGridProps {
  scorecards: ScoreCardType[];
  agents: StrategyAgent[];
}

export const ScorecardsGrid: React.FC<ScorecardsGridProps> = ({ scorecards, agents }) => (
  <div className="space-y-2.5">
    {scorecards.map((card, i) => (
      <ScoreCard
        key={card.id}
        card={card}
        agent={agents.find(a => a.id === card.agentId)}
        index={i}
      />
    ))}
  </div>
);
