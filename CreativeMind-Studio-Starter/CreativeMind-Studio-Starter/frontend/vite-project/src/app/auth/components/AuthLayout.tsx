/**
 * AuthLayout — shared shell for all auth pages.
 *
 * Renders a full-viewport dark canvas with a centred glassmorphic card.
 * Background: deep navy with subtle radial violet glow + faint grid.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Optional wider card for onboarding wizard */
  wide?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, wide = false }) => {
  return (
    <div className="relative min-h-screen bg-[#07070A] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#7C3AED]/12 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-[#3B82F6]/06 blur-[100px]" />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Logo mark */}
      <motion.a
        href="#"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        className="relative z-10 flex items-center gap-2.5 mb-8"
        aria-label="CreativeMind Studio home"
      >
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#7C3AED] to-[#9D6CFF] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.45)]">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-semibold text-white text-[15px] tracking-tight">
          Creative<span className="text-[#9D6CFF]">Mind</span>
        </span>
      </motion.a>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease }}
        className={`relative z-10 w-full ${wide ? 'max-w-2xl' : 'max-w-md'} bg-[#10101A]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden`}
      >
        {/* Top purple accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/60 to-transparent" />
        {children}
      </motion.div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2, ease }}
        className="relative z-10 mt-6 text-[11px] text-slate-700 font-mono text-center"
      >
        © {new Date().getFullYear()} CreativeMind Studio, Inc.
      </motion.p>
    </div>
  );
};
