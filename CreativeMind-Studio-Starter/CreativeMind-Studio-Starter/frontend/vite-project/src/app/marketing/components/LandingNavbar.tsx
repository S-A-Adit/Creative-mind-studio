/**
 * LandingNavbar — marketing page top navigation.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Strategy AI', href: '#strategy' },
  { label: 'Pricing', href: '#pricing' },
];

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#07070A]/90 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group" aria-label="CreativeMind Studio">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#7C3AED] to-[#9D6CFF] flex items-center justify-center shadow-[0_0_16px_rgba(124,58,237,0.4)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-white text-[15px] tracking-tight">
              Creative<span className="text-[#9D6CFF]">Mind</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-[13px] font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA cluster */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign in
            </a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[13px] font-semibold shadow-[0_4px_16px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_24px_rgba(139,92,246,0.5)] transition-shadow"
            >
              Start Free
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-[#0B0B12]/95 backdrop-blur-xl border-b border-white/[0.06] md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-[14px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex gap-3">
                <a href="#" className="flex-1 text-center py-2.5 text-[13px] font-medium text-slate-400 border border-white/[0.08] rounded-xl hover:text-white hover:border-white/[0.15] transition-colors">
                  Sign in
                </a>
                <a href="#" className="flex-1 text-center py-2.5 text-[13px] font-semibold bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white rounded-xl">
                  Start Free
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
