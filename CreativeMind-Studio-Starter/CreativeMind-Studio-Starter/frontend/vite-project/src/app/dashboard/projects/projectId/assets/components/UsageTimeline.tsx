/**
 * UsageTimeline.tsx — Horizontal timeline of asset lifecycle events.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Link2,
  CheckCircle2,
  Film,
  Share2,
  Clock,
} from 'lucide-react';
import type { TimelineEvent, TimelineEventType } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Event config ─────────────────────────────────────────────────────────────

const EVENT_CFG: Record<TimelineEventType, {
  icon: React.ReactNode;
  color: string;
  bg: string;
}> = {
  uploaded: {
    icon: <Upload className="w-3 h-3" />,
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.15)',
  },
  assigned: {
    icon: <Link2 className="w-3 h-3" />,
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.15)',
  },
  approved: {
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.15)',
  },
  used: {
    icon: <Film className="w-3 h-3" />,
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.15)',
  },
  exported: {
    icon: <Share2 className="w-3 h-3" />,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.15)',
  },
};

// ─── Event node ───────────────────────────────────────────────────────────────

const EventNode: React.FC<{
  event: TimelineEvent;
  index: number;
  isLast: boolean;
}> = ({ event, index, isLast }) => {
  const cfg = EVENT_CFG[event.eventType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE, delay: index * 0.04 }}
      className="flex items-start gap-3 relative"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-3.5 top-7 w-px h-full bg-white/[0.06]" />
      )}

      {/* Icon */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border relative z-10"
        style={{
          color: cfg.color,
          background: cfg.bg,
          borderColor: cfg.color + '30',
        }}
      >
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[12px] font-semibold text-slate-200 leading-tight">{event.label}</p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">{event.detail}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-[10px] font-mono text-slate-600 flex items-center gap-1 justify-end">
              <Clock className="w-2.5 h-2.5" />
              {event.timestamp}
            </p>
            <p className="text-[9px] font-mono text-slate-700 mt-0.5">{event.actor}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface UsageTimelineProps {
  events: TimelineEvent[];
  selectedAssetId: string | null;
}

export const UsageTimeline: React.FC<UsageTimelineProps> = ({
  events,
  selectedAssetId,
}) => {
  const filteredEvents = selectedAssetId
    ? events.filter(e => e.assetId === selectedAssetId)
    : events;

  const displayEvents = filteredEvents.slice(0, 12);

  return (
    <div className="bg-[#0B0B12] border-t border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#9D6CFF]" />
          <span className="text-[11px] font-mono font-semibold text-slate-300">Usage Timeline</span>
          {selectedAssetId && (
            <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded-full
              bg-white/[0.04] border border-white/[0.08]">
              filtered
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-slate-600">
          {displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Events */}
      <div className="overflow-x-auto">
        {displayEvents.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-[11px] font-mono text-slate-700">No events for selected asset</p>
          </div>
        ) : (
          <div className="flex gap-0 min-w-max">
            {/* Vertical layout inside a horizontal scroll */}
            <div className="p-4 space-y-0 min-w-[340px] max-w-[500px]">
              {displayEvents.map((ev, i) => (
                <EventNode
                  key={ev.id}
                  event={ev}
                  index={i}
                  isLast={i === displayEvents.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
