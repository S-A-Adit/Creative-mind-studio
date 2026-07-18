/**
 * AgentActivity — live AI agent status cards with animated progress + typing indicators.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Cpu, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';
import type { AgentCard } from '../hooks/useDashboardData';

const ease = [0.22, 1, 0.36, 1] as const;

// Pulsing typing dots
const ThinkingDots: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex items-center gap-0.5 py-0.5">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1 h-1 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
        transition={{ duration: 0.85, delay: i * 0.18, repeat: Infinity }}
      />
    ))}
  </div>
);

const STATUS_META = {
  thinking: { label: 'Thinking',  dotClass: 'bg-[#7C3AED] animate-pulse', Icon: Cpu },
  working:  { label: 'Working',   dotClass: 'bg-emerald-500 animate-pulse', Icon: Zap },
  waiting:  { label: 'Waiting',   dotClass: 'bg-amber-500', Icon: Clock },
  done:     { label: 'Done',      dotClass: 'bg-emerald-500', Icon: CheckCircle2 },
  error:    { label: 'Needs attention', dotClass: 'bg-red-500', Icon: AlertCircle },
} as const;

interface AgentCardItemProps {
  agent: AgentCard;
  index: number;
  currentMessage: string;
}

const AgentCardItem: React.FC<AgentCardItemProps> = ({ agent, index, currentMessage }) => {
  const meta = STATUS_META[agent.status];
  const isActive = agent.status === 'thinking' || agent.status === 'working';
  const isError = agent.status === 'error';
  const isDone = agent.status === 'done';

  const borderColor = isError
    ? '#EF444425'
    : isDone
    ? '#10B98125'
    : isActive
    ? `${agent.color}30`
    : 'rgba(255,255,255,0.06)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group relative flex flex-col gap-3 p-4 rounded-2xl border bg-[#10101A]/80 backdrop-blur-sm overflow-hidden transition-all duration-200"
      style={{ borderColor }}
    >
      {/* Active glow inset */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${agent.color}20` }}
        />
      )}

      {/* Top accent line */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${agent.color}55, transparent)` }}
        />
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Agent avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}12)`,
              borderColor: `${agent.color}45`,
              color: agent.color,
            }}
          >
            <Bot className="w-4 h-4" />
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B0B12] ${meta.dotClass}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-[13px] text-white truncate leading-tight">
            {agent.name}
          </h4>
          <p className="text-[10px] text-slate-600 font-mono truncate">{agent.role}</p>
        </div>

        {/* Status badge */}
        <div
          className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border"
          style={{
            color: isError ? '#EF4444' : isDone ? '#10B981' : isActive ? agent.color : '#94A3B8',
            backgroundColor: isError ? '#EF444410' : isDone ? '#10B98110' : isActive ? `${agent.color}12` : 'rgba(255,255,255,0.03)',
            borderColor: isError ? '#EF444430' : isDone ? '#10B98130' : isActive ? `${agent.color}30` : 'rgba(255,255,255,0.07)',
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dotClass.split(' ').filter(c => c !== 'animate-pulse').join(' ')}`} />
          {meta.label}
        </div>
      </div>

      {/* Task / message */}
      <div className="min-h-[28px]">
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
              <span className="text-[11px] text-slate-500 font-mono italic">Thinking…</span>
            </motion.div>
          ) : (
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={`text-[12px] leading-relaxed ${isError ? 'text-red-300' : 'text-slate-400'}`}
            >
              {currentMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Progress */}
      {agent.status !== 'waiting' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-slate-700 font-mono uppercase tracking-wide">
              {agent.model}
            </span>
            <span
              className="text-[10px] font-mono font-semibold"
              style={{ color: isError ? '#EF4444' : isDone ? '#10B981' : agent.color }}
            >
              {agent.progress}%
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${agent.progress}%` }}
              transition={{ duration: 0.5, ease }}
              style={{
                backgroundColor: isError ? '#EF4444' : isDone ? '#10B981' : agent.color,
              }}
            />
          </div>
        </div>
      )}

      {agent.status === 'waiting' && (
        <div className="flex items-center gap-2 text-[11px] text-amber-400/70 font-mono">
          <Clock className="w-3 h-3" />
          Queued — awaiting upstream completion
        </div>
      )}
    </motion.div>
  );
};

interface AgentActivityProps {
  agents: AgentCard[];
  getAgentMessage: (agentId: string, messages: string[]) => string;
}

export const AgentActivity: React.FC<AgentActivityProps> = ({ agents, getAgentMessage }) => {
  const activeCount = agents.filter((a) => a.status === 'thinking' || a.status === 'working').length;

  return (
    <section aria-label="AI agent activity">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
            AI Agent Activity
          </h2>
          <p className="text-[12px] text-slate-500 font-mono mt-0.5">
            {activeCount} agents running · {agents.length} total
          </p>
        </div>
        {activeCount > 0 && (
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="text-[11px] text-[#9D6CFF] font-mono">{activeCount} live</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {agents.map((agent, i) => (
          <AgentCardItem
            key={agent.id}
            agent={agent}
            index={i}
            currentMessage={getAgentMessage(agent.id, agent.messages)}
          />
        ))}
      </div>
    </section>
  );
};
