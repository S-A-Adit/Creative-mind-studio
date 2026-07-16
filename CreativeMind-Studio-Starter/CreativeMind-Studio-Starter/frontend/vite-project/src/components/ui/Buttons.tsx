import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onDrag'
  | 'onDragCapture'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDragStart'
>;

export interface ButtonProps extends NativeButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-sans',
    md: 'text-sm px-5 py-2.5 rounded-xl gap-2 font-sans',
    lg: 'text-base px-6 py-3 rounded-2xl gap-2.5 font-sans tracking-wide',
  };

  const variantStyles = {
    primary: 'relative bg-gradient-to-r from-brand-violet to-brand-purple text-white border border-brand-purple/30 shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] overflow-hidden before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
    secondary: 'bg-brand-card/80 text-slate-200 border border-slate-700/50 hover:border-brand-purple/50 backdrop-blur-md hover:text-white hover:bg-slate-900/50 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)]',
    ghost: 'text-slate-400 hover:text-brand-electric hover:bg-brand-purple/10 border border-transparent',
    danger: 'bg-red-950/40 text-red-200 border border-red-500/30 hover:border-red-500/60 hover:bg-red-900/40 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  };

  return (
    <motion.button
      id={props.id || `btn-${variant}-${size}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex items-center">{leftIcon}</span>
      )}
      
      <span className="relative z-10">{children}</span>
      
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
      
      {/* Subtle shine effect for primary button */}
      {variant === 'primary' && !disabled && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite] pointer-events-none" />
      )}
    </motion.button>
  );
};

export interface IconButtonProps extends NativeButtonProps {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-purple/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const sizeStyles = {
    sm: 'p-1.5 h-8 w-8',
    md: 'p-2.5 h-10 w-10',
    lg: 'p-3.5 h-12 w-12 rounded-2xl',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-brand-violet to-brand-purple text-white border border-brand-purple/30 shadow-md',
    secondary: 'bg-brand-card/80 text-slate-300 border border-slate-700/50 hover:border-brand-purple/50 backdrop-blur-md hover:text-white',
    ghost: 'text-slate-400 hover:text-brand-electric hover:bg-brand-purple/10',
    danger: 'bg-red-950/40 text-red-200 border border-red-500/30 hover:border-red-500/60 hover:bg-red-900/40',
  };

  return (
    <motion.button
      id={props.id || `icon-btn-${variant}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon
      )}
    </motion.button>
  );
};
