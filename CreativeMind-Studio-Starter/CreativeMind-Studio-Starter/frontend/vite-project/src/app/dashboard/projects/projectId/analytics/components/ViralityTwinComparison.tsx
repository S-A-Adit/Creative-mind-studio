/**
 * ViralityTwinComparison.tsx — Post-launch Virality Twin comparison panel
 *
 * Shows predicted vs actual performance metrics, a dual-line chart,
 * prediction error analysis, AI explanation, and confidence score.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  GitCompare, Brain, Lightbulb, Target,
} from 'lucide-react';
import { VIRALITY_TWIN, RETENTION_DATA } from '../mockData';
import { ConfidenceBar, SectionLabel, ChartCard } from './PerformanceShared';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { CustomChartTooltip } from './PerformanceShared';
import { CHART_COLORS } from './analyticsConfig';

// ─── Metric Comparison Row ────────────────────────────────────────────────────

interface MetricRowProps {
  label: string;
  predicted: number;
  actual: number;
  unit: string;
  diff: number;
  index: number;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, predicted, actual, unit, diff, index }) => {
  const isOver = diff > 0;
  const color = isOver ? '#10B981' : '#EF4444';
  const maxVal = Math.max(predicted, actual);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06 }}
      className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-3 border-b border-white/[0.05] last:border-0"
    >
      {/* Predicted bar */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] font-mono text-slate-500">{predicted}{unit}</span>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(predicted / maxVal) * 100}%` }}
            transition={{ duration: 0.7, delay: 0.2 + index * 0.05 }}
            className="h-full rounded-full"
            style={{ background: CHART_COLORS.predicted }}
          />
        </div>
      </div>

      {/* Center label */}
      <div className="text-center px-2">
        <p className="text-[10px] font-mono text-slate-400 whitespace-nowrap">{label}</p>
        <span
          className="text-[11px] font-mono font-bold"
          style={{ color }}
        >
          {isOver ? '+' : ''}{diff}{unit}
        </span>
      </div>

      {/* Actual bar */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono text-slate-500">{actual}{unit}</span>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(actual / maxVal) * 100}%` }}
            transition={{ duration: 0.7, delay: 0.25 + index * 0.05 }}
            className="h-full rounded-full"
            style={{ background: CHART_COLORS.actual }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const ViralityTwinComparisonPanel: React.FC = () => {
  const vt = VIRALITY_TWIN;

  return (
    <div className="space-y-4">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/[0.07] bg-[#151521]/60 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <GitCompare className="w-4 h-4 text-[#9D6CFF]" />
          <h3 className="font-display font-semibold text-white text-sm">
            Virality Twin — Post-Launch Report
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Predicted Score', value: `${vt.predictedScore}`, color: CHART_COLORS.predicted },
            { label: 'Actual Score',    value: `${vt.actualScore}`,    color: CHART_COLORS.actual   },
            { label: 'Prediction Error',value: `−${vt.predictionError}pts`, color: '#EF4444'        },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center"
            >
              <div
                className="text-2xl font-display font-bold"
                style={{ color }}
              >
                {value}
              </div>
              <SectionLabel className="block mt-1">{label}</SectionLabel>
            </div>
          ))}
        </div>

        {/* Confidence score */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              <SectionLabel>Prediction Accuracy</SectionLabel>
            </div>
          </div>
          <ConfidenceBar score={vt.confidenceScore} />
        </div>
      </motion.div>

      {/* Dual retention chart */}
      <ChartCard
        title="Predicted vs Actual Drop-off"
        subtitle={`Predicted drop-off: ${Math.floor(vt.predictedDropOffPoint / 60)}:${String(vt.predictedDropOffPoint % 60).padStart(2,'0')} · Actual: ${Math.floor(vt.actualDropOffPoint / 60)}:${String(vt.actualDropOffPoint % 60).padStart(2,'0')}`}
      >
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={RETENTION_DATA} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={false} interval={5}
            />
            <YAxis
              tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<CustomChartTooltip valueFormatter={(v) => `${v}%`} />} />
            <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#94A3B8' }} />
            <Line type="monotone" dataKey="predicted" name="Predicted" stroke={CHART_COLORS.predicted} strokeWidth={2} strokeDasharray="6 3" dot={false} animationDuration={800} />
            <Line type="monotone" dataKey="actual"    name="Actual"    stroke={CHART_COLORS.actual}    strokeWidth={2.5} dot={false} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Metric rows */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/[0.07] bg-[#151521]/60 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS.predicted }} />
            <SectionLabel>Predicted</SectionLabel>
          </div>
          <div className="flex items-center gap-1.5">
            <SectionLabel>Actual</SectionLabel>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS.actual }} />
          </div>
        </div>

        {vt.metrics.map((m, i) => (
          <MetricRow
            key={m.label}
            label={m.label}
            predicted={m.predicted}
            actual={m.actual}
            unit={m.unit}
            diff={m.diff}
            index={i}
          />
        ))}
      </motion.div>

      {/* AI Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/[0.04] p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-[#9D6CFF]" />
          <span className="text-xs font-semibold text-[#9D6CFF]">AI Explanation</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{vt.aiExplanation}</p>
      </motion.div>

      {/* Learning captured */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">Learning Captured</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{vt.learningCaptured}</p>
      </motion.div>
    </div>
  );
};
