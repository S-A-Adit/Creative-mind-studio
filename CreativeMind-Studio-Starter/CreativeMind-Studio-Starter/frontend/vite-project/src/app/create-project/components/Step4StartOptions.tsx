/**
 * Step4StartOptions.tsx — Step 4: Choose how to begin the project.
 *
 * Renders 5 interactive option cards:
 *   blank · template · import-script · upload-research · simple-idea
 *
 * Validation: user must select one before proceeding.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  LayoutTemplate,
  FileUp,
  FileSearch,
  Lightbulb,
  Check,
  BadgeCheck,
} from 'lucide-react';
import type { Step4Data, StartOptionId, ValidationErrors } from '../types';
import { START_OPTIONS } from '../mockData';
import { ease } from '../../../lib/motion-constants';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<StartOptionId, React.ReactNode> = {
  blank:           <Sparkles className="w-5 h-5" />,
  template:        <LayoutTemplate className="w-5 h-5" />,
  'import-script': <FileUp className="w-5 h-5" />,
  'upload-research': <FileSearch className="w-5 h-5" />,
  'simple-idea':   <Lightbulb className="w-5 h-5" />,
};

const COLOR_MAP: Record<StartOptionId, { ring: string; iconBg: string; iconColor: string; glow: string }> = {
  blank:             { ring: 'border-[#8B5CF6]/60',  iconBg: 'bg-[#7C3AED]/20', iconColor: 'text-[#9D6CFF]',  glow: 'shadow-[0_0_24px_rgba(139,92,246,0.18)]' },
  template:          { ring: 'border-blue-500/50',    iconBg: 'bg-blue-500/15',   iconColor: 'text-blue-400',   glow: 'shadow-[0_0_24px_rgba(59,130,246,0.14)]' },
  'import-script':   { ring: 'border-emerald-500/50', iconBg: 'bg-emerald-500/15',iconColor: 'text-emerald-400',glow: 'shadow-[0_0_24px_rgba(16,185,129,0.14)]' },
  'upload-research': { ring: 'border-amber-500/50',   iconBg: 'bg-amber-500/15',  iconColor: 'text-amber-400',  glow: 'shadow-[0_0_24px_rgba(245,158,11,0.14)]' },
  'simple-idea':     { ring: 'border-pink-500/50',    iconBg: 'bg-pink-500/15',   iconColor: 'text-pink-400',   glow: 'shadow-[0_0_24px_rgba(236,72,153,0.14)]' },
};

// ─── Single Option Card ───────────────────────────────────────────────────────

interface OptionCardProps {
  id: StartOptionId;
  icon: string;
  label: string;
  description: string;
  badge?: string;
  recommended?: boolean;
  isSelected: boolean;
  index: number;
  onSelect: (id: StartOptionId) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  id,
  label,
  description,
  badge,
  recommended,
  isSelected,
  index,
  onSelect,
}) => {
  const colors = COLOR_MAP[id];

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`${label}${recommended ? ' (recommended)' : ''}`}
      onClick={() => onSelect(id)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: ease.snappy }}
      whileHover={{ scale: 1.015, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.985, transition: { duration: 0.1 } }}
      className={`
        relative w-full text-left p-5 rounded-[14px] border transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
        ${isSelected
          ? `${colors.ring} bg-white/[0.04] ${colors.glow}`
          : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.14]'
        }
      `}
    >
      {/* Selected check indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: ease.snappy }}
            className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-white stroke-[2.5]" />
          </motion.span>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-4 pr-8">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-[12px] border
            flex items-center justify-center transition-colors duration-200
            ${isSelected
              ? `${colors.iconBg} border-current/20 ${colors.iconColor}`
              : 'bg-white/[0.04] border-white/[0.08] text-slate-500'
            }
          `}
        >
          {ICON_MAP[id]}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[14px] font-semibold transition-colors duration-200 ${
                isSelected ? 'text-slate-100' : 'text-slate-300'
              }`}
            >
              {label}
            </span>

            {recommended && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                bg-[#7C3AED]/20 border border-[#8B5CF6]/30
                text-[10px] font-semibold text-[#9D6CFF] font-mono uppercase tracking-wide">
                <BadgeCheck className="w-3 h-3" />
                Recommended
              </span>
            )}

            {badge && !recommended && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full
                bg-white/[0.06] border border-white/[0.10]
                text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                {badge}
              </span>
            )}
          </div>

          <p className={`text-[12px] leading-relaxed transition-colors duration-200 ${
            isSelected ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

// ─── Step 4 Component ─────────────────────────────────────────────────────────

interface Step4StartOptionsProps {
  data: Step4Data;
  errors: ValidationErrors;
  onChange: (patch: Partial<Step4Data>) => void;
}

export const Step4StartOptions: React.FC<Step4StartOptionsProps> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-[15px] font-semibold text-slate-100">
          How would you like to start?
        </h3>
        <p className="text-[13px] text-slate-500">
          Select the option that best matches where you are in the creative process.
        </p>
      </div>

      {/* Option cards grid */}
      <div
        role="radiogroup"
        aria-label="Project start options"
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {START_OPTIONS.map((opt, i) => (
          <OptionCard
            key={opt.id}
            id={opt.id}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
            badge={opt.badge}
            recommended={opt.recommended}
            isSelected={data.selectedStartOption === opt.id}
            index={i}
            onSelect={id => onChange({ selectedStartOption: id })}
          />
        ))}
      </div>

      {/* Validation error */}
      <AnimatePresence>
        {errors.selectedStartOption && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-[12px] text-red-400 font-medium flex items-center gap-1.5"
            role="alert"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            {errors.selectedStartOption}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
