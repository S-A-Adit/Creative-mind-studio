/**
 * QuickActionsPanel.tsx — Premium quick actions for the Distribution Room
 *
 * Provides contextual actions for the selected platform adaptation.
 * Includes: Generate, Regenerate, Lock/Unlock, Edit, Approve, Copy, Export, Schedule.
 * Unsupported "Schedule" action is clearly labelled as Coming Soon.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2, RefreshCw, Lock, PenLine, CheckCircle2,
  Copy, Download, Calendar, Sparkles, ChevronRight,
} from 'lucide-react';
import { PLATFORM_ADAPTATIONS } from '../mockData';
import type { PlatformAdaptation } from '../types';
import {
  StatusBadge, PlatformIcon, ReadinessBar, SectionLabel, ComingSoonBadge,
} from './DistributionShared';

// ─── Action definitions ───────────────────────────────────────────────────────

interface ActionDef {
  id: string;
  label: string;
  description: string;
  Icon: React.ElementType;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'coming-soon';
  comingSoon?: boolean;
}

const ACTIONS: ActionDef[] = [
  {
    id: 'generate',
    label: 'Generate Version',
    description: 'Run AI generation for this platform adaptation',
    Icon: Wand2,
    variant: 'primary',
  },
  {
    id: 'regenerate',
    label: 'Regenerate Section',
    description: 'Re-generate only the selected content section',
    Icon: RefreshCw,
    variant: 'secondary',
  },
  {
    id: 'lock',
    label: 'Lock Section',
    description: 'Prevent further edits to finalized content',
    Icon: Lock,
    variant: 'ghost',
  },
  {
    id: 'edit',
    label: 'Edit Manually',
    description: 'Open inline editor to make direct changes',
    Icon: PenLine,
    variant: 'ghost',
  },
  {
    id: 'approve',
    label: 'Approve Version',
    description: 'Mark this adaptation as approved and ready',
    Icon: CheckCircle2,
    variant: 'secondary',
  },
  {
    id: 'copy',
    label: 'Copy Content',
    description: 'Copy all text content to clipboard',
    Icon: Copy,
    variant: 'ghost',
  },
  {
    id: 'export',
    label: 'Export',
    description: 'Export as Markdown, JSON, or PDF',
    Icon: Download,
    variant: 'ghost',
  },
  {
    id: 'schedule',
    label: 'Schedule',
    description: 'Schedule this content for publication',
    Icon: Calendar,
    variant: 'coming-soon',
    comingSoon: true,
  },
];

// ─── Feedback flash ───────────────────────────────────────────────────────────

const FEEDBACK: Record<string, string> = {
  generate: 'Generation queued…',
  regenerate: 'Section re-queued…',
  lock: 'Section locked.',
  edit: 'Editor opened.',
  approve: 'Approved ✓',
  copy: 'Copied to clipboard!',
  export: 'Export initiated…',
};

// ─── ActionButton ─────────────────────────────────────────────────────────────

interface ActionButtonProps {
  action: ActionDef;
  disabled?: boolean;
  onAction: (id: string) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, disabled, onAction }) => {
  const { id, label, description, Icon, variant, comingSoon } = action;

  const baseClass =
    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 group text-left';

  const variantClass: Record<string, string> = {
    primary:
      'bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#9D6CFF] hover:bg-[#8B5CF6]/25 hover:border-[#8B5CF6]/50',
    secondary:
      'bg-white/[0.03] border-white/[0.08] text-slate-200 hover:bg-white/[0.07] hover:border-white/[0.14]',
    ghost:
      'bg-transparent border-white/[0.05] text-slate-400 hover:text-slate-200 hover:border-white/[0.12] hover:bg-white/[0.03]',
    danger:
      'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/15',
    'coming-soon':
      'bg-transparent border-white/[0.04] text-slate-600 cursor-not-allowed opacity-60',
  };

  return (
    <motion.button
      whileHover={comingSoon || disabled ? {} : { x: 2 }}
      whileTap={comingSoon || disabled ? {} : { scale: 0.98 }}
      onClick={() => !comingSoon && !disabled && onAction(id)}
      disabled={comingSoon || disabled}
      className={`${baseClass} ${variantClass[variant]}`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          variant === 'primary'
            ? 'bg-[#8B5CF6]/20'
            : variant === 'secondary'
            ? 'bg-white/[0.05]'
            : variant === 'coming-soon'
            ? 'bg-white/[0.03]'
            : 'bg-white/[0.04]'
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate">{label}</span>
          {comingSoon && <ComingSoonBadge />}
        </div>
        <p className="text-[10px] font-normal text-slate-600 mt-0.5 truncate">{description}</p>
      </div>
      {!comingSoon && (
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface QuickActionsPanelProps {
  selectedPlatformId: string | null;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ selectedPlatformId }) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const platform: PlatformAdaptation | null =
    PLATFORM_ADAPTATIONS.find(a => a.id === selectedPlatformId) ?? null;

  const handleAction = (id: string) => {
    const msg = FEEDBACK[id];
    if (msg) {
      setFeedback(msg);
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0B0B12]">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#9D6CFF]" />
          <h3 className="font-display font-semibold text-white text-base">Quick Actions</h3>
        </div>

        {/* Selected platform context */}
        {platform ? (
          <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <PlatformIcon platformId={platform.platformId} iconName={platform.icon} size={32} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{platform.platformName}</p>
              <StatusBadge status={platform.status} size="sm" />
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600 mt-1">Select a platform to apply actions</p>
        )}

        {platform && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <SectionLabel>Readiness</SectionLabel>
              <SectionLabel>{platform.readinessScore}%</SectionLabel>
            </div>
            <ReadinessBar score={platform.readinessScore} size="sm" showLabel={false} />
          </div>
        )}
      </div>

      {/* Feedback banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            key="feedback"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mt-3 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-emerald-300 font-medium">{feedback}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {ACTIONS.map(action => (
          <ActionButton
            key={action.id}
            action={action}
            disabled={!platform && !action.comingSoon}
            onAction={handleAction}
          />
        ))}
      </div>
    </div>
  );
};
