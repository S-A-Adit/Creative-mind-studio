/**
 * ScriptToolbar.tsx — Top toolbar: autosave status, version history,
 * AI rewrite menu, tone controls, reading/voice-over time estimates.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Clock,
  History,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mic,
  BookOpen,
  Sliders,
  Check,
  GitBranch,
} from 'lucide-react';
import type { AutosaveState, ScriptVersion, ScriptMeta } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Autosave indicator ───────────────────────────────────────────────────────

const AUTOSAVE_CFG: Record<AutosaveState, {
  icon: React.ReactNode;
  label: string;
  color: string;
}> = {
  saved:   { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'All changes saved',  color: '#10B981' },
  saving:  { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, label: 'Saving…',   color: '#8B5CF6' },
  unsaved: { icon: <Save className="w-3.5 h-3.5" />,         label: 'Unsaved changes',    color: '#F59E0B' },
  error:   { icon: <AlertCircle className="w-3.5 h-3.5" />,  label: 'Save failed',         color: '#EF4444' },
};

// ─── Tone options ─────────────────────────────────────────────────────────────

const TONES = [
  { id: 'authoritative', label: 'Authoritative' },
  { id: 'conversational', label: 'Conversational' },
  { id: 'emotive', label: 'Emotive' },
  { id: 'investigative', label: 'Investigative' },
  { id: 'neutral', label: 'Neutral' },
];

// ─── AI rewrite options ───────────────────────────────────────────────────────

const AI_REWRITES = [
  { id: 'improve-hook',     label: 'Improve Hook',        icon: '🎣' },
  { id: 'shorten',          label: 'Shorten Selection',   icon: '✂️' },
  { id: 'add-emotion',      label: 'Add Emotional Layer', icon: '💡' },
  { id: 'simplify',         label: 'Simplify Language',   icon: '🧹' },
  { id: 'add-citation',     label: 'Add Citation Note',   icon: '📎' },
  { id: 'stronger-cta',     label: 'Strengthen CTA',      icon: '🎯' },
];

function fmtMinSec(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

// ─── Version item ─────────────────────────────────────────────────────────────

const VersionItem: React.FC<{ version: ScriptVersion }> = ({ version }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] cursor-pointer
    hover:bg-white/[0.04] transition-colors ${version.isCurrent ? 'bg-[#7C3AED]/08 border border-[#7C3AED]/20' : ''}`}>
    <GitBranch className="w-3 h-3 text-slate-600 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold text-slate-200 truncate">{version.label}</p>
      <p className="text-[9px] font-mono text-slate-600">{version.timestamp} · {version.author.name}</p>
    </div>
    {version.isCurrent && (
      <span className="text-[9px] font-mono text-[#9D6CFF] px-1.5 py-0.5 rounded-full
        bg-[#7C3AED]/10 border border-[#7C3AED]/25 flex-shrink-0">
        Current
      </span>
    )}
    {!version.isCurrent && (
      <span className="text-[9px] font-mono text-slate-600">{version.changeCount} changes</span>
    )}
  </div>
);

// ─── Dropdown wrapper ─────────────────────────────────────────────────────────

const Dropdown: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: string;
}> = ({ trigger, children, align = 'left', width = 'w-56' }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: EASE }}
              className={`absolute top-full mt-1.5 z-50 ${width}
                ${align === 'right' ? 'right-0' : 'left-0'}
                rounded-2xl border border-white/[0.12] bg-[#0D0D18] shadow-2xl
                backdrop-blur-xl overflow-hidden`}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Toolbar button primitive ─────────────────────────────────────────────────

const TBtn: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ children, active, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[11px] font-mono
      border transition-all duration-150
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
      ${active
        ? 'bg-[#7C3AED]/20 text-[#9D6CFF] border-[#7C3AED]/35'
        : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:border-white/[0.15] hover:text-slate-200'
      } ${className}`}
  >
    {children}
  </button>
);

// ─── Main toolbar ─────────────────────────────────────────────────────────────

interface ScriptToolbarProps {
  meta: ScriptMeta;
  versions: ScriptVersion[];
  autosaveState: AutosaveState;
  activeTone: string;
  onToneChange: (tone: string) => void;
  lockedMode: boolean;
  onToggleLock: () => void;
}

export const ScriptToolbar: React.FC<ScriptToolbarProps> = ({
  meta,
  versions,
  autosaveState,
  activeTone,
  onToneChange,
  lockedMode,
  onToggleLock,
}) => {
  const autosaveCfg = AUTOSAVE_CFG[autosaveState];

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5
      border-b border-white/[0.06] bg-[#0B0B12]/80 backdrop-blur-sm">

      {/* Autosave indicator */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono flex-shrink-0"
        style={{ color: autosaveCfg.color }}>
        {autosaveCfg.icon}
        <span>{autosaveCfg.label}</span>
        <span className="text-slate-600 ml-1">{meta.lastSavedAt}</span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/[0.08] flex-shrink-0" />

      {/* Reading + voice-over estimates */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
          <BookOpen className="w-3 h-3" />
          <span>Read: <span className="text-slate-300">{fmtMinSec(meta.estimatedReadingTimeSec)}</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
          <Mic className="w-3 h-3" />
          <span>V/O: <span className="text-slate-300">{fmtMinSec(meta.estimatedVoiceoverSec)}</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
          <Clock className="w-3 h-3" />
          <span className="text-slate-300">{meta.totalWords} words</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/[0.08] flex-shrink-0" />

      {/* Tone selector */}
      <Dropdown
        align="left"
        width="w-44"
        trigger={
          <TBtn active={false} className="cursor-pointer">
            <Sliders className="w-3 h-3" />
            <span className="capitalize">{activeTone}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </TBtn>
        }
      >
        <div className="p-2 space-y-0.5">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest px-2 py-1.5">Tone</p>
          {TONES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => onToneChange(t.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[9px]
                text-[11px] font-mono text-slate-300 hover:bg-white/[0.05]
                transition-colors text-left"
            >
              {activeTone === t.id && <Check className="w-3 h-3 text-[#9D6CFF]" />}
              {activeTone !== t.id && <span className="w-3" />}
              {t.label}
            </button>
          ))}
        </div>
      </Dropdown>

      {/* AI Rewrite */}
      <Dropdown
        align="left"
        width="w-52"
        trigger={
          <TBtn active={false} className="cursor-pointer">
            <Sparkles className="w-3 h-3 text-[#9D6CFF]" />
            <span>AI Rewrite</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </TBtn>
        }
      >
        <div className="p-2 space-y-0.5">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest px-2 py-1.5">AI Actions</p>
          {AI_REWRITES.map(a => (
            <button
              key={a.id}
              type="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[9px]
                text-[11px] font-mono text-slate-300 hover:bg-[#7C3AED]/10
                transition-colors text-left"
            >
              <span className="text-[13px]">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </Dropdown>

      {/* Version History */}
      <Dropdown
        align="left"
        width="w-64"
        trigger={
          <TBtn active={false} className="cursor-pointer">
            <History className="w-3 h-3" />
            <span>History</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </TBtn>
        }
      >
        <div className="p-2 space-y-1">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest px-2 py-1.5">
            Version History
          </p>
          {versions.map(v => <VersionItem key={v.id} version={v} />)}
        </div>
      </Dropdown>

      {/* Lock toggle */}
      <TBtn active={lockedMode} onClick={onToggleLock} className="cursor-pointer ml-auto">
        <Lock className="w-3 h-3" />
        <span>{lockedMode ? 'Locked' : 'Lock'}</span>
      </TBtn>
    </div>
  );
};
