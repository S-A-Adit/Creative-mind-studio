import React from 'react';
import { motion } from 'framer-motion';

// 1. Badge
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate';
  outline?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  outline = false,
  className = '',
  ...props
}) => {
  const styles = {
    purple: outline 
      ? 'border border-brand-purple/40 text-brand-electric bg-brand-purple/5' 
      : 'bg-brand-purple/15 text-brand-electric border border-brand-purple/30',
    cyan: outline 
      ? 'border border-cyan-500/40 text-cyan-400 bg-cyan-500/5' 
      : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    emerald: outline 
      ? 'border border-emerald-500/40 text-emerald-400 bg-emerald-500/5' 
      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    amber: outline 
      ? 'border border-amber-500/40 text-amber-400 bg-amber-500/5' 
      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    rose: outline 
      ? 'border border-rose-500/40 text-rose-400 bg-rose-500/5' 
      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    slate: outline 
      ? 'border border-slate-700 text-slate-300 bg-slate-800/5' 
      : 'bg-slate-800/60 text-slate-300 border border-slate-700/50',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider font-sans uppercase ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// 2. Status Badge
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'online' | 'warning' | 'offline' | 'maintenance';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
  ...props
}) => {
  const statusConfig = {
    online: {
      dotColor: 'bg-emerald-500',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      defaultLabel: 'System Active',
    },
    warning: {
      dotColor: 'bg-amber-500',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      defaultLabel: 'High Load',
    },
    offline: {
      dotColor: 'bg-rose-500',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      defaultLabel: 'Service Halt',
    },
    maintenance: {
      dotColor: 'bg-cyan-500',
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      defaultLabel: 'Optimizing Engine',
    },
  };

  const current = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono border ${current.badgeClass} ${className}`}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dotColor}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dotColor}`} />
      </span>
      {label || current.defaultLabel}
    </span>
  );
};

// 3. Progress Bar
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = true,
  label,
  className = '',
  ...props
}) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`} {...props}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{label || "Execution Progress"}</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-900/80 border border-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-violet via-brand-purple to-brand-electric shadow-[0_0_10px_rgba(167,139,250,0.5)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// 4. Circular Progress
export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: number; // width/height in px
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 64,
  strokeWidth = 6,
  className = '',
  ...props
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} {...props}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-900 fill-none"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-brand-purple fill-none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      {/* Percentage Text overlay */}
      <span className="absolute text-xs font-mono font-bold text-slate-100">
        {clampedValue}%
      </span>
    </div>
  );
};

// 5. Loading Spinner
export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className={`relative ${className}`} {...props}>
      <div className={`${sizes[size]} rounded-full border-brand-purple/10 border-t-brand-electric animate-spin`} />
    </div>
  );
};
