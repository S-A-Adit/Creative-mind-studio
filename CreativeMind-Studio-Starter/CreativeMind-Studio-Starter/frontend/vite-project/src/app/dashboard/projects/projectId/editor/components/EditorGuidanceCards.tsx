/**
 * EditorGuidanceCards.tsx — AI Production Guidance Cards
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Video, Palette, Type, Volume2, Layers, Film,
  ChevronDown, ChevronUp, Clock, TrendingUp, Gauge, Sparkles
} from 'lucide-react';
import type { GuidanceCard } from '../mockData';
import { EDITOR_GUIDANCE } from '../mockData';

const ICON_MAP: Record<string, React.ElementType> = {
  zap: Zap,
  video: Video,
  palette: Palette,
  type: Type,
  'volume-2': Volume2,
  layers: Layers,
  film: Film,
};

const DIFFICULTY_COLORS = {
  Easy:     { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  Moderate: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  Advanced: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
};

const CATEGORY_COLORS: Record<string, string> = {
  Transition:       '#8B5CF6',
  'Camera Movement': '#3B82F6',
  'Color Grade':    '#EC4899',
  Typography:       '#F59E0B',
  'Sound Design':   '#06B6D4',
  'Motion Graphics': '#10B981',
  'B-roll':         '#F97316',
};

// ─── Single Guidance Card ─────────────────────────────────────────────────────

interface GuidanceCardItemProps {
  card: GuidanceCard;
  index: number;
}

const GuidanceCardItem: React.FC<GuidanceCardItemProps> = ({ card, index }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[card.icon] ?? Sparkles;
  const diff = DIFFICULTY_COLORS[card.difficulty];
  const catColor = CATEGORY_COLORS[card.category] ?? '#8B5CF6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="rounded-xl border border-white/8 bg-[#151521] hover:border-white/12 transition-colors overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-0.5 w-full" style={{ background: catColor }} />

      <div className="p-3.5">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${catColor}18`, border: `1px solid ${catColor}30` }}
            >
              <Icon size={14} style={{ color: catColor }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                  style={{ color: catColor, background: `${catColor}15` }}
                >
                  {card.category}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-[#F8FAFC] leading-tight">{card.title}</h4>
            </div>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors mt-1 flex-shrink-0"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Suggestion */}
        <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-2.5">
          {card.suggestion}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
            style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.color}30` }}
          >
            <Gauge size={9} />
            {card.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]">
            <Clock size={9} />
            {card.timeEstimate}
          </span>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-white/5 space-y-2.5">
                {/* Why Suggested */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={10} className="text-[#8B5CF6]" />
                    <span className="text-[10px] font-semibold text-[#8B5CF6] uppercase tracking-wide">Why Suggested</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">{card.whySuggested}</p>
                </div>

                {/* Expected Impact */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp size={10} className="text-[#10B981]" />
                    <span className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wide">Expected Impact</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1] leading-relaxed">{card.expectedImpact}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Main EditorGuidanceCards ─────────────────────────────────────────────────

interface EditorGuidanceCardsProps {
  compact?: boolean;
}

export const EditorGuidanceCards: React.FC<EditorGuidanceCardsProps> = ({ compact = false }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(EDITOR_GUIDANCE.map(g => g.category)))];

  const filtered = activeCategory === 'All'
    ? EDITOR_GUIDANCE
    : EDITOR_GUIDANCE.filter(g => g.category === activeCategory);

  return (
    <div>
      {!compact && (
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[#8B5CF6]" />
          <h3 className="text-sm font-bold text-[#F8FAFC] font-display">AI Production Guidance</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/25 font-mono">
            {filtered.length} suggestions
          </span>
        </div>
      )}

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {categories.map(cat => {
          const color = cat === 'All' ? '#8B5CF6' : (CATEGORY_COLORS[cat] ?? '#8B5CF6');
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-150 ${
                activeCategory === cat
                  ? 'text-white border'
                  : 'text-[#94A3B8] border border-white/8 hover:border-white/15'
              }`}
              style={
                activeCategory === cat
                  ? { color, background: `${color}20`, borderColor: `${color}40` }
                  : {}
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filtered.map((card, idx) => (
            <GuidanceCardItem key={card.id} card={card} index={idx} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
