/**
 * MainLayout — the outermost application shell.
 *
 * Composes all shell regions:
 *
 *  ┌──────────────────────────────────────────────────────┐
 *  │  TopHeader (h-14, sticky)                            │
 *  ├──────────┬───────────────────────────────────────────┤
 *  │ Sidebar  │  MainWorkspace           │ RightInspector │
 *  │  (w-16   │  (flex-1, overflow-y)    │   (optional)   │
 *  │  or 240) │                          │                │
 *  └──────────┴──────────────────────────────────────────-┘
 *  Mobile:  BottomNav replaces Sidebar
 *           Drawer overlay replaces sidebar slot
 *
 * Children = the workspace page content slot.
 */

import React, { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { TopHeader } from '../layout/TopHeader';
import { RightInspectorPanel } from '../layout/RightInspectorPanel';
import { CommandPalette } from '../layout/CommandPalette';
import { MobileDrawer, MobileBottomNav } from '../layout/MobileDrawer';

interface MainLayoutProps {
  children?: React.ReactNode;
  /** Optional content for the right inspector panel */
  inspectorContent?: React.ReactNode;
  inspectorTitle?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  inspectorContent,
  inspectorTitle,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <>
      {/* ── Application Root ── */}
      <div
        className="flex flex-col h-full bg-[#07070A]"
        style={{ height: '100dvh' }}
      >
        {/* Top Header — always visible */}
        <TopHeader onMobileMenuToggle={() => setMobileDrawerOpen(true)} />

        {/* Body row */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Desktop Sidebar ── */}
          <div className="hidden md:flex flex-shrink-0 h-full">
            <Sidebar />
          </div>

          {/* ── Main workspace + optional right panel ── */}
          <main
            id="main-content"
            className="flex-1 flex min-w-0 h-full overflow-hidden"
            role="main"
            tabIndex={-1}
            aria-label="Workspace content"
          >
            {/* Workspace content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
              {children}
            </div>

            {/* Right inspector panel */}
            <RightInspectorPanel
              title={inspectorTitle}
              children={inspectorContent}
            />
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>

      {/* ── Mobile drawer overlay ── */}
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        <Sidebar />
      </MobileDrawer>

      {/* ── Command Palette (portal-style, always mounted) ── */}
      <CommandPalette />
    </>
  );
};
