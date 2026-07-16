/**
 * HealthDashboard.tsx — Premium KPI cards for project health metrics.
 *
 * 8 cards: Project Health · Originality · Feasibility · Virality ·
 *          Evidence Coverage · Asset Readiness · Rights Risk · Overall Progress
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { HealthMetric, HealthStatus } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, delay = 0): number {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const duration = 900;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setVal(Math.round(eased * target));
        if (progress < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, delay]);

  return val;
}

// ─── Status ring color ────────────────────────────────────────────────────────

const STATUS_RING: Record<HealthStatus, string> = {
  excellent: '#10B981',
  good:      '#3B82F6',
  warning:   '#F59E0B',
  critical:  '#EF4444',
};

// ─── Single metric card ───────────────────────────────────────────────────────

const MetricCard: React.FC<{ metric: HealthMetric; index: number }> = ({ metric, index }) => {
  const displayed = useCountUp(metric.score, index * 60);
  const isUp = metric.trend > 0;
  const isNeutral = metric.trend === 0;
  const ringColor = STATUS_RING[metric.status];
  const circ = 2 * Math.PI * 20; // r=20

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, delay: index * 0.05, ease: ease.snappy }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-white/[0.07]
        bg-[#10101A]/80 backdrop-blur-sm
        hover:border-white/[0.13] hover:bg-[#151521]/80
        transition-colors duration-200 overflow-hidden"
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none rounded-tr-2xl"
        style={{ background: `radial-gradient(circle at top right, ${metric.color}18 0%, transparent 70%)` }}
      />
      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${metric.color}50, transparent)` }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between">
        {/* Mini radial ring */}
        <svg width={48} height={48} className="rotate-[-90deg] flex-shrink-0">
          <circle cx={24} cy={24} r={20} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
          <motion.circle
            cx={24} cy={24} r={20}
            fill="none"
            stroke={ringColor}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (metric.score / 100) * circ }}
            transition={{ duration: 0.8, delay: index * 0.06, ease: ease.snappy }}
          />
        </svg>

        {/* Trend chip */}
        <div className={`flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
          isNeutral
            ? 'text-slate-500 bg-slate-800/40 border-slate-700/40'
            : isUp
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
        }`}>
          {isNeutral ? (
            <Minus className="w-3 h-3" />
          ) : isUp ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isNeutral ? '—' : `${isUp ? '+' : ''}${metric.trend}%`}
        </div>
      </div>

      {/* Score + label */}
      <div>
        <div className="flex items-end gap-1.5 mb-1">
          <span
            className="font-display font-bold text-3xl tracking-tight tabular-nums"
            style={{ color: ringColor }}
          >
            {displayed}
          </span>
          <span className="text-slate-600 text-sm mb-0.5 font-mono">/100</span>
        </div>
        <p className="text-[13px] font-semibold text-slate-200">{metric.label}</p>
      </div>

      {/* Explanation */}
      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
        {metric.explanation}
      </p>

      {/* Thin progress bar */}
      <div className="h-0.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: ringColor }}
          animate={{ width: `${metric.score}%` }}
          transition={{ duration: 0.7, delay: index * 0.05 + 0.1, ease: ease.snappy }}
        />
      </div>
    </motion.div>
  );
};

// ─── Section ─────────────────────────────────────────────────────────────────

interface HealthDashboardProps {
  metrics: HealthMetric[];
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({ metrics }) => (
  <section aria-label="Project health dashboard">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
          Project Health
        </h2>
        <p className="text-[12px] text-slate-500 font-mono mt-0.5">
          8 AI-scored metrics · updated in real time
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <MetricCard key={m.id} metric={m} index={i} />
      ))}
    </div>
  </section>
);
