/**
 * LayoutContext.tsx — provides LayoutContext to the entire React tree.
 *
 * Only exports the LayoutProvider component (satisfies react-refresh/only-export-components).
 * The context object lives in layout-context-ref.ts.
 * The useLayout hook lives in useLayout.ts.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  LayoutContext,
  DEFAULT_WORKSPACE,
  DEFAULT_WORKSPACES,
} from './layout-context-ref';
import type {
  ActiveNavId,
  BreadcrumbSegment,
  LayoutContextValue,
  PrimaryAction,
  Project,
  Workspace,
} from '../types/shell';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState<ActiveNavId>('home');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([
    { label: 'Home' },
  ]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(DEFAULT_WORKSPACE);
  const [primaryAction, setPrimaryAction] = useState<PrimaryAction | null>(null);

  const handleSetActiveProject = useCallback((p: Project | null) => {
    setActiveProject(p);
    if (p) {
      setBreadcrumbs([{ label: 'Projects', href: '#projects' }, { label: p.name }]);
      setActiveNavId('project-overview');
    } else {
      setBreadcrumbs([{ label: 'Home' }]);
      setActiveNavId('home');
    }
  }, []);

  const value = useMemo<LayoutContextValue>(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      rightPanelOpen,
      setRightPanelOpen,
      commandPaletteOpen,
      setCommandPaletteOpen,
      activeNavId,
      setActiveNavId,
      breadcrumbs,
      setBreadcrumbs,
      activeProject,
      setActiveProject: handleSetActiveProject,
      activeWorkspace,
      setActiveWorkspace,
      workspaces: DEFAULT_WORKSPACES,
      primaryAction,
      setPrimaryAction,
    }),
    [
      sidebarCollapsed,
      rightPanelOpen,
      commandPaletteOpen,
      activeNavId,
      breadcrumbs,
      activeProject,
      activeWorkspace,
      primaryAction,
      handleSetActiveProject,
    ]
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
