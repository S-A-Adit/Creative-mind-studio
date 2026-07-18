/**
 * NotificationCard.tsx — Individual notification item
 *
 * Displays icon, actor, title, description, project badge,
 * timestamp, priority indicator, and contextual meta chips.
 * Animated entrance + read-state transition via Framer Motion.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, AtSign, ClipboardCheck, ShieldCheck,
  AlertTriangle, Bot, Clock, MessageSquare, Radio,
  Circle, Trash2, ExternalLink, MoreHorizontal, Check,
} from 'lucide-react';
import type { Notification, NotificationCategory, NotificationPriority } from '../types';

// ─── Category config ──────────────────────────────────────────────────────────

type CategoryConfig = {
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
};

const CATEGORY_CONFIG: Record<NotificationCategory, CategoryConfig> = {
  assignment:          { Icon: ClipboardCheck, iconBg: 'bg-blue-500/15',    iconColor: 'text-blue-400',    label: 'Assignment' },
  mention:             { Icon: AtSign,         iconBg: 'bg-violet-500/15',  iconColor: 'text-violet-400',  label: 'Mention' },
  'approval-request':  { Icon: CheckCircle2,   iconBg: 'bg-amber-500/15',   iconColor: 'text-amber-400',   label: 'Approval' },
  'source-verified':   { Icon: ShieldCheck,    iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', label: 'Verified' },
  'rights-warning':    { Icon: AlertTriangle,  iconBg: 'bg-rose-500/15',    iconColor: 'text-rose-400',    label: 'Rights Warning' },
  'ai-agent':          { Icon: Bot,            iconBg: 'bg-purple-500/15',  iconColor: 'text-purple-400',  label: 'AI Agent' },
  deadline:            { Icon: Clock,          iconBg: 'bg-orange-500/15',  iconColor: 'text-orange-400',  label: 'Deadline' },
  comment:             { Icon: MessageSquare,  iconBg: 'bg-cyan-500/15',    iconColor: 'text-cyan-400',    label: 'Comment' },
  'publication-status':{ Icon: Radio,          iconBg: 'bg-teal-500/15',    iconColor: 'text-teal-400',    label: 'Published' },
};

const PRIORITY_CONFIG: Record<NotificationPriority, { dot: string; label: string }> = {
  critical: { dot: 'bg-rose-500',    label: 'Critical' },
  high:     { dot: 'bg-amber-400',   label: 'High' },
  normal:   { dot: 'bg-slate-500',   label: 'Normal' },
  low:      { dot: 'bg-slate-600',   label: 'Low' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotificationCardProps {
  notification: Notification;
  onMarkRead:   (id: string) => void;
  onDelete:     (id: string) => void;
  index:        number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
  index,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { Icon, iconBg, iconColor, label } = CATEGORY_CONFIG[notification.category];
  const priority = PRIORITY_CONFIG[notification.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
      className={`group relative flex gap-3.5 px-4 py-4 rounded-xl border cursor-default
        transition-colors duration-200
        ${notification.isRead
          ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
          : 'bg-white/[0.055] border-white/[0.10] hover:bg-white/[0.07]'
        }
        ${notification.priority === 'critical' ? 'border-rose-500/20' : ''}
      `}
    >
      {/* ── Unread indicator ── */}
      {!notification.isRead && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_6px_rgba(139,92,246,0.8)]"
        />
      )}

      {/* ── Category icon ── */}
      <div className="flex-shrink-0 mt-0.5">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">

        {/* Row 1: category badge + priority + timestamp */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-semibold tracking-widest uppercase font-mono ${iconColor}`}>
            {label}
          </span>
          {notification.priority !== 'normal' && notification.priority !== 'low' && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
          )}
          <span className="ml-auto text-[11px] text-slate-500 font-mono pr-5">
            {notification.timestamp}
          </span>
        </div>

        {/* Row 2: title */}
        <h4 className={`text-[13.5px] font-display font-semibold leading-snug mb-1 transition-colors duration-200
          ${notification.isRead ? 'text-slate-300' : 'text-slate-100'}`}>
          {notification.title}
        </h4>

        {/* Row 3: description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {notification.description}
        </p>

        {/* Row 4: project badge + actor + meta chips */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          {/* Project badge */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-white/[0.05] border border-white/[0.08] rounded-md px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: notification.projectColor }} />
            {notification.projectName}
          </span>

          {/* Actor */}
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <span
              className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: notification.actor.avatarColor }}
            >
              {notification.actor.avatar.slice(0, 2)}
            </span>
            {notification.actor.name}
          </span>

          {/* Meta chips (first 2 only) */}
          {notification.meta && Object.entries(notification.meta).slice(0, 2).map(([key, val]) => (
            <span key={key} className="text-[10px] font-mono text-slate-600 bg-white/[0.03] border border-white/[0.05] rounded px-1.5 py-0.5">
              {val}
            </span>
          ))}
        </div>
      </div>

      {/* ── Actions (revealed on hover) ── */}
      <AnimatePresence>
        {!menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 right-3 hidden group-hover:flex items-center gap-1"
          >
            {!notification.isRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                title="Mark as read"
                className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-emerald-500/20 border border-white/[0.07] hover:border-emerald-500/30 flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors duration-150"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {}}
              title="Open project"
              className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-brand-purple/20 border border-white/[0.07] hover:border-brand-purple/30 flex items-center justify-center text-slate-500 hover:text-brand-electric transition-colors duration-150"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(notification.id)}
              title="Delete"
              className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 border border-white/[0.07] hover:border-rose-500/30 flex items-center justify-center text-slate-500 hover:text-rose-400 transition-colors duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
