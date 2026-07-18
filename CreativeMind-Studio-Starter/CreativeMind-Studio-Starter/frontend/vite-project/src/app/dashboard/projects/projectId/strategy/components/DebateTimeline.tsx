/**
 * DebateMessage.tsx + DebateTimeline.tsx
 *
 * Professional strategy discussion — NOT a chat interface.
 * Messages are laid out as a structured argument timeline
 * with visual connectors, references, and evidence tags.
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LinkIcon,
  AlertTriangle,
  CornerDownRight,
  Lightbulb,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Flag,
  MessageSquarePlus,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import type { DebateMessage, MessageType, StrategyAgent } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Message type config ──────────────────────────────────────────────────────

const MSG_TYPE_CFG: Record<MessageType, {
  icon: React.ReactNode;
  label: string;
  connectorColor: string;
  badgeClass: string;
}> = {
  proposal:   { icon: <Lightbulb className="w-3 h-3" />,         label: 'Proposal',    connectorColor: '#8B5CF6', badgeClass: 'text-violet-400 bg-violet-500/10 border-violet-500/25' },
  challenge:  { icon: <AlertTriangle className="w-3 h-3" />,      label: 'Challenge',   connectorColor: '#EF4444', badgeClass: 'text-red-400 bg-red-500/10 border-red-500/25' },
  response:   { icon: <MessageSquarePlus className="w-3 h-3" />,  label: 'Response',    connectorColor: '#3B82F6', badgeClass: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
  agreement:  { icon: <ThumbsUp className="w-3 h-3" />,           label: 'Agreement',   connectorColor: '#10B981', badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  objection:  { icon: <ThumbsDown className="w-3 h-3" />,         label: 'Objection',   connectorColor: '#EF4444', badgeClass: 'text-red-400 bg-red-500/10 border-red-500/25' },
  revision:   { icon: <RefreshCw className="w-3 h-3" />,          label: 'Revision',    connectorColor: '#F59E0B', badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/25' },
  pivot:      { icon: <Layers className="w-3 h-3" />,             label: 'Pivot',       connectorColor: '#EC4899', badgeClass: 'text-pink-400 bg-pink-500/10 border-pink-500/25' },
  synthesis:  { icon: <CheckCircle2 className="w-3 h-3" />,       label: 'Synthesis',   connectorColor: '#10B981', badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  flag:       { icon: <Flag className="w-3 h-3" />,               label: 'Flag',        connectorColor: '#F97316', badgeClass: 'text-orange-400 bg-orange-500/10 border-orange-500/25' },
};

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

// ─── Reference chip ───────────────────────────────────────────────────────────

const RefChip: React.FC<{
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick?: () => void;
}> = ({ icon, label, color, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono
      border transition-all duration-150 hover:brightness-110"
    style={{ color, background: color + '15', borderColor: color + '30' }}
  >
    {icon}
    {label}
  </button>
);

// ─── Single debate message ────────────────────────────────────────────────────

interface DebateMessageProps {
  message: DebateMessage;
  agents: StrategyAgent[];
  index: number;
  isLast: boolean;
  allMessages: DebateMessage[];
}

export const DebateMessageCard: React.FC<DebateMessageProps> = ({
  message,
  agents,
  index,
  isLast,
  allMessages,
}) => {
  const agent = agents.find(a => a.id === message.agentId);
  if (!agent) return null;

  const typeCfg = MSG_TYPE_CFG[message.type];
  const referencedMsg = allMessages.find(m => m.id === message.referencesMessageId);
  const referencedAgent = agents.find(a => a.id === referencedMsg?.agentId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, delay: index * 0.06, ease: EASE }}
      className="relative flex gap-4"
    >
      {/* ── Left: Avatar column ── */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 44 }}>
        {/* Agent avatar */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.15 }}
          className="w-10 h-10 rounded-xl border flex items-center justify-center text-[11px] font-bold font-mono flex-shrink-0 z-10"
          style={{
            background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
            borderColor: `${agent.color}45`,
            color: agent.color,
          }}
        >
          {agent.initials}
        </motion.div>

        {/* Connector line down */}
        {!isLast && (
          <div
            className="w-px flex-1 mt-1.5"
            style={{ background: `linear-gradient(180deg, ${typeCfg.connectorColor}50, transparent)` }}
          />
        )}
      </div>

      {/* ── Right: Content card ── */}
      <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-6'}`}>
        <div
          className={`
            rounded-[14px] border p-4 transition-all duration-200
            hover:border-white/[0.14] hover:bg-[#151521]/80
            ${message.type === 'flag'
              ? 'border-orange-500/25 bg-orange-500/04'
              : message.type === 'challenge' || message.type === 'objection'
              ? 'border-red-500/20 bg-[#10101A]/90'
              : message.type === 'agreement' || message.type === 'synthesis'
              ? 'border-emerald-500/18 bg-[#10101A]/90'
              : message.type === 'revision'
              ? 'border-amber-500/20 bg-[#10101A]/90'
              : 'border-white/[0.08] bg-[#10101A]/80'
            }
          `}
        >
          {/* Header */}
          <div className="flex items-start flex-wrap gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold text-slate-100">{agent.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">·</span>
                <span className="text-[11px] text-slate-500">{agent.role}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-700 font-mono">
                  {timeAgo(message.timestamp)}
                </span>
                <span className="text-[10px] text-slate-700 font-mono">
                  Round {message.round}
                </span>
              </div>
            </div>

            {/* Type badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border flex-shrink-0 ${typeCfg.badgeClass}`}>
              {typeCfg.icon}
              {typeCfg.label}
            </span>

            {/* Confidence badge */}
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border flex-shrink-0"
              style={{ color: agent.color, background: agent.color + '15', borderColor: agent.color + '30' }}
            >
              {message.confidence}% confidence
            </span>
          </div>

          {/* Reference to previous message */}
          {referencedMsg && referencedAgent && (
            <div className="flex items-start gap-2 mb-3 px-3 py-2 rounded-[9px] bg-white/[0.03] border border-white/[0.06]">
              <CornerDownRight className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-slate-600">
                  Responding to{' '}
                  <span className="font-semibold" style={{ color: referencedAgent.color }}>
                    {referencedAgent.name}
                  </span>
                  :
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 italic">
                  "{referencedMsg.message.slice(0, 80)}…"
                </p>
              </div>
            </div>
          )}

          {/* Message body */}
          <p className="text-[13px] text-slate-300 leading-relaxed">{message.message}</p>

          {/* Evidence tags */}
          {message.evidences.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/[0.05]">
              <span className="text-[10px] font-mono text-slate-700 self-center">
                <BookOpen className="w-3 h-3 inline mr-1" />Evidence:
              </span>
              {message.evidences.map(ev => (
                <span
                  key={ev.label}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                    text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08]"
                >
                  <LinkIcon className="w-2.5 h-2.5" />
                  {ev.label}
                  <span className="text-slate-700">· {ev.source}</span>
                </span>
              ))}
            </div>
          )}

          {/* Footer links */}
          <div className="flex flex-wrap gap-2 mt-3">
            {message.agreesWithId && (
              <RefChip
                icon={<ThumbsUp className="w-2.5 h-2.5" />}
                label={`Agrees with #${message.agreesWithId.slice(-3)}`}
                color="#10B981"
              />
            )}
            {message.objectsToId && (
              <RefChip
                icon={<ThumbsDown className="w-2.5 h-2.5" />}
                label={`Objects to #${message.objectsToId.slice(-3)}`}
                color="#EF4444"
              />
            )}
            {message.suggestedPivot && (
              <RefChip
                icon={<Lightbulb className="w-2.5 h-2.5" />}
                label={`Pivot: ${message.suggestedPivot.slice(0, 36)}…`}
                color="#F59E0B"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Typing indicator ────────────────────────────────────────────────────────

export const TypingIndicator: React.FC<{ agent: StrategyAgent }> = ({ agent }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.2 }}
    className="flex gap-4 items-center"
  >
    <div
      className="w-10 h-10 rounded-xl border flex items-center justify-center text-[11px] font-bold flex-shrink-0"
      style={{
        background: `${agent.color}25`,
        borderColor: `${agent.color}45`,
        borderStyle: 'dashed',
        color: agent.color,
      }}
    >
      {agent.initials}
    </div>
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-white/[0.07] bg-[#10101A]/80">
      <span className="text-[12px] text-slate-400">{agent.name} is formulating response</span>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: agent.color }}
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
            transition={{ duration: 0.8, delay: i * 0.18, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// ─── Debate Timeline ─────────────────────────────────────────────────────────

interface DebateTimelineProps {
  messages: DebateMessage[];
  agents: StrategyAgent[];
  activeAgents: StrategyAgent[];
}

export const DebateTimeline: React.FC<DebateTimelineProps> = ({
  messages,
  agents,
  activeAgents,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  return (
    <div className="flex flex-col gap-1">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <DebateMessageCard
            key={msg.id}
            message={msg}
            agents={agents}
            index={i}
            isLast={i === messages.length - 1 && activeAgents.length === 0}
            allMessages={messages}
          />
        ))}
      </AnimatePresence>

      {/* Typing indicators for live agents */}
      <AnimatePresence>
        {activeAgents.map(agent => (
          <TypingIndicator key={agent.id} agent={agent} />
        ))}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
};
