/**
 * CoverageBar.tsx — Research coverage and quality progress dashboard.
 *
 * Shows: coverage %, verified sources, pending verification,
 * evidence quality, and overall confidence — all animated.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Activity,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import type { ResearchCoverage } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, delay = 0): number {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 800, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(e * target));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, delay]);
  return val;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

const StatPill: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  delay?: number;
}> = ({ icon, label, value, color, delay = 0 }) => {
  const numericValue = typeof value === 'number' ? value : 0;
  const counted = useCountUp(numericValue, delay);
  const displayed = typeof value === 'number' ? counted : value;

  return (
    <div className="flex flex-col items-center gap-2 p-3.5 rounded-[14px] border border-white/[0.07]
      bg-[#0B0B12]/50 flex-1 min-w-[100px]">
      <div className="w-8 h-8 rounded-[9px] flex items-center justify-center"
        style={{ background: color + '20', border: `1px solid ${color}30` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <span className="font-display font-bold text-[20px] leading-none" style={{ color }}>
        {typeof displayed === 'number' ? displayed : displayed}
        {typeof value === 'number' && label !== 'Verified' && label !== 'Pending' ? '%' : ''}
      </span>
      <span className="text-[9px] font-mono text-slate-600 text-center leading-tight">{label}</span>
    </div>
  );
};

// ─── Wide progress bar ────────────────────────────────────────────────────────

const ProgressBar: React.FC<{
  label: string;
  value: number;
  color: string;
  showLabel?: boolean;
}> = ({ label, value, color, showLabel = true }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-mono text-slate-500">{label}</span>
      {showLabel && (
        <span className="text-[11px] font-mono font-semibold" style={{ color }}>
          {value}%
        </span>
      )}
    </div>
    <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: EASE }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface CoverageBarProps {
  coverage: ResearchCoverage;
}

export const CoverageBar: React.FC<CoverageBarProps> = ({ coverage }) => (
  <section
    aria-label="Research coverage progress"
    className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 p-5 space-y-5"
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-display font-semibold text-[15px] text-white tracking-tight">
          Research Coverage
        </h3>
        <p className="text-[11px] font-mono text-slate-500 mt-0.5">
          ⚠️ Simulated progress · {coverage.totalSources} total sources tracked
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"
        />
        <span className="text-[10px] font-mono text-[#8B5CF6]">Live tracking</span>
      </div>
    </div>

    {/* Stat pills row */}
    <div className="flex gap-3 flex-wrap">
      <StatPill
        icon={<TrendingUp className="w-4 h-4" />}
        label="Coverage"
        value={coverage.coveragePercent}
        color="#8B5CF6"
        delay={0}
      />
      <StatPill
        icon={<CheckCircle2 className="w-4 h-4" />}
        label="Verified"
        value={coverage.verifiedSources}
        color="#10B981"
        delay={80}
      />
      <StatPill
        icon={<Clock className="w-4 h-4" />}
        label="Pending"
        value={coverage.pendingVerification}
        color="#F59E0B"
        delay={160}
      />
      <StatPill
        icon={<Activity className="w-4 h-4" />}
        label="Evidence Quality"
        value={coverage.evidenceQuality}
        color="#06B6D4"
        delay={240}
      />
      <StatPill
        icon={<ShieldCheck className="w-4 h-4" />}
        label="Confidence"
        value={coverage.overallConfidence}
        color="#10B981"
        delay={320}
      />
    </div>

    {/* Progress bars */}
    <div className="space-y-3 pt-1">
      <ProgressBar label="Research Coverage" value={coverage.coveragePercent} color="#8B5CF6" />
      <ProgressBar label="Evidence Quality"  value={coverage.evidenceQuality}  color="#06B6D4" />
      <ProgressBar label="Overall Confidence" value={coverage.overallConfidence} color="#10B981" />
    </div>
  </section>
);
