/**
 * ViralityTwinSection — Section 6: Side-by-side content comparison
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

// Simplified SVG retention graph
const RetentionGraph: React.FC<{ data: number[]; color: string; label: string }> = ({ data, color, label }) => {
  const width = 280;
  const height = 80;
  const padding = 8;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * w;
    const y = padding + h - (v / 100) * h;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;

  // Fill path
  const firstPt = points[0].split(',');
  const lastPt = points[points.length - 1].split(',');
  const fillD = `M ${firstPt[0]},${h + padding} L ${points.join(' L ')} L ${lastPt[0]},${h + padding} Z`;

  return (
    <div className="w-full">
      <p className="text-[10px] font-mono text-slate-600 mb-2">{label}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 64 }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#grad-${color.replace('#', '')})`} />
        <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
        {/* Points */}
        {data.map((v, i) => {
          const x = padding + (i / (data.length - 1)) * w;
          const y = padding + h - (v / 100) * h;
          return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />;
        })}
      </svg>
    </div>
  );
};

const HISTORICAL_DATA = [100, 92, 84, 76, 70, 64, 58, 55, 52, 50];
const CURRENT_DATA = [100, 78, 61, 50, 44, 40, 37, 35, 33, 31];

const MISSING_OPPORTUNITIES = [
  'No open loop in first 5 seconds',
  'Missing pattern interrupt at 0:45',
  'No viewer re-engagement at midpoint',
  'Weak call-to-action placement',
];

const IMPROVEMENTS = [
  'Add curiosity hook in frame 1',
  'Insert B-roll transition at 0:45',
  'Re-engage with question at 50% mark',
  'Move CTA to 85% completion point',
];

export const ViralityTwinSection: React.FC = () => {
  const [tab, setTab] = useState<'retention' | 'opportunities' | 'improvements'>('retention');

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/06 blur-[100px]" />
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
            Virality Twin
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Mirror your idea against what works.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Instantly compare your content idea against historically successful pieces to surface the gaps before production begins.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historical Success Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease }}
            className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-[#10B981]/05">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-white">Historical Winner</h4>
                <p className="text-[11px] text-[#10B981] font-mono">2.4M views · 94% retention</p>
              </div>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/12 border border-[#10B981]/20 text-[#10B981]">
                Benchmark
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Mock content preview */}
              <div className="rounded-xl bg-[#0B0B12] border border-white/[0.05] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 border border-[#10B981]/20" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-white/[0.08] rounded-md w-40" />
                    <div className="h-2.5 bg-white/[0.04] rounded-md w-28" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/[0.06] rounded w-full" />
                  <div className="h-2 bg-white/[0.06] rounded w-4/5" />
                  <div className="h-2 bg-white/[0.06] rounded w-3/5" />
                </div>
              </div>

              {/* Retention graph */}
              <div>
                <RetentionGraph
                  data={HISTORICAL_DATA}
                  color="#10B981"
                  label="Audience Retention Curve"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Retention', value: '94%', color: '#10B981' },
                  { label: 'Hook Score', value: '9.2', color: '#10B981' },
                  { label: 'Completion', value: '78%', color: '#10B981' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-[#0B0B12] border border-white/[0.04]">
                    <p className="font-display font-bold text-xl" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5 font-mono">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Current Idea Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease }}
            className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-[#7C3AED]/05">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/25 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#9D6CFF]" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-white">Your Current Idea</h4>
                <p className="text-[11px] text-[#9D6CFF] font-mono">Similarity score: 67%</p>
              </div>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F59E0B]/12 border border-[#F59E0B]/20 text-[#F59E0B]">
                Needs Work
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Mock content preview */}
              <div className="rounded-xl bg-[#0B0B12] border border-white/[0.05] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/20" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-white/[0.08] rounded-md w-44" />
                    <div className="h-2.5 bg-white/[0.04] rounded-md w-32" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/[0.06] rounded w-full" />
                  <div className="h-2 bg-white/[0.06] rounded w-3/4" />
                  <div className="h-2 bg-white/[0.06] rounded w-2/5" />
                </div>
              </div>

              {/* Retention graph */}
              <div>
                <RetentionGraph
                  data={CURRENT_DATA}
                  color="#F59E0B"
                  label="Predicted Retention Curve"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Retention', value: '61%', color: '#F59E0B' },
                  { label: 'Hook Score', value: '5.4', color: '#F59E0B' },
                  { label: 'Completion', value: '41%', color: '#EF4444' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-[#0B0B12] border border-white/[0.04]">
                    <p className="font-display font-bold text-xl" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5 font-mono">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analysis tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1, ease }}
          className="mt-6 rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex border-b border-white/[0.06]">
            {[
              { id: 'retention', label: 'Retention Analysis' },
              { id: 'opportunities', label: 'Missing Opportunities' },
              { id: 'improvements', label: 'Improvement Plan' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as typeof tab)}
                className={`flex-1 px-4 py-3 text-[13px] font-medium transition-all duration-200 relative ${
                  tab === t.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === t.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6">
            {tab === 'retention' && (
              <p className="text-slate-400 text-[14px] leading-relaxed">
                Your content loses <span className="text-[#EF4444] font-semibold">39% more viewers</span> in the first 30 seconds compared to the benchmark. The primary drop point occurs at 0:08 — before your core value proposition is delivered. Restructuring the hook can increase average retention from 61% to an estimated 84%.
              </p>
            )}
            {tab === 'opportunities' && (
              <ul className="space-y-3">
                {MISSING_OPPORTUNITIES.map((opp) => (
                  <li key={opp} className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-[13px]">{opp}</span>
                  </li>
                ))}
              </ul>
            )}
            {tab === 'improvements' && (
              <ul className="space-y-3">
                {IMPROVEMENTS.map((imp) => (
                  <li key={imp} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-[13px]">{imp}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
