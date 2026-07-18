/**
 * EmotionalCurve.tsx — Animated multi-line emotional arc chart using Recharts.
 *
 * Visualises: Emotional Intensity · Curiosity · Tension · Audience Engagement
 * across all 7 story stages: Hook → Setup → Conflict → Development → Reveal → Resolution → CTA
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import type { EmotionalPoint } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Custom tooltip ───────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0B0B12] border border-white/[0.12] rounded-xl px-3.5 py-3 shadow-2xl">
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1.5 last:mb-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-[11px] text-slate-400 font-mono">{entry.name}</span>
          </div>
          <span className="text-[12px] font-mono font-bold text-slate-100">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Custom legend ────────────────────────────────────────────────────────────

interface LegendEntry { value: string; color: string }
const CustomLegend: React.FC<{ payload?: LegendEntry[] }> = ({ payload }) => (
  <div className="flex flex-wrap gap-4 justify-center mt-3">
    {payload?.map(e => (
      <div key={e.value} className="flex items-center gap-2">
        <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: e.color }} />
        <span className="text-[11px] font-mono text-slate-400">{e.value}</span>
      </div>
    ))}
  </div>
);

// ─── Reference line for reveal peak ──────────────────────────────────────────

const PEAK_STAGE = 'Reveal';

// ─── Component ────────────────────────────────────────────────────────────────

interface EmotionalCurveProps {
  data: EmotionalPoint[];
}

export const EmotionalCurve: React.FC<EmotionalCurveProps> = ({ data }) => (
  <section aria-label="Emotional arc chart">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-display font-semibold text-[15px] text-white tracking-tight">
          Emotional Curve
        </h3>
        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
          Audience emotional arc across story stages · ⚠️ simulated
        </p>
      </div>
      <div className="flex items-center gap-3">
        {[
          { label: 'Peak at Reveal', color: '#8B5CF6' },
        ].map(d => (
          <div key={d.label} className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: d.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.label}
          </div>
        ))}
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-5 md:p-6"
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="intensityGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

          <XAxis
            dataKey="stage"
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}`}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1 }} />
          <Legend content={<CustomLegend />} />

          {/* Peak reference */}
          <ReferenceLine x={PEAK_STAGE} stroke="rgba(139,92,246,0.3)" strokeDasharray="4 4" />

          <Line type="monotone" dataKey="intensity"  name="Intensity"   stroke="url(#intensityGrad)"  strokeWidth={2.5} dot={{ r: 3, fill: '#EF4444',  stroke: '#0B0B12', strokeWidth: 2 }} activeDot={{ r: 5 }} animationDuration={1200} />
          <Line type="monotone" dataKey="curiosity"  name="Curiosity"   stroke="#06B6D4"  strokeWidth={2}   dot={{ r: 3, fill: '#06B6D4',  stroke: '#0B0B12', strokeWidth: 2 }} activeDot={{ r: 5 }} animationDuration={1400} />
          <Line type="monotone" dataKey="tension"    name="Tension"     stroke="#F59E0B"  strokeWidth={2}   strokeDasharray="5 3" dot={{ r: 3, fill: '#F59E0B',  stroke: '#0B0B12', strokeWidth: 2 }} activeDot={{ r: 5 }} animationDuration={1600} />
          <Line type="monotone" dataKey="engagement" name="Engagement"  stroke="#10B981"  strokeWidth={2.5} dot={{ r: 3, fill: '#10B981',  stroke: '#0B0B12', strokeWidth: 2 }} activeDot={{ r: 5 }} animationDuration={1800} />
        </LineChart>
      </ResponsiveContainer>

      <p className="mt-2 text-[10px] font-mono text-slate-700 text-center">
        ⚠️ Curve is AI-projected from structural script analysis — not derived from audience data.
      </p>
    </motion.div>
  </section>
);

// ─── Area variant for compact use ─────────────────────────────────────────────

export const EmotionalCurveArea: React.FC<EmotionalCurveProps> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.35 }}
    className="h-20 w-full"
  >
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 2, right: 2, left: -40, bottom: 0 }}>
        <defs>
          <linearGradient id="engArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"   stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%"  stopColor="#10B981" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="engagement" stroke="#10B981" fill="url(#engArea)" strokeWidth={1.5} dot={false} />
        <XAxis dataKey="stage" tick={false} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} hide />
      </AreaChart>
    </ResponsiveContainer>
  </motion.div>
);
