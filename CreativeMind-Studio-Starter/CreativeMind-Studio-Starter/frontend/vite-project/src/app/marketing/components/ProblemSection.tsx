/**
 * ProblemSection — Section 3: Creative team challenges
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, SearchX, FileX, FolderOpen, Clock, ShieldOff,
} from 'lucide-react';

const PROBLEMS = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Weak Strategy',
    desc: 'Ideas go to production without competitive analysis or audience validation, wasting budget on content that misses the mark.',
    color: '#F59E0B',
    accent: 'amber',
  },
  {
    icon: <SearchX className="w-5 h-5" />,
    title: 'Poor Research',
    desc: 'Teams publish unverified claims that damage credibility and require costly corrections or takedowns.',
    color: '#EF4444',
    accent: 'red',
  },
  {
    icon: <FileX className="w-5 h-5" />,
    title: 'Missing Evidence',
    desc: 'No systematic way to track sources, fact-check statistics, or maintain an auditable evidence trail.',
    color: '#EC4899',
    accent: 'pink',
  },
  {
    icon: <FolderOpen className="w-5 h-5" />,
    title: 'Scattered Assets',
    desc: 'Files spread across Google Drive, Dropbox, Slack, and email — nobody knows which version is final.',
    color: '#6366F1',
    accent: 'indigo',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Slow Collaboration',
    desc: 'Feedback loops across tools add days to every revision cycle, killing momentum and burning team energy.',
    color: '#3B82F6',
    accent: 'blue',
  },
  {
    icon: <ShieldOff className="w-5 h-5" />,
    title: 'Copyright Risks',
    desc: 'Unlicensed media, uncredited sources, and brand safety violations create legal liability without warning.',
    color: '#10B981',
    accent: 'emerald',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.35, ease }}
          className="max-w-2xl mb-16"
        >
          <span className="inline-block mb-4 text-[11px] font-mono font-semibold tracking-widest uppercase text-[#EF4444]">
            The Problems Creative Teams Face
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            The chaos hiding inside your creative process.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            These aren't edge cases — they're the daily reality for most creative teams working without a unified system.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROBLEMS.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.05, ease }}
              whileHover={{ y: -4 }}
              className="group relative p-6 rounded-2xl border border-white/[0.06] bg-[#10101A]/70 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-200 overflow-hidden"
            >
              {/* Top glow line */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${problem.color}60, transparent)` }}
              />

              {/* Corner gradient */}
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, ${problem.color}15 0%, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border transition-all duration-200 group-hover:scale-110"
                style={{
                  backgroundColor: `${problem.color}12`,
                  borderColor: `${problem.color}25`,
                  color: problem.color,
                }}
              >
                {problem.icon}
              </div>

              {/* Text */}
              <h3 className="font-display font-semibold text-white text-[16px] mb-2.5 group-hover:text-white transition-colors">
                {problem.title}
              </h3>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                {problem.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom connector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3, ease }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm mb-4">
            CreativeMind Studio eliminates every single one of these.
          </p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(124,58,237,0.3)]"
          >
            See How It Works
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
