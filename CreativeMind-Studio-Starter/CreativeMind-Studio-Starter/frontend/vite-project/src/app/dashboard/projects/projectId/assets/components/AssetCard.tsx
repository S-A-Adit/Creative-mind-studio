/**
 * AssetCard.tsx — Individual asset card with grid, list, and board variants.
 * Shows thumbnail, status badge, rights-risk indicator, hover actions.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  ExternalLink,
  Star,
  DollarSign,
  Link2,
  Eye,
} from 'lucide-react';
import type { AssetCard as AssetCardType, AssetStatus, RightsRisk } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<AssetStatus, { label: string; color: string; bg: string }> = {
  suggested:         { label: 'Suggested',    color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  shortlisted:       { label: 'Shortlisted',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  approved:          { label: 'Approved',     color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  rejected:          { label: 'Rejected',     color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
  purchased:         { label: 'Purchased',    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  downloaded:        { label: 'Downloaded',   color: '#06B6D4', bg: 'rgba(6,182,212,0.12)'  },
  used:              { label: 'In Edit',      color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  'attribution-added': { label: 'Attribution', color: '#84CC16', bg: 'rgba(132,204,22,0.12)' },
};

// ─── Rights risk badge ────────────────────────────────────────────────────────

const RISK_CFG: Record<RightsRisk, { icon: React.ReactNode; color: string; label: string }> = {
  low:     { icon: <ShieldCheck className="w-3 h-3" />,  color: '#10B981', label: 'Low Risk'  },
  medium:  { icon: <ShieldAlert className="w-3 h-3" />,  color: '#F59E0B', label: 'Med Risk'  },
  high:    { icon: <ShieldAlert className="w-3 h-3" />,  color: '#EF4444', label: 'High Risk' },
  blocked: { icon: <ShieldOff className="w-3 h-3" />,    color: '#7C3AED', label: 'Blocked'   },
};

// ─── Duration formatter ───────────────────────────────────────────────────────

function fmtDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

// ─── Grid card ────────────────────────────────────────────────────────────────

interface AssetCardProps {
  asset: AssetCardType;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'grid' | 'list' | 'board' | 'scene-linked' | 'rights-risk';
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isSelected,
  onSelect,
  viewMode,
}) => {
  const status = STATUS_CFG[asset.status];
  const risk = RISK_CFG[asset.rightsRisk];

  if (viewMode === 'list') {
    return <AssetListRow asset={asset} isSelected={isSelected} onSelect={onSelect} status={status} risk={risk} />;
  }

  // Grid / board / scene-linked / rights-risk all use the grid card
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.2, ease: EASE }}
      whileHover={{ y: -2 }}
      onClick={onSelect}
      className={`group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer
        border transition-all duration-200
        ${isSelected
          ? 'border-[#7C3AED]/60 shadow-lg shadow-[#7C3AED]/10'
          : 'border-white/[0.08] hover:border-white/[0.18]'
        }
        bg-[#10101A]`}
    >
      {/* Thumbnail */}
      <div className={`relative h-36 bg-gradient-to-br ${asset.thumbnailGradient} flex-shrink-0 overflow-hidden`}>
        {/* Thumbnail icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl opacity-40 select-none">{asset.thumbnailIcon}</span>
        </div>

        {/* Duration badge */}
        {asset.durationSec !== undefined && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md
            bg-black/60 backdrop-blur-sm text-[9px] font-mono text-white">
            {fmtDuration(asset.durationSec)}
          </div>
        )}

        {/* Resolution */}
        {asset.resolution && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md
            bg-black/50 backdrop-blur-sm text-[9px] font-mono text-slate-300">
            {asset.resolution}
          </div>
        )}

        {/* Selection ring */}
        {isSelected && (
          <div className="absolute inset-0 ring-2 ring-inset ring-[#7C3AED]/60 rounded-2xl pointer-events-none" />
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm
              text-white hover:bg-white/20 transition-colors border border-white/20"
            onClick={e => { e.stopPropagation(); }}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-full bg-[#7C3AED]/80 backdrop-blur-sm
              text-white hover:bg-[#8B5CF6] transition-colors border border-[#9D6CFF]/30"
            onClick={e => { e.stopPropagation(); }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm
              text-white hover:bg-white/20 transition-colors border border-white/20"
            onClick={e => { e.stopPropagation(); }}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Title row */}
        <div className="flex items-start gap-2">
          <p className="text-[12px] font-semibold text-slate-200 flex-1 leading-tight line-clamp-2">
            {asset.title}
          </p>
          {asset.isPremium && (
            <Star className="w-3 h-3 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          )}
        </div>

        {/* Source */}
        <p className="text-[10px] font-mono text-slate-500">{asset.source} · {asset.creator}</p>

        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Status */}
          <span
            className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold"
            style={{ color: status.color, background: status.bg }}
          >
            {status.label}
          </span>

          {/* Rights risk */}
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono"
            style={{ color: risk.color, background: risk.color + '15' }}
          >
            {risk.icon}
            {risk.label}
          </span>

          {/* Premium cost */}
          {asset.estimatedCostUSD !== undefined && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono
              text-[#F59E0B] bg-[#F59E0B]/10">
              <DollarSign className="w-2.5 h-2.5" />{asset.estimatedCostUSD}
            </span>
          )}
        </div>

        {/* Scene assignment */}
        {asset.assignedSceneLabel && (
          <div className="flex items-center gap-1.5 mt-auto">
            <Link2 className="w-3 h-3 text-slate-600 flex-shrink-0" />
            <span className="text-[10px] font-mono text-slate-500 truncate">
              {asset.assignedSceneLabel}
            </span>
          </div>
        )}
      </div>

      {/* Download state bar */}
      {asset.downloadStatus === 'downloading' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.05]">
          <motion.div
            className="h-full bg-[#7C3AED]"
            animate={{ width: ['20%', '80%', '40%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Downloaded indicator */}
      {asset.downloadStatus === 'downloaded' && (
        <div className="absolute top-2 left-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] drop-shadow-sm" />
        </div>
      )}
    </motion.div>
  );
};

// ─── List row ─────────────────────────────────────────────────────────────────

interface ListRowProps {
  asset: AssetCardType;
  isSelected: boolean;
  onSelect: () => void;
  status: { label: string; color: string; bg: string };
  risk: { icon: React.ReactNode; color: string; label: string };
}

const AssetListRow: React.FC<ListRowProps> = ({ asset, isSelected, onSelect, status, risk }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -8 }}
    transition={{ duration: 0.18, ease: EASE }}
    onClick={onSelect}
    className={`group flex items-center gap-4 px-4 py-3 cursor-pointer
      border-b border-white/[0.05] transition-all duration-150
      ${isSelected ? 'bg-[#7C3AED]/08' : 'hover:bg-white/[0.02]'}`}
  >
    {/* Thumbnail mini */}
    <div className={`w-14 h-9 rounded-[8px] flex-shrink-0 bg-gradient-to-br ${asset.thumbnailGradient}
      flex items-center justify-center text-lg`}>
      <span className="opacity-60 text-sm">{asset.thumbnailIcon}</span>
    </div>

    {/* Title + source */}
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-semibold text-slate-200 truncate">{asset.title}</p>
      <p className="text-[10px] font-mono text-slate-500">{asset.source} · {asset.creator}</p>
    </div>

    {/* Scene */}
    <div className="w-40 hidden lg:block">
      {asset.assignedSceneLabel
        ? <span className="text-[10px] font-mono text-slate-500 truncate block">{asset.assignedSceneLabel}</span>
        : <span className="text-[10px] font-mono text-slate-700">Unassigned</span>
      }
    </div>

    {/* Status */}
    <div className="w-24 hidden md:block">
      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono"
        style={{ color: status.color, background: status.bg }}>
        {status.label}
      </span>
    </div>

    {/* Risk */}
    <div className="w-24 hidden md:flex items-center gap-1" style={{ color: risk.color }}>
      {risk.icon}
      <span className="text-[10px] font-mono">{risk.label}</span>
    </div>

    {/* Size */}
    <div className="w-16 text-right hidden lg:block">
      <span className="text-[10px] font-mono text-slate-600">{asset.fileSizeMb} MB</span>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button type="button"
        className="p-1.5 rounded-[7px] text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
        onClick={e => e.stopPropagation()}>
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button type="button"
        className="p-1.5 rounded-[7px] text-slate-500 hover:text-[#9D6CFF] hover:bg-[#7C3AED]/10 transition-colors"
        onClick={e => e.stopPropagation()}>
        <Download className="w-3.5 h-3.5" />
      </button>
      {asset.downloadStatus === 'downloading' && <Clock className="w-3 h-3 text-[#7C3AED] animate-spin" />}
    </div>
  </motion.div>
);
