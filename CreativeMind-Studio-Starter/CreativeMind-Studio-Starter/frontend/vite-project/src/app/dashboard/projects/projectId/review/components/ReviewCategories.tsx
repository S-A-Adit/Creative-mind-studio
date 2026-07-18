/**
 * ReviewCategories.tsx — Left Panel: Review Categories with progress and risk
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Microscope, FileText, Edit3, Shield, Scale, Copyright,
  MonitorCheck, CheckCircle2, Lock, ChevronRight, AlertTriangle
} from 'lucide-react';
import type { ReviewCategory, CategoryId } from '../mockData';
import {
  ReviewProgressBar, RiskLabel, StepStatePill, ReviewerAvatar
} from './ReviewShared';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  microscope:     Microscope,
  'file-text':    FileText,
  'edit-3':       Edit3,
  shield:         Shield,
  'balance-scale':Scale,
  copyright:      Copyright,
  'monitor-check':MonitorCheck,
  'check-circle': CheckCircle2,
};

interface ReviewCategoriesProps {
  categories: ReviewCategory[];
  selectedId: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}

const CategoryCard: React.FC<{
  category: ReviewCategory;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}> = ({ category, isSelected, onSelect, index }) => {
  const Icon = CATEGORY_ICONS[category.icon] ?? CheckCircle2;
  const isLocked = category.stepState === 'locked';

  const progressColor =
    category.completionPercent === 100 ? '#10B981'
    : category.completionPercent > 60   ? '#8B5CF6'
    : category.completionPercent > 30   ? '#F59E0B'
    : '#EF4444';

  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: isLocked ? 0 : 2, transition: { duration: 0.15 } }}
      onClick={isLocked ? undefined : onSelect}
      disabled={isLocked}
      className={`w-full text-left rounded-xl border p-3 transition-all duration-150 group ${
        isLocked
          ? 'opacity-50 cursor-not-allowed border-white/4 bg-white/1'
          : isSelected
          ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/8 shadow-[0_0_20px_rgba(139,92,246,0.08)]'
          : 'border-white/5 bg-[#151521] hover:border-white/10 hover:bg-[#1B1B2A]'
      }`}
    >
      {/* Top row: icon + label + step state */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: isLocked ? 'rgba(148,163,184,0.08)' : isSelected ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isSelected ? 'rgba(139,92,246,0.30)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {isLocked
              ? <Lock size={13} className="text-[#64748B]" />
              : <Icon size={14} className={isSelected ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#F8FAFC] leading-tight truncate">{category.label}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          <StepStatePill state={category.stepState} />
          {isSelected && !isLocked && (
            <ChevronRight size={12} className="text-[#8B5CF6] ml-0.5" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!isLocked && (
        <div className="mb-2">
          <ReviewProgressBar value={category.completionPercent} color={progressColor} />
        </div>
      )}

      {/* Stats row */}
      {!isLocked && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono" style={{ color: progressColor }}>
            {category.completionPercent}%
          </span>
          {category.pendingCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded-full border border-[#F59E0B]/20 font-semibold">
              <AlertTriangle size={8} />
              {category.pendingCount} pending
            </span>
          )}
          {category.pendingCount === 0 && category.completionPercent === 100 && (
            <span className="flex items-center gap-1 text-[10px] text-[#10B981] font-semibold">
              <CheckCircle2 size={9} /> Done
            </span>
          )}
        </div>
      )}

      {/* Reviewer */}
      {!isLocked && (
        <div className="flex items-center justify-between">
          <ReviewerAvatar
            initials={category.reviewerInitials}
            color={category.reviewerColor}
            name={category.assignedReviewer.length > 18 ? category.assignedReviewer.split(' ')[0] : category.assignedReviewer}
          />
          <RiskLabel risk={category.riskRating} />
        </div>
      )}

      {/* Risk summary */}
      {!isLocked && isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 pt-2 border-t border-white/5"
        >
          <p className="text-[10px] text-[#94A3B8] leading-relaxed">{category.riskSummary}</p>
        </motion.div>
      )}

      {isLocked && (
        <p className="text-[10px] text-[#64748B] mt-1">Locked pending upstream approvals</p>
      )}
    </motion.button>
  );
};

export const ReviewCategories: React.FC<ReviewCategoriesProps> = ({
  categories, selectedId, onSelect
}) => {
  const totalPending = categories.reduce((s, c) => s + c.pendingCount, 0);
  const totalApproved = categories.filter(c => c.completionPercent === 100).length;

  return (
    <div className="h-full flex flex-col bg-[#10101A]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] font-display">Review Categories</h2>
            <p className="text-[11px] text-[#94A3B8]">{categories.length} gates · {totalApproved} approved</p>
          </div>
          {totalPending > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded-lg border border-[#F59E0B]/20 font-semibold">
              <AlertTriangle size={10} />
              {totalPending} items
            </span>
          )}
        </div>

        {/* Overall progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#94A3B8]">Overall completion</span>
            <span className="font-mono text-[#8B5CF6]">{Math.round((totalApproved / categories.length) * 100)}%</span>
          </div>
          <ReviewProgressBar
            value={Math.round((totalApproved / categories.length) * 100)}
            color="#8B5CF6"
            height="h-1.5"
          />
        </div>
      </div>

      {/* "All" filter pill */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <button
          onClick={() => onSelect(null)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border ${
            selectedId === null
              ? 'bg-[#8B5CF6]/12 border-[#8B5CF6]/30 text-[#8B5CF6]'
              : 'bg-white/2 border-white/6 text-[#94A3B8] hover:bg-white/4 hover:text-[#F8FAFC]'
          }`}
        >
          All Reviews
          <span className="text-[10px] font-mono">{categories.reduce((s, c) => s + c.pendingCount + (c.completionPercent === 100 ? 0 : 0), 0) + totalPending} reviews</span>
        </button>
      </div>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 min-h-0">
        {categories.map((cat, idx) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isSelected={selectedId === cat.id}
            onSelect={() => onSelect(selectedId === cat.id ? null : cat.id)}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
};
