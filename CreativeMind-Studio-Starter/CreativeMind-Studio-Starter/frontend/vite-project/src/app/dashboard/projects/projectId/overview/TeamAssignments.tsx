/**
 * TeamAssignments.tsx — Team member cards for the Project Overview page.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import type { OverviewTeamMember, MemberStatus, PhaseId } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<MemberStatus, { dot: string; label: string }> = {
  online:  { dot: 'bg-emerald-500',  label: 'Online'  },
  away:    { dot: 'bg-amber-500',    label: 'Away'    },
  offline: { dot: 'bg-slate-600',    label: 'Offline' },
};

const PHASE_LABELS: Record<PhaseId, string> = {
  strategy:     'Strategy',
  research:     'Research',
  script:       'Script',
  assets:       'Assets',
  editing:      'Editing',
  review:       'Review',
  distribution: 'Distribution',
  performance:  'Performance',
};

// ─── Single member card ───────────────────────────────────────────────────────

const MemberCard: React.FC<{ member: OverviewTeamMember; index: number }> = ({ member, index }) => {
  const status = STATUS_META[member.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.06, ease: ease.snappy }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group relative flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.07]
        bg-[#10101A]/80 backdrop-blur-sm
        hover:border-white/[0.14] hover:bg-[#151521]/80
        transition-colors duration-200 overflow-hidden"
    >
      {/* Top accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${member.color}55, transparent)` }}
      />

      {/* Avatar + status */}
      <div className="flex items-start justify-between">
        <div className="relative">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[14px] font-bold border"
            style={{
              background: `linear-gradient(135deg, ${member.color}30, ${member.color}12)`,
              borderColor: `${member.color}40`,
              color: member.color,
            }}
          >
            {member.initials}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B0B12] ${status.dot}`}
          />
        </div>

        {/* Task count badge */}
        {member.tasksOpen > 0 && (
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full
            bg-[#7C3AED]/15 border border-[#8B5CF6]/25 text-[#9D6CFF]">
            {member.tasksOpen} tasks
          </span>
        )}
      </div>

      {/* Name + role */}
      <div>
        <p className="text-[14px] font-semibold text-slate-100 leading-tight">{member.name}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{member.role}</p>
      </div>

      {/* Phase + status */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-600">
          Phase: <span className="text-slate-400">{PHASE_LABELS[member.assignedPhase]}</span>
        </span>
        <span className={`flex items-center gap-1 text-[10px] font-mono text-slate-500`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>
    </motion.div>
  );
};

// ─── Section ─────────────────────────────────────────────────────────────────

interface TeamAssignmentsProps {
  members: OverviewTeamMember[];
  onInvite?: () => void;
}

export const TeamAssignments: React.FC<TeamAssignmentsProps> = ({ members, onInvite }) => (
  <section aria-label="Team assignments">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
          Team
        </h2>
        <p className="text-[12px] text-slate-500 font-mono mt-0.5">
          {members.filter(m => m.status === 'online').length} online · {members.length} total
        </p>
      </div>
      <motion.button
        type="button"
        onClick={onInvite}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[12px] font-medium
          bg-white/[0.04] border border-white/[0.08] text-slate-400
          hover:bg-white/[0.07] hover:text-slate-200 hover:border-white/[0.14]
          transition-all duration-200"
      >
        <UserPlus className="w-3.5 h-3.5" />
        Invite
      </motion.button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {members.map((m, i) => (
        <MemberCard key={m.id} member={m} index={i} />
      ))}
    </div>
  </section>
);
