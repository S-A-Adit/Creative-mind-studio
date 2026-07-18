/**
 * roleUtils.ts — Role definitions, icons, and permission display helpers
 */

import React from 'react';
import {
  Crown, Star, Lightbulb, Search, FileText, Video,
  Megaphone, CheckCircle, Eye, Users, Mail, Shield,
  Lock, Activity,
} from 'lucide-react';
import type { WorkspaceRole, OnlineStatus, MemberPermissions } from '../types';

// ─── Role Config ──────────────────────────────────────────────────────────────

interface RoleConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}

const iconProps = { className: 'w-3.5 h-3.5' };

export const ROLE_CONFIG: Record<WorkspaceRole, RoleConfig> = {
  'workspace-owner':      { label: 'Workspace Owner',     icon: React.createElement(Crown,     iconProps), color: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.25)' },
  'project-lead':         { label: 'Project Lead',        icon: React.createElement(Star,      iconProps), color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.25)' },
  'creative-strategist':  { label: 'Creative Strategist', icon: React.createElement(Lightbulb, iconProps), color: '#EC4899', bg: 'rgba(236,72,153,0.10)',  border: 'rgba(236,72,153,0.25)' },
  'researcher':           { label: 'Researcher',          icon: React.createElement(Search,    iconProps), color: '#06B6D4', bg: 'rgba(6,182,212,0.10)',   border: 'rgba(6,182,212,0.25)'  },
  'scriptwriter':         { label: 'Scriptwriter',        icon: React.createElement(FileText,  iconProps), color: '#10B981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)' },
  'video-editor':         { label: 'Video Editor',        icon: React.createElement(Video,     iconProps), color: '#F97316', bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.25)' },
  'marketing-member':     { label: 'Marketing Member',    icon: React.createElement(Megaphone, iconProps), color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.25)' },
  'reviewer':             { label: 'Reviewer',            icon: React.createElement(CheckCircle, iconProps), color: '#84CC16', bg: 'rgba(132,204,22,0.10)', border: 'rgba(132,204,22,0.25)' },
  'viewer':               { label: 'Viewer',              icon: React.createElement(Eye,       iconProps), color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.25)' },
};

// ─── Online Status Config ─────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  color: string;
  dotClass: string;
}

export const STATUS_CONFIG: Record<OnlineStatus, StatusConfig> = {
  online:  { label: 'Online',  color: '#10B981', dotClass: 'bg-emerald-500' },
  away:    { label: 'Away',    color: '#F59E0B', dotClass: 'bg-amber-500'   },
  busy:    { label: 'Busy',    color: '#EF4444', dotClass: 'bg-rose-500'    },
  offline: { label: 'Offline', color: '#475569', dotClass: 'bg-slate-600'   },
};

// ─── Permission Display ───────────────────────────────────────────────────────

export interface PermissionDisplayItem {
  key: keyof MemberPermissions;
  label: string;
  description: string;
  category: 'content' | 'team' | 'settings' | 'analytics';
}

export const PERMISSION_DISPLAY: PermissionDisplayItem[] = [
  { key: 'canEditProject',      label: 'Edit Projects',       description: 'Create and modify project content',      category: 'content'   },
  { key: 'canApproveResearch',  label: 'Approve Research',    description: 'Validate and publish research reports',   category: 'content'   },
  { key: 'canUploadAssets',     label: 'Upload Assets',       description: 'Add files and media to projects',         category: 'content'   },
  { key: 'canPublish',          label: 'Publish Content',     description: 'Distribute to external platforms',        category: 'content'   },
  { key: 'canReviewContent',    label: 'Review Content',      description: 'Annotate and approve deliverables',       category: 'content'   },
  { key: 'canDeleteContent',    label: 'Delete Content',      description: 'Permanently remove project assets',       category: 'content'   },
  { key: 'canManageTeam',       label: 'Manage Team',         description: 'Add, remove, and change member roles',    category: 'team'      },
  { key: 'canInviteMembers',    label: 'Invite Members',      description: 'Send workspace invitations',              category: 'team'      },
  { key: 'canAssignTasks',      label: 'Assign Tasks',        description: 'Distribute tasks to team members',        category: 'team'      },
  { key: 'canViewAnalytics',    label: 'View Analytics',      description: 'Access performance dashboards',           category: 'analytics' },
  { key: 'canExportData',       label: 'Export Data',         description: 'Download reports and project data',       category: 'analytics' },
  { key: 'canManageBilling',    label: 'Manage Billing',      description: 'Update subscription and payment methods', category: 'settings'  },
];

export const PERMISSION_CATEGORIES = ['content', 'team', 'analytics', 'settings'] as const;
export type PermissionCategory = typeof PERMISSION_CATEGORIES[number];

// ─── Nav icon resolver ────────────────────────────────────────────────────────

export function getNavIcon(iconName: string, className = 'w-4 h-4'): React.ReactNode {
  const map: Record<string, React.ReactNode> = {
    Users:    React.createElement(Users,    { className }),
    Mail:     React.createElement(Mail,     { className }),
    Shield:   React.createElement(Shield,   { className }),
    Lock:     React.createElement(Lock,     { className }),
    Activity: React.createElement(Activity, { className }),
  };
  return map[iconName] ?? React.createElement(Users, { className });
}

// ─── Workload color ───────────────────────────────────────────────────────────

export function getCapacityColor(pct: number): string {
  if (pct >= 90) return '#EF4444';
  if (pct >= 70) return '#F59E0B';
  if (pct >= 50) return '#8B5CF6';
  return '#10B981';
}
