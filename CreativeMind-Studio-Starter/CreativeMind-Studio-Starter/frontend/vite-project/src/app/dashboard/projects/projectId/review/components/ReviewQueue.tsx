/**
 * ReviewQueue.tsx — Center Panel: Review Queue & Approval Cards
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, CheckCircle2, XCircle, MessageSquare,
  Link2, User, AlertTriangle, Clock, ChevronDown
} from 'lucide-react';
import type { ReviewItem, CategoryId, ReviewStatus } from '../mockData';
import {
  ReviewStatusBadge, SeverityBadge, ReviewerAvatar,
  QuickActionBtn, SectionHeader
} from './ReviewShared';

interface ReviewQueueProps {
  items: ReviewItem[];
  selectedId: string | null;
  activeCategoryId: CategoryId | null;
  onSelectItem: (id: string) => void;
}

const STATUS_FILTERS: { id: ReviewStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'changes-requested', label: 'Changes' },
  { id: 'in-review', label: 'In Review' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
];

// Map categoryId → human label
const CATEGORY_LABELS: Record<CategoryId, string> = {
  'research-accuracy':  'Research Accuracy',
  'script-quality':     'Script Quality',
  'editorial-quality':  'Editorial Quality',
  'brand-safety':       'Brand Safety',
  'ethical-review':     'Ethical Review',
  'copyright-licence':  'Copyright & Licence',
  'platform-policy':    'Platform Policy',
  'final-approval':     'Final Approval',
};

// Severity sort priority
const SEVERITY_ORDER: Record<string, number> = {
  critical: 0, high: 1, medium: 2, low: 3, info: 4
};

// Status priority for pinning blocked/changes-requested to top
const STATUS_ORDER: Record<ReviewStatus, number> = {
  blocked: 0, 'changes-requested': 1, 'in-review': 2, pending: 3, approved: 4
};

// ─── Single Review Card ───────────────────────────────────────────────────────

interface ReviewCardProps {
  item: ReviewItem;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ item, isSelected, onSelect, index }) => {
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);

  const accentColors: Record<ReviewStatus, string> = {
    blocked:             '#EF4444',
    'changes-requested': '#F59E0B',
    'in-review':         '#06B6D4',
    pending:             '#94A3B8',
    approved:            '#10B981',
  };
  const accent = accentColors[item.status];

  const handleResolve = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resolving || resolved) return;
    setResolving(true);
    setTimeout(() => { setResolving(false); setResolved(true); }, 800);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.04, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={onSelect}
      className={`relative rounded-xl border cursor-pointer transition-all duration-150 overflow-hidden ${
        isSelected
          ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/6 shadow-[0_0_24px_rgba(139,92,246,0.10)]'
          : 'border-white/6 bg-[#151521] hover:border-white/10 hover:bg-[#1B1B2A]'
      }`}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: accent }} />

      <div className="pl-3.5 pr-3 py-3">
        {/* Top row: reviewer + status + severity */}
        <div className="flex items-center justify-between mb-2">
          <ReviewerAvatar
            initials={item.reviewerInitials}
            color={item.reviewerColor}
            name={item.reviewerName}
            size="sm"
          />
          <div className="flex items-center gap-1.5">
            <SeverityBadge severity={item.severity} />
            <ReviewStatusBadge status={item.status} />
          </div>
        </div>

        {/* Category label */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            {CATEGORY_LABELS[item.categoryId]}
          </span>
          <span className="text-[9px] text-[#64748B] font-mono">{item.timestamp}</span>
        </div>

        {/* Comment */}
        <p className="text-xs text-[#CBD5E1] leading-relaxed mb-2.5 line-clamp-2">{item.comment}</p>

        {/* Linked items */}
        <div className="space-y-1 mb-2.5">
          {[
            { icon: Link2, label: item.linkedClaim, color: '#8B5CF6' },
            { icon: AlertTriangle, label: item.linkedScene, color: '#F59E0B' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Icon size={9} style={{ color, flexShrink: 0 }} />
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>

        {/* Suggested action */}
        <div className="rounded-lg bg-[#0B0B12] border border-white/5 px-2.5 py-2 mb-3">
          <div className="text-[9px] text-[#64748B] uppercase tracking-wide mb-0.5">Suggested Action</div>
          <p className="text-[11px] text-[#CBD5E1] leading-relaxed line-clamp-2">{item.suggestedAction}</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.status !== 'approved' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResolve}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                resolved
                  ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                  : 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-md shadow-[#7C3AED]/20'
              }`}
            >
              {resolving ? (
                <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : resolved ? (
                <><CheckCircle2 size={11} /> Resolved</>
              ) : (
                <><CheckCircle2 size={11} /> Resolve</>
              )}
            </motion.button>
          )}
          <button
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-[#94A3B8] bg-white/4 border border-white/8 hover:text-[#F8FAFC] hover:bg-white/6 transition-colors"
          >
            <MessageSquare size={10} /> Comment
          </button>
          <button
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-[#94A3B8] bg-white/4 border border-white/8 hover:text-[#F8FAFC] hover:bg-white/6 transition-colors"
          >
            <User size={10} /> Assign
          </button>
        </div>
      </div>

      {/* Resolved animation overlay */}
      <AnimatePresence>
        {resolved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-10 h-10 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center"
            >
              <CheckCircle2 size={20} className="text-[#10B981]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main ReviewQueue ─────────────────────────────────────────────────────────

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  items, selectedId, activeCategoryId, onSelectItem
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter
  const filtered = items
    .filter(item => {
      if (activeCategoryId && item.categoryId !== activeCategoryId) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.comment.toLowerCase().includes(q) ||
          item.reviewerName.toLowerCase().includes(q) ||
          item.linkedScene.toLowerCase().includes(q) ||
          item.linkedClaim.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort: status priority, then severity
      const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (statusDiff !== 0) return statusDiff;
      return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    });

  const blockedCount = filtered.filter(i => i.status === 'blocked').length;
  const changesCount = filtered.filter(i => i.status === 'changes-requested').length;

  return (
    <div className="h-full flex flex-col bg-[#07070A]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] font-display">
              {activeCategoryId ? CATEGORY_LABELS[activeCategoryId] : 'Review Queue'}
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              {filtered.length} items
              {blockedCount > 0 && <span className="text-[#EF4444] ml-1">· {blockedCount} blocked</span>}
              {changesCount > 0 && <span className="text-[#F59E0B] ml-1">· {changesCount} changes requested</span>}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#94A3B8] bg-white/4 border border-white/8 hover:text-[#F8FAFC] hover:bg-white/6 transition-colors"
          >
            <Filter size={11} />
            Filter
            {statusFilter !== 'all' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews…"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0B0B12] border border-white/8 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#8B5CF6]/40 transition-colors"
          />
        </div>

        {/* Status filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1 pt-1">
                {STATUS_FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                      statusFilter === f.id
                        ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/35'
                        : 'bg-white/4 text-[#94A3B8] border border-white/8 hover:border-white/15'
                    }`}
                  >
                    {f.label}
                    <span className="ml-1 text-[8px] opacity-60">
                      {f.id === 'all' ? items.length : items.filter(i => i.status === f.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[#94A3B8] text-xs"
            >
              <Clock size={24} className="mx-auto mb-2 text-[#2a2a40]" />
              No reviews match your filters.
            </motion.div>
          ) : (
            filtered.map((item, idx) => (
              <ReviewCard
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                onSelect={() => onSelectItem(item.id)}
                index={idx}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
