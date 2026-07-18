/**
 * AssetFilterPanel.tsx — Left-side filter panel for the Asset Room.
 * Covers: search, category, status, license, rights risk, commercial use, premium filter.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Film,
  Image,
  Music,
  BarChart2,
  Map,
  Newspaper,
  Sparkles,
  Video,
  Camera,
  Layers,
} from 'lucide-react';
import type { AssetFilters, AssetCategory, AssetStatus, LicenseType, RightsRisk } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES: { value: AssetCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all',               label: 'All Assets',       icon: <Layers className="w-3.5 h-3.5" /> },
  { value: 'stock-footage',     label: 'Stock Footage',    icon: <Film className="w-3.5 h-3.5" /> },
  { value: 'archival-footage',  label: 'Archival Footage', icon: <Video className="w-3.5 h-3.5" /> },
  { value: 'news-reference',    label: 'News Reference',   icon: <Newspaper className="w-3.5 h-3.5" /> },
  { value: 'image',             label: 'Images',           icon: <Image className="w-3.5 h-3.5" /> },
  { value: 'chart',             label: 'Charts & Data',    icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { value: 'map',               label: 'Maps',             icon: <Map className="w-3.5 h-3.5" /> },
  { value: 'music',             label: 'Music',            icon: <Music className="w-3.5 h-3.5" /> },
  { value: 'sound-effect',      label: 'Sound Effects',    icon: <Music className="w-3.5 h-3.5" /> },
  { value: 'interview',         label: 'Interviews',       icon: <Camera className="w-3.5 h-3.5" /> },
  { value: 'ai-generated',      label: 'AI Generated',     icon: <Sparkles className="w-3.5 h-3.5" /> },
  { value: 'motion-graphic',    label: 'Motion Graphics',  icon: <Layers className="w-3.5 h-3.5" /> },
  { value: 'original-shoot',    label: 'Original Shoot',   icon: <Camera className="w-3.5 h-3.5" /> },
  { value: 'report-screenshot', label: 'Report Screenshots', icon: <Image className="w-3.5 h-3.5" /> },
];

const STATUSES: { value: AssetStatus | 'all'; label: string; color: string }[] = [
  { value: 'all',              label: 'All Statuses',       color: '#6B7280' },
  { value: 'suggested',        label: 'Suggested',          color: '#8B5CF6' },
  { value: 'shortlisted',      label: 'Shortlisted',        color: '#3B82F6' },
  { value: 'approved',         label: 'Approved',           color: '#10B981' },
  { value: 'purchased',        label: 'Purchased',          color: '#F59E0B' },
  { value: 'downloaded',       label: 'Downloaded',         color: '#06B6D4' },
  { value: 'used',             label: 'Used in Edit',       color: '#EC4899' },
  { value: 'rejected',         label: 'Rejected',           color: '#EF4444' },
  { value: 'attribution-added', label: 'Attribution Added', color: '#84CC16' },
];

const LICENSES: { value: LicenseType | 'all'; label: string }[] = [
  { value: 'all',           label: 'All Licenses'     },
  { value: 'cc0',           label: 'CC0 (Public Domain)' },
  { value: 'cc-by',         label: 'CC BY'            },
  { value: 'cc-by-nc',      label: 'CC BY-NC'         },
  { value: 'royalty-free',  label: 'Royalty-Free'     },
  { value: 'editorial-only', label: 'Editorial Only'  },
  { value: 'rights-managed', label: 'Rights-Managed'  },
  { value: 'ai-generated',  label: 'AI-Generated'     },
  { value: 'proprietary',   label: 'Proprietary'      },
];

const RISK_LEVELS: { value: RightsRisk | 'all'; label: string; color: string }[] = [
  { value: 'all',     label: 'All Risk Levels', color: '#6B7280' },
  { value: 'low',     label: 'Low Risk',        color: '#10B981' },
  { value: 'medium',  label: 'Medium Risk',     color: '#F59E0B' },
  { value: 'high',    label: 'High Risk',       color: '#EF4444' },
  { value: 'blocked', label: 'Blocked',         color: '#7C3AED' },
];

// ─── Collapsible section ──────────────────────────────────────────────────────

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.06]">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3
          text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest
          hover:text-slate-200 transition-colors"
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15, ease: EASE }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Active filter tag ────────────────────────────────────────────────────────

export const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <motion.span
    layout
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.85 }}
    transition={{ duration: 0.15, ease: EASE }}
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
      bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[10px] font-mono text-[#9D6CFF]"
  >
    {label}
    <button type="button" onClick={onRemove} className="hover:text-white transition-colors">
      <X className="w-2.5 h-2.5" />
    </button>
  </motion.span>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface AssetFilterPanelProps {
  filters: AssetFilters;
  onFiltersChange: (f: AssetFilters) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
}

export const AssetFilterPanel: React.FC<AssetFilterPanelProps> = ({
  filters,
  onFiltersChange,
  categoryCounts,
  filteredCount,
}) => {
  const set = <K extends keyof AssetFilters>(key: K, value: AssetFilters[K]) =>
    onFiltersChange({ ...filters, [key]: value });

  const resetAll = () =>
    onFiltersChange({
      search: '',
      category: 'all',
      status: 'all',
      license: 'all',
      rightsRisk: 'all',
      commercial: 'all',
      isPremium: 'all',
      scene: 'all',
    });

  const activeFilterCount = [
    filters.category !== 'all',
    filters.status !== 'all',
    filters.license !== 'all',
    filters.rightsRisk !== 'all',
    filters.commercial !== 'all',
    filters.isPremium !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-[#0B0B12] border-r border-white/[0.06] overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#9D6CFF]" />
          <span className="text-[12px] font-mono font-semibold text-slate-200">Filters</span>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full
              bg-[#7C3AED]/20 text-[#9D6CFF] border border-[#7C3AED]/30">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="text-[10px] font-mono text-slate-500 hover:text-[#9D6CFF] transition-colors"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search assets…"
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-[10px]
              pl-8 pr-8 py-2 text-[12px] font-mono text-slate-200 placeholder:text-slate-600
              focus:outline-none focus:border-[#7C3AED]/50 focus:bg-white/[0.06]
              transition-all duration-150"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => set('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-[10px] font-mono text-slate-600 mt-2">
          {filteredCount} asset{filteredCount !== 1 ? 's' : ''} shown
        </p>
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="px-3 space-y-0.5">
          {CATEGORIES.map(cat => {
            const count = cat.value === 'all'
              ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
              : (categoryCounts[cat.value] ?? 0);
            const active = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => set('category', cat.value)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[9px]
                  text-[11px] font-mono transition-all duration-150 text-left
                  ${active
                    ? 'bg-[#7C3AED]/15 text-[#9D6CFF] border border-[#7C3AED]/30'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
                  }`}
              >
                <span className={active ? 'text-[#9D6CFF]' : 'text-slate-600'}>{cat.icon}</span>
                <span className="flex-1 truncate">{cat.label}</span>
                <span className={`text-[10px] ${active ? 'text-[#9D6CFF]/70' : 'text-slate-600'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status" defaultOpen={false}>
        <div className="px-3 space-y-0.5">
          {STATUSES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => set('status', s.value)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[9px]
                text-[11px] font-mono transition-all duration-150 text-left
                ${filters.status === s.value
                  ? 'bg-white/[0.06] text-slate-200 border border-white/[0.12]'
                  : 'text-slate-400 hover:bg-white/[0.04] border border-transparent'
                }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
              {s.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* License */}
      <FilterSection title="License" defaultOpen={false}>
        <div className="px-3 space-y-0.5">
          {LICENSES.map(l => (
            <button
              key={l.value}
              type="button"
              onClick={() => set('license', l.value)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-[9px]
                text-[11px] font-mono transition-all duration-150 text-left
                ${filters.license === l.value
                  ? 'bg-white/[0.06] text-slate-200 border border-white/[0.12]'
                  : 'text-slate-400 hover:bg-white/[0.04] border border-transparent'
                }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Rights Risk */}
      <FilterSection title="Rights Risk" defaultOpen={false}>
        <div className="px-3 space-y-0.5">
          {RISK_LEVELS.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => set('rightsRisk', r.value)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[9px]
                text-[11px] font-mono transition-all duration-150 text-left
                ${filters.rightsRisk === r.value
                  ? 'bg-white/[0.06] text-slate-200 border border-white/[0.12]'
                  : 'text-slate-400 hover:bg-white/[0.04] border border-transparent'
                }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
              {r.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Commercial Use */}
      <FilterSection title="Commercial Use" defaultOpen={false}>
        <div className="px-3 space-y-0.5">
          {(['all', 'yes', 'no'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => set('commercial', v)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-[9px]
                text-[11px] font-mono transition-all duration-150 text-left
                ${filters.commercial === v
                  ? 'bg-white/[0.06] text-slate-200 border border-white/[0.12]'
                  : 'text-slate-400 hover:bg-white/[0.04] border border-transparent'
                }`}
            >
              {v === 'all' ? 'All' : v === 'yes' ? 'Commercial OK' : 'Non-commercial only'}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Premium / Free */}
      <FilterSection title="Cost" defaultOpen={false}>
        <div className="px-3 space-y-0.5">
          {(['all', 'free', 'premium'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => set('isPremium', v)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-[9px]
                text-[11px] font-mono transition-all duration-150 text-left
                ${filters.isPremium === v
                  ? 'bg-white/[0.06] text-slate-200 border border-white/[0.12]'
                  : 'text-slate-400 hover:bg-white/[0.04] border border-transparent'
                }`}
            >
              {v === 'all' ? 'All Assets' : v === 'free' ? 'Free Only' : 'Premium Only'}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Spacer */}
      <div className="flex-1" />
    </div>
  );
};
