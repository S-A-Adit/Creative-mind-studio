/**
 * AgentCard.tsx — Premium AI agent card for the Strategy War Room.
 *
 * Shows: Avatar · Name · Role · Status · Confidence · Contribution · Agreement · Focus
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Cpu,
  Zap,
  Clock,
  CheckCircle2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Minus,
  AlertTriangle,
} from 'lucide-react';
import type { StrategyAgent, AgentStatus } from '../types';

// ─── Shared ease ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Typing dots ──────────────────────────────────────────────────────────────
const ThinkingDots: React.FC<{ color: string }> = ({ color }) => (
  <span className="flex items-center gap-0.5">
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        className="w-1 h-1 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.2, 0.7] }}
        transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
      />
    ))}
  </span>
);

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG: Record<AgentStatus, {
  label: string;
  dotClass: string;
  icon: React.ReactNode;
}> = {
  thinking:   { label: 'Thinking',   dotClass: 'bg-violet-500 animate-pulse', icon: <Cpu className="w-3 h-3" /> },
  responding: { label: 'Responding', dotClass: 'bg-blue-500 animate-pulse',   icon: <Zap className="w-3 h-3" /> },
  reviewing:  { label: 'Reviewing',  dotClass: 'bg-amber-500 animate-pulse',  icon: <Eye className="w-3 h-3" /> },
  completed:  { label: 'Completed',  dotClass: 'bg-emerald-500',              icon: <CheckCircle2 className="w-3 h-3" /> },
  idle:       { label: 'Idle',       dotClass: 'bg-slate-600',                icon: <Minus className="w-3 h-3" /> },
  waiting:    { label: 'Waiting',    dotClass: 'bg-amber-500',                icon: <Clock className="w-3 h-3" /> },
};

const AGREEMENT_CFG = {
  agree:     { icon: <ThumbsUp className="w-3 h-3" />,    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', label: 'Agrees' },
  disagree:  { icon: <ThumbsDown className="w-3 h-3" />,  badge: 'text-red-400 bg-red-500/10 border-red-500/25',             label: 'Disagrees' },
  neutral:   { icon: <Minus className="w-3 h-3" />,       badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20',       label: 'Neutral' },
  partial:   { icon: <AlertTriangle className="w-3 h-3" />, badge: 'text-amber-400 bg-amber-500/10 border-amber-500/25',     label: 'Partial' },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface AgentCardProps {
  agent: StrategyAgent;
  index: number;
  isActive?: boolean;
  compact?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  index,
  isActive = false,
  compact = false,
}) => {
  const status = STATUS_CFG[agent.status];
  const agreement = AGREEMENT_CFG[agent.agreementLevel];
  const isLive = agent.status === 'thinking' || agent.status === 'responding';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.055, ease: EASE }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`
        relative flex flex-col gap-3 rounded-2xl border overflow-hidden
        transition-all duration-200
        ${compact ? 'p-3' : 'p-4'}
        ${isActive
          ? 'border-[#8B5CF6]/50 bg-[#7C3AED]/06 shadow-[0_0_24px_rgba(139,92,246,0.14)]'
          : 'border-white/[0.08] bg-[#10101A]/80 hover:border-white/[0.14] hover:bg-[#151521]/80'
        }
      `}
    >
      {/* Live accent line */}
      {isLive && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${agent.color}70, transparent)` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`${compact ? 'w-9 h-9 rounded-[10px]' : 'w-11 h-11 rounded-xl'} flex items-center justify-center border`}
            style={{
              background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
              borderColor: `${agent.color}${isLive ? '55' : '35'}`,
              borderStyle: isLive ? 'dashed' : 'solid',
              color: agent.color,
            }}
          >
            {isLive ? (
              <Bot className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
            ) : (
              <span className={`font-bold font-mono ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                {agent.initials}
              </span>
            )}
          </div>
          {/* Status dot */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B0B12] ${status.dotClass}`}
          />
        </div>

        {/* Name / role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-display font-semibold leading-tight text-slate-100 ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
              {agent.name}
            </p>
            {/* Agreement badge */}
            <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${agreement.badge}`}>
              {agreement.icon}
              {agreement.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{agent.role}</p>
        </div>

        {/* Status badge */}
        <div
          className="flex-shrink-0 flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border"
          style={{
            color: isLive ? agent.color : '#94A3B8',
            background: isLive ? `${agent.color}12` : 'rgba(255,255,255,0.03)',
            borderColor: isLive ? `${agent.color}30` : 'rgba(255,255,255,0.07)',
          }}
        >
          {isLive ? <ThinkingDots color={agent.color} /> : status.icon}
          {!compact && <span className="ml-1">{status.label}</span>}
        </div>
      </div>

      {!compact && (
        <>
          {/* Confidence + Contribution bars */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Confidence', value: agent.confidencePct },
              { label: 'Contribution', value: agent.contributionPct },
            ].map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wide">
                    {m.label}
                  </span>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: agent.color }}>
                    {m.value}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: agent.color }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.6, delay: index * 0.04 + 0.1, ease: EASE }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Current focus */}
          <AnimatePresence mode="wait">
            <motion.p
              key={agent.currentFocus}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-[11px] text-slate-500 leading-relaxed line-clamp-1 border-t border-white/[0.05] pt-2.5"
            >
              <span className="text-slate-700">Focus: </span>
              {agent.currentFocus}
            </motion.p>
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};
