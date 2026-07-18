/**
 * PendingApprovals.tsx — Approval request cards for the Project Overview page.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import type { ApprovalRequest, ApprovalPriority } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── Priority config ──────────────────────────────────────────────────────────

const PRIORITY: Record<ApprovalPriority, { label: string; badge: string; dot: string }> = {
  critical: {
    label: 'Critical',
    badge: 'text-red-400 bg-red-500/10 border-red-500/25',
    dot: 'bg-red-500',
  },
  high: {
    label: 'High',
    badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25',
    dot: 'bg-orange-500',
  },
  medium: {
    label: 'Medium',
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Low',
    badge: 'text-slate-400 bg-slate-500/10 border-slate-500/25',
    dot: 'bg-slate-500',
  },
};

// ─── Days until helper ────────────────────────────────────────────────────────

function daysUntil(date: Date): number {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86_400_000));
}

// ─── Single approval card ─────────────────────────────────────────────────────

const ApprovalCard: React.FC<{
  request: ApprovalRequest;
  index: number;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ request, index, onApprove, onReject }) => {
  const p = PRIORITY[request.priority];
  const days = daysUntil(request.dueDate);
  const isUrgent = days <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.24, delay: index * 0.06, ease: ease.snappy }}
      className="group relative flex flex-col gap-3 p-4 rounded-2xl border
        bg-[#10101A]/80 backdrop-blur-sm
        hover:border-white/[0.13] transition-all duration-200 overflow-hidden"
      style={{
        borderColor: request.priority === 'critical'
          ? 'rgba(239,68,68,0.22)'
          : 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Priority accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: request.priority === 'critical'
            ? 'linear-gradient(90deg, transparent, rgba(239,68,68,0.6), transparent)'
            : request.priority === 'high'
            ? 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)'
            : 'transparent',
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-[14px] font-semibold text-slate-100 leading-tight">
              {request.title}
            </h4>
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold
              px-2 py-0.5 rounded-full border ${p.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              {p.label}
            </span>
          </div>
          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
            {request.description}
          </p>
        </div>
      </div>

      {/* Requester + due date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0"
            style={{
              background: request.requester.color + '28',
              color: request.requester.color,
            }}
          >
            {request.requester.initials}
          </div>
          <span className="text-[11px] text-slate-500">{request.requester.name}</span>
        </div>

        <div className={`flex items-center gap-1.5 text-[11px] font-mono ${isUrgent ? 'text-red-400' : 'text-slate-600'}`}>
          {isUrgent ? (
            <AlertTriangle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {days === 0 ? 'Due today' : `${days}d left`}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/[0.05]">
        <motion.button
          type="button"
          onClick={() => onApprove(request.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.12 }}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[8px]
            text-[12px] font-medium text-emerald-400
            bg-emerald-500/08 border border-emerald-500/20
            hover:bg-emerald-500/15 hover:border-emerald-500/35
            transition-all duration-150"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approve
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onReject(request.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.12 }}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[8px]
            text-[12px] font-medium text-red-400
            bg-red-500/08 border border-red-500/20
            hover:bg-red-500/15 hover:border-red-500/35
            transition-all duration-150"
        >
          <XCircle className="w-3.5 h-3.5" />
          Reject
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Section ─────────────────────────────────────────────────────────────────

interface PendingApprovalsProps {
  approvals: ApprovalRequest[];
}

export const PendingApprovals: React.FC<PendingApprovalsProps> = ({ approvals: initial }) => {
  const [items, setItems] = React.useState(initial);

  const handleApprove = React.useCallback((id: string) => {
    setItems(prev => prev.filter(a => a.id !== id));
  }, []);

  const handleReject = React.useCallback((id: string) => {
    setItems(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <section aria-label="Pending approvals">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
            Pending Approvals
          </h2>
          <p className="text-[12px] text-slate-500 font-mono mt-0.5">
            {items.length} awaiting review
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] text-slate-500
              hover:text-slate-300 transition-colors duration-150"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 rounded-2xl
              border border-white/[0.05] bg-[#10101A]/50 gap-3"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-500/40" />
            <p className="text-[13px] text-slate-600 font-mono">All caught up — no pending approvals</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((a, i) => (
              <ApprovalCard
                key={a.id}
                request={a}
                index={i}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
