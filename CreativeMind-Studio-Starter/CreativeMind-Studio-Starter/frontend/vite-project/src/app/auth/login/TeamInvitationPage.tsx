/**
 * TeamInvitationPage — accept or decline a workspace invitation.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle2, X, Crown, Zap, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

interface InvitationData {
  workspaceName: string;
  workspaceInitials: string;
  workspaceColor: string;
  invitedBy: string;
  invitedByRole: string;
  invitedByInitials: string;
  role: string;
  plan: 'Pro' | 'Starter' | 'Enterprise';
  expiresIn: string;
}

const MOCK_INVITE: InvitationData = {
  workspaceName: 'Apex Media Studio',
  workspaceInitials: 'AM',
  workspaceColor: '#7C3AED',
  invitedBy: 'Jordan Kim',
  invitedByRole: 'Creative Director',
  invitedByInitials: 'JK',
  role: 'Editor',
  plan: 'Pro',
  expiresIn: '3 days',
};

interface TeamInvitationPageProps {
  invite?: InvitationData;
  onNavigate?: (page: string) => void;
}

export const TeamInvitationPage: React.FC<TeamInvitationPageProps> = ({
  invite = MOCK_INVITE,
  onNavigate,
}) => {
  const [status, setStatus] = useState<'idle' | 'accepting' | 'declining' | 'accepted' | 'declined'>('idle');

  const handleAccept = async () => {
    setStatus('accepting');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('accepted');
    setTimeout(() => onNavigate?.('onboarding'), 1500);
  };

  const handleDecline = async () => {
    setStatus('declining');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('declined');
  };

  const roleColors: Record<string, string> = {
    Editor: '#3B82F6',
    Admin: '#7C3AED',
    Viewer: '#6366F1',
    Owner: '#F59E0B',
  };
  const roleColor = roleColors[invite.role] ?? '#7C3AED';

  return (
    <AuthLayout>
      <div className="p-8 md:p-10">
        <AnimatePresence mode="wait">
          {status === 'accepted' ? (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-3">
                You're in!
              </h2>
              <p className="text-slate-400 text-[14px] leading-relaxed mb-1">
                You've joined <span className="text-white font-medium">{invite.workspaceName}</span>.
              </p>
              <p className="text-slate-500 text-[13px]">Setting up your workspace…</p>
            </motion.div>
          ) : status === 'declined' ? (
            <motion.div
              key="declined"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
                <X className="w-7 h-7 text-slate-500" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-3">
                Invitation declined
              </h2>
              <p className="text-slate-400 text-[14px] leading-relaxed mb-6">
                You've declined the invitation to {invite.workspaceName}.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.('login')}
                className="text-[13px] text-[#9D6CFF] hover:text-white transition-colors"
              >
                Go to sign in
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/25 text-[11px] font-mono font-semibold tracking-widest uppercase text-[#9D6CFF]">
                  <Users className="w-3 h-3" />
                  Team Invitation
                </span>
              </div>

              {/* Workspace card */}
              <div className="flex flex-col items-center text-center mb-8">
                {/* Workspace avatar */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold font-display text-white border mb-4 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${invite.workspaceColor}40, ${invite.workspaceColor}20)`,
                    borderColor: `${invite.workspaceColor}40`,
                    boxShadow: `0 8px 24px ${invite.workspaceColor}25`,
                  }}
                >
                  {invite.workspaceInitials}
                </div>

                <h1 className="font-display font-bold text-xl text-white mb-1">
                  {invite.workspaceName}
                </h1>

                {/* Plan badge */}
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/20 text-[#9D6CFF] mb-5">
                  <Crown className="w-2.5 h-2.5" />
                  {invite.plan} Plan
                </span>
              </div>

              {/* Invite details */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] divide-y divide-white/[0.06] mb-7">
                {/* Invited by */}
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[12px] text-slate-500">Invited by</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center text-[9px] font-bold font-mono text-[#3B82F6]">
                      {invite.invitedByInitials}
                    </div>
                    <span className="text-[13px] font-medium text-slate-200">{invite.invitedBy}</span>
                    <span className="text-[11px] text-slate-600">· {invite.invitedByRole}</span>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[12px] text-slate-500">Your role</span>
                  <span
                    className="text-[12px] font-semibold font-mono px-2.5 py-0.5 rounded-full border"
                    style={{
                      color: roleColor,
                      backgroundColor: `${roleColor}14`,
                      borderColor: `${roleColor}30`,
                    }}
                  >
                    {invite.role}
                  </span>
                </div>

                {/* Expiry */}
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[12px] text-slate-500">Expires in</span>
                  <span className="text-[13px] text-amber-400 font-mono">{invite.expiresIn}</span>
                </div>
              </div>

              {/* Permission summary */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 mb-7">
                <p className="text-[11px] font-mono text-slate-600 uppercase tracking-widest mb-3">
                  As {invite.role} you can
                </p>
                <ul className="space-y-1.5">
                  {[
                    'Access all project workspaces',
                    'Edit and collaborate on content',
                    'Use the AI agent suite',
                    'View analytics and reports',
                  ].map((perm) => (
                    <li key={perm} className="flex items-center gap-2 text-[12px] text-slate-400">
                      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${roleColor}15` }}>
                        <Zap className="w-2.5 h-2.5" style={{ color: roleColor }} />
                      </div>
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleAccept}
                  disabled={status === 'accepting'}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.45)] transition-shadow disabled:opacity-60 disabled:pointer-events-none"
                >
                  {status === 'accepting' ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Joining…
                    </>
                  ) : (
                    <>
                      Accept Invitation
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={handleDecline}
                  disabled={status === 'declining'}
                  className="w-full py-3 rounded-xl border border-white/[0.08] text-slate-400 text-[14px] hover:text-white hover:border-white/[0.16] hover:bg-white/[0.03] transition-all duration-200 disabled:opacity-50"
                >
                  {status === 'declining' ? 'Declining…' : 'Decline Invitation'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};
