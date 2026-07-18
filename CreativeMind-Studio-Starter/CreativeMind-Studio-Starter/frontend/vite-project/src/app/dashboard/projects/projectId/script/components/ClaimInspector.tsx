/**
 * ClaimInspector.tsx — Right panel: contextual inspector for the selected block.
 *
 * Displays: claim summary, linked sources, evidence strength gauge,
 * verification status, scene info, related research, reviewer notes,
 * and suggested improvements.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileSearch,
  ShieldCheck,
  Link2,
  Film,
  BookOpen,
  StickyNote,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Sparkles,
  ChevronRight,
  BarChart2,
} from 'lucide-react';
import type { BlockInspectorData, ClaimStatus, ScriptBlock } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Evidence gauge ───────────────────────────────────────────────────────────

const EvidenceGauge: React.FC<{ value: number }> = ({ value }) => {
  const color = value >= 85 ? '#10B981' : value >= 65 ? '#F59E0B' : value > 0 ? '#EF4444' : '#334155';
  const circ  = 2 * Math.PI * 32;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg width={80} height={80} className="rotate-[-90deg]">
          <circle cx={40} cy={40} r={32} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
          <motion.circle
            cx={40} cy={40} r={32}
            fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={circ}
            animate={{ strokeDashoffset: circ - (value / 100) * circ }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-[17px] leading-none" style={{ color }}>
            {value > 0 ? value : '—'}
          </span>
          {value > 0 && <span className="text-[8px] font-mono text-slate-600">/ 100</span>}
        </div>
      </div>
      <span className="text-[9px] font-mono text-slate-600">Evidence Strength</span>
    </div>
  );
};

// ─── Verification badge ───────────────────────────────────────────────────────

const CLAIM_CFG: Record<ClaimStatus, { icon: React.ReactNode; badge: string; label: string }> = {
  'verified':            { icon: <CheckCircle2 className="w-3 h-3" />,  badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', label: 'Verified'          },
  'partially-supported': { icon: <AlertTriangle className="w-3 h-3" />, badge: 'text-amber-400   bg-amber-500/10   border-amber-500/25',   label: 'Partially Supported'},
  'contested':           { icon: <AlertTriangle className="w-3 h-3" />, badge: 'text-orange-400  bg-orange-500/10  border-orange-500/25',  label: 'Contested'         },
  'unverified':          { icon: <HelpCircle className="w-3 h-3" />,    badge: 'text-yellow-400  bg-yellow-500/10  border-yellow-500/25',  label: 'Unverified'        },
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

const InspSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}> = ({ icon, title, color, children }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-[#0B0B12]/60 p-4 space-y-3">
    <div className="flex items-center gap-2">
      <span style={{ color }}>{icon}</span>
      <h4 className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color }}>{title}</h4>
    </div>
    {children}
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
    <div className="w-14 h-14 rounded-2xl bg-[#10101A] border border-white/[0.07]
      flex items-center justify-center">
      <FileSearch className="w-6 h-6 text-slate-700" />
    </div>
    <div>
      <p className="text-[13px] font-display font-semibold text-slate-500">No block selected</p>
      <p className="text-[11px] font-mono text-slate-700 mt-1">Click any script block to inspect</p>
    </div>
  </div>
);

// ─── Block meta overview ──────────────────────────────────────────────────────

const BlockMeta: React.FC<{ block: ScriptBlock }> = ({ block }) => {

  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { label: 'Scene',     value: `Scene ${block.sceneNumber}` },
        { label: 'Type',      value: block.type.replace(/-/g, ' ') },
        { label: 'Words',     value: `${block.wordCount}` },
        { label: 'Duration',  value: block.estimatedDurationSec > 0 ? `${block.estimatedDurationSec}s` : '—' },
        { label: 'Version',   value: `v${block.version}` },
        { label: 'Comments',  value: `${block.commentCount}` },
      ].map(row => (
        <div key={row.label} className="p-2 rounded-[9px] bg-white/[0.03] border border-white/[0.05]">
          <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">{row.label}</p>
          <p className="text-[12px] font-mono font-semibold text-slate-300 mt-0.5 truncate capitalize">{row.value}</p>
        </div>
      ))}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface ClaimInspectorProps {
  data: BlockInspectorData;
}

export const ClaimInspector: React.FC<ClaimInspectorProps> = ({ data }) => {
  const [notesVal, setNotesVal] = useState(
    data.block ? data.reviewerNotes.join('\n\n') : ''
  );

  if (!data.block) return <EmptyState />;

  const block = data.block;

  return (
    <motion.div
      key={block.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="space-y-4"
    >
      {/* Block overview */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0B12]/60 p-4 space-y-3">
        <p className="text-[12px] font-display font-semibold text-slate-200 leading-snug line-clamp-4">
          {block.content.length > 120 ? block.content.slice(0, 120) + '…' : block.content}
        </p>
        <BlockMeta block={block} />
      </div>

      {/* Evidence strength */}
      <InspSection icon={<BarChart2 className="w-3.5 h-3.5" />} title="Evidence Strength" color="#8B5CF6">
        <div className="flex items-center gap-4">
          <EvidenceGauge value={data.evidenceStrength} />
          {block.claimStatus ? (
            <div className="flex-1 space-y-2">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold
                px-2 py-1 rounded-full border ${CLAIM_CFG[block.claimStatus].badge}`}>
                {CLAIM_CFG[block.claimStatus].icon}
                {CLAIM_CFG[block.claimStatus].label}
              </span>
              {block.claimText && (
                <p className="text-[10px] text-slate-500 leading-snug">{block.claimText}</p>
              )}
            </div>
          ) : (
            <div className="flex-1">
              <p className="text-[11px] font-mono text-slate-600">No claim linked to this block</p>
            </div>
          )}
        </div>
      </InspSection>

      {/* Linked sources */}
      <InspSection icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Linked Sources" color="#10B981">
        {data.linkedSources.length > 0 ? (
          <div className="space-y-2.5">
            {data.linkedSources.map(src => (
              <div key={src.id} className="rounded-[10px] border border-white/[0.07] bg-white/[0.02] p-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-semibold text-slate-200 leading-snug flex-1">{src.title}</p>
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 text-slate-600 hover:text-[#8B5CF6] transition-colors">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-mono text-slate-600">{src.publisher}</span>
                  {src.page && <span className="text-[9px] font-mono text-slate-700">{src.page}</span>}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${src.confidenceScore}%` }}
                      transition={{ duration: 0.7, ease: EASE }}
                      className="h-full rounded-full bg-[#8B5CF6]"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#8B5CF6] flex-shrink-0">{src.confidenceScore}%</span>
                </div>
                <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold
                  px-1.5 py-0.5 rounded-full border ${CLAIM_CFG[src.verificationStatus].badge}`}>
                  {CLAIM_CFG[src.verificationStatus].icon}
                  {CLAIM_CFG[src.verificationStatus].label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] font-mono text-slate-600">No sources linked to this block</p>
        )}
      </InspSection>

      {/* Scene information */}
      <InspSection icon={<Film className="w-3.5 h-3.5" />} title="Scene Information" color="#F59E0B">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <ChevronRight className="w-3 h-3 text-slate-700" />
          Scene {block.sceneNumber} · {block.type.replace(/-/g, ' ')}
        </div>
      </InspSection>

      {/* Related research */}
      {data.relatedResearch.length > 0 && (
        <InspSection icon={<BookOpen className="w-3.5 h-3.5" />} title="Related Research" color="#06B6D4">
          <div className="space-y-1.5">
            {data.relatedResearch.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                <Link2 className="w-3 h-3 text-slate-700 flex-shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </InspSection>
      )}

      {/* Suggested improvements */}
      {data.suggestedImprovements.length > 0 && (
        <InspSection icon={<Lightbulb className="w-3.5 h-3.5" />} title="Suggested Improvements" color="#9D6CFF">
          <div className="space-y-2">
            {data.suggestedImprovements.map((s, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-[8px]
                bg-[#7C3AED]/06 border border-[#7C3AED]/18">
                <Sparkles className="w-3 h-3 text-[#9D6CFF] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-snug">{s}</p>
              </div>
            ))}
          </div>
        </InspSection>
      )}

      {/* Reviewer notes */}
      <InspSection icon={<StickyNote className="w-3.5 h-3.5" />} title="Reviewer Notes" color="#64748B">
        <textarea
          value={notesVal}
          onChange={e => setNotesVal(e.target.value)}
          placeholder="Add reviewer note…"
          rows={4}
          className="w-full bg-[#10101A] border border-white/[0.09] rounded-[10px] px-3 py-2.5
            text-[11px] text-slate-300 font-mono placeholder:text-slate-700 resize-none
            focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/50
            transition-all duration-200"
        />
      </InspSection>
    </motion.div>
  );
};
