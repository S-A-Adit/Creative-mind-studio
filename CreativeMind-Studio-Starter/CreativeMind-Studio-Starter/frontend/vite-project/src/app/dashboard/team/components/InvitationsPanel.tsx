/**
 * InvitationsPanel.tsx — Invitation management section
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, RefreshCw, X, Clock, CheckCircle, AlertCircle, Ban, UserPlus } from 'lucide-react';
import { MemberAvatar, RoleBadge, ConfirmDialog, SectionLabel } from './TeamShared';
import type { Invitation, InvitationStatus } from '../types';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<InvitationStatus, {
  label: string; color: string; bg: string; border: string; Icon: React.ElementType;
}> = {
  pending:   { label: 'Pending',   color: '#F59E0B', bg: 'rgba(245,158,11,0.10)',   border: 'rgba(245,158,11,0.25)',   Icon: Clock        },
  accepted:  { label: 'Accepted',  color: '#10B981', bg: 'rgba(16,185,129,0.10)',   border: 'rgba(16,185,129,0.25)',   Icon: CheckCircle  },
  expired:   { label: 'Expired',   color: '#EF4444', bg: 'rgba(239,68,68,0.10)',    border: 'rgba(239,68,68,0.25)',    Icon: AlertCircle  },
  cancelled: { label: 'Cancelled', color: '#64748B', bg: 'rgba(100,116,139,0.10)',  border: 'rgba(100,116,139,0.25)', Icon: Ban          },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface InvitationsPanelProps {
  invitations: Invitation[];
  onInvite: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InvitationsPanel: React.FC<InvitationsPanelProps> = ({ invitations, onInvite }) => {
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const pending   = invitations.filter(i => i.status === 'pending');
  const others    = invitations.filter(i => i.status !== 'pending');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-display font-semibold text-slate-100 text-sm tracking-wide">Invitations</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {pending.length} pending · {invitations.length} total
          </p>
        </div>
        <button
          onClick={onInvite}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/30 text-brand-electric text-xs font-medium transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Invite
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-5">
        {/* Pending section */}
        {pending.length > 0 && (
          <section>
            <SectionLabel className="mb-3 block">Pending ({pending.length})</SectionLabel>
            <div className="space-y-2">
              {pending.map((inv, i) => (
                <InvitationCard
                  key={inv.id}
                  invitation={inv}
                  index={i}
                  onCancel={() => setCancelTarget(inv.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All others */}
        {others.length > 0 && (
          <section>
            <SectionLabel className="mb-3 block">History</SectionLabel>
            <div className="space-y-2">
              {others.map((inv, i) => (
                <InvitationCard
                  key={inv.id}
                  invitation={inv}
                  index={i}
                  onCancel={undefined}
                />
              ))}
            </div>
          </section>
        )}

        {invitations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="w-10 h-10 text-slate-700 mb-3" />
            <p className="text-sm text-slate-500">No invitations yet</p>
            <p className="text-xs text-slate-600 mt-1">Invite your first team member</p>
          </div>
        )}
      </div>

      {/* Confirm cancel */}
      <AnimatePresence>
        {cancelTarget && (
          <ConfirmDialog
            title="Cancel Invitation"
            message="Are you sure you want to cancel this invitation? The invite link will become invalid."
            confirmLabel="Cancel Invitation"
            onConfirm={() => setCancelTarget(null)}
            onCancel={() => setCancelTarget(null)}
            variant="warning"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Invitation Card ──────────────────────────────────────────────────────────

interface InvitationCardProps {
  invitation: Invitation;
  index: number;
  onCancel?: () => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ invitation, index, onCancel }) => {
  const cfg = STATUS_CFG[invitation.status];
  const isPending = invitation.status === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05 }}
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/10 transition-colors"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-slate-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-100 truncate">{invitation.email}</p>
            <RoleBadge role={invitation.role} size="sm" />
          </div>
        </div>

        {/* Status badge */}
        <span
          className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-1 rounded-full border flex-shrink-0"
          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
        >
          <cfg.Icon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-slate-600">
        <span className="flex items-center gap-1">
          <MemberAvatar initials={invitation.invitedByAvatar} size="sm" />
          <span>Invited by {invitation.invitedBy}</span>
        </span>
        <span>Sent {invitation.invitedAt}</span>
        {invitation.status !== 'accepted' && (
          <span className={invitation.status === 'expired' ? 'text-rose-500' : ''}>
            Exp. {invitation.expiresAt}
          </span>
        )}
      </div>

      {/* Actions */}
      {isPending && (
        <div className="mt-3 flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[11px] font-medium text-brand-electric hover:text-white transition-colors bg-white/[0.04] hover:bg-brand-purple/20 px-3 py-1.5 rounded-lg border border-white/8 hover:border-brand-purple/30">
            <RefreshCw className="w-3 h-3" />
            Resend
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-rose-400 transition-colors px-2 py-1.5 rounded-lg"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          )}
        </div>
      )}

      {invitation.status === 'expired' && (
        <button className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-amber-400 hover:text-white transition-colors bg-amber-500/8 hover:bg-amber-500/15 px-3 py-1.5 rounded-lg border border-amber-500/20">
          <RefreshCw className="w-3 h-3" />
          Resend Invitation
        </button>
      )}
    </motion.div>
  );
};
