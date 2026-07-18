/**
 * KpiCardsRow.tsx — Premium animated KPI metrics row
 *
 * Displays Views, Impressions, CTR, Watch Time, Avg View Duration,
 * Retention, Shares, Saves, Conversions — each with sparkline,
 * trend badge, animated counter, and time range label.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Radio, MousePointerClick, Clock, Timer,
  BarChart3, Share2, Bookmark, TrendingUp,
} from 'lucide-react';
import { KPI_METRICS } from '../mockData';
import type { KpiMetric } from '../types';
import { TrendBadge, MiniSparkline, SectionLabel } from './PerformanceShared';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const METRIC_ICONS: Record<string, React.ElementType> = {
  views:            Eye,
  impressions:      Radio,
  ctr:              MousePointerClick,
  watch_time:       Clock,
  avg_view_duration:Timer,
  retention:        BarChart3,
  shares:           Share2,
  saves:            Bookmark,
  conversions:      TrendingUp,
};

const METRIC_COLORS: Record<string, string> = {
  views:            '#8B5CF6',
  impressions:      '#3B82F6',
  ctr:              '#10B981',
  watch_time:       '#F59E0B',
  avg_view_duration:'#EC4899',
  retention:        '#8B5CF6',
  shares:           '#06B6D4',
  saves:            '#F97316',
  conversions:      '#EF4444',
};

// ─── Single KPI Card ──────────────────────────────────────────────────────────

interface KpiCardProps {
  metric: KpiMetric;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ metric, index, isSelected, onSelect }) => {
  const Icon = METRIC_ICONS[metric.id] ?? Eye;
  const color = METRIC_COLORS[metric.id] ?? '#8B5CF6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={onSelect}
      className={`flex-shrink-0 rounded-2xl border cursor-pointer transition-all duration-200 p-4 min-w-[172px] ${
        isSelected
          ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/8 shadow-[0_0_20px_rgba(139,92,246,0.12)]'
          : 'border-white/[0.07] bg-[#151521]/60 hover:border-white/[0.15]'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}25` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <TrendBadge change={metric.change} size="sm" />
      </div>

      {/* Value */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.04 }}
      >
        <div
          className="text-2xl font-display font-bold tracking-tight mb-0.5"
          style={{ color }}
        >
          {metric.value}
        </div>
        <SectionLabel className="block mb-3">{metric.label}</SectionLabel>
      </motion.div>

      {/* Sparkline */}
      <MiniSparkline data={metric.sparkline} color={color} height={28} width={72} />

      {/* Time range */}
      <p className="text-[10px] font-mono text-slate-600 mt-2">{metric.timeRange}</p>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface KpiCardsRowProps {
  selectedMetric: string | null;
  onSelectMetric: (id: string) => void;
}

export const KpiCardsRow: React.FC<KpiCardsRowProps> = ({ selectedMetric, onSelectMetric }) => (
  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
    {KPI_METRICS.map((metric, i) => (
      <KpiCard
        key={metric.id}
        metric={metric}
        index={i}
        isSelected={selectedMetric === metric.id}
        onSelect={() => onSelectMetric(metric.id)}
      />
    ))}
  </div>
);
