/**
 * OnboardingLayout — shell for the multi-step onboarding wizard.
 *
 * Renders a wider card with a persistent progress header.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';

const STEP_LABELS = [
  'Your Role',
  'Content Types',
  'Workspace',
  'Invite Team',
  'First Project',
];

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number; // 1-based
  totalSteps?: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps = STEP_LABELS.length,
}) => {
  return (
    <div className="relative min-h-screen bg-[#07070A] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        className="relative z-10 flex items-center gap-2.5 mb-8"
      >
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#7C3AED] to-[#9D6CFF] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-semibold text-white text-[15px] tracking-tight">
          Creative<span className="text-[#9D6CFF]">Mind</span>
        </span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease }}
        className="relative z-10 w-full max-w-2xl bg-[#10101A]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/60 to-transparent" />

        {/* Progress header */}
        <div className="px-8 pt-8 pb-0">
          {/* Step indicator row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
              Setup
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Segmented progress bar */}
          <div className="flex gap-1.5 mb-6" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full"
                  animate={{
                    width: i < currentStep ? '100%' : '0%',
                    backgroundColor: i < currentStep - 1
                      ? '#7C3AED'
                      : i === currentStep - 1
                      ? '#9D6CFF'
                      : '#7C3AED',
                  }}
                  transition={{ duration: 0.35, ease }}
                />
              </div>
            ))}
          </div>

          {/* Step dot navigation */}
          <div className="hidden md:flex items-center gap-0 -mx-1 mb-6">
            {STEP_LABELS.map((label, i) => {
              const done = i < currentStep - 1;
              const active = i === currentStep - 1;
              return (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-250 ${
                        done
                          ? 'bg-[#7C3AED] border-[#7C3AED] shadow-[0_0_10px_rgba(124,58,237,0.4)]'
                          : active
                          ? 'bg-[#7C3AED]/20 border-[#7C3AED]/60 shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                          : 'bg-transparent border-white/[0.1]'
                      }`}
                    >
                      {done ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <span className={`text-[10px] font-mono font-bold ${active ? 'text-[#9D6CFF]' : 'text-slate-600'}`}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-sans whitespace-nowrap transition-colors ${
                      active ? 'text-white font-semibold' : done ? 'text-slate-500' : 'text-slate-700'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-px mx-1 mb-5 transition-colors duration-300 ${
                        i < currentStep - 1 ? 'bg-[#7C3AED]/40' : 'bg-white/[0.06]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        {children}
      </motion.div>

      {/* Footer */}
      <p className="relative z-10 mt-6 text-[11px] text-slate-700 font-mono text-center">
        © {new Date().getFullYear()} CreativeMind Studio, Inc.
      </p>
    </div>
  );
};
