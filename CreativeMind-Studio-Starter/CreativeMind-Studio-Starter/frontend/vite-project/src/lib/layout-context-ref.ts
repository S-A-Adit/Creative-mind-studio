/**
 * layout-context-ref.ts — exports the React context object and default data.
 * Separated from LayoutContext.tsx (provider component) and useLayout.ts (hook)
 * to satisfy react-refresh/only-export-components.
 */

import { createContext } from 'react';
import type { LayoutContextValue, Workspace } from '../types/shell';

export const LayoutContext = createContext<LayoutContextValue | null>(null);

export const DEFAULT_WORKSPACE: Workspace = {
  id: 'ws-default',
  name: 'CreativeMind Studio',
  plan: 'pro',
  avatarInitials: 'CM',
  color: '#7C3AED',
};

export const DEFAULT_WORKSPACES: Workspace[] = [
  DEFAULT_WORKSPACE,
  { id: 'ws-client', name: 'Client Projects', plan: 'pro', avatarInitials: 'CP', color: '#4F46E5' },
  { id: 'ws-personal', name: 'Personal', plan: 'free', avatarInitials: 'P', color: '#10B981' },
];
