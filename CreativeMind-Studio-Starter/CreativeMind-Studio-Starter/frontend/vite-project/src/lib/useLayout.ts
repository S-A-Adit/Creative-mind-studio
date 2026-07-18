/**
 * useLayout — reads from LayoutContext.
 * Separated into its own file to satisfy react-refresh/only-export-components.
 */

import { useContext } from 'react';
import { LayoutContext } from './layout-context-ref';
import type { LayoutContextValue } from '../types/shell';

export const useLayout = (): LayoutContextValue => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider');
  return ctx;
};
