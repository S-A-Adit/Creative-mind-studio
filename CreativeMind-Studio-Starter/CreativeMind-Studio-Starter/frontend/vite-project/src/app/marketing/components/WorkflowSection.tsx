/**
 * WorkflowSection — Section 2: Trusted Creative Workflow
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb, TrendingUp, FlaskConical, FileText,
  Film, Image, Scissors, CheckSquare, Send, BarChart3,
} from 'lucide-react';

const STEPS = [
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: 'Idea Capture',
    desc: 'Drop a raw idea, a URL, or a voice note — the system instantly parses intent.',
    color: '#7C3AED',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Strategy Room',
    desc: '6 AI agents debate angles, risks, audience fit, and optimal positioning.',
    color: '#8B5CF6',
  },
  {
    icon: <FlaskConical className="w-5 h-5" />,
    title: 'Research Lab',
    desc: 'Automated claim verification, source vetting, and evidence mapping.',
    color: '#6366F1',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Story & Script',
    desc: 'Narrative structure, hooks, captions, and voiceover scripts — in your brand voice.',
    color: '#4F46E5',
  },
  {
    icon: <Film className="w-5 h-5" />,
    title: 'Scene Planner',
    desc: 'Visual storyboard with timing, transitions, and B-roll suggestions.',
    color: '#3B82F6',
  },
  {
    icon: <Image className="w-5 h-5" />,
    title: 'Asset Room',
    desc: 'Rights-cleared media library with AI tagging and smart search.',
    color: '#06B6D4',
  },
  {
    icon: <Scissors className="w-5 h-5" />,
    title: 'Editor Workspace',
    desc: 'Timeline editor with AI-generated captions, transitions, and cuts.',
    color: '#10B981',
  },
  {
    icon: <CheckSquare className="w-5 h-5" />,
    title: 'Review & Approval',
    desc: 'Collaborative review with inline comments, version control, and brand checks.',
    color: '#F59E0B',
  },
  {
    icon: <Send className="w-5 h-5" />,
    title: 'Distribution',
    desc: 'One-click multi-platform publish with SEO and metadata optimization.',
    color: '#EF4444',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Performance',
    desc: 'Real-time analytics fed back into your next creative cycle automatically.',
    color: '#EC4899',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export const WorkflowSection: React.FC = () => {
  return (
    <section id="workflow" className="py-28 relative overflow-hidden">
      {/* Section glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#7C3AED]/06 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.35, ease }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-block mb-4 text-[11px] font-mono font-semibold tracking-widest uppercase text-[#9D6CFF]">
            Trusted Creative Workflow
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Every step. One workspace.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            From raw idea to published content — a structured pipeline that eliminates guesswork at every stage.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-[#7C3AED]/0 via-[#7C3AED]/30 to-[#7C3AED]/0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-3xl mx-auto">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.3, delay: i * 0.03, ease }}
                whileHover={{ x: 4 }}
                className="group relative flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-[#10101A]/60 backdrop-blur-sm hover:border-white/[0.12] hover:bg-[#151521]/80 transition-all duration-200"
              >
                {/* Step number */}
                <span className="absolute top-3 right-4 text-[11px] font-mono text-slate-700">
                  {(i + 1).toString().padStart(2, '0')}
                </span>

                {/* Icon */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: `${step.color}14`,
                    borderColor: `${step.color}30`,
                    color: step.color,
                  }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-white text-[15px] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>

                {/* Hover glow accent */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at left center, ${step.color}08 0%, transparent 70%)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
