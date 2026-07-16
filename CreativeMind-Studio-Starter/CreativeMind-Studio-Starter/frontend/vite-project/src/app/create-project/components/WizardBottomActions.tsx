/**
 * WizardBottomActions.tsx — Bottom navigation bar for the project creation wizard.
 *
 * Buttons: Back · Save Draft · Next / Create Project
 * Shows autosave status indicator and step progress fraction.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Rocket,
  Cloud,
  CloudOff,
  Check,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import type { WizardStepId } from '../types';
import { ease } from '../../../lib/motion-constants';

// ─── Autosave indicator ───────────────────────────────────────────────────────

const AutosaveIndicator: React.FC<{ status: 'idle' | 'saving' | 'saved' }> = ({ status }) => (
  <AnimatePresence mode="wait">
    {status === 'saving' && (
      <motion.div
        key="saving"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-1.5 text-[11px] text-slate-500"
      >
        <Cloud className="w-3.5 h-3.5 animate-pulse" />
        <span>Saving…</span>
      </motion.div>
    )}
    {status === 'saved' && (
      <motion.div
        key="saved"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-1.5 text-[11px] text-emerald-500"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Draft saved</span>
      </motion.div>
    )}
    {status === 'idle' && (
      <motion.div
        key="idle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-1.5 text-[11px] text-slate-700"
      >
        <CloudOff className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Autosave ready</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Component ────────────────────────────────────────────────────────────────

interface WizardBottomActionsProps {
  currentStep: WizardStepId;
  totalSteps: number;
  isSubmitting: boolean;
  isDirty: boolean;
  autosaveStatus: 'idle' | 'saving' | 'saved';
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onCreateProject: () => void;
}

export const WizardBottomActions: React.FC<WizardBottomActionsProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  isDirty,
  autosaveStatus,
  onBack,
  onNext,
  onSaveDraft,
  onCreateProject,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === (totalSteps as WizardStepId);

  return (
    <div className="flex items-center justify-between gap-4 pt-5 border-t border-white/[0.07]">
      {/* ── Left: Back + autosave ── */}
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          onClick={onBack}
          disabled={isFirstStep || isSubmitting}
          whileHover={{ scale: isFirstStep ? 1 : 1.02 }}
          whileTap={{ scale: isFirstStep ? 1 : 0.98 }}
          transition={{ duration: 0.15 }}
          className={`
            inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-medium
            border transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
            ${isFirstStep || isSubmitting
              ? 'opacity-30 cursor-not-allowed border-white/[0.06] text-slate-600'
              : 'border-white/[0.08] text-slate-400 hover:border-white/[0.16] hover:text-slate-200 cursor-pointer'
            }
          `}
          aria-label="Go back to previous step"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>

        <AutosaveIndicator status={autosaveStatus} />
      </div>

      {/* ── Right: Save Draft + Next/Create ── */}
      <div className="flex items-center gap-3">
        {/* Save Draft */}
        {isDirty && (
          <motion.button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="
              inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-medium
              border border-white/[0.08] text-slate-400
              hover:border-white/[0.16] hover:text-slate-200
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
              cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
            "
            aria-label="Save as draft"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </motion.button>
        )}

        {/* Step fraction badge (desktop) */}
        <span className="hidden lg:block text-[11px] font-mono text-slate-700">
          {currentStep} / {totalSteps}
        </span>

        {/* Next / Create Project */}
        {isLastStep ? (
          <motion.button
            type="button"
            onClick={onCreateProject}
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
            transition={{ duration: 0.15, ease: ease.snappy }}
            className="
              relative inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px]
              text-[13px] font-semibold text-white
              bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]
              border border-[#8B5CF6]/30
              shadow-[0_4px_20px_rgba(124,58,237,0.35)]
              hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)]
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
              disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
              overflow-hidden
            "
            aria-label={isSubmitting ? 'Creating project…' : 'Create project'}
          >
            {/* Shimmer */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
            />

            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin relative z-10" />
            ) : (
              <Rocket className="w-4 h-4 relative z-10" />
            )}
            <span className="relative z-10">
              {isSubmitting ? 'Creating…' : 'Create Project'}
            </span>
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="
              inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px]
              text-[13px] font-semibold text-white
              bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]
              border border-[#8B5CF6]/30
              shadow-[0_4px_16px_rgba(124,58,237,0.25)]
              hover:shadow-[0_4px_22px_rgba(139,92,246,0.4)]
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            "
            aria-label="Continue to next step"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
