/**
 * Step2CreativeIdea.tsx — Step 2: Creative Idea
 *
 * Fields: Raw Idea/Topic, Desired Duration, Tone, Language, Deadline
 * Right panel: AI Tip card (mock data)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Lightbulb, TrendingUp, Clock, Zap } from 'lucide-react';
import {
  FieldWrapper,
  Textarea,
  ChipSelector,
  DateInput,
} from './WizardFormPrimitives';
import type { Step2Data, ValidationErrors } from '../types';
import {
  TONE_OPTIONS,
  LANGUAGE_OPTIONS,
  DURATION_OPTIONS,
  AI_TIPS,
} from '../mockData';

// ─── AI Tip Card ──────────────────────────────────────────────────────────────

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Engagement:   { icon: <TrendingUp className="w-3.5 h-3.5" />,  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  Retention:    { icon: <Clock className="w-3.5 h-3.5" />,       color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20'     },
  Virality:     { icon: <Zap className="w-3.5 h-3.5" />,         color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'   },
  'Platform Fit': { icon: <Sparkles className="w-3.5 h-3.5" />,  color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
};

const AiTipCard: React.FC<{ ideaText: string }> = ({ ideaText }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const tip = AI_TIPS[tipIndex];
  const cfg = categoryConfig[tip.category] ?? categoryConfig['Engagement'];

  return (
    <div className="rounded-[16px] border border-white/[0.08] bg-[#0B0B12] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[7px] bg-gradient-to-br from-[#7C3AED]/30 to-[#9D6CFF]/10
            border border-[#8B5CF6]/25 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-[#9D6CFF]" />
          </div>
          <span className="text-[12px] font-semibold text-slate-200">AI Insight</span>
        </div>
        <button
          type="button"
          onClick={() => setTipIndex(i => (i + 1) % AI_TIPS.length)}
          className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-300
            transition-colors duration-150 font-mono"
          aria-label="Show next AI tip"
        >
          <RefreshCw className="w-3 h-3" />
          Next tip
        </button>
      </div>

      {/* Category badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
              text-[10px] font-semibold font-mono uppercase tracking-wider border ${cfg.color} ${cfg.bg}`}
          >
            {cfg.icon}
            {tip.category}
          </span>

          <p className="text-[13px] text-slate-300 leading-relaxed">
            {tip.tip}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Idea context */}
      {ideaText.length > 10 && (
        <div className="pt-1 border-t border-white/[0.06]">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500/70 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 italic leading-relaxed">
              Based on your idea: "{ideaText.slice(0, 60)}{ideaText.length > 60 ? '…' : ''}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Character Counter ─────────────────────────────────────────────────────────

const CharCounter: React.FC<{ current: number; max: number }> = ({ current, max }) => {
  const pct = current / max;
  return (
    <span className={`text-[10px] font-mono tabular-nums ${
      pct > 0.9 ? 'text-amber-500' : 'text-slate-700'
    }`}>
      {current}/{max}
    </span>
  );
};

// ─── Step 2 Component ─────────────────────────────────────────────────────────

interface Step2CreativeIdeaProps {
  data: Step2Data;
  errors: ValidationErrors;
  onChange: (patch: Partial<Step2Data>) => void;
}

const MAX_IDEA_LENGTH = 800;

export const Step2CreativeIdea: React.FC<Step2CreativeIdeaProps> = ({ data, errors, onChange }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8">
      {/* ── Left: Form fields ── */}
      <div className="xl:col-span-3 space-y-5">

        {/* Raw Idea / Topic */}
        <FieldWrapper
          label="Raw Idea / Topic"
          htmlFor="rawIdea"
          error={errors.rawIdea}
          required
        >
          <div className="relative">
            <Textarea
              id="rawIdea"
              placeholder="Describe your idea in your own words — the rougher the better. AI will help you shape it…"
              value={data.rawIdea}
              onChange={e => {
                if (e.target.value.length <= MAX_IDEA_LENGTH) {
                  onChange({ rawIdea: e.target.value });
                }
              }}
              rows={5}
              hasError={!!errors.rawIdea}
              className="pr-16"
            />
            <div className="absolute bottom-2.5 right-3">
              <CharCounter current={data.rawIdea.length} max={MAX_IDEA_LENGTH} />
            </div>
          </div>
        </FieldWrapper>

        {/* Desired Duration */}
        <FieldWrapper
          label="Desired Duration"
          htmlFor="desiredDuration-group"
          hint="Approximate length of the final content piece."
        >
          <ChipSelector
            id="desiredDuration-group"
            options={DURATION_OPTIONS}
            value={data.desiredDuration}
            onChange={v => onChange({ desiredDuration: v })}
          />
        </FieldWrapper>

        {/* Tone */}
        <FieldWrapper
          label="Tone of Voice"
          htmlFor="tone-group"
          error={errors.tone}
          required
        >
          <ChipSelector
            id="tone-group"
            options={TONE_OPTIONS}
            value={data.tone}
            onChange={v => onChange({ tone: v })}
            hasError={!!errors.tone}
          />
        </FieldWrapper>

        {/* Language */}
        <FieldWrapper
          label="Language"
          htmlFor="language-group"
          error={errors.language}
          required
        >
          <ChipSelector
            id="language-group"
            options={LANGUAGE_OPTIONS}
            value={data.language}
            onChange={v => onChange({ language: v })}
            hasError={!!errors.language}
          />
        </FieldWrapper>

        {/* Deadline */}
        <FieldWrapper
          label="Target Deadline"
          htmlFor="deadline"
          hint="Optional. Helps AI prioritize your workflow stages."
        >
          <DateInput
            id="deadline"
            value={data.deadline}
            onChange={e => onChange({ deadline: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </FieldWrapper>
      </div>

      {/* ── Right: AI Tip Card ── */}
      <div className="xl:col-span-2">
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-3">
          AI Coach
        </p>
        <AiTipCard ideaText={data.rawIdea} />
      </div>
    </div>
  );
};
