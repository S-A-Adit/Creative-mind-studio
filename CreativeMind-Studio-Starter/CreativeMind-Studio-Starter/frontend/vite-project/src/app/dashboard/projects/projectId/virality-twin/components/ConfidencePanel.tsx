/**
 * ConfidencePanel.tsx — Similarity scores, prediction confidence, and dataset metadata.
 *
 * Prominently labels all data as simulated.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Database,
  Clock,
  ShieldCheck,
  TrendingUp,
  Activity,
} from 'lucide-react';
import type { ConfidenceData, DataBadge } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, delay = 0): number {
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

// ─── Badge config ─────────────────────────────────────────────────────────────

const BADGE_CFG: Record<DataBadge, { label: string; cls: string; icon: React.ReactNode }> = {
  curated:   { label: 'Curated Dataset', cls: 'text-violet-400 bg-violet-500/10 border-violet-500/25', icon: <ShieldCheck className="w-3 h-3" />  },
  cached:    { label: 'Cached Data',     cls: 'text-amber-400  bg-amber-500/10  border-amber-500/25',  icon: <Database className="w-3 h-3" />     },
  simulated: { label: 'Simulated Data ⚠️', cls: 'text-orange-400 bg-orange-500/10 border-orange-500/25', icon: <AlertCircle className="w-3 h-3" />  },
};

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

// ─── Score gauge ──────────────────────────────────────────────────────────────

const ScoreGauge: React.FC<{
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  delay?: number;
}> = ({ label, value, color, icon, delay = 0 }) => {
  const displayed = useCountUp(value, delay);
  const circ = 2 * Math.PI * 28;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={72} height={72} className="rotate-[-90deg]">
          <circle cx={36} cy={36} r={28} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
          <motion.circle
            cx={36} cy={36} r={28}
            fill="none" stroke={color} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: circ - (value / 100) * circ }}
            transition={{ duration: 0.9, delay: delay / 1000, ease: EASE }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-display font-bold text-[16px] leading-none" style={{ color }}>
            {displayed}
          </span>
          <span className="text-[8px] text-slate-600 font-mono">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ConfidencePanelProps {
  data: ConfidenceData;
}

export const ConfidencePanel: React.FC<ConfidencePanelProps> = ({ data }) => {
  const badge = BADGE_CFG[data.dataBadge];

  return (
    <section aria-label="Analysis confidence and dataset metadata">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-[15px] text-white tracking-tight">
            Confidence Panel
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Similarity and prediction confidence scores
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold ${badge.cls}`}>
          {badge.icon}
          {badge.label}
        </span>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-5 space-y-5">
        {/* Warning banner for simulated data */}
        {data.dataBadge === 'simulated' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 px-3.5 py-3 rounded-[10px] bg-orange-500/08 border border-orange-500/22"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-orange-300/80 leading-relaxed">{data.note}</p>
          </motion.div>
        )}

        {/* Gauges row */}
        <div className="flex items-center justify-around flex-wrap gap-4">
          <ScoreGauge
            label="Similarity"
            value={data.similarityScore}
            color="#8B5CF6"
            icon={<Activity className="w-3 h-3" />}
            delay={0}
          />
          <ScoreGauge
            label="Success Conf."
            value={data.successConfidence}
            color="#10B981"
            icon={<TrendingUp className="w-3 h-3" />}
            delay={100}
          />
          <ScoreGauge
            label="Prediction Conf."
            value={data.predictionConfidence}
            color="#06B6D4"
            icon={<ShieldCheck className="w-3 h-3" />}
            delay={200}
          />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.05]">
          {[
            { icon: <Database className="w-3 h-3" />,  label: 'Dataset Size',   value: `${data.datasetSize.toLocaleString()} samples` },
            { icon: <Clock className="w-3 h-3" />,     label: 'Last Analysis',  value: timeAgo(data.analysisTimestamp) },
            { icon: <ShieldCheck className="w-3 h-3" />, label: 'Source',       value: data.datasetSource },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-2 col-span-1 last:col-span-2">
              <span className="text-slate-600 flex-shrink-0 mt-0.5">{row.icon}</span>
              <div>
                <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">{row.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
