/**
 * NotificationFilters.tsx — Left panel
 *
 * Navigation tabs, search input, sort selector, and quick-stat summary.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Filter, Search, SortDesc,
  ClipboardCheck, AtSign, Bot, Clock, CheckCircle2, AlertTriangle,
  Inbox, MailOpen,
} from 'lucide-react';
import type { FilterTab, SortOrder, Notification } from '../types';

// ─── Filter definitions ───────────────────────────────────────────────────────

type FilterDef = {
  id: FilterTab;
  label: string;
  Icon: React.ElementType;
  color: string;
};

const FILTERS: FilterDef[] = [
  { id: 'all',         label: 'All',         Icon: Inbox,         color: 'text-slate-400' },
  { id: 'unread',      label: 'Unread',      Icon: MailOpen,      color: 'text-brand-electric' },
  { id: 'assignments', label: 'Assignments', Icon: ClipboardCheck, color: 'text-blue-400' },
  { id: 'mentions',    label: 'Mentions',    Icon: AtSign,        color: 'text-violet-400' },
  { id: 'ai-agents',   label: 'AI Agents',   Icon: Bot,           color: 'text-purple-400' },
  { id: 'deadlines',   label: 'Deadlines',   Icon: Clock,         color: 'text-orange-400' },
  { id: 'approvals',   label: 'Approvals',   Icon: CheckCircle2,  color: 'text-amber-400' },
  { id: 'warnings',    label: 'Warnings',    Icon: AlertTriangle, color: 'text-rose-400' },
];

const SORT_OPTIONS: Array<{ value: SortOrder; label: string }> = [
  { value: 'newest',   label: 'Newest First' },
  { value: 'oldest',   label: 'Oldest First' },
  { value: 'priority', label: 'By Priority' },
];

// ─── Count helpers ────────────────────────────────────────────────────────────

function getCount(tab: FilterTab, notifications: Notification[]): number {
  switch (tab) {
    case 'all':         return notifications.length;
    case 'unread':      return notifications.filter(n => !n.isRead).length;
    case 'assignments': return notifications.filter(n => n.category === 'assignment').length;
    case 'mentions':    return notifications.filter(n => n.category === 'mention').length;
    case 'ai-agents':   return notifications.filter(n => n.category === 'ai-agent').length;
    case 'deadlines':   return notifications.filter(n => n.category === 'deadline').length;
    case 'approvals':   return notifications.filter(n => n.category === 'approval-request').length;
    case 'warnings':    return notifications.filter(n => n.category === 'rights-warning').length;
    default:            return 0;
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotificationFiltersProps {
  activeFilter:     FilterTab;
  onFilterChange:   (filter: FilterTab) => void;
  searchQuery:      string;
  onSearchChange:   (q: string) => void;
  sortOrder:        SortOrder;
  onSortChange:     (s: SortOrder) => void;
  notifications:    Notification[];
  onMarkAllRead:    () => void;
  onOpenPrefs:      () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter, onFilterChange,
  searchQuery, onSearchChange,
  sortOrder, onSortChange,
  notifications,
  onMarkAllRead,
  onOpenPrefs,
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <aside className="h-full flex flex-col bg-[#0E0E1A] border-r border-white/[0.06]">

      {/* ── Header ── */}
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-brand-electric" />
            </div>
            <h2 className="font-display font-semibold text-slate-100 text-[13px] tracking-wide">
              Notifications
            </h2>
          </div>
          {unreadCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-purple/80 text-white text-[10px] font-bold font-mono flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-600 font-mono mt-1">{notifications.length} total</p>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg text-[12px] text-slate-300 placeholder-slate-600 font-sans py-2 pl-8 pr-3 focus:outline-none focus:border-brand-purple/40 focus:bg-white/[0.06] transition-colors duration-150"
          />
        </div>
      </div>

      {/* ── Sort ── */}
      <div className="px-4 pb-3">
        <div className="relative">
          <SortDesc className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
          <select
            value={sortOrder}
            onChange={e => onSortChange(e.target.value as SortOrder)}
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg text-[12px] text-slate-400 font-mono py-2 pl-8 pr-3 focus:outline-none focus:border-brand-purple/40 appearance-none cursor-pointer transition-colors duration-150"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} className="bg-[#0E0E1A]">{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 px-2 pb-2 pt-1 font-mono">
          Filter by type
        </p>
        {FILTERS.map(({ id, label, Icon, color }) => {
          const count = getCount(id, notifications);
          const isActive = activeFilter === id;
          return (
            <motion.button
              key={id}
              onClick={() => onFilterChange(id)}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 group
                ${isActive
                  ? 'bg-brand-purple/15 border border-brand-purple/20 text-slate-100'
                  : 'hover:bg-white/[0.04] border border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? color : 'text-slate-600 group-hover:' + color}`} />
              <span className="text-[12.5px] font-sans font-medium flex-1">{label}</span>
              {count > 0 && (
                <span className={`text-[10px] font-mono font-semibold min-w-[18px] h-[18px] px-1 rounded-md flex items-center justify-center
                  ${isActive ? 'bg-brand-purple/30 text-brand-electric' : 'bg-white/[0.06] text-slate-500'}`}>
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* ── Footer actions ── */}
      <div className="px-4 pb-5 pt-3 border-t border-white/[0.06] space-y-2">
        <button
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium font-sans text-slate-400 hover:text-slate-200 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <MailOpen className="w-3.5 h-3.5" />
          Mark All as Read
        </button>
        <button
          onClick={onOpenPrefs}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium font-sans text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent transition-colors duration-150"
        >
          <Filter className="w-3.5 h-3.5" />
          Preferences
        </button>
      </div>
    </aside>
  );
};
