import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

// 1. Alert Component
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'info' | 'error';
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
  ...props
}) => {
  const configs = {
    success: {
      bg: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
      defaultTitle: 'Task Executed Successfully',
    },
    warning: {
      bg: 'bg-amber-950/20 border-amber-500/30 text-amber-300',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      defaultTitle: 'Attention Required',
    },
    info: {
      bg: 'bg-brand-purple/10 border-brand-purple/30 text-slate-300',
      icon: <Info className="w-5 h-5 text-brand-electric shrink-0" />,
      defaultTitle: 'System Notification',
    },
    error: {
      bg: 'bg-rose-950/20 border-rose-500/30 text-rose-300',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      defaultTitle: 'Process Exception',
    },
  };

  const current = configs[variant];

  return (
    <div
      className={`border rounded-2xl p-4 flex gap-3 backdrop-blur-md shadow-md relative overflow-hidden ${current.bg} ${className}`}
      {...props}
    >
      {/* Small edge accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current opacity-80`} />
      
      {current.icon}

      <div className="flex-1 flex flex-col gap-1">
        <h4 className="text-xs font-bold font-sans tracking-wide text-slate-100">
          {title || current.defaultTitle}
        </h4>
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 shrink-0 self-start cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// 2. Tooltip Component
export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute z-50 hidden group-hover:block whitespace-nowrap bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-mono tracking-wide px-2.5 py-1.5 rounded-lg shadow-glass pointer-events-none ${positions[position]}`}>
        {content}
        {/* Little notch arrow */}
        <div className={`absolute w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 ${
          position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' :
          position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2' :
          position === 'left' ? 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2' :
          'right-full top-1/2 translate-x-1/2 -translate-y-1/2'
        }`} />
      </div>
    </div>
  );
};

// 3. Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = "System Workspace",
  children,
  footer,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`w-full ${sizeClasses[size]} bg-slate-950/90 border border-slate-800/80 rounded-2xl shadow-glass flex flex-col overflow-hidden relative`}
          >
            {/* Top decorative gradient line */}
            <div className="h-1 bg-gradient-to-r from-brand-violet via-brand-purple to-cyan-500" />

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-100 text-sm tracking-wider uppercase">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[60vh] text-sm text-slate-300 leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-800/60 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 4. Toast System (Individual Alert Toast)
export interface ToastItem {
  id: string;
  message: string;
  variant?: 'success' | 'error' | 'info';
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const configs = {
    success: 'bg-emerald-950 border-emerald-500/40 text-emerald-200',
    error: 'bg-rose-950 border-rose-500/40 text-rose-200',
    info: 'bg-slate-950 border-slate-800 text-slate-200',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`border rounded-xl px-4 py-3 shadow-glass flex items-center gap-3 w-80 text-xs backdrop-blur-xl ${configs[toast.variant || 'info']}`}
    >
      <div className="flex-1 font-sans">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
