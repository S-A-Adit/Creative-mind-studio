/**
 * EthicsStatus.tsx — Ethics & Brand Safety panel for the War Room right column.
 * RightDecisionPanel.tsx — Overall recommendation, health, risks, opportunities, CTA.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  CheckCircle2,
  XCircle,
  FlaskConical,
} from 'lucide-react';
import type { StrategyDecision, RiskLevel, StrategyAgent } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Risk level config ────────────────────────────────────────────────────────

const RISK_CFG: Record<RiskLevel, { badge: string; dot: string }> = {
  critical: { badge: 'text-red-400 bg-red-500/10 border-red-500/25',     dot: 'bg-red-500'     },
  high:     { badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25', dot: 'bg-orange-500' },
  medium:   { badge: 'text-amber-400 bg-amber-500/10 border-amber-500/25',  dot: 'bg-amber-500'   },
  low:      { badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20',  dot: 'bg-slate-500'   },
};

// ─── Ethics status ────────────────────────────────────────────────────────────

interface EthicsStatusProps {
  ethicsAgent: StrategyAgent | undefined;
}

export const EthicsStatus: React.FC<EthicsStatusProps> = ({ ethicsAgent }) => {
  if (!ethicsAgent) return null;

  const checks = [
    { label: 'Medical claims reviewed',    ok: true  },
    { label: 'Copyright assets cleared',   ok: true  },
    { label: 'Audience targeting ethical', ok: true  },
    { label: 'Platform policy compliant',  ok: false },
    { label: 'Regulatory review pending',  ok: false },
  ];

  const passed = checks.filter(c => c.ok).length;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-7 h-7 rounded-[9px] flex items-center justify-center border"
          style={{ background: ethicsAgent.color + '25', borderColor: ethicsAgent.color + '35', color: ethicsAgent.color }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-slate-200">Ethics & Brand Safety</p>
          <p className="text-[10px] text-slate-600 font-mono">{ethicsAgent.name} · {ethicsAgent.role}</p>
        </div>
        <span
          className="ml-auto text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border"
          style={{ color: ethicsAgent.color, background: ethicsAgent.color + '15', borderColor: ethicsAgent.color + '30' }}
        >
          {passed}/{checks.length} passed
        </span>
      </div>

      <div className="space-y-1.5">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {c.ok ? (
                <motion.span key="ok" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                </motion.span>
              ) : (
                <motion.span key="no" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                  <XCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className={`text-[11px] ${c.ok ? 'text-slate-400' : 'text-amber-400/80'}`}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Right Decision Panel ─────────────────────────────────────────────────────

interface RightDecisionPanelProps {
  decision: StrategyDecision;
  agents: StrategyAgent[];
  onContinueToResearch?: () => void;
}

export const RightDecisionPanel: React.FC<RightDecisionPanelProps> = ({
  decision,
  agents,
  onContinueToResearch,
}) => {
  const healthColor =
    decision.projectHealthPct >= 80 ? '#10B981' :
    decision.projectHealthPct >= 60 ? '#F59E0B' :
    '#EF4444';

  return (
    <div className="space-y-4">
      {/* Overall recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="rounded-2xl border border-[#8B5CF6]/30 bg-[#7C3AED]/06 p-4 space-y-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[7px] bg-[#7C3AED]/25 border border-[#8B5CF6]/30 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-[#9D6CFF]" />
          </div>
          <span className="text-[11px] font-mono font-semibold text-[#9D6CFF] uppercase tracking-widest">
            Board Recommendation
          </span>
        </div>
        <p className="text-[12px] text-slate-300 leading-relaxed">{decision.overallRecommendation}</p>
      </motion.div>

      {/* Project health */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-slate-600" />
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">Project Health</span>
          <span className="ml-auto font-display font-bold text-[20px]" style={{ color: healthColor }}>
            {decision.projectHealthPct}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: healthColor }}
            animate={{ width: `${decision.projectHealthPct}%` }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </div>
      </div>

      {/* Top Risks */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">Top Risks</span>
        </div>
        <div className="space-y-2.5">
          {decision.risks.map((risk, i) => {
            const cfg = RISK_CFG[risk.level];
            const owner = agents.find(a => a.id === risk.owner);
            return (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05, ease: EASE }}
                className="flex items-start gap-2.5"
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[12px] font-semibold text-slate-200">{risk.label}</p>
                    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{risk.description}</p>
                  {owner && (
                    <span className="text-[9px] font-mono mt-0.5 inline-block" style={{ color: owner.color }}>
                      Owner: {owner.name}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">Opportunities</span>
        </div>
        <div className="space-y-2.5">
          {decision.opportunities.map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05, ease: EASE }}
              className="flex items-start gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-slate-200">{opp.label}</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{opp.description}</p>
                <span className="text-[10px] font-mono text-emerald-400/80 mt-0.5 inline-block">
                  {opp.potentialImpact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended next step */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/04 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-semibold">
            Next Step
          </span>
        </div>
        <p className="text-[12px] text-slate-300 leading-relaxed">{decision.recommendedNextStep}</p>
      </div>

      {/* CTA */}
      <motion.button
        type="button"
        onClick={onContinueToResearch}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="
          w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[12px]
          text-[14px] font-semibold text-white
          bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]
          border border-[#8B5CF6]/30
          shadow-[0_4px_20px_rgba(124,58,237,0.35)]
          hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)]
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
          relative overflow-hidden
        "
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
    </div>
  );
};
