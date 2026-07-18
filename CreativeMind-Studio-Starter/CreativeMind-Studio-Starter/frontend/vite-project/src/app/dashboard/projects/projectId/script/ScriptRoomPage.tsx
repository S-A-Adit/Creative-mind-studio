/**
 * ScriptRoomPage.tsx — The Script & Story Room.
 *
 * DESKTOP : LEFT (Story Outline 300px) | CENTER (Script Editor flex-1) | RIGHT (Inspector 320px)
 * TABLET  : Two-column: left collapses, center + right
 * MOBILE  : Tabs: Outline | Script | Inspector
 *
 * Bottom panel: Scene Timeline (all viewports)
 * Emotional Curve: below script editor in center column
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  LayoutList,
  FileSearch,
  ChevronLeft,
  Sparkles,
  Download,
  Plus,
  Hash,
} from 'lucide-react';
import { useLayout } from '../../../../../lib/useLayout';
import { StoryOutline }   from './components/StoryOutline';
import { ScriptBlockItem } from './components/ScriptBlock';
import { ClaimInspector } from './components/ClaimInspector';
import { EmotionalCurve } from './components/EmotionalCurve';
import { SceneTimeline }  from './components/SceneTimeline';
import { ScriptToolbar }  from './components/ScriptToolbar';
import { QuickActions }   from './components/QuickActions';
import { MOCK_SCRIPT_ROOM } from './mockData';
import type { AutosaveState } from './types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Mobile tabs ──────────────────────────────────────────────────────────────

type MobileTab = 'outline' | 'script' | 'inspector';

const MOBILE_TABS: Array<{ id: MobileTab; label: string; icon: React.ReactNode }> = [
  { id: 'outline',   label: 'Outline',  icon: <LayoutList className="w-4 h-4" /> },
  { id: 'script',    label: 'Script',   icon: <FileText   className="w-4 h-4" /> },
  { id: 'inspector', label: 'Inspector',icon: <FileSearch className="w-4 h-4" /> },
];

// ─── Panel header ─────────────────────────────────────────────────────────────

const PanelHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color: string;
  actions?: React.ReactNode;
}> = ({ icon, title, subtitle, color, actions }) => (
  <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5
    border-b border-white/[0.06] bg-[#0B0B12]/60 backdrop-blur-sm">
    <div
      className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
      style={{ background: color + '20', border: `1px solid ${color}30`, color }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h2 className="font-display font-semibold text-[13px] text-white leading-tight">{title}</h2>
      {subtitle && <p className="text-[10px] font-mono text-slate-600 truncate">{subtitle}</p>}
    </div>
    {actions}
  </div>
);

// ─── Tab row ──────────────────────────────────────────────────────────────────

function TabRow<T extends string>({
  tabs,
  active,
  onSelect,
}: {
  tabs: Array<{ id: T; label: string; icon: React.ReactNode }>;
  active: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#10101A]/80 border border-white/[0.07]">
      {tabs.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[11px] font-mono
            transition-all duration-150 flex-1 justify-center
            ${active === t.id
              ? 'bg-[#7C3AED]/25 text-[#9D6CFF] border border-[#7C3AED]/35'
              : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Script block list ────────────────────────────────────────────────────────

const ScriptBlockList: React.FC<{
  blocks: typeof MOCK_SCRIPT_ROOM['blocks'];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  filterSectionId: string | null;
}> = ({ blocks, selectedBlockId, onSelectBlock, filterSectionId }) => {
  const filtered = filterSectionId
    ? blocks.filter(b => b.sectionId === filterSectionId)
    : blocks;

  return (
    <div className="space-y-2.5">
      {filtered.map((block, i) => (
        <ScriptBlockItem
          key={block.id}
          block={block}
          index={i}
          isSelected={block.id === selectedBlockId}
          onSelect={onSelectBlock}
        />
      ))}

      {/* Add block button */}
      <button
        type="button"
        className="w-full flex items-center gap-2 py-3 px-4 rounded-[14px] border-2 border-dashed
          border-white/[0.08] text-slate-600 hover:text-slate-400 hover:border-white/[0.15]
          transition-all duration-200 text-[12px] font-mono"
      >
        <Plus className="w-4 h-4" />
        <span>Add script block</span>
      </button>
    </div>
  );
};

// ─── Meta strip ───────────────────────────────────────────────────────────────

const MetaStrip: React.FC<{
  meta: typeof MOCK_SCRIPT_ROOM['meta'];
}> = ({ meta }) => (
  <div className="flex items-center gap-4 px-4 py-2 border-b border-white/[0.05]
    bg-[#07070A]/80 text-[10px] font-mono overflow-x-auto">
    {[
      { label: 'Words',      value: meta.totalWords.toLocaleString() },
      { label: 'Scenes',     value: `${meta.totalScenes}` },
      { label: 'Approved',   value: `${meta.approvedBlocks}/${meta.totalBlocks}` },
      { label: 'Completion', value: `${meta.completionPercent}%` },
    ].map(m => (
      <div key={m.label} className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-slate-600 uppercase tracking-widest text-[8px]">{m.label}</span>
        <span className="text-slate-300 font-semibold">{m.value}</span>
      </div>
    ))}
    <div className="ml-auto flex-shrink-0">
      <div className="flex items-center gap-1.5 text-slate-600">
        <Hash className="w-3 h-3" />
        <span>⚠️ Simulated data</span>
      </div>
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

interface ScriptRoomPageProps {
  onBack?: () => void;
  onContinue?: () => void;
}

export const ScriptRoomPage: React.FC<ScriptRoomPageProps> = ({
  onBack,
  onContinue,
}) => {
  const { setBreadcrumbs, setPrimaryAction, setActiveNavId } = useLayout();
  const data = MOCK_SCRIPT_ROOM;

  const [mobileTab,       setMobileTab]       = useState<MobileTab>('script');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('b2');
  const [activeSectionId, setActiveSectionId] = useState<string | null>('sec-hook');
  const [activeSceneId,   setActiveSceneId]   = useState<string | null>(null);
  const [autosaveState]                        = useState<AutosaveState>('saved');
  const [activeTone,      setActiveTone]      = useState('authoritative');
  const [lockedMode,      setLockedMode]      = useState(false);

  // ── Shell wiring ───────────────────────────────────────────────────────────
  useEffect(() => {
    setActiveNavId('story-script');
    setBreadcrumbs([
      { label: 'Projects',         href: '#' },
      { label: data.meta.projectTitle, href: '#' },
      { label: 'Script & Story Room' },
    ]);
    setPrimaryAction({
      label: 'Export Script',
      icon: <Download className="w-3.5 h-3.5" />,
      onClick: () => {},
    });
    return () => setPrimaryAction(null);
  }, [setBreadcrumbs, setPrimaryAction, setActiveNavId, data.meta.projectTitle]);

  // ── Section → filter blocks ────────────────────────────────────────────────
  const handleSelectSection = (id: string) => {
    setActiveSectionId(prev => prev === id ? null : id);
    setSelectedBlockId(null);
  };

  // ── Inspector data ─────────────────────────────────────────────────────────
  const inspectorData = useMemo(() =>
    selectedBlockId
      ? (data.inspectorMap[selectedBlockId] ?? { block: null, linkedSources: [], evidenceStrength: 0, relatedResearch: [], reviewerNotes: [], suggestedImprovements: [] })
      : { block: null, linkedSources: [], evidenceStrength: 0, relatedResearch: [], reviewerNotes: [], suggestedImprovements: [] },
  [selectedBlockId, data.inspectorMap]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER PANELS
  // ─────────────────────────────────────────────────────────────────────────

  const leftPanel = (
    <div className="h-full flex flex-col overflow-hidden">
      <PanelHeader
        icon={<LayoutList className="w-3.5 h-3.5" />}
        title="Story Structure"
        subtitle={`${data.sections.length} stages · click to filter script`}
        color="#F59E0B"
      />
      <div className="flex-1 overflow-y-auto p-3">
        <StoryOutline
          sections={data.sections}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
        />
      </div>
    </div>
  );

  const centerPanel = (
    <div className="h-full flex flex-col overflow-hidden">
      <PanelHeader
        icon={<FileText className="w-3.5 h-3.5" />}
        title={activeSectionId
          ? `${data.sections.find(s => s.id === activeSectionId)?.title ?? 'Script'}`
          : `Full Script (${data.blocks.length} blocks)`}
        subtitle={activeSectionId
          ? `Showing ${data.blocks.filter(b => b.sectionId === activeSectionId).length} blocks in this section`
          : `${data.meta.approvedBlocks}/${data.meta.totalBlocks} approved`}
        color="#8B5CF6"
        actions={
          activeSectionId
            ? (
              <button type="button" onClick={() => setActiveSectionId(null)}
                className="text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0">
                Show all
              </button>
            )
            : undefined
        }
      />

      {/* Toolbar */}
      <ScriptToolbar
        meta={data.meta}
        versions={data.versions}
        autosaveState={autosaveState}
        activeTone={activeTone}
        onToneChange={setActiveTone}
        lockedMode={lockedMode}
        onToggleLock={() => setLockedMode(l => !l)}
      />

      {/* Meta strip */}
      <MetaStrip meta={data.meta} />

      {/* Scrollable blocks */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6 pb-8">
          {/* Quick actions */}
          <QuickActions />

          {/* Script blocks */}
          <ScriptBlockList
            blocks={data.blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={id => setSelectedBlockId(prev => prev === id ? null : id)}
            filterSectionId={activeSectionId}
          />

          {/* Emotional curve */}
          <EmotionalCurve data={data.emotionalCurve} />
        </div>
      </div>
    </div>
  );

  const rightPanel = (
    <div className="h-full flex flex-col overflow-hidden">
      <PanelHeader
        icon={<FileSearch className="w-3.5 h-3.5" />}
        title="Claim Inspector"
        subtitle={selectedBlockId ? 'Block details & source verification' : 'Select a block'}
        color="#06B6D4"
      />
      <div className="flex-1 overflow-y-auto p-4">
        <ClaimInspector data={inspectorData} />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="w-full h-full flex flex-col bg-[#07070A] min-h-0"
    >
      {/* ── Page header ── */}
      <div className="flex-shrink-0 sticky top-0 z-30 bg-[#07070A]/95 backdrop-blur-sm
        border-b border-white/[0.07] px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button type="button" onClick={onBack}
              className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-300
                transition-colors font-mono flex-shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />Back
            </button>
          )}

          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#8B5CF6]/30 to-[#06B6D4]/20
            border border-[#8B5CF6]/30 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-[#8B5CF6]" />
          </div>

          <div className="min-w-0">
            <h1 className="font-display font-bold text-[15px] text-white leading-tight">
              Script &amp; Story Room
            </h1>
            <p className="text-[10px] font-mono text-slate-600 truncate hidden sm:block">
              {data.meta.projectTitle}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-amber-500/70
              px-2.5 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="w-3 h-3" />
              Simulated Data
            </span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"
            />
            <span className="text-[11px] font-mono text-[#8B5CF6]">Writing Active</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE TABS ── */}
      <div className="lg:hidden flex-shrink-0 px-4 pt-3">
        <TabRow tabs={MOBILE_TABS} active={mobileTab} onSelect={setMobileTab} />
      </div>

      {/* ── MOBILE BODY ── */}
      <div className="lg:hidden flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {mobileTab === 'outline' && (
            <motion.div key="m-outline"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22, ease: EASE }} className="p-4">
              <StoryOutline sections={data.sections} activeSectionId={activeSectionId} onSelectSection={handleSelectSection} />
            </motion.div>
          )}
          {mobileTab === 'script' && (
            <motion.div key="m-script"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22, ease: EASE }} className="p-4 space-y-4">
              <QuickActions compact />
              <ScriptBlockList blocks={data.blocks} selectedBlockId={selectedBlockId} onSelectBlock={id => { setSelectedBlockId(id); setMobileTab('inspector'); }} filterSectionId={activeSectionId} />
              <EmotionalCurve data={data.emotionalCurve} />
            </motion.div>
          )}
          {mobileTab === 'inspector' && (
            <motion.div key="m-inspector"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22, ease: EASE }} className="p-4">
              <ClaimInspector data={inspectorData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP: 3-column workspace ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT: Story Outline */}
        <div className="w-[280px] xl:w-[300px] flex-shrink-0 border-r border-white/[0.06] overflow-hidden">
          {leftPanel}
        </div>

        {/* CENTER: Script Editor */}
        <div className="flex-1 min-w-0 border-r border-white/[0.06] overflow-hidden">
          {centerPanel}
        </div>

        {/* RIGHT: Claim Inspector */}
        <div className="w-[300px] xl:w-[320px] flex-shrink-0 overflow-hidden">
          {rightPanel}
        </div>
      </div>

      {/* ── SCENE TIMELINE (all viewports) ── */}
      <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#07070A]/90 px-4 py-3">
        <SceneTimeline
          scenes={data.scenes}
          activeSceneId={activeSceneId}
          onSelectScene={id => setActiveSceneId(prev => prev === id ? null : id)}
        />
      </div>

      {/* ── Continue CTA ── */}
      {onContinue && (
        <div className="hidden lg:flex flex-shrink-0 items-center justify-between
          px-6 py-3 border-t border-white/[0.05] bg-[#07070A]/90 backdrop-blur-sm">
          <p className="text-[11px] font-mono text-slate-600">
            {data.meta.approvedBlocks}/{data.meta.totalBlocks} blocks approved ·{' '}
            {data.meta.completionPercent}% complete
          </p>
          <motion.button
            type="button" onClick={onContinue}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white
              bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]
              border border-[#8B5CF6]/30 shadow-[0_4px_16px_rgba(124,58,237,0.3)]
              hover:shadow-[0_4px_22px_rgba(139,92,246,0.45)]
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            <FileText className="w-3.5 h-3.5" />
            Continue to Asset Room
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
