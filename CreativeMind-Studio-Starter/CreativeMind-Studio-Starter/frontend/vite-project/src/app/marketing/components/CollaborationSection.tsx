/**
 * CollaborationSection — Section 10: Team Collaboration
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, Users } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const COLLABORATORS = [
  { id: 1, name: 'Alex Chen', initials: 'AC', color: '#7C3AED', role: 'Creative Director', section: 'Script', online: true },
  { id: 2, name: 'Maya Okafor', initials: 'MO', color: '#3B82F6', role: 'Research Lead', section: 'Research Lab', online: true },
  { id: 3, name: 'Jordan Kim', initials: 'JK', color: '#10B981', role: 'Editor', section: 'Editor', online: true },
  { id: 4, name: 'Sam Rivera', initials: 'SR', color: '#F59E0B', role: 'Strategist', section: 'Strategy Room', online: false },
];

const COMMENTS_FEED = [
  {
    id: 1, author: 'Maya Okafor', initials: 'MO', color: '#3B82F6', time: '1m',
    message: 'The Gartner citation needs a more recent date — I\'ll swap it with the 2024 report.',
    type: 'human',
  },
  {
    id: 2, author: 'Research Advisor AI', initials: 'RA', color: '#9D6CFF', time: '2m',
    message: 'Updated: Gartner 2024 source confirms the 43% productivity claim. Confidence: 94%.',
    type: 'agent',
  },
  {
    id: 3, author: 'Alex Chen', initials: 'AC', color: '#7C3AED', time: '4m',
    message: 'Great. Can we also tighten the hook in Scene 1? It\'s running 8 seconds before value delivery.',
    type: 'human',
  },
  {
    id: 4, author: 'Creative Director AI', initials: 'CD', color: '#7C3AED', time: '4m',
    message: 'Generating 3 hook variants now. Will have them ready in ~45 seconds.',
    type: 'agent',
  },
  {
    id: 5, author: 'Jordan Kim', initials: 'JK', color: '#10B981', time: '6m',
    message: 'Timeline is locked. Sent to review for final brand safety check.',
    type: 'human',
  },
];

export const CollaborationSection: React.FC = () => {
  const [activeComment, setActiveComment] = useState<number | null>(null);
  const [typingAgent, setTypingAgent] = useState(false);

  useEffect(() => {
    const t1 = setInterval(() => {
      setTypingAgent(true);
      setTimeout(() => setTypingAgent(false), 2000);
    }, 5000);
    return () => clearInterval(t1);
  }, []);

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/05 blur-[120px]" />
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
            Team Collaboration
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Your team and AI. In the same room.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Human collaborators and AI agents share the same context, communicate in real-time, and move the project forward together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collaborators panel */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease }}
              className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-[#3B82F6]" />
                <h4 className="text-[13px] font-semibold text-white">Online Now</h4>
                <span className="ml-auto text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-2 py-0.5 rounded-full">
                  {COLLABORATORS.filter(c => c.online).length} active
                </span>
              </div>

              <div className="space-y-3">
                {COLLABORATORS.map((collab, i) => (
                  <motion.div
                    key={collab.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold font-mono"
                        style={{
                          background: `linear-gradient(135deg, ${collab.color}30, ${collab.color}15)`,
                          color: collab.color,
                          border: `1px solid ${collab.color}30`,
                        }}
                      >
                        {collab.initials}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0B0B12] ${
                        collab.online ? 'bg-[#10B981]' : 'bg-slate-700'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-white truncate">{collab.name}</p>
                      <p className="text-[10px] text-slate-600 font-mono truncate">
                        {collab.online ? `In ${collab.section}` : 'Away'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI agents presence */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1, ease }}
              className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-4 h-4 text-[#7C3AED]" />
                <h4 className="text-[13px] font-semibold text-white">AI Agents</h4>
                <span className="ml-auto text-[10px] font-mono text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-2 py-0.5 rounded-full">
                  6 active
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Creative Director', status: 'Generating hooks', color: '#7C3AED' },
                  { name: 'Research Advisor', status: 'Source verification', color: '#F59E0B' },
                  { name: 'Risk Critic', status: 'Idle', color: '#EF4444' },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${agent.color}15` }}
                    >
                      <Bot className="w-3 h-3" style={{ color: agent.color }} />
                    </div>
                    <span className="text-[11px] text-slate-400 flex-1">{agent.name}</span>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'Idle' ? 'bg-slate-600' : 'bg-[#10B981] animate-pulse'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Comments feed */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease }}
              className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl overflow-hidden h-full"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
                <MessageCircle className="w-4 h-4 text-slate-500" />
                <h4 className="text-[13px] font-semibold text-white">Project Thread</h4>
                <span className="text-[10px] font-mono text-slate-600 ml-1">Script · Scene 1</span>
                <div className="ml-auto flex -space-x-1.5">
                  {COLLABORATORS.filter(c => c.online).map((c) => (
                    <div
                      key={c.id}
                      className="w-6 h-6 rounded-full border-2 border-[#10101A] text-[9px] font-bold font-mono flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${c.color}40, ${c.color}20)`, color: c.color }}
                    >
                      {c.initials}
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 overflow-y-auto max-h-80">
                {COMMENTS_FEED.map((comment, i) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    onClick={() => setActiveComment(comment.id === activeComment ? null : comment.id)}
                    className={`flex gap-3 group cursor-pointer rounded-xl p-2 -m-2 transition-colors ${
                      activeComment === comment.id ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold font-mono border ${
                        comment.type === 'agent' ? 'border-dashed' : ''
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${comment.color}25, ${comment.color}12)`,
                        borderColor: `${comment.color}40`,
                        color: comment.color,
                      }}
                    >
                      {comment.type === 'agent' ? (
                        <Bot className="w-3.5 h-3.5" />
                      ) : (
                        comment.initials
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-semibold text-white">{comment.author}</span>
                        {comment.type === 'agent' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/20 text-[#9D6CFF]">
                            AI
                          </span>
                        )}
                        <span className="text-[10px] text-slate-600 font-mono ml-auto">{comment.time} ago</span>
                      </div>
                      <p className="text-[13px] text-slate-400 leading-relaxed">{comment.message}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {typingAgent && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#7C3AED]/15 border border-dashed border-[#7C3AED]/30 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-[#9D6CFF]" />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Compose bar */}
              <div className="px-5 py-4 border-t border-white/[0.05]">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  <span className="text-[13px] text-slate-600">Reply to thread…</span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-700">@mention</span>
                    <span className="text-[10px] font-mono text-slate-700">/ai</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
