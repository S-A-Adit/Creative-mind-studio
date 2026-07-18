/**
 * PerformanceSection — Section 11: Performance Loop
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Send, BarChart3, Lightbulb, Zap, RefreshCw } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const LOOP_STEPS = [
  {
    icon: <Send className="w-5 h-5" />,
    label: 'Publish',
    desc: 'Multi-platform distribution with SEO-optimized metadata and thumbnails.',
    color: '#7C3AED',
    metric: '6 platforms',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: 'Analytics',
    desc: 'Real-time view counts, retention curves, engagement rates, and conversion tracking.',
    color: '#3B82F6',
    metric: 'Real-time',
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    label: 'Insights',
    desc: 'AI surfaces the precise moments where audience drops, what drove shares, and why it underperformed.',
    color: '#F59E0B',
    metric: 'AI-powered',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: 'Optimization',
    desc: 'Specific, actionable recommendations mapped to your next content cycle automatically.',
    color: '#10B981',
    metric: 'Auto-mapped',
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    label: 'Republish',
    desc: 'One-click to start a new project with all your learnings pre-loaded into the pipeline.',
    color: '#EC4899',
    metric: 'One-click',
  },
];

// Simplified SVG line chart
const PerformanceChart: React.FC = () => {
  const data = [12, 28, 22, 45, 38, 60, 52, 78, 65, 88, 72, 95];
  const width = 400;
  const height = 120;
  const pad = 16;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * w,
    y: pad + h - (v / 100) * h,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  const fillD = `M ${firstX},${h + pad} ${pathD.slice(2)} L ${lastX},${h + pad} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 100 }}>
      <defs>
        <linearGradient id="perf-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#perf-grad)" />
      <motion.path
        d={pathD}
        stroke="#8B5CF6"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#7C3AED"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
};

export const PerformanceSection: React.FC = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#EC4899]/04 blur-[120px]" />
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
            Performance Loop
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Every publish makes the next one better.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Performance data flows back into your creative process automatically, creating a compounding loop of content improvement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Loop diagram */}
          <div className="relative">
            {/* Central node */}
            <div className="flex flex-col gap-4">
              {LOOP_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.06, ease }}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-white/[0.06] bg-[#10101A]/70 hover:border-white/[0.12] hover:bg-[#10101A] transition-all duration-200"
                >
                  {/* Step number + connector */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-105"
                      style={{
                        backgroundColor: `${step.color}15`,
                        borderColor: `${step.color}30`,
                        color: step.color,
                      }}
                    >
                      {step.icon}
                    </div>
                    {i < LOOP_STEPS.length - 1 && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                        className="w-px h-4 origin-top"
                        style={{ backgroundColor: `${step.color}40` }}
                      />
                    )}
                    {i === LOOP_STEPS.length - 1 && (
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-px h-4 bg-gradient-to-b from-[#EC4899]/40 to-[#7C3AED]/40"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-white text-[15px] mb-1">{step.label}</h3>
                    <p className="text-slate-500 text-[12px] leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Metric badge */}
                  <span
                    className="flex-shrink-0 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border"
                    style={{
                      color: step.color,
                      backgroundColor: `${step.color}12`,
                      borderColor: `${step.color}25`,
                    }}
                  >
                    {step.metric}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Analytics preview */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease }}
              className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
                <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
                <h4 className="text-[13px] font-semibold text-white">Content Performance</h4>
                <span className="ml-auto text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-2 py-0.5 rounded-full">
                  +34% this month
                </span>
              </div>
              <div className="p-5">
                <PerformanceChart />
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Total Views', value: '2.4M', change: '+28%', positive: true },
                    { label: 'Avg Retention', value: '84%', change: '+12%', positive: true },
                    { label: 'Conversions', value: '1,847', change: '+43%', positive: true },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl bg-[#0B0B12] border border-white/[0.04]">
                      <p className="font-display font-bold text-[18px] text-white">{stat.value}</p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">{stat.label}</p>
                      <p className="text-[10px] font-mono text-[#10B981] mt-0.5">{stat.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Insights card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1, ease }}
              className="rounded-2xl border border-[#7C3AED]/25 bg-[#7C3AED]/05 backdrop-blur-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                <h4 className="text-[13px] font-semibold text-white">AI Insight</h4>
                <span className="text-[10px] font-mono text-slate-600">Generated just now</span>
              </div>
              <p className="text-slate-300 text-[13px] leading-relaxed">
                Your retention peaks at the 1:45 mark correlate with B-roll cuts. Adding a similar mid-video cut in your next piece could improve average watch time by an estimated 14%. <span className="text-[#9D6CFF] cursor-pointer hover:underline">Apply to next project →</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
