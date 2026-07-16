/**
 * MethodologyPanel.tsx — Collapsible transparency panel explaining the AI analysis approach.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, Info } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

const SECTIONS = [
  {
    id: 'similarity',
    title: 'How Similarity Is Calculated',
    body: `Structural similarity is computed by vectorising 24 content attributes across hook style, narrative structure, pacing, duration, emotional framing, and platform context. Each attribute is weighted by its historical correlation with retention outcomes within the selected content category. Cosine similarity is applied across the weighted vector space to find the closest structural matches in the dataset. A score of 100 means identical structure; 0 means completely dissimilar.`,
  },
  {
    id: 'retention',
    title: 'How Retention Is Estimated',
    body: `Retention curves are estimated by mapping your concept\'s structural attributes to similar content pieces in the simulated dataset and averaging their historical retention curves. The "Your Concept" line in the retention chart is a projected estimate based on structural pattern matching — it is not a guarantee of performance. Actual retention will depend on production quality, distribution timing, and platform algorithm state.`,
  },
  {
    id: 'confidence',
    title: 'How Confidence Scores Are Generated',
    body: `Similarity Confidence reflects how closely the matched twins match your concept across all 24 structural dimensions. Success Confidence is the proportion of structurally similar content pieces in the dataset that outperformed category benchmarks. Prediction Confidence blends both signals with dataset coverage quality. All scores are bounded 0–100 and are subject to the limitations of the underlying simulated dataset.`,
  },
  {
    id: 'structural',
    title: 'How Structural Comparisons Are Made',
    body: `Each content piece is decomposed into 8 structural DNA dimensions: Hook Strength, Story Structure, Emotional Engagement, Pacing, Audience Fit, Retention, Trend Alignment, and Platform Optimisation. These are scored by the ViralityTwin AI agent using a combination of rule-based heuristics and learned weights from the training dataset. All structural scores in this view are derived from simulated data and should not be treated as definitive.`,
  },
];

export const MethodologyPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section aria-label="Analysis methodology explanation">
      {/* Toggle button */}
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px]
          border border-white/[0.07] bg-[#10101A]/60
          hover:border-white/[0.12] hover:bg-[#10101A]/80
          transition-all duration-200 text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
        aria-expanded={open}
      >
        <BookOpen className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-[13px] font-medium text-slate-300">Analysis Methodology</span>
          <span className="ml-2 text-[10px] text-slate-600 font-mono">(transparency)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-600 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <Info className="w-2.5 h-2.5" />
            How it works
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-600"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </div>
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-2xl border border-white/[0.07] bg-[#10101A]/70 divide-y divide-white/[0.05]">
              {SECTIONS.map(section => (
                <div key={section.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded(e => e === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left
                      hover:bg-white/[0.025] transition-colors duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
                    aria-expanded={expanded === section.id}
                  >
                    <span className="text-[13px] font-medium text-slate-300">{section.title}</span>
                    <motion.span
                      animate={{ rotate: expanded === section.id ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-slate-700 flex-shrink-0"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-[12px] text-slate-500 leading-relaxed">
                          {section.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Footer note */}
              <div className="px-5 py-3 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  This panel exists for transparency. All analysis is AI-generated and uses simulated training data.
                  Results should be treated as creative guidance, not data guarantees.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
