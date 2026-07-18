/**
 * AlternativesPanel.tsx — AI-suggested alternatives for the selected asset.
 * Shows free options, AI generation, motion-graphic stubs, and original-filming suggestions.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Film,
  Image,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Info,
} from 'lucide-react';
import type { AlternativeOption, AlternativeType } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Alt type config ──────────────────────────────────────────────────────────

const ALT_TYPE_CFG: Record<AlternativeType, {
  icon: React.ReactNode;
  label: string;
  color: string;
}> = {
  'free-asset':       { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Free Asset',       color: '#10B981' },
  'premium-asset':    { icon: <DollarSign className="w-3.5 h-3.5" />,   label: 'Premium Asset',    color: '#F59E0B' },
  'ai-generation':    { icon: <Sparkles className="w-3.5 h-3.5" />,     label: 'AI Generation',    color: '#8B5CF6' },
  'motion-graphic':   { icon: <Zap className="w-3.5 h-3.5" />,          label: 'Motion Graphic',   color: '#3B82F6' },
  'original-filming': { icon: <Film className="w-3.5 h-3.5" />,         label: 'Original Filming', color: '#EC4899' },
};

const COST_COLOR: Record<string, string> = {
  free:   '#10B981',
  low:    '#84CC16',
  medium: '#F59E0B',
  high:   '#EF4444',
};

const QUALITY_COLOR: Record<string, string> = {
  excellent: '#10B981',
  good:      '#3B82F6',
  fair:      '#F59E0B',
};

// ─── Alternative card ─────────────────────────────────────────────────────────

const AltCard: React.FC<{
  option: AlternativeOption;
  index: number;
}> = ({ option, index }) => {
  const typeCfg = ALT_TYPE_CFG[option.type];
  const costColor = COST_COLOR[option.costLevel] ?? '#6B7280';
  const qualityColor = QUALITY_COLOR[option.estimatedQuality] ?? '#6B7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE, delay: index * 0.05 }}
      whileHover={{ y: -1 }}
      className="group rounded-[14px] border border-white/[0.08] bg-[#10101A]
        hover:border-white/[0.18] transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Thumbnail strip */}
      <div className={`h-16 bg-gradient-to-br ${option.thumbnailGradient}
        flex items-center justify-center relative`}>
        <Image className="w-5 h-5 text-white/20" />
        {/* Type badge */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5
            rounded-full text-[9px] font-mono font-semibold border"
          style={{
            color: typeCfg.color,
            background: typeCfg.color + '15',
            borderColor: typeCfg.color + '30',
          }}
        >
          {typeCfg.icon}
          {typeCfg.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-[12px] font-semibold text-slate-200 leading-tight mb-1">{option.label}</p>
        <p className="text-[10px] font-mono text-slate-500 leading-relaxed mb-3">{option.description}</p>

        {/* Quality + cost row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-slate-600">Quality:</span>
            <span
              className="text-[10px] font-mono font-semibold capitalize"
              style={{ color: qualityColor }}
            >
              {option.estimatedQuality}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-slate-600">Cost:</span>
            <span
              className="text-[10px] font-mono font-semibold capitalize"
              style={{ color: costColor }}
            >
              {option.costLabel}
            </span>
          </div>
        </div>

        {/* Use case */}
        <div className="flex items-start gap-1.5 px-2.5 py-2 rounded-[8px]
          bg-white/[0.03] border border-white/[0.06]">
          <Info className="w-3 h-3 text-slate-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
            {option.recommendedUseCase}
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 mt-3 py-1.5
            rounded-[8px] bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono
            text-slate-400 hover:bg-[#7C3AED]/10 hover:border-[#7C3AED]/30 hover:text-[#9D6CFF]
            transition-all duration-150 group-hover:border-white/[0.12]"
        >
          Use This Alternative
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface AlternativesPanelProps {
  alternatives: AlternativeOption[];
  selectedAssetTitle: string | null;
}

export const AlternativesPanel: React.FC<AlternativesPanelProps> = ({
  alternatives,
  selectedAssetTitle,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0B0B12] border-l border-white/[0.06] overflow-y-auto">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <Sparkles className="w-4 h-4 text-[#9D6CFF]" />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-mono font-semibold text-slate-200">Alternatives</p>
          {selectedAssetTitle && (
            <p className="text-[10px] font-mono text-slate-600 truncate mt-0.5">
              For: {selectedAssetTitle}
            </p>
          )}
        </div>
        <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded-full
          bg-white/[0.04] border border-white/[0.08] flex-shrink-0">
          {alternatives.length}
        </span>
      </div>

      {/* AI note */}
      <div className="mx-4 mt-3 px-3 py-2 rounded-[10px] bg-[#7C3AED]/08 border border-[#7C3AED]/20">
        <div className="flex items-start gap-2">
          <Sparkles className="w-3 h-3 text-[#9D6CFF] mt-0.5 flex-shrink-0" />
          <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
            AI-suggested alternatives based on scene context, budget, and production timeline.
            <span className="text-[#9D6CFF]"> Simulated suggestions.</span>
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {alternatives.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-[11px] font-mono text-slate-600 text-center">
                Select an asset to see<br />AI-suggested alternatives
              </p>
            </motion.div>
          ) : (
            alternatives.map((alt, i) => (
              <AltCard key={alt.id} option={alt} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
