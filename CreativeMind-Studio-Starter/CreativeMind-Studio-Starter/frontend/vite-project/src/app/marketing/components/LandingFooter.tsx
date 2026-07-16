/**
 * LandingFooter — Section 14: Site footer
 */
import React from 'react';
import { Sparkles, Share2, GitBranch, Link, Video } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Strategy AI', href: '#strategy' },
    { label: 'Virality Twin', href: '#' },
    { label: 'Editor', href: '#' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Case Studies', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Press Kit', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

const SOCIAL = [
  { icon: <Share2 className="w-4 h-4" />, href: '#', label: 'Twitter / X' },
  { icon: <GitBranch className="w-4 h-4" />, href: '#', label: 'GitHub' },
  { icon: <Link className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
  { icon: <Video className="w-4 h-4" />, href: '#', label: 'YouTube' },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07070A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        {/* Top row: Logo + newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-2.5 mb-5 group" aria-label="CreativeMind Studio">
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#7C3AED] to-[#9D6CFF] flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.35)]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-[15px] tracking-tight">
                Creative<span className="text-[#9D6CFF]">Mind</span> Studio
              </span>
            </a>
            <p className="text-slate-500 text-[13px] leading-relaxed mb-6 max-w-xs">
              The AI Creative Operating System that transforms raw ideas into production-ready content through a structured collaborative workflow.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-mono font-semibold tracking-widest uppercase text-slate-600 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-slate-500 hover:text-slate-200 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-700 font-mono">
            © {new Date().getFullYear()} CreativeMind Studio, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-slate-700 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              All systems operational
            </span>
            <span>·</span>
            <span>v2.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
