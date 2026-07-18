/**
 * RightInsightPanel.tsx — Opportunities · Risks · Quick Wins · CTA for the right sidebar.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  ArrowRight,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react';
import type { RightInsightData } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

const SEVERITY_CFG = {
  critical: { dot: 'bg-red-500',    text: 'text-red-400'    },
  high:     { dot: 'bg-orange-500', text: 'text-orange-400' },
  medium:   { dot: 'bg-amber-500',  text: 'text-amber-400'  },
};

const EFFORT_CFG = {
  low:    { label: 'Low effort',    cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  medium: { label: 'Medium effort', cls: 'text-amber-400   bg-amber-500/10   border-amber-500/20'  },
  high:   { label: 'High effort',   cls: 'text-red-400     bg-red-500/10     border-red-500/20'    },
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

const RightSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}> = ({ icon, title, color, children }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-4 space-y-3">
    <div className="flex items-center gap-2">
      <span style={{ color }}>{icon}</span>
      <h4 className="text-[11px] font-mono font-semibold uppercase tracking-widest" style={{ color }}>
        {title}
      </h4>
    </div>
    {children}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

interface RightInsightPanelProps {
  data: RightInsightData;
  onContinue?: () => void;
}

export const RightInsightPanel: React.FC<RightInsightPanelProps> = ({ data, onContinue }) => (
  <aside aria-label="Right insight panel" className="space-y-4">

    {/* Top Opportunities */}
    <RightSection
      icon={<TrendingUp className="w-3.5 h-3.5" />}
      title="Top Opportunities"
      color="#10B981"
    >
      {data.opportunities.map((opp, i) => (
        <motion.div
          key={opp.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05, ease: EASE }}
          className="flex items-start gap-2.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
          <div>
            <p className="text-[12px] font-semibold text-slate-200">{opp.label}</p>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{opp.detail}</p>
            <span className="text-[10px] font-mono text-emerald-400/80 mt-1 inline-block">{opp.impact}</span>
          </div>
        </motion.div>
      ))}
    </RightSection>

    {/* Critical Risks */}
    <RightSection
      icon={<AlertTriangle className="w-3.5 h-3.5" />}
      title="Critical Risks"
      color="#EF4444"
    >
      {data.risks.map((risk, i) => {
        const cfg = SEVERITY_CFG[risk.severity];
        return (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05, ease: EASE }}
            className="flex items-start gap-2.5"
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`} />
            <div>
              <p className={`text-[12px] font-semibold ${cfg.text}`}>{risk.label}</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{risk.detail}</p>
            </div>
          </motion.div>
        );
      })}
    </RightSection>

    {/* Quick Wins */}
    <RightSection
      icon={<Zap className="w-3.5 h-3.5" />}
      title="Quick Wins"
      color="#F59E0B"
    >
      {data.quickWins.map((win, i) => {
        const effort = EFFORT_CFG[win.effort];
        return (
          <motion.div
            key={win.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05, ease: EASE }}
            className="flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-slate-300 leading-snug">{win.action}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border ${effort.cls}`}>
                  {effort.label}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">{win.gain}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </RightSection>

    {/* Recommended next step */}
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/04 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-semibold">
          Recommended Next Step
        </span>
      </div>
      <p className="text-[12px] text-slate-300 leading-relaxed">{data.recommendedNextStep}</p>
    </div>

    {/* Primary CTA */}
    <motion.button
      type="button"
      onClick={onContinue}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[12px]
        text-[14px] font-semibold text-white relative overflow-hidden
        bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]
        border border-[#8B5CF6]/30
        shadow-[0_4px_20px_rgba(124,58,237,0.35)]
        hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)]
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
      />
      <FlaskConical className="w-4 h-4 relative z-10" />
      <span className="relative z-10">Continue to Research Lab</span>
      <ArrowRight className="w-4 h-4 relative z-10" />
    </motion.button>
  </aside>
);
