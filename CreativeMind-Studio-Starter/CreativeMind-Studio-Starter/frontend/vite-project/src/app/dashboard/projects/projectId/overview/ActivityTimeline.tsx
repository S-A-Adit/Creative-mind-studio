/**
 * ActivityTimeline.tsx — Project-specific activity feed with vertical timeline.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  BookOpen,
  FileText,
  CheckSquare,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Upload,
  Bot,
  ArrowRight,
} from 'lucide-react';
import type { TimelineActivity, ActivityCategory } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  CheckCircle2:  <CheckCircle2 className="w-3.5 h-3.5" />,
  BookOpen:      <BookOpen className="w-3.5 h-3.5" />,
  FileText:      <FileText className="w-3.5 h-3.5" />,
  CheckSquare:   <CheckSquare className="w-3.5 h-3.5" />,
  AlertTriangle: <AlertTriangle className="w-3.5 h-3.5" />,
  Calendar:      <Calendar className="w-3.5 h-3.5" />,
  TrendingUp:    <TrendingUp className="w-3.5 h-3.5" />,
  Upload:        <Upload className="w-3.5 h-3.5" />,
};

const CAT_COLORS: Record<ActivityCategory, string> = {
  strategy:     '#7C3AED',
  research:     '#06B6D4',
  script:       '#10B981',
  asset:        '#F59E0B',
  review:       '#3B82F6',
  distribution: '#EC4899',
  ai:           '#8B5CF6',
  team:         '#94A3B8',
};

// ─── Single row ───────────────────────────────────────────────────────────────

const TimelineRow: React.FC<{ item: TimelineActivity; index: number; isLast: boolean }> = ({
  item,
  index,
  isLast,
}) => {
  const catColor = CAT_COLORS[item.category];
  const icon = ICON_MAP[item.iconName] ?? <CheckCircle2 className="w-3.5 h-3.5" />;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: ease.gentle }}
      className="flex gap-4"
    >
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Icon dot */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center border flex-shrink-0 z-10"
          style={{
            background: `linear-gradient(135deg, ${catColor}28, ${catColor}10)`,
            borderColor: `${catColor}${item.actorType === 'ai' ? '45' : '28'}`,
            borderStyle: item.actorType === 'ai' ? 'dashed' : 'solid',
            color: catColor,
          }}
        >
          {item.actorType === 'ai' ? <Bot className="w-3.5 h-3.5" /> : icon}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div className="w-px flex-1 mt-1 mb-0" style={{ background: `${catColor}20` }} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-5'}`}>
        <div className="group flex items-start gap-2 py-1 rounded-xl transition-colors duration-150 hover:bg-white/[0.02]">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] leading-snug">
              <span className="font-semibold text-white">{item.actor}</span>{' '}
              <span className="text-slate-400">{item.action}</span>{' '}
              <span className="font-medium" style={{ color: catColor }}>{item.target}</span>
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-600 font-mono">{timeAgo(item.timestamp)}</span>
              <span
                className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border"
                style={{ color: catColor, backgroundColor: `${catColor}10`, borderColor: `${catColor}25` }}
              >
                {item.category}
              </span>
              {item.actorType === 'ai' && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#9D6CFF]">
                  AI
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ActivityTimelineProps {
  items: TimelineActivity[];
  maxVisible?: number;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  items,
  maxVisible = 6,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const visible = useMemo(
    () => (expanded ? items : items.slice(0, maxVisible)),
    [items, expanded, maxVisible]
  );

  return (
    <section aria-label="Project activity timeline">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
            Activity Timeline
          </h2>
          <p className="text-[12px] text-slate-500 font-mono mt-0.5">
            {items.length} events this project
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-emerald-400 font-mono">Live</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/70 backdrop-blur-sm p-5 md:p-6">
        <div>
          {visible.map((item, i) => (
            <TimelineRow
              key={item.id}
              item={item}
              index={i}
              isLast={i === visible.length - 1}
            />
          ))}
        </div>

        {items.length > maxVisible && (
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl
              border border-white/[0.06] text-[12px] text-slate-500
              hover:text-slate-300 hover:border-white/[0.1] hover:bg-white/[0.02]
              transition-all duration-200"
          >
            {expanded ? 'Show less' : `Show ${items.length - maxVisible} more`}
            <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
    </section>
  );
};
