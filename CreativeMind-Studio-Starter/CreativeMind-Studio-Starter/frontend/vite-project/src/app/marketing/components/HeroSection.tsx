/**
 * HeroSection — full-bleed landing hero with animated production pipeline.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Star, Users, Zap } from 'lucide-react';

const PIPELINE_STEPS = [
  { label: 'Idea', color: '#7C3AED' },
  { label: 'Strategy', color: '#8B5CF6' },
  { label: 'Research', color: '#6366F1' },
  { label: 'Script', color: '#4F46E5' },
  { label: 'Scenes', color: '#3B82F6' },
  { label: 'Assets', color: '#06B6D4' },
  { label: 'Editor', color: '#10B981' },
  { label: 'Review', color: '#F59E0B' },
  { label: 'Publish', color: '#EF4444' },
  { label: 'Performance', color: '#EC4899' },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'SOC 2 Type II' },
  { icon: <Star className="w-3.5 h-3.5" />, label: '4.9 / 5 Rating' },
  { icon: <Users className="w-3.5 h-3.5" />, label: '12,000+ Teams' },
  { icon: <Zap className="w-3.5 h-3.5" />, label: 'Zero Setup' },
];

const ease = [0.22, 1, 0.36, 1] as const;

// Animated node that travels down the pipeline
export const AgentNode: React.FC<{ delay: number; stepIndex: number }> = ({ delay, stepIndex }) => (
  <motion.div
    key={`node-${delay}`}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: [0, 1, 1, 0], y: [0, stepIndex * 56 + stepIndex * 4] }}
    transition={{ duration: 2.4, delay, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
    className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#7C3AED] border-2 border-[#9D6CFF] shadow-[0_0_8px_rgba(124,58,237,0.8)] z-20"
  />
);

// Single pipeline step card
const PipelineStep: React.FC<{
  label: string;
  color: string;
  index: number;
  activeIndex: number;
}> = ({ label, color, index, activeIndex }) => {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;

  return (
    <motion.div
      animate={{
        scale: isActive ? 1.04 : 1,
        opacity: isPast ? 0.5 : 1,
      }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{
            backgroundColor: isActive ? color : 'rgba(255,255,255,0.05)',
            boxShadow: isActive ? `0 0 16px ${color}60` : 'none',
            borderColor: isActive ? color : 'rgba(255,255,255,0.08)',
          }}
          transition={{ duration: 0.25 }}
          className="w-8 h-8 rounded-xl border flex items-center justify-center"
        >
          <span className="text-[10px] font-mono font-bold text-white">
            {(index + 1).toString().padStart(2, '0')}
          </span>
        </motion.div>
        {index < PIPELINE_STEPS.length - 1 && (
          <motion.div
            animate={{ backgroundColor: isPast ? color : 'rgba(255,255,255,0.06)' }}
            transition={{ duration: 0.25 }}
            className="w-px h-4 mt-1"
          />
        )}
      </div>
      <motion.span
        animate={{
          color: isActive ? '#F8FAFC' : isPast ? '#475569' : '#94A3B8',
          fontWeight: isActive ? 600 : 400,
        }}
        transition={{ duration: 0.2 }}
        className="text-sm font-sans"
      >
        {label}
      </motion.span>
      {isActive && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
        >
          Processing
        </motion.span>
      )}
    </motion.div>
  );
};

export const HeroSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#7C3AED]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/08 blur-[100px]" />
        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left column: copy ── */}
          <div className="flex flex-col gap-8">
            {/* Label badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/30 text-[#9D6CFF] text-xs font-semibold font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9D6CFF] animate-pulse" />
                AI Creative Operating System
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease }}
              className="space-y-2"
            >
              <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-[64px] leading-[1.08] tracking-tight text-white">
                Turn raw ideas into{' '}
                <span
                  className="relative"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #9D6CFF 50%, #6366F1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  production-ready
                </span>{' '}
                content.
              </h1>
            </motion.div>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease }}
              className="text-slate-400 text-lg leading-relaxed max-w-[480px]"
            >
              Validate the concept, research every claim, plan every scene, source every asset, collaborate with AI specialists, and publish with confidence — all inside one intelligent creative workspace.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease }}
              className="flex flex-wrap gap-3"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(124,58,237,0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[15px] font-semibold shadow-[0_4px_24px_rgba(124,58,237,0.35)] transition-shadow"
              >
                Start a Creative Project
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white text-[15px] font-medium hover:bg-white/[0.08] hover:border-white/[0.16] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center">
                  <Play className="w-3 h-3 text-[#9D6CFF] ml-0.5" />
                </div>
                Watch Product Demo
              </motion.a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25, ease }}
              className="flex flex-wrap gap-3"
            >
              {TRUST_BADGES.map((badge, i) => (
                <motion.span
                  key={badge.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.25 + i * 0.04 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 text-xs font-medium"
                >
                  <span className="text-[#9D6CFF]">{badge.icon}</span>
                  {badge.label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: pipeline preview ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
            className="relative"
          >
            {/* Outer glow frame */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-[#0B0B12]/80 backdrop-blur-xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
              {/* Header bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-[#10101A]/60">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
                  <span className="w-3 h-3 rounded-full bg-[#10B981]/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center px-3 gap-2 max-w-56">
                    <div className="w-3 h-3 rounded bg-[#7C3AED]/30" />
                    <span className="text-[10px] text-slate-600 font-mono">Production Pipeline</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-2 py-0.5 rounded-full animate-pulse">
                  Live
                </span>
              </div>

              {/* Pipeline body */}
              <div className="p-6 flex flex-col gap-2">
                {PIPELINE_STEPS.map((step, i) => (
                  <PipelineStep
                    key={step.label}
                    label={step.label}
                    color={step.color}
                    index={i}
                    activeIndex={activeStep}
                  />
                ))}
              </div>

              {/* Bottom status bar */}
              <div className="px-6 py-3 border-t border-white/[0.05] bg-[#10101A]/40 flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-mono">
                  ai-agents · 6 active
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[11px] text-[#10B981] font-mono">Processing</span>
                </div>
              </div>
            </div>

            {/* Floating AI agent badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-[#151521] border border-[#7C3AED]/40 rounded-xl px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#9D6CFF] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white">AI Orchestrator</p>
                  <p className="text-[10px] text-slate-500">Routing to Research Lab</p>
                </div>
              </div>
            </motion.div>

            {/* Floating completion badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute -bottom-4 -left-4 bg-[#151521] border border-white/[0.1] rounded-xl px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              >
                <p className="text-[11px] font-mono text-slate-400">
                  Step <span className="text-[#9D6CFF] font-semibold">{activeStep + 1}/10</span> — {PIPELINE_STEPS[activeStep].label}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
