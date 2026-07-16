/**
 * FormField — enhanced input wrapper with label, error, and icon support.
 * Composes on the existing TextInput design tokens.
 */
import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  success?: boolean;
  placeholder?: string;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  placeholder,
  autoComplete,
  leftIcon,
  required,
  disabled,
}) => {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const borderCls = error
    ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20'
    : success
    ? 'border-emerald-500/40 focus:border-emerald-500/60 focus:ring-emerald-500/15'
    : 'border-slate-800/80 focus:border-[#7C3AED]/60 focus:ring-[#7C3AED]/20';

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-300 font-sans tracking-wide"
      >
        {label}
        {required && <span className="ml-0.5 text-[#7C3AED]">*</span>}
      </label>

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-slate-500 pointer-events-none flex items-center">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full bg-slate-950/50 text-slate-200 border ${borderCls} rounded-xl py-2.5 text-sm
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${isPassword || error || success ? 'pr-11' : 'pr-4'}
            placeholder-slate-600 transition-all duration-200
            focus:outline-none focus:ring-2 focus:bg-slate-950/80
            disabled:opacity-50 disabled:cursor-not-allowed`}
        />

        {/* Right slot: toggle / status */}
        <div className="absolute right-3.5 flex items-center gap-1">
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          {!isPassword && error && (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          {!isPassword && success && !error && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-[11px] text-red-400 font-sans mt-0.5"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
