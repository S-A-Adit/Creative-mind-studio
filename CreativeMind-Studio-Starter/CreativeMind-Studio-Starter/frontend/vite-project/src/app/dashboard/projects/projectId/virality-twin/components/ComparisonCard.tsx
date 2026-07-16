/**
 * ComparisonCard.tsx + TwinComparison.tsx
 *
 * ComparisonCard  — single concept / success / failure content card
 * TwinComparison  — three-column layout wrapping all three cards
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Monitor,
  Clock,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import type { ContentCard, CardType, SuccessLevel } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Success level config ─────────────────────────────────────────────────────

const SUCCESS_CFG: Record<SuccessLevel, {
  label: string;
  badge: string;
  icon: React.ReactNode;
  glow: string;
}> = {
  viral:          { label: 'Viral',           badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: <Sparkles className="w-3 h-3" />,      glow: 'rgba(16,185,129,0.12)'  },
  high:           { label: 'High Performer',  badge: 'text-blue-400   bg-blue-500/10    border-blue-500/25',    icon: <TrendingUp className="w-3 h-3" />,     glow: 'rgba(59,130,246,0.10)'  },
  average:        { label: 'Average',         badge: 'text-slate-400  bg-slate-500/10   border-slate-500/20',   icon: <Minus className="w-3 h-3" />,          glow: 'transparent'            },
  underperformed: { label: 'Underperformed',  badge: 'text-amber-400  bg-amber-500/10   border-amber-500/25',   icon: <TrendingDown className="w-3 h-3" />,   glow: 'rgba(245,158,11,0.08)'  },
  failed:         { label: 'Failed',          badge: 'text-red-400    bg-red-500/10     border-red-500/25',     icon: <AlertTriangle className="w-3 h-3" />,  glow: 'rgba(239,68,68,0.08)'   },
};

const CARD_TYPE_CFG: Record<CardType, {
  headerLabel: string;
  headerColor: string;
  borderColor: string;
  accentLine: string;
}> = {
  concept: {
    headerLabel: 'Your Concept',
    headerColor: '#8B5CF6',
    borderColor: 'rgba(139,92,246,0.25)',
    accentLine:  'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)',
  },
  success: {
    headerLabel: 'Closest Successful Twin',
    headerColor: '#10B981',
    borderColor: 'rgba(16,185,129,0.20)',
    accentLine:  'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)',
  },
  failure: {
    headerLabel: 'Closest Failed Twin',
    headerColor: '#EF4444',
    borderColor: 'rgba(239,68,68,0.18)',
    accentLine:  'linear-gradient(90deg, transparent, rgba(239,68,68,0.45), transparent)',
  },
};

// ─── Meta row ─────────────────────────────────────────────────────────────────

const MetaRow: React.FC<{ icon: React.ReactNode; value: string }> = ({ icon, value }) => (
  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
    <span className="text-slate-700 flex-shrink-0">{icon}</span>
    <span className="truncate">{value}</span>
  </div>
);

// ─── ComparisonCard ───────────────────────────────────────────────────────────

interface ComparisonCardProps {
  card: ContentCard;
  index: number;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ card, index }) => {
  const typeCfg    = CARD_TYPE_CFG[card.type];
  const successCfg = SUCCESS_CFG[card.successLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-200"
      style={{
        borderColor: typeCfg.borderColor,
        background: '#10101A',
        boxShadow: `0 0 28px ${successCfg.glow}`,
      }}
      role="article"
      aria-label={`${typeCfg.headerLabel}: ${card.title}`}
    >
      {/* Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: typeCfg.accentLine }} />

      {/* Card type label */}
      <div
        className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between"
        style={{ background: typeCfg.headerColor + '10' }}
      >
        <span
          className="text-[10px] font-mono font-bold uppercase tracking-widest"
          style={{ color: typeCfg.headerColor }}
        >
          {typeCfg.headerLabel}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${successCfg.badge}`}>
          {successCfg.icon}
          {successCfg.label}
        </span>
      </div>

      {/* Thumbnail */}
      <div className={`relative h-36 bg-gradient-to-br ${card.thumbnailGradient} flex items-center justify-center overflow-hidden`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        {/* Play button */}
        <motion.div
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 0.18 }}
          className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm
            border border-white/30 flex items-center justify-center"
        >
          <Play className="w-5 h-5 text-white fill-white/70 ml-0.5" />
        </motion.div>
        {/* Views badge */}
        {card.views && (
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5
            px-2 py-0.5 rounded-full bg-black/60 border border-white/10
            text-[10px] font-mono text-white font-semibold backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            {card.views} views
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Title */}
        <h3 className="font-display font-semibold text-[14px] text-slate-100 leading-snug line-clamp-2">
          {card.title}
        </h3>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <MetaRow icon={<Monitor className="w-3 h-3" />}  value={card.platform.charAt(0).toUpperCase() + card.platform.slice(1)} />
          <MetaRow icon={<Clock className="w-3 h-3" />}    value={card.duration} />
          <MetaRow icon={<Calendar className="w-3 h-3" />} value={card.publishDate} />
          <MetaRow icon={<Users className="w-3 h-3" />}    value={card.audienceType.split('·')[0].trim()} />
        </div>

        {/* Channel + engagement */}
        <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between gap-2">
          {card.channel && (
            <span className="text-[11px] text-slate-500 font-mono truncate">@{card.channel}</span>
          )}
          {card.engagementRate !== undefined && (
            <span
              className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ml-auto"
              style={{
                color: typeCfg.headerColor,
                background: typeCfg.headerColor + '15',
                borderColor: typeCfg.headerColor + '30',
              }}
            >
              <Star className="w-2.5 h-2.5" />
              {card.engagementRate}% eng.
            </span>
          )}
          {card.type === 'concept' && (
            <span className="text-[10px] font-mono text-slate-600 italic ml-auto">Pre-production</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── TwinComparison ───────────────────────────────────────────────────────────

interface TwinComparisonProps {
  conceptCard: ContentCard;
  successCard: ContentCard;
  failureCard: ContentCard;
}

export const TwinComparison: React.FC<TwinComparisonProps> = ({
  conceptCard,
  successCard,
  failureCard,
}) => (
  <section aria-label="Virality twin comparison">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ComparisonCard card={conceptCard} index={0} />

      {/* VS divider (desktop) */}
      <div className="hidden md:flex flex-col">
        <ComparisonCard card={successCard} index={1} />
      </div>

      <div className="hidden md:flex flex-col">
        <ComparisonCard card={failureCard} index={2} />
      </div>

      {/* Mobile: show all stacked */}
      <div className="md:hidden">
        <ComparisonCard card={successCard} index={1} />
      </div>
      <div className="md:hidden">
        <ComparisonCard card={failureCard} index={2} />
      </div>
    </div>
  </section>
);
