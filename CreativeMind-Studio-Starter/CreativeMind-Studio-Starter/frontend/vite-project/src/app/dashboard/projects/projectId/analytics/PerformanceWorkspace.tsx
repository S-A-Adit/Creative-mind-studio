/**
 * PerformanceWorkspace.tsx — Performance & Creator DNA Workspace
 *
 * Post-publication intelligence center for CreativeMind Studio.
 *
 * Desktop layout:
 *   TOP:    KPI Cards row (all 9 metrics, horizontally scrollable)
 *   CENTER: 2/3 Analytics charts column + 1/3 right panel (tabbed)
 *   BOTTOM: Virality Twin Comparison + AI Learning Log (side-by-side)
 *
 * Right panel tabs:
 *   Creator DNA | AI Recommendations | Audience | Export
 *
 * Mobile: tabs — Overview | Analytics | Creator DNA | Learning Log
 *
 * All panels use Framer Motion for entry, tab, and hover transitions.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BarChart3, Dna, Sparkles, Users,
  FileDown, Activity, GitCompare, ChevronLeft, ChevronRight,
  BookOpen,
} from 'lucide-react';
import { PERFORMANCE_PROJECT } from './mockData';
import { KpiCardsRow } from './components/KpiCardsRow';
import {
  RetentionCurveChart, CtrOverTimeChart, PlatformPerfChart,
  CategoryPerfChart, HookPerfChart, AudienceSegmentsChart,
} from './components/AnalyticsCharts';
import { ViralityTwinComparisonPanel } from './components/ViralityTwinComparison';
import { CreatorDnaPanel } from './components/CreatorDnaPanel';
import { AILearningLog } from './components/AILearningLog';
import { AudienceInsightsPanel } from './components/AudienceInsightsPanel';
import { AIRecommendationsPanel } from './components/AIRecommendationsPanel';
import { ExportReportsPanel } from './components/ExportReportsPanel';
import { SectionLabel } from './components/PerformanceShared';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PerformanceWorkspaceProps {
  onBack?: () => void;
}

// ─── Right panel tabs ─────────────────────────────────────────────────────────

type RightTab = 'dna' | 'recommendations' | 'audience' | 'export';

const RIGHT_TABS: Array<{ id: RightTab; label: string; Icon: React.ElementType }> = [
  { id: 'dna',             label: 'Creator DNA', Icon: Dna       },
  { id: 'recommendations', label: 'AI Tips',     Icon: Sparkles  },
  { id: 'audience',        label: 'Audience',    Icon: Users     },
  { id: 'export',          label: 'Export',      Icon: FileDown  },
];

// ─── Mobile tabs ──────────────────────────────────────────────────────────────

type MobileTab = 'overview' | 'analytics' | 'dna' | 'learning';

const MOBILE_TABS: Array<{ id: MobileTab; label: string; Icon: React.ElementType }> = [
  { id: 'overview',  label: 'Overview',    Icon: BarChart3  },
  { id: 'analytics', label: 'Analytics',   Icon: Activity   },
  { id: 'dna',       label: 'Creator DNA', Icon: Dna        },
  { id: 'learning',  label: 'Learning',    Icon: BookOpen   },
];

// ─── Workspace Header ─────────────────────────────────────────────────────────

interface WorkspaceHeaderProps {
  onBack?: () => void;
  rightCollapsed: boolean;
  onToggleRight: () => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onBack, rightCollapsed, onToggleRight,
}) => {
  const score = PERFORMANCE_PROJECT.overallScore;
  const scoreColor = score >= 80 ? '#10B981' : score >= 60 ? '#8B5CF6' : '#F59E0B';

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0B0B12] flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        {onBack && (
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Back</span>
          </motion.button>
        )}

        <div className="w-px h-5 bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-[#9D6CFF]" />
          </div>
          <span className="font-display font-semibold text-white text-sm hidden sm:inline">
            Performance Intelligence
          </span>
          <span className="text-xs text-slate-500 font-mono hidden md:inline">
            · {PERFORMANCE_PROJECT.title}
          </span>
        </div>
      </div>

      {/* Center stats */}
      <div className="hidden md:flex items-center gap-3">
        {[
          { label: 'Published', value: new Date(PERFORMANCE_PROJECT.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: '#94A3B8' },
          { label: 'Score',     value: `${PERFORMANCE_PROJECT.overallScore}/100`, color: scoreColor },
          { label: 'Predicted', value: `${PERFORMANCE_PROJECT.predictedScore}/100`, color: '#8B5CF6' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
          >
            <span className="text-[10px] font-mono text-slate-500">{label}</span>
            <span className="text-xs font-mono font-bold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Right toggle */}
      <div className="flex items-center gap-1.5">
        <span
          className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-rose-500/25 bg-rose-500/10 text-rose-400 hidden md:inline"
        >
          Post-Launch
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleRight}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.07] text-slate-500 hover:text-slate-200 hover:border-white/[0.14] transition-all text-[11px] font-mono"
        >
          {rightCollapsed
            ? <><ChevronLeft className="w-3.5 h-3.5" />DNA & AI</>
            : <>DNA & AI<ChevronRight className="w-3.5 h-3.5" /></>
          }
        </motion.button>
      </div>
    </div>
  );
};

// ─── Analytics center content (charts grid) ───────────────────────────────────

const AnalyticsCenterContent: React.FC = () => (
  <div className="space-y-5 px-5 py-5">
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <RetentionCurveChart />
      <CtrOverTimeChart />
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <PlatformPerfChart />
      <CategoryPerfChart />
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <HookPerfChart />
      <AudienceSegmentsChart />
    </div>
  </div>
);

// ─── Bottom row: Virality Twin + Learning Log ─────────────────────────────────

const BottomRow: React.FC = () => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 px-5 pb-5">
    {/* Virality Twin */}
    <div>
      <div className="flex items-center gap-2 mb-4">
        <GitCompare className="w-4 h-4 text-[#9D6CFF]" />
        <span className="font-display font-semibold text-white text-sm">
          Virality Twin — Post-Launch
        </span>
      </div>
      <ViralityTwinComparisonPanel />
    </div>

    {/* Learning Log */}
    <div className="rounded-2xl border border-white/[0.07] bg-[#0B0B12] overflow-hidden">
      <AILearningLog />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const PerformanceWorkspace: React.FC<PerformanceWorkspaceProps> = ({ onBack }) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>('views');
  const [rightTab, setRightTab] = useState<RightTab>('dna');
  const [mobileTab, setMobileTab] = useState<MobileTab>('overview');
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const rightPanelContent: Record<RightTab, React.ReactNode> = {
    dna:             <CreatorDnaPanel />,
    recommendations: <AIRecommendationsPanel />,
    audience:        <AudienceInsightsPanel />,
    export:          <ExportReportsPanel />,
  };

  const mobileContent: Record<MobileTab, React.ReactNode> = {
    overview: (
      <div className="p-4 space-y-5">
        {/* KPIs */}
        <KpiCardsRow selectedMetric={selectedMetric} onSelectMetric={setSelectedMetric} />

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.07] bg-[#151521]/60 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Performance Score</SectionLabel>
            <span className="text-xs font-mono text-slate-500">vs predicted</span>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-4xl font-display font-bold text-[#10B981]">
                {PERFORMANCE_PROJECT.overallScore}
              </div>
              <SectionLabel className="block mt-1">Actual</SectionLabel>
            </div>
            <div className="text-2xl text-slate-600 mb-1">vs</div>
            <div>
              <div className="text-4xl font-display font-bold text-[#8B5CF6]">
                {PERFORMANCE_PROJECT.predictedScore}
              </div>
              <SectionLabel className="block mt-1">Predicted</SectionLabel>
            </div>
          </div>
        </motion.div>

        <RetentionCurveChart />
        <CtrOverTimeChart />
        <ViralityTwinComparisonPanel />
      </div>
    ),
    analytics: (
      <div className="p-4 space-y-5">
        <PlatformPerfChart />
        <CategoryPerfChart />
        <HookPerfChart />
        <AudienceSegmentsChart />
        <AudienceInsightsPanel />
      </div>
    ),
    dna: (
      <div className="h-full">
        <CreatorDnaPanel />
      </div>
    ),
    learning: (
      <div className="h-full">
        <AILearningLog />
      </div>
    ),
  };

  return (
    <div className="flex flex-col h-full bg-[#07070A] overflow-hidden">
      {/* Header */}
      <WorkspaceHeader
        onBack={onBack}
        rightCollapsed={rightCollapsed}
        onToggleRight={() => setRightCollapsed(v => !v)}
      />

      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden flex-col">
        {/* KPI Row — top strip */}
        <div className="px-5 py-4 border-b border-white/5 flex-shrink-0 bg-[#0B0B12]">
          <KpiCardsRow selectedMetric={selectedMetric} onSelectMetric={setSelectedMetric} />
        </div>

        {/* Center + Right split */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* CENTER — scrollable analytics */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <AnalyticsCenterContent />
            <BottomRow />
          </div>

          {/* RIGHT — tabbed inspector */}
          <AnimatePresence initial={false}>
            {!rightCollapsed && (
              <motion.div
                key="right-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 360, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex-shrink-0 flex flex-col border-l border-white/5 overflow-hidden"
                style={{ width: 360 }}
              >
                {/* Tab bar */}
                <div className="flex items-center border-b border-white/5 bg-[#0B0B12] flex-shrink-0 px-2 pt-2">
                  {RIGHT_TABS.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setRightTab(id)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono font-medium rounded-t-lg transition-all whitespace-nowrap ${
                        rightTab === id
                          ? 'text-[#9D6CFF] bg-[#8B5CF6]/10 border-b-2 border-[#8B5CF6]'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Panel body */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={rightTab}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="h-full"
                    >
                      {rightPanelContent[rightTab]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile tabbed layout ── */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Mobile tab bar */}
        <div className="flex items-center border-b border-white/5 bg-[#0B0B12] flex-shrink-0 px-2 pt-2">
          {MOBILE_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-mono font-medium rounded-t-lg transition-all ${
                mobileTab === id
                  ? 'text-[#9D6CFF] bg-[#8B5CF6]/10 border-b-2 border-[#8B5CF6]'
                  : 'text-slate-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Mobile content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="min-h-full"
            >
              {mobileContent[mobileTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
