/**
 * form-primitives.tsx — Low-level form building blocks
 *
 * Designed to integrate with React Hook Form + Zod.
 *
 * Exports:
 *   FormRoot         — <form> wrapper with unsaved-changes guard
 *   FormSection      — labeled section with optional divider
 *   FormField        — label + input slot + validation message
 *   FormError        — server / field error banner
 *   FormSuccess      — success confirmation banner
 *   Input            — dark-themed text input
 *   Textarea         — dark-themed textarea
 *   Select           — styled native select
 *   Checkbox         — animated checkbox
 *   RadioGroup       — radio button group
 *   CharacterCount   — live character counter
 */

import React, { useId, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, CheckCircle2, Lock, Eye, EyeOff, ChevronDown,
} from 'lucide-react';

// ─── Shared style tokens ──────────────────────────────────────────────────────

const BASE_INPUT = [
  'w-full bg-white/[0.04] text-slate-200 text-[13.5px] font-sans',
  'border border-white/[0.10] rounded-xl',
  'py-2.5 px-3.5',
  'placeholder-slate-600',
  'transition-colors duration-150',
  'focus:outline-none focus:border-brand-purple/60 focus:bg-white/[0.07] focus:ring-1 focus:ring-brand-purple/25',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

const ERROR_INPUT = 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/20';

// ─── FormRoot ─────────────────────────────────────────────────────────────────

interface FormRootProps extends React.FormHTMLAttributes<HTMLFormElement> {
  isDirty?: boolean;
  /** Called on browser unload / navigation when there are unsaved changes */
  warnOnLeave?: boolean;
}

export const FormRoot: React.FC<FormRootProps> = ({
  children,
  isDirty = false,
  warnOnLeave = true,
  ...props
}) => {
  useEffect(() => {
    if (!warnOnLeave) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, warnOnLeave]);

  return <form noValidate {...props}>{children}</form>;
};

// ─── FormSection ──────────────────────────────────────────────────────────────

interface FormSectionProps {
  title:        string;
  description?: string;
  children:     React.ReactNode;
  className?:   string;
  /** Show a top border divider */
  divider?:     boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title, description, children, className = '', divider = true,
}) => (
  <div className={`${divider ? 'pt-6 border-t border-white/[0.07] first:border-t-0 first:pt-0' : ''} ${className}`}>
    <div className="mb-5">
      <h3 className="font-display font-semibold text-slate-200 text-[13.5px] tracking-wide">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 font-sans mt-0.5 leading-relaxed">{description}</p>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label:        string;
  required?:    boolean;
  error?:       string;
  hint?:        string;
  id?:          string;
  children:     React.ReactNode;
  className?:   string;
  /** Lock icon — show when field is read-only */
  locked?:      boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label, required, error, hint, id, children, className = '', locked,
}) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={fieldId} className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-300 font-sans tracking-wide">
        {label}
        {required && <span className="text-rose-500 text-[10px]">*</span>}
        {locked  && <Lock className="w-3 h-3 text-slate-600" />}
      </label>

      {/* Inject fieldId into single-child input */}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }>, {
            id: fieldId,
            'aria-describedby': error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined,
            'aria-invalid': !!error,
          })
        : children
      }

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            id={`${fieldId}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-[11.5px] text-rose-400 font-sans"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            id={`${fieldId}-hint`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[11.5px] text-slate-500 font-sans"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

// ─── FormError (server-level banner) ──────────────────────────────────────────

interface FormErrorProps {
  error?:     string | null;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error, className = '' }) => (
  <AnimatePresence>
    {error && (
      <motion.div
        role="alert"
        initial={{ opacity: 0, y: -6, height: 0 }}
        animate={{ opacity: 1, y: 0,  height: 'auto' }}
        exit={{   opacity: 0, y: -6,  height: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex items-start gap-3 px-4 py-3 bg-rose-500/8 border border-rose-500/25 rounded-xl overflow-hidden ${className}`}
      >
        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-rose-300 font-sans leading-relaxed">{error}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── FormSuccess ──────────────────────────────────────────────────────────────

export const FormSuccess: React.FC<{ message?: string | null; className?: string }> = ({
  message, className = '',
}) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -6, height: 0 }}
        animate={{ opacity: 1, y: 0,  height: 'auto' }}
        exit={{   opacity: 0, y: -6,  height: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex items-start gap-3 px-4 py-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl overflow-hidden ${className}`}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-emerald-300 font-sans leading-relaxed">{message}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?:      string;
  leftIcon?:   React.ReactNode;
  rightIcon?:  React.ReactNode;
  sizeVariant?:'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  error, leftIcon, rightIcon, sizeVariant = 'md', className = '', type = 'text', ...props
}, ref) => {
  const [showPw, setShowPw] = React.useState(false);
  const isPw = type === 'password';

  const sizeMap = { sm: 'py-1.5 text-xs', md: 'py-2.5 text-[13.5px]', lg: 'py-3 text-sm' };

  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        type={isPw ? (showPw ? 'text' : 'password') : type}
        className={`${BASE_INPUT} ${sizeMap[sizeVariant]} ${error ? ERROR_INPUT : ''} ${leftIcon ? 'pl-9' : ''} ${isPw || rightIcon ? 'pr-10' : ''} ${className}`}
        {...props}
      />
      {isPw ? (
        <button
          type="button"
          onClick={() => setShowPw(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label={showPw ? 'Hide password' : 'Show password'}
        >
          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      ) : rightIcon ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{rightIcon}</div>
      ) : null}
    </div>
  );
});
Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(({
  error, className = '', maxLength, value, ...props
}, ref) => {
  const current = typeof value === 'string' ? value.length : 0;

  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        value={value}
        maxLength={maxLength}
        className={`${BASE_INPUT} resize-none ${error ? ERROR_INPUT : ''} ${className}`}
        {...props}
      />
      {maxLength && (
        <span className={`absolute bottom-2.5 right-3 text-[10px] font-mono ${
          current > maxLength * 0.9 ? 'text-amber-500' : 'text-slate-600'
        }`}>
          {current}/{maxLength}
        </span>
      )}
    </div>
  );
});
Textarea.displayName = 'Textarea';

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  error?:       string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(({
  options, placeholder, error, className = '', ...props
}, ref) => (
  <div className="relative w-full">
    <select
      ref={ref}
      className={`${BASE_INPUT} appearance-none pr-9 cursor-pointer ${error ? ERROR_INPUT : ''} ${className}`}
      {...props}
    >
      {placeholder && <option value="" className="bg-[#0E0E1A]">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value} disabled={o.disabled} className="bg-[#0E0E1A]">
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
  </div>
));
SelectField.displayName = 'SelectField';

// ─── Checkbox ─────────────────────────────────────────────────────────────────

interface CheckboxProps {
  label:      string;
  checked?:   boolean;
  onChange?:  (checked: boolean) => void;
  error?:     string;
  disabled?:  boolean;
  description?:string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label, checked = false, onChange, error, disabled, description,
}) => {
  const id = useId();

  return (
    <div className={`flex items-start gap-3 ${disabled ? 'opacity-50' : ''}`}>
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={e => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={() => !disabled && onChange?.(!checked)}
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors duration-150 flex-shrink-0
            ${checked
              ? 'bg-brand-purple border-brand-purple'
              : 'bg-white/[0.04] border-white/[0.20] hover:border-brand-purple/50'
            }`}
        >
          <AnimatePresence>
            {checked && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15, type: 'spring', stiffness: 500 }}
                viewBox="0 0 10 8"
                fill="none"
                className="w-3 h-3"
              >
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            )}
          </AnimatePresence>
        </button>
      </div>
      <label htmlFor={id} className="cursor-pointer">
        <span className="text-[13px] font-sans text-slate-300 font-medium">{label}</span>
        {description && <p className="text-[11.5px] text-slate-500 font-sans mt-0.5">{description}</p>}
        {error && <p className="text-[11.5px] text-rose-400 font-sans mt-0.5">{error}</p>}
      </label>
    </div>
  );
};

// ─── RadioGroup ───────────────────────────────────────────────────────────────

interface RadioOption {
  value:       string;
  label:       string;
  description?:string;
  disabled?:   boolean;
}

interface RadioGroupProps {
  options:    RadioOption[];
  value:      string;
  onChange:   (value: string) => void;
  name:       string;
  error?:     string;
  layout?:    'vertical' | 'horizontal';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options, value, onChange, name, error, layout = 'vertical',
}) => (
  <div>
    <div className={`flex ${layout === 'horizontal' ? 'flex-row gap-4 flex-wrap' : 'flex-col gap-2'}`}>
      {options.map(opt => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange(opt.value)}
            className={`flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-colors duration-150 disabled:opacity-50
              ${isSelected
                ? 'bg-brand-purple/10 border-brand-purple/40'
                : 'bg-white/[0.03] border-white/[0.09] hover:border-white/[0.18]'
              }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors
              ${isSelected ? 'border-brand-purple' : 'border-white/[0.25]'}`}>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-brand-purple"
                />
              )}
            </div>
            <div>
              <p className={`text-[13px] font-sans font-medium ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                {opt.label}
              </p>
              {opt.description && (
                <p className="text-[11.5px] text-slate-600 font-sans mt-0.5 leading-relaxed">{opt.description}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
    {error && <p className="mt-1.5 text-[11.5px] text-rose-400 font-sans flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
  </div>
);
