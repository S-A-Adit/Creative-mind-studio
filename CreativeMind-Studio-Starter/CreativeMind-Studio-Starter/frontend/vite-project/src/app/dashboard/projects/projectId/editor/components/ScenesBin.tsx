/**
 * ScenesBin.tsx — Left Panel: Scenes & Media Bin
 */

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Search, Filter, Plus, Film, Music, Volume2, Image,
  Cpu, AlertTriangle, CheckCircle2, XCircle, Sparkles,
  ChevronDown, ChevronUp, GripVertical
} from 'lucide-react';
import type { Scene } from '../mockData';
import { MEDIA_BIN } from '../mockData';
import {
  EditingStatusBadge, AssetReadinessBadge, VisualTypeBadge,
  WarningCount, PacingDot, EditorAvatar, SectionHeader
} from './EditorShared';

interface ScenesBinProps {
  scenes: Scene[];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
  onReorderScenes: (scenes: Scene[]) => void;
}

const FILTER_OPTIONS = ['All', 'Approved', 'In Progress', 'Review', 'Blocked', 'Not Started'];
const _VISUAL_FILTERS = ['All Types', 'Talking Head', 'Documentary', 'Interview', 'B-roll Montage', 'Motion Graphics', 'Screen Recording'];
void _VISUAL_FILTERS;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Scene Card ───────────────────────────────────────────────────────────────

interface SceneCardProps {
  scene: Scene;
  isSelected: boolean;
  onSelect: () => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, isSelected, onSelect }) => {
  const border = isSelected ? 'border-[#8B5CF6]/60' : 'border-white/5 hover:border-white/10';
  const bg = isSelected ? 'bg-[#8B5CF6]/8' : 'bg-[#151521] hover:bg-[#1B1B2A]';

  return (
    <motion.div
      layout
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
      onClick={onSelect}
      className={`group relative rounded-xl border cursor-pointer transition-colors duration-150 p-3 ${border} ${bg}`}
    >
      {/* Drag handle */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
        <GripVertical size={14} className="text-[#94A3B8]" />
      </div>

      {/* Scene number + warnings */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded">
            SC {String(scene.sceneNumber).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8]">{scene.timecode}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <WarningCount count={scene.warningCount} />
          {scene.copyrightRiskMarker && (
            <span className="text-amber-400" title="Copyright Risk"><AlertTriangle size={11} /></span>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-[#F8FAFC] mb-1 leading-tight">{scene.title}</h4>

      {/* Narration summary */}
      <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-2.5 line-clamp-2">
        {scene.narrationSummary}
      </p>

      {/* Visual type + pacing */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        <VisualTypeBadge type={scene.visualType} />
        <PacingDot pacing={scene.pacing} />
      </div>

      {/* Metadata row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EditingStatusBadge status={scene.editingStatus} />
          <AssetReadinessBadge readiness={scene.assetReadiness} />
        </div>
        <div className="flex items-center gap-1.5">
          <EditorAvatar name={scene.assignedEditor} />
          <span className="text-[10px] font-mono text-[#94A3B8]">{formatDuration(scene.estimatedDuration)}</span>
        </div>
      </div>

      {/* Asset count */}
      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-[#94A3B8]">
          <Film size={10} className="inline mr-1" />
          {scene.linkedAssetsCount} assets linked
        </span>
        <div className="flex items-center gap-1">
          {scene.patternInterruption && (
            <span className="text-[9px] text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded-full border border-[#8B5CF6]/20">
              Pattern Break
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Media Bin Summary ────────────────────────────────────────────────────────

const MediaBinSection: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  const bins = [
    { label: 'Approved Assets', count: MEDIA_BIN.approved, color: '#10B981', icon: CheckCircle2 },
    { label: 'Missing Assets', count: MEDIA_BIN.missing, color: '#EF4444', icon: XCircle },
    { label: 'Copyright Risk', count: MEDIA_BIN.copyrightRisk, color: '#F59E0B', icon: AlertTriangle },
    { label: 'AI Generated', count: MEDIA_BIN.aiGenerated, color: '#8B5CF6', icon: Sparkles },
    { label: 'Music Tracks', count: MEDIA_BIN.music, color: '#EC4899', icon: Music },
    { label: 'SFX', count: MEDIA_BIN.sfx, color: '#F97316', icon: Volume2 },
  ];

  return (
    <div className="border-t border-white/5 pt-3 mt-1">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <SectionHeader title="Media Bin" subtitle="Asset inventory overview" />
        <span className="text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {bins.map((bin) => {
                const Icon = bin.icon;
                return (
                  <div
                    key={bin.label}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 bg-[#0B0B12] border border-white/5 hover:border-white/10 transition-colors cursor-default"
                  >
                    <Icon size={12} style={{ color: bin.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-[#94A3B8] truncate">{bin.label}</div>
                      <div className="text-sm font-bold font-mono" style={{ color: bin.color }}>
                        {bin.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Asset type icons row */}
            <div className="mt-2.5 flex items-center gap-2 text-[10px] text-[#94A3B8]">
              <Film size={11} className="text-[#8B5CF6]" />
              <span>Footage</span>
              <Image size={11} className="text-[#3B82F6]" />
              <span>Images</span>
              <Cpu size={11} className="text-[#10B981]" />
              <span>Graphics</span>
              <Music size={11} className="text-[#EC4899]" />
              <span>Audio</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main ScenesBin ───────────────────────────────────────────────────────────

export const ScenesBin: React.FC<ScenesBinProps> = ({
  scenes,
  selectedSceneId,
  onSelectScene,
  onReorderScenes,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = scenes.filter(s => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.narrationSummary.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Approved' && s.editingStatus === 'approved') ||
      (statusFilter === 'In Progress' && s.editingStatus === 'in-progress') ||
      (statusFilter === 'Review' && s.editingStatus === 'review') ||
      (statusFilter === 'Blocked' && s.editingStatus === 'blocked') ||
      (statusFilter === 'Not Started' && s.editingStatus === 'not-started');
    return matchSearch && matchStatus;
  });

  return (
    <div className="h-full flex flex-col bg-[#10101A]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] font-display">Scenes & Media Bin</h2>
            <p className="text-[11px] text-[#94A3B8]">{scenes.length} scenes · Drag to reorder</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/25 hover:bg-[#8B5CF6]/20 transition-colors text-xs font-semibold"
          >
            <Plus size={12} /> Scene
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search scenes…"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0B0B12] border border-white/8 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#8B5CF6]/40 transition-colors"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <Filter size={11} />
          Filters
          {statusFilter !== 'All' && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-[9px] font-bold">1</span>
          )}
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden mt-2"
            >
              <div className="flex flex-wrap gap-1">
                {FILTER_OPTIONS.map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                      statusFilter === f
                        ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30'
                        : 'bg-white/4 text-[#94A3B8] border border-white/8 hover:border-white/15'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scene list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-8 text-[#94A3B8] text-xs"
            >
              No scenes match your filters.
            </motion.div>
          ) : (
            <Reorder.Group
              axis="y"
              values={filtered}
              onReorder={onReorderScenes}
              className="space-y-2"
            >
              {filtered.map((scene) => (
                <Reorder.Item key={scene.id} value={scene}>
                  <SceneCard
                    scene={scene}
                    isSelected={selectedSceneId === scene.id}
                    onSelect={() => onSelectScene(scene.id)}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </AnimatePresence>
      </div>

      {/* Media Bin */}
      <div className="px-3 pb-3 flex-shrink-0">
        <MediaBinSection />
      </div>
    </div>
  );
};
