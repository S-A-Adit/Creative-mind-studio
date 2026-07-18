/**
 * PlatformAdaptationsPanel.tsx — Right panel of the Distribution Room
 *
 * A filterable grid of PlatformCard components with a summary stats bar.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { PLATFORM_ADAPTATIONS } from '../mockData';
import type { PublicationStatus } from '../types';
import { PlatformCard } from './PlatformCard';
import { STATUS_CONFIG } from './DistributionShared';

// ─── Status Filter Tabs ───────────────────────────────────────────────────────

const ALL_STATUSES: Array<PublicationStatus | 'all'> = [
  'all', 'draft', 'generating', 'ready-for-review', 'approved', 'ready-to-publish', 'published',
];

interface StatusFilterTabsProps {
  active: PublicationStatus | 'all';
  counts: Partial<Record<PublicationStatus | 'all', number>>;
  onChange: (s: PublicationStatus | 'all') => void;
}

const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({ active, counts, onChange }) => (
  <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
    {ALL_STATUSES.map(s => {
      const count = counts[s] ?? 0;
      if (s !== 'all' && count === 0) return null;
      const cfg = s === 'all' ? null : STATUS_CONFIG[s];
      return (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
            active === s
              ? 'bg-[#8B5CF6]/15 text-[#9D6CFF] border border-[#8B5CF6]/30'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'
          }`}
        >
          {s === 'all' ? 'All' : cfg?.label}
          {count > 0 && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                active === s ? 'bg-[#8B5CF6]/20 text-[#9D6CFF]' : 'bg-white/[0.06] text-slate-400'
              }`}
            >
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface PlatformAdaptationsPanelProps {
  selectedId: string | null;
  onSelectPlatform: (id: string) => void;
}

export const PlatformAdaptationsPanel: React.FC<PlatformAdaptationsPanelProps> = ({
  selectedId,
  onSelectPlatform,
}) => {
  const [filterStatus, setFilterStatus] = useState<PublicationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<PublicationStatus | 'all', number>> = { all: PLATFORM_ADAPTATIONS.length };
    PLATFORM_ADAPTATIONS.forEach(a => {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    let items = PLATFORM_ADAPTATIONS;
    if (filterStatus !== 'all') items = items.filter(a => a.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        a =>
          a.platformName.toLowerCase().includes(q) ||
          a.generatedTitle.toLowerCase().includes(q) ||
          a.assignedTo.toLowerCase().includes(q)
      );
    }
    return items;
  }, [filterStatus, searchQuery]);

  // overall readiness for visible items
  const avgReadiness = filtered.length
    ? Math.round(filtered.reduce((s, a) => s + a.readinessScore, 0) / filtered.length)
    : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0B0B12]">
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display font-semibold text-white text-base">
              Platform Adaptations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {PLATFORM_ADAPTATIONS.length} platforms · avg readiness{' '}
              <span className="text-[#8B5CF6] font-medium">{avgReadiness}%</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {[{ id: 'grid', Icon: LayoutGrid }, { id: 'list', Icon: List }].map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as 'grid' | 'list')}
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                  viewMode === id
                    ? 'bg-[#8B5CF6]/20 text-[#9D6CFF]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search platforms, titles, team…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/[0.03] border border-white/[0.07] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#8B5CF6]/40 focus:bg-[#8B5CF6]/5 transition-all"
          />
        </div>

        {/* Status filter tabs */}
        <StatusFilterTabs
          active={filterStatus}
          counts={statusCounts}
          onChange={setFilterStatus}
        />
      </div>

      {/* ── Cards ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <SlidersHorizontal className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-sm text-slate-500">No platforms match your filter</p>
            <button
              onClick={() => { setFilterStatus('all'); setSearchQuery(''); }}
              className="mt-2 text-xs text-[#9D6CFF] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 xl:grid-cols-2 gap-4'
                  : 'flex flex-col gap-3'
              }
            >
              {filtered.map((adaptation, i) => (
                <motion.div
                  key={adaptation.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                >
                  <PlatformCard
                    adaptation={adaptation}
                    isSelected={selectedId === adaptation.id}
                    onSelect={() => onSelectPlatform(adaptation.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
