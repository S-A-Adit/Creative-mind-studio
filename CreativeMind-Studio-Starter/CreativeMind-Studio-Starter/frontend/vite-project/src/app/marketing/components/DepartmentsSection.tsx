/**
 * DepartmentsSection — Section 4: Product Departments
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, TrendingUp, FlaskConical, FileText, Film,
  Image, Scissors, CheckSquare, Send, BarChart3, ArrowRight,
} from 'lucide-react';

const DEPARTMENTS = [
  {
    id: 'lead',
    icon: <Crown className="w-5 h-5" />,
    title: 'Project Lead',
    subtitle: 'Orchestration Hub',
    desc: 'The command center. Set objectives, assign agents, track progress, and maintain creative direction across every phase of production.',
    color: '#7C3AED',
    features: ['Project timelines', 'Agent delegation', 'Status overview', 'Team notifications'],
  },
  {
    id: 'strategy',
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Strategy Room',
    subtitle: 'Multi-Agent Intelligence',
    desc: 'Six specialized AI agents collaborate in real-time to validate your concept, analyze your audience, and surface the optimal creative angle.',
    color: '#8B5CF6',
    features: ['6 AI agent debate', 'Audience analysis', 'Risk assessment', 'Angle optimization'],
  },
  {
    id: 'research',
    icon: <FlaskConical className="w-5 h-5" />,
    title: 'Research Lab',
    subtitle: 'Verified Intelligence',
    desc: 'Automated source discovery, claim verification, and evidence mapping. Every fact is traceable, every source is vetted.',
    color: '#6366F1',
    features: ['Source vetting', 'Claim verification', 'Evidence maps', 'Confidence scoring'],
  },
  {
    id: 'script',
    icon: <FileText className="w-5 h-5" />,
    title: 'Story & Script',
    subtitle: 'Narrative Architecture',
    desc: 'Brand-voice-matched scripts, hooks that retain attention, and structured narratives that drive your audience to action.',
    color: '#4F46E5',
    features: ['Brand voice tuning', 'Hook generation', 'Narrative structure', 'Voiceover scripts'],
  },
  {
    id: 'scenes',
    icon: <Film className="w-5 h-5" />,
    title: 'Scene Planner',
    subtitle: 'Visual Storyboarding',
    desc: 'Frame-by-frame visual planning with timing, B-roll suggestions, transitions, and on-screen text mapped to your script.',
    color: '#3B82F6',
    features: ['Visual storyboard', 'B-roll planning', 'Timing & pacing', 'Transition map'],
  },
  {
    id: 'assets',
    icon: <Image className="w-5 h-5" />,
    title: 'Asset Room',
    subtitle: 'Rights-Cleared Media',
    desc: 'A centralized media library with copyright verification, AI-powered tagging, and intelligent search across all your assets.',
    color: '#06B6D4',
    features: ['Copyright check', 'AI media tagging', 'Smart search', 'Version control'],
  },
  {
    id: 'editor',
    icon: <Scissors className="w-5 h-5" />,
    title: 'Editor Workspace',
    subtitle: 'Intelligent Timeline',
    desc: 'A professional timeline editor with auto-generated captions, AI-suggested cuts, and real-time preview — all in the browser.',
    color: '#10B981',
    features: ['Timeline editor', 'Auto captions', 'AI cut suggestions', 'Real-time preview'],
  },
  {
    id: 'review',
    icon: <CheckSquare className="w-5 h-5" />,
    title: 'Review & Approval',
    subtitle: 'Collaborative QA',
    desc: 'Inline comments, version history, brand safety checks, and a structured approval flow for every stakeholder.',
    color: '#F59E0B',
    features: ['Inline comments', 'Version history', 'Brand safety AI', 'Approval flows'],
  },
  {
    id: 'distribution',
    icon: <Send className="w-5 h-5" />,
    title: 'Distribution',
    subtitle: 'Multi-Platform Publish',
    desc: 'One-click publishing across YouTube, Instagram, TikTok, LinkedIn, and more — with platform-specific metadata and SEO.',
    color: '#EF4444',
    features: ['Multi-platform', 'SEO optimization', 'Scheduled publish', 'Thumbnail generation'],
  },
  {
    id: 'performance',
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Performance',
    subtitle: 'Analytics Loop',
    desc: 'Real-time performance data automatically fed back into your next creative project to continuously improve results.',
    color: '#EC4899',
    features: ['Retention graphs', 'AI insights', 'Optimization tips', 'Benchmarking'],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export const DepartmentsSection: React.FC = () => {
  const [activeDept, setActiveDept] = useState<string>('strategy');

  const active = DEPARTMENTS.find((d) => d.id === activeDept) ?? DEPARTMENTS[1];

  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/06 blur-[120px]" />
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
            Product Departments
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Every discipline. Fully connected.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Ten specialized workspaces, each purpose-built, all sharing the same data and creative context.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar navigation */}
          <div className="lg:col-span-2 flex flex-col gap-2 lg:max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
            {DEPARTMENTS.map((dept, i) => (
              <motion.button
                key={dept.id}
                type="button"
                onClick={() => setActiveDept(dept.id)}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.03, ease }}
                className={`group relative w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  activeDept === dept.id
                    ? 'bg-[#151521] border-white/[0.12] shadow-[0_2px_16px_rgba(0,0,0,0.3)]'
                    : 'border-transparent hover:bg-[#10101A]/60 hover:border-white/[0.06]'
                }`}
              >
                {/* Active indicator */}
                {activeDept === dept.id && (
                  <motion.div
                    layoutId="dept-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                    style={{ backgroundColor: dept.color }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}

                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                    activeDept === dept.id ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: activeDept === dept.id ? `${dept.color}20` : `${dept.color}0A`,
                    borderColor: activeDept === dept.id ? `${dept.color}40` : `${dept.color}15`,
                    color: activeDept === dept.id ? dept.color : '#64748B',
                  }}
                >
                  {React.cloneElement(dept.icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
                </div>

                <div className="min-w-0">
                  <p className={`text-[13px] font-semibold truncate transition-colors duration-200 ${
                    activeDept === dept.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                  }`}>
                    {dept.title}
                  </p>
                  <p className="text-[11px] text-slate-600 font-mono truncate">{dept.subtitle}</p>
                </div>

                <ArrowRight className={`ml-auto w-3.5 h-3.5 flex-shrink-0 transition-all duration-200 ${
                  activeDept === dept.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`} style={{ color: active.color }} />
              </motion.button>
            ))}
          </div>

          {/* Active department detail */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDept}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease }}
                className="relative h-full rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl overflow-hidden p-8"
              >
                {/* Background decoration */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${active.color} 0%, transparent 70%)` }}
                />

                {/* Icon large */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border mb-6"
                  style={{
                    backgroundColor: `${active.color}18`,
                    borderColor: `${active.color}35`,
                    color: active.color,
                  }}
                >
                  {React.cloneElement(active.icon as React.ReactElement, { className: 'w-7 h-7' })}
                </div>

                <p className="text-[11px] font-mono font-semibold tracking-widest uppercase mb-2"
                  style={{ color: active.color }}>
                  {active.subtitle}
                </p>

                <h3 className="font-display font-bold text-2xl text-white mb-4">
                  {active.title}
                </h3>

                <p className="text-slate-400 text-[15px] leading-relaxed mb-8">
                  {active.desc}
                </p>

                {/* Features list */}
                <div className="grid grid-cols-2 gap-3">
                  {active.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${active.color}18` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active.color }} />
                      </div>
                      <span className="text-[13px] text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${active.color}30, ${active.color}15)`,
                    borderColor: `${active.color}40`,
                  }}
                >
                  Explore {active.title}
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
