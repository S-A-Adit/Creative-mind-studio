/**
 * EvidenceInspector.tsx — Right-panel deep inspector for a selected source.
 *
 * Displays: source summary, evidence strength gauge, linked claims,
 * linked script sections, linked scenes, and research notes.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileSearch,
  BookOpen,
  Link2,
  Film,
  ScrollText,
  StickyNote,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  HelpCircle,
  AlertOctagon,
  Plus,
  ExternalLink,
  Quote,
} from 'lucide-react';
import type { SourceCard, VerificationStatus } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Verification badge ───────────────────────────────────────────────────────

const VERIF_ICON: Record<VerificationStatus, React.ReactNode> = {
  'verified':            <CheckCircle2 className="w-3.5 h-3.5" />,
  'partially-supported': <AlertTriangle className="w-3.5 h-3.5" />,
  'contested':           <AlertOctagon className="w-3.5 h-3.5" />,
  'outdated':            <Clock className="w-3.5 h-3.5" />,
  'unverified':          <HelpCircle className="w-3.5 h-3.5" />,
  'rejected':            <XCircle className="w-3.5 h-3.5" />,
};

const VERIF_COLORS: Record<VerificationStatus, string> = {
  'verified':            '#10B981',
  'partially-supported': '#F59E0B',
  'contested':           '#F97316',
  'outdated':            '#64748B',
  'unverified':          '#EAB308',
  'rejected':            '#EF4444',
};

// ─── Strength gauge ───────────────────────────────────────────────────────────

const EvidenceGauge: React.FC<{ value: number }> = ({ value }) => {
  const color = value >= 85 ? '#10B981' : value >= 65 ? '#F59E0B' : '#EF4444';
  const circ  = 2 * Math.PI * 36;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={88} height={88} className="rotate-[-90deg]">
          <circle cx={44} cy={44} r={36} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
          <motion.circle
            cx={44} cy={44} r={36}
            fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: circ - (value / 100) * circ }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-[20px] leading-none" style={{ color }}>
            {value}
          </span>
          <span className="text-[9px] font-mono text-slate-600">/ 100</span>
        </div>
      </div>
      <p className="text-[10px] font-mono text-slate-500">Evidence Strength</p>
    </div>
  );
};

// ─── Linked item row ──────────────────────────────────────────────────────────

const LinkedRow: React.FC<{ label: string; color?: string }> = ({
  label,
  color = '#8B5CF6',
}) => (
  <div className="flex items-center gap-2.5 py-1.5">
    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
    <span className="text-[11px] text-slate-300 leading-snug flex-1">{label}</span>
    <Link2 className="w-3 h-3 text-slate-700 flex-shrink-0" />
  </div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

const InspectorSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}> = ({ icon, title, color, children }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-[#0B0B12]/60 p-4 space-y-3">
    <div className="flex items-center gap-2">
      <span style={{ color }}>{icon}</span>
      <h4 className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color }}>
        {title}
      </h4>
    </div>
    {children}
  </div>
);

// ─── Notes input ──────────────────────────────────────────────────────────────

const NotesInput: React.FC<{ defaultValue?: string }> = ({ defaultValue = '' }) => {
  const [val, setVal] = useState(defaultValue);
  return (
    <textarea
      value={val}
      onChange={e => setVal(e.target.value)}
      placeholder="Add research notes…"
      rows={4}
      className="w-full bg-[#10101A] border border-white/[0.09] rounded-[10px] px-3 py-2.5
        text-[11px] text-slate-300 font-mono placeholder:text-slate-700 resize-none
        focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/50
        transition-all duration-200"
    />
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#10101A] border border-white/[0.07]
      flex items-center justify-center">
      <FileSearch className="w-7 h-7 text-slate-700" />
    </div>
    <div>
      <p className="text-[13px] font-display font-semibold text-slate-400">No source selected</p>
      <p className="text-[11px] font-mono text-slate-600 mt-1">
        Click any source card to inspect its evidence
      </p>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface EvidenceInspectorProps {
  source: SourceCard | null;
  linkedClaims?: string[];
  linkedScriptSections?: string[];
  linkedScenes?: string[];
}

export const EvidenceInspector: React.FC<EvidenceInspectorProps> = ({
  source,
  linkedClaims = [],
  linkedScriptSections = [],
  linkedScenes = [],
}) => {
  if (!source) return <EmptyState />;

  const verifColor = VERIF_COLORS[source.verificationStatus];

  return (
    <motion.div
      key={source.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="space-y-4"
    >
      {/* Source header */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0B12]/60 p-4 space-y-3">
        {/* Gradient strip */}
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${source.thumbnailGradient}`} />

        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold text-[13px] text-slate-100 leading-snug flex-1">
            {source.title}
          </h3>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 rounded-[8px] bg-white/[0.04] border border-white/[0.07]
              text-slate-500 hover:text-[#8B5CF6] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="text-[10px] font-mono text-slate-500">
          {source.author.split(',')[0]} · {source.publisher} · {source.publicationDate}
        </div>

        {/* Verification status */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-[9px] border"
          style={{
            background: verifColor + '10',
            borderColor: verifColor + '30',
            color: verifColor,
          }}
        >
          {VERIF_ICON[source.verificationStatus]}
          <span className="text-[11px] font-mono font-semibold">{source.verificationStatus.replace(/-/g, ' ')}</span>
        </div>
      </div>

      {/* Evidence strength */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0B0B12]/60 p-4 flex flex-col items-center gap-4">
        <EvidenceGauge value={source.confidenceScore} />
        <div className="w-full grid grid-cols-2 gap-2">
          {[
            { label: 'Confidence', value: source.confidenceScore, color: '#8B5CF6' },
            { label: 'Freshness',  value: source.freshnessScore,  color: '#06B6D4' },
          ].map(row => (
            <div key={row.label} className="flex flex-col items-center p-2.5 rounded-[10px]
              bg-white/[0.03] border border-white/[0.05]">
              <span className="font-display font-bold text-[18px] leading-none" style={{ color: row.color }}>
                {row.value}
              </span>
              <span className="text-[9px] font-mono text-slate-600 mt-0.5">{row.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key quotation */}
      <InspectorSection icon={<Quote className="w-3.5 h-3.5" />} title="Key Quotation" color="#9D6CFF">
        <p className="text-[11px] text-slate-400 leading-relaxed italic">
          "{source.relevantQuotation}"
        </p>
        {source.reportPage && (
          <p className="text-[9px] font-mono text-slate-600">{source.reportPage}{source.figureOrTableRef ? ` · ${source.figureOrTableRef}` : ''}</p>
        )}
      </InspectorSection>

      {/* Linked claims */}
      <InspectorSection icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Linked Claims" color="#10B981">
        {linkedClaims.length > 0
          ? linkedClaims.map((c, i) => <LinkedRow key={i} label={c} color="#10B981" />)
          : (
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-mono text-slate-600 flex-1">No claims linked yet</p>
              <button type="button" className="flex items-center gap-1 text-[10px] font-mono
                text-[#8B5CF6] hover:text-[#9D6CFF] transition-colors">
                <Plus className="w-3 h-3" />Link claim
              </button>
            </div>
          )
        }
      </InspectorSection>

      {/* Linked script sections */}
      <InspectorSection icon={<ScrollText className="w-3.5 h-3.5" />} title="Script Sections" color="#06B6D4">
        {linkedScriptSections.length > 0
          ? linkedScriptSections.map((s, i) => <LinkedRow key={i} label={s} color="#06B6D4" />)
          : (
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-mono text-slate-600 flex-1">No script sections linked</p>
              <button type="button" className="flex items-center gap-1 text-[10px] font-mono
                text-[#8B5CF6] hover:text-[#9D6CFF] transition-colors">
                <Plus className="w-3 h-3" />Link
              </button>
            </div>
          )
        }
      </InspectorSection>

      {/* Linked scenes */}
      <InspectorSection icon={<Film className="w-3.5 h-3.5" />} title="Scene Usage" color="#F59E0B">
        {linkedScenes.length > 0
          ? linkedScenes.map((s, i) => <LinkedRow key={i} label={s} color="#F59E0B" />)
          : (
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-mono text-slate-600 flex-1">No scenes linked yet</p>
              <button type="button" className="flex items-center gap-1 text-[10px] font-mono
                text-[#8B5CF6] hover:text-[#9D6CFF] transition-colors">
                <Plus className="w-3 h-3" />Link scene
              </button>
            </div>
          )
        }
      </InspectorSection>

      {/* Research notes */}
      <InspectorSection icon={<StickyNote className="w-3.5 h-3.5" />} title="Research Notes" color="#8B5CF6">
        <NotesInput defaultValue={source.notes} />
      </InspectorSection>

      {/* Source metadata summary */}
      <InspectorSection icon={<BookOpen className="w-3.5 h-3.5" />} title="Source Metadata" color="#64748B">
        <div className="space-y-1.5">
          {[
            { label: 'Source Type',   value: source.sourceType.replace(/-/g, ' ') },
            { label: 'Tier',          value: source.tier + ' source' },
            { label: 'Publisher',     value: source.publisher },
            { label: 'Author',        value: source.author },
            { label: 'Published',     value: source.publicationDate },
            { label: 'Researcher',    value: source.assignedResearcher.name },
          ].map(row => (
            <div key={row.label} className="flex justify-between gap-2">
              <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest flex-shrink-0">
                {row.label}
              </span>
              <span className="text-[10px] font-mono text-slate-400 text-right truncate">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </InspectorSection>
    </motion.div>
  );
};
