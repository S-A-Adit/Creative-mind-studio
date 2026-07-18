/**
 * AssetRoomPage.tsx — Asset Room orchestrator page.
 *
 * Layout: 3-column resizable shell
 *   Left  — AssetFilterPanel  (240px fixed)
 *   Centre — AssetLibrary      (flex-1) + UsageTimeline (bottom drawer)
 *   Right  — AssetInspector OR AlternativesPanel (320px fixed, tab-switched)
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  Upload,
  Sparkles,
  ChevronRight,
  Package,
  ShieldAlert,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import { useLayout } from '../../../../../lib/useLayout';
import { AssetFilterPanel } from './components/AssetFilterPanel';
import { AssetLibrary } from './components/AssetLibrary';
import { AssetInspector } from './components/AssetInspector';
import { AlternativesPanel } from './components/AlternativesPanel';
import { UploadArea } from './components/UploadArea';
import { UsageTimeline } from './components/UsageTimeline';
import { MOCK_ASSET_ROOM } from './mockData';
import type {
  AssetFilters,
  AssetCard,
  AssetStatus,
  ViewMode,
  ActiveUpload,
} from './types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Default filters ──────────────────────────────────────────────────────────

const DEFAULT_FILTERS: AssetFilters = {
  search: '',
  category: 'all',
  status: 'all',
  license: 'all',
  rightsRisk: 'all',
  commercial: 'all',
  isPremium: 'all',
  scene: 'all',
};

// ─── Right panel tab config ───────────────────────────────────────────────────

type RightTab = 'inspector' | 'alternatives' | 'upload';

const RIGHT_TABS: { id: RightTab; label: string; icon: React.ReactNode }[] = [
  { id: 'inspector',    label: 'Inspector',    icon: <FolderOpen className="w-3.5 h-3.5" />  },
  { id: 'alternatives', label: 'Alternatives', icon: <Sparkles className="w-3.5 h-3.5" />   },
  { id: 'upload',       label: 'Upload',       icon: <Upload className="w-3.5 h-3.5" />      },
];

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03]
    border-r border-white/[0.06] flex-shrink-0">
    <div className="w-7 h-7 rounded-[8px] flex items-center justify-center"
      style={{ color, background: color + '15' }}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-mono font-semibold text-slate-200">{value}</p>
      <p className="text-[9px] font-mono text-slate-600">{label}</p>
    </div>
  </div>
);

// ─── Mock upload generator ────────────────────────────────────────────────────

let uploadCounter = 100;
function makeMockUpload(fileName: string): ActiveUpload {
  uploadCounter += 1;
  return {
    id: `upload-${uploadCounter}`,
    fileName,
    fileSizeMb: Math.round(Math.random() * 500 + 10),
    progress: 0,
    status: 'uploading',
    category: 'stock-footage',
  };
}

// ─── Filter logic ─────────────────────────────────────────────────────────────

function applyFilters(assets: AssetCard[], filters: AssetFilters): AssetCard[] {
  return assets.filter(a => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hit =
        a.title.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.creator.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q));
      if (!hit) return false;
    }
    if (filters.category !== 'all' && a.category !== filters.category) return false;
    if (filters.status !== 'all' && a.status !== filters.status) return false;
    if (filters.license !== 'all' && a.license !== filters.license) return false;
    if (filters.rightsRisk !== 'all' && a.rightsRisk !== filters.rightsRisk) return false;
    if (filters.commercial !== 'all') {
      if (filters.commercial === 'yes' && !a.commercialUse) return false;
      if (filters.commercial === 'no' && a.commercialUse) return false;
    }
    if (filters.isPremium !== 'all') {
      if (filters.isPremium === 'premium' && !a.isPremium) return false;
      if (filters.isPremium === 'free' && a.isPremium) return false;
    }
    return true;
  });
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface AssetRoomPageProps {
  onBack: () => void;
  onContinue: () => void;
}

export const AssetRoomPage: React.FC<AssetRoomPageProps> = ({ onBack, onContinue }) => {
  const { setBreadcrumbs, setPrimaryAction, setActiveNavId } = useLayout();

  // Data state
  const [assets, setAssets] = useState<AssetCard[]>(MOCK_ASSET_ROOM.assets);
  const [filters, setFilters] = useState<AssetFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>('inspector');
  const [uploads, setUploads] = useState<ActiveUpload[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);

  // Layout integration
  useEffect(() => {
    setActiveNavId('assets');
    setBreadcrumbs([
      { label: 'Projects', onClick: onBack },
      { label: MOCK_ASSET_ROOM.projectTitle },
      { label: 'Asset Room' },
    ]);
    setPrimaryAction({
      label: 'Continue to Export',
      onClick: onContinue,
      icon: <ChevronRight className="w-4 h-4" />,
    });
  }, [setBreadcrumbs, setPrimaryAction, setActiveNavId, onBack, onContinue]);

  // Derived state
  const filteredAssets = useMemo(() => applyFilters(assets, filters), [assets, filters]);

  const selectedAsset = useMemo(
    () => assets.find(a => a.id === selectedId) ?? null,
    [assets, selectedId]
  );

  const alternatives = useMemo(
    () => (selectedId ? (MOCK_ASSET_ROOM.alternatives[selectedId] ?? []) : []),
    [selectedId]
  );

  // Stats
  const stats = useMemo(() => ({
    total: assets.length,
    approved: assets.filter(a => a.status === 'approved' || a.status === 'used').length,
    highRisk: assets.filter(a => a.rightsRisk === 'high' || a.rightsRisk === 'blocked').length,
    pending: assets.filter(a => a.status === 'suggested' || a.status === 'shortlisted').length,
  }), [assets]);

  // Handlers
  const handleStatusChange = (id: string, status: AssetStatus) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleSelectAsset = (id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
    setRightTab('inspector');
  };

  const handleFilesDropped = (files: File[]) => {
    const newUploads = files.map(f => makeMockUpload(f.name));
    setUploads(prev => [...prev, ...newUploads]);

    // Simulate upload progress
    newUploads.forEach(u => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 18 + 5;
        if (progress >= 100) {
          clearInterval(interval);
          setUploads(prev => prev.map(up =>
            up.id === u.id ? { ...up, progress: 100, status: 'done' } : up
          ));
        } else {
          setUploads(prev => prev.map(up =>
            up.id === u.id ? { ...up, progress: Math.round(progress) } : up
          ));
        }
      }, 200);
    });

    setRightTab('upload');
  };

  const handleRemoveUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const activeUploadCount = uploads.filter(u => u.status === 'uploading' || u.status === 'processing').length;

  return (
    <div className="flex flex-col h-full bg-[#07070A] overflow-hidden">

      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4
        border-b border-white/[0.06] bg-[#0B0B12] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Package className="w-4 h-4 text-[#9D6CFF]" />
              <h1 className="text-[15px] font-display font-bold text-slate-100 tracking-tight">
                Asset Room
              </h1>
              <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5
                rounded-full bg-white/[0.04] border border-white/[0.08]">
                SIMULATED DATA
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              {MOCK_ASSET_ROOM.projectTitle} · Visual assets, rights management &amp; alternatives
            </p>
          </div>
        </div>

        {/* Nav actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[9px]
              bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-400
              hover:border-white/[0.18] hover:text-slate-200 transition-all duration-150"
          >
            Back to Script Room
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-[9px]
              bg-[#7C3AED] text-white text-[11px] font-mono font-semibold
              hover:bg-[#8B5CF6] transition-colors duration-150"
          >
            Continue to Export
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center border-b border-white/[0.06] bg-[#0B0B12]/70 flex-shrink-0 overflow-x-auto">
        <StatCard
          icon={<Package className="w-3.5 h-3.5" />}
          label="Total Assets"
          value={stats.total}
          color="#8B5CF6"
        />
        <StatCard
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          label="Approved / Used"
          value={stats.approved}
          color="#10B981"
        />
        <StatCard
          icon={<ShieldAlert className="w-3.5 h-3.5" />}
          label="High Risk / Blocked"
          value={stats.highRisk}
          color="#EF4444"
        />
        <StatCard
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Pending Review"
          value={stats.pending}
          color="#F59E0B"
        />

        {/* Timeline toggle */}
        <button
          type="button"
          onClick={() => setShowTimeline(t => !t)}
          className={`ml-auto flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-mono
            border-l border-white/[0.06] transition-all duration-150
            ${showTimeline
              ? 'text-[#9D6CFF] bg-[#7C3AED]/08'
              : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Usage Timeline
        </button>
      </div>

      {/* Main 3-column area */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Left — Filter panel */}
        <div className="w-56 flex-shrink-0 overflow-hidden">
          <AssetFilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            categoryCounts={MOCK_ASSET_ROOM.categoryStats as Record<string, number>}
            totalCount={assets.length}
            filteredCount={filteredAssets.length}
          />
        </div>

        {/* Centre — Library + Timeline */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden border-x border-white/[0.06]">
          <div className="flex-1 overflow-hidden">
            <AssetLibrary
              assets={filteredAssets}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedId={selectedId}
              onSelectAsset={handleSelectAsset}
            />
          </div>

          {/* Timeline drawer */}
          <AnimatePresence>
            {showTimeline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 240, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="flex-shrink-0 overflow-hidden border-t border-white/[0.06]"
              >
                <UsageTimeline
                  events={MOCK_ASSET_ROOM.timeline}
                  selectedAssetId={selectedId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — Inspector / Alternatives / Upload */}
        <div className="w-72 flex-shrink-0 flex flex-col overflow-hidden">

          {/* Tab switcher */}
          <div className="flex items-center gap-0 border-b border-white/[0.06]
            bg-[#0B0B12] flex-shrink-0">
            {RIGHT_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRightTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5
                  text-[10px] font-mono transition-all duration-150 border-b-2 relative
                  ${rightTab === tab.id
                    ? 'text-[#9D6CFF] border-[#7C3AED]'
                    : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'upload' && activeUploadCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#7C3AED]
                    animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {rightTab === 'inspector' && (
                <motion.div
                  key="inspector"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className="h-full"
                >
                  {selectedAsset ? (
                    <AssetInspector
                      asset={selectedAsset}
                      onClose={() => setSelectedId(null)}
                      onStatusChange={handleStatusChange}
                    />
                  ) : (
                    <InspectorPlaceholder />
                  )}
                </motion.div>
              )}
              {rightTab === 'alternatives' && (
                <motion.div
                  key="alternatives"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className="h-full"
                >
                  <AlternativesPanel
                    alternatives={alternatives}
                    selectedAssetTitle={selectedAsset?.title ?? null}
                  />
                </motion.div>
              )}
              {rightTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className="h-full overflow-y-auto"
                >
                  <UploadPanel
                    uploads={uploads}
                    onFilesDropped={handleFilesDropped}
                    onRemoveUpload={handleRemoveUpload}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Inspector placeholder ────────────────────────────────────────────────────

const InspectorPlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 px-6
    bg-[#0B0B12] border-l border-white/[0.06]">
    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08]
      flex items-center justify-center">
      <FolderOpen className="w-6 h-6 text-slate-600" />
    </div>
    <div className="text-center">
      <p className="text-[13px] font-semibold text-slate-400">No asset selected</p>
      <p className="text-[11px] font-mono text-slate-600 mt-1">
        Click any asset to inspect<br />its details and rights info
      </p>
    </div>
  </div>
);

// ─── Upload panel wrapper ─────────────────────────────────────────────────────

const UploadPanel: React.FC<{
  uploads: ActiveUpload[];
  onFilesDropped: (files: File[]) => void;
  onRemoveUpload: (id: string) => void;
}> = ({ uploads, onFilesDropped, onRemoveUpload }) => (
  <div className="p-4 bg-[#0B0B12] h-full border-l border-white/[0.06]">
    <div className="flex items-center gap-2 mb-4">
      <Upload className="w-4 h-4 text-[#9D6CFF]" />
      <p className="text-[12px] font-mono font-semibold text-slate-200">Upload Assets</p>
      {uploads.length > 0 && (
        <button
          type="button"
          onClick={() => uploads.forEach(u => onRemoveUpload(u.id))}
          className="ml-auto text-[10px] font-mono text-slate-600
            hover:text-slate-300 flex items-center gap-1 transition-colors"
        >
          <X className="w-3 h-3" /> Clear all
        </button>
      )}
    </div>
    <UploadArea
      uploads={uploads}
      onFilesDropped={onFilesDropped}
      onRemoveUpload={onRemoveUpload}
    />
  </div>
);
