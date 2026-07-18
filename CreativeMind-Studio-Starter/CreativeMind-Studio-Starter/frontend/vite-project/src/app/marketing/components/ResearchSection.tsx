/**
 * ResearchSection — Section 7: Verified Research & Evidence Map
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, AlertCircle, ExternalLink, Search } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const SOURCES = [
  {
    id: 1, title: 'Gartner AI Content Report 2024', domain: 'gartner.com',
    status: 'verified', confidence: 97, date: 'Jan 2024', claimType: 'Market Data',
  },
  {
    id: 2, title: 'Harvard Business Review — Creative Workflows', domain: 'hbr.org',
    status: 'verified', confidence: 91, date: 'Mar 2024', claimType: 'Research',
  },
  {
    id: 3, title: 'McKinsey Digital Transformation Study', domain: 'mckinsey.com',
    status: 'verified', confidence: 88, date: 'Feb 2024', claimType: 'Statistics',
  },
  {
    id: 4, title: 'Social Media Examiner — Video Trends', domain: 'socialmediaexaminer.com',
    status: 'warning', confidence: 72, date: 'Dec 2023', claimType: 'Industry Data',
  },
  {
    id: 5, title: 'TechCrunch — AI Collaboration Tools', domain: 'techcrunch.com',
    status: 'verified', confidence: 83, date: 'Apr 2024', claimType: 'News',
  },
  {
    id: 6, title: 'Unnamed blog post — "67% of teams..."', domain: 'unknown.com',
    status: 'flagged', confidence: 22, date: 'Unknown', claimType: 'Unverified',
  },
];

const QUESTIONS = [
  'What percentage of creative teams lack a structured workflow?',
  'How does AI collaboration affect content production speed?',
  'What are the leading causes of content copyright issues?',
  'How do retention curves differ by content format type?',
];

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
  const color = value >= 85 ? '#10B981' : value >= 65 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-mono font-semibold" style={{ color }}>{value}%</span>
    </div>
  );
};

export const ResearchSection: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<number | null>(1);

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-[#6366F1]/06 blur-[100px]" />
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
            Verified Research
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            Every claim. Fully traceable.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            An automated evidence map that links every claim in your content to a verified, confidence-scored source.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sources list */}
          <div className="lg:col-span-2 space-y-3">
            {/* Search bar mock */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08] bg-[#10101A]/60 mb-4">
              <Search className="w-4 h-4 text-slate-600" />
              <span className="text-[13px] text-slate-600 font-sans">Search evidence library…</span>
              <span className="ml-auto text-[10px] font-mono text-slate-700 border border-white/[0.06] px-2 py-0.5 rounded-md">
                6 sources
              </span>
            </div>

            {SOURCES.map((source, i) => (
              <motion.button
                key={source.id}
                type="button"
                onClick={() => setSelectedSource(source.id === selectedSource ? null : source.id)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.04, ease }}
                whileHover={{ x: 2 }}
                className={`group w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedSource === source.id
                    ? 'border-white/[0.14] bg-[#151521]'
                    : 'border-white/[0.06] bg-[#10101A]/60 hover:border-white/[0.1]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {source.status === 'verified' ? (
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    ) : source.status === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-[13px] font-semibold text-white truncate">{source.title}</h4>
                      {source.status === 'flagged' && (
                        <span className="flex-shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EF4444]/12 border border-[#EF4444]/20 text-[#EF4444]">
                          Flagged
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] text-slate-600 font-mono">{source.domain}</span>
                      <span className="text-[11px] text-slate-700">·</span>
                      <span className="text-[11px] text-slate-600 font-mono">{source.date}</span>
                      <span className="text-[11px] text-slate-700">·</span>
                      <span className="text-[11px] text-slate-600">{source.claimType}</span>
                    </div>
                    <ConfidenceBar value={source.confidence} />
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5 group-hover:text-slate-500 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Research Questions Panel */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease }}
              className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-[#6366F1]" />
                <h4 className="text-[13px] font-semibold text-white">Research Questions</h4>
              </div>
              <div className="space-y-3">
                {QUESTIONS.map((q, i) => (
                  <motion.div
                    key={q}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="flex gap-2.5 p-3 rounded-xl bg-[#0B0B12] border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-[#6366F1]/15 text-[#6366F1] text-[10px] font-mono font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[12px] text-slate-400 leading-relaxed">{q}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Overall score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1, ease }}
              className="rounded-2xl border border-white/[0.08] bg-[#10101A]/80 backdrop-blur-xl p-6"
            >
              <p className="text-[11px] font-mono text-slate-600 uppercase tracking-widest mb-4">
                Evidence Score
              </p>
              <div className="flex items-end gap-3 mb-4">
                <span className="font-display font-bold text-4xl text-[#10B981]">83</span>
                <span className="font-display font-bold text-xl text-slate-700">/100</span>
              </div>
              <ConfidenceBar value={83} />
              <p className="text-[12px] text-slate-500 mt-3 leading-relaxed">
                4 of 6 sources fully verified. 1 flagged source requires a replacement citation before publishing.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
