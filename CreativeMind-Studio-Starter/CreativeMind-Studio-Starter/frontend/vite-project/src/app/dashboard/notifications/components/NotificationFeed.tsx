/**
 * NotificationFeed.tsx — Right / main panel
 *
 * Renders the filtered, sorted, and searched list of notifications.
 * Uses AnimatePresence for smooth add/remove transitions.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Inbox } from 'lucide-react';
import { NotificationCard } from './NotificationCard';
import type { Notification, FilterTab, SortOrder } from '../types';

// ─── Filter & sort logic ──────────────────────────────────────────────────────

function applyFilter(notifications: Notification[], filter: FilterTab): Notification[] {
  switch (filter) {
    case 'unread':      return notifications.filter(n => !n.isRead);
    case 'assignments': return notifications.filter(n => n.category === 'assignment');
    case 'mentions':    return notifications.filter(n => n.category === 'mention');
    case 'ai-agents':   return notifications.filter(n => n.category === 'ai-agent');
    case 'deadlines':   return notifications.filter(n => n.category === 'deadline');
    case 'approvals':   return notifications.filter(n => n.category === 'approval-request');
    case 'warnings':    return notifications.filter(n => n.category === 'rights-warning');
    default:            return notifications;
  }
}

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, normal: 2, low: 3 };

function applySort(notifications: Notification[], sort: SortOrder): Notification[] {
  const copy = [...notifications];
  switch (sort) {
    case 'oldest':   return copy.sort((a, b) => a.timestampISO.localeCompare(b.timestampISO));
    case 'priority': return copy.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    default:         return copy.sort((a, b) => b.timestampISO.localeCompare(a.timestampISO));
  }
}

function applySearch(notifications: Notification[], query: string): Notification[] {
  if (!query.trim()) return notifications;
  const q = query.toLowerCase();
  return notifications.filter(
    n =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.projectName.toLowerCase().includes(q) ||
      n.actor.name.toLowerCase().includes(q),
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotificationFeedProps {
  notifications:  Notification[];
  activeFilter:   FilterTab;
  searchQuery:    string;
  sortOrder:      SortOrder;
  onMarkRead:     (id: string) => void;
  onDelete:       (id: string) => void;
}

// ─── Section header (date group) ─────────────────────────────────────────────

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 py-2">
    <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 font-mono">{label}</span>
    <div className="flex-1 h-px bg-white/[0.05]" />
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const NotificationFeed: React.FC<NotificationFeedProps> = ({
  notifications,
  activeFilter,
  searchQuery,
  sortOrder,
  onMarkRead,
  onDelete,
}) => {
  const filtered  = applyFilter(notifications, activeFilter);
  const searched  = applySearch(filtered, searchQuery);
  const sorted    = applySort(searched, sortOrder);

  // Group into "Today" and "Earlier" based on timestampISO
  const todayDate = new Date().toDateString();
  const todayItems    = sorted.filter(n => new Date(n.timestampISO).toDateString() === todayDate);
  const earlierItems  = sorted.filter(n => new Date(n.timestampISO).toDateString() !== todayDate);

  return (
    <div className="h-full flex flex-col bg-[#09090F]">

      {/* ── Feed header ── */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-500" />
          <h3 className="font-display font-semibold text-slate-200 text-sm tracking-wide">
            Activity Feed
          </h3>
          {sorted.length > 0 && (
            <span className="text-[11px] text-slate-600 font-mono">
              {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* Unread count badge */}
        {sorted.filter(n => !n.isRead).length > 0 && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[11px] font-mono font-medium text-brand-electric bg-brand-purple/15 border border-brand-purple/20 rounded-full px-2.5 py-0.5"
          >
            {sorted.filter(n => !n.isRead).length} unread
          </motion.span>
        )}
      </div>

      {/* ── Feed body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">

        {sorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-sm font-display font-medium text-slate-400">No notifications found</p>
            <p className="text-xs text-slate-600 mt-1 font-sans">
              {searchQuery ? 'Try a different search term' : "You're all caught up!"}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Today's notifications */}
            {todayItems.length > 0 && (
              <>
                <SectionLabel label="Today" />
                <AnimatePresence initial={false}>
                  {todayItems.map((n, i) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onMarkRead={onMarkRead}
                      onDelete={onDelete}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </>
            )}

            {/* Earlier notifications */}
            {earlierItems.length > 0 && (
              <div className={todayItems.length > 0 ? 'pt-3' : ''}>
                <SectionLabel label="Earlier" />
                <AnimatePresence initial={false}>
                  {earlierItems.map((n, i) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onMarkRead={onMarkRead}
                      onDelete={onDelete}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
