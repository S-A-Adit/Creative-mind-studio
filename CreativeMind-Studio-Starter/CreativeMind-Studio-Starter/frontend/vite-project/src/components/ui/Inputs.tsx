import React, { useId } from 'react';
import { Search } from 'lucide-react';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  size = 'md',
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const sizeStyles = {
    sm: 'py-2 text-sm',
    md: 'py-2.5 text-sm',
    lg: 'py-3 text-base',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 font-sans tracking-wide">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-500 flex items-center justify-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full bg-slate-950/50 text-slate-200 border ${
            error
              ? 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/25'
              : 'border-slate-800/80 focus:border-brand-purple/60 focus:ring-brand-purple/20'
          } rounded-xl ${sizeStyles[size]} ${leftIcon ? 'pl-11' : 'pl-4'} ${rightIcon ? 'pr-11' : 'pr-4'} placeholder-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-slate-950/80 outline-none`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-slate-500 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-red-400 font-sans mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 font-sans mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 font-sans tracking-wide">
          {label}
        </label>
      )}

      <textarea
        id={inputId}
        rows={props.rows || 3}
        className={`w-full bg-slate-950/50 text-slate-200 text-sm border ${
          error
            ? 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/25'
            : 'border-slate-800/80 focus:border-brand-purple/60 focus:ring-brand-purple/20'
        } rounded-xl py-2.5 px-4 placeholder-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-slate-950/80 resize-none outline-none`}
        {...props}
      />

      {error ? (
        <p className="text-[11px] text-red-400 font-sans mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 font-sans mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 font-sans tracking-wide">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={inputId}
          className={`w-full bg-slate-950/60 text-slate-200 text-sm border ${
            error
              ? 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/25'
              : 'border-slate-800/80 focus:border-brand-purple/60 focus:ring-brand-purple/20'
          } rounded-xl py-2.5 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-slate-950/80 outline-none appearance-none cursor-pointer`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-950 text-slate-200">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
          ▼
        </div>
      </div>

      {error ? (
        <p className="text-[11px] text-red-400 font-sans mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 font-sans mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export interface SearchInputProps extends Omit<TextInputProps, 'onSearchChange'> {
  onSearchChange?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearchChange,
  className = '',
  value,
  onChange,
  ...props
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <TextInput
      type="text"
      className={className}
      leftIcon={<Search className="w-4 h-4 text-slate-500" />}
      placeholder={props.placeholder ?? 'Search components, tokens...'}
      onChange={handleInputChange}
      value={value}
      {...props}
    />
  );
};
