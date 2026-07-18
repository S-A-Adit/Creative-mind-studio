/**
 * PlatformCard.tsx — Premium platform card for the Distribution Room
 *
 * Shows all metadata for a single platform adaptation, readiness bar,
 * AI recommendations, and quick action buttons.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, ChevronDown, ChevronUp, Sparkles,
  FileText, Clock, AtSign,
} from 'lucide-react';
import type { PlatformAdaptation } from '../types';
import {
  StatusBadge,
  PlatformIcon,
  ReadinessBar,
  SectionLabel,
  ThumbnailStatusDot,
  MemberAvatar,
  InsightPill,
} from './DistributionShared';

// ─── Detail Row ───────────────────────────────────────────────────────────────

interface DetailRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, mono }) => (
  <div className="flex items-center justify-between gap-2 py-1.5 border-b border-white/[0.04] last:border-0">
    <SectionLabel>{label}</SectionLabel>
    <span
      className={`text-xs text-slate-300 text-right max-w-[60%] truncate ${mono ? 'font-mono' : ''}`}
    >
      {value}
    </span>
  </div>
);

// ─── Recommendations Popover ──────────────────────────────────────────────────

interface RecommendationsProps {
  recommendations: PlatformAdaptation['recommendations'];
}

const RecommendationsSection: React.FC<RecommendationsProps> = ({ recommendations }) => {
  if (recommendations.length === 0) return null;

  const pending = recommendations.filter(r => !r.applied);

  return (
    <div className="mt-3 pt-3 border-t border-white/[0.06]">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-[#9D6CFF]" />
        <SectionLabel>AI Recommendations</SectionLabel>
        {pending.length > 0 && (
          <span className="ml-auto text-[10px] font-mono font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">
            {pending.length} pending
          </span>
        )}
      </div>
      <div className="space-y-2">
        {recommendations.map(r => (
          <div
            key={r.id}
            className={`rounded-lg p-2.5 border ${
              r.applied
                ? 'bg-emerald-500/5 border-emerald-500/15'
                : 'bg-white/[0.02] border-white/[0.06]'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <span
                className={`text-xs font-medium ${r.applied ? 'text-emerald-400 line-through' : 'text-slate-200'}`}
              >
                {r.title}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!r.applied && <InsightPill priority={r.priority} />}
                {r.applied && (
                  <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Applied
                  </span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface PlatformCardProps {
  adaptation: PlatformAdaptation;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  adaptation: a,
  isSelected = false,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState(false);

  const charPct = Math.min(100, Math.round((a.currentCharacterCount / a.characterLimit) * 100));
  const charOver = a.currentCharacterCount > a.characterLimit;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={onSelect}
      className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/5 shadow-[0_0_24px_rgba(139,92,246,0.15)]'
          : 'border-white/[0.07] bg-[#151521]/60 hover:border-white/[0.15]'
      }`}
    >
      {/* ── Card Header ── */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <PlatformIcon platformId={a.platformId} iconName={a.icon} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-semibold text-sm text-white">
                {a.platformName}
              </span>
              {a.isLocked && (
                <span title="Locked"><Lock className="w-3 h-3 text-amber-400 flex-shrink-0" /></span>
              )}
            </div>
            <StatusBadge status={a.status} size="sm" />
          </div>
          {/* Assigned member */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <MemberAvatar
              initials={a.assignedToInitials}
              color={a.assignedToColor}
              name={a.assignedTo}
              size={26}
            />
          </div>
        </div>

        {/* Readiness */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <SectionLabel>Publication Readiness</SectionLabel>
            <SectionLabel>{a.readinessScore}%</SectionLabel>
          </div>
          <ReadinessBar score={a.readinessScore} size="sm" showLabel={false} />
        </div>
      </div>

      {/* ── Card Body (always visible) ── */}
      <div className="px-4 pb-3 border-t border-white/[0.05] pt-3">
        {/* Generated Title */}
        <div className="mb-2">
          <SectionLabel className="block mb-1">Generated Title</SectionLabel>
          <p className="text-sm text-slate-100 font-medium leading-snug line-clamp-2">
            {a.generatedTitle}
          </p>
        </div>

        {/* Hook */}
        <div className="mb-2">
          <SectionLabel className="block mb-1">Hook</SectionLabel>
          <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-2">
            {a.hook}
          </p>
        </div>

        {/* Char count indicator */}
        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
          <span className="text-slate-500">Character count</span>
          <span className={charOver ? 'text-rose-400 font-bold' : 'text-slate-400'}>
            {a.currentCharacterCount.toLocaleString()} / {a.characterLimit.toLocaleString()}
          </span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, charPct)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="h-full rounded-full"
            style={{ background: charOver ? '#EF4444' : '#8B5CF6' }}
          />
        </div>

        {/* Thumbnail + Duration row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-slate-500" />
            <SectionLabel>Thumbnail</SectionLabel>
            <ThumbnailStatusDot status={a.thumbnailStatus} />
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] font-mono text-slate-400">{a.estimatedDuration}</span>
            <span className="text-[11px] font-mono text-slate-600 mx-1">·</span>
            <AtSign className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] font-mono text-slate-400">{a.aspectRatio}</span>
          </div>
        </div>
      </div>

      {/* ── Expandable Detail ── */}
      <div className="border-t border-white/[0.05]">
        <button
          onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
          className="w-full px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          <span className="font-mono">
            {expanded ? 'Collapse details' : 'View details & CTA'}
          </span>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />
          }
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                {/* Description */}
                <div className="mb-3">
                  <SectionLabel className="block mb-1.5">Description</SectionLabel>
                  <p className="text-[12px] text-slate-400 leading-relaxed">{a.description}</p>
                </div>

                {/* Detail rows */}
                <div className="rounded-xl bg-white/[0.025] border border-white/[0.06] p-3 mb-3">
                  <DetailRow label="Assigned to" value={a.assignedTo} />
                  <DetailRow label="Last updated" value={new Date(a.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} mono />
                  <DetailRow label="CTA" value={a.cta} />
                  <DetailRow label="Format" value={a.aspectRatio} mono />
                  <DetailRow label="Duration" value={a.estimatedDuration} mono />
                </div>

                {/* Recommendations */}
                <RecommendationsSection
                  recommendations={a.recommendations}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
