/**
 * WizardFormPrimitives.tsx — Shared, accessible form components used across all wizard steps.
 */

import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

// ─── Field Wrapper ─────────────────────────────────────────────────────────────

interface FieldWrapperProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className = '',
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label
      htmlFor={htmlFor}
      className="text-[12px] font-semibold text-slate-400 tracking-wide uppercase select-none"
    >
      {label}
      {required && <span className="text-[#9D6CFF] ml-0.5">*</span>}
    </label>
    {children}
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          key="err"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5 text-[11px] text-red-400 font-medium"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </motion.p>
      )}
      {!error && hint && (
        <motion.p
          key="hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-[11px] text-slate-600"
        >
          {hint}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ─── Text Input ────────────────────────────────────────────────────────────────

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ hasError, className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`
        w-full h-10 px-3.5 rounded-[10px] bg-[#0B0B12] border text-[13px] text-slate-100
        placeholder:text-slate-600 font-sans
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/60
        disabled:opacity-50 disabled:cursor-not-allowed
        ${hasError
          ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60'
          : 'border-white/[0.08] hover:border-white/[0.14]'
        }
        ${className}
      `}
      {...props}
    />
  )
);
TextInput.displayName = 'TextInput';

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError, className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`
        w-full px-3.5 py-2.5 rounded-[10px] bg-[#0B0B12] border text-[13px] text-slate-100
        placeholder:text-slate-600 font-sans resize-none leading-relaxed
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/60
        disabled:opacity-50 disabled:cursor-not-allowed
        ${hasError
          ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60'
          : 'border-white/[0.08] hover:border-white/[0.14]'
        }
        ${className}
      `}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError, options, placeholder = 'Select…', className = '', ...props }, ref) => (
    <select
      ref={ref}
      className={`
        w-full h-10 px-3.5 rounded-[10px] bg-[#0B0B12] border text-[13px] font-sans
        appearance-none cursor-pointer
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/60
        disabled:opacity-50 disabled:cursor-not-allowed
        ${hasError
          ? 'border-red-500/50 text-red-300 focus:ring-red-500/30'
          : 'border-white/[0.08] hover:border-white/[0.14] text-slate-100'
        }
        ${!props.value ? 'text-slate-600' : 'text-slate-100'}
        ${className}
      `}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '36px',
      }}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value} className="bg-[#0B0B12] text-slate-100">
          {o.label}
        </option>
      ))}
    </select>
  )
);
Select.displayName = 'Select';

// ─── Chip Selector (visual pill grid) ────────────────────────────────────────

interface ChipSelectorProps<T extends string> {
  options: Array<{ value: T; label: string; emoji?: string; icon?: string; flag?: string }>;
  value: T | '';
  onChange: (v: T) => void;
  hasError?: boolean;
  id?: string;
}

export function ChipSelector<T extends string>({
  options,
  value,
  onChange,
  id,
}: ChipSelectorProps<T>) {
  return (
    <div
      id={id}
      role="group"
      className="flex flex-wrap gap-2"
    >
      {options.map(opt => {
        const isSelected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value as T)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium
              border transition-all duration-200 cursor-pointer select-none
              ${isSelected
                ? 'bg-[#7C3AED]/20 border-[#8B5CF6]/50 text-[#9D6CFF] shadow-[0_0_0_1px_rgba(139,92,246,0.2)]'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-white/[0.16] hover:text-slate-200 hover:bg-white/[0.06]'
              }
            `}
          >
            {(opt.emoji || opt.icon || opt.flag) && (
              <span className="text-[13px] leading-none">
                {opt.emoji || opt.icon || opt.flag}
              </span>
            )}
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Date Input ───────────────────────────────────────────────────────────────

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  hasError?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ hasError, className = '', ...props }, ref) => (
    <input
      ref={ref}
      type="date"
      className={`
        w-full h-10 px-3.5 rounded-[10px] bg-[#0B0B12] border text-[13px] text-slate-100 font-sans
        transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/60
        [color-scheme:dark]
        ${hasError
          ? 'border-red-500/50 focus:ring-red-500/30'
          : 'border-white/[0.08] hover:border-white/[0.14]'
        }
        ${className}
      `}
      {...props}
    />
  )
);
DateInput.displayName = 'DateInput';
