/**
 * ViralityTwinPage.tsx — The AI content analysis lab for CreativeMind Studio.
 *
 * DESKTOP : Top filters · 3-col cards · comparison table · 2-col charts · insights · right panel
 * TABLET  : 2-col cards + stacked sections
 * MOBILE  : Full stacked + horizontal-scroll charts
 */

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitCompare,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useLayout } from '../../../../../lib/useLayout';
import { FiltersBar }         from './components/FiltersBar';
import { TwinComparison }     from './components/ComparisonCard';
import { ComparisonTable }    from './components/ComparisonTable';
import { RetentionChart }     from './components/RetentionChart';
import { StructuralDNAChart } from './components/StructuralDNAChart';
import { InsightSection }     from './components/InsightCard';
import { ConfidencePanel }    from './components/ConfidencePanel';
import { MethodologyPanel }   from './components/MethodologyPanel';
import { RightInsightPanel }  from './components/RightInsightPanel';
import { MOCK_VIRALITY_TWIN } from './mockData';
import type { AnalysisFilters } from './types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, children, badge, className = '' }) => (
  <section className={className}>
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-[11px] text-slate-500 font-mono mt-0.5">{subtitle}</p>}
      </div>
      {badge && <div>{badge}</div>}
    </div>
    {children}
  </section>
);

// ─── AI indicator badge ───────────────────────────────────────────────────────

const AiBadge: React.FC = () => (
  <div className="flex items-center gap-1.5">
    <motion.span
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-1.5 h-1.5 rounded-full bg-[#9D6CFF]"
    />
    <span className="text-[11px] font-mono text-[#9D6CFF]">AI Active</span>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

interface ViralityTwinPageProps {
  onBack?: () => void;
  onContinue?: () => void;
}

export const ViralityTwinPage: React.FC<ViralityTwinPageProps> = ({
  onBack,
  onContinue,
}) => {
  const { setBreadcrumbs, setPrimaryAction, setActiveNavId } = useLayout();
  const data = MOCK_VIRALITY_TWIN;

  const [filters, setFilters] = useState<AnalysisFilters>(data.filters);
  const [isRunning, setIsRunning] = useState(false);

  // ── Shell integration ─────────────────────────────────────────────────────
  useEffect(() => {
    setActiveNavId('virality-twin');
    setBreadcrumbs([
      { label: 'Projects',    href: '#' },
      { label: data.conceptCard.title, href: '#' },
      { label: 'Virality Twin' },
    ]);
    setPrimaryAction({
      label: 'Export Analysis',
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      onClick: () => {},
    });
    return () => setPrimaryAction(null);
  }, [setBreadcrumbs, setPrimaryAction, setActiveNavId, data.conceptCard.title]);

  // ── Run analysis simulation ───────────────────────────────────────────────
  const handleRunAnalysis = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2400);
  }, []);

  const INSIGHT_CATEGORIES = [
    'shared-strength',
    'missing-element',
    'risk-pattern',
    'adjustment',
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="w-full min-h-full flex flex-col bg-[#07070A]"
    >
      {/* ── Page header ── */}
      <div className="flex-shrink-0 sticky top-0 z-30 bg-[#07070A]/95 backdrop-blur-sm
        border-b border-white/[0.07] px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button type="button" onClick={onBack}
              className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors font-mono flex-shrink-0">
              ←
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#10B981]/30 to-[#06B6D4]/20
              border border-[#10B981]/30 flex items-center justify-center flex-shrink-0">
              <GitCompare className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-[15px] text-white leading-tight">
                Virality Twin Workspace
              </h1>
              <p className="text-[10px] font-mono text-slate-600 truncate hidden sm:block">
                {data.conceptCard.title}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Simulated data notice */}
            <span className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-amber-500/70 px-2.5 py-1
              rounded-full border border-amber-500/20 bg-amber-500/06">
              <Sparkles className="w-3 h-3" />
              Simulated Data
            </span>
            <AiBadge />
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20">

          {/* ── Filters bar ── */}
          <FiltersBar
            filters={filters}
            onFiltersChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
            onRunAnalysis={handleRunAnalysis}
            isRunning={isRunning}
            lastAnalysisAt={data.lastAnalysisAt}
            datasetCount={data.datasetCount}
            dataBadge={data.datasetBadge}
          />

          {/* ── Three-column cards ── */}
          <Section
            title="Content Twin Comparison"
            subtitle={`Matched from ${data.datasetCount.toLocaleString()} items · ${data.filters.platform} · ${data.filters.category}`}
          >
            <TwinComparison
              conceptCard={data.conceptCard}
              successCard={data.successCard}
              failureCard={data.failureCard}
            />
          </Section>

          {/* ── Comparison table ── */}
          <ComparisonTable metrics={data.metrics} />

          {/* ── Charts row (2 columns on lg+) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RetentionChart data={data.retentionData} />
            <StructuralDNAChart data={data.radarData} />
          </div>

          {/* ── Bottom 2-column: insights + right panel ── */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] 2xl:grid-cols-[1fr_360px] gap-6 xl:gap-8 items-start">

            {/* ── Left: AI Insights ── */}
            <section aria-label="AI Insights">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">AI Insights</h2>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {data.insights.filter(i => i.priority === 'critical' || i.priority === 'high').length} critical/high priority actions
                  </p>
                </div>
                <AiBadge />
              </div>

              <div className="space-y-1">
                {INSIGHT_CATEGORIES.map(cat => (
                  <InsightSection
                    key={cat}
                    category={cat}
                    insights={data.insights}
                    defaultExpanded={cat === 'missing-element' || cat === 'adjustment'}
                  />
                ))}
              </div>
            </section>

            {/* ── Right: panels ── */}
            <div className="sticky top-[5.5rem] space-y-5">
              <RightInsightPanel data={data.rightPanel} onContinue={onContinue} />
              <ConfidencePanel data={data.confidence} />
            </div>
          </div>

          {/* ── Methodology panel ── */}
          <MethodologyPanel />
        </div>
      </div>
    </motion.div>
  );
};
