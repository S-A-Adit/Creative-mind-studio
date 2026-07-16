/**
 * CommandPalette — Linear/Raycast-style command palette.
 *
 * Open with Ctrl+K / Cmd+K from anywhere in the app, or via LayoutContext.
 * Features:
 *  - Categorised, filterable command list
 *  - Keyboard navigation (↑↓ Enter Esc)
 *  - ARIA dialog + combobox roles
 *  - Framer Motion entrance/exit
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BotMessageSquare,
  Command,
  FileText,
  FlaskConical,
  FolderOpen,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useLayout } from '../../lib/useLayout';
import type { CommandAction } from '../../types/shell';

// ─── Default command registry ─────────────────────────────────────────────────

function buildDefaultCommands(actions: {
  setActiveNavId: (id: string) => void;
  setCommandPaletteOpen: (v: boolean) => void;
}): CommandAction[] {
  const nav = (id: string) => () => {
    actions.setActiveNavId(id);
    actions.setCommandPaletteOpen(false);
  };

  return [
    {
      id: 'create-project',
      label: 'Create New Project',
      description: 'Start a fresh creative project',
      icon: <Plus className="w-4 h-4" />,
      category: 'project',
      keywords: ['new', 'start', 'begin'],
      shortcut: ['N'],
      action: nav('projects'),
    },
    {
      id: 'go-home',
      label: 'Go to Home',
      description: 'Navigate to dashboard',
      icon: <Sparkles className="w-4 h-4" />,
      category: 'navigation',
      keywords: ['home', 'dashboard'],
      action: nav('home'),
    },
    {
      id: 'go-projects',
      label: 'Open Projects',
      description: 'Browse all projects',
      icon: <FolderOpen className="w-4 h-4" />,
      category: 'navigation',
      keywords: ['projects', 'browse'],
      action: nav('projects'),
    },
    {
      id: 'go-editor',
      label: 'Open Editor Workspace',
      description: 'Jump to the editor',
      icon: <FileText className="w-4 h-4" />,
      category: 'navigation',
      action: nav('editor-workspace'),
    },
    {
      id: 'go-strategy',
      label: 'Navigate to Strategy Room',
      description: 'AI-powered strategy session',
      icon: <Zap className="w-4 h-4" />,
      category: 'navigation',
      keywords: ['strategy', 'plan'],
      action: nav('strategy-room'),
    },
    {
      id: 'go-research',
      label: 'Open Research Lab',
      description: 'Source discovery & analysis',
      icon: <FlaskConical className="w-4 h-4" />,
      category: 'navigation',
      keywords: ['research', 'sources'],
      action: nav('research-lab'),
    },
    {
      id: 'run-strategy-analysis',
      label: 'Run Strategy Analysis',
      description: 'Start AI analysis on current project',
      icon: <BotMessageSquare className="w-4 h-4" />,
      category: 'ai',
      keywords: ['analyze', 'ai', 'strategy'],
      action: nav('strategy-room'),
    },
    {
      id: 'generate-research-questions',
      label: 'Generate Research Questions',
      description: 'Use AI to suggest research questions',
      icon: <FlaskConical className="w-4 h-4" />,
      category: 'ai',
      keywords: ['generate', 'questions', 'research'],
      action: nav('research-lab'),
    },
    {
      id: 'search-sources',
      label: 'Search Sources',
      description: 'Search across all research sources',
      icon: <Search className="w-4 h-4" />,
      category: 'ai',
      keywords: ['search', 'sources', 'references'],
      action: nav('research-lab'),
    },
    {
      id: 'invite-team-member',
      label: 'Invite Team Member',
      description: 'Add a collaborator to the workspace',
      icon: <Users className="w-4 h-4" />,
      category: 'team',
      keywords: ['invite', 'team', 'collaborate'],
      action: nav('team'),
    },
    {
      id: 'go-agents',
      label: 'Manage AI Agents',
      description: 'Configure and monitor AI agents',
      icon: <BotMessageSquare className="w-4 h-4" />,
      category: 'ai',
      keywords: ['agents', 'ai', 'configure'],
      action: nav('agents'),
    },
    {
      id: 'go-settings',
      label: 'Open Settings',
      description: 'Workspace and account settings',
      icon: <Settings className="w-4 h-4" />,
      category: 'settings',
      keywords: ['settings', 'preferences'],
      action: nav('settings'),
    },
    {
      id: 'open-notifications',
      label: 'Open Notifications',
      description: 'View all notifications',
      icon: <Share2 className="w-4 h-4" />,
      category: 'navigation',
      keywords: ['notifications', 'alerts'],
      action: nav('notifications'),
    },
  ];
}

// ─── Category labels ──────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  project:    'Projects',
  navigation: 'Navigate',
  ai:         'AI Actions',
  team:       'Team',
  settings:   'Settings',
};

// ─── Score function for search ranking ───────────────────────────────────────

function scoreCommand(cmd: CommandAction, query: string): number {
  const q = query.toLowerCase();
  if (cmd.label.toLowerCase().includes(q)) return 2;
  if (cmd.description?.toLowerCase().includes(q)) return 1;
  if (cmd.keywords?.some((k) => k.includes(q))) return 1;
  return 0;
}

// ─── CommandPalette component ─────────────────────────────────────────────────

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveNavId } = useLayout();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo(
    () => buildDefaultCommands({ setActiveNavId, setCommandPaletteOpen }),
    [setActiveNavId, setCommandPaletteOpen]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    return commands
      .map((cmd) => ({ cmd, score: scoreCommand(cmd, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ cmd }) => cmd);
  }, [commands, query]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CommandAction[]>();
    for (const cmd of filtered) {
      if (!map.has(cmd.category)) map.set(cmd.category, []);
      map.get(cmd.category)!.push(cmd);
    }
    return map;
  }, [filtered]);

  const flatFiltered = filtered; // already flat for keyboard nav

  const close = useCallback(() => {
    setCommandPaletteOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, [setCommandPaletteOpen]);

  const executeAction = useCallback(
    (cmd: CommandAction) => {
      cmd.action();
      close();
    },
    [close]
  );

  // ── Global keyboard shortcut (Ctrl/Cmd + K) ────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen]);

  // ── Focus input on open ────────────────────────────────────────────────────
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setActiveIndex(0);
      }, 50);
    }
  }, [commandPaletteOpen]);

  // ── In-palette keyboard nav ────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % flatFiltered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + flatFiltered.length) % flatFiltered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = flatFiltered[activeIndex];
        if (cmd) executeAction(cmd);
      }
    },
    [close, flatFiltered, activeIndex, executeAction]
  );

  // Scroll active item into view
  useEffect(() => {
    const item = listRef.current?.querySelector('[data-active="true"]');
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          role="presentation"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="relative w-full max-w-[560px] bg-[#10101A] border border-white/[0.10]
              rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.7)] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            {/* Top gradient accent */}
            <div className="h-[2px] bg-gradient-to-r from-[#7C3AED] via-[#9D6CFF] to-[#4F46E5]" />

            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
              <Command className="w-4 h-4 text-[#9D6CFF] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={filtered.length > 0}
                aria-controls="command-palette-list"
                aria-label="Search commands"
                placeholder="Search actions, pages, AI tools…"
                className="flex-1 bg-transparent text-[14px] text-slate-200 placeholder-slate-600
                  outline-none caret-[#9D6CFF]"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                onKeyDown={handleKeyDown}
              />
              <kbd className="flex-shrink-0 px-1.5 py-0.5 rounded-[5px] bg-white/[0.06]
                border border-white/[0.08] text-[10px] font-mono text-slate-600">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[380px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <Search className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                  <p className="text-[13px] text-slate-600">No results for "{query}"</p>
                </div>
              ) : (
                <ul
                  id="command-palette-list"
                  ref={listRef}
                  role="listbox"
                  aria-label="Commands"
                  className="py-2"
                >
                  {Array.from(grouped.entries()).map(([category, cmds]) => (
                    <li key={category} role="presentation">
                      {/* Category header */}
                      <div className="px-4 py-1.5 mt-1">
                        <span className="text-[10px] font-semibold tracking-widest uppercase
                          text-slate-600 font-mono">
                          {CATEGORY_LABELS[category] ?? category}
                        </span>
                      </div>

                      {/* Commands in category */}
                      <ul role="group" aria-label={CATEGORY_LABELS[category]}>
                        {cmds.map((cmd) => {
                          const currentIndex = flatFiltered.indexOf(cmd);
                          const isActive = currentIndex === activeIndex;

                          return (
                            <li
                              key={cmd.id}
                              role="option"
                              aria-selected={isActive}
                              data-active={isActive ? 'true' : undefined}
                            >
                              <button
                                type="button"
                                onClick={() => executeAction(cmd)}
                                onMouseEnter={() => setActiveIndex(currentIndex)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left
                                  transition-colors duration-100 group
                                  ${isActive
                                    ? 'bg-[#8B5CF6]/15 text-slate-100'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                                  }`}
                              >
                                {/* Icon */}
                                <span className={`flex-shrink-0 w-8 h-8 rounded-[10px] flex items-center
                                  justify-center border transition-colors duration-100
                                  ${isActive
                                    ? 'bg-[#7C3AED]/25 border-[#8B5CF6]/30 text-[#9D6CFF]'
                                    : 'bg-white/[0.04] border-white/[0.07] text-slate-500 group-hover:text-slate-300'
                                  }`}>
                                  {cmd.icon}
                                </span>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[13px] font-medium truncate ${isActive ? 'text-slate-100' : ''}`}>
                                    {cmd.label}
                                  </p>
                                  {cmd.description && (
                                    <p className="text-[11px] text-slate-600 truncate">{cmd.description}</p>
                                  )}
                                </div>

                                {/* Shortcut or arrow */}
                                <div className="flex-shrink-0 flex items-center gap-1">
                                  {cmd.shortcut?.map((key) => (
                                    <kbd
                                      key={key}
                                      className="px-1.5 py-0.5 rounded-[4px] bg-white/[0.06]
                                        border border-white/[0.08] text-[10px] font-mono text-slate-600"
                                    >
                                      {key}
                                    </kbd>
                                  ))}
                                  {isActive && !cmd.shortcut && (
                                    <ArrowRight className="w-3.5 h-3.5 text-[#9D6CFF]" />
                                  )}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer hint bar */}
            <div className="border-t border-white/[0.06] px-4 py-2 flex items-center gap-4">
              {[
                { keys: ['↑', '↓'], desc: 'Navigate' },
                { keys: ['↵'], desc: 'Select' },
                { keys: ['Esc'], desc: 'Close' },
              ].map(({ keys, desc }) => (
                <div key={desc} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-1.5 py-0.5 rounded-[4px] bg-white/[0.06]
                          border border-white/[0.08] text-[10px] font-mono text-slate-600"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-600">{desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
