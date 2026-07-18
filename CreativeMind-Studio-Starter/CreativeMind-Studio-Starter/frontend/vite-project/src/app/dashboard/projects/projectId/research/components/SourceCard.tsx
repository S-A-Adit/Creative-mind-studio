/**
 * SourceCard.tsx — Premium source evidence cards with full metadata.
 *
 * Includes: source type badge, verification status, confidence / freshness
 * bars, assigned researcher, quotation, and quick-action buttons.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Quote,
  FileText,
  User,
  Calendar,
  BarChart2,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  AlertOctagon,
  ChevronDown,
  Bot,
  Link2,
  Zap,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import type {
  SourceCard as SourceCardType,
  SourceType,
  SourceTier,
  VerificationStatus,
} from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Source type config ───────────────────────────────────────────────────────

const SOURCE_TYPE_CFG: Record<SourceType, { label: string; cls: string }> = {
  'government':     { label: 'Government',     cls: 'text-blue-400    bg-blue-500/10    border-blue-500/25'    },
  'academic':       { label: 'Academic',       cls: 'text-violet-400  bg-violet-500/10  border-violet-500/25'  },
  'institutional':  { label: 'Institutional',  cls: 'text-cyan-400    bg-cyan-500/10    border-cyan-500/25'    },
  'news':           { label: 'News',           cls: 'text-amber-400   bg-amber-500/10   border-amber-500/25'   },
  'interview':      { label: 'Interview',      cls: 'text-pink-400    bg-pink-500/10    border-pink-500/25'    },
  'dataset':        { label: 'Dataset',        cls: 'text-teal-400    bg-teal-500/10    border-teal-500/25'    },
  'company-report': { label: 'Company Report', cls: 'text-orange-400  bg-orange-500/10  border-orange-500/25'  },
  'archive':        { label: 'Archive',        cls: 'text-slate-400   bg-slate-500/10   border-slate-500/20'   },
  'social-post':    { label: 'Social Post',    cls: 'text-rose-400    bg-rose-500/10    border-rose-500/25'    },
};

// ─── Verification status config ───────────────────────────────────────────────

const VERIFICATION_CFG: Record<VerificationStatus, {
  label: string;
  badge: string;
  icon: React.ReactNode;
  borderColor: string;
}> = {
  'verified':            { label: 'Verified',            icon: <CheckCircle2 className="w-3 h-3" />,  badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', borderColor: 'rgba(16,185,129,0.20)' },
  'partially-supported': { label: 'Partially Supported', icon: <AlertTriangle className="w-3 h-3" />, badge: 'text-amber-400   bg-amber-500/10   border-amber-500/25',   borderColor: 'rgba(245,158,11,0.20)' },
  'contested':           { label: 'Contested',           icon: <AlertOctagon className="w-3 h-3" />,  badge: 'text-orange-400  bg-orange-500/10  border-orange-500/25',  borderColor: 'rgba(249,115,22,0.20)' },
  'outdated':            { label: 'Outdated',            icon: <Clock className="w-3 h-3" />,         badge: 'text-slate-400   bg-slate-500/10   border-slate-500/20',   borderColor: 'rgba(100,116,139,0.20)'},
  'unverified':          { label: 'Unverified',          icon: <HelpCircle className="w-3 h-3" />,    badge: 'text-yellow-400  bg-yellow-500/10  border-yellow-500/25',  borderColor: 'rgba(234,179,8,0.18)'  },
  'rejected':            { label: 'Rejected',            icon: <XCircle className="w-3 h-3" />,       badge: 'text-red-400     bg-red-500/10     border-red-500/25',     borderColor: 'rgba(239,68,68,0.18)'  },
};

// ─── Tier badge ───────────────────────────────────────────────────────────────

const TierBadge: React.FC<{ tier: SourceTier }> = ({ tier }) => (
  <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest
    px-2 py-0.5 rounded-full border flex-shrink-0 ${
      tier === 'primary'
        ? 'text-[#9D6CFF] bg-[#7C3AED]/10 border-[#7C3AED]/30'
        : 'text-slate-400 bg-slate-500/08 border-slate-500/20'
    }`}>
    {tier === 'primary'
      ? <ShieldCheck className="w-2.5 h-2.5" />
      : <ShieldAlert className="w-2.5 h-2.5" />
    }
    {tier} source
  </span>
);

// ─── Score bar ────────────────────────────────────────────────────────────────

const ScoreBar: React.FC<{
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}> = ({ label, value, color, icon }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-[9px] font-mono text-slate-600">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <span className="text-[10px] font-mono font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
    <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, ease: EASE }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

// ─── Public component ─────────────────────────────────────────────────────────

interface SourceCardProps {
  source: SourceCardType;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const SourceCardItem: React.FC<SourceCardProps> = ({
  source,
  isSelected = false,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState(false);
  const typeCfg  = SOURCE_TYPE_CFG[source.sourceType];
  const verifCfg = VERIFICATION_CFG[source.verificationStatus];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={() => onSelect?.(source.id)}
      className="relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        borderColor: isSelected ? '#8B5CF6' : verifCfg.borderColor,
        background: '#10101A',
        boxShadow: isSelected ? '0 0 0 2px rgba(139,92,246,0.25)' : undefined,
      }}
      aria-selected={isSelected}
    >
      {/* Gradient accent strip */}
      <div className={`h-1 bg-gradient-to-r ${source.thumbnailGradient}`} />

      <div className="p-4 space-y-3">
        {/* Row 1: type + tier + verification */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center text-[9px] font-mono font-semibold
            px-2 py-0.5 rounded-full border ${typeCfg.cls}`}>
            {typeCfg.label}
          </span>
          <TierBadge tier={source.tier} />
          <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold
            px-2 py-0.5 rounded-full border ml-auto ${verifCfg.badge}`}>
            {verifCfg.icon}
            {verifCfg.label}
          </span>
        </div>

        {/* Row 2: title */}
        <h3 className="font-display font-semibold text-[13px] text-slate-100 leading-snug">
          {source.title}
        </h3>

        {/* Row 3: publisher / author / date */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {[
            { icon: <BookOpen className="w-3 h-3" />,  value: source.publisher },
            { icon: <User className="w-3 h-3" />,      value: source.author.split(',')[0] },
            { icon: <Calendar className="w-3 h-3" />,  value: source.publicationDate },
            ...(source.reportPage
              ? [{ icon: <FileText className="w-3 h-3" />, value: `${source.reportPage}` }]
              : []),
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 truncate">
              <span className="text-slate-700 flex-shrink-0">{row.icon}</span>
              <span className="truncate">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Row 4: quotation */}
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-[10px]
          bg-white/[0.03] border border-white/[0.06]">
          <Quote className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-3">
            "{source.relevantQuotation}"
          </p>
        </div>

        {/* Row 5: confidence + freshness */}
        <div className="grid grid-cols-2 gap-3">
          <ScoreBar
            label="Confidence"
            value={source.confidenceScore}
            color="#8B5CF6"
            icon={<BarChart2 className="w-3 h-3" />}
          />
          <ScoreBar
            label="Freshness"
            value={source.freshnessScore}
            color="#06B6D4"
            icon={<Zap className="w-3 h-3" />}
          />
        </div>

        {/* Row 6: researcher + URL */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            {source.assignedResearcher.isAi
              ? <Bot className="w-3 h-3 text-slate-600" />
              : <User className="w-3 h-3 text-slate-600" />
            }
            <span
              className="font-semibold"
              style={{ color: source.assignedResearcher.color }}
            >
              {source.assignedResearcher.name}
            </span>
          </div>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-[10px] font-mono text-slate-600
              hover:text-[#8B5CF6] transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Source</span>
          </a>
        </div>

        {/* Expand toggle for notes + refs */}
        {(source.notes || source.figureOrTableRef) && (
          <>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}
              className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600
                hover:text-slate-400 transition-colors"
            >
              {expanded ? <ChevronDown className="w-3 h-3 rotate-180" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Hide' : 'Show'} notes &amp; references
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-1">
                    {source.figureOrTableRef && (
                      <div className="flex items-start gap-1.5 text-[10px] font-mono text-slate-500">
                        <Link2 className="w-3 h-3 flex-shrink-0 mt-0.5 text-slate-700" />
                        <span>{source.figureOrTableRef}</span>
                      </div>
                    )}
                    {source.notes && (
                      <div className="flex items-start gap-1.5 px-2.5 py-2 rounded-[8px]
                        bg-amber-500/05 border border-amber-500/15">
                        <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-300/70 leading-relaxed">{source.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.article>
  );
};

// ─── Source grid ──────────────────────────────────────────────────────────────

interface SourceGridProps {
  sources: SourceCardType[];
  selectedSourceId: string | null;
  onSelectSource: (id: string) => void;
}

export const SourceGrid: React.FC<SourceGridProps> = ({
  sources,
  selectedSourceId,
  onSelectSource,
}) => (
  <div className="space-y-3">
    {sources.map(source => (
      <SourceCardItem
        key={source.id}
        source={source}
        isSelected={source.id === selectedSourceId}
        onSelect={onSelectSource}
      />
    ))}
  </div>
);

// ─── Filter bar for sources ───────────────────────────────────────────────────

type FilterValue = VerificationStatus | SourceType | 'all';

interface SourceFilterBarProps {
  sources: SourceCardType[];
  activeFilter: FilterValue;
  onFilterChange: (f: FilterValue) => void;
}

export const SourceFilterBar: React.FC<SourceFilterBarProps> = ({
  sources,
  activeFilter,
  onFilterChange,
}) => {
  const FILTERS: Array<{ value: FilterValue; label: string }> = [
    { value: 'all',                 label: `All (${sources.length})` },
    { value: 'verified',            label: `Verified (${sources.filter(s => s.verificationStatus === 'verified').length})` },
    { value: 'unverified',          label: `Unverified (${sources.filter(s => s.verificationStatus === 'unverified').length})` },
    { value: 'needs-verification' as FilterValue, label: `Needs Check (${sources.filter(s => s.verificationStatus === 'partially-supported' || s.verificationStatus === 'contested').length})` },
    { value: 'outdated',            label: `Outdated (${sources.filter(s => s.verificationStatus === 'outdated').length})` },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
      {FILTERS.map(f => (
        <button
          key={f.value}
          type="button"
          onClick={() => onFilterChange(f.value)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-[8px] text-[11px] font-mono transition-all duration-150 ${
            activeFilter === f.value
              ? 'bg-[#7C3AED]/20 text-[#9D6CFF] border border-[#7C3AED]/40'
              : 'bg-white/[0.04] text-slate-500 border border-white/[0.07] hover:border-white/[0.14]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};
