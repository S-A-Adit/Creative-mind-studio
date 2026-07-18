/**
 * TeamWorkspace.tsx — Team & Role Management Workspace
 *
 * Enterprise-grade three-column workspace for managing team members,
 * project assignments, permissions, invitations, and collaboration settings.
 *
 * Desktop layout: LEFT (navigation) | CENTER (section content) | RIGHT (member details)
 * Mobile: tabs — Members | Roles | Permissions
 *
 * All permission-gated actions use <PermissionGuard />.
 * No role names are hard-coded in UI logic — everything derives from the
 * permissions object provided by the viewer.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, Shield, List } from 'lucide-react';
import { LeftPanel }         from './components/LeftPanel';
import { CenterPanel }       from './components/CenterPanel';
import { RightPanel }        from './components/RightPanel';
import { InvitationsPanel }  from './components/InvitationsPanel';
import { ActivityLog }       from './components/ActivityLog';
import { RolesPanel }        from './components/RolesPanel';
import { PermissionsPanel }  from './components/PermissionsPanel';
import { InviteModal }       from './components/TeamShared';
import {
  TEAM_MEMBERS, INVITATIONS, GLOBAL_ACTIVITY,
  ROLE_DEFINITIONS, NAV_SECTIONS,
} from './mockData';
import type { TeamMember, TeamSection, MemberPermissions } from './types';

// ─── Viewer permissions ───────────────────────────────────────────────────────
//
// In production these come from the auth/session context.
// Here we simulate the workspace owner viewing the workspace.

const VIEWER_PERMISSIONS: MemberPermissions = {
  canEditProject:     true,
  canApproveResearch: true,
  canUploadAssets:    true,
  canPublish:         true,
  canManageTeam:      true,
  canViewAnalytics:   true,
  canManageBilling:   true,
  canDeleteContent:   true,
  canInviteMembers:   true,
  canExportData:      true,
  canAssignTasks:     true,
  canReviewContent:   true,
};

// ─── Mobile tab definitions ───────────────────────────────────────────────────

type MobileTab = 'members' | 'roles' | 'permissions';
const MOBILE_TABS: Array<{ id: MobileTab; label: string; Icon: React.ElementType }> = [
  { id: 'members',     label: 'Members',     Icon: Users  },
  { id: 'roles',       label: 'Roles',       Icon: Shield },
  { id: 'permissions', label: 'Permissions', Icon: List   },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface TeamWorkspaceProps {
  onBack?: () => void;
}

export const TeamWorkspace: React.FC<TeamWorkspaceProps> = () => {
  const [activeSection, setActiveSection]   = useState<TeamSection>('members');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(TEAM_MEMBERS[0]);
  const [rightOpen, setRightOpen]           = useState(true);
  const [inviteOpen, setInviteOpen]         = useState(false);
  const [mobileTab, setMobileTab]           = useState<MobileTab>('members');

  // ── Center section renderer ──────────────────────────────────────────────────

  const renderCenter = () => {
    switch (activeSection) {
      case 'members':
        return (
          <CenterPanel
            members={TEAM_MEMBERS}
            selectedId={selectedMember?.id ?? null}
            onSelect={member => {
              setSelectedMember(member);
              setRightOpen(true);
            }}
          />
        );
      case 'invitations':
        return (
          <InvitationsPanel
            invitations={INVITATIONS}
            onInvite={() => setInviteOpen(true)}
          />
        );
      case 'roles':
        return <RolesPanel roles={ROLE_DEFINITIONS} />;
      case 'permissions':
        return <PermissionsPanel />;
      case 'activity':
        return <ActivityLog activities={GLOBAL_ACTIVITY} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] text-slate-100 font-sans">

      {/* ── DESKTOP: three-column layout ─────────────────────────────────── */}
      <div className="hidden md:flex h-screen overflow-hidden">

        {/* LEFT PANEL — fixed width */}
        <div className="w-56 flex-shrink-0 h-full">
          <LeftPanel
            sections={NAV_SECTIONS}
            activeSection={activeSection}
            onSectionChange={section => {
              setActiveSection(section);
              // When switching to members, keep right panel open if a member is selected
              if (section !== 'members') setRightOpen(false);
              else if (selectedMember) setRightOpen(true);
            }}
            onInvite={() => setInviteOpen(true)}
          />
        </div>

        {/* CENTER PANEL — flex-1 */}
        <main className="flex-1 min-w-0 h-full overflow-hidden border-l border-r border-white/[0.05]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderCenter()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* RIGHT PANEL — conditionally shown */}
        <AnimatePresence>
          {rightOpen && activeSection === 'members' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex-shrink-0 h-full overflow-hidden"
            >
              <div className="w-80 h-full">
                <RightPanel
                  member={selectedMember}
                  viewerPermissions={VIEWER_PERMISSIONS}
                  onClose={() => setRightOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle right panel when in members view */}
        {activeSection === 'members' && !rightOpen && selectedMember && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setRightOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-12 flex items-center justify-center bg-white/[0.05] border-l border-y border-white/[0.08] rounded-l-xl text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors z-10"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* ── MOBILE: tabs ─────────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col h-screen">
        {/* Mobile tab bar */}
        <div className="flex border-b border-white/[0.07] bg-[#0E0E18]/80 backdrop-blur-sm">
          {MOBILE_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-mono font-medium transition-colors ${
                mobileTab === id
                  ? 'text-brand-electric border-b-2 border-brand-purple'
                  : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Mobile content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {mobileTab === 'members' && (
                <div className="h-full flex flex-col">
                  <CenterPanel
                    members={TEAM_MEMBERS}
                    selectedId={selectedMember?.id ?? null}
                    onSelect={member => {
                      setSelectedMember(member);
                      setRightOpen(true);
                    }}
                  />
                </div>
              )}
              {mobileTab === 'roles' && <RolesPanel roles={ROLE_DEFINITIONS} />}
              {mobileTab === 'permissions' && <PermissionsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile member detail sheet */}
        <AnimatePresence>
          {rightOpen && selectedMember && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-x-0 bottom-0 h-[85vh] bg-[#0E0E18] border-t border-white/10 rounded-t-2xl overflow-hidden z-40"
            >
              <RightPanel
                member={selectedMember}
                viewerPermissions={VIEWER_PERMISSIONS}
                onClose={() => setRightOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Invite Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default TeamWorkspace;
