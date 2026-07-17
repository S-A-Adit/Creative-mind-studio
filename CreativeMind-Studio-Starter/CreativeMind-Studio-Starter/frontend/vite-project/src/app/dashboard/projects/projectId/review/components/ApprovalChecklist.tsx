/**
 * ApprovalChecklist.tsx — Final Approval Checklist with readiness score
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, Clock, Loader2, Lock,
  AlertTriangle, ShieldOff, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import type { ChecklistItem, ApprovalStepState } from '../mockData';
import { APPROVAL_CHECKLIST, REVIEW_PROJECT, APPROVAL_FLOW_CONFIG } from '../mockData';
import { ReviewProgressBar, StepStatePill } from './ReviewShared';

const STATUS_ICONS: Record<string, React.ElementType> = {
  approved:    CheckCircle2,
  pending:     Clock,
  failed:      XCircle,
  'in-progress': Loader2,
};
const STATUS_COLORS: Record<string, string> = {
  approved:    '#10B981',
  pending:     '#94A3B8',
  failed:      '#EF4444',
  'in-progress': '#8B5CF6',
};

interface ChecklistItemRowProps {
  item: ChecklistItem;
  index: number;
}

const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({ item, index }) => {
  const [expanded, setExpanded] = useState(item.status === 'failed');
  const Icon = STATUS_ICONS[item.status] ?? Clock;
  const color = STATUS_COLORS[item.status] ?? '#94A3B8';
  const isLocked = item.stepState === 'locked';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.22 }}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isLocked
          ? 'border-white/4 bg-white/1 opacity-50'
          : item.status === 'failed'
          ? 'border-[#EF4444]/20 bg-[#EF4444]/3'
          : item.status === 'approved'
          ? 'border-[#10B981]/15 bg-[#10B981]/3'
          : 'border-white/6 bg-[#151521]'
      }`}
    >
      <button
        onClick={() => !isLocked && setExpanded(v => !v)}
        disabled={isLocked}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        {/* Status icon */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: isLocked ? 'rgba(148,163,184,0.08)' : `${color}18`,
            border: `1.5px solid ${isLocked ? 'rgba(148,163,184,0.15)' : color + '40'}`,
          }}
        >
          {isLocked ? (
            <Lock size={12} className="text-[#64748B]" />
          ) : (
            <Icon
              size={14}
              style={{ color }}
              className={item.status === 'in-progress' ? 'animate-spin' : ''}
            />
          )}
        </div>

        {/* Label + step state */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${isLocked ? 'text-[#64748B]' : 'text-[#F8FAFC]'}`}>
              {item.label}
            </span>
            <StepStatePill state={item.stepState} />
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">{item.description}</p>
        </div>

        {/* Reviewer + expand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden md:block text-[10px] text-[#64748B]">{item.reviewer}</span>
          {!isLocked && (
            item.status === 'failed' || item.blockers
              ? (expanded ? <ChevronUp size={13} className="text-[#94A3B8]" /> : <ChevronDown size={13} className="text-[#94A3B8]" />)
              : null
          )}
          {item.completedAt && (
            <span className="text-[9px] text-[#10B981] font-mono">{item.completedAt}</span>
          )}
        </div>
      </button>

      {/* Blockers list */}
      <AnimatePresence>
        {expanded && item.blockers && item.blockers.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1.5 border-t border-white/5 pt-2.5">
              <p className="text-[9px] text-[#94A3B8] uppercase tracking-wide font-semibold mb-1.5">Blockers</p>
              {item.blockers.map((blocker, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[#CBD5E1] rounded-lg bg-[#0B0B12] px-2.5 py-2">
                  <AlertTriangle size={10} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  {blocker}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Readiness Score Widget ───────────────────────────────────────────────────

const ReadinessScore: React.FC<{ score: number; readyToPublish: boolean }> = ({ score, readyToPublish }) => {
  const approved = APPROVAL_CHECKLIST.filter(c => c.status === 'approved').length;
  const failed = APPROVAL_CHECKLIST.filter(c => c.status === 'failed').length;
  const total = APPROVAL_CHECKLIST.length;

  const scoreColor =
    score >= 90 ? '#10B981'
    : score >= 60 ? '#F59E0B'
    : '#EF4444';

  return (
    <div className={`rounded-xl border p-4 ${
      readyToPublish
        ? 'border-[#10B981]/30 bg-[#10B981]/5'
        : 'border-[#EF4444]/20 bg-[#EF4444]/4'
    }`}>
      {/* Score */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-semibold text-[#F8FAFC] mb-0.5">Overall Readiness Score</div>
          <div className="text-[10px] text-[#94A3B8]">{approved}/{total} steps approved</div>
        </div>
        <div className="text-3xl font-bold font-mono" style={{ color: scoreColor }}>
          {score}%
        </div>
      </div>

      {/* Progress */}
      <ReviewProgressBar value={score} color={scoreColor} height="h-2" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { label: 'Approved', count: approved, color: '#10B981' },
          { label: 'In Progress', count: APPROVAL_CHECKLIST.filter(c => c.status === 'in-progress').length, color: '#8B5CF6' },
          { label: 'Blocked', count: failed, color: '#EF4444' },
        ].map(item => (
          <div key={item.label} className="text-center rounded-lg bg-[#0B0B12] border border-white/5 py-2">
            <div className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.count}</div>
            <div className="text-[9px] text-[#94A3B8]">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Ready/Not Ready gate */}
      <div className={`mt-3 rounded-lg p-3 border flex items-start gap-2.5 ${
        readyToPublish
          ? 'bg-[#10B981]/10 border-[#10B981]/25'
          : 'bg-[#EF4444]/8 border-[#EF4444]/20'
      }`}>
        {readyToPublish ? (
          <>
            <CheckCircle2 size={16} className="text-[#10B981] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#10B981]">Ready for Publishing</div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">All required approval steps are complete.</div>
            </div>
          </>
        ) : (
          <>
            <ShieldOff size={16} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#EF4444]">Not Ready to Publish</div>
              <div className="text-[10px] text-[#CBD5E1] mt-0.5">
                The following approvals are still required:
              </div>
              <ul className="mt-1.5 space-y-0.5">
                {APPROVAL_CHECKLIST
                  .filter(c => c.status !== 'approved' && c.stepState === 'required')
                  .map(c => (
                    <li key={c.id} className="flex items-center gap-1.5 text-[10px] text-[#F59E0B]">
                      <AlertTriangle size={8} className="flex-shrink-0" />
                      {c.label}
                    </li>
                  ))
                }
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Configurable Flow Config Panel ──────────────────────────────────────────

const FlowConfig: React.FC = () => {
  const entries = Object.entries(APPROVAL_FLOW_CONFIG);
  const CATEGORY_LABELS: Record<string, string> = {
    'research-accuracy':  'Research Accuracy',
    'script-quality':     'Script Quality',
    'editorial-quality':  'Editorial Quality',
    'brand-safety':       'Brand Safety',
    'ethical-review':     'Ethical Review',
    'copyright-licence':  'Copyright & Licence',
    'platform-policy':    'Platform Policy',
    'final-approval':     'Final Approval',
  };

  const stateColors: Record<string, string> = {
    required: '#8B5CF6',
    optional: '#3B82F6',
    skipped:  '#94A3B8',
    locked:   '#64748B',
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={13} className="text-[#8B5CF6]" />
        <span className="text-xs font-semibold text-[#F8FAFC]">Approval Flow Configuration</span>
        <span className="text-[9px] text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded-full border border-[#8B5CF6]/20 ml-auto font-bold">
          Configurable
        </span>
      </div>
      <div className="rounded-xl border border-white/8 overflow-hidden">
        {entries
          .sort((a, b) => a[1].orderIndex - b[1].orderIndex)
          .map(([id, cfg], idx) => {
            const color = stateColors[cfg.stepState] ?? '#94A3B8';
            return (
              <div
                key={id}
                className="flex items-center gap-3 px-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                >
                  {cfg.orderIndex}
                </div>
                <span className="flex-1 text-xs text-[#CBD5E1]">{CATEGORY_LABELS[id]}</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                  style={{ color, background: `${color}15` }}
                >
                  {cfg.stepState}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// ─── Main ApprovalChecklist ───────────────────────────────────────────────────

export const ApprovalChecklist: React.FC = () => {
  const score = Math.round(
    (APPROVAL_CHECKLIST.filter(c => c.status === 'approved').length / APPROVAL_CHECKLIST.length) * 100
  );
  const readyToPublish = APPROVAL_CHECKLIST
    .filter(c => c.stepState === 'required')
    .every(c => c.status === 'approved');

  return (
    <div className="space-y-3">
      <ReadinessScore score={score} readyToPublish={readyToPublish} />

      <div className="pt-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-0.5 h-4 rounded-full bg-[#8B5CF6]" />
          <span className="text-sm font-semibold text-[#F8FAFC]">Production Readiness Checklist</span>
        </div>
        <div className="space-y-2">
          {APPROVAL_CHECKLIST.map((item, idx) => (
            <ChecklistItemRow key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>

      <FlowConfig />
    </div>
  );
};
