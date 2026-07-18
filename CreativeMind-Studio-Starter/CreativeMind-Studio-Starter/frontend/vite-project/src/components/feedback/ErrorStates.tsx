/**
 * ErrorStates.tsx — Error, unauthorized, offline, retry, and partial data states
 *
 * Named exports:
 *   ErrorState          — base component (accepts any ErrorType)
 *   NetworkError        — connection lost
 *   ApiError            — generic 5xx / API failure
 *   UnauthorizedError   — 401/403
 *   NotFoundError       — 404
 *   ServerError         — 500
 *   OfflineState        — browser is offline
 *   PartialDataState    — data loaded with warnings
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  WifiOff, ServerCrash, ShieldOff, SearchX, AlertTriangle,
  RefreshCw, ArrowLeft, Home, Wifi,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ErrorType =
  | 'network'
  | 'api'
  | 'unauthorized'
  | 'not-found'
  | 'server';

interface ErrorConfig {
  icon:        React.ReactNode;
  iconBg:      string;
  iconColor:   string;
  title:       string;
  description: string;
  code?:       string;
}

const ERROR_CONFIG: Record<ErrorType, ErrorConfig> = {
  network: {
    icon:        <WifiOff />,
    iconBg:      'bg-slate-500/10',
    iconColor:   'text-slate-400',
    title:       'Connection Lost',
    description: 'Unable to reach the server. Check your internet connection and try again.',
    code:        'ERR_NETWORK',
  },
  api: {
    icon:        <AlertTriangle />,
    iconBg:      'bg-amber-500/10',
    iconColor:   'text-amber-400',
    title:       'Request Failed',
    description: 'The server returned an unexpected response. This might be temporary — try again in a moment.',
    code:        'ERR_API',
  },
  unauthorized: {
    icon:        <ShieldOff />,
    iconBg:      'bg-rose-500/10',
    iconColor:   'text-rose-400',
    title:       'Access Denied',
    description: "You don't have permission to view this resource. Contact your workspace admin for access.",
    code:        '401 / 403',
  },
  'not-found': {
    icon:        <SearchX />,
    iconBg:      'bg-blue-500/10',
    iconColor:   'text-blue-400',
    title:       'Not Found',
    description: 'The resource you requested could not be found. It may have been moved or deleted.',
    code:        '404',
  },
  server: {
    icon:        <ServerCrash />,
    iconBg:      'bg-rose-500/10',
    iconColor:   'text-rose-400',
    title:       'Server Error',
    description: "Something went wrong on our end. We've been notified and are working on a fix.",
    code:        '500',
  },
};

// ─── Base ErrorState ──────────────────────────────────────────────────────────

export interface ErrorStateProps {
  type?:          ErrorType;
  /** Override default title */
  title?:         string;
  /** Override default description */
  description?:   string;
  onRetry?:       () => void;
  onBack?:        () => void;
  onHome?:        () => void;
  /** Show error code badge */
  showCode?:      boolean;
  isRetrying?:    boolean;
  className?:     string;
  compact?:       boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'api',
  title,
  description,
  onRetry,
  onBack,
  onHome,
  showCode = true,
  isRetrying = false,
  className = '',
  compact = false,
}) => {
  const cfg = ERROR_CONFIG[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      className={`flex flex-col items-center justify-center text-center
        ${compact ? 'py-10 px-6' : 'py-20 px-8'}
        ${className}`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className={`flex items-center justify-center rounded-2xl border border-white/[0.08]
          ${cfg.iconBg} ${compact ? 'w-14 h-14 mb-4' : 'w-20 h-20 mb-6'}`}
      >
        <div className={`${cfg.iconColor} ${compact ? 'w-6 h-6' : 'w-9 h-9'}`}>
          {cfg.icon}
        </div>
      </motion.div>

      {/* Code badge */}
      {showCode && cfg.code && (
        <span className="text-[10px] font-mono font-semibold tracking-widest uppercase text-slate-600 bg-white/[0.04] border border-white/[0.07] rounded-md px-2 py-0.5 mb-3">
          {cfg.code}
        </span>
      )}

      <h3 className={`font-display font-semibold text-slate-200 mb-2
        ${compact ? 'text-sm' : 'text-base'}`}>
        {title ?? cfg.title}
      </h3>

      <p className={`text-slate-500 font-sans max-w-sm leading-relaxed
        ${compact ? 'text-xs' : 'text-sm'}`}>
        {description ?? cfg.description}
      </p>

      {/* Actions */}
      {(onRetry || onBack || onHome) && (
        <div className={`flex items-center gap-3 flex-wrap justify-center ${compact ? 'mt-4' : 'mt-6'}`}>
          {onRetry && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onRetry}
              disabled={isRetrying}
              className={`inline-flex items-center gap-2 font-sans font-semibold bg-brand-purple/90 hover:bg-brand-purple text-white rounded-xl transition-colors duration-150 disabled:opacity-60
                ${compact ? 'text-xs px-3.5 py-2' : 'text-sm px-5 py-2.5'}`}
            >
              <RefreshCw className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying…' : 'Try Again'}
            </motion.button>
          )}
          {onBack && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onBack}
              className={`inline-flex items-center gap-2 font-sans font-medium text-slate-400 hover:text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-xl transition-colors duration-150
                ${compact ? 'text-xs px-3.5 py-2' : 'text-sm px-5 py-2.5'}`}
            >
              <ArrowLeft className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
              Go Back
            </motion.button>
          )}
          {onHome && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onHome}
              className={`inline-flex items-center gap-2 font-sans font-medium text-slate-400 hover:text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-xl transition-colors duration-150
                ${compact ? 'text-xs px-3.5 py-2' : 'text-sm px-5 py-2.5'}`}
            >
              <Home className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
              Dashboard
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ─── Typed presets ─────────────────────────────────────────────────────────────

export const NetworkError: React.FC<Omit<ErrorStateProps, 'type'>> = (p) =>
  <ErrorState {...p} type="network" />;

export const ApiError: React.FC<Omit<ErrorStateProps, 'type'>> = (p) =>
  <ErrorState {...p} type="api" />;

export const UnauthorizedError: React.FC<Omit<ErrorStateProps, 'type'>> = (p) =>
  <ErrorState {...p} type="unauthorized" />;

export const NotFoundError: React.FC<Omit<ErrorStateProps, 'type'>> = (p) =>
  <ErrorState {...p} type="not-found" />;

export const ServerError: React.FC<Omit<ErrorStateProps, 'type'>> = (p) =>
  <ErrorState {...p} type="server" />;

// ─── Offline State ─────────────────────────────────────────────────────────────

interface OfflineStateProps {
  onRetry?: () => void;
  className?: string;
}

export const OfflineState: React.FC<OfflineStateProps> = ({ onRetry, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.22 }}
    className={`flex items-center gap-3 px-4 py-3 bg-[#1A1500] border border-amber-500/25 rounded-xl ${className}`}
  >
    <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-amber-200 font-sans">You're offline</p>
      <p className="text-[11.5px] text-amber-400/70 font-sans">
        Some features may be unavailable. Changes will sync when connection is restored.
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11.5px] font-semibold font-sans text-amber-300 hover:text-amber-100 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg px-3 py-1.5 transition-colors duration-150"
      >
        <Wifi className="w-3.5 h-3.5" />
        Reconnect
      </button>
    )}
  </motion.div>
);

// ─── Partial Data State ────────────────────────────────────────────────────────

interface PartialDataStateProps {
  message?:    string;
  missingPct?: number; // 0–100
  onRetry?:    () => void;
  className?:  string;
}

export const PartialDataState: React.FC<PartialDataStateProps> = ({
  message = 'Some data could not be loaded.',
  missingPct,
  onRetry,
  className = '',
}) => (
  <div className={`flex items-center gap-3 px-4 py-3 bg-[#100E00] border border-amber-500/20 rounded-xl ${className}`}>
    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[12.5px] font-medium text-amber-300 font-sans">{message}</p>
      {missingPct !== undefined && (
        <p className="text-[11px] text-amber-400/60 font-mono mt-0.5">
          {100 - missingPct}% loaded · {missingPct}% unavailable
        </p>
      )}
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex-shrink-0 text-[11.5px] font-semibold text-amber-400 hover:text-amber-200 transition-colors font-sans"
      >
        Retry
      </button>
    )}
  </div>
);
