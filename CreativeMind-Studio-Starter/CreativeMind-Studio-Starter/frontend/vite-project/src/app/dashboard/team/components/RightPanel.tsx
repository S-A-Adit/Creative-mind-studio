/**
 * RightPanel.tsx — Member Details, Permissions, Workload, and Actions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCog, FolderOpen, Activity, Shield, X,
  Trash2, RefreshCw, Link, Send,
} from 'lucide-react';
import {
  MemberAvatar, RoleBadge, StatusDot, WorkloadBar,
  ProjectStatusBadge, SectionLabel, PermissionToggle,
  ConfirmDialog, PermissionCheckItem,
} from './TeamShared';
import { PermissionGuard } from './PermissionGuard';
import { PERMISSION_DISPLAY, ROLE_CONFIG, PERMISSION_CATEGORIES, getCapacityColor } from './roleUtils';
import type { TeamMember, MemberPermissions } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RightPanelProps {
  member: TeamMember | null;
  /** The viewer's own permissions (controls what actions they can take) */
  viewerPermissions: MemberPermissions;
  onClose: () => void;
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

type DetailTab = 'profile' | 'projects' | 'permissions' | 'activity';

const TABS: Array<{ id: DetailTab; label: string; Icon: React.ElementType }> = [
  { id: 'profile',     label: 'Profile',      Icon: UserCog    },
  { id: 'projects',    label: 'Projects',     Icon: FolderOpen },
  { id: 'permissions', label: 'Permissions',  Icon: Shield     },
  { id: 'activity',    label: 'Activity',     Icon: Activity   },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const RightPanel: React.FC<RightPanelProps> = ({
  member, viewerPermissions, onClose,
}) => {
  const [tab, setTab] = useState<DetailTab>('profile');
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (!member) {
    return (
      <aside className="h-full flex flex-col items-center justify-center bg-[#0E0E18]/40 border-l border-white/[0.06] px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
          <UserCog className="w-7 h-7 text-slate-600" />
        </div>
        <p className="text-sm font-medium text-slate-400">Select a member</p>
        <p className="text-xs text-slate-600 mt-1">Click any member to view details</p>
      </aside>
    );
  }

  const roleCfg = ROLE_CONFIG[member.role];

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={member.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="h-full flex flex-col bg-[#0E0E18]/40 border-l border-white/[0.06] overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/[0.05] flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <MemberAvatar initials={member.avatar} status={member.onlineStatus} size="lg" />
              <div>
                <h3 className="font-display font-semibold text-slate-100 text-sm">{member.name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{member.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusDot status={member.onlineStatus} showLabel />
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors">
              <X className="w-4.5 h-4.5 w-5 h-5" />
            </button>
          </div>

          <RoleBadge role={member.role} />

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <PermissionGuard permission="canManageTeam" permissions={viewerPermissions} mode="disable">
              <ActionButton icon={<UserCog className="w-3.5 h-3.5" />} label="Change Role" />
            </PermissionGuard>
            <PermissionGuard permission="canAssignTasks" permissions={viewerPermissions} mode="disable">
              <ActionButton icon={<Link className="w-3.5 h-3.5" />} label="Assign Project" />
            </PermissionGuard>
            <PermissionGuard permission="canManageTeam" permissions={viewerPermissions} mode="warn">
              <button
                onClick={() => setConfirmRemove(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-[11px] font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </PermissionGuard>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 px-3 py-2 border-b border-white/[0.05] flex-shrink-0">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-mono font-medium transition-all ${
                tab === id
                  ? 'bg-brand-purple/15 text-brand-electric border border-brand-purple/25'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-4 space-y-5"
            >
              {tab === 'profile'     && <ProfileTab member={member} />}
              {tab === 'projects'    && <ProjectsTab member={member} />}
              {tab === 'permissions' && <PermissionsTab member={member} viewerPermissions={viewerPermissions} />}
              {tab === 'activity'    && <ActivityTab member={member} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Confirm Dialog */}
      {confirmRemove && (
        <ConfirmDialog
          title="Remove Team Member"
          message={`Remove ${member.name} from the workspace? They will lose access to all projects immediately.`}
          confirmLabel="Remove Member"
          onConfirm={() => setConfirmRemove(false)}
          onCancel={() => setConfirmRemove(false)}
          variant="danger"
        />
      )}
    </AnimatePresence>
  );
};

// ─── ActionButton ─────────────────────────────────────────────────────────────

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({
  icon, label, onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 text-slate-300 text-[11px] font-medium transition-colors"
  >
    {icon}
    {label}
  </button>
);

// ─── Profile Tab ──────────────────────────────────────────────────────────────

const ProfileTab: React.FC<{ member: TeamMember }> = ({ member }) => {
  const { activeProjects, pendingReviews, assignedTasks, completedTasks, capacityPct } = member.workload;
  const capColor = getCapacityColor(capacityPct);

  return (
    <>
      {/* Meta */}
      <section>
        <SectionLabel className="mb-2 block">Member Info</SectionLabel>
        <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] divide-y divide-white/[0.04]">
          {[
            { label: 'Join Date',      value: member.joinDate      },
            { label: 'Last Activity',  value: member.lastActivity  },
            { label: 'Email',          value: member.email         },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[11px] text-slate-500">{label}</span>
              <span className="text-[11px] text-slate-300 font-mono">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Workload */}
      <section>
        <SectionLabel className="mb-2 block">Workload</SectionLabel>
        <div className="space-y-3">
          {/* Capacity bar */}
          <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Capacity</span>
              <span className="text-xs font-mono font-bold" style={{ color: capColor }}>{capacityPct}%</span>
            </div>
            <WorkloadBar value={capacityPct} showLabel={false} />
            <p className="text-[10px] text-slate-600 mt-1.5">
              {capacityPct >= 90 ? 'Overloaded — consider reassigning' :
               capacityPct >= 70 ? 'High load' :
               capacityPct >= 50 ? 'Moderate load' : 'Available for more work'}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Active Projects',  value: activeProjects,  color: '#8B5CF6' },
              { label: 'Pending Reviews',  value: pendingReviews,  color: '#F59E0B' },
              { label: 'Assigned Tasks',   value: assignedTasks,   color: '#06B6D4' },
              { label: 'Completed Tasks',  value: completedTasks,  color: '#10B981' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3 flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">{label}</span>
                <span className="text-2xl font-display font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// ─── Projects Tab ─────────────────────────────────────────────────────────────

const ProjectsTab: React.FC<{ member: TeamMember }> = ({ member }) => (
  <section>
    <SectionLabel className="mb-3 block">Assigned Projects ({member.assignedProjects.length})</SectionLabel>
    <div className="space-y-2">
      {member.assignedProjects.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3 hover:border-white/10 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
              <span className="text-xs font-medium text-slate-200 truncate">{p.name}</span>
            </div>
            <ProjectStatusBadge status={p.status} />
          </div>
          <p className="text-[10px] text-slate-600 mt-1 ml-4">Role: {p.role}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

// ─── Permissions Tab ──────────────────────────────────────────────────────────

const PermissionsTab: React.FC<{ member: TeamMember; viewerPermissions: MemberPermissions }> = ({
  member, viewerPermissions,
}) => {
  const canManage = viewerPermissions.canManageTeam;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionLabel>Permissions</SectionLabel>
        {!canManage && (
          <span className="text-[10px] font-mono text-slate-600">View only</span>
        )}
      </div>

      {PERMISSION_CATEGORIES.map(cat => {
        const items = PERMISSION_DISPLAY.filter(p => p.category === cat);
        return (
          <div key={cat}>
            <SectionLabel className="mb-2 block capitalize">{cat}</SectionLabel>
            <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] divide-y divide-white/[0.04]">
              {items.map(p => (
                <div key={p.key} className="px-3">
                  <PermissionToggle
                    value={member.permissions[p.key]}
                    label={p.label}
                    description={p.description}
                    disabled={!canManage}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

// ─── Activity Tab ─────────────────────────────────────────────────────────────

const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  'joined':           '#10B981',
  'role-change':      '#8B5CF6',
  'project-assigned': '#06B6D4',
  'invitation':       '#F59E0B',
  'content':          '#EC4899',
  'permission':       '#F97316',
};

const ActivityTab: React.FC<{ member: TeamMember }> = ({ member }) => {
  const activities = member.recentActivity;

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <Activity className="w-8 h-8 text-slate-700 mb-2" />
        <p className="text-sm text-slate-500">No recent activity</p>
      </div>
    );
  }

  return (
    <section>
      <SectionLabel className="mb-3 block">Recent Activity</SectionLabel>
      <div className="space-y-0">
        {activities.map((entry, i) => {
          const color = ACTIVITY_TYPE_COLORS[entry.type] ?? '#94A3B8';
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex gap-3 pb-4"
            >
              {/* Timeline line */}
              {i < activities.length - 1 && (
                <div className="absolute left-3.5 top-7 bottom-0 w-px bg-white/[0.06]" />
              )}
              {/* Dot */}
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center z-10"
                style={{ background: `${color}18`, border: `1px solid ${color}40` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              </div>
              {/* Text */}
              <div className="flex-1 pt-0.5">
                <p className="text-xs text-slate-300">
                  <span className="font-medium">{entry.action}</span>
                  {entry.target && <span className="text-slate-400"> {entry.target}</span>}
                </p>
                {entry.projectName && (
                  <p className="text-[10px] text-slate-600 mt-0.5">📁 {entry.projectName}</p>
                )}
                <p className="text-[10px] text-slate-600 mt-0.5 font-mono">{entry.timestamp}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
