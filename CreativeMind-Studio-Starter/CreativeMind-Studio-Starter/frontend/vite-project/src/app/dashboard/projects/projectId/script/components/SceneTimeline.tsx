/**
 * SceneTimeline.tsx — Horizontal scrollable scene timeline at the bottom.
 *
 * Each card: scene number, title, duration, approval status,
 * linked assets count, linked sources count.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Circle,
  Lock,
  Clock,
  Layers,
  Link2,
  Pencil,
} from 'lucide-react';
import type { SceneCard, SceneApprovalStatus } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Approval config ──────────────────────────────────────────────────────────

const SCENE_STATUS_CFG: Record<SceneApprovalStatus, {
  icon: React.ReactNode;
  badge: string;
  label: string;
}> = {
  'not-started':    { icon: <Circle className="w-3 h-3" />,        badge: 'text-slate-500 bg-slate-500/10 border-slate-500/20',     label: 'Not Started'   },
  'scripted':       { icon: <Pencil className="w-3 h-3" />,        badge: 'text-blue-400  bg-blue-500/10  border-blue-500/25',      label: 'Scripted'      },
  'approved':       { icon: <CheckCircle2 className="w-3 h-3" />,  badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', label: 'Approved'    },
  'locked':         { icon: <Lock className="w-3 h-3" />,          badge: 'text-slate-300  bg-slate-700/30  border-slate-600/30',   label: 'Locked'        },
  'needs-revision': { icon: <AlertTriangle className="w-3 h-3" />, badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25',  label: 'Needs Revision'},
};

function fmtSec(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── Single scene card ────────────────────────────────────────────────────────

interface SceneCardItemProps {
  scene: SceneCard;
  index: number;
  isActive: boolean;
  onClick: (id: string) => void;
}

const SceneCardItem: React.FC<SceneCardItemProps> = ({
  scene, index, isActive, onClick,
}) => {
  const cfg = SCENE_STATUS_CFG[scene.approvalStatus];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={() => onClick(scene.id)}
      className={`flex-shrink-0 w-[180px] rounded-2xl border overflow-hidden cursor-pointer
        transition-all duration-200
        ${isActive
          ? 'border-[#8B5CF6]/50 shadow-[0_0_18px_rgba(139,92,246,0.18)]'
          : 'border-white/[0.07] hover:border-white/[0.15]'
        }`}
      style={{ background: '#10101A' }}
    >
      {/* Thumbnail */}
      <div className={`h-[72px] bg-gradient-to-br ${scene.thumbnailGradient} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/25" />
        <span className="relative z-10 font-display font-bold text-[28px] text-white/20 leading-none select-none">
          {String(scene.sceneNumber).padStart(2, '0')}
        </span>
        {/* Status overlay */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`inline-flex items-center gap-1 text-[8px] font-mono font-semibold
            px-1.5 py-0.5 rounded-full border backdrop-blur-sm ${cfg.badge}`}>
            {cfg.icon}
          </span>
        </div>
        {/* Duration chip */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1
          bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
          <Clock className="w-2.5 h-2.5 text-white/60" />
          <span className="text-[9px] font-mono text-white/70">{fmtSec(scene.estimatedDurationSec)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <p className="text-[11px] font-semibold text-slate-200 leading-snug line-clamp-1">{scene.title}</p>
          <p className="text-[10px] text-slate-600 leading-snug mt-0.5 line-clamp-2">{scene.description}</p>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold
          px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>
          {cfg.icon}
          {cfg.label}
        </span>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[9px] font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <Layers className="w-2.5 h-2.5" />
            <span>{scene.linkedAssets}</span>
          </div>
          <div className="flex items-center gap-1">
            <Link2 className="w-2.5 h-2.5" />
            <span>{scene.linkedSources}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// ─── Timeline ─────────────────────────────────────────────────────────────────

interface SceneTimelineProps {
  scenes: SceneCard[];
  activeSceneId: string | null;
  onSelectScene: (id: string) => void;
}

export const SceneTimeline: React.FC<SceneTimelineProps> = ({
  scenes,
  activeSceneId,
  onSelectScene,
}) => {
  const totalSec = scenes.reduce((a, s) => a + s.estimatedDurationSec, 0);

  return (
    <section aria-label="Scene timeline" className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="font-display font-semibold text-[14px] text-white">Scene Timeline</h3>
          <p className="text-[10px] font-mono text-slate-600 mt-0.5">
            {scenes.length} scenes · {fmtSec(totalSec)} estimated
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
          {[
            { icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />, count: scenes.filter(s => s.approvalStatus === 'approved').length, label: 'approved' },
            { icon: <Pencil className="w-3 h-3 text-blue-400" />,          count: scenes.filter(s => s.approvalStatus === 'scripted').length,  label: 'scripted' },
            { icon: <Circle className="w-3 h-3 text-slate-600" />,         count: scenes.filter(s => s.approvalStatus === 'not-started').length, label: 'pending' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1">
              {s.icon}
              <span>{s.count} {s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connector line */}
      <div className="relative">
        <div className="absolute top-[52px] left-4 right-4 h-0.5 bg-white/[0.05] z-0" />

        {/* Horizontal scroll container */}
        <div className="flex gap-3 overflow-x-auto pb-3 relative z-10 snap-x snap-mandatory">
          {scenes.map((scene, i) => (
            <SceneCardItem
              key={scene.id}
              scene={scene}
              index={i}
              isActive={activeSceneId === scene.id}
              onClick={onSelectScene}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
