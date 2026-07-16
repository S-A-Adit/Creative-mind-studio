/**
 * RightsSection — Section 9: Rights & Brand Safety
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Scale, BadgeCheck, AlertTriangle, Lock, Eye } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const CHECKS = [
  {
    id: 'copyright',
    icon: <Scale className="w-5 h-5" />,
    title: 'Copyright Verification',
    status: 'clear',
    statusLabel: 'All Clear',
    color: '#10B981',
    desc: '47 media assets scanned. All verified against Creative Commons, Unsplash, and licensed library databases.',
    details: ['CC0 License verified', 'Getty license confirmed', 'Music royalty-free', '3 custom assets'],
  },
  {
    id: 'brand',
    icon: <BadgeCheck className="w-5 h-5" />,
    title: 'Brand Safety',
    status: 'clear',
    statusLabel: 'Passed',
    color: '#10B981',
    desc: 'Content analyzed against brand guidelines, prohibited topics, and platform-specific community standards.',
    details: ['Tone: Professional', 'No sensitive topics', 'Platform-safe', 'Competitor-neutral'],
  },
  {
    id: 'evidence',
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Evidence Validation',
    status: 'warning',
    statusLabel: '1 Review Needed',
    color: '#F59E0B',
    desc: 'One unverified statistic detected. The "67% of teams" claim requires a primary source before publishing.',
    details: ['5 claims verified', '1 flagged claim', '2 sources aging', 'Fact-check pending'],
  },
  {
    id: 'risk',
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Risk Alerts',
    status: 'clear',
    statusLabel: 'Low Risk',
    color: '#10B981',
    desc: 'No comparative advertising violations, defamation risks, or misleading claim patterns detected.',
    details: ['Defamation: None', 'Misleading: None', 'Comparative: OK', 'Regulatory: Clear'],
  },
];

const SAFETY_SCORES = [
  { label: 'Copyright', score: 100, color: '#10B981' },
  { label: 'Brand Safety', score: 96, color: '#10B981' },
  { label: 'Evidence', score: 83, color: '#F59E0B' },
  { label: 'Legal Risk', score: 98, color: '#10B981' },
];

export const RightsSection: React.FC = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#10B981]/05 blur-[100px]" />
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
            Rights & Brand Safety
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Publish protected. Every time.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Automated copyright verification, brand safety scoring, and legal risk analysis — built into the workflow so you never publish unprepared.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Check cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHECKS.map((check, i) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06, ease }}
                whileHover={{ y: -3 }}
                className="group p-5 rounded-2xl border border-white/[0.06] bg-[#10101A]/70 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-200 overflow-hidden relative"
              >
                {/* Status glow at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${check.color}50, transparent)` }}
                />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-105"
                    style={{
                      backgroundColor: `${check.color}12`,
                      borderColor: `${check.color}25`,
                      color: check.color,
                    }}
                  >
                    {check.icon}
                  </div>
                  <span
                    className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border"
                    style={{
                      color: check.color,
                      backgroundColor: `${check.color}12`,
                      borderColor: `${check.color}25`,
                    }}
                  >
                    {check.statusLabel}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-white text-[15px] mb-2">{check.title}</h3>
                <p className="text-slate-500 text-[12px] leading-relaxed mb-4">{check.desc}</p>

                {/* Detail pills */}
                <div className="flex flex-wrap gap-1.5">
                  {check.details.map((detail) => (
                    <span
                      key={detail}
                      className="text-[10px] px-2 py-0.5 rounded-full border text-slate-500"
                      style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Score panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease }}
            className="flex flex-col gap-4"
          >
            {/* Overall score */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Lock className="w-4 h-4 text-[#10B981]" />
                <h4 className="text-[13px] font-semibold text-white">Safety Score</h4>
              </div>

              {/* Big score circle mock */}
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                    <motion.circle
                      cx="50" cy="50" r="40"
                      stroke="#10B981"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="251.3"
                      initial={{ strokeDashoffset: 251.3 }}
                      whileInView={{ strokeDashoffset: 251.3 * 0.06 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-bold text-2xl text-[#10B981]">94</span>
                    <span className="text-[10px] text-slate-600 font-mono">/100</span>
                  </div>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="space-y-3">
                {SAFETY_SCORES.map((score) => (
                  <div key={score.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-slate-400">{score.label}</span>
                      <span className="text-[11px] font-mono font-semibold" style={{ color: score.color }}>
                        {score.score}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05]">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${score.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease }}
                        style={{ backgroundColor: score.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit trail */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-[#6366F1]" />
                <h4 className="text-[13px] font-semibold text-white">Audit Trail</h4>
              </div>
              <div className="space-y-2.5">
                {[
                  { time: '2m ago', action: 'Copyright scan completed', status: 'ok' },
                  { time: '5m ago', action: 'Brand safety check passed', status: 'ok' },
                  { time: '8m ago', action: 'Evidence flag raised', status: 'warn' },
                  { time: '12m ago', action: 'Asset library scanned', status: 'ok' },
                ].map((entry) => (
                  <div key={entry.action} className="flex items-start gap-2.5">
                    <div className={`flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full ${
                      entry.status === 'ok' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 truncate">{entry.action}</p>
                      <p className="text-[10px] text-slate-600 font-mono">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
