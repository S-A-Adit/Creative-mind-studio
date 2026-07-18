/**
 * VideoEditorWorkspace.tsx — Main Timeline Planning & Production Guidance Workspace
 *
 * Three-panel layout:
 *   LEFT:   Scenes & Media Bin
 *   CENTER: Timeline Blueprint + Analytics
 *   RIGHT:  Scene Inspector + Editor Guidance
 *
 * Mobile: tabbed view (Scenes | Timeline | Inspector)
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, LayoutTemplate, Film,
  Sparkles, ChevronLeft, ChevronRight,
  Video, List, Inspect, AlertTriangle, CheckCircle2,
  BarChart2
} from 'lucide-react';
import { SCENES, PROJECT_META } from './mockData';
import type { Scene } from './mockData';
import { ScenesBin } from './components/ScenesBin';
import { TimelineBlueprint } from './components/TimelineBlueprint';
import { SceneInspector } from './components/SceneInspector';
import { EditorGuidanceCards } from './components/EditorGuidanceCards';
import { ExportModal } from './components/ExportModal';

interface VideoEditorWorkspaceProps {
  onBack?: () => void;
}

type MobileTab = 'scenes' | 'timeline' | 'inspector';

// ─── Top Header Bar ───────────────────────────────────────────────────────────

interface WorkspaceHeaderProps {
  onBack?: () => void;
  onExport: () => void;
  showGuidance: boolean;
  onToggleGuidance: () => void;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onBack, onExport, showGuidance, onToggleGuidance,
  leftCollapsed, rightCollapsed, onToggleLeft, onToggleRight
}) => {
  // Count warnings across all scenes
  const totalWarnings = SCENES.reduce((sum, s) => sum + s.warningCount, 0);
  const completedScenes = SCENES.filter(s => s.editingStatus === 'approved').length;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0B0B12] flex-shrink-0">
      {/* Left: back + project info */}
      <div className="flex items-center gap-3">
        {onBack && (
          <motion.button
            whileHover={{ x: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors group"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-medium">Back</span>
          </motion.button>
        )}

        <div className="w-px h-5 bg-white/8" />

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
            <Video size={14} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#F8FAFC] font-display leading-none">{PROJECT_META.title}</h1>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">
              Timeline Planning Workspace · {PROJECT_META.targetPlatform}
            </p>
          </div>
        </div>

        {/* Status pills */}
        <div className="hidden md:flex items-center gap-2 ml-2">
          <span className="flex items-center gap-1 text-[10px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20">
            <CheckCircle2 size={9} />
            {completedScenes}/{SCENES.length} approved
          </span>
          {totalWarnings > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full border border-[#F59E0B]/20">
              <AlertTriangle size={9} />
              {totalWarnings} warnings
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-full border border-[#8B5CF6]/20">
            <BarChart2 size={9} />
            {PROJECT_META.completionPercent}%
          </span>
        </div>
      </div>

      {/* Right: toolbar */}
      <div className="flex items-center gap-1.5">
        {/* Panel toggles (desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-[#151521] rounded-lg p-1 border border-white/5">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onToggleLeft}
            title="Toggle scenes panel"
            className={`p-1.5 rounded transition-colors ${leftCollapsed ? 'text-[#64748B]' : 'text-[#8B5CF6] bg-[#8B5CF6]/10'}`}
          >
            <List size={13} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {}}
            title="Timeline (always visible)"
            className="p-1.5 rounded text-[#3B82F6] bg-[#3B82F6]/10"
          >
            <LayoutTemplate size={13} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onToggleRight}
            title="Toggle inspector panel"
            className={`p-1.5 rounded transition-colors ${rightCollapsed ? 'text-[#64748B]' : 'text-[#06B6D4] bg-[#06B6D4]/10'}`}
          >
            <Inspect size={13} />
          </motion.button>
        </div>

        <div className="w-px h-4 bg-white/8 hidden lg:block" />

        {/* AI Guidance toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onToggleGuidance}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
            showGuidance
              ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30'
              : 'bg-white/4 text-[#94A3B8] border-white/8 hover:text-[#F8FAFC] hover:bg-white/6'
          }`}
        >
          <Sparkles size={12} />
          AI Guidance
        </motion.button>

        {/* Export */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-[#7C3AED]/20 transition-shadow hover:shadow-[#7C3AED]/30"
        >
          <Download size={12} />
          <span className="hidden sm:inline">Export</span>
        </motion.button>
      </div>
    </div>
  );
};

// ─── Mobile Tab Bar ───────────────────────────────────────────────────────────

interface MobileTabBarProps {
  activeTab: MobileTab;
  onChange: (tab: MobileTab) => void;
}

const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeTab, onChange }) => {
  const tabs: { id: MobileTab; label: string; icon: React.ElementType }[] = [
    { id: 'scenes', label: 'Scenes', icon: List },
    { id: 'timeline', label: 'Timeline', icon: LayoutTemplate },
    { id: 'inspector', label: 'Inspector', icon: Inspect },
  ];

  return (
    <div className="flex lg:hidden border-t border-white/5 bg-[#0B0B12] flex-shrink-0">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'
            }`}
          >
            <Icon size={16} />
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="mobile-tab-indicator"
                className="absolute bottom-0 h-0.5 w-12 bg-[#8B5CF6] rounded-full"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─── Guidance Drawer (slides from right) ─────────────────────────────────────

interface GuidanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidanceDrawer: React.FC<GuidanceDrawerProps> = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 bottom-0 z-40 w-80 bg-[#10101A] border-l border-white/8 shadow-2xl overflow-y-auto"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 sticky top-0 bg-[#10101A] z-10">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#8B5CF6]" />
              <span className="text-sm font-bold text-[#F8FAFC]">AI Guidance</span>
            </div>
            <button onClick={onClose} className="text-[#94A3B8] hover:text-[#F8FAFC]">✕</button>
          </div>
          <div className="px-4 py-4">
            <EditorGuidanceCards compact />
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── Main Workspace ───────────────────────────────────────────────────────────

export const VideoEditorWorkspace: React.FC<VideoEditorWorkspaceProps> = ({ onBack }) => {
  const [scenes, setScenes] = useState<Scene[]>(SCENES);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(SCENES[0]?.id ?? null);
  const [exportOpen, setExportOpen] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('timeline');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const selectedScene = scenes.find(s => s.id === selectedSceneId) ?? scenes[0];

  const handleReorderScenes = useCallback((reordered: Scene[]) => {
    setScenes(reordered);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#07070A] overflow-hidden">
      {/* Top header */}
      <WorkspaceHeader
        onBack={onBack}
        onExport={() => setExportOpen(true)}
        showGuidance={showGuidance}
        onToggleGuidance={() => setShowGuidance(v => !v)}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        onToggleLeft={() => setLeftCollapsed(v => !v)}
        onToggleRight={() => setRightCollapsed(v => !v)}
      />

      {/* Three-panel layout (desktop) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT PANEL: Scenes & Media Bin */}
        <AnimatePresence initial={false}>
          {!leftCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="hidden lg:flex flex-col border-r border-white/5 overflow-hidden flex-shrink-0"
            >
              <ScenesBin
                scenes={scenes}
                selectedSceneId={selectedSceneId}
                onSelectScene={setSelectedSceneId}
                onReorderScenes={handleReorderScenes}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel toggle buttons (desktop) */}
        <div className="hidden lg:flex flex-col justify-center relative z-10">
          <button
            onClick={() => setLeftCollapsed(v => !v)}
            className="absolute left-0 translate-x-1 w-4 h-8 bg-[#151521] border border-white/8 rounded-r-md flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B1B2A] transition-colors"
            title={leftCollapsed ? 'Expand scenes' : 'Collapse scenes'}
          >
            {leftCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
          </button>
        </div>

        {/* CENTER PANEL: Timeline Blueprint */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Desktop Timeline */}
          <div className="hidden lg:flex flex-col flex-1 overflow-hidden">
            <TimelineBlueprint
              scenes={scenes}
              selectedSceneId={selectedSceneId}
              onSelectScene={setSelectedSceneId}
            />
          </div>

          {/* Mobile tabs content */}
          <div className="flex lg:hidden flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="flex-1 overflow-hidden"
              >
                {mobileTab === 'scenes' && (
                  <ScenesBin
                    scenes={scenes}
                    selectedSceneId={selectedSceneId}
                    onSelectScene={id => { setSelectedSceneId(id); setMobileTab('inspector'); }}
                    onReorderScenes={handleReorderScenes}
                  />
                )}
                {mobileTab === 'timeline' && (
                  <TimelineBlueprint
                    scenes={scenes}
                    selectedSceneId={selectedSceneId}
                    onSelectScene={id => { setSelectedSceneId(id); setMobileTab('inspector'); }}
                  />
                )}
                {mobileTab === 'inspector' && selectedScene && (
                  <div className="h-full overflow-y-auto">
                    <SceneInspector scene={selectedScene} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Panel toggle button for right panel */}
        <div className="hidden lg:flex flex-col justify-center relative z-10">
          <button
            onClick={() => setRightCollapsed(v => !v)}
            className="absolute right-0 -translate-x-1 w-4 h-8 bg-[#151521] border border-white/8 rounded-l-md flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B1B2A] transition-colors"
            title={rightCollapsed ? 'Expand inspector' : 'Collapse inspector'}
          >
            {rightCollapsed ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
          </button>
        </div>

        {/* RIGHT PANEL: Scene Inspector + Guidance */}
        <AnimatePresence initial={false}>
          {!rightCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="hidden lg:flex flex-col border-l border-white/5 overflow-hidden flex-shrink-0"
            >
              {selectedScene ? (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Inspector */}
                  <div className={`overflow-hidden transition-all duration-200 ${showGuidance ? 'flex-[0_0_55%]' : 'flex-1'}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedScene.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full overflow-y-auto"
                      >
                        <SceneInspector scene={selectedScene} />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* AI Guidance section */}
                  <AnimatePresence>
                    {showGuidance && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, flex: '0 0 45%' }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-[0_0_45%] border-t border-white/5 overflow-y-auto bg-[#07070A]"
                      >
                        <div className="px-4 pt-3 pb-4">
                          <EditorGuidanceCards />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-6">
                  <div>
                    <Film size={28} className="text-[#2a2a40] mx-auto mb-2" />
                    <p className="text-sm text-[#94A3B8]">Select a scene to inspect</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile tab bar */}
      <MobileTabBar activeTab={mobileTab} onChange={setMobileTab} />

      {/* AI Guidance drawer (mobile) */}
      <GuidanceDrawer isOpen={showGuidance} onClose={() => setShowGuidance(false)} />

      {/* Export Modal */}
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
};
