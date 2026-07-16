/**
 * MobileDrawer — slide-in navigation drawer for mobile viewport.
 * Activated when the hamburger menu is pressed in TopHeader.
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose, children }) => (
  <AnimatePresence>
    {open && (
      <>
        {/* Backdrop */}
        <motion.div
          key="drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <motion.div
          key="drawer-panel"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed top-0 left-0 bottom-0 z-[70] w-[280px] bg-[#0B0B12]
            border-r border-white/[0.07] flex flex-col md:hidden shadow-[4px_0_32px_rgba(0,0,0,0.6)]"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Close button */}
          <div className="h-14 flex items-center justify-end px-4 border-b border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="w-8 h-8 flex items-center justify-center rounded-[8px]
                text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── MobileBottomNav ─────────────────────────────────────────────────────────

import {
  BarChart3,
  Bell,
  FolderOpen,
  Home,
  Settings,
} from 'lucide-react';
import { useLayout } from '../../lib/useLayout';

interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { id: 'home',          label: 'Home',     icon: <Home className="w-5 h-5" /> },
  { id: 'projects',      label: 'Projects', icon: <FolderOpen className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifs',   icon: <Bell className="w-5 h-5" /> },
  { id: 'analytics',     label: 'Analytics',icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'settings',      label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const MobileBottomNav: React.FC = () => {
  const { activeNavId, setActiveNavId } = useLayout();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden
        bg-[#0B0B12]/95 backdrop-blur-md border-t border-white/[0.07]
        flex items-center justify-around h-16 px-2 pb-safe"
      aria-label="Mobile navigation"
    >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = activeNavId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveNavId(item.id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            className={`
              flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1.5
              rounded-[12px] transition-colors duration-150
              ${isActive
                ? 'text-[#9D6CFF]'
                : 'text-slate-600 hover:text-slate-400'
              }
            `}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && (
              <motion.span
                layoutId="mobile-nav-indicator"
                className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#8B5CF6]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
