/**
 * ActivityTimeline.tsx — Chronological approval activity timeline
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, MessageSquare, User,
  AlertOctagon, RefreshCw, Play
} from 'lucide-react';
import type { ActivityEvent, ActivityType } from '../mockData';
import { ACTIVITY_TIMELINE } from '../mockData';

const TYPE_CONFIG: Record<ActivityType, { icon: React.ElementType; color: string; bg: string }> = {
  approved:          { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  rejected:          { icon: XCircle,      color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  'changes-requested': { icon: RefreshCw,  color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  comment:           { icon: MessageSquare,color: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
  assigned:          { icon: User,         color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  blocked:           { icon: AlertOctagon, color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  resolved:          { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  started:           { icon: Play,         color: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
};

const CATEGORY_LABELS: Record<string, string> = {
  'research-accuracy':  'Research',
  'script-quality':     'Script',
  'editorial-quality':  'Editorial',
  'brand-safety':       'Brand Safety',
  'ethical-review':     'Ethical',
  'copyright-licence':  'Copyright',
  'platform-policy':    'Platform',
  'final-approval':     'Final Approval',
};

interface ActivityTimelineProps {
  events?: ActivityEvent[];
  compact?: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  events = ACTIVITY_TIMELINE, compact = false
}) => (
  <div className={compact ? '' : 'space-y-1'}>
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />

      {events.map((event, idx) => {
        const cfg = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.comment;
        const Icon = cfg.icon;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-start gap-3 pb-4 pl-9"
          >
            {/* Icon bubble */}
            <div
              className="absolute left-2 top-0.5 w-4 h-4 rounded-full flex items-center justify-center z-10 flex-shrink-0"
              style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}50` }}
            >
              <Icon size={8} style={{ color: cfg.color }} />
            </div>

            {/* Content card */}
            <div className="flex-1 rounded-xl bg-[#151521] border border-white/5 p-3 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#F8FAFC]">{event.title}</span>
                    {event.categoryId && (
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                        style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
                      >
                        {CATEGORY_LABELS[event.categoryId] ?? event.categoryId}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[9px] text-[#64748B] font-mono flex-shrink-0 ml-2">{event.timestamp}</span>
              </div>

              <p className={`text-[11px] text-[#94A3B8] leading-relaxed ${compact ? 'line-clamp-1' : ''}`}>
                {event.detail}
              </p>

              {!compact && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{ background: `${event.userColor}20`, color: event.userColor, border: `1px solid ${event.userColor}40` }}
                  >
                    {event.userInitials}
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">{event.user}</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);
