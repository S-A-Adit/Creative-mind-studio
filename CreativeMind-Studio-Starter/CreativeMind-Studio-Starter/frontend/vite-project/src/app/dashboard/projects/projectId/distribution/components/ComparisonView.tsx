/**
 * ComparisonView.tsx — Master vs Platform split-screen comparison
 *
 * Highlights modified, AI-optimized, and platform-specific content
 * relative to the approved master content.
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, ArrowRight, Info } from 'lucide-react';
import { MASTER_CONTENT, PLATFORM_ADAPTATIONS } from '../mockData';
import type { ComparisonField, DiffType } from '../types';
import { PlatformIcon, DiffTag, SectionLabel } from './DistributionShared';

// ─── Helper: compute diff type by basic comparison ───────────────────────────

function getDiff(master: string, platform: string, forced?: DiffType): DiffType {
  if (forced) return forced;
  if (master === platform) return 'unchanged';
  return 'modified';
}

// ─── Comparison Row ───────────────────────────────────────────────────────────

interface ComparisonRowProps {
  field: ComparisonField;
  index: number;
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ field, index }) => {
  const isUnchanged = field.diffType === 'unchanged';
  const isModified = field.diffType === 'modified';
  const isAI = field.diffType === 'ai-optimized';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={`rounded-xl border overflow-hidden ${
        isUnchanged
          ? 'border-white/[0.05] bg-white/[0.02]'
          : isAI
          ? 'border-[#8B5CF6]/20 bg-[#8B5CF6]/[0.04]'
          : isModified
          ? 'border-[#F59E0B]/15 bg-[#F59E0B]/[0.04]'
          : 'border-[#10B981]/15 bg-[#10B981]/[0.04]'
      }`}
    >
      {/* Row header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04]">
        <SectionLabel>{field.label}</SectionLabel>
        <DiffTag type={field.diffType} />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-2 divide-x divide-white/[0.05]">
        {/* Master side */}
        <div className="p-3">
          <SectionLabel className="block mb-1.5 text-slate-600">Master</SectionLabel>
          <p
            className={`text-xs leading-relaxed ${
              isUnchanged ? 'text-slate-400' : 'text-slate-300'
            }`}
          >
            {field.masterValue || <span className="italic text-slate-600">—</span>}
          </p>
        </div>

        {/* Platform side */}
        <div className={`p-3 ${isUnchanged ? '' : 'bg-white/[0.02]'}`}>
          <SectionLabel className="block mb-1.5 text-slate-600">Platform</SectionLabel>
          <p
            className={`text-xs leading-relaxed ${
              isUnchanged
                ? 'text-slate-400'
                : isAI
                ? 'text-[#9D6CFF]'
                : isModified
                ? 'text-amber-300'
                : 'text-emerald-300'
            }`}
          >
            {field.platformValue || <span className="italic text-slate-600">—</span>}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Legend ───────────────────────────────────────────────────────────────────

const Legend: React.FC = () => (
  <div className="flex items-center gap-4 flex-wrap">
    {(['unchanged', 'modified', 'ai-optimized', 'platform-specific'] as DiffType[]).map(type => (
      <div key={type} className="flex items-center gap-1.5">
        <DiffTag type={type} />
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface ComparisonViewProps {
  selectedPlatformId: string | null;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ selectedPlatformId }) => {
  const platform = useMemo(
    () => PLATFORM_ADAPTATIONS.find(a => a.id === selectedPlatformId) ?? null,
    [selectedPlatformId]
  );

  const fields = useMemo<ComparisonField[]>(() => {
    if (!platform) return [];
    const m = MASTER_CONTENT;
    return [
      {
        label: 'Title',
        masterValue: m.projectTitle,
        platformValue: platform.generatedTitle,
        diffType: getDiff(m.projectTitle, platform.generatedTitle, 'ai-optimized'),
      },
      {
        label: 'Hook',
        masterValue: m.primaryHook,
        platformValue: platform.hook,
        diffType: getDiff(m.primaryHook, platform.hook, 'modified'),
      },
      {
        label: 'Description',
        masterValue: m.summary,
        platformValue: platform.description,
        diffType: getDiff(m.summary, platform.description, 'platform-specific'),
      },
      {
        label: 'Script Length',
        masterValue: `${m.wordCount} words / ${m.characterCount} chars`,
        platformValue: `${platform.currentCharacterCount} chars (limit: ${platform.characterLimit})`,
        diffType: getDiff(
          String(m.characterCount),
          String(platform.currentCharacterCount),
          'platform-specific'
        ),
      },
      {
        label: 'CTA',
        masterValue: m.cta,
        platformValue: platform.cta,
        diffType: getDiff(m.cta, platform.cta, 'modified'),
      },
      {
        label: 'Duration',
        masterValue: m.estimatedDuration,
        platformValue: platform.estimatedDuration,
        diffType:
          m.estimatedDuration === platform.estimatedDuration
            ? 'unchanged'
            : 'platform-specific',
      },
      {
        label: 'Format / Aspect Ratio',
        masterValue: '16:9 — YouTube Long-form',
        platformValue: `${platform.aspectRatio} — ${platform.platformName}`,
        diffType:
          platform.aspectRatio === '16:9' ? 'unchanged' : 'platform-specific',
      },
      {
        label: 'Thumbnail',
        masterValue: 'Approved (v3.2)',
        platformValue: `Thumbnail: ${platform.thumbnailStatus}`,
        diffType:
          platform.thumbnailStatus === 'approved' ? 'unchanged' : 'modified',
      },
      {
        label: 'Character Count',
        masterValue: `${m.characterCount.toLocaleString()} chars`,
        platformValue: `${platform.currentCharacterCount.toLocaleString()} / ${platform.characterLimit.toLocaleString()} limit`,
        diffType: 'platform-specific',
      },
    ];
  }, [platform]);

  if (!platform) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
          <GitCompare className="w-7 h-7 text-slate-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">Select a platform to compare</p>
          <p className="text-xs text-slate-600 mt-1">
            Click any platform card on the right panel to open a side-by-side comparison
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Master v{MASTER_CONTENT.version}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <div className="flex items-center gap-1.5">
              <PlatformIcon
                platformId={platform.platformId}
                iconName={platform.icon}
                size={20}
              />
              <span className="text-xs font-mono text-slate-300">{platform.platformName}</span>
            </div>
          </div>
        </div>
        <Legend />
      </div>

      {/* Comparison rows */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {fields.map((field, i) => (
            <ComparisonRow key={field.label} field={field} index={i} />
          ))}
        </AnimatePresence>

        {/* Recommendations summary */}
        {platform.recommendations.filter(r => !r.applied).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-[#9D6CFF]" />
              <span className="text-xs font-semibold text-[#9D6CFF]">
                {platform.recommendations.filter(r => !r.applied).length} pending AI optimizations
              </span>
            </div>
            <ul className="space-y-1">
              {platform.recommendations
                .filter(r => !r.applied)
                .map(r => (
                  <li key={r.id} className="text-[11px] text-slate-400 flex items-start gap-2">
                    <span className="text-[#9D6CFF] mt-0.5">·</span>
                    {r.title}
                  </li>
                ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};
