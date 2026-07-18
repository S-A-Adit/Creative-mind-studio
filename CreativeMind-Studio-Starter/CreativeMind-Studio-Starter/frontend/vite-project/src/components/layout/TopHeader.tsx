/**
 * TopHeader — responsive application header bar.
 *
 * Sections (left → right):
 *   [Mobile menu] [Breadcrumb] [Project title + status]  ··  [Search] [⌘K] [Notifications] [Collaborators] [Share] [Primary Action]
 *
 * All dynamic content (breadcrumbs, project info, primaryAction) is driven
 * by LayoutContext so individual workspace pages never need to touch this component.
 */

import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Command,
  Menu,
  Plus,
  Search,
  Share2,
} from 'lucide-react';
import { useLayout } from '../../lib/useLayout';
import { BreadcrumbNav } from './BreadcrumbNav';
import { CollaboratorAvatars } from './CollaboratorAvatars';

// Status badge config
const STATUS_CONFIG = {
  draft:       { label: 'Draft',       bg: 'bg-slate-800/60',     text: 'text-slate-300',  dot: 'bg-slate-500' },
  'in-progress':{ label: 'In Progress', bg: 'bg-blue-900/30',      text: 'text-blue-300',   dot: 'bg-blue-400' },
  review:      { label: 'Review',      bg: 'bg-amber-900/30',     text: 'text-amber-300',  dot: 'bg-amber-400' },
  published:   { label: 'Published',   bg: 'bg-emerald-900/30',   text: 'text-emerald-300',dot: 'bg-emerald-400' },
  archived:    { label: 'Archived',    bg: 'bg-slate-900/40',     text: 'text-slate-500',  dot: 'bg-slate-600' },
} as const;

// Mock collaborators for demo
const MOCK_COLLABORATORS = [
  { userId: 'u1', userName: 'Alex Rivera' },
  { userId: 'u2', userName: 'Jordan Kim' },
  { userId: 'u3', userName: 'Sam Patel' },
];

// ─── Global Search bar ────────────────────────────────────────────────────────

interface GlobalSearchProps {
  onCommandPaletteOpen: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onCommandPaletteOpen }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative hidden md:flex items-center">
      <button
        type="button"
        onClick={onCommandPaletteOpen}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Open command palette (Ctrl+K)"
        className={`
          flex items-center gap-2.5 h-8 px-3 rounded-[10px] border transition-all duration-200
          text-slate-500 bg-white/[0.03] hover:bg-white/[0.06]
          ${focused
            ? 'border-[#8B5CF6]/50 ring-2 ring-[#8B5CF6]/20'
            : 'border-white/[0.07] hover:border-white/[0.12]'
          }
        `}
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-[12px] hidden lg:block whitespace-nowrap">Search anything…</span>
        <kbd className="hidden lg:flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded-[5px]
          bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-slate-600">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>
    </div>
  );
};

// ─── Main TopHeader ───────────────────────────────────────────────────────────

interface TopHeaderProps {
  onMobileMenuToggle?: () => void;
  notificationCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onMobileMenuToggle,
  notificationCount = 3,
}) => {
  const { activeProject, setCommandPaletteOpen, primaryAction } = useLayout();

  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
  }, [setCommandPaletteOpen]);

  const statusCfg = activeProject
    ? STATUS_CONFIG[activeProject.status]
    : null;

  return (
    <header
      className="h-14 flex items-center gap-3 px-4 border-b border-white/[0.06]
        bg-[#07070A]/90 backdrop-blur-md sticky top-0 z-30 flex-shrink-0"
      role="banner"
    >
      {/* ── Left: mobile menu + breadcrumb + project title ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label="Open navigation menu"
          className="flex-shrink-0 md:hidden w-8 h-8 flex items-center justify-center
            text-slate-400 hover:text-slate-200 rounded-[8px] hover:bg-white/[0.06]
            transition-colors duration-150"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:block flex-shrink-0">
          <BreadcrumbNav />
        </div>

        {/* Project title + status */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:flex items-center gap-2 min-w-0"
            >
              <span className="text-slate-600 text-[12px]" aria-hidden="true">/</span>
              <span className="text-[13px] font-semibold text-slate-100 truncate">
                {activeProject.name}
              </span>
              {statusCfg && (
                <span
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5
                    rounded-full text-[11px] font-medium ${statusCfg.bg} ${statusCfg.text}`}
                  aria-label={`Project status: ${statusCfg.label}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} aria-hidden="true" />
                  {statusCfg.label}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Right: actions cluster ── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Global search */}
        <GlobalSearch onCommandPaletteOpen={openCommandPalette} />

        {/* Command palette trigger (icon only on mobile) */}
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Open command palette (Ctrl+K)"
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[8px]
            text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors duration-150"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
            className="w-8 h-8 flex items-center justify-center rounded-[8px]
              text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors duration-150"
          >
            <Bell className="w-4 h-4" />
          </button>
          {notificationCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full
                bg-[#8B5CF6] flex items-center justify-center
                text-[9px] font-bold text-white px-0.5"
              aria-hidden="true"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>

        {/* Collaborators */}
        <CollaboratorAvatars users={MOCK_COLLABORATORS} max={3} />

        {/* Share button */}
        <button
          type="button"
          aria-label="Share project"
          className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-[10px]
            border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07]
            text-[12px] font-medium text-slate-400 hover:text-slate-200
            transition-colors duration-150"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden lg:block">Share</span>
        </button>

        {/* Dynamic primary action */}
        <AnimatePresence mode="wait">
          {primaryAction ? (
            <motion.button
              key={primaryAction.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={primaryAction.onClick}
              className="flex items-center gap-1.5 h-8 px-3.5 rounded-[10px]
                bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]
                hover:from-[#8B5CF6] hover:to-[#9D6CFF]
                text-white text-[12px] font-semibold shadow-md
                transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
                focus-visible:outline-none"
            >
              {primaryAction.icon}
              <span className="hidden sm:block">{primaryAction.label}</span>
            </motion.button>
          ) : (
            <motion.button
              key="new-project"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              type="button"
              className="flex items-center gap-1.5 h-8 px-3.5 rounded-[10px]
                bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]
                hover:from-[#8B5CF6] hover:to-[#9D6CFF]
                text-white text-[12px] font-semibold shadow-md
                transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
                focus-visible:outline-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:block">New Project</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
