/**
 * toast.ts — useToast hook + toast context
 *
 * Usage:
 *   const { toast } = useToast();
 *   toast.success('Project saved!');
 *   toast.error('Upload failed.', { description: '413 Payload Too Large' });
 *
 * Mount <ToastContainer /> once at the app root.
 */

import React, {
  createContext, useContext, useCallback, useReducer, useId,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  description?: string;
  duration?: number; // ms, default 4000 (0 = persist)
  action?: { label: string; onClick: () => void };
}

export interface ToastEntry extends ToastOptions {
  id: string;
  variant: ToastVariant;
  title: string;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD';    toast: ToastEntry }
  | { type: 'REMOVE'; id: string };

function reducer(state: ToastEntry[], action: Action): ToastEntry[] {
  switch (action.type) {
    case 'ADD':    return [action.toast, ...state].slice(0, 5); // max 5
    case 'REMOVE': return state.filter(t => t.id !== action.id);
    default:       return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  toasts:  ToastEntry[];
  dismiss: (id: string) => void;
  toast:   {
    success: (title: string, opts?: ToastOptions) => void;
    error:   (title: string, opts?: ToastOptions) => void;
    warning: (title: string, opts?: ToastOptions) => void;
    info:    (title: string, opts?: ToastOptions) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, dispatch] = useReducer(reducer, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const add = useCallback((variant: ToastVariant, title: string, opts: ToastOptions = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    dispatch({ type: 'ADD', toast: { id, variant, title, ...opts } });

    const duration = opts.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'REMOVE', id }), duration);
    }
  }, []);

  const toast: ToastContextValue['toast'] = {
    success: (t, o) => add('success', t, o),
    error:   (t, o) => add('error',   t, o),
    warning: (t, o) => add('warning', t, o),
    info:    (t, o) => add('info',    t, o),
  };

  return (
    <ToastContext.Provider value={{ toasts, dismiss, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
