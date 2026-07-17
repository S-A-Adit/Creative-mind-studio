/**
 * ApprovalInspector.tsx — Right Panel: Approval Inspector with full review details
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Link2, Database, BookOpen, CheckCircle2,
  XCircle, AlertTriangle, RefreshCw, MessageSquare, User,
  ExternalLink, Film, Eye, History, Zap, Shield, Clock
} from 'lucide-react';
import type { ReviewItem } from '../mockData';
import {
  ReviewStatusBadge, SeverityBadge, ReviewerAvatar, RiskLabel,
  SectionHeader, PanelTabs, QuickActionBtn
} from './ReviewShared';

const INSPECTOR_TABS = [
  { id: 'overview',  label: 'Overview',  icon: Eye },
  { id: 'claims',    label: 'Claims',    icon: Link2 },
  { id: 'sources',   label: 'Sources',   icon: BookOpen },
  { id: 'assets',    label: 'Assets',    icon: Film },
  { id: 'actions',   label: 'Actions',   icon: Zap },
  { id: 'history',   label: 'History',   icon: History },
];

interface ApprovalInspectorProps {
  review: ReviewItem;
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

const OverviewTab: React.FC<{ review: ReviewItem }> = ({ review }) => (
  <div className="space-y-4">
    {/* Status + Severity summary */}
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3">
        <div className="text-[9px] text-[#94A3B8] uppercase tracking-wide mb-1.5">Status</div>
        <ReviewStatusBadge status={review.status} size="md" />
      </div>
      <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3">
        <div className="text-[9px] text-[#94A3B8] uppercase tracking-wide mb-1.5">Severity</div>
        <SeverityBadge severity={review.severity} size="md" />
      </div>
    </div>

    {/* Reviewer info */}
    <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3">
      <div className="text-[9px] text-[#94A3B8] uppercase tracking-wide mb-2">Reviewer</div>
      <div className="flex items-center gap-3">
        <ReviewerAvatar
          initials={review.reviewerInitials}
          color={review.reviewerColor}
          size="lg"
        />
        <div>
          <div className="text-sm font-semibold text-[#F8FAFC]">{review.reviewerName}</div>
          <div className="text-[11px] text-[#94A3B8]">{review.reviewerRole}</div>
        </div>
      </div>
    </div>

    {/* Detailed comment */}
    <div>
      <SectionHeader title="Detailed Review Notes" accent="#8B5CF6" />
      <div className="rounded-lg bg-[#0B0B12] border border-[#8B5CF6]/15 p-3">
        <div className="flex items-center gap-1.5 mb-2.5">
          <MessageSquare size={11} className="text-[#8B5CF6]" />
          <span className="text-[10px] text-[#8B5CF6] font-semibold uppercase tracking-wide">Review Notes</span>
        </div>
        <p className="text-xs text-[#CBD5E1] leading-relaxed">{review.detailedComment}</p>
      </div>
    </div>

    {/* Linked items quick view */}
    <div>
      <SectionHeader title="Linked Context" accent="#3B82F6" />
      <div className="space-y-1.5">
        {[
          { icon: Link2, label: 'Claim', value: review.linkedClaim, color: '#8B5CF6' },
          { icon: AlertTriangle, label: 'Scene', value: review.linkedScene, color: '#F59E0B' },
          { icon: Film, label: 'Asset', value: review.linkedAsset, color: '#06B6D4' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#0B0B12] border border-white/5 text-xs">
            <Icon size={11} style={{ color, flexShrink: 0 }} />
            <span className="text-[#64748B] font-medium">{label}:</span>
            <span className="text-[#CBD5E1] truncate flex-1">{value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Claims Tab ───────────────────────────────────────────────────────────────

const ClaimsTab: React.FC<{ review: ReviewItem }> = ({ review }) => (
  <div className="space-y-3">
    {review.linkedClaims.length === 0 ? (
      <div className="text-center py-8 text-[#94A3B8] text-xs">
        <Link2 size={20} className="mx-auto mb-2 text-[#2a2a40]" />
        No claims linked to this review.
      </div>
    ) : (
      review.linkedClaims.map((claim, idx) => (
        <motion.div
          key={claim.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          className="rounded-xl bg-[#0B0B12] border border-white/5 p-3.5"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-[#CBD5E1] leading-relaxed flex-1 mr-3">{claim.text}</p>
            {claim.verified ? (
              <CheckCircle2 size={14} className="text-[#10B981] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={14} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-[#94A3B8]">Scene: {claim.sceneId}</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[#94A3B8]">Confidence</span>
              <div className="w-16 h-1 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: claim.confidence > 90 ? '#10B981' : claim.confidence > 70 ? '#F59E0B' : '#EF4444' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${claim.confidence}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                />
              </div>
              <span
                className="font-mono font-bold"
                style={{ color: claim.confidence > 90 ? '#10B981' : claim.confidence > 70 ? '#F59E0B' : '#EF4444' }}
              >
                {claim.confidence}%
              </span>
            </div>
          </div>
        </motion.div>
      ))
    )}
  </div>
);

// ─── Sources Tab ──────────────────────────────────────────────────────────────

const SourcesTab: React.FC<{ review: ReviewItem }> = ({ review }) => (
  <div className="space-y-2.5">
    {review.linkedSources.length === 0 ? (
      <div className="text-center py-8 text-[#94A3B8] text-xs">
        <BookOpen size={20} className="mx-auto mb-2 text-[#2a2a40]" />
        No sources linked.
      </div>
    ) : (
      review.linkedSources.map((src, idx) => (
        <motion.div
          key={src.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          className="rounded-xl bg-[#0B0B12] border border-white/5 p-3"
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-xs font-semibold text-[#F8FAFC] leading-tight flex-1 mr-2">{src.title}</h4>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 font-semibold flex-shrink-0">
              {src.type}
            </span>
          </div>
          <p className="text-[10px] text-[#94A3B8] mb-1.5">{src.author}</p>
          {src.url && (
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-[#8B5CF6] hover:text-[#9D6CFF] transition-colors"
            >
              <ExternalLink size={9} /> Open source
            </a>
          )}
        </motion.div>
      ))
    )}
  </div>
);

// ─── Assets Tab ───────────────────────────────────────────────────────────────

const AssetsTab: React.FC<{ review: ReviewItem }> = ({ review }) => (
  <div className="space-y-2">
    <div>
      <SectionHeader title="Linked Assets" count={review.linkedAssets.length} accent="#06B6D4" />
      {review.linkedAssets.map((asset, i) => (
        <motion.div
          key={asset}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-[#0B0B12] border border-white/5 mb-1.5"
        >
          <Film size={11} className="text-[#06B6D4] flex-shrink-0" />
          <span className="text-xs text-[#CBD5E1] truncate flex-1">{asset}</span>
          <ExternalLink size={10} className="text-[#64748B] flex-shrink-0" />
        </motion.div>
      ))}
    </div>

    <div>
      <SectionHeader title="Linked Script Sections" count={review.linkedScriptSections.length} accent="#F59E0B" />
      {review.linkedScriptSections.map((section, i) => (
        <motion.div
          key={section}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-[#0B0B12] border border-white/5 mb-1.5"
        >
          <FileText size={11} className="text-[#F59E0B] flex-shrink-0" />
          <span className="text-xs text-[#CBD5E1] truncate">{section}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Actions Tab ──────────────────────────────────────────────────────────────

const ActionsTab: React.FC<{ review: ReviewItem }> = ({ review }) => (
  <div className="space-y-4">
    {/* Recommended actions */}
    <div>
      <SectionHeader title="Recommended Actions" count={review.recommendedActions.length} accent="#10B981" />
      <div className="space-y-2">
        {review.recommendedActions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-[#0B0B12] border border-white/5"
          >
            <div className="w-4 h-4 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[8px] font-bold text-[#10B981]">{i + 1}</span>
            </div>
            <span className="text-xs text-[#CBD5E1] leading-relaxed">{action}</span>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Quick actions grid */}
    <div>
      <SectionHeader title="Quick Actions" accent="#8B5CF6" />
      <div className="grid grid-cols-2 gap-1.5">
        <QuickActionBtn label="Approve" icon={CheckCircle2} color="#10B981" />
        <QuickActionBtn label="Reject" icon={XCircle} variant="danger" />
        <QuickActionBtn label="Request Changes" icon={RefreshCw} color="#F59E0B" />
        <QuickActionBtn label="Assign Reviewer" icon={User} />
        <QuickActionBtn label="Add Comment" icon={MessageSquare} />
        <QuickActionBtn label="View Evidence" icon={Eye} />
        <QuickActionBtn label="Generate Report" icon={Shield} />
        <QuickActionBtn label="Link Asset" icon={Link2} />
      </div>
    </div>
  </div>
);

// ─── History Tab ──────────────────────────────────────────────────────────────

const HistoryTab: React.FC<{ review: ReviewItem }> = ({ review }) => {
  const actionColors: Record<string, string> = {
    'Review assigned':    '#8B5CF6',
    'Claim verified':     '#10B981',
    'Status changed':     '#06B6D4',
    'Approved':           '#10B981',
    'Changes requested':  '#F59E0B',
    'Issue raised':       '#F97316',
    'Issue identified':   '#EF4444',
    'Severity escalated': '#EF4444',
    'Status set to Blocked': '#EF4444',
    'Review started':     '#06B6D4',
    'Audit completed':    '#10B981',
    'Policy audit':       '#EC4899',
    'Gate created':       '#94A3B8',
  };

  return (
    <div className="space-y-1">
      {review.revisionHistory.length === 0 ? (
        <div className="text-center py-8 text-[#94A3B8] text-xs">No history yet.</div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
          {review.revisionHistory.map((entry, idx) => {
            const color = actionColors[entry.action] ?? '#94A3B8';
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="relative flex items-start gap-3 pb-4 pl-9"
              >
                <div
                  className="absolute left-2.5 top-1 w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ background: `${color}20`, border: `1.5px solid ${color}` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                </div>
                <div className="flex-1 rounded-lg bg-[#0B0B12] border border-white/5 p-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold" style={{ color }}>{entry.action}</span>
                    <span className="text-[9px] text-[#64748B] font-mono">{entry.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1]">{entry.detail}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <User size={9} className="text-[#64748B]" />
                    <span className="text-[10px] text-[#94A3B8]">{entry.user}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main ApprovalInspector ───────────────────────────────────────────────────

export const ApprovalInspector: React.FC<ApprovalInspectorProps> = ({ review }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabComponents: Record<string, React.FC<{ review: ReviewItem }>> = {
    overview: OverviewTab,
    claims:   ClaimsTab,
    sources:  SourcesTab,
    assets:   AssetsTab,
    actions:  ActionsTab,
    history:  HistoryTab,
  };

  const TabContent = tabComponents[activeTab] ?? OverviewTab;

  return (
    <div className="h-full flex flex-col bg-[#10101A]">
      {/* Review summary header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <ReviewStatusBadge status={review.status} size="sm" />
          <SeverityBadge severity={review.severity} size="sm" />
          <span className="text-[9px] text-[#64748B] font-mono ml-auto">{review.timestamp}</span>
        </div>
        <p className="text-xs text-[#CBD5E1] leading-relaxed mb-3 line-clamp-2">{review.comment}</p>

        <ReviewerAvatar
          initials={review.reviewerInitials}
          color={review.reviewerColor}
          name={review.reviewerName}
          size="md"
        />
      </div>

      {/* Tabs */}
      <div className="px-3 pt-2.5 pb-2 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-0.5 bg-[#0B0B12] rounded-lg p-0.5 border border-white/5 overflow-x-auto">
          {INSPECTOR_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-shrink-0 flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] font-medium transition-all duration-200 ${
                  isActive ? 'text-[#F8FAFC]' : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="inspector-tab"
                    className="absolute inset-0 rounded-md bg-[#151521] border border-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={9} className="relative z-10 flex-shrink-0" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <TabContent review={review} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
