/**
 * ResearchActions.tsx — Action button toolbar for the Research Lab.
 *
 * Actions: Add to Project · Link to Claim · Create Finding · Request Verification
 *          Assign Researcher · Reject Source · Add Note · Generate Citation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderPlus,
  Link2,
  Lightbulb,
  ShieldCheck,
  Users,
  XCircle,
  StickyNote,
  Quote,
  ChevronDown,
  Check,
  Loader2,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Action config ────────────────────────────────────────────────────────────

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  confirmLabel?: string;
}

const ACTIONS: ActionItem[] = [
  {
    id: 'add-project',
    label: 'Add to Project',
    icon: <FolderPlus className="w-4 h-4" />,
    color: '#8B5CF6',
    bg: 'bg-[#7C3AED]/15',
    border: 'border-[#7C3AED]/30',
    confirmLabel: 'Added to project',
  },
  {
    id: 'link-claim',
    label: 'Link to Claim',
    icon: <Link2 className="w-4 h-4" />,
    color: '#06B6D4',
    bg: 'bg-[#06B6D4]/10',
    border: 'border-[#06B6D4]/25',
    confirmLabel: 'Claim linked',
  },
  {
    id: 'create-finding',
    label: 'Create Finding',
    icon: <Lightbulb className="w-4 h-4" />,
    color: '#F59E0B',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    confirmLabel: 'Finding created',
  },
  {
    id: 'request-verification',
    label: 'Request Verification',
    icon: <ShieldCheck className="w-4 h-4" />,
    color: '#10B981',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    confirmLabel: 'Verification requested',
  },
  {
    id: 'assign-researcher',
    label: 'Assign Researcher',
    icon: <Users className="w-4 h-4" />,
    color: '#8B5CF6',
    bg: 'bg-[#7C3AED]/10',
    border: 'border-[#7C3AED]/25',
    confirmLabel: 'Researcher assigned',
  },
  {
    id: 'reject-source',
    label: 'Reject Source',
    icon: <XCircle className="w-4 h-4" />,
    color: '#EF4444',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    confirmLabel: 'Source rejected',
  },
  {
    id: 'add-note',
    label: 'Add Note',
    icon: <StickyNote className="w-4 h-4" />,
    color: '#64748B',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    confirmLabel: 'Note added',
  },
  {
    id: 'generate-citation',
    label: 'Generate Citation',
    icon: <Quote className="w-4 h-4" />,
    color: '#A78BFA',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/25',
    confirmLabel: 'Citation copied',
  },
];

// ─── Action button ────────────────────────────────────────────────────────────

interface ActionButtonProps {
  action: ActionItem;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, disabled = false }) => {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleClick = () => {
    if (state !== 'idle' || disabled) return;
    setState('loading');
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 2000);
    }, 800);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.15 }}
      className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-[10px] text-[12px] font-semibold
        border transition-all duration-200 relative overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
        ${action.bg} ${action.border}`}
      style={{ color: state === 'done' ? '#10B981' : action.color }}
    >
      {/* Loading shimmer */}
      {state === 'loading' && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/08 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      )}

      {/* Icon */}
      <span className="flex-shrink-0 relative z-10">
        {state === 'loading'
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : state === 'done'
          ? <Check className="w-4 h-4 text-emerald-400" />
          : action.icon
        }
      </span>

      {/* Label */}
      <span className="relative z-10">
        {state === 'done' ? action.confirmLabel : action.label}
      </span>
    </motion.button>
  );
};

// ─── Action group (collapsible on mobile) ─────────────────────────────────────

interface ResearchActionsProps {
  hasSelection?: boolean;
}

export const ResearchActions: React.FC<ResearchActionsProps> = ({
  hasSelection = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5
          hover:bg-white/[0.025] transition-colors duration-150 rounded-2xl
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[7px] bg-[#7C3AED]/20 border border-[#7C3AED]/30
            flex items-center justify-center">
            <FolderPlus className="w-3.5 h-3.5 text-[#9D6CFF]" />
          </div>
          <span className="text-[13px] font-display font-semibold text-slate-200">Research Actions</span>
          {!hasSelection && (
            <span className="text-[10px] font-mono text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              Select a source first
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-600"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      {/* Actions grid */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-2">
              {ACTIONS.map(action => (
                <ActionButton
                  key={action.id}
                  action={action}
                  disabled={!hasSelection && action.id !== 'create-finding' && action.id !== 'add-note'}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
