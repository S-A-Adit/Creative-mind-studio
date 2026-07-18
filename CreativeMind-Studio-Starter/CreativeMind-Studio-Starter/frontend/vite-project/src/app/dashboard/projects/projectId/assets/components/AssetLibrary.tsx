/**
 * AssetLibrary.tsx — Centre panel: view-mode switcher + asset grid/list/board.
 * 5 view modes: grid | list | board | scene-linked | rights-risk
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  List,
  Kanban,
  Link2,
  ShieldAlert,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  RefreshCw,
} from 'lucide-react';
import { AssetCard } from './AssetCard';
import type { AssetCard as AssetCardType, ViewMode } from '../types';

const _EASE = [0.22, 1, 0.36, 1] as const;
void _EASE;

// ─── View mode config ─────────────────────────────────────────────────────────

const VIEW_MODES: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
  { id: 'grid',         icon: <LayoutGrid className="w-3.5 h-3.5" />,  label: 'Grid'         },
  { id: 'list',         icon: <List className="w-3.5 h-3.5" />,        label: 'List'         },
  { id: 'board',        icon: <Kanban className="w-3.5 h-3.5" />,      label: 'Board'        },
  { id: 'scene-linked', icon: <Link2 className="w-3.5 h-3.5" />,       label: 'Scene-Linked' },
  { id: 'rights-risk',  icon: <ShieldAlert className="w-3.5 h-3.5" />, label: 'Rights Risk'  },
];

// ─── Sort config ──────────────────────────────────────────────────────────────

type SortField = 'title' | 'addedAt' | 'fileSizeMb' | 'status' | 'rightsRisk';
const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'addedAt',    label: 'Date Added'  },
  { value: 'title',      label: 'Title'       },
  { value: 'fileSizeMb', label: 'File Size'   },
  { value: 'status',     label: 'Status'      },
  { value: 'rightsRisk', label: 'Rights Risk' },
];

// ─── Scene group (scene-linked view) ─────────────────────────────────────────

const RISK_ORDER: Record<string, number> = { low: 0, medium: 1, high: 2, blocked: 3 };
const STATUS_ORDER: Record<string, number> = {
  approved: 0, downloaded: 1, purchased: 2, shortlisted: 3,
  suggested: 4, used: 5, 'attribution-added': 6, rejected: 7,
};

function sortAssets(assets: AssetCardType[], field: SortField, dir: 'asc' | 'desc'): AssetCardType[] {
  const sorted = [...assets].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'title':      cmp = a.title.localeCompare(b.title); break;
      case 'addedAt':    cmp = a.addedAt.localeCompare(b.addedAt); break;
      case 'fileSizeMb': cmp = a.fileSizeMb - b.fileSizeMb; break;
      case 'status':     cmp = (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99); break;
      case 'rightsRisk': cmp = (RISK_ORDER[a.rightsRisk] ?? 99) - (RISK_ORDER[b.rightsRisk] ?? 99); break;
    }
    return dir === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

// ─── Scene-linked grouping ────────────────────────────────────────────────────

const SceneGroup: React.FC<{
  label: string;
  assets: AssetCardType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ label, assets, selectedId, onSelect }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3 px-1">
      <Link2 className="w-3.5 h-3.5 text-[#9D6CFF]" />
      <span className="text-[11px] font-mono font-semibold text-slate-300">{label}</span>
      <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded-full
        bg-white/[0.04] border border-white/[0.08]">
        {assets.length}
      </span>
    </div>
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
      {assets.map(a => (
        <AssetCard
          key={a.id}
          asset={a}
          viewMode="grid"
          isSelected={selectedId === a.id}
          onSelect={() => onSelect(a.id)}
        />
      ))}
    </div>
  </div>
);

// ─── Rights-risk grouping ─────────────────────────────────────────────────────

const RISK_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  blocked: { label: 'Blocked',      color: '#7C3AED', desc: 'Cannot be used — IP or permission issue' },
  high:    { label: 'High Risk',    color: '#EF4444', desc: 'Significant rights uncertainty'          },
  medium:  { label: 'Medium Risk',  color: '#F59E0B', desc: 'Review usage rights before publishing'   },
  low:     { label: 'Low / Clear',  color: '#10B981', desc: 'Rights verified and clear for use'       },
};

const RiskGroup: React.FC<{
  riskLevel: string;
  assets: AssetCardType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ riskLevel, assets, selectedId, onSelect }) => {
  const cfg = RISK_LABELS[riskLevel] ?? { label: riskLevel, color: '#6B7280', desc: '' };
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
        <span className="text-[11px] font-mono font-semibold text-slate-300">{cfg.label}</span>
        <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded-full
          bg-white/[0.04] border border-white/[0.08]">
          {assets.length}
        </span>
        <span className="text-[10px] font-mono text-slate-600 ml-1">{cfg.desc}</span>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {assets.map(a => (
          <AssetCard
            key={a.id}
            asset={a}
            viewMode="rights-risk"
            isSelected={selectedId === a.id}
            onSelect={() => onSelect(a.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Board column ─────────────────────────────────────────────────────────────

const BOARD_COLUMNS: { status: string; label: string; color: string }[] = [
  { status: 'suggested',   label: 'Suggested',   color: '#8B5CF6' },
  { status: 'shortlisted', label: 'Shortlisted', color: '#3B82F6' },
  { status: 'approved',    label: 'Approved',    color: '#10B981' },
  { status: 'used',        label: 'In Edit',     color: '#EC4899' },
];

const BoardColumn: React.FC<{
  column: { status: string; label: string; color: string };
  assets: AssetCardType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ column, assets, selectedId, onSelect }) => (
  <div className="flex-1 min-w-[200px]">
    <div className="flex items-center gap-2 mb-3 px-1">
      <div className="w-2 h-2 rounded-full" style={{ background: column.color }} />
      <span className="text-[11px] font-mono font-semibold text-slate-300">{column.label}</span>
      <span className="text-[10px] font-mono text-slate-600 ml-auto">{assets.length}</span>
    </div>
    <div className="space-y-2">
      {assets.map(a => (
        <AssetCard
          key={a.id}
          asset={a}
          viewMode="board"
          isSelected={selectedId === a.id}
          onSelect={() => onSelect(a.id)}
        />
      ))}
      {assets.length === 0 && (
        <div className="h-16 rounded-xl border border-dashed border-white/[0.08]
          flex items-center justify-center">
          <span className="text-[10px] font-mono text-slate-700">No assets</span>
        </div>
      )}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface AssetLibraryProps {
  assets: AssetCardType[];
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  selectedId: string | null;
  onSelectAsset: (id: string) => void;
  isLoading?: boolean;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets,
  viewMode,
  onViewModeChange,
  selectedId,
  onSelectAsset,
  isLoading = false,
}) => {
  const [sortField, setSortField] = React.useState<SortField>('addedAt');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');

  const sorted = React.useMemo(
    () => sortAssets(assets, sortField, sortDir),
    [assets, sortField, sortDir]
  );

  const toggleDir = () => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));

  // Scene grouping
  const sceneGroups = React.useMemo(() => {
    const groups: Record<string, AssetCardType[]> = { Unassigned: [] };
    for (const a of sorted) {
      const key = a.assignedSceneLabel ?? 'Unassigned';
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    }
    return groups;
  }, [sorted]);

  // Risk grouping
  const riskGroups = React.useMemo(() => {
    const groups: Record<string, AssetCardType[]> = { blocked: [], high: [], medium: [], low: [] };
    for (const a of sorted) {
      groups[a.rightsRisk]?.push(a);
    }
    return groups;
  }, [sorted]);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06]
        bg-[#0B0B12]/80 backdrop-blur-sm flex-shrink-0 flex-wrap">

        {/* View mode switcher */}
        <div className="flex items-center gap-1 p-1 rounded-[11px] bg-white/[0.04] border border-white/[0.08]">
          {VIEW_MODES.map(vm => (
            <button
              key={vm.id}
              type="button"
              onClick={() => onViewModeChange(vm.id)}
              title={vm.label}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px]
                text-[10px] font-mono transition-all duration-150
                ${viewMode === vm.id
                  ? 'bg-[#7C3AED]/20 text-[#9D6CFF] border border-[#7C3AED]/35'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
            >
              {vm.icon}
              <span className="hidden sm:inline">{vm.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3 h-3 text-slate-600" />
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value as SortField)}
            className="bg-transparent border-none text-[11px] font-mono text-slate-400
              focus:outline-none cursor-pointer hover:text-slate-200 transition-colors"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} className="bg-[#0D0D18]">{o.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleDir}
            className="p-1 rounded-[6px] text-slate-500 hover:text-slate-300
              hover:bg-white/[0.05] transition-colors"
          >
            {sortDir === 'asc' ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Asset count */}
        <span className="text-[10px] font-mono text-slate-600 flex-shrink-0">
          {assets.length} asset{assets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <RefreshCw className="w-6 h-6 text-[#7C3AED] animate-spin" />
              <p className="text-[12px] font-mono text-slate-500">Loading assets…</p>
            </motion.div>
          ) : assets.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08]
                flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-slate-600" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-semibold text-slate-400">No assets match your filters</p>
                <p className="text-[11px] font-mono text-slate-600 mt-1">Try adjusting your search or filters</p>
              </div>
            </motion.div>
          ) : viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#10101A]"
            >
              {/* List header */}
              <div className="flex items-center gap-4 px-4 py-2 border-b border-white/[0.06]
                bg-white/[0.02] text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                <div className="w-14 flex-shrink-0">Thumb</div>
                <div className="flex-1">Title</div>
                <div className="w-40 hidden lg:block">Scene</div>
                <div className="w-24 hidden md:block">Status</div>
                <div className="w-24 hidden md:block">Rights</div>
                <div className="w-16 hidden lg:block text-right">Size</div>
                <div className="w-16">Actions</div>
              </div>
              <AnimatePresence mode="popLayout">
                {sorted.map(a => (
                  <AssetCard
                    key={a.id}
                    asset={a}
                    viewMode="list"
                    isSelected={selectedId === a.id}
                    onSelect={() => onSelectAsset(a.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : viewMode === 'board' ? (
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex gap-4 overflow-x-auto pb-2 min-h-[400px]"
            >
              {BOARD_COLUMNS.map(col => (
                <BoardColumn
                  key={col.status}
                  column={col}
                  assets={sorted.filter(a => a.status === col.status)}
                  selectedId={selectedId}
                  onSelect={onSelectAsset}
                />
              ))}
            </motion.div>
          ) : viewMode === 'scene-linked' ? (
            <motion.div
              key="scene-linked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {Object.entries(sceneGroups).map(([label, grpAssets]) =>
                grpAssets.length > 0 ? (
                  <SceneGroup
                    key={label}
                    label={label}
                    assets={grpAssets}
                    selectedId={selectedId}
                    onSelect={onSelectAsset}
                  />
                ) : null
              )}
            </motion.div>
          ) : viewMode === 'rights-risk' ? (
            <motion.div
              key="rights-risk"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {Object.entries(riskGroups).map(([level, grpAssets]) =>
                grpAssets.length > 0 ? (
                  <RiskGroup
                    key={level}
                    riskLevel={level}
                    assets={grpAssets}
                    selectedId={selectedId}
                    onSelect={onSelectAsset}
                  />
                ) : null
              )}
            </motion.div>
          ) : (
            // Grid (default)
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3"
            >
              <AnimatePresence mode="popLayout">
                {sorted.map(a => (
                  <AssetCard
                    key={a.id}
                    asset={a}
                    viewMode="grid"
                    isSelected={selectedId === a.id}
                    onSelect={() => onSelectAsset(a.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
