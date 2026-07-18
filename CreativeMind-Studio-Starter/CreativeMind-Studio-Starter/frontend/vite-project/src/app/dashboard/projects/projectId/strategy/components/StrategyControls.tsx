/**
 * StrategyControls.tsx — Premium action buttons panel for the Strategy War Room.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  MessageSquarePlus,
  AlertTriangle,
  RefreshCw,
  GitCompare,
  CheckCircle2,
  Layers,
  Loader2,
  Square,
} from 'lucide-react';
import type { DebateRunState } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Action button ────────────────────────────────────────────────────────────

interface ActionBtnProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({
  icon,
  label,
  description,
  variant = 'secondary',
  isLoading,
  disabled,
  onClick,
  fullWidth = false,
}) => {
  const base = 'inline-flex items-center gap-2 rounded-[10px] border font-medium text-[13px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]';
  const size = description ? 'px-4 py-3 flex-col items-start gap-1' : 'px-4 py-2.5';

  const variants = {
    primary: 'bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF] text-white border-[#8B5CF6]/30 shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_22px_rgba(139,92,246,0.45)]',
    secondary: 'bg-white/[0.04] border-white/[0.09] text-slate-300 hover:bg-white/[0.07] hover:border-white/[0.16] hover:text-white',
    danger: 'bg-red-500/08 border-red-500/22 text-red-400 hover:bg-red-500/14 hover:border-red-500/40',
    success: 'bg-emerald-500/08 border-emerald-500/22 text-emerald-400 hover:bg-emerald-500/14 hover:border-emerald-500/40',
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15, ease: EASE }}
      className={`${base} ${size} ${variants[variant]} ${fullWidth ? 'w-full justify-start' : ''} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <span className="flex items-center gap-2">
        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span className="flex-shrink-0">{icon}</span>}
        <span className={description ? 'font-semibold text-[13px]' : ''}>{label}</span>
      </span>
      {description && (
        <span className="text-[11px] opacity-60 leading-tight font-normal pl-5 mt-0.5">{description}</span>
      )}
    </motion.button>
  );
};

// ─── Follow-up input ──────────────────────────────────────────────────────────

const FollowUpInput: React.FC<{ onSubmit: (q: string) => void; onClose: () => void }> = ({
  onSubmit,
  onClose,
}) => {
  const [value, setValue] = useState('');
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="flex gap-2 mt-2">
        <input
          autoFocus
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Ask the board a follow-up question…"
          className="flex-1 h-9 px-3 rounded-[9px] bg-[#0B0B12] border border-white/[0.09]
            text-[12px] text-slate-100 placeholder:text-slate-600
            focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/60"
          onKeyDown={e => {
            if (e.key === 'Enter' && value.trim()) { onSubmit(value); setValue(''); onClose(); }
            if (e.key === 'Escape') onClose();
          }}
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => { if (value.trim()) { onSubmit(value); setValue(''); onClose(); } }}
          className="px-3 py-1.5 rounded-[9px] bg-[#7C3AED] text-white text-[12px] font-medium"
        >
          Ask
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Main controls ────────────────────────────────────────────────────────────

interface StrategyControlsProps {
  runState: DebateRunState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onAskFollowUp: (question: string) => void;
  onChallenge: () => void;
  onNextRound: () => void;
  onCompareVersions: () => void;
  onAccept: () => void;
  onPivot: () => void;
}

export const StrategyControls: React.FC<StrategyControlsProps> = ({
  runState,
  onStart,
  onPause,
  onStop,
  onAskFollowUp,
  onChallenge,
  onNextRound,
  onCompareVersions,
  onAccept,
  onPivot,
}) => {
  const [showFollowUp, setShowFollowUp] = useState(false);
  const isRunning = runState === 'running';
  const isComplete = runState === 'complete';

  return (
    <div className="space-y-3">
      {/* Primary run controls */}
      <div className="flex gap-2 flex-wrap">
        {!isRunning ? (
          <ActionBtn
            icon={<Play className="w-3.5 h-3.5" />}
            label={runState === 'idle' ? 'Start Debate' : runState === 'paused' ? 'Resume' : 'Replay'}
            variant="primary"
            onClick={onStart}
            disabled={isComplete}
          />
        ) : (
          <ActionBtn
            icon={<Pause className="w-3.5 h-3.5" />}
            label="Pause"
            variant="secondary"
            onClick={onPause}
          />
        )}
        {(isRunning || runState === 'paused') && (
          <ActionBtn
            icon={<Square className="w-3.5 h-3.5" />}
            label="Stop"
            variant="danger"
            onClick={onStop}
          />
        )}
        <ActionBtn
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          label="Run Another Round"
          variant="secondary"
          onClick={onNextRound}
          disabled={isRunning}
        />
      </div>

      {/* Interaction controls */}
      <div className="flex flex-col gap-2">
        <ActionBtn
          icon={<MessageSquarePlus className="w-3.5 h-3.5" />}
          label="Ask Follow-Up"
          description="Inject a question into the current debate"
          variant="secondary"
          onClick={() => setShowFollowUp(v => !v)}
          fullWidth
          disabled={isRunning}
        />
        <AnimatePresence>
          {showFollowUp && (
            <FollowUpInput
              onSubmit={onAskFollowUp}
              onClose={() => setShowFollowUp(false)}
            />
          )}
        </AnimatePresence>

        <ActionBtn
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          label="Challenge Assumption"
          description="Force agents to re-examine a specific claim"
          variant="danger"
          onClick={onChallenge}
          fullWidth
          disabled={isRunning}
        />

        <ActionBtn
          icon={<GitCompare className="w-3.5 h-3.5" />}
          label="Compare Versions"
          description="Side-by-side view of strategy iterations"
          variant="secondary"
          onClick={onCompareVersions}
          fullWidth
        />

        <ActionBtn
          icon={<Layers className="w-3.5 h-3.5" />}
          label="Create Pivot Version"
          description="Fork the strategy with a new direction"
          variant="secondary"
          onClick={onPivot}
          fullWidth
          disabled={isRunning}
        />
      </div>

      {/* Accept recommendation */}
      <div className="pt-2 border-t border-white/[0.06]">
        <ActionBtn
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          label="Accept Recommendation"
          description="Lock the current strategy and proceed"
          variant="success"
          onClick={onAccept}
          fullWidth
          disabled={isRunning || runState === 'idle'}
        />
      </div>
    </div>
  );
};
