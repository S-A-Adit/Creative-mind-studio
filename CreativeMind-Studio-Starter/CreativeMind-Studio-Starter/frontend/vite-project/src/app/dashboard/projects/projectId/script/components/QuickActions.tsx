/**
 * QuickActions.tsx — Premium floating action dock for the Script Room.
 *
 * Actions: Generate Scene · Rewrite Selection · Improve Hook · Add Citation ·
 *          Insert Dialogue · Create New Scene · Approve Section · Export Script
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  RotateCcw,
  Zap,
  Quote,
  MessageSquare,
  PlusSquare,
  CheckSquare,
  Download,
  Check,
  Loader2,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Action config ────────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  shortLabel: string;
}

const ACTIONS: QuickAction[] = [
  {
    id: 'generate-scene',
    label: 'Generate Scene',
    shortLabel: 'Generate',
    icon: <Sparkles className="w-4 h-4" />,
    color: '#9D6CFF',
    bg: 'bg-[#7C3AED]/15',
    border: 'border-[#7C3AED]/35',
  },
  {
    id: 'rewrite-selection',
    label: 'Rewrite Selection',
    shortLabel: 'Rewrite',
    icon: <RotateCcw className="w-4 h-4" />,
    color: '#06B6D4',
    bg: 'bg-[#06B6D4]/10',
    border: 'border-[#06B6D4]/25',
  },
  {
    id: 'improve-hook',
    label: 'Improve Hook',
    shortLabel: 'Hook',
    icon: <Zap className="w-4 h-4" />,
    color: '#F59E0B',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
  },
  {
    id: 'add-citation',
    label: 'Add Citation',
    shortLabel: 'Cite',
    icon: <Quote className="w-4 h-4" />,
    color: '#64748B',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
  },
  {
    id: 'insert-dialogue',
    label: 'Insert Dialogue',
    shortLabel: 'Dialogue',
    icon: <MessageSquare className="w-4 h-4" />,
    color: '#06B6D4',
    bg: 'bg-[#06B6D4]/10',
    border: 'border-[#06B6D4]/25',
  },
  {
    id: 'new-scene',
    label: 'Create New Scene',
    shortLabel: 'New Scene',
    icon: <PlusSquare className="w-4 h-4" />,
    color: '#10B981',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
  },
  {
    id: 'approve-section',
    label: 'Approve Section',
    shortLabel: 'Approve',
    icon: <CheckSquare className="w-4 h-4" />,
    color: '#10B981',
    bg: 'bg-emerald-500/12',
    border: 'border-emerald-500/30',
  },
  {
    id: 'export-script',
    label: 'Export Script',
    shortLabel: 'Export',
    icon: <Download className="w-4 h-4" />,
    color: '#8B5CF6',
    bg: 'bg-[#7C3AED]/12',
    border: 'border-[#7C3AED]/30',
  },
];

// ─── Single action button ─────────────────────────────────────────────────────

interface ActionBtnProps {
  action: QuickAction;
  compact?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ action, compact = false }) => {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('loading');
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 1800);
    }, 900);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={`relative flex items-center gap-2 rounded-[11px] border font-semibold
        transition-all duration-200 overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${action.bg} ${action.border}
        ${compact ? 'px-2.5 py-2 text-[11px]' : 'px-3.5 py-2.5 text-[12px]'}`}
      style={{ color: state === 'done' ? '#10B981' : action.color }}
    >
      {/* Shimmer */}
      {state === 'loading' && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/08 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      )}

      <span className="relative z-10 flex-shrink-0">
        {state === 'loading'
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : state === 'done'
          ? <Check className="w-4 h-4 text-emerald-400" />
          : action.icon}
      </span>

      {!compact && (
        <span className="relative z-10 hidden sm:block truncate">
          {state === 'done' ? '✓ Done' : action.label}
        </span>
      )}
    </motion.button>
  );
};

// ─── Action dock ──────────────────────────────────────────────────────────────

interface QuickActionsProps {
  compact?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ compact = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, ease: EASE }}
    className={`flex items-center flex-wrap gap-2 ${compact ? 'gap-1.5' : 'gap-2'}`}
  >
    {ACTIONS.map(action => (
      <ActionBtn key={action.id} action={action} compact={compact} />
    ))}
  </motion.div>
);
