/**
 * StepProgressBar.tsx — Multi-step progress indicator at the top of the wizard.
 *
 * Shows step number, label, description, and animated connector lines.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { WizardStepId, WizardStep } from '../types';

interface StepProgressBarProps {
  steps: WizardStep[];
  currentStep: WizardStepId;
  onStepClick?: (step: WizardStepId) => void;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div
      role="navigation"
      aria-label="Project creation steps"
      className="flex items-center gap-0 w-full"
    >
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isClickable = step.id < currentStep && !!onStepClick;

        return (
          <React.Fragment key={step.id}>
            {/* ── Step node ── */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <button
                type="button"
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${step.id}: ${step.label}${isCompleted ? ' (completed)' : ''}`}
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(step.id)}
                className={`
                  relative flex items-center justify-center w-9 h-9 rounded-full
                  border-2 text-[12px] font-bold transition-all duration-200
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
                  ${isCompleted
                    ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                    : isActive
                    ? 'bg-[#0B0B12] border-[#8B5CF6] text-[#9D6CFF]'
                    : 'bg-[#0B0B12] border-white/[0.12] text-slate-600'}
                `}
              >
                {/* Active pulse ring */}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-[#8B5CF6]/40"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  />
                )}
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span className="font-mono">{step.id}</span>
                )}
              </button>

              {/* Label — hidden on mobile for middle steps */}
              <div className="flex flex-col items-center text-center min-w-0 max-w-[80px]">
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'text-slate-100'
                      : isCompleted
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {step.label}
                </span>
                <span className="hidden sm:block text-[10px] text-slate-600 font-mono truncate w-full text-center">
                  {step.description}
                </span>
              </div>
            </div>

            {/* ── Connector line ── */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 mb-7 sm:mb-8 h-px bg-white/[0.07] relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step.id < currentStep ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
