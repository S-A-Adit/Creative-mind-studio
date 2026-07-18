/**
 * DistributionRoom.tsx — Main Distribution Room workspace
 *
 * Multi-platform publishing studio for CreativeMind Studio.
 *
 * Desktop layout:
 *   LEFT: Master Content Panel (fixed width)
 *   CENTER: Platform Adaptations Panel (scrollable grid)
 *   RIGHT: Tabbed side panel — Comparison | Recommendations | Actions | Export
 *
 * Mobile layout:
 *   Tabs: Master Content | Platforms | Comparison
 *
 * All panels use Framer Motion for smooth entry and state transitions.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, GitCompare, Sparkles, Zap, Download,
  ChevronLeft, ChevronRight, Radio, BookOpen, Share2,
} from 'lucide-react';
import { DISTRIBUTION_PROJECT, PLATFORM_ADAPTATIONS } from './mockData';
import { MasterContentPanel } from './components/MasterContentPanel';
import { PlatformAdaptationsPanel } from './components/PlatformAdaptationsPanel';
import { ComparisonView } from './components/ComparisonView';
import { PlatformRecommendations } from './components/PlatformRecommendations';
import { QuickActionsPanel } from './components/QuickActionsPanel';
import { ExportPanel } from './components/ExportPanel';
import { StatusBadge } from './components/DistributionShared';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DistributionRoomProps {
  onBack?: () => void;
}

// ─── Right panel tabs ─────────────────────────────────────────────────────────

type RightTab = 'comparison' | 'recommendations' | 'actions' | 'export';

const RIGHT_TABS: Array<{ id: RightTab; label: string; Icon: React.ElementType }> = [
  { id: 'comparison',      label: 'Compare',     Icon: GitCompare },
  { id: 'recommendations', label: 'AI Tips',     Icon: Sparkles   },
  { id: 'actions',         label: 'Actions',     Icon: Zap        },
  { id: 'export',          label: 'Export',      Icon: Download   },
];

// ─── Mobile tabs ──────────────────────────────────────────────────────────────

type MobileTab = 'master' | 'platforms' | 'comparison';

const MOBILE_TABS: Array<{ id: MobileTab; label: string; Icon: React.ElementType }> = [
  { id: 'master',      label: 'Master Content', Icon: BookOpen  },
  { id: 'platforms',   label: 'Platforms',      Icon: Share2    },
  { id: 'comparison',  label: 'Comparison',     Icon: GitCompare },
];

// ─── Workspace Header ─────────────────────────────────────────────────────────

interface WorkspaceHeaderProps {
  onBack?: () => void;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onBack,
  leftCollapsed,
  rightCollapsed,
  onToggleLeft,
  onToggleRight,
}) => {
  const p = DISTRIBUTION_PROJECT;
  const approvedCount =
    PLATFORM_ADAPTATIONS.filter(a => a.status === 'approved' || a.status === 'ready-to-publish').length;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0B0B12] flex-shrink-0">
      {/* Left group */}
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
            <Radio className="w-3 h-3 text-[#9D6CFF]" />
          </div>
          <span className="font-display font-semibold text-white text-sm hidden sm:inline">
            Distribution Room
          </span>
          <span className="text-xs text-slate-500 font-mono hidden md:inline">
            · {p.projectTitle}
          </span>
        </div>
      </div>

      {/* Center stats */}
      <div className="hidden md:flex items-center gap-3">
        {[
          { label: 'Platforms', value: p.totalPlatforms, color: '#94A3B8' },
          { label: 'Ready',     value: approvedCount,    color: '#8B5CF6' },
          { label: 'Readiness', value: `${p.overallReadiness}%`, color: '#10B981' },
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

      {/* Right group — panel toggles */}
      <div className="flex items-center gap-1.5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleLeft}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.07] text-slate-500 hover:text-slate-200 hover:border-white/[0.14] transition-all text-[11px] font-mono"
          title={leftCollapsed ? 'Show master content' : 'Hide master content'}
        >
          {leftCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          Master
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleRight}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.07] text-slate-500 hover:text-slate-200 hover:border-white/[0.14] transition-all text-[11px] font-mono"
          title={rightCollapsed ? 'Show side panel' : 'Hide side panel'}
        >
          Inspector
          {rightCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </motion.button>

        {/* Status badge */}
        <StatusBadge status="approved" size="sm" />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const DistributionRoom: React.FC<DistributionRoomProps> = ({ onBack }) => {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>('comparison');
  const [mobileTab, setMobileTab] = useState<MobileTab>('platforms');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const handleSelectPlatform = useCallback((id: string) => {
    setSelectedPlatformId(prev => (prev === id ? null : id));
    // Auto-switch to comparison tab when a platform is selected
    setRightTab('comparison');
  }, []);

  // ── Desktop right panel content ──────────────────────────────────────────

  const rightPanelContent = {
    comparison:      <ComparisonView selectedPlatformId={selectedPlatformId} />,
    recommendations: <PlatformRecommendations />,
    actions:         <QuickActionsPanel selectedPlatformId={selectedPlatformId} />,
    export:          <ExportPanel />,
  };

  return (
    <div className="flex flex-col h-full bg-[#07070A] overflow-hidden">
      {/* Header */}
      <WorkspaceHeader
        onBack={onBack}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        onToggleLeft={() => setLeftCollapsed(v => !v)}
        onToggleRight={() => setRightCollapsed(v => !v)}
      />

      {/* ── Desktop three-column layout ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT — Master Content */}
        <AnimatePresence initial={false}>
          {!leftCollapsed && (
            <motion.div
              key="left-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex-shrink-0 border-r border-white/5 overflow-hidden"
              style={{ width: 320 }}
            >
              <MasterContentPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CENTER — Platform Adaptations */}
        <div className="flex-1 min-w-0 overflow-hidden border-r border-white/5">
          <PlatformAdaptationsPanel
            selectedId={selectedPlatformId}
            onSelectPlatform={handleSelectPlatform}
          />
        </div>

        {/* RIGHT — Tabbed inspector */}
        <AnimatePresence initial={false}>
          {!rightCollapsed && (
            <motion.div
              key="right-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex-shrink-0 flex flex-col overflow-hidden"
              style={{ width: 360 }}
            >
              {/* Right tab bar */}
              <div className="flex items-center border-b border-white/5 bg-[#0B0B12] flex-shrink-0 px-2 pt-2">
                {RIGHT_TABS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setRightTab(id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono font-medium rounded-t-lg transition-all relative ${
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

              {/* Right panel body */}
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

      {/* ── Mobile tabbed layout ── */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Mobile tab bar */}
        <div className="flex items-center border-b border-white/5 bg-[#0B0B12] flex-shrink-0 px-2 pt-2">
          {MOBILE_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-mono font-medium rounded-t-lg transition-all ${
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

        {/* Mobile tab content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {mobileTab === 'master' && <MasterContentPanel />}
              {mobileTab === 'platforms' && (
                <PlatformAdaptationsPanel
                  selectedId={selectedPlatformId}
                  onSelectPlatform={id => {
                    handleSelectPlatform(id);
                    setMobileTab('comparison');
                  }}
                />
              )}
              {mobileTab === 'comparison' && (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Sub-tabs for mobile comparison screen */}
                  <div className="flex items-center border-b border-white/5 flex-shrink-0 px-2 pt-2">
                    {RIGHT_TABS.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => setRightTab(id)}
                        className={`flex items-center gap-1 px-2.5 py-2 text-[10px] font-mono rounded-t-lg transition-all ${
                          rightTab === id
                            ? 'text-[#9D6CFF] bg-[#8B5CF6]/10 border-b-2 border-[#8B5CF6]'
                            : 'text-slate-500'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={rightTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="h-full"
                      >
                        {rightPanelContent[rightTab]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
