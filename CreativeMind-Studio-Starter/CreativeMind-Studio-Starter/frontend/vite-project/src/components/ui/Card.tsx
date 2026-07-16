import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, ArrowDownRight, Bot, Cpu, Layers } from 'lucide-react';

type MotionDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
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

// 1. Glass Card
export interface GlassCardProps extends MotionDivProps {
  glow?: boolean;
  hoverGlow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glow = false,
  hoverGlow = true,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverGlow ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`relative bg-brand-card/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-glass transition-all duration-300
        ${glow ? 'shadow-glow-purple border-brand-purple/20' : ''}
        ${hoverGlow ? 'hover:border-brand-purple/30 hover:shadow-glow-purple' : ''}
        ${className}`}
      {...props}
    >
      {/* Decorative top glow border effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

// 2. Dashboard Card
export interface DashboardCardProps extends MotionDivProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  title,
  subtitle,
  action,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-brand-card/45 backdrop-blur-lg border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden shadow-lg ${className}`}
      {...props}
    >
      {/* Header */}
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
          <div>
            {title && <h3 className="font-display font-medium text-slate-100 text-sm tracking-wide">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Body */}
      <div className="p-6 flex-1">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-3.5 bg-slate-950/40 border-t border-slate-800/60 text-xs text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
};

// 3. Stat Card
export interface StatCardProps extends MotionDivProps {
  title: string;
  value: string | number;
  trend?: number; // percentage positive or negative
  trendLabel?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendLabel = "vs last month",
  icon,
  className = '',
  ...props
}) => {
  const isPositive = trend && trend >= 0;

  return (
    <GlassCard hoverGlow={true} className={`flex flex-col justify-between ${className}`} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase font-sans">
            {title}
          </span>
          <span className="text-3xl font-display font-bold text-white tracking-tight mt-1">
            {value}
          </span>
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-electric">
            {icon}
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-4 text-xs font-mono">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md gap-0.5 font-medium ${
            isPositive 
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
              : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {isPositive ? `+${trend}%` : `${trend}%`}
          </span>
          <span className="text-slate-500">{trendLabel}</span>
        </div>
      )}
    </GlassCard>
  );
};

// 4. Agent Card
export interface AgentCardProps extends MotionDivProps {
  name: string;
  role: string;
  model: string;
  status: 'active' | 'idle' | 'sleeping';
  avatarUrl?: string;
  isActive?: boolean;
  onToggleActive?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  role,
  model,
  status,
  isActive = true,
  onToggleActive,
  className = '',
  ...props
}) => {
  const statusColors = {
    active: 'bg-emerald-500 shadow-emerald-500/30',
    idle: 'bg-amber-500 shadow-amber-500/30',
    sleeping: 'bg-slate-600 shadow-slate-600/30',
  };

  return (
    <div
      className={`relative bg-slate-950/40 hover:bg-slate-950/60 border ${
        isActive ? 'border-brand-purple/40 shadow-glow-purple' : 'border-slate-800/80'
      } rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-purple flex items-center justify-center border border-white/10 text-white shadow-md">
              <Bot className="w-5 h-5 text-brand-electric" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-slate-950 shadow-sm animate-pulse ${statusColors[status]}`} />
          </div>
          <div>
            <h4 className="font-display font-medium text-slate-100 text-sm tracking-wide">{name}</h4>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
        </div>
        
        {/* Active Toggle */}
        <button
          onClick={onToggleActive}
          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
            isActive ? 'bg-brand-purple' : 'bg-slate-800'
          }`}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
            isActive ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/30 flex flex-col">
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase font-sans">Model Engine</span>
          <span className="text-xs font-mono font-medium text-slate-300 mt-0.5 truncate">{model}</span>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/30 flex flex-col">
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase font-sans">Response Latency</span>
          <span className="text-xs font-mono font-medium text-slate-300 mt-0.5">~1.2s avg</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-900/80 pt-3">
        <span className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-brand-purple" />
          Intellect: High
        </span>
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-brand-electric" />
          Mem-Buffer: Active
        </span>
      </div>
    </div>
  );
};

// 5. Feature Card
export interface FeatureCardProps extends MotionDivProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  badge,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`group relative bg-brand-card/30 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 hover:border-brand-purple/40 hover:shadow-glow-purple transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Absolute top right corner glow on hover */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-purple/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {badge && (
        <span className="absolute top-4 right-4 bg-brand-purple/15 text-brand-electric border border-brand-purple/30 text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full font-mono">
          {badge}
        </span>
      )}

      <div className="h-12 w-12 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:border-brand-purple/30 group-hover:bg-brand-purple/10 flex items-center justify-center text-slate-400 group-hover:text-brand-electric transition-all duration-300">
        {icon}
      </div>

      <h3 className="font-display font-semibold text-slate-100 text-base tracking-wide mt-4 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center gap-1.5 text-xs text-brand-electric font-medium mt-4 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
        <span>Explore API Documentation</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>
    </motion.div>
  );
};
