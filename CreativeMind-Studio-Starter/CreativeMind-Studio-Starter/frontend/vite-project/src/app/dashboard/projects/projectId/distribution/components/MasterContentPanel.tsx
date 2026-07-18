/**
 * MasterContentPanel.tsx — Left panel of the Distribution Room
 *
 * Displays the approved master content with all its metadata,
 * a "Master Version" badge, thumbnail preview, full script, and approval status.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Target, Clock, Users, Monitor, CheckCircle2,
  ChevronDown, ChevronUp, Hash, Type, AlignLeft,
} from 'lucide-react';
import { MASTER_CONTENT } from '../mockData';
import { SectionLabel, StatusBadge } from './DistributionShared';

// ─── Sub-component: MetaRow ───────────────────────────────────────────────────

interface MetaRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}

const MetaRow: React.FC<MetaRowProps> = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-slate-400" />
    </div>
    <div className="min-w-0 flex-1">
      <SectionLabel>{label}</SectionLabel>
      <p
        className={`text-sm mt-0.5 leading-relaxed ${
          accent ? 'text-[#9D6CFF] font-medium' : 'text-slate-200'
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const MasterContentPanel: React.FC = () => {
  const [scriptExpanded, setScriptExpanded] = useState(false);
  const m = MASTER_CONTENT;

  const previewLines = m.mainScript.split('\n').slice(0, 6).join('\n');

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0B0B12]">
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-emerald-400">
              Master Version
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500">{m.version}</span>
            {/* Approval Status */}
            {m.approvalStatus === 'approved' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Approved
              </span>
            )}
          </div>
        </div>

        <h2 className="font-display font-semibold text-white text-lg leading-tight mb-2">
          {m.projectTitle}
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed">{m.summary}</p>

        {/* Approved by */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            Approved by{' '}
            <span className="text-slate-300 font-medium">{m.approvedBy}</span>
            {' '}·{' '}
            {new Date(m.approvedAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* ── Thumbnail ── */}
      <div className="px-5 py-4 border-b border-white/5 flex-shrink-0">
        <SectionLabel className="mb-2 block">Final Thumbnail</SectionLabel>
        <div className="relative rounded-xl overflow-hidden aspect-video bg-[#151521] border border-white/5">
          <img
            src={m.thumbnailUrl}
            alt={m.thumbnailAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <StatusBadge status="approved" size="sm" />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ── Primary Hook ── */}
      <div className="px-5 py-4 border-b border-white/5 flex-shrink-0">
        <SectionLabel className="mb-2 block">Primary Hook</SectionLabel>
        <motion.div
          className="rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-4"
          whileHover={{ borderColor: 'rgba(139,92,246,0.4)' }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm text-slate-100 leading-relaxed font-medium italic">
            "{m.primaryHook}"
          </p>
        </motion.div>
      </div>

      {/* ── Metadata ── */}
      <div className="px-5 py-2 border-b border-white/5 flex-shrink-0">
        <MetaRow icon={Target} label="Target Audience" value={m.targetAudience} />
        <MetaRow icon={Monitor} label="Primary Platform" value="YouTube" accent />
        <MetaRow icon={Clock} label="Estimated Duration" value={m.estimatedDuration} />
        <MetaRow icon={Users} label="Approved By" value={m.approvedBy} />
        <MetaRow icon={Star} label="CTA" value={m.cta} />
      </div>

      {/* ── Stats row ── */}
      <div className="px-5 py-4 border-b border-white/5 grid grid-cols-3 gap-3 flex-shrink-0">
        {[
          { icon: Hash, label: 'Word Count', value: m.wordCount.toLocaleString() },
          { icon: Type, label: 'Characters', value: m.characterCount.toLocaleString() },
          { icon: AlignLeft, label: 'Version', value: m.version },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-lg bg-white/[0.03] border border-white/5 p-3 flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5">
              <Icon className="w-3 h-3 text-slate-500" />
              <SectionLabel>{label}</SectionLabel>
            </div>
            <span className="text-sm font-mono font-semibold text-slate-100">{value}</span>
          </div>
        ))}
      </div>

      {/* ── Main Script ── */}
      <div className="px-5 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Main Script</SectionLabel>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScriptExpanded(v => !v)}
            className="flex items-center gap-1 text-[10px] font-mono text-[#9D6CFF] hover:text-[#8B5CF6] transition-colors"
          >
            {scriptExpanded ? (
              <>Collapse <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Expand <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </motion.button>
        </div>

        <motion.div
          className="rounded-xl bg-[#07070A] border border-white/5 overflow-hidden"
          animate={{ height: scriptExpanded ? 'auto' : 180 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <pre
            className="p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap overflow-hidden"
          >
            {scriptExpanded ? m.mainScript : previewLines + '\n…'}
          </pre>
          {!scriptExpanded && (
            <div className="h-10 bg-gradient-to-t from-[#07070A] to-transparent -mt-10 pointer-events-none" />
          )}
        </motion.div>
      </div>
    </div>
  );
};
