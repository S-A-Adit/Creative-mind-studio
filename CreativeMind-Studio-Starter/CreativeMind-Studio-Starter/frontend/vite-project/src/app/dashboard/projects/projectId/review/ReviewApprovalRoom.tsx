/**
 * ReviewApprovalRoom.tsx — Main Review & Approval Room workspace
 *
 * Three-panel enterprise governance center:
 *   LEFT:   Review Categories
 *   CENTER: Review Queue + Checklist/Audit/Timeline tabs
 *   RIGHT:  Approval Inspector
 *
 * Mobile: tabs — Reviews | Inspector | Audit
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, ShieldCheck, CheckCircle2,
  XCircle, List, Eye, Table2, Activity, ChevronLeft, ChevronRight,
  ClipboardList, Clock
} from 'lucide-react';
import { REVIEW_CATEGORIES, REVIEW_ITEMS, REVIEW_PROJECT } from './mockData';
import type { CategoryId } from './mockData';
import { ReviewCategories } from './components/ReviewCategories';
import { ReviewQueue } from './components/ReviewQueue';
import { ApprovalInspector } from './components/ApprovalInspector';
import { RightsAuditTable } from './components/RightsAuditTable';
import { ApprovalChecklist } from './components/ApprovalChecklist';
import { ActivityTimeline } from './components/ActivityTimeline';

interface ReviewApprovalRoomProps {
  onBack?: () => void;
}

type CenterTab = 'queue' | 'checklist' | 'audit' | 'timeline';
type MobileTab = 'reviews' | 'inspector' | 'audit';

// ─── Workspace Header ─────────────────────────────────────────────────────────

interface WorkspaceHeaderProps {
  onBack?: () => void;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onBack, leftCollapsed, rightCollapsed, onToggleLeft, onToggleRight
}) => {
  const { blockedCount, pendingCount, approvedCount, totalReviews, readyToPublish, overallReadiness } = REVIEW_PROJECT;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0B0B12] flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        {onBack && (
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-medium">Back</span>
          </motion.button>
        )}

        <div className="w-px h-5 bg-white/8" />

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EF4444] flex items-center justify-center">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#F8FAFC] font-display leading-none">Review & Approval Room</h1>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">{REVIEW_PROJECT.title} · {REVIEW_PROJECT.version}</p>
          </div>
        </div>

        {/* Status pills */}
        <div className="hidden md:flex items-center gap-2 ml-2">
          {blockedCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-full border border-[#EF4444]/20 font-semibold">
              <XCircle size={9} />
              {blockedCount} blocked
            </span>
          )}
          {pendingCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full border border-[#F59E0B]/20 font-semibold">
              <Clock size={9} />
              {pendingCount} pending
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20 font-semibold">
            <CheckCircle2 size={9} />
            {approvedCount}/{totalReviews} approved
          </span>
          <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
            readyToPublish
              ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20'
              : 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20'
          }`}>
            <ShieldCheck size={9} />
            {overallReadiness}% ready
          </span>
        </div>
      </div>

      {/* Right toolbar */}
      <div className="flex items-center gap-1.5">
        {/* Panel toggles */}
        <div className="hidden lg:flex items-center gap-1 bg-[#151521] rounded-lg p-1 border border-white/5">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onToggleLeft}
            title="Toggle categories"
            className={`p-1.5 rounded transition-colors ${leftCollapsed ? 'text-[#64748B]' : 'text-[#8B5CF6] bg-[#8B5CF6]/10'}`}
          >
            <List size={13} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onToggleRight}
            title="Toggle inspector"
            className={`p-1.5 rounded transition-colors ${rightCollapsed ? 'text-[#64748B]' : 'text-[#06B6D4] bg-[#06B6D4]/10'}`}
          >
            <Eye size={13} />
          </motion.button>
        </div>

        <div className="w-px h-4 bg-white/8 hidden lg:block" />

        {/* Generate report */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/4 text-[#94A3B8] border border-white/8 hover:text-[#F8FAFC] hover:bg-white/6 text-xs font-semibold transition-colors"
        >
          <Download size={12} /> Report
        </motion.button>
      </div>
    </div>
  );
};

// ─── Center tab bar ───────────────────────────────────────────────────────────

const CENTER_TABS: { id: CenterTab; label: string; icon: React.ElementType; count?: number }[] = [
  { id: 'queue',     label: 'Review Queue', icon: ClipboardList, count: REVIEW_ITEMS.filter(r => r.status !== 'approved').length },
  { id: 'checklist', label: 'Checklist',    icon: CheckCircle2 },
  { id: 'audit',     label: 'Rights Audit', icon: Table2 },
  { id: 'timeline',  label: 'Activity',     icon: Activity },
];

// ─── Mobile tab bar ───────────────────────────────────────────────────────────

const MOBILE_TABS: { id: MobileTab; label: string; icon: React.ElementType }[] = [
  { id: 'reviews',   label: 'Reviews',   icon: ClipboardList },
  { id: 'inspector', label: 'Inspector', icon: Eye },
  { id: 'audit',     label: 'Audit',     icon: Table2 },
];

// ─── Main Room ────────────────────────────────────────────────────────────────

export const ReviewApprovalRoom: React.FC<ReviewApprovalRoomProps> = ({ onBack }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(REVIEW_ITEMS[0]?.id ?? null);
  const [centerTab, setCenterTab] = useState<CenterTab>('queue');
  const [mobileTab, setMobileTab] = useState<MobileTab>('reviews');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const selectedReview = REVIEW_ITEMS.find(r => r.id === selectedReviewId) ?? REVIEW_ITEMS[0];

  const handleSelectReview = useCallback((id: string) => {
    setSelectedReviewId(id);
    setMobileTab('inspector');
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#07070A] overflow-hidden">
      {/* Header */}
      <WorkspaceHeader
        onBack={onBack}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        onToggleLeft={() => setLeftCollapsed(v => !v)}
        onToggleRight={() => setRightCollapsed(v => !v)}
      />

      {/* Desktop three-panel layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* LEFT PANEL: Review Categories */}
        <AnimatePresence initial={false}>
          {!leftCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 272, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="hidden lg:flex flex-col border-r border-white/5 overflow-hidden flex-shrink-0"
            >
              <ReviewCategories
                categories={REVIEW_CATEGORIES}
                selectedId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left panel toggle */}
        <div className="hidden lg:flex flex-col justify-center relative z-10">
          <button
            onClick={() => setLeftCollapsed(v => !v)}
            className="absolute left-0 translate-x-0.5 w-4 h-8 bg-[#151521] border border-white/8 rounded-r-md flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B1B2A] transition-colors"
          >
            {leftCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
          </button>
        </div>

        {/* CENTER: Review Queue + tabs */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Desktop center tabs */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-[#07070A] flex-shrink-0">
            <div className="flex gap-0.5 bg-[#0B0B12] rounded-lg p-0.5 border border-white/5">
              {CENTER_TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = centerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCenterTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      isActive ? 'text-[#F8FAFC]' : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="center-tab-pill"
                        className="absolute inset-0 rounded-md bg-[#151521] border border-white/10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon size={11} className="relative z-10 flex-shrink-0" />
                    <span className="relative z-10">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="relative z-10 text-[9px] px-1 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] font-bold ml-0.5">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop center content */}
          <div className="hidden lg:flex flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={centerTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="flex-1 overflow-hidden flex flex-col"
              >
                {centerTab === 'queue' && (
                  <ReviewQueue
                    items={REVIEW_ITEMS}
                    selectedId={selectedReviewId}
                    activeCategoryId={selectedCategoryId}
                    onSelectItem={handleSelectReview}
                  />
                )}

                {centerTab === 'checklist' && (
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <ApprovalChecklist />
                  </div>
                )}

                {centerTab === 'audit' && (
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Table2 size={14} className="text-[#8B5CF6]" />
                      <h2 className="text-sm font-bold text-[#F8FAFC] font-display">Rights & Licence Audit</h2>
                      <span className="text-[10px] text-[#94A3B8]">{REVIEW_PROJECT.title} · All Assets</span>
                    </div>
                    <RightsAuditTable />
                  </div>
                )}

                {centerTab === 'timeline' && (
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity size={14} className="text-[#8B5CF6]" />
                      <h2 className="text-sm font-bold text-[#F8FAFC] font-display">Activity Timeline</h2>
                      <span className="text-[10px] text-[#94A3B8]">Chronological approval history</span>
                    </div>
                    <ActivityTimeline />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile tabs content */}
          <div className="flex lg:hidden flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="flex-1 overflow-hidden flex flex-col"
              >
                {mobileTab === 'reviews' && (
                  <ReviewQueue
                    items={REVIEW_ITEMS}
                    selectedId={selectedReviewId}
                    activeCategoryId={selectedCategoryId}
                    onSelectItem={handleSelectReview}
                  />
                )}

                {mobileTab === 'inspector' && selectedReview && (
                  <div className="flex-1 overflow-y-auto">
                    <ApprovalInspector review={selectedReview} />
                  </div>
                )}

                {mobileTab === 'audit' && (
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                    <RightsAuditTable />
                    <ApprovalChecklist />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right panel toggle */}
        <div className="hidden lg:flex flex-col justify-center relative z-10">
          <button
            onClick={() => setRightCollapsed(v => !v)}
            className="absolute right-0 -translate-x-0.5 w-4 h-8 bg-[#151521] border border-white/8 rounded-l-md flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1B1B2A] transition-colors"
          >
            {rightCollapsed ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
          </button>
        </div>

        {/* RIGHT PANEL: Approval Inspector */}
        <AnimatePresence initial={false}>
          {!rightCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="hidden lg:flex flex-col border-l border-white/5 overflow-hidden flex-shrink-0"
            >
              {selectedReview ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedReview.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-hidden"
                  >
                    <ApprovalInspector review={selectedReview} />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-6">
                  <div>
                    <ShieldCheck size={28} className="text-[#2a2a40] mx-auto mb-2" />
                    <p className="text-sm text-[#94A3B8]">Select a review to inspect</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile tab bar */}
      <div className="flex lg:hidden border-t border-white/5 bg-[#0B0B12] flex-shrink-0">
        {MOBILE_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = mobileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
