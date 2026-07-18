/**
 * AssetInspector.tsx — Right-side inspector panel for a selected asset.
 * Shows full metadata, rights summary, script linkages, AI suggestions, quick actions.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  CheckCircle2,
  ExternalLink,
  Tag,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Link2,
  FileText,
  Sparkles,
  DollarSign,
  Star,
  Copy,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import type { AssetCard, RightsRisk, AssetStatus } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Status & risk configs ────────────────────────────────────────────────────

const STATUS_OPTS: { value: AssetStatus; label: string; color: string }[] = [
  { value: 'suggested',         label: 'Suggested',        color: '#8B5CF6' },
  { value: 'shortlisted',       label: 'Shortlisted',      color: '#3B82F6' },
  { value: 'approved',          label: 'Approved',         color: '#10B981' },
  { value: 'purchased',         label: 'Purchased',        color: '#F59E0B' },
  { value: 'downloaded',        label: 'Downloaded',       color: '#06B6D4' },
  { value: 'used',              label: 'In Edit',          color: '#EC4899' },
  { value: 'rejected',          label: 'Rejected',         color: '#EF4444' },
  { value: 'attribution-added', label: 'Attribution Added', color: '#84CC16' },
];

const RISK_ICON: Record<RightsRisk, React.ReactNode> = {
  low:     <ShieldCheck className="w-4 h-4" />,
  medium:  <ShieldAlert className="w-4 h-4" />,
  high:    <ShieldAlert className="w-4 h-4" />,
  blocked: <ShieldOff className="w-4 h-4" />,
};

const RISK_COLOR: Record<RightsRisk, string> = {
  low: '#10B981', medium: '#F59E0B', high: '#EF4444', blocked: '#7C3AED',
};

// ─── Section divider ──────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-t border-white/[0.06] pt-4 mt-4">
    <p className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-widest mb-3">{title}</p>
    {children}
  </div>
);

// ─── Meta row ─────────────────────────────────────────────────────────────────

const MetaRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 py-1.5">
    <span className="text-[11px] font-mono text-slate-600 flex-shrink-0 w-28">{label}</span>
    <span className="text-[11px] font-mono text-slate-300 text-right flex-1 min-w-0 break-words">{value}</span>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface AssetInspectorProps {
  asset: AssetCard | null;
  onClose: () => void;
  onStatusChange: (id: string, status: AssetStatus) => void;
}

export const AssetInspector: React.FC<AssetInspectorProps> = ({
  asset,
  onClose,
  onStatusChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAttribution = () => {
    if (asset?.attributionText) {
      navigator.clipboard.writeText(asset.attributionText).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {asset && (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="flex flex-col h-full bg-[#0B0B12] border-l border-white/[0.06] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                {asset.isPremium && <Star className="w-3 h-3 text-[#F59E0B]" />}
                <span className="text-[10px] font-mono text-slate-600 capitalize">
                  {asset.category.replace(/-/g, ' ')}
                </span>
              </div>
              <h3 className="text-[13px] font-display font-semibold text-slate-100 leading-tight">
                {asset.title}
              </h3>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">{asset.source} · {asset.creator}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[8px] text-slate-500 hover:text-slate-300
                hover:bg-white/[0.06] transition-colors flex-shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail */}
          <div className={`h-32 bg-gradient-to-br ${asset.thumbnailGradient}
            flex items-center justify-center flex-shrink-0`}>
            <span className="text-5xl opacity-40 select-none">{asset.thumbnailIcon}</span>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-1">

            {/* Rights Risk Banner */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-[10px] border mb-2"
              style={{
                color: RISK_COLOR[asset.rightsRisk],
                borderColor: RISK_COLOR[asset.rightsRisk] + '30',
                background: RISK_COLOR[asset.rightsRisk] + '10',
              }}
            >
              {RISK_ICON[asset.rightsRisk]}
              <div className="flex-1">
                <p className="text-[11px] font-mono font-semibold capitalize">
                  {asset.rightsRisk} Rights Risk
                </p>
                <p className="text-[10px] font-mono opacity-80">{asset.usageRights}</p>
              </div>
            </div>

            {/* Status selector */}
            <div className="flex flex-wrap gap-1.5 py-2">
              {STATUS_OPTS.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onStatusChange(asset.id, s.value)}
                  className={`px-2 py-1 rounded-full text-[10px] font-mono transition-all duration-150
                    border ${asset.status === s.value
                      ? 'border-current font-semibold'
                      : 'border-transparent bg-white/[0.04] text-slate-500 hover:text-slate-300'
                    }`}
                  style={asset.status === s.value
                    ? { color: s.color, background: s.color + '15' }
                    : undefined}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Metadata */}
            <Section title="File Details">
              <MetaRow label="Resolution" value={asset.resolution ?? 'N/A'} />
              <MetaRow label="Aspect Ratio" value={asset.aspectRatio} />
              {asset.durationSec !== undefined && (
                <MetaRow label="Duration" value={`${asset.durationSec}s`} />
              )}
              <MetaRow label="File Size" value={`${asset.fileSizeMb} MB`} />
              <MetaRow label="Added" value={asset.addedAt} />
            </Section>

            {/* License */}
            <Section title="License & Rights">
              <MetaRow label="License" value={
                <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-white/[0.06] border border-white/[0.12]">
                  {asset.license}
                </span>
              } />
              <MetaRow label="Commercial" value={
                <span className={asset.commercialUse ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                  {asset.commercialUse ? 'Allowed' : 'Not allowed'}
                </span>
              } />
              <MetaRow label="Attribution" value={
                <span className={asset.attributionRequired ? 'text-[#F59E0B]' : 'text-slate-400'}>
                  {asset.attributionRequired ? 'Required' : 'Not required'}
                </span>
              } />
              {asset.estimatedCostUSD !== undefined && (
                <MetaRow label="Estimated Cost" value={
                  <span className="flex items-center gap-0.5 text-[#F59E0B]">
                    <DollarSign className="w-3 h-3" />{asset.estimatedCostUSD}
                  </span>
                } />
              )}
              <p className="text-[10px] font-mono text-slate-600 mt-2 leading-relaxed">
                {asset.licenseDetails}
              </p>
            </Section>

            {/* Attribution text */}
            {asset.attributionText && (
              <Section title="Attribution Text">
                <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-[10px] p-3">
                  <p className="text-[10px] font-mono text-slate-400 leading-relaxed pr-8">
                    {asset.attributionText}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyAttribution}
                    className="absolute top-2 right-2 p-1 rounded-[6px]
                      text-slate-600 hover:text-[#9D6CFF] hover:bg-[#7C3AED]/10 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </Section>
            )}

            {/* Script linkages */}
            {(asset.linkedScriptSections.length > 0 || asset.linkedScenes.length > 0) && (
              <Section title="Script Linkages">
                {asset.linkedScriptSections.map(s => (
                  <div key={s} className="flex items-center gap-2 py-1">
                    <FileText className="w-3 h-3 text-slate-600 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-slate-400">{s}</span>
                  </div>
                ))}
                {asset.linkedScenes.map(s => (
                  <div key={s} className="flex items-center gap-2 py-1">
                    <Link2 className="w-3 h-3 text-slate-600 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-slate-400">{s}</span>
                  </div>
                ))}
              </Section>
            )}

            {/* Tags */}
            {asset.tags.length > 0 && (
              <Section title="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full
                      bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-slate-500">
                      <Tag className="w-2.5 h-2.5" />{t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* AI Suggestions */}
            {asset.aiSuggestions.length > 0 && (
              <Section title="AI Suggestions">
                <div className="space-y-2">
                  {asset.aiSuggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-[10px]
                      bg-[#7C3AED]/08 border border-[#7C3AED]/20">
                      <Sparkles className="w-3 h-3 text-[#9D6CFF] mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] font-mono text-slate-400 leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Notes */}
            {asset.notes && (
              <Section title="Notes">
                <p className="text-[11px] font-mono text-slate-500 leading-relaxed">{asset.notes}</p>
              </Section>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex flex-col gap-2 px-4 pb-4 pt-2 border-t border-white/[0.06] flex-shrink-0">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-[11px]
                bg-[#7C3AED] text-white text-[12px] font-mono font-semibold
                hover:bg-[#8B5CF6] transition-colors duration-150"
            >
              <Download className="w-3.5 h-3.5" />
              Download Asset
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 rounded-[10px]
                  bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-400
                  hover:border-white/[0.18] hover:text-slate-200 transition-all duration-150"
              >
                <ExternalLink className="w-3 h-3" />
                Open Source
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 rounded-[10px]
                  bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-400
                  hover:border-[#EF4444]/40 hover:text-[#EF4444] transition-all duration-150"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 py-2 rounded-[10px]
                bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-400
                hover:border-white/[0.18] hover:text-slate-200 transition-all duration-150"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              View Full Details
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
