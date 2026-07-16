/**
 * RetentionChart.tsx — Animated multi-line retention curve using Recharts.
 *
 * Displays concept vs successful twin vs failed twin over video duration.
 */

import React, { useState } from 'react';
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
} from 'recharts';
import type { RetentionDataPoint } from '../types';

// ─── Custom tooltip ───────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0B0B12] border border-white/[0.12] rounded-xl px-3.5 py-3 shadow-2xl min-w-44">
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">{label}</p>
      {payload.map(entry => (
        entry.value != null && (
          <div key={entry.name} className="flex items-center justify-between gap-4 mb-1.5 last:mb-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-[11px] text-slate-400 font-mono">{entry.name}</span>
            </div>
            <span className="text-[12px] font-mono font-bold text-slate-100">
              {entry.value}%
            </span>
          </div>
        )
      ))}
    </div>
  );
};

// ─── Custom legend ────────────────────────────────────────────────────────────

interface LegendEntry { value: string; color: string }

const CustomLegend: React.FC<{ payload?: LegendEntry[] }> = ({ payload }) => (
  <div className="flex flex-wrap gap-4 justify-center mt-3">
    {payload?.map(entry => (
      <div key={entry.value} className="flex items-center gap-2">
        <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-[11px] font-mono text-slate-400">{entry.value}</span>
      </div>
    ))}
  </div>
);

// ─── Drop-off annotation ──────────────────────────────────────────────────────

const DROP_OFFS = [
  { at: '0:30', label: '30s drop', color: '#F59E0B' },
  { at: '5:00', label: '5m drop',  color: '#EF4444'  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface RetentionChartProps {
  data: RetentionDataPoint[];
}

export const RetentionChart: React.FC<RetentionChartProps> = ({ data }) => {
  const [animated, setAnimated] = useState(false);

  return (
    <section aria-label="Retention analysis chart">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-[15px] text-white tracking-tight">
            Retention Analysis
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Viewer retention curve across video duration · simulated data
          </p>
        </div>
        <div className="flex items-center gap-3">
          {DROP_OFFS.map(d => (
            <div key={d.at} className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: d.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
              {d.label}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => setAnimated(true)}
        className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-5 md:p-6"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="conceptGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#9D6CFF" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
              interval={2}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
            <Legend content={<CustomLegend />} />

            {/* Critical drop-off reference lines */}
            <ReferenceLine x="0:30" stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.4} />
            <ReferenceLine x="5:00" stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.4} />

            <Line
              type="monotone"
              dataKey="success"
              name="Successful Twin"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#10B981', stroke: '#0B0B12', strokeWidth: 2 }}
              isAnimationActive={animated}
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="concept"
              name="Your Concept"
              stroke="url(#conceptGrad)"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#0B0B12', strokeWidth: 2 }}
              isAnimationActive={animated}
              animationDuration={1400}
            />
            <Line
              type="monotone"
              dataKey="failure"
              name="Failed Twin"
              stroke="#EF4444"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              dot={false}
              activeDot={{ r: 4, fill: '#EF4444', stroke: '#0B0B12', strokeWidth: 2 }}
              isAnimationActive={animated}
              animationDuration={1600}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Annotation note */}
        <p className="mt-3 text-[10px] font-mono text-slate-700 text-center">
          ⚠️ Dashed line = Your concept (projected). Solid lines = historical data from twin dataset.
        </p>
      </motion.div>
    </section>
  );
};
