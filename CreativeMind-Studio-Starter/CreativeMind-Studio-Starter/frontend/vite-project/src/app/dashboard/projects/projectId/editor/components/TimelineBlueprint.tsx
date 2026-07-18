/**
 * TimelineBlueprint.tsx — Center Panel: Timeline Blueprint + Analytics Overlay
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn, ZoomOut, Maximize2, Bookmark, StickyNote, Link2,
  RefreshCw, ChevronDown, ChevronUp,
  BarChart2, Info, Shield
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import type { Scene } from '../mockData';
import { TIMELINE_TRACKS, ANALYTICS_CURVE, PROJECT_META } from '../mockData';
import {
  EditingStatusBadge, AssetReadinessBadge,
  WarningCount, EditorAvatar, PulseMarker
} from './EditorShared';

interface TimelineBlueprintProps {
  scenes: Scene[];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatTimecode(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Pacing Heatmap Cell ──────────────────────────────────────────────────────

const PACING_COLORS_MAP = {
  slow:   { bg: 'rgba(59,130,246,0.25)', text: '#3B82F6' },
  medium: { bg: 'rgba(245,158,11,0.25)', text: '#F59E0B' },
  fast:   { bg: 'rgba(16,185,129,0.25)', text: '#10B981' },
};

// ─── Timeline Clip Card ───────────────────────────────────────────────────────

interface ClipCardProps {
  scene: Scene;
  widthPx: number;
  isSelected: boolean;
  onSelect: () => void;
  trackColor: string;
  trackBg: string;
  compact?: boolean;
}

const ClipCard: React.FC<ClipCardProps> = ({
  scene, widthPx, isSelected, onSelect, trackColor, trackBg, compact = false
}) => {
  const minWidth = 80;
  const w = Math.max(widthPx, minWidth);

  return (
    <motion.div
      layout
      whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="relative rounded-lg cursor-pointer flex-shrink-0 overflow-hidden border transition-all duration-150"
      style={{
        width: w,
        background: isSelected ? `${trackColor}25` : trackBg,
        borderColor: isSelected ? trackColor : `${trackColor}30`,
        minHeight: compact ? 40 : 68,
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: trackColor }} />

      {/* Content */}
      <div className={`${compact ? 'px-2 py-1' : 'px-2.5 py-2'}`}>
        {compact ? (
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold" style={{ color: trackColor }}>
              SC{String(scene.sceneNumber).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-[#CBD5E1] truncate" style={{ maxWidth: w - 60 }}>
              {scene.title}
            </span>
            <span className="ml-auto text-[9px] font-mono text-[#94A3B8] flex-shrink-0">
              {formatDuration(scene.estimatedDuration)}
            </span>
          </div>
        ) : (
          <>
            {/* Timecode + duration */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-[#94A3B8]">{scene.timecode}</span>
              <span className="text-[9px] font-mono font-bold" style={{ color: trackColor }}>
                {formatDuration(scene.estimatedDuration)}
              </span>
            </div>

            {/* Scene number + title */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded" style={{ color: trackColor, background: `${trackColor}18` }}>
                SC{String(scene.sceneNumber).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-medium text-[#F8FAFC] truncate" style={{ maxWidth: w - 80 }}>
                {scene.title}
              </span>
            </div>

            {/* Badges */}
            {w > 180 && (
              <div className="flex flex-wrap gap-1 mb-1">
                <EditingStatusBadge status={scene.editingStatus} size="sm" />
                <AssetReadinessBadge readiness={scene.assetReadiness} />
              </div>
            )}

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <EditorAvatar name={scene.assignedEditor} size="sm" />
              <div className="flex items-center gap-1">
                <WarningCount count={scene.warningCount} />
                {scene.copyrightRiskMarker && (
                  <span className="text-amber-400"><Shield size={9} /></span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pattern interruption marker */}
      {scene.patternInterruption && (
        <div
          className="absolute top-0 right-0 w-2 h-2 rounded-full"
          style={{ background: '#8B5CF6' }}
          title="Pattern Interruption"
        />
      )}
    </motion.div>
  );
};

// ─── Analytics Panel ──────────────────────────────────────────────────────────

interface AnalyticsPanelProps {
  scenes: Scene[];
}

interface TooltipPayloadEntry { dataKey: string; name: string; value: number; color: string; }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayloadEntry[]; label?: number; }

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#151521] border border-white/10 rounded-lg p-2.5 text-xs shadow-xl">
      <div className="text-[#94A3B8] mb-1 font-mono">{formatTimecode(label ?? 0)}</div>
      {payload.map((entry: TooltipPayloadEntry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-[#CBD5E1]">{entry.name}:</span>
          <span className="font-bold" style={{ color: entry.color }}>{Math.round(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ scenes }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-t border-white/5 flex-shrink-0">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/2 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart2 size={13} className="text-[#8B5CF6]" />
          <span className="text-xs font-semibold text-[#F8FAFC]">Analytics Overlay</span>
          <span className="text-[10px] text-[#94A3B8]">Pacing · Emotional Intensity · Information Density</span>
        </div>
        <span className="text-[#94A3B8]">
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
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
            <div className="px-4 pb-3">
              {/* Legend */}
              <div className="flex items-center gap-4 mb-2">
                {[
                  { color: '#EF4444', label: 'Emotional Intensity' },
                  { color: '#3B82F6', label: 'Information Density' },
                  { color: '#10B981', label: 'Pacing' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-[10px] text-[#94A3B8]">{item.label}</span>
                  </div>
                ))}

                {/* Marker legend */}
                <div className="ml-auto flex items-center gap-3">
                  <PulseMarker color="#8B5CF6" label="Pattern Break" />
                  <PulseMarker color="#F59E0B" label="Copyright Risk" />
                  <PulseMarker color="#EF4444" label="Missing Visual" />
                </div>
              </div>

              {/* Chart */}
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ANALYTICS_CURVE} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="emotionalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="pacingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={formatTimecode}
                      tick={{ fontSize: 9, fill: '#64748B' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: '#64748B' }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="emotionalIntensity"
                      name="Emotional"
                      stroke="#EF4444"
                      fill="url(#emotionalGrad)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="informationDensity"
                      name="Info Density"
                      stroke="#3B82F6"
                      fill="url(#densityGrad)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="pacing"
                      name="Pacing"
                      stroke="#10B981"
                      fill="url(#pacingGrad)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pacing Heatmap row */}
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[9px] text-[#94A3B8] w-16 flex-shrink-0">Pacing:</span>
                <div className="flex gap-0.5 flex-1">
                  {scenes.map(scene => {
                    const pCfg = PACING_COLORS_MAP[scene.pacing];
                    return (
                      <div
                        key={scene.id}
                        className="h-3 rounded-sm flex-1 relative group"
                        style={{ background: pCfg.bg, border: `1px solid ${pCfg.text}30` }}
                        title={`SC${scene.sceneNumber}: ${scene.pacing} pacing`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {(['slow', 'medium', 'fast'] as const).map(p => (
                    <div key={p} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm" style={{ background: PACING_COLORS_MAP[p].bg, border: `1px solid ${PACING_COLORS_MAP[p].text}50` }} />
                      <span className="text-[9px] text-[#94A3B8] capitalize">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Information Density Warning */}
              {scenes.some(s => s.informationDensity > 80) && (
                <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/8 border border-amber-500/20 text-[10px]">
                  <Info size={11} className="text-amber-400 flex-shrink-0" />
                  <span className="text-amber-300">
                    <strong>Information Density Warning:</strong> Scene 3 exceeds 90% density threshold. Consider splitting into two scenes or adding visual breathing room.
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Timeline Blueprint ──────────────────────────────────────────────────

export const TimelineBlueprint: React.FC<TimelineBlueprintProps> = ({
  scenes, selectedSceneId, onSelectScene
}) => {
  const [zoom, setZoom] = useState(1);
  const [markers, setMarkers] = useState<string[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const PIXELS_PER_SECOND = 3 * zoom;
  const totalDuration = PROJECT_META.totalDuration;

  const addMarker = () => {
    const id = `marker-${Date.now()}`;
    setMarkers(m => [...m, id]);
  };

  return (
    <div className="h-full flex flex-col bg-[#07070A]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] font-display">Timeline Blueprint</h2>
            <p className="text-[11px] text-[#94A3B8]">
              {PROJECT_META.title} · {formatTimecode(totalDuration)} total ·{' '}
              <span className="text-[#8B5CF6]">{PROJECT_META.completionPercent}% complete</span>
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1.5">
            {[
              { icon: ZoomOut, label: 'Zoom out', action: () => setZoom(z => Math.max(0.4, z - 0.2)) },
              { icon: ZoomIn, label: 'Zoom in', action: () => setZoom(z => Math.min(3, z + 0.2)) },
              { icon: Maximize2, label: 'Fit to window', action: () => setZoom(1) },
              { icon: Bookmark, label: 'Add marker', action: addMarker },
              { icon: StickyNote, label: 'Add note', action: () => {} },
              { icon: Link2, label: 'Link asset', action: () => {} },
              { icon: RefreshCw, label: 'Sync', action: () => {} },
            ].map(({ icon: Icon, label, action }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={action}
                title={label}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors border border-transparent hover:border-white/8"
              >
                <Icon size={14} />
              </motion.button>
            ))}

            {/* Zoom indicator */}
            <span className="text-[10px] font-mono text-[#94A3B8] px-2 py-1 bg-white/4 rounded border border-white/8">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7C3AED, #9D6CFF)' }}
              initial={{ width: 0 }}
              animate={{ width: `${PROJECT_META.completionPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#8B5CF6]">{PROJECT_META.completionPercent}%</span>
        </div>
      </div>

      {/* Timeline scroll area */}
      <div className="flex-1 overflow-auto min-h-0" ref={timelineRef}>
        <div style={{ minWidth: totalDuration * PIXELS_PER_SECOND + 160 }}>
          {/* Timecode ruler */}
          <div className="flex items-center h-6 bg-[#0B0B12] border-b border-white/5 sticky top-0 z-10">
            <div className="w-32 flex-shrink-0 text-[9px] text-[#94A3B8] px-3 font-mono border-r border-white/5">
              TRACK
            </div>
            <div className="relative flex-1">
              {Array.from({ length: Math.ceil(totalDuration / 15) + 1 }).map((_, i) => {
                const sec = i * 15;
                return (
                  <span
                    key={sec}
                    className="absolute text-[8px] font-mono text-[#64748B] top-1"
                    style={{ left: sec * PIXELS_PER_SECOND }}
                  >
                    {formatTimecode(sec)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Tracks */}
          {TIMELINE_TRACKS.map(track => (
            <div
              key={track.id}
              className="flex items-center border-b border-white/4 hover:bg-white/1 transition-colors"
              style={{ height: track.type === 'Video' ? 80 : 44 }}
            >
              {/* Track label */}
              <div
                className="w-32 flex-shrink-0 flex items-center gap-2 px-3 h-full border-r border-white/5"
                style={{ background: `${track.color}06` }}
              >
                <div className="w-1.5 h-4 rounded-full flex-shrink-0" style={{ background: track.color }} />
                <span className="text-[10px] font-semibold" style={{ color: track.color }}>{track.type}</span>
              </div>

              {/* Clip area */}
              <div className="flex-1 flex items-center gap-1.5 px-2 relative overflow-visible">
                {/* Clip lane background lines */}
                {Array.from({ length: Math.ceil(totalDuration / 15) + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-white/3"
                    style={{ left: i * 15 * PIXELS_PER_SECOND }}
                  />
                ))}

                {/* Scene clips — shown on video track in full; compact on others */}
                {scenes.map(scene => {
                  const parts = scene.timecode.split(':');
                  const h = parseInt(parts[0]) || 0;
                  const m = parseInt(parts[1]) || 0;
                  const s = parseInt(parts[2]) || 0;
                  const startSeconds = h * 3600 + m * 60 + s;

                  const widthPx = scene.estimatedDuration * PIXELS_PER_SECOND;
                  const leftPx = startSeconds * PIXELS_PER_SECOND;

                  // Only show certain tracks
                  const showOnTrack = (
                    track.type === 'Video' ||
                    (track.type === 'B-roll' && scene.visualType === 'B-roll Montage') ||
                    (track.type === 'Graphics' && scene.motionGraphics.length > 0) ||
                    (track.type === 'Voiceover' && scene.voiceoverScript.length > 0) ||
                    (track.type === 'Music' && scene.sounds.some(s => s.type === 'music')) ||
                    (track.type === 'Sound Effects' && scene.sounds.some(s => s.type === 'sfx')) ||
                    (track.type === 'Citation Overlays' && scene.citationLinks.length > 0) ||
                    (track.type === 'Text' && scene.motionGraphics.some(mg => mg.type === 'kinetic-text' || mg.type === 'lower-third'))
                  );

                  if (!showOnTrack) return null;

                  return (
                    <div
                      key={scene.id}
                      className="absolute"
                      style={{ left: leftPx, top: 6, bottom: 6 }}
                    >
                      <ClipCard
                        scene={scene}
                        widthPx={widthPx}
                        isSelected={selectedSceneId === scene.id}
                        onSelect={() => onSelectScene(scene.id)}
                        trackColor={track.color}
                        trackBg={track.bgColor}
                        compact={track.type !== 'Video'}
                      />
                    </div>
                  );
                })}

                {/* Pattern interruption markers */}
                {track.type === 'Video' && scenes.filter(s => s.patternInterruption).map(scene => {
                  const parts = scene.timecode.split(':');
                  const startSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
                  return (
                    <motion.div
                      key={`pi-${scene.id}`}
                      className="absolute top-0 bottom-0 w-0.5 z-20"
                      style={{ left: startSeconds * PIXELS_PER_SECOND, background: '#8B5CF6' }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      title={`Pattern Interruption — SC${scene.sceneNumber}`}
                    />
                  );
                })}

                {/* Copyright risk markers */}
                {track.type === 'Video' && scenes.filter(s => s.copyrightRiskMarker).map(scene => {
                  const parts = scene.timecode.split(':');
                  const startSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
                  return (
                    <motion.div
                      key={`cr-${scene.id}`}
                      className="absolute -top-1 flex flex-col items-center z-20"
                      style={{ left: startSeconds * PIXELS_PER_SECOND + 6 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2.5 h-2.5 rounded-full bg-amber-400"
                        title={`Copyright Risk — SC${scene.sceneNumber}`}
                      />
                    </motion.div>
                  );
                })}

                {/* User-added markers */}
                {track.type === 'Video' && markers.map((mid, idx) => (
                  <motion.div
                    key={mid}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-0 bottom-0 w-0.5 bg-[#06B6D4] z-20"
                    style={{ left: (50 + idx * 40) * PIXELS_PER_SECOND }}
                    title="User Marker"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Panel */}
      <AnalyticsPanel scenes={scenes} />
    </div>
  );
};
