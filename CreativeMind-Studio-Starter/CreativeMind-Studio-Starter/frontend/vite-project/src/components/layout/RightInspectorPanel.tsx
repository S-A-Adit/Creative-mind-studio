/**
 * RightInspectorPanel — collapsible contextual panel for the right side of the workspace.
 *
 * Usage: feature pages set `rightPanelOpen` and render content via the `children` slot.
 * The panel is entirely presentational — no business logic.
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLayout } from '../../lib/useLayout';

interface RightInspectorPanelProps {
  /** Panel content — rendered by individual workspace pages */
  children?: React.ReactNode;
  /** Panel heading shown in the header bar */
  title?: string;
  /** Width in px (default 320) */
  width?: number;
}

export const RightInspectorPanel: React.FC<RightInspectorPanelProps> = ({
  children,
  title = 'Inspector',
  width = 320,
}) => {
  const { rightPanelOpen, setRightPanelOpen } = useLayout();

  return (
    <AnimatePresence initial={false}>
      {rightPanelOpen && (
        <motion.aside
          key="inspector"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex-shrink-0 h-full border-l border-white/[0.06] bg-[#0B0B12]
            overflow-hidden flex flex-col"
          aria-label="Inspector panel"
          role="complementary"
        >
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0">
            <span className="text-[13px] font-semibold text-slate-200">{title}</span>
            <button
              type="button"
              onClick={() => setRightPanelOpen(false)}
              aria-label="Close inspector panel"
              className="w-7 h-7 flex items-center justify-center rounded-[8px]
                text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]
                transition-colors duration-150"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4" style={{ width }}>
            {children ?? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-10 h-10 rounded-[12px] bg-white/[0.04] border border-white/[0.07]
                  flex items-center justify-center mb-3">
                  <X className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-[13px] text-slate-600">Nothing to inspect</p>
                <p className="text-[11px] text-slate-700 mt-1">
                  Select an element to inspect its properties.
                </p>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
