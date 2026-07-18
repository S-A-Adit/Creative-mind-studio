/**
 * StrategyRoomSection — Section 5: Multi-Agent Strategy Room preview
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Zap } from 'lucide-react';

const AGENTS = [
  {
    id: 'director',
    name: 'Creative Director',
    role: 'Vision & Narrative Lead',
    color: '#7C3AED',
    initials: 'CD',
    status: 'active' as const,
    messages: [
      'Analyzing concept alignment with brand positioning...',
      'The hook needs to front-load the tension. Restructure act one.',
      'Strong emotional arc detected. Recommending 3 scene variations.',
    ],
  },
  {
    id: 'critic',
    name: 'Risk Critic',
    role: 'Risk & Viability Analysis',
    color: '#EF4444',
    initials: 'RC',
    status: 'thinking' as const,
    messages: [
      'Identified 2 potential credibility gaps in the research layer.',
      'Competitor "TechFlow" published similar content 3 weeks ago.',
      'Revenue projection in Scene 4 needs verified sourcing.',
    ],
  },
  {
    id: 'audience',
    name: 'Audience Analyst',
    role: 'Demographic Intelligence',
    color: '#3B82F6',
    initials: 'AA',
    status: 'active' as const,
    messages: [
      'Target segment: 28–40 year old SaaS founders. Confidence: 94%.',
      'Peak engagement window: Tuesday–Thursday, 9–11am EST.',
      'Emotional resonance score: 87/100 for current angle.',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing Strategist',
    role: 'Growth & Distribution',
    color: '#10B981',
    initials: 'MS',
    status: 'active' as const,
    messages: [
      'LinkedIn and YouTube are the primary distribution channels.',
      'CTA positioning in first 30 seconds increases conversion by 43%.',
      'Recommend A/B testing 2 thumbnail variants for YouTube.',
    ],
  },
  {
    id: 'research',
    name: 'Research Advisor',
    role: 'Evidence & Sourcing',
    color: '#F59E0B',
    initials: 'RA',
    status: 'idle' as const,
    messages: [
      '14 primary sources verified. 2 flagged for recency.',
      'Gartner 2024 report corroborates the market growth claim.',
      'Missing citation on the "67% of teams" statistic — flagging.',
    ],
  },
  {
    id: 'ethics',
    name: 'Ethics Auditor',
    role: 'Brand Safety & Compliance',
    color: '#EC4899',
    initials: 'EA',
    status: 'active' as const,
    messages: [
      'Brand safety score: 96/100. No sensitive topics detected.',
      'Imagery selection cleared for all major platform guidelines.',
      'One claim could be perceived as comparative advertising — suggest revision.',
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const StatusDot: React.FC<{ status: 'active' | 'idle' | 'thinking' }> = ({ status }) => {
  const cfg = {
    active: 'bg-emerald-500',
    idle: 'bg-amber-500',
    thinking: 'bg-[#7C3AED] animate-pulse',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${cfg[status]}`} />;
};

const ThinkingDots: React.FC = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
      />
    ))}
  </div>
);

export const StrategyRoomSection: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<string>('director');
  const [messageIndex, setMessageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const newIndex = { ...prev };
        AGENTS.forEach((agent) => {
          newIndex[agent.id] = ((prev[agent.id] ?? 0) + 1) % agent.messages.length;
        });
        return newIndex;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const selected = AGENTS.find((a) => a.id === activeAgent) ?? AGENTS[0];

  return (
    <section id="strategy" className="py-28 relative overflow-hidden">
      {/* Bg glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-[#7C3AED]/08 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.35, ease }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="inline-block mb-4 text-[11px] font-mono font-semibold tracking-widest uppercase text-[#9D6CFF]">
            Multi-Agent Strategy Room
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Six AI minds. One strategy.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Specialized agents challenge your idea from every angle — strategy, risk, audience, ethics, research, and growth — before a single frame is produced.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent cards grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGENTS.map((agent, i) => {
              const isSelected = activeAgent === agent.id;
              const msgIdx = messageIndex[agent.id] ?? 0;
              return (
                <motion.button
                  key={agent.id}
                  type="button"
                  onClick={() => setActiveAgent(agent.id)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.04, ease }}
                  whileHover={{ y: -2 }}
                  className={`group relative w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-white/[0.15] bg-[#151521] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
                      : 'border-white/[0.06] bg-[#10101A]/60 hover:border-white/[0.1] hover:bg-[#10101A]'
                  }`}
                >
                  {/* Active border accent */}
                  {isSelected && (
                    <motion.div
                      layoutId="agent-accent"
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ boxShadow: `inset 0 0 0 1px ${agent.color}40, 0 0 24px ${agent.color}15` }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}

                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border text-sm font-bold font-mono"
                        style={{
                          background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}15)`,
                          borderColor: `${agent.color}40`,
                          color: agent.color,
                        }}
                      >
                        {agent.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate">{agent.name}</p>
                        <p className="text-[11px] text-slate-600 truncate">{agent.role}</p>
                      </div>
                    </div>
                    <StatusDot status={agent.status} />
                  </div>

                  {/* Message */}
                  <div className="min-h-[36px]">
                    {agent.status === 'thinking' && msgIdx % 2 === 0 ? (
                      <ThinkingDots />
                    ) : (
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${agent.id}-${msgIdx}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-[12px] text-slate-500 leading-relaxed line-clamp-2"
                        >
                          {agent.messages[msgIdx]}
                        </motion.p>
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Status badge */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <StatusDot status={agent.status} />
                    <span className="text-[10px] font-mono text-slate-600 capitalize">{agent.status}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected agent detail panel */}
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAgent}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, ease }}
                className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl overflow-hidden flex-1"
              >
                {/* Agent header */}
                <div
                  className="p-5 border-b border-white/[0.06]"
                  style={{ background: `linear-gradient(135deg, ${selected.color}15 0%, transparent 80%)` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border text-base font-bold font-mono"
                      style={{
                        background: `linear-gradient(135deg, ${selected.color}25, ${selected.color}12)`,
                        borderColor: `${selected.color}50`,
                        color: selected.color,
                      }}
                    >
                      {selected.initials}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-white text-[15px]">{selected.name}</h4>
                      <p className="text-[11px] text-slate-500">{selected.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusDot status={selected.status} />
                    <span className="text-[11px] font-mono text-slate-500 capitalize">{selected.status}</span>
                    <div className="w-px h-3 bg-white/[0.08]" />
                    <Sparkles className="w-3 h-3" style={{ color: selected.color }} />
                    <span className="text-[11px] font-mono" style={{ color: selected.color }}>AI Agent</span>
                  </div>
                </div>

                {/* Messages feed */}
                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest mb-2">Latest Activity</p>
                  {selected.messages.map((msg, i) => (
                    <motion.div
                      key={msg}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="flex gap-2.5"
                    >
                      <div
                        className="flex-shrink-0 mt-1 w-4 h-4 rounded flex items-center justify-center"
                        style={{ backgroundColor: `${selected.color}15` }}
                      >
                        <Bot className="w-2.5 h-2.5" style={{ color: selected.color }} />
                      </div>
                      <p className="text-[12px] text-slate-400 leading-relaxed">{msg}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Live indicator */}
            <div className="rounded-xl border border-white/[0.06] bg-[#10101A]/60 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/25 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#9D6CFF]" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white">Consensus in Progress</p>
                <p className="text-[11px] text-slate-500">6 agents actively deliberating</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
