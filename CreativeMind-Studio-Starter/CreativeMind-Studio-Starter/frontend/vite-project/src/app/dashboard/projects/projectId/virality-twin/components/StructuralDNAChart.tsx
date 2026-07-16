/**
 * StructuralDNAChart.tsx — Radar chart comparing structural DNA across 3 content pieces.
 *
 * Uses Recharts RadarChart with animated entrance.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { RadarDataPoint } from '../types';

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
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[11px] text-slate-400 font-mono">{entry.name}</span>
          </div>
          <span className="text-[12px] font-mono font-bold text-slate-100">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Custom legend ─────────────────────────────────────────────────────────────

interface LegendEntry { value: string; color: string }

const CustomLegend: React.FC<{ payload?: LegendEntry[] }> = ({ payload }) => (
  <div className="flex flex-wrap gap-4 justify-center mt-4">
    {payload?.map(entry => (
      <div key={entry.value} className="flex items-center gap-2">
        <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-[11px] font-mono text-slate-400">{entry.value}</span>
      </div>
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

interface StructuralDNAChartProps {
  data: RadarDataPoint[];
}

export const StructuralDNAChart: React.FC<StructuralDNAChartProps> = ({ data }) => (
  <section aria-label="Structural DNA radar chart">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-display font-semibold text-[15px] text-white tracking-tight">
          Structural DNA
        </h3>
        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
          8-axis content structure comparison · simulated scores
        </p>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-5 md:p-6"
    >
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <defs>
            <radialGradient id="conceptFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
            </radialGradient>
            <radialGradient id="successFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#10B981" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.03} />
            </radialGradient>
            <radialGradient id="failureFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#EF4444" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02} />
            </radialGradient>
          </defs>

          <PolarGrid
            stroke="rgba(255,255,255,0.05)"
            gridType="polygon"
          />

          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#334155', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            tickCount={5}
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

          <Radar
            name="Successful Twin"
            dataKey="success"
            stroke="#10B981"
            fill="url(#successFill)"
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 3 }}
          />
          <Radar
            name="Your Concept"
            dataKey="concept"
            stroke="#8B5CF6"
            fill="url(#conceptFill)"
            strokeWidth={2.5}
            strokeDasharray="5 3"
            dot={{ fill: '#8B5CF6', r: 3 }}
          />
          <Radar
            name="Failed Twin"
            dataKey="failure"
            stroke="#EF4444"
            fill="url(#failureFill)"
            strokeWidth={1.5}
            strokeOpacity={0.7}
            dot={{ fill: '#EF4444', r: 2 }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <p className="mt-2 text-[10px] font-mono text-slate-700 text-center">
        ⚠️ Concept scores are projected estimates. Twin scores are derived from simulated dataset.
      </p>
    </motion.div>
  </section>
);
