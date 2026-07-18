/**
 * NotificationsWorkspace.tsx — Notifications Center workspace
 *
 * Desktop layout: LEFT (filters/nav) | RIGHT (notification feed)
 * Mobile: tabs — Notifications | Preferences
 *
 * All state lives here and is threaded down to child panels.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, SlidersHorizontal } from 'lucide-react';
import { NotificationFilters }         from './components/NotificationFilters';
import { NotificationFeed }            from './components/NotificationFeed';
import { NotificationPreferencesPanel } from './components/NotificationPreferences';
import { MOCK_NOTIFICATIONS, DEFAULT_PREFERENCES } from './mockData';
import type {
  Notification, FilterTab, SortOrder, NotificationPreferences,
} from './types';

// ─── Mobile tabs ──────────────────────────────────────────────────────────────

type MobileTab = 'notifications' | 'preferences';
const MOBILE_TABS: Array<{ id: MobileTab; label: string; Icon: React.ElementType }> = [
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'preferences',   label: 'Preferences',   Icon: SlidersHorizontal },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const NotificationsWorkspace: React.FC = () => {

  // ── Data state ──────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [prefs, setPrefs]                 = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeFilter, setActiveFilter]   = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery]     = useState('');
  const [sortOrder, setSortOrder]         = useState<SortOrder>('newest');
  const [prefsOpen, setPrefsOpen]         = useState(false);
  const [mobileTab, setMobileTab]         = useState<MobileTab>('notifications');

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleMarkRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n),
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handlePrefChange = useCallback((key: keyof NotificationPreferences, value: boolean) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  }, []);

  // ── Shared feed props ────────────────────────────────────────────────────────

  const feedProps = {
    notifications,
    activeFilter,
    searchQuery,
    sortOrder,
    onMarkRead:  handleMarkRead,
    onDelete:    handleDelete,
  };

  // ── Mobile preferences view ──────────────────────────────────────────────────

  const MobilePrefsView = () => (
    <div className="h-full overflow-y-auto bg-[#09090F] px-4 py-5 space-y-5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-brand-electric" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-slate-100 text-[14px]">Preferences</h3>
          <p className="text-[11px] text-slate-600 font-mono">Manage notification settings</p>
        </div>
      </div>
      {/* Re-use the preferences panel content inline for mobile */}
      <NotificationPreferencesPanel
        isOpen={false}
        prefs={prefs}
        onChange={handlePrefChange}
        onClose={() => {}}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0B12] text-slate-100 font-sans">

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP LAYOUT — two-column
      ═══════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex h-screen overflow-hidden">

        {/* LEFT: Filters panel — fixed 240px */}
        <div className="w-60 flex-shrink-0 h-full overflow-hidden">
          <NotificationFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onOpenPrefs={() => setPrefsOpen(true)}
          />
        </div>

        {/* RIGHT: Feed — flex-1 */}
        <main className="flex-1 min-w-0 h-full overflow-hidden border-l border-white/[0.05]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + sortOrder}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              <NotificationFeed {...feedProps} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE LAYOUT — tabs
      ═══════════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col h-screen">

        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.07] bg-[#0E0E18]/90 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-electric" />
            <span className="font-display font-semibold text-slate-100 text-[13.5px]">Notifications</span>
          </div>
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-purple text-white text-[10px] font-bold font-mono flex items-center justify-center">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </div>

        {/* Mobile tab bar */}
        <div className="flex border-b border-white/[0.07] bg-[#0E0E18]/80 backdrop-blur-sm">
          {MOBILE_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-mono font-medium transition-colors duration-150
                ${mobileTab === id
                  ? 'text-brand-electric border-b-2 border-brand-purple'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Mobile content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {mobileTab === 'notifications' ? (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                {/* Mobile filter strip */}
                <div className="px-4 py-3 border-b border-white/[0.05] space-y-2 bg-[#0E0E1A]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg text-xs text-slate-300 placeholder-slate-600 font-sans py-2 px-3 focus:outline-none focus:border-brand-purple/40 transition-colors duration-150"
                    />
                  </div>
                  {/* Horizontal filter scroll */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {(['all', 'unread', 'assignments', 'mentions', 'ai-agents', 'deadlines', 'approvals', 'warnings'] as FilterTab[]).map(f => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`flex-shrink-0 text-[11px] font-mono px-3 py-1.5 rounded-lg border capitalize transition-colors duration-150
                          ${activeFilter === f
                            ? 'bg-brand-purple/20 border-brand-purple/30 text-brand-electric'
                            : 'bg-white/[0.04] border-white/[0.07] text-slate-500'
                          }`}
                      >
                        {f === 'ai-agents' ? 'AI Agents' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <NotificationFeed {...feedProps} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="h-full overflow-y-auto"
              >
                <MobilePrefsView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Preferences slide-over (desktop) ── */}
      <NotificationPreferencesPanel
        isOpen={prefsOpen}
        prefs={prefs}
        onChange={handlePrefChange}
        onClose={() => setPrefsOpen(false)}
      />
    </div>
  );
};

export default NotificationsWorkspace;
