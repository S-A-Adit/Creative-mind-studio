/**
 * WorkspaceSwitcher — compact dropdown for switching between workspaces.
 * Used inside the Sidebar footer and optionally in the TopHeader.
 */

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { useLayout } from '../../lib/useLayout';

interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ collapsed = false }) => {
  const { activeWorkspace, setActiveWorkspace, workspaces } = useLayout();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const planLabel: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };

  const planColor: Record<string, string> = {
    free: 'text-slate-400',
    pro: 'text-[#9D6CFF]',
    enterprise: 'text-[#3B82F6]',
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch workspace"
        className={`
          w-full flex items-center rounded-[12px] transition-colors duration-200
          hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:outline-none
          ${collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'}
        `}
      >
        {/* Avatar */}
        <span
          className="flex-shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center
            text-[11px] font-bold text-white"
          style={{ backgroundColor: activeWorkspace.color ?? '#7C3AED' }}
        >
          {activeWorkspace.avatarInitials ?? activeWorkspace.name[0]}
        </span>

        {!collapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-slate-200 truncate leading-tight">
                {activeWorkspace.name}
              </p>
              <p className={`text-[11px] font-mono leading-tight ${planColor[activeWorkspace.plan]}`}>
                {planLabel[activeWorkspace.plan]}
              </p>
            </div>
            <ChevronDown
              className={`flex-shrink-0 w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="listbox"
              aria-label="Workspaces"
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`
                absolute bottom-full mb-2 z-50
                ${collapsed ? 'left-full ml-2' : 'left-0 right-0'}
                min-w-[200px] bg-[#151521] border border-white/[0.08]
                rounded-[16px] shadow-glass overflow-hidden
              `}
            >
              <div className="px-3 pt-3 pb-2">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 font-mono">
                  Workspaces
                </p>
              </div>

              <ul className="px-2 pb-2 space-y-0.5">
                {workspaces.map((ws) => (
                  <li key={ws.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={ws.id === activeWorkspace.id}
                      onClick={() => { setActiveWorkspace(ws); setOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px]
                        hover:bg-white/[0.05] transition-colors duration-150 text-left"
                    >
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center
                          text-[11px] font-bold text-white"
                        style={{ backgroundColor: ws.color ?? '#7C3AED' }}
                      >
                        {ws.avatarInitials ?? ws.name[0]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-slate-200 truncate">{ws.name}</p>
                        <p className={`text-[11px] font-mono ${planColor[ws.plan]}`}>{planLabel[ws.plan]}</p>
                      </div>
                      {ws.id === activeWorkspace.id && (
                        <Check className="flex-shrink-0 w-3.5 h-3.5 text-[#8B5CF6]" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/[0.06] px-2 py-2">
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px]
                    hover:bg-white/[0.05] text-slate-400 hover:text-slate-200
                    transition-colors duration-150 text-[13px] font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Workspace
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
