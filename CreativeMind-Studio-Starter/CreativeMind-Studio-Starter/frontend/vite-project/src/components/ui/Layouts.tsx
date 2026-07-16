import React from 'react';
import { ArrowLeft } from 'lucide-react';

// 1. Section Container
export interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  padded = true,
  className = '',
  ...props
}) => {
  return (
    <section
      className={`w-full max-w-7xl mx-auto ${padded ? 'px-6 py-8 md:py-12' : ''} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

// 2. Page Header
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  onBack,
  actions,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/60 pb-6 mb-8 ${className}`}
      {...props}
    >
      <div className="flex items-start gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="mt-1 p-2 text-slate-400 hover:text-white transition-colors rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-3 self-start md:self-center">
          {actions}
        </div>
      )}
    </div>
  );
};

// 3. Divider
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  gradient = false,
  label,
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full py-4 ${className}`} {...props}>
      <div className="flex-grow h-[1px]">
        {gradient ? (
          <div className="w-full h-full bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        ) : (
          <div className="w-full h-full bg-slate-800/80" />
        )}
      </div>

      {label && (
        <span className="mx-4 text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 whitespace-nowrap bg-brand-bg px-2">
          {label}
        </span>
      )}

      {label && (
        <div className="flex-grow h-[1px]">
          {gradient ? (
            <div className="w-full h-full bg-gradient-to-r from-slate-800 via-slate-800 to-transparent" />
          ) : (
            <div className="w-full h-full bg-slate-800/80" />
          )}
        </div>
      )}
    </div>
  );
};
