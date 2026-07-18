/**
 * AudienceInsightsPanel.tsx — Audience analytics dashboard
 *
 * Displays: age distribution, device breakdown, returning vs new,
 * geographic distribution, traffic sources, platform engagement.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, ArrowUpRight } from 'lucide-react';
import { AUDIENCE_INSIGHTS } from '../mockData';
import { SectionLabel } from './PerformanceShared';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { CustomChartTooltip, ChartCard } from './PerformanceShared';
import { CHART_COLORS } from './analyticsConfig';

// ─── Horizontal percent bar ───────────────────────────────────────────────────

interface PctBarProps {
  label: string;
  pct: number;
  color: string;
  sublabel?: string;
  delay?: number;
}

const PctBar: React.FC<PctBarProps> = ({ label, pct, color, sublabel, delay = 0 }) => (
  <div className="flex items-center gap-3 py-1.5">
    <div className="w-20 flex-shrink-0">
      <span className="text-[11px] font-mono text-slate-300 truncate block">{label}</span>
      {sublabel && <span className="text-[9px] font-mono text-slate-600">{sublabel}</span>}
    </div>
    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: 'easeOut', delay }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
    <span className="text-[11px] font-mono font-bold w-10 text-right flex-shrink-0" style={{ color }}>
      {pct}%
    </span>
  </div>
);

// ─── Donut mini chart ─────────────────────────────────────────────────────────

interface DonutChartProps {
  data: Array<{ name?: string; age?: string; device?: string; pct: number; color: string }>;
  labelKey: 'age' | 'device' | 'name';
}

const DonutChart: React.FC<DonutChartProps> = ({ data, labelKey }) => {
  const chartData = data.map(d => ({
    name: d[labelKey] ?? d.age ?? d.device ?? '',
    value: d.pct,
    color: d.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          animationBegin={100}
          animationDuration={700}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomChartTooltip valueFormatter={(v) => `${v}%`} />}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const AudienceInsightsPanel: React.FC = () => {
  const a = AUDIENCE_INSIGHTS;
  const formattedViewers = a.totalUniqueViewers >= 1_000_000
    ? `${(a.totalUniqueViewers / 1_000_000).toFixed(2)}M`
    : `${(a.totalUniqueViewers / 1_000).toFixed(0)}K`;

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Unique Viewers', value: formattedViewers, color: '#8B5CF6', Icon: Users },
          { label: 'Returning',      value: `${a.returningPct}%`, color: '#10B981', Icon: ArrowUpRight },
          { label: 'New Viewers',    value: `${a.newPct}%`, color: '#3B82F6', Icon: Globe },
        ].map(({ label, value, color, Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-white/[0.07] bg-[#151521]/60 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}20` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <SectionLabel>{label}</SectionLabel>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color }}>{value}</div>
          </motion.div>
        ))}
      </div>

      {/* Age + Device donut charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Age Distribution">
          <DonutChart data={a.ageDistribution} labelKey="age" />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {a.ageDistribution.map(d => (
              <div key={d.age} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-[10px] font-mono text-slate-400">{d.age} · {d.pct}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Device Breakdown">
          <DonutChart data={a.deviceBreakdown.map(d => ({ ...d, age: d.device, name: d.device }))} labelKey="name" />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {a.deviceBreakdown.map(d => (
              <div key={d.device} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-[10px] font-mono text-slate-400">{d.device} · {d.pct}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Geographic distribution */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/[0.07] bg-[#151521]/60 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <h4 className="font-display font-semibold text-sm text-white">Geographic Distribution</h4>
        </div>
        <div className="space-y-0.5">
          {a.geographicTop5.map((g, i) => (
            <PctBar
              key={g.country}
              label={`${g.flag} ${g.country}`}
              pct={g.pct}
              color="#8B5CF6"
              delay={i * 0.08}
            />
          ))}
        </div>
      </motion.div>

      {/* Traffic sources */}
      <ChartCard title="Traffic Sources" subtitle="Where viewers are coming from">
        <div className="space-y-0.5">
          {a.trafficSources.map((s, i) => (
            <PctBar
              key={s.source}
              label={s.source}
              pct={s.pct}
              color={s.color}
              delay={i * 0.06}
            />
          ))}
        </div>
      </ChartCard>

      {/* Platform engagement */}
      <ChartCard title="Engagement by Platform" subtitle="Engagement rate per channel">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={a.platformEngagement} margin={{ top: 8, right: 12, left: -20, bottom: 40 }}>
            <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="platform"
              tick={{ fill: '#CBD5E1', fontSize: 10, fontFamily: 'JetBrains Mono', angle: -30, textAnchor: 'end' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<CustomChartTooltip valueFormatter={(v) => `${v}%`} />} />
            <Bar dataKey="engagement" name="Engagement %" radius={[4, 4, 0, 0]} animationDuration={800}>
              {a.platformEngagement.map((entry, i) => (
                <Cell key={i} fill={entry.color === '#000000' ? '#475569' : entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
