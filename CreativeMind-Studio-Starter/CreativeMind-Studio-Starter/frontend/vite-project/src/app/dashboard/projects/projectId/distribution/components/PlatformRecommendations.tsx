/**
 * PlatformRecommendations.tsx — AI recommendation insight cards
 *
 * Aggregated view of all AI recommendations across all platforms,
 * grouped by platform with premium insight card design.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, CheckCircle2, ChevronDown, ChevronUp, TrendingUp,
  Zap, AlertCircle,
} from 'lucide-react';
import { PLATFORM_ADAPTATIONS } from '../mockData';
import type { PlatformAdaptation, AIRecommendation } from '../types';
import {
  PlatformIcon, SectionLabel, InsightPill, MemberAvatar,
} from './DistributionShared';

// ─── Single Recommendation Card ───────────────────────────────────────────────

interface RecCardProps {
  rec: AIRecommendation;
  onToggleApplied?: () => void;
}

const RecCard: React.FC<RecCardProps> = ({ rec }) => {
  const typeIcons: Record<string, React.ElementType> = {
    seo: TrendingUp,
    engagement: Zap,
    format: Sparkles,
    tone: Sparkles,
    structure: Sparkles,
    pacing: Zap,
  };
  const Icon = typeIcons[rec.type] ?? Sparkles;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border p-3 transition-all ${
        rec.applied
          ? 'border-emerald-500/15 bg-emerald-500/[0.04]'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
            rec.applied ? 'bg-emerald-500/10' : 'bg-white/[0.05]'
          }`}
        >
          {rec.applied ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Icon className="w-3.5 h-3.5 text-[#9D6CFF]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span
              className={`text-xs font-medium ${
                rec.applied ? 'text-slate-500 line-through' : 'text-slate-200'
              }`}
            >
              {rec.title}
            </span>
            {!rec.applied && <InsightPill priority={rec.priority} />}
            {rec.applied && (
              <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ✓ Applied
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">{rec.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Platform Group ───────────────────────────────────────────────────────────

interface PlatformGroupProps {
  adaptation: PlatformAdaptation;
  defaultOpen?: boolean;
}

const PlatformGroup: React.FC<PlatformGroupProps> = ({ adaptation, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const pending = adaptation.recommendations.filter(r => !r.applied);
  const total = adaptation.recommendations.length;

  if (total === 0) return null;

  return (
    <motion.div
      layout
      className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#151521]/60"
    >
      {/* Group header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors text-left"
      >
        <PlatformIcon platformId={adaptation.platformId} iconName={adaptation.icon} size={36} />
        <div className="flex-1 min-w-0">
          <span className="font-display font-semibold text-sm text-white">
            {adaptation.platformName}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-500">
              {total} recommendation{total !== 1 ? 's' : ''}
            </span>
            {pending.length > 0 && (
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                {pending.length} pending
              </span>
            )}
            {pending.length === 0 && total > 0 && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                All applied
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <MemberAvatar
            initials={adaptation.assignedToInitials}
            color={adaptation.assignedToColor}
            name={adaptation.assignedTo}
            size={24}
          />
          {open
            ? <ChevronUp className="w-4 h-4 text-slate-500" />
            : <ChevronDown className="w-4 h-4 text-slate-500" />
          }
        </div>
      </button>

      {/* Recommendations list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="recs"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-white/[0.05] pt-3">
              {adaptation.recommendations.map(rec => (
                <RecCard key={rec.id} rec={rec} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const PlatformRecommendations: React.FC = () => {
  const totalPending = PLATFORM_ADAPTATIONS.reduce(
    (sum, a) => sum + a.recommendations.filter(r => !r.applied).length,
    0
  );
  const totalApplied = PLATFORM_ADAPTATIONS.reduce(
    (sum, a) => sum + a.recommendations.filter(r => r.applied).length,
    0
  );
  const total = totalPending + totalApplied;

  const platformsWithRecs = PLATFORM_ADAPTATIONS.filter(a => a.recommendations.length > 0);
  const sorted = [...platformsWithRecs].sort(
    (a, b) =>
      b.recommendations.filter(r => !r.applied).length -
      a.recommendations.filter(r => !r.applied).length
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0B0B12]">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#9D6CFF]" />
          <h3 className="font-display font-semibold text-white text-base">
            AI Recommendations
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Suggestions to optimize each platform adaptation for maximum reach and engagement.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: total, color: '#94A3B8' },
            { label: 'Pending', value: totalPending, color: '#F59E0B', Icon: AlertCircle },
            { label: 'Applied', value: totalApplied, color: '#10B981', Icon: CheckCircle2 },
          ].map(({ label, value, color, Icon }) => (
            <div
              key={label}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center"
            >
              {Icon && (
                <div className="flex justify-center mb-1">
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
              )}
              <div className="text-lg font-display font-bold" style={{ color }}>
                {value}
              </div>
              <SectionLabel>{label}</SectionLabel>
            </div>
          ))}
        </div>
      </div>

      {/* Platform groups */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {sorted.map((adaptation, i) => (
          <PlatformGroup
            key={adaptation.id}
            adaptation={adaptation}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );
};
