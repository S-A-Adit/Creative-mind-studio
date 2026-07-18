/**
 * ResearchLabPage.tsx — Professional three-column Research Lab workspace.
 *
 * DESKTOP  : LEFT (Questions Board) | CENTER (Source Cards) | RIGHT (Evidence Inspector)
 * TABLET   : Two-column: left + center / right collapses to slide-in panel
 * MOBILE   : Tabbed interface: Questions | Sources | Evidence
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  Download,
  Sparkles,
  HelpCircle,
  BookOpen,
  GitBranch,
  LayoutGrid,
  Search,
  ChevronLeft,
  FileSearch,
} from 'lucide-react';
import { useLayout } from '../../../../../lib/useLayout';
import { QuestionBoard }       from './components/QuestionBoard';
import { SourceGrid, SourceFilterBar } from './components/SourceCard';
import { EvidenceInspector }   from './components/EvidenceInspector';
import { EvidenceMapView }     from './components/EvidenceMap';
import { CoverageBar }         from './components/CoverageBar';
import { DocumentPreviewGrid } from './components/DocumentPreview';
import { ResearchActions }     from './components/ResearchActions';
import { MOCK_RESEARCH_LAB }   from './mockData';
import type { VerificationStatus, SourceType, SourceCard } from './types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Mobile tabs ──────────────────────────────────────────────────────────────

type MobileTab = 'questions' | 'sources' | 'evidence';

const MOBILE_TABS: Array<{ id: MobileTab; label: string; icon: React.ReactNode }> = [
  { id: 'questions', label: 'Questions', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'sources',   label: 'Sources',   icon: <BookOpen   className="w-4 h-4" /> },
  { id: 'evidence',  label: 'Evidence',  icon: <FileSearch className="w-4 h-4" /> },
];

// ─── Center view tabs ─────────────────────────────────────────────────────────

type CenterView = 'sources' | 'map' | 'documents';

const CENTER_VIEWS: Array<{ id: CenterView; label: string; icon: React.ReactNode }> = [
  { id: 'sources',   label: 'Source Cards', icon: <BookOpen    className="w-3.5 h-3.5" /> },
  { id: 'map',       label: 'Evidence Map', icon: <GitBranch   className="w-3.5 h-3.5" /> },
  { id: 'documents', label: 'Documents',    icon: <LayoutGrid  className="w-3.5 h-3.5" /> },
];

// ─── Section heading ──────────────────────────────────────────────────────────

const PanelHeader: React.FC<{
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconColor: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, icon, iconColor, actions }) => (
  <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3
    border-b border-white/[0.06] bg-[#0B0B12]/60 backdrop-blur-sm">
    <div
      className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
      style={{ background: iconColor + '20', border: `1px solid ${iconColor}30`, color: iconColor }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h2 className="font-display font-semibold text-[13px] text-white leading-tight">{title}</h2>
      {subtitle && <p className="text-[10px] font-mono text-slate-600 truncate">{subtitle}</p>}
    </div>
    {actions}
  </div>
);

// ─── Tab row ──────────────────────────────────────────────────────────────────

function TabRow<T extends string>({
  tabs,
  active,
  onSelect,
}: {
  tabs: Array<{ id: T; label: string; icon: React.ReactNode }>;
  active: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#10101A]/80 border border-white/[0.07]">
      {tabs.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[11px] font-mono
            transition-all duration-150 flex-1 justify-center
            ${active === t.id
              ? 'bg-[#7C3AED]/25 text-[#9D6CFF] border border-[#7C3AED]/35'
              : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          {t.icon}
          <span className="hidden sm:block">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────

const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'Search sources…' }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-9 pl-9 pr-3 rounded-[10px] bg-[#0B0B12] border border-white/[0.09]
        text-[12px] text-slate-200 font-sans placeholder:text-slate-700
        focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/50
        transition-all duration-200"
    />
  </div>
);

// ─── Linked data for selected source ─────────────────────────────────────────

const LINKED_CLAIMS: Record<string, string[]> = {
  s1: ['AI diagnostic tools are FDA-cleared for clinical use'],
  s2: ['AI matches radiologist accuracy in mammography screening', 'AI reduces radiologist workload by 44%'],
  s3: ['Healthcare AI market projected at 36.1% CAGR through 2030'],
  s4: ['AI diagnostic systems show racial bias in dermatology'],
  s5: ['AI reduces clinical trial timelines by up to 50%'],
  s6: ['Real-world performance gap in AI diagnostics'],
  s7: ['WHO recommends national AI healthcare frameworks'],
  s8: ['AI-assisted surgery reduces post-operative complications by 23%'],
};

const LINKED_SCRIPT: Record<string, string[]> = {
  s1: ['Segment 5 — Regulatory Landscape', 'Segment 9 — Statistics Montage'],
  s2: ['Segment 3 — Hook: AI vs Radiologist', 'Segment 7 — Retention Evidence'],
  s3: ['Segment 2 — Market Introduction'],
  s4: ['Segment 8 — Ethical Considerations'],
  s5: ['Segment 6 — Drug Discovery Arc'],
  s6: ['Segment 3 — Expert Voice', 'Segment 10 — Closing Narrative'],
  s7: ['Segment 8 — Global Policy Context'],
  s8: ['Segment 4 — Surgery Success Story'],
};

const LINKED_SCENES: Record<string, string[]> = {
  s1: ['Scene 09 — Regulatory document montage'],
  s2: ['Scene 04 — Radiologist side-by-side comparison', 'Scene 07 — AI monitor close-up'],
  s3: ['Scene 02 — Market data motion graphics'],
  s4: ['Scene 08 — Ethics board discussion'],
  s5: ['Scene 06 — Lab science B-roll'],
  s6: ['Scene 03 — Interview setup: Dr. Topol'],
  s7: ['Scene 08 — WHO building exterior'],
  s8: ['Scene 05 — Operating theatre drone shot'],
};

// ─── Main component ───────────────────────────────────────────────────────────

interface ResearchLabPageProps {
  onBack?: () => void;
  onContinue?: () => void;
}

export const ResearchLabPage: React.FC<ResearchLabPageProps> = ({
  onBack,
  onContinue,
}) => {
  const { setBreadcrumbs, setPrimaryAction, setActiveNavId } = useLayout();
  const data = MOCK_RESEARCH_LAB;

  const [mobileTab,    setMobileTab]    = useState<MobileTab>('sources');
  const [centerView,   setCenterView]   = useState<CenterView>('sources');
  const [selectedId,   setSelectedId]   = useState<string | null>('s2');
  const [sourceFilter, setSourceFilter] = useState<VerificationStatus | SourceType | 'all'>('all');
  const [searchQuery,  setSearchQuery]  = useState('');

  // ── Shell integration ─────────────────────────────────────────────────────
  useEffect(() => {
    setActiveNavId('research-lab');
    setBreadcrumbs([
      { label: 'Projects',         href: '#' },
      { label: data.projectTitle,  href: '#' },
      { label: 'Research Lab' },
    ]);
    setPrimaryAction({
      label: 'Export Research',
      icon: <Download className="w-3.5 h-3.5" />,
      onClick: () => {},
    });
    return () => setPrimaryAction(null);
  }, [setBreadcrumbs, setPrimaryAction, setActiveNavId, data.projectTitle]);

  // ── Filtered sources ──────────────────────────────────────────────────────
  const filteredSources = useMemo(() => {
    let list = data.sources;
    if (sourceFilter !== 'all') {
      list = list.filter(s =>
        s.verificationStatus === sourceFilter ||
        s.sourceType === sourceFilter
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.publisher.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data.sources, sourceFilter, searchQuery]);

  // ── Selected source ───────────────────────────────────────────────────────
  const selectedSource: SourceCard | null = selectedId
    ? (data.sources.find(s => s.id === selectedId) ?? null)
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  // CENTER CONTENT
  // ─────────────────────────────────────────────────────────────────────────

  const renderCenterContent = () => {
    if (centerView === 'map') {
      return (
        <div className="p-4 space-y-6">
          <EvidenceMapView data={data.evidenceMap} />
        </div>
      );
    }
    if (centerView === 'documents') {
      return (
        <div className="p-4">
          <DocumentPreviewGrid documents={data.documents} />
        </div>
      );
    }
    // sources (default)
    return (
      <div className="p-4 space-y-4">
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search sources, authors, publishers…"
        />

        {/* Filter bar */}
        <SourceFilterBar
          sources={data.sources}
          activeFilter={sourceFilter}
          onFilterChange={f => setSourceFilter(f as VerificationStatus | SourceType | 'all')}
        />

        {/* Results count */}
        <p className="text-[10px] font-mono text-slate-600">
          {filteredSources.length} source{filteredSources.length !== 1 ? 's' : ''} shown
          {searchQuery && <span className="text-[#8B5CF6] ml-1">· filtered by "{searchQuery}"</span>}
        </p>

        {/* Grid */}
        <SourceGrid
          sources={filteredSources}
          selectedSourceId={selectedId}
          onSelectSource={id => setSelectedId(prev => prev === id ? null : id)}
        />
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RIGHT PANEL CONTENT
  // ─────────────────────────────────────────────────────────────────────────

  const renderRightPanel = () => (
    <div className="p-4 space-y-4">
      {/* Coverage bar */}
      <CoverageBar coverage={data.coverage} />

      {/* Actions */}
      <ResearchActions hasSelection={!!selectedSource} />

      {/* Evidence inspector */}
      <section aria-label="Evidence inspector">
        <div className="flex items-center gap-2 mb-3">
          <FileSearch className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <h3 className="font-display font-semibold text-[14px] text-white">Evidence Inspector</h3>
        </div>
        <EvidenceInspector
          source={selectedSource}
          linkedClaims={selectedId ? LINKED_CLAIMS[selectedId] : []}
          linkedScriptSections={selectedId ? LINKED_SCRIPT[selectedId] : []}
          linkedScenes={selectedId ? LINKED_SCENES[selectedId] : []}
        />
      </section>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="w-full h-full flex flex-col bg-[#07070A] min-h-0"
    >
      {/* ── Page header ── */}
      <div className="flex-shrink-0 sticky top-0 z-30 bg-[#07070A]/95 backdrop-blur-sm
        border-b border-white/[0.07] px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button type="button" onClick={onBack}
              className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-300
                transition-colors font-mono flex-shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}

          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#10B981]/30 to-[#06B6D4]/20
            border border-[#10B981]/30 flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-4 h-4 text-[#10B981]" />
          </div>

          <div className="min-w-0">
            <h1 className="font-display font-bold text-[15px] text-white leading-tight">
              Research Lab
            </h1>
            <p className="text-[10px] font-mono text-slate-600 truncate hidden sm:block">
              {data.projectTitle}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-amber-500/70
              px-2.5 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="w-3 h-3" />
              Simulated Data
            </span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
            />
            <span className="text-[11px] font-mono text-[#10B981]">Research Active</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE: Tabs ── */}
      <div className="lg:hidden flex-shrink-0 px-4 pt-3">
        <TabRow tabs={MOBILE_TABS} active={mobileTab} onSelect={setMobileTab} />
      </div>

      {/* ── MOBILE CONTENT ── */}
      <div className="lg:hidden flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {mobileTab === 'questions' && (
            <motion.div
              key="m-questions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="p-4"
            >
              <QuestionBoard questions={data.questions} />
            </motion.div>
          )}
          {mobileTab === 'sources' && (
            <motion.div
              key="m-sources"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="p-4 space-y-4"
            >
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <SourceFilterBar sources={data.sources} activeFilter={sourceFilter} onFilterChange={f => setSourceFilter(f as VerificationStatus | SourceType | 'all')} />
              <SourceGrid sources={filteredSources} selectedSourceId={selectedId} onSelectSource={setSelectedId} />
            </motion.div>
          )}
          {mobileTab === 'evidence' && (
            <motion.div
              key="m-evidence"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {renderRightPanel()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP / TABLET: Three-column layout ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">

        {/* LEFT: Research Questions */}
        <div className="w-[320px] xl:w-[360px] flex-shrink-0 flex flex-col
          border-r border-white/[0.06] overflow-hidden">
          <PanelHeader
            title="Research Questions"
            subtitle={`${data.questions.length} questions · drag to reorder status`}
            icon={<HelpCircle className="w-3.5 h-3.5" />}
            iconColor="#F59E0B"
          />
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
            <QuestionBoard questions={data.questions} />
          </div>
        </div>

        {/* CENTER: Source Cards / Evidence Map / Documents */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.06] overflow-hidden">
          <PanelHeader
            title={
              centerView === 'sources'
                ? `Source Cards (${filteredSources.length})`
                : centerView === 'map'
                ? 'Evidence Map'
                : 'Research Documents'
            }
            subtitle={
              centerView === 'sources'
                ? `${data.sources.filter(s => s.verificationStatus === 'verified').length} verified · click a card to inspect`
                : centerView === 'map'
                ? 'Scroll to zoom · drag to pan'
                : `${data.documents.length} documents attached`
            }
            icon={
              centerView === 'sources'
                ? <BookOpen className="w-3.5 h-3.5" />
                : centerView === 'map'
                ? <GitBranch className="w-3.5 h-3.5" />
                : <LayoutGrid className="w-3.5 h-3.5" />
            }
            iconColor="#06B6D4"
            actions={
              <div className="flex-shrink-0">
                <TabRow tabs={CENTER_VIEWS} active={centerView} onSelect={setCenterView} />
              </div>
            }
          />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {renderCenterContent()}
          </div>
        </div>

        {/* RIGHT: Evidence Inspector */}
        <div className="w-[320px] xl:w-[360px] flex-shrink-0 flex flex-col overflow-hidden">
          <PanelHeader
            title="Evidence Inspector"
            subtitle={selectedSource ? selectedSource.title : 'Select a source to inspect'}
            icon={<FileSearch className="w-3.5 h-3.5" />}
            iconColor="#8B5CF6"
          />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {renderRightPanel()}
          </div>
        </div>
      </div>

      {/* ── Continue CTA (desktop bottom bar) ── */}
      {onContinue && (
        <div className="hidden lg:flex flex-shrink-0 items-center justify-between
          px-6 py-3 border-t border-white/[0.06] bg-[#07070A]/90 backdrop-blur-sm">
          <p className="text-[11px] font-mono text-slate-600">
            {data.coverage.verifiedSources} of {data.coverage.totalSources} sources verified
          </p>
          <motion.button
            type="button"
            onClick={onContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white
              bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]
              border border-[#8B5CF6]/30 shadow-[0_4px_16px_rgba(124,58,237,0.3)]
              hover:shadow-[0_4px_22px_rgba(139,92,246,0.45)]
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Continue to Story &amp; Script
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
