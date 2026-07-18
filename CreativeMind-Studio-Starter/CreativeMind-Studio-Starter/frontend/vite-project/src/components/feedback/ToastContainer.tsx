/**
 * ToastContainer.tsx — renders the live toast stack
 *
 * Mount once at app root (inside <ToastProvider>):
 *   <ToastContainer />
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, AlertTriangle, Info, X,
} from 'lucide-react';
import { useToast } from './toast';
import type { ToastEntry, ToastVariant } from './toast';

// ─── Visual config per variant ────────────────────────────────────────────────

const VARIANT_CONFIG: Record<ToastVariant, {
  icon: React.ReactNode;
  bar: string;
  bg: string;
  border: string;
  title: string;
}> = {
  success: {
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
    bar: 'bg-emerald-500',
    bg: 'bg-[#0B1A14]',
    border: 'border-emerald-500/25',
    title: 'text-emerald-100',
  },
  error: {
    icon: <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />,
    bar: 'bg-rose-500',
    bg: 'bg-[#1A0B0E]',
    border: 'border-rose-500/25',
    title: 'text-rose-100',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
    bar: 'bg-amber-500',
    bg: 'bg-[#1A1500]',
    border: 'border-amber-500/25',
    title: 'text-amber-100',
  },
  info: {
    icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
    bar: 'bg-blue-500',
    bg: 'bg-[#0B0E1A]',
    border: 'border-blue-500/25',
    title: 'text-blue-100',
  },
};

// ─── Single toast card ────────────────────────────────────────────────────────

const ToastCard: React.FC<{ toast: ToastEntry; onDismiss: (id: string) => void }> = ({
  toast, onDismiss,
}) => {
  const cfg = VARIANT_CONFIG[toast.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,   scale: 1 }}
      exit={{   opacity: 0, y: -12,  scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      role="alert"
      aria-live="polite"
      className={`relative w-80 rounded-xl border ${cfg.bg} ${cfg.border} shadow-xl overflow-hidden`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${cfg.bar}`} />

      <div className="flex items-start gap-3 pl-4 pr-3 py-3.5">
        {cfg.icon}

        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-semibold font-sans leading-snug ${cfg.title}`}>
            {toast.title}
          </p>
          {toast.description && (
            <p className="text-[11.5px] text-slate-400 font-sans mt-0.5 leading-relaxed">
              {toast.description}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-1.5 text-[11px] font-semibold font-sans text-brand-electric hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/[0.08] transition-colors flex-shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Container ────────────────────────────────────────────────────────────────

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastCard toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
