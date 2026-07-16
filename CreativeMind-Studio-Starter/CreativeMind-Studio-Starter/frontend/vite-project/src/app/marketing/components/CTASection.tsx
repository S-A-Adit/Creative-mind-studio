/**
 * CTASection — Section 13: Final call-to-action
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

export const CTASection: React.FC = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/04 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#7C3AED]/12 blur-[100px]" />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease }}
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9D6CFF] border border-[#8B5CF6]/40 shadow-[0_0_40px_rgba(124,58,237,0.4)] mb-8 mx-auto">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <h2 className="font-display font-bold text-4xl md:text-6xl text-white tracking-tight leading-tight mb-6">
            Create your first{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #9D6CFF 50%, #6366F1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              intelligent
            </span>{' '}
            creative project.
          </h2>

          <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Join 12,000+ teams who've replaced fragmented creative chaos with a single, structured, AI-powered workspace. Start free. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.02, boxShadow: '0 8px 40px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[16px] font-bold shadow-[0_4px_24px_rgba(124,58,237,0.35)] transition-shadow"
            >
              Start a Creative Project
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white text-[16px] font-medium hover:bg-white/[0.08] hover:border-white/[0.16] transition-all"
            >
              Schedule a Demo
            </motion.a>
          </div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2, ease }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-[12px] text-slate-600 font-mono"
          >
            {[
              '14-day free trial',
              'No credit card',
              'Cancel anytime',
              'SOC 2 Type II',
              '99.9% uptime SLA',
            ].map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 && <span className="hidden sm:block text-slate-800">·</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
