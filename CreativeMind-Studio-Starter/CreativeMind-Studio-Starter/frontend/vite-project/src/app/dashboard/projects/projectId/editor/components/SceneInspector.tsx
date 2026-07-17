/**
 * SceneInspector.tsx — Right Panel: Scene Inspector with 8 tabs
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, FileText, Film, Layers, Volume2, BookOpen, MessageSquare,
  Clock, CheckCircle2, XCircle, Download, ExternalLink, AlertTriangle,
  User, Sparkles, Shield, Music, Mic2, Map, Type, Zap, History,
  ChevronRight, Star, Info
} from 'lucide-react';
import type { Scene } from '../mockData';
import {
  PanelTabs, SectionHeader, AssetStatusTag, EditingStatusBadge,
  VisualTypeBadge, AssetReadinessBadge, MetricStat, EditorAvatar
} from './EditorShared';

const INSPECTOR_TABS = ['Visual', 'Narration', 'Assets', 'Motion', 'Sound', 'Sources', 'Comments', 'History'];

interface SceneInspectorProps {
  scene: Scene;
}

// ─── Visual Tab ───────────────────────────────────────────────────────────────

const VisualTab: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div className="space-y-4">
    {/* Shot List */}
    <div>
      <SectionHeader title="Shot List" count={scene.shots.length} accent="#8B5CF6" />
      <div className="space-y-2">
        {scene.shots.map((shot, idx) => (
          <motion.div
            key={shot.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-lg bg-[#0B0B12] border border-white/5 p-3"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded">
                  SHOT {idx + 1}
                </span>
                <span className="text-[10px] font-mono text-[#94A3B8]">{shot.duration}s</span>
              </div>
              <span className="text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded font-medium">
                {shot.framing}
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1] mb-1">{shot.description}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Camera size={10} />
              <span>{shot.cameraMovement}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Lighting + Color Grade */}
    <div className="grid grid-cols-1 gap-3">
      <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={12} className="text-[#F59E0B]" />
          <span className="text-[11px] font-semibold text-[#F8FAFC]">Lighting Notes</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">{scene.lightingNotes}</p>
      </div>
      <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }} />
          <span className="text-[11px] font-semibold text-[#F8FAFC]">Color Grade Direction</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">{scene.colorGradeDirection}</p>
      </div>
    </div>

    {/* Reference Images placeholder */}
    <div>
      <SectionHeader title="Reference Images" subtitle="Visual mood board" accent="#3B82F6" />
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Ref 1', color: '#1a1a2e' },
          { label: 'Ref 2', color: '#16213e' },
          { label: '+ Add', color: '#0B0B12', isAdd: true },
        ].map((ref, i) => (
          <div
            key={i}
            className="aspect-video rounded-lg border border-white/8 flex items-center justify-center text-[10px] text-[#64748B] cursor-pointer hover:border-white/15 transition-colors"
            style={{ background: ref.color }}
          >
            {ref.isAdd ? (
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg leading-none text-[#94A3B8]">+</span>
                <span>Add Ref</span>
              </div>
            ) : (
              <span>{ref.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Narration Tab ────────────────────────────────────────────────────────────

const NarrationTab: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div className="space-y-4">
    {/* Stats */}
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3 flex flex-col gap-1">
        <span className="text-[10px] text-[#94A3B8]">Reading Time</span>
        <span className="text-lg font-bold font-mono text-[#8B5CF6]">{scene.readingTime}</span>
      </div>
      <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3 flex flex-col gap-1">
        <span className="text-[10px] text-[#94A3B8]">Word Count</span>
        <span className="text-lg font-bold font-mono text-[#06B6D4]">
          {scene.voiceoverScript.split(' ').length}
        </span>
      </div>
    </div>

    {/* Voiceover Script */}
    <div>
      <SectionHeader title="Voiceover Script" accent="#06B6D4" />
      <div className="rounded-lg bg-[#0B0B12] border border-[#06B6D4]/20 p-3">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Mic2 size={11} className="text-[#06B6D4]" />
          <span className="text-[10px] text-[#06B6D4] font-semibold">VOICEOVER</span>
        </div>
        <p className="text-sm text-[#CBD5E1] leading-relaxed font-light italic">
          "{scene.voiceoverScript}"
        </p>
      </div>
    </div>

    {/* Emphasis Notes */}
    <div>
      <SectionHeader title="Emphasis Notes" accent="#F59E0B" />
      <div className="rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/15 p-3">
        <p className="text-xs text-[#CBD5E1] leading-relaxed">{scene.emphasisNotes}</p>
      </div>
    </div>

    {/* Pause Markers */}
    {scene.pauseMarkers.length > 0 && (
      <div>
        <SectionHeader title="Pause Markers" count={scene.pauseMarkers.length} accent="#EC4899" />
        <div className="space-y-1.5">
          {scene.pauseMarkers.map((marker, i) => (
            <div key={i} className="flex items-start gap-2 text-xs rounded-lg bg-[#0B0B12] border border-white/5 px-3 py-2">
              <span className="text-[#EC4899] mt-0.5 flex-shrink-0">⏸</span>
              <span className="text-[#CBD5E1]">{marker}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Citation Links preview */}
    {scene.citationLinks.length > 0 && (
      <div>
        <SectionHeader title="Citation Links" count={scene.citationLinks.length} accent="#94A3B8" />
        <div className="space-y-1">
          {scene.citationLinks.map(cite => (
            <div key={cite.id} className="flex items-center gap-2 text-[10px] text-[#94A3B8] rounded-lg bg-[#0B0B12] border border-white/5 px-2.5 py-1.5">
              <BookOpen size={10} className="text-[#8B5CF6] flex-shrink-0" />
              <span className="truncate">{cite.title}</span>
              {cite.verified && <CheckCircle2 size={9} className="text-[#10B981] ml-auto flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ─── Assets Tab ───────────────────────────────────────────────────────────────

const AssetsTab: React.FC<{ scene: Scene }> = ({ scene }) => {
  const approved = scene.assets.filter(a => a.status === 'approved');
  const missing = scene.assets.filter(a => a.status === 'missing');
  const atRisk = scene.assets.filter(a => a.status === 'copyright-risk');
  const aiGen = scene.assets.filter(a => a.status === 'ai-generated');

  const downloadIcons: Record<string, React.ElementType> = {
    downloaded: CheckCircle2,
    pending: Clock,
    unavailable: XCircle,
  };
  const downloadColors: Record<string, string> = {
    downloaded: '#10B981',
    pending: '#F59E0B',
    unavailable: '#EF4444',
  };

  const AssetRow: React.FC<{ asset: typeof scene.assets[0] }> = ({ asset }) => {
    const DlIcon = downloadIcons[asset.downloadStatus] ?? Download;
    const dlColor = downloadColors[asset.downloadStatus] ?? '#94A3B8';
    return (
      <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-2.5 space-y-1.5">
        <AssetStatusTag type={asset.type} status={asset.status} name={asset.name} />
        <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
          <Shield size={9} />
          <span>{asset.license}</span>
          <DlIcon size={9} style={{ color: dlColor }} className="ml-auto" />
          <span style={{ color: dlColor }}>{asset.downloadStatus}</span>
          {asset.size && asset.size !== '—' && (
            <span className="ml-1 text-[9px] text-[#64748B]">{asset.size}</span>
          )}
        </div>
        {asset.suggestedAlternative && (
          <div className="flex items-start gap-1.5 text-[10px] text-[#F59E0B] bg-[#F59E0B]/8 px-2 py-1 rounded">
            <Sparkles size={9} className="mt-0.5 flex-shrink-0" />
            <span>{asset.suggestedAlternative}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: 'Approved', count: approved.length, color: '#10B981' },
          { label: 'Missing', count: missing.length, color: '#EF4444' },
          { label: 'Copyright', count: atRisk.length, color: '#F59E0B' },
          { label: 'AI Gen', count: aiGen.length, color: '#8B5CF6' },
        ].map(item => (
          <div key={item.label} className="rounded-lg bg-[#0B0B12] border border-white/5 p-2 text-center">
            <div className="text-base font-bold font-mono" style={{ color: item.color }}>{item.count}</div>
            <div className="text-[9px] text-[#94A3B8]">{item.label}</div>
          </div>
        ))}
      </div>

      {/* All assets */}
      <div>
        <SectionHeader title="Linked Footage & Media" count={scene.assets.length} accent="#8B5CF6" />
        <div className="space-y-2">
          {scene.assets.map(asset => <AssetRow key={asset.id} asset={asset} />)}
        </div>
      </div>
    </div>
  );
};

// ─── Motion Graphics Tab ──────────────────────────────────────────────────────

const MotionTab: React.FC<{ scene: Scene }> = ({ scene }) => {
  const complexityColors = { simple: '#10B981', moderate: '#F59E0B', complex: '#EF4444' };
  const statusIcons = { ready: CheckCircle2, 'in-progress': Zap, pending: Clock };
  const statusColors = { ready: '#10B981', 'in-progress': '#8B5CF6', pending: '#94A3B8' };

  const typeIcons: Record<string, React.ElementType> = {
    'lower-third': Type,
    chart: BarChart2Stub,
    map: Map,
    'kinetic-text': Type,
    callout: Info2Stub,
    animation: Layers,
  };

  const typeLabels: Record<string, string> = {
    'lower-third': 'Lower Third',
    chart: 'Chart',
    map: 'Map',
    'kinetic-text': 'Kinetic Text',
    callout: 'Callout',
    animation: 'Animation',
  };

  return (
    <div className="space-y-4">
      {scene.motionGraphics.length === 0 ? (
        <div className="text-center py-8 text-[#94A3B8] text-xs">No motion graphics in this scene.</div>
      ) : (
        <>
          {/* Overview */}
          <div className="flex items-center gap-3 flex-wrap">
            {(['lower-third', 'chart', 'map', 'kinetic-text', 'callout', 'animation'] as const).map(t => {
              const count = scene.motionGraphics.filter(mg => mg.type === t).length;
              if (!count) return null;
              const Icon = typeIcons[t] ?? Layers;
              return (
                <div key={t} className="flex items-center gap-1.5 text-xs text-[#CBD5E1]">
                  <Icon size={12} className="text-[#8B5CF6]" />
                  <span>{typeLabels[t]}</span>
                  <span className="text-[#94A3B8] font-mono text-[10px]">×{count}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {scene.motionGraphics.map((mg, idx) => {
              const Icon = typeIcons[mg.type] ?? Layers;
              const StIcon = statusIcons[mg.status] ?? Clock;
              const stColor = statusColors[mg.status] ?? '#94A3B8';
              const cxColor = complexityColors[mg.complexity];

              return (
                <motion.div
                  key={mg.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-lg bg-[#0B0B12] border border-white/5 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon size={12} className="text-[#8B5CF6]" />
                      <span className="text-xs font-medium text-[#F8FAFC]">{mg.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ color: cxColor, background: `${cxColor}15` }}>
                        {mg.complexity}
                      </span>
                      <StIcon size={11} style={{ color: stColor }} />
                    </div>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] uppercase tracking-wide">{typeLabels[mg.type]}</span>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Placeholder icons for imported names
const BarChart2Stub: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="18" y="3" width="4" height="18" /><rect x="10" y="8" width="4" height="13" /><rect x="2" y="13" width="4" height="8" />
  </svg>
);

const Info2Stub: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
  </svg>
);

// ─── Sound Tab ────────────────────────────────────────────────────────────────

const SoundTab: React.FC<{ scene: Scene }> = ({ scene }) => {
  const typeColors = { music: '#EC4899', sfx: '#F97316', ambience: '#06B6D4' };
  const typeIcons = { music: Music, sfx: Volume2, ambience: Mic2 };

  return (
    <div className="space-y-4">
      {/* Loudness target */}
      <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 size={12} className="text-[#8B5CF6]" />
          <span className="text-xs font-semibold text-[#F8FAFC]">Loudness Target</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold font-mono text-[#8B5CF6]">-14</div>
          <div>
            <div className="text-xs text-[#CBD5E1]">LUFS Integrated</div>
            <div className="text-[10px] text-[#94A3B8]">YouTube standard</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs font-mono text-[#10B981]">-1.0 dBTP</div>
            <div className="text-[10px] text-[#94A3B8]">True Peak Max</div>
          </div>
        </div>
      </div>

      {/* Sound items */}
      <div>
        <SectionHeader title="Sound Cues" count={scene.sounds.length} accent="#EC4899" />
        <div className="space-y-2">
          {scene.sounds.map((snd, idx) => {
            const Icon = typeIcons[snd.type] ?? Volume2;
            const color = typeColors[snd.type] ?? '#94A3B8';
            return (
              <motion.div
                key={snd.id}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-lg bg-[#0B0B12] border border-white/5 p-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={12} style={{ color }} />
                    <span className="text-xs font-medium text-[#F8FAFC]">{snd.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8]">{snd.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
                  <span>Cue: {snd.cuePoint}</span>
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase"
                    style={{ color, background: `${color}15` }}
                  >
                    {snd.type}
                  </span>
                </div>
                {snd.duckingNote && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#F59E0B] bg-[#F59E0B]/8 px-2 py-1 rounded">
                    <AlertTriangle size={9} className="flex-shrink-0" />
                    <span>{snd.duckingNote}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {scene.sounds.length === 0 && (
        <div className="text-center py-6 text-[#94A3B8] text-xs">No sound cues assigned yet.</div>
      )}
    </div>
  );
};

// ─── Sources Tab ──────────────────────────────────────────────────────────────

const SourcesTab: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div className="space-y-3">
    {scene.citationLinks.length === 0 ? (
      <div className="text-center py-8 text-[#94A3B8] text-xs">No citations for this scene.</div>
    ) : (
      scene.citationLinks.map((cite, idx) => (
        <motion.div
          key={cite.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          className="rounded-xl bg-[#0B0B12] border border-white/5 p-3.5"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 mr-2">
              <h4 className="text-xs font-semibold text-[#F8FAFC] leading-tight mb-0.5">{cite.title}</h4>
              <p className="text-[10px] text-[#94A3B8]">{cite.author}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {cite.verified ? (
                <span className="flex items-center gap-1 text-[9px] text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded-full border border-[#10B981]/20">
                  <CheckCircle2 size={8} /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded-full border border-[#F59E0B]/20">
                  <AlertTriangle size={8} /> Unverified
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-[#94A3B8]">Page {cite.page}</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[#94A3B8]">Confidence</span>
              <div className="w-16 h-1 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: cite.confidence > 90 ? '#10B981' : cite.confidence > 75 ? '#F59E0B' : '#EF4444' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cite.confidence}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                />
              </div>
              <span className="font-mono font-bold" style={{ color: cite.confidence > 90 ? '#10B981' : '#F59E0B' }}>
                {cite.confidence}%
              </span>
            </div>
          </div>

          {cite.url && (
            <a
              href={cite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1 text-[10px] text-[#8B5CF6] hover:text-[#9D6CFF] transition-colors"
            >
              <ExternalLink size={9} /> Open source
            </a>
          )}
        </motion.div>
      ))
    )}
  </div>
);

// ─── Comments Tab ─────────────────────────────────────────────────────────────

const CommentsTab: React.FC<{ scene: Scene }> = ({ scene }) => (
  <div className="space-y-3">
    {scene.comments.length === 0 ? (
      <div className="text-center py-8 text-[#94A3B8] text-xs">No comments yet. Be the first to review!</div>
    ) : (
      scene.comments.map((comment, idx) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          className={`rounded-xl border p-3 transition-colors ${
            comment.resolved
              ? 'bg-[#0B0B12] border-white/4 opacity-60'
              : 'bg-[#151521] border-white/8'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
              style={{ background: `${comment.authorColor}20`, color: comment.authorColor, border: `1.5px solid ${comment.authorColor}40` }}
            >
              {comment.authorInitials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: comment.authorColor }}>
                  {comment.author}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[#64748B]">{comment.timestamp}</span>
                  {comment.resolved && (
                    <span className="text-[9px] text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded-full border border-[#10B981]/20">
                      Resolved
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {comment.text.split(' ').map((word, wi) => (
                  word.startsWith('@') ? (
                    <span key={wi} className="text-[#8B5CF6] font-medium">{word} </span>
                  ) : (
                    <span key={wi}>{word} </span>
                  )
                ))}
              </p>
            </div>
          </div>
        </motion.div>
      ))
    )}

    {/* New comment input */}
    <div className="flex items-center gap-2 mt-2">
      <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center text-[9px] font-bold text-[#8B5CF6] border border-[#8B5CF6]/30 flex-shrink-0">
        ME
      </div>
      <div className="flex-1 relative">
        <input
          placeholder="Add a comment… @mention"
          className="w-full px-3 py-1.5 rounded-lg bg-[#0B0B12] border border-white/8 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6]/40 transition-colors"
        />
      </div>
    </div>
  </div>
);

// ─── History Tab ──────────────────────────────────────────────────────────────

const HistoryTab: React.FC<{ scene: Scene }> = ({ scene }) => {
  const actionIcons: Record<string, React.ElementType> = {
    'Duration changed': Clock,
    'Asset replaced': Film,
    'Scene reordered': ChevronRight,
    'Approved for editing': CheckCircle2,
  };
  const actionColors: Record<string, string> = {
    'Duration changed': '#F59E0B',
    'Asset replaced': '#3B82F6',
    'Scene reordered': '#8B5CF6',
    'Approved for editing': '#10B981',
  };

  return (
    <div className="space-y-2">
      {scene.history.length === 0 ? (
        <div className="text-center py-8 text-[#94A3B8] text-xs">No history entries yet.</div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
          {scene.history.map((entry, idx) => {
            const Icon = actionIcons[entry.action] ?? History;
            const color = actionColors[entry.action] ?? '#94A3B8';
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="relative flex items-start gap-3 pb-4 pl-9"
              >
                {/* Icon dot */}
                <div
                  className="absolute left-2.5 top-1 w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ background: `${color}20`, border: `1.5px solid ${color}` }}
                >
                  <Icon size={7} style={{ color }} />
                </div>

                <div className="flex-1 rounded-lg bg-[#0B0B12] border border-white/5 p-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold" style={{ color }}>{entry.action}</span>
                    <span className="text-[9px] text-[#64748B] font-mono">{entry.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1]">{entry.detail}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <User size={9} className="text-[#64748B]" />
                    <span className="text-[10px] text-[#94A3B8]">{entry.user}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main SceneInspector ──────────────────────────────────────────────────────

export const SceneInspector: React.FC<SceneInspectorProps> = ({ scene }) => {
  const [activeTab, setActiveTab] = useState('Visual');

  const tabComponents: Record<string, React.FC<{ scene: Scene }>> = {
    Visual: VisualTab,
    Narration: NarrationTab,
    Assets: AssetsTab,
    Motion: MotionTab,
    Sound: SoundTab,
    Sources: SourcesTab,
    Comments: CommentsTab,
    History: HistoryTab,
  };

  const TabContent = tabComponents[activeTab] ?? VisualTab;

  // Tab icons
  const tabIcons: Record<string, React.ElementType> = {
    Visual: Camera,
    Narration: FileText,
    Assets: Film,
    Motion: Layers,
    Sound: Volume2,
    Sources: BookOpen,
    Comments: MessageSquare,
    History: History,
  };

  return (
    <div className="h-full flex flex-col bg-[#10101A]">
      {/* Scene header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded">
            SCENE {String(scene.sceneNumber).padStart(2, '0')}
          </span>
          <EditingStatusBadge status={scene.editingStatus} size="sm" />
          <AssetReadinessBadge readiness={scene.assetReadiness} />
        </div>
        <h2 className="text-sm font-bold text-[#F8FAFC] font-display leading-tight mb-2">{scene.title}</h2>
        <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-2.5 line-clamp-2">{scene.narrationSummary}</p>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mb-3">
          <MetricStat label="Duration" value={`${scene.estimatedDuration}s`} color="#06B6D4" />
          <MetricStat label="Assets" value={scene.linkedAssetsCount} color="#8B5CF6" />
          <MetricStat label="Warnings" value={scene.warningCount} color={scene.warningCount > 0 ? '#F59E0B' : '#10B981'} />
          <div className="ml-auto flex items-center gap-1.5">
            <EditorAvatar name={scene.assignedEditor} size="md" />
            <span className="text-[10px] text-[#94A3B8]">{scene.assignedEditor}</span>
          </div>
        </div>

        <VisualTypeBadge type={scene.visualType} />
      </div>

      {/* Tabs */}
      <div className="px-3 pt-2.5 pb-2 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-0.5 bg-[#0B0B12] rounded-lg p-0.5 border border-white/5 overflow-x-auto">
          {INSPECTOR_TABS.map(tab => {
            const Icon = tabIcons[tab] ?? Camera;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-shrink-0 flex items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-all duration-200 ${
                  isActive ? 'text-[#F8FAFC]' : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="inspector-tab-pill"
                    className="absolute inset-0 rounded-md bg-[#151521] border border-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={10} className="relative z-10 flex-shrink-0" />
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <TabContent scene={scene} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
