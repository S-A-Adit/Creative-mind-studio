/**
 * ScriptBlock.tsx — Single block in the block-based script editor.
 *
 * Supports: Narration · Dialogue · Interview · On-screen Text ·
 *           Visual Direction · Sound Direction · Citation · Editor Note
 *
 * Each block shows: type badge, scene number, comment count, approval
 * status, word count, duration estimate, claim validation indicator.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  Type,
  Camera,
  Music,
  Quote,
  StickyNote,
  Users,
  Tv,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Lock,
  Eye,
  Sparkles,
  Link2,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import type { ScriptBlock, BlockType, ApprovalStatus, ClaimStatus } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Block type config ────────────────────────────────────────────────────────

const BLOCK_TYPE_CFG: Record<BlockType, {
  label: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
  leftBar: string;
}> = {
  'narration':       { label: 'Narration',       icon: <Type className="w-3 h-3" />,        bg: '#8B5CF620', border: '#8B5CF630', text: '#C4B5FD', leftBar: '#8B5CF6' },
  'dialogue':        { label: 'Dialogue',         icon: <MessageSquare className="w-3 h-3" />, bg: '#06B6D420', border: '#06B6D430', text: '#67E8F9', leftBar: '#06B6D4' },
  'interview':       { label: 'Interview',        icon: <Users className="w-3 h-3" />,        bg: '#10B98120', border: '#10B98130', text: '#6EE7B7', leftBar: '#10B981' },
  'on-screen-text':  { label: 'On-Screen Text',   icon: <Tv className="w-3 h-3" />,           bg: '#F59E0B20', border: '#F59E0B30', text: '#FCD34D', leftBar: '#F59E0B' },
  'visual-direction':{ label: 'Visual Direction', icon: <Camera className="w-3 h-3" />,       bg: '#EF444420', border: '#EF444430', text: '#FCA5A5', leftBar: '#EF4444' },
  'sound-direction': { label: 'Sound Direction',  icon: <Music className="w-3 h-3" />,        bg: '#EC489920', border: '#EC489930', text: '#F9A8D4', leftBar: '#EC4899' },
  'citation':        { label: 'Citation',         icon: <Quote className="w-3 h-3" />,        bg: '#64748B20', border: '#64748B30', text: '#94A3B8', leftBar: '#64748B' },
  'editor-note':     { label: 'Editor Note',      icon: <StickyNote className="w-3 h-3" />,   bg: '#78350F20', border: '#78350F30', text: '#FDE68A', leftBar: '#B45309' },
};

// ─── Approval status config ───────────────────────────────────────────────────

const APPROVAL_CFG: Record<ApprovalStatus, {
  icon: React.ReactNode;
  badge: string;
  label: string;
}> = {
  'pending':        { icon: <Clock className="w-3 h-3" />,         badge: 'text-slate-400  bg-slate-500/10 border-slate-500/20',     label: 'Pending'       },
  'approved':       { icon: <CheckCircle2 className="w-3 h-3" />,  badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', label: 'Approved'      },
  'rejected':       { icon: <XCircle className="w-3 h-3" />,       badge: 'text-red-400    bg-red-500/10    border-red-500/25',       label: 'Rejected'      },
  'locked':         { icon: <Lock className="w-3 h-3" />,          badge: 'text-slate-300  bg-slate-700/30  border-slate-600/30',     label: 'Locked'        },
  'needs-revision': { icon: <AlertTriangle className="w-3 h-3" />, badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25',    label: 'Needs Revision'},
};

// ─── Claim status config ──────────────────────────────────────────────────────

const CLAIM_CFG: Record<ClaimStatus, {
  icon: React.ReactNode;
  label: string;
  color: string;
}> = {
  'verified':            { icon: <CheckCircle2 className="w-3 h-3" />, label: 'Verified',            color: '#10B981' },
  'partially-supported': { icon: <AlertTriangle className="w-3 h-3" />, label: 'Partial Support',    color: '#F59E0B' },
  'contested':           { icon: <AlertTriangle className="w-3 h-3" />, label: 'Contested',          color: '#F97316' },
  'unverified':          { icon: <HelpCircle className="w-3 h-3" />,    label: 'Unverified',         color: '#EAB308' },
};

function fmtSec(sec: number): string {
  if (sec === 0) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── Inline comment ───────────────────────────────────────────────────────────

const CommentBubble: React.FC<{
  author: { name: string; initials: string; color: string };
  text: string;
  timestamp: string;
  resolved: boolean;
}> = ({ author, text, timestamp, resolved }) => (
  <div className={`flex items-start gap-2.5 p-2.5 rounded-[10px] border transition-all ${
    resolved
      ? 'border-white/[0.04] bg-white/[0.02] opacity-50'
      : 'border-amber-500/15 bg-amber-500/04'
  }`}>
    <div
      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
      style={{ background: author.color + '25', color: author.color }}
    >
      {author.initials}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[10px] font-semibold" style={{ color: author.color }}>{author.name}</span>
        <span className="text-[9px] font-mono text-slate-600">{timestamp}</span>
        {resolved && <span className="text-[9px] font-mono text-emerald-600">resolved</span>}
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">{text}</p>
    </div>
  </div>
);

// ─── Suggestion chip ──────────────────────────────────────────────────────────

const SuggestionChip: React.FC<{ text: string; onAccept: () => void; onReject: () => void }> = ({
  text, onAccept, onReject,
}) => (
  <div className="flex items-start gap-2 px-3 py-2 rounded-[9px] bg-[#7C3AED]/08 border border-[#7C3AED]/20">
    <Sparkles className="w-3 h-3 text-[#9D6CFF] flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-slate-300 flex-1 leading-snug">{text}</p>
    <div className="flex gap-1 flex-shrink-0">
      <button type="button" onClick={onAccept}
        className="p-1 rounded-[6px] bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">
        <Check className="w-3 h-3" />
      </button>
      <button type="button" onClick={onReject}
        className="p-1 rounded-[6px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </div>
  </div>
);

// ─── Main block component ─────────────────────────────────────────────────────

interface ScriptBlockProps {
  block: ScriptBlock;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ScriptBlockItem: React.FC<ScriptBlockProps> = ({
  block, index, isSelected, onSelect,
}) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(block.suggestions ?? []);
  const typeCfg    = BLOCK_TYPE_CFG[block.type];
  const approvalCfg = APPROVAL_CFG[block.approvalStatus];

  const removeSuggestion = (i: number) =>
    setSuggestions(prev => prev.filter((_, idx) => idx !== i));

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.04, 0.3), ease: EASE }}
      onClick={() => onSelect(block.id)}
      className={`group relative rounded-[14px] border overflow-hidden cursor-pointer
        transition-all duration-200
        ${isSelected
          ? 'border-[#8B5CF6]/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
          : 'border-white/[0.07] hover:border-white/[0.15]'
        }`}
      style={{ background: isSelected ? 'rgba(124,58,237,0.05)' : '#10101A' }}
      aria-selected={isSelected}
    >
      {/* Left color bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-[14px]"
        style={{ background: typeCfg.leftBar }}
      />

      {/* AI-rewritten shimmer badge */}
      {block.aiRewritten && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="flex items-center gap-1 text-[9px] font-mono text-[#9D6CFF]
            px-1.5 py-0.5 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/25">
            <Sparkles className="w-2.5 h-2.5" />AI
          </span>
        </div>
      )}

      <div className="pl-4 pr-3 pt-3 pb-3 space-y-2.5">
        {/* Row 1: type badge + scene + approval + word count + duration */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold
              px-2 py-0.5 rounded-full border"
            style={{ color: typeCfg.text, background: typeCfg.bg, borderColor: typeCfg.border }}
          >
            {typeCfg.icon}
            {typeCfg.label}
          </span>

          <span className="text-[9px] font-mono text-slate-600">
            Scene {block.sceneNumber}
          </span>

          <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold
            px-1.5 py-0.5 rounded-full border ${approvalCfg.badge}`}>
            {approvalCfg.icon}
            {approvalCfg.label}
          </span>

          <span className="ml-auto text-[9px] font-mono text-slate-600 flex items-center gap-1">
            <Type className="w-2.5 h-2.5" />{block.wordCount}w
          </span>
          <span className="text-[9px] font-mono text-slate-600 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />{fmtSec(block.estimatedDurationSec)}
          </span>
        </div>

        {/* Speaker name (dialogue / interview) */}
        {block.speakerName && (
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest"
            style={{ color: typeCfg.text }}>
            {block.speakerName}
          </p>
        )}

        {/* Content */}
        <p className={`text-[13px] leading-relaxed
          ${block.type === 'visual-direction' || block.type === 'sound-direction'
            ? 'text-slate-500 italic'
            : block.type === 'editor-note'
            ? 'text-amber-300/70 font-mono text-[11px]'
            : block.type === 'on-screen-text'
            ? 'text-white font-display font-bold tracking-wide'
            : block.type === 'citation'
            ? 'text-slate-400 font-mono text-[11px]'
            : 'text-slate-200'
          }`}
        >
          {block.content}
        </p>

        {/* Claim validation strip */}
        {block.claimStatus && block.claimText && (
          <div
            className="flex items-start gap-2 px-2.5 py-2 rounded-[9px] border"
            style={{
              background: CLAIM_CFG[block.claimStatus].color + '10',
              borderColor: CLAIM_CFG[block.claimStatus].color + '30',
            }}
          >
            <span style={{ color: CLAIM_CFG[block.claimStatus].color }} className="flex-shrink-0 mt-0.5">
              {CLAIM_CFG[block.claimStatus].icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-mono font-semibold uppercase tracking-widest"
                  style={{ color: CLAIM_CFG[block.claimStatus].color }}>
                  {CLAIM_CFG[block.claimStatus].label}
                </span>
                {block.linkedSourceId && (
                  <span className="flex items-center gap-1 text-[9px] font-mono text-slate-600">
                    <Link2 className="w-2.5 h-2.5" />Source linked
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{block.claimText}</p>
            </div>
          </div>
        )}

        {/* Unverified claim warning */}
        {!block.claimStatus && (block.type === 'narration' || block.type === 'dialogue') && !block.linkedSourceId && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px]
            bg-amber-500/05 border border-amber-500/15">
            <AlertTriangle className="w-3 h-3 text-amber-500/70 flex-shrink-0" />
            <span className="text-[10px] font-mono text-amber-500/60">No source linked — claim unsupported</span>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-1.5">
            {suggestions.map((s, i) => (
              <SuggestionChip
                key={i}
                text={s}
                onAccept={() => removeSuggestion(i)}
                onReject={() => removeSuggestion(i)}
              />
            ))}
          </div>
        )}

        {/* Footer: comments toggle + version */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setCommentsOpen(o => !o); }}
            className={`flex items-center gap-1.5 text-[10px] font-mono transition-colors ${
              block.commentCount > 0
                ? 'text-amber-400/80 hover:text-amber-400'
                : 'text-slate-700 hover:text-slate-500'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            {block.commentCount > 0 ? `${block.commentCount} comment${block.commentCount > 1 ? 's' : ''}` : 'Comment'}
          </button>

          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-700">
            <RotateCcw className="w-2.5 h-2.5" />v{block.version}
            {block.approvalStatus === 'approved' && (
              <span className="flex items-center gap-1 text-emerald-600">
                <Eye className="w-2.5 h-2.5" />Approved
              </span>
            )}
          </div>
        </div>

        {/* Comments expansion */}
        <AnimatePresence>
          {commentsOpen && block.comments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="space-y-1.5 pt-1">
                {block.comments.map(c => (
                  <CommentBubble key={c.id} author={c.author} text={c.text} timestamp={c.timestamp} resolved={c.resolved} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};
