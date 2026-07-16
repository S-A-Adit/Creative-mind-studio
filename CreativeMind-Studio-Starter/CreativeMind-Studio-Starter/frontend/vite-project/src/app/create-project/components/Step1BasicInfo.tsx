/**
 * Step1BasicInfo.tsx — Step 1: Basic Information
 *
 * Fields: Project Title, Description, Content Category,
 *         Target Platform, Target Audience, Primary Goal
 *
 * Right panel: Live Project Summary Card
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Users,
  TrendingUp,
  Layout,
  FileText,
} from 'lucide-react';
import {
  FieldWrapper,
  TextInput,
  Textarea,
  Select,
  ChipSelector,
} from './WizardFormPrimitives';
import type { Step1Data, ValidationErrors } from '../types';
import {
  CONTENT_CATEGORIES,
  TARGET_PLATFORMS,
  PRIMARY_GOALS,
} from '../mockData';

// ─── Live Summary Card ────────────────────────────────────────────────────────

const LiveSummaryCard: React.FC<{ data: Step1Data }> = ({ data }) => {
  const categoryLabel =
    CONTENT_CATEGORIES.find(c => c.value === data.contentCategory)?.label ?? '—';
  const platformLabel =
    TARGET_PLATFORMS.find(p => p.value === data.targetPlatform)?.label ?? '—';
  const goalLabel =
    PRIMARY_GOALS.find(g => g.value === data.primaryGoal)?.label ?? '—';
  const categoryEmoji =
    CONTENT_CATEGORIES.find(c => c.value === data.contentCategory)?.icon ?? '✦';

  const rows: Array<{ icon: React.ReactNode; label: string; value: string }> = [
    {
      icon: <Layout className="w-3.5 h-3.5" />,
      label: 'Category',
      value: categoryLabel,
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5" />,
      label: 'Platform',
      value: platformLabel,
    },
    {
      icon: <Users className="w-3.5 h-3.5" />,
      label: 'Audience',
      value: data.targetAudience || '—',
    },
    {
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      label: 'Goal',
      value: goalLabel,
    },
  ];

  return (
    <motion.div
      layout
      className="rounded-[16px] border border-white/[0.08] bg-[#0B0B12] p-5 space-y-4 sticky top-0"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <motion.div
          layout
          className="flex-shrink-0 w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#7C3AED]/30 to-[#9D6CFF]/10
            border border-[#8B5CF6]/25 flex items-center justify-center text-[18px]"
        >
          {data.contentCategory ? categoryEmoji : <FileText className="w-5 h-5 text-slate-600" />}
        </motion.div>
        <div className="flex-1 min-w-0">
          <motion.h3
            layout
            className={`text-[14px] font-semibold leading-tight transition-colors duration-200 ${
              data.projectTitle ? 'text-slate-100' : 'text-slate-600 italic'
            }`}
          >
            {data.projectTitle || 'Your Project Title'}
          </motion.h3>
          {data.description && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2"
            >
              {data.description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06]" />

      {/* Detail rows */}
      <div className="space-y-2.5">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium flex-shrink-0">
              <span className="text-slate-700">{row.icon}</span>
              {row.label}
            </span>
            <span
              className={`text-[12px] font-medium truncate text-right ${
                row.value === '—' ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Completion meter */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
            Completion
          </span>
          <span className="text-[11px] text-[#9D6CFF] font-semibold font-mono">
            {Math.round(
              ([data.projectTitle, data.description, data.contentCategory,
                data.targetPlatform, data.targetAudience, data.primaryGoal]
                .filter(Boolean).length / 6) * 100
            )}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]"
            animate={{
              width: `${Math.round(
                ([data.projectTitle, data.description, data.contentCategory,
                  data.targetPlatform, data.targetAudience, data.primaryGoal]
                  .filter(Boolean).length / 6) * 100
              )}%`,
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Step 1 Component ─────────────────────────────────────────────────────────

interface Step1BasicInfoProps {
  data: Step1Data;
  errors: ValidationErrors;
  onChange: (patch: Partial<Step1Data>) => void;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ data, errors, onChange }) => {
  const categoryOptions = CONTENT_CATEGORIES.map(c => ({ value: c.value, label: c.label }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8">
      {/* ── Left: Form fields ── */}
      <div className="xl:col-span-3 space-y-5">

        {/* Project Title */}
        <FieldWrapper
          label="Project Title"
          htmlFor="projectTitle"
          error={errors.projectTitle}
          required
        >
          <TextInput
            id="projectTitle"
            placeholder="e.g. The Rise of AI in Healthcare"
            value={data.projectTitle}
            onChange={e => onChange({ projectTitle: e.target.value })}
            hasError={!!errors.projectTitle}
            maxLength={120}
          />
        </FieldWrapper>

        {/* Description */}
        <FieldWrapper
          label="Project Description"
          htmlFor="description"
          hint="Briefly describe what this project is about."
        >
          <Textarea
            id="description"
            placeholder="Describe your project — what you want to say, who it's for, and why it matters…"
            value={data.description}
            onChange={e => onChange({ description: e.target.value })}
            rows={3}
            maxLength={500}
          />
        </FieldWrapper>

        {/* Content Category */}
        <FieldWrapper
          label="Content Category"
          htmlFor="contentCategory-group"
          error={errors.contentCategory}
          required
        >
          <ChipSelector
            id="contentCategory-group"
            options={CONTENT_CATEGORIES}
            value={data.contentCategory}
            onChange={v => onChange({ contentCategory: v })}
            hasError={!!errors.contentCategory}
          />
        </FieldWrapper>

        {/* Target Platform */}
        <FieldWrapper
          label="Target Platform"
          htmlFor="targetPlatform"
          error={errors.targetPlatform}
          required
        >
          <Select
            id="targetPlatform"
            options={TARGET_PLATFORMS.map(p => ({ value: p.value, label: p.label }))}
            value={data.targetPlatform}
            onChange={e => onChange({ targetPlatform: e.target.value as Step1Data['targetPlatform'] })}
            hasError={!!errors.targetPlatform}
            placeholder="Choose platform…"
          />
        </FieldWrapper>

        {/* Target Audience */}
        <FieldWrapper
          label="Target Audience"
          htmlFor="targetAudience"
          hint="Who is your content for? Age group, interests, profession…"
        >
          <TextInput
            id="targetAudience"
            placeholder="e.g. Tech-savvy professionals aged 25-40"
            value={data.targetAudience}
            onChange={e => onChange({ targetAudience: e.target.value })}
          />
        </FieldWrapper>

        {/* Primary Goal */}
        <FieldWrapper
          label="Primary Goal"
          htmlFor="primaryGoal"
        >
          <Select
            id="primaryGoal"
            options={categoryOptions.length > 0
              ? PRIMARY_GOALS.map(g => ({ value: g.value, label: g.label }))
              : []}
            value={data.primaryGoal}
            onChange={e => onChange({ primaryGoal: e.target.value as Step1Data['primaryGoal'] })}
            placeholder="What's the main goal?"
          />
        </FieldWrapper>
      </div>

      {/* ── Right: Live Summary Card ── */}
      <div className="xl:col-span-2">
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-3">
          Live Preview
        </p>
        <LiveSummaryCard data={data} />
      </div>
    </div>
  );
};
