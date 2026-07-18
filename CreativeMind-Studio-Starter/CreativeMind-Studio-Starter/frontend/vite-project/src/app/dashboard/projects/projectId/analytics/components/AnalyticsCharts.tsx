/**
 * AnalyticsCharts.tsx — Interactive Recharts-powered analytics charts
 *
 * Includes:
 *   RetentionCurveChart  — Predicted vs Actual retention line chart
 *   CtrOverTimeChart     — CTR trend line chart with impressions area
 *   PlatformPerfChart    — Horizontal bar chart per platform
 *   CategoryPerfChart    — Radar-style bar for content categories
 *   HookPerfChart        — Horizontal bar for hook style performance
 *   AudienceSegmentsChart — Bar chart for age segments
 */

import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  Area, AreaChart, Cell,
} from 'recharts';
import { RETENTION_DATA, CTR_DATA, PLATFORM_DATA, CATEGORY_DATA, HOOK_DATA, AUDIENCE_SEGMENTS } from '../mockData';
import { CustomChartTooltip, ChartCard, TimeRangeSelector } from './PerformanceShared';
import { CHART_COLORS } from './analyticsConfig';
import type { TimeRange } from '../types';

// ─── Retention Curve Chart ────────────────────────────────────────────────────

export const RetentionCurveChart: React.FC = () => {
  const [hidePredicted, setHidePredicted] = useState(false);
  const [hideActual, setHideActual] = useState(false);

  return (
    <ChartCard
      title="Retention Curve"
      subtitle="Predicted vs Actual audience retention over video duration"
      action={
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHidePredicted(v => !v)}
            className={`flex items-center gap-1.5 text-[11px] font-mono transition-opacity ${hidePredicted ? 'opacity-40' : ''}`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS.predicted }} />
            <span className="text-slate-400">Predicted</span>
          </button>
          <button
            onClick={() => setHideActual(v => !v)}
            className={`flex items-center gap-1.5 text-[11px] font-mono transition-opacity ${hideActual ? 'opacity-40' : ''}`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS.actual }} />
            <span className="text-slate-400">Actual</span>
          </button>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={RETENTION_DATA} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            domain={[20, 105]}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            content={<CustomChartTooltip valueFormatter={(v) => `${v}%`} />}
          />
          <ReferenceLine
            y={50}
            stroke="rgba(239,68,68,0.3)"
            strokeDasharray="4 4"
            label={{ value: '50%', fill: '#EF4444', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          {!hidePredicted && (
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted"
              stroke={CHART_COLORS.predicted}
              strokeWidth={2}
              dot={false}
              strokeDasharray="6 3"
              animationDuration={800}
            />
          )}
          {!hideActual && (
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke={CHART_COLORS.actual}
              strokeWidth={2.5}
              dot={false}
              animationDuration={1000}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Key insight annotation */}
      <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-rose-500/5 border border-rose-500/15">
        <span className="text-rose-400 text-sm font-bold mt-0.5">⚠</span>
        <div>
          <p className="text-[11px] font-semibold text-rose-300">Retention gap detected at 3:00</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Actual dropped 10pp below prediction. Extended intro identified as primary cause.</p>
        </div>
      </div>
    </ChartCard>
  );
};

// ─── CTR Over Time Chart ──────────────────────────────────────────────────────

export const CtrOverTimeChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  return (
    <ChartCard
      title="CTR Over Time"
      subtitle="Click-through rate trend across publication window"
      action={<TimeRangeSelector value={timeRange} onChange={setTimeRange} />}
    >
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={CTR_DATA} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="ctrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.ctr} stopOpacity={0.25} />
              <stop offset="95%" stopColor={CHART_COLORS.ctr} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<CustomChartTooltip valueFormatter={(v) => `${v}%`} />} />
          <Area
            type="monotone"
            dataKey="ctr"
            name="CTR"
            stroke={CHART_COLORS.ctr}
            fill="url(#ctrGrad)"
            strokeWidth={2}
            dot={false}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

// ─── Platform Performance Chart ───────────────────────────────────────────────

const PLAT_COLORS = ['#FF0000', '#0A66C2', '#E1306C', '#000000', '#F59E0B', '#8940FA'];

export const PlatformPerfChart: React.FC = () => (
  <ChartCard
    title="Platform Performance"
    subtitle="Views and engagement rate across all distribution channels"
  >
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={PLATFORM_DATA} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
        />
        <YAxis
          type="category"
          dataKey="platform"
          tick={{ fill: '#CBD5E1', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          content={<CustomChartTooltip valueFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)}M` : `${(v / 1000).toFixed(1)}K`} />}
        />
        <Bar dataKey="views" name="Views" radius={[0, 4, 4, 0]} animationDuration={800}>
          {PLATFORM_DATA.map((_, i) => (
            <Cell key={`cell-${i}`} fill={PLAT_COLORS[i % PLAT_COLORS.length]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

// ─── Category Performance Chart ───────────────────────────────────────────────

export const CategoryPerfChart: React.FC = () => (
  <ChartCard
    title="Content Category Performance"
    subtitle="Average views and retention by content category"
  >
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={CATEGORY_DATA} margin={{ top: 8, right: 12, left: -20, bottom: 40 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
          tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono', angle: -30, textAnchor: 'end' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}M`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          content={
            <CustomChartTooltip
              valueFormatter={(v, name) =>
                name === 'Avg Views'
                  ? `${(v / 1_000_000).toFixed(2)}M`
                  : `${v}%`
              }
            />
          }
        />
        <Legend
          wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#94A3B8', paddingTop: 8 }}
        />
        <Bar yAxisId="left" dataKey="avgViews" name="Avg Views" fill={CHART_COLORS.predicted} fillOpacity={0.8} radius={[4, 4, 0, 0]} animationDuration={800} />
        <Bar yAxisId="right" dataKey="avgRetention" name="Avg Retention" fill={CHART_COLORS.actual} fillOpacity={0.8} radius={[4, 4, 0, 0]} animationDuration={900} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

// ─── Hook Performance Chart ───────────────────────────────────────────────────

export const HookPerfChart: React.FC = () => (
  <ChartCard
    title="Hook Style Performance"
    subtitle="30-second retention rate by hook style across all videos"
  >
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={HOOK_DATA} layout="vertical" margin={{ top: 0, right: 50, left: 20, bottom: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="hookStyle"
          tick={{ fill: '#CBD5E1', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip content={<CustomChartTooltip valueFormatter={(v) => `${v}%`} />} />
        <Bar dataKey="avgRetention30s" name="30s Retention" radius={[0, 4, 4, 0]} animationDuration={800}>
          {HOOK_DATA.map((entry, i) => {
            const pct = entry.avgRetention30s;
            const fill = pct >= 85 ? '#10B981' : pct >= 75 ? '#8B5CF6' : pct >= 65 ? '#3B82F6' : '#F59E0B';
            return <Cell key={i} fill={fill} fillOpacity={0.85} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

// ─── Audience Segments Chart ──────────────────────────────────────────────────

export const AudienceSegmentsChart: React.FC = () => (
  <ChartCard
    title="Audience Age Segments"
    subtitle="Viewership distribution and avg watch time by age group"
  >
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={AUDIENCE_SEGMENTS} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="age"
          tick={{ fill: '#CBD5E1', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: CHART_COLORS.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}m`}
        />
        <Tooltip
          content={
            <CustomChartTooltip
              valueFormatter={(v, name) => name === 'Audience %' ? `${v}%` : `${v} min`}
            />
          }
        />
        <Legend
          wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#94A3B8' }}
        />
        <Bar yAxisId="left" dataKey="percentage" name="Audience %" fill={CHART_COLORS.predicted} fillOpacity={0.8} radius={[4, 4, 0, 0]} animationDuration={800} />
        <Bar yAxisId="right" dataKey="avgWatchTime" name="Avg Watch Time" fill={CHART_COLORS.secondary} fillOpacity={0.8} radius={[4, 4, 0, 0]} animationDuration={900} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);
