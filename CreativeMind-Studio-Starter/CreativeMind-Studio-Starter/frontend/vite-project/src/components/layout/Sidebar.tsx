/**
 * Sidebar — primary application navigation.
 *
 * Features:
 * - Expanded / collapsed mode with animated transitions
 * - Primary nav (global) + contextual project nav when a project is active
 * - Footer: user profile, workspace switcher, usage meter, collapse button
 * - ARIA-compliant, keyboard-navigable, touch-friendly
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  BotMessageSquare,
  ChevronLeft,
  ChevronRight,
  ClapperboardIcon,
  FileText,
  FlaskConical,
  FolderOpen,
  Home,
  Layers,
  LayoutDashboard,
  Megaphone,
  Settings,
  Share2,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { useLayout } from '../../lib/useLayout';
import type { NavItem } from '../../types/shell';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { UsageMeter } from './UsageMeter';

// ─── Nav definitions ─────────────────────────────────────────────────────────

const PRIMARY_NAV: NavItem[] = [
  { id: 'home',          label: 'Home',          icon: <Home className="w-4 h-4" /> },
  { id: 'projects',      label: 'Projects',      icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'agents',        label: 'AI Agents',     icon: <BotMessageSquare className="w-4 h-4" /> },
  { id: 'team',          label: 'Team',          icon: <Users className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: 3 },
  { id: 'analytics',     label: 'Analytics',     icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'templates',     label: 'Templates',     icon: <Layers className="w-4 h-4" /> },
  { id: 'settings',      label: 'Settings',      icon: <Settings className="w-4 h-4" /> },
];

const PROJECT_NAV: NavItem[] = [
  { id: 'project-overview',  label: 'Overview',          icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'strategy-room',     label: 'Strategy Room',     icon: <Zap className="w-4 h-4" /> },
  { id: 'virality-twin',     label: 'Virality Twin',     icon: <Star className="w-4 h-4" /> },
  { id: 'research-lab',      label: 'Research Lab',      icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'story-script',      label: 'Story & Script',    icon: <FileText className="w-4 h-4" /> },
  { id: 'asset-room',        label: 'Asset Room',        icon: <ClapperboardIcon className="w-4 h-4" /> },
  { id: 'editor-workspace',  label: 'Editor Workspace',  icon: <Sparkles className="w-4 h-4" /> },
  { id: 'review-approval',   label: 'Review & Approval', icon: <Share2 className="w-4 h-4" /> },
  { id: 'distribution',      label: 'Distribution',      icon: <Megaphone className="w-4 h-4" /> },
  { id: 'performance',       label: 'Performance',       icon: <BarChart3 className="w-4 h-4" /> },
];

// ─── Collapsed tooltip wrapper ────────────────────────────────────────────────

interface NavTooltipProps {
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}

const NavTooltip: React.FC<NavTooltipProps> = ({ label, collapsed, children }) => {
  if (!collapsed) return <>{children}</>;
  return (
    <div className="relative group/tip">
      {children}
      <div
        role="tooltip"
        className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap
          bg-[#1B1B2A] border border-white/10 text-slate-200 text-xs font-sans px-2.5 py-1.5 rounded-lg
          opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50 shadow-glass"
      >
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1B1B2A]" />
      </div>
    </div>
  );
};

// ─── Single nav item ──────────────────────────────────────────────────────────

interface NavItemRowProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

const NavItemRow: React.FC<NavItemRowProps> = ({ item, isActive, collapsed, onClick }) => (
  <NavTooltip label={item.label} collapsed={collapsed}>
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative w-full flex items-center rounded-[14px] transition-colors duration-200
        focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:outline-none
        ${collapsed ? 'justify-center p-2.5 h-10' : 'gap-3 px-3 py-2.5'}
        group/item
      `}
    >
      {/* Active background */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 to-transparent
            border border-[#8B5CF6]/25 rounded-[14px]"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      {/* Active left border */}
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#8B5CF6] rounded-full" />
      )}

      {/* Icon */}
      <span
        className={`relative z-10 flex-shrink-0 transition-colors duration-200 ${
          isActive
            ? 'text-[#9D6CFF]'
            : 'text-slate-500 group-hover/item:text-slate-300'
        }`}
      >
        {item.icon}
      </span>

      {/* Label + badge */}
      {!collapsed && (
        <span className="relative z-10 flex flex-1 items-center justify-between min-w-0">
          <span
            className={`text-[13px] font-medium truncate transition-colors duration-200 ${
              isActive
                ? 'text-slate-100'
                : 'text-slate-400 group-hover/item:text-slate-200'
            }`}
          >
            {item.label}
          </span>
          {item.badge != null && (
            <span className="ml-auto flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-[#7C3AED]/30
              border border-[#8B5CF6]/40 text-[#9D6CFF] text-[10px] font-semibold font-mono
              flex items-center justify-center px-1">
              {item.badge}
            </span>
          )}
        </span>
      )}

      {/* Collapsed badge dot */}
      {collapsed && item.badge != null && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
      )}
    </button>
  </NavTooltip>
);

// ─── Section label ────────────────────────────────────────────────────────────

interface SectionLabelProps {
  label: string;
  collapsed: boolean;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ label, collapsed }) => {
  if (collapsed) {
    return <div className="h-px mx-2 bg-white/5 my-2" />;
  }
  return (
    <div className="px-3 pt-4 pb-1.5">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 font-sans">
        {label}
      </span>
    </div>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, activeNavId, setActiveNavId, activeProject } =
    useLayout();

  const collapsed = sidebarCollapsed;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="relative flex flex-col h-full bg-[#0B0B12] border-r border-white/[0.06] shadow-sidebar z-40 overflow-hidden"
      aria-label="Primary navigation"
    >
      {/* ── Logo header ── */}
      <div className="h-14 flex items-center border-b border-white/[0.06] flex-shrink-0 px-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo mark */}
          <div className="flex-shrink-0 w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#7C3AED] to-[#9D6CFF]
            flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col leading-none">
                  <span className="text-[13px] font-semibold text-white font-display whitespace-nowrap">
                    CreativeMind
                  </span>
                  <span className="text-[9px] font-mono font-medium text-[#9D6CFF]/80 tracking-[0.15em] uppercase">
                    Studio
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Scrollable nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2" aria-label="Workspace navigation">

        {/* Primary nav */}
        <SectionLabel label="Workspace" collapsed={collapsed} />
        <ul role="list" className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <li key={item.id}>
              <NavItemRow
                item={item}
                isActive={activeNavId === item.id}
                collapsed={collapsed}
                onClick={() => setActiveNavId(item.id)}
              />
            </li>
          ))}
        </ul>

        {/* Project nav (contextual) */}
        <AnimatePresence initial={false}>
          {activeProject && (
            <motion.div
              key="project-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SectionLabel
                label={collapsed ? '' : activeProject.name}
                collapsed={collapsed}
              />
              <ul role="list" className="space-y-0.5">
                {PROJECT_NAV.map((item) => (
                  <li key={item.id}>
                    <NavItemRow
                      item={item}
                      isActive={activeNavId === item.id}
                      collapsed={collapsed}
                      onClick={() => setActiveNavId(item.id)}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-white/[0.06] px-2 py-2 space-y-1">
        <WorkspaceSwitcher collapsed={collapsed} />

        {!collapsed && <UsageMeter />}

        {/* Collapse button */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            w-full flex items-center rounded-[12px] transition-colors duration-200
            text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]
            ${collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'}
          `}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[13px] font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};
