/**
 * AIAgentActivity — live AI agent status cards with animated progress and typing indicators.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap } from 'lucide-react';
import type { AgentStatus } from '../hooks/useDashboardData';

const ease = [0.22, 1, 0.36, 1] as const;

// Typing dots animation
const ThinkingDots: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex items-center gap-0.5">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="inline-block w-1 h-1 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
      />
    ))}
  </div>
);

const STATUS_CONFIG = {
  active: { dot: 'bg-emerald-500', label: 'Active', pulse: true },
  thinking: { dot: 'bg-[#7C3AED]', label: 'Thinking', pulse: true },
  idle: { dot: 'bg-slate-600', label: 'Idle', pulse: false },
  waiting: { dot: 'bg-amber-500', label: 'Waiting', pulse: false },
} as const;

const AgentCard: React.FC<{ agent: AgentStatus; index: number }> = ({ agent, index }) => {
  const [currentMessage, setCurrentMessage] = useState(agent.task);
  const cfg = STATUS_CONFIG[agent.status];

  // Cycle task messages for active/thinking agents
  useEffect(() => {
    if (agent.status === 'idle' || agent.status === 'waiting') return;
    const t = setInterval(() => {
      setCurrentMessage(agent.task);
    }, 3000);
    return () => clearInterval(t);
  }, [agent.task, agent.status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`group relative rounded-2xl border p-4 overflow-hidden transition-all duration-200 ${
        agent.status === 'active' || agent.status === 'thinking'
          ? 'border-white/[0.12] bg-[#10101A]/90'
          : 'border-white/[0.06] bg-[#10101A]/60'
      }`}
    >
      {/* Active glow */}
      {(agent.status === 'active' || agent.status === 'thinking') && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ boxShadow: `inset 0 0 0 1px ${agent.color}25` }}
        />
      )}

      {/* Top accent */}
      {(agent.status === 'active' || agent.status === 'thinking') && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${agent.color}60, transparent)` }}
        />
      )}

      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold font-mono border"
            style={{
              background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}15)`,
              borderColor: `${agent.color}40`,
              color: agent.color,
            }}
          >
            <Bot className="w-4.5 h-4.5" />
          </div>
          {/* Status dot */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#10101A] ${cfg.dot} ${
              cfg.pulse ? 'animate-pulse' : ''
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-display font-semibold text-[13px] text-white truncate">
              {agent.name}
            </h4>
          </div>
          <p className="text-[11px] text-slate-600 font-mono">{agent.role}</p>
        </div>

        {/* Status badge */}
        <span
          className="flex-shrink-0 flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border"
          style={{
            color: agent.status === 'thinking' ? '#9D6CFF' : agent.status === 'active' ? '#10B981' : agent.status === 'waiting' ? '#F59E0B' : '#475569',
            backgroundColor: agent.status === 'thinking' ? '#7C3AED15' : agent.status === 'active' ? '#10B98115' : agent.status === 'waiting' ? '#F59E0B15' : 'rgba(255,255,255,0.03)',
            borderColor: agent.status === 'thinking' ? '#7C3AED30' : agent.status === 'active' ? '#10B98130' : agent.status === 'waiting' ? '#F59E0B30' : 'rgba(255,255,255,0.06)',
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
          {cfg.label}
        </span>
      </div>

      {/* Current task */}
      <div className="min-h-[28px] mb-3">
        <AnimatePresence mode="wait">
          {agent.status === 'thinking' ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <ThinkingDots color={agent.color} />
              <span className="text-[11px] text-slate-500 font-mono italic">Processing…</span>
            </motion.div>
          ) : (
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[12px] text-slate-400 leading-relaxed"
            >
              {currentMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      {agent.status !== 'waiting' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wide">Progress</span>
            <span className="text-[10px] font-mono" style={{ color: agent.color }}>
              {agent.progress}%
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${agent.progress}%` }}
              transition={{ duration: 0.4, ease }}
              style={{ backgroundColor: agent.color }}
            />
          </div>
        </div>
      )}

      {/* Waiting state */}
      {agent.status === 'waiting' && (
        <div className="flex items-center gap-2 text-[11px] text-amber-500/70 font-mono">
          <Zap className="w-3 h-3" />
          Queued — awaiting upstream task
        </div>
      )}
    </motion.div>
  );
};

interface AIAgentActivityProps {
  agents: AgentStatus[];
}

export const AIAgentActivity: React.FC<AIAgentActivityProps> = ({ agents }) => {
  const activeCount = agents.filter(
    (a) => a.status === 'active' || a.status === 'thinking'
  ).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
            AI Agent Activity
          </h2>
          <p className="text-[12px] text-slate-500 font-mono mt-0.5">
            {activeCount} agents running now
          </p>
        </div>
        {/* Active pulse */}
        {activeCount > 0 && (
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#7C3AED]/12 border border-[#7C3AED]/20"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="text-[11px] text-[#9D6CFF] font-mono">{activeCount} active</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {agents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>
    </section>
  );
};
