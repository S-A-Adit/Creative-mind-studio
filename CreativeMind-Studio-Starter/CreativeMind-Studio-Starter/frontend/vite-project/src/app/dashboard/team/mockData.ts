/**
 * mockData.ts — Realistic mock data for the Team & Role Management Workspace
 */

import type {
  TeamMember,
  Invitation,
  RoleDefinition,
  ActivityEntry,
  TeamNavSection,
  MemberPermissions,
} from './types';

// ─── Role Definitions ─────────────────────────────────────────────────────────

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'workspace-owner',
    label: 'Workspace Owner',
    description: 'Full administrative control over the workspace, billing, and all projects.',
    iconName: 'Crown',
    color: '#F59E0B',
    permissionSummary: ['Full access', 'Manage billing', 'Delete workspace', 'Manage team'],
    memberCount: 1,
  },
  {
    id: 'project-lead',
    label: 'Project Lead',
    description: 'Leads projects end-to-end, assigns tasks, approves deliverables and publishes.',
    iconName: 'Star',
    color: '#8B5CF6',
    permissionSummary: ['Edit all projects', 'Assign tasks', 'Publish content', 'Invite members'],
    memberCount: 2,
  },
  {
    id: 'creative-strategist',
    label: 'Creative Strategist',
    description: 'Owns creative direction, briefs, and content strategy across projects.',
    iconName: 'Lightbulb',
    color: '#EC4899',
    permissionSummary: ['Edit projects', 'View analytics', 'Upload assets', 'Approve research'],
    memberCount: 2,
  },
  {
    id: 'researcher',
    label: 'Researcher',
    description: 'Conducts in-depth research and delivers validated insights for content creation.',
    iconName: 'Search',
    color: '#06B6D4',
    permissionSummary: ['Approve research', 'View analytics', 'Upload assets'],
    memberCount: 2,
  },
  {
    id: 'scriptwriter',
    label: 'Scriptwriter',
    description: 'Authors scripts, hooks, and narrative frameworks for video content.',
    iconName: 'FileText',
    color: '#10B981',
    permissionSummary: ['Edit projects', 'Upload assets'],
    memberCount: 2,
  },
  {
    id: 'video-editor',
    label: 'Video Editor',
    description: 'Assembles and refines final video outputs in the editor workspace.',
    iconName: 'Video',
    color: '#F97316',
    permissionSummary: ['Upload assets', 'Edit projects', 'Export data'],
    memberCount: 2,
  },
  {
    id: 'marketing-member',
    label: 'Marketing Member',
    description: 'Manages distribution, scheduling, and cross-platform publishing.',
    iconName: 'Megaphone',
    color: '#3B82F6',
    permissionSummary: ['Publish content', 'View analytics', 'Export data'],
    memberCount: 1,
  },
  {
    id: 'reviewer',
    label: 'Reviewer',
    description: 'Reviews and approves content before publication with annotation capabilities.',
    iconName: 'CheckCircle',
    color: '#84CC16',
    permissionSummary: ['Review content', 'View analytics'],
    memberCount: 2,
  },
  {
    id: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to published projects and analytics dashboards.',
    iconName: 'Eye',
    color: '#94A3B8',
    permissionSummary: ['View analytics', 'View projects'],
    memberCount: 2,
  },
];

// ─── Permission Sets ──────────────────────────────────────────────────────────

const ownerPerms: MemberPermissions = {
  canEditProject: true, canApproveResearch: true, canUploadAssets: true,
  canPublish: true, canManageTeam: true, canViewAnalytics: true,
  canManageBilling: true, canDeleteContent: true, canInviteMembers: true,
  canExportData: true, canAssignTasks: true, canReviewContent: true,
};

const projectLeadPerms: MemberPermissions = {
  canEditProject: true, canApproveResearch: true, canUploadAssets: true,
  canPublish: true, canManageTeam: false, canViewAnalytics: true,
  canManageBilling: false, canDeleteContent: true, canInviteMembers: true,
  canExportData: true, canAssignTasks: true, canReviewContent: true,
};

const strategistPerms: MemberPermissions = {
  canEditProject: true, canApproveResearch: true, canUploadAssets: true,
  canPublish: false, canManageTeam: false, canViewAnalytics: true,
  canManageBilling: false, canDeleteContent: false, canInviteMembers: false,
  canExportData: true, canAssignTasks: false, canReviewContent: true,
};

const researcherPerms: MemberPermissions = {
  canEditProject: false, canApproveResearch: true, canUploadAssets: true,
  canPublish: false, canManageTeam: false, canViewAnalytics: true,
  canManageBilling: false, canDeleteContent: false, canInviteMembers: false,
  canExportData: false, canAssignTasks: false, canReviewContent: false,
};

const scriptwriterPerms: MemberPermissions = {
  canEditProject: true, canApproveResearch: false, canUploadAssets: true,
  canPublish: false, canManageTeam: false, canViewAnalytics: false,
  canManageBilling: false, canDeleteContent: false, canInviteMembers: false,
  canExportData: false, canAssignTasks: false, canReviewContent: false,
};

const editorPerms: MemberPermissions = {
  canEditProject: true, canApproveResearch: false, canUploadAssets: true,
  canPublish: false, canManageTeam: false, canViewAnalytics: false,
  canManageBilling: false, canDeleteContent: false, canInviteMembers: false,
  canExportData: true, canAssignTasks: false, canReviewContent: false,
};

const marketingPerms: MemberPermissions = {
  canEditProject: false, canApproveResearch: false, canUploadAssets: false,
  canPublish: true, canManageTeam: false, canViewAnalytics: true,
  canManageBilling: false, canDeleteContent: false, canInviteMembers: false,
  canExportData: true, canAssignTasks: false, canReviewContent: false,
};

const reviewerPerms: MemberPermissions = {
  canEditProject: false, canApproveResearch: false, canUploadAssets: false,
  canPublish: false, canManageTeam: false, canViewAnalytics: true,
  canManageBilling: false, canDeleteContent: false, canInviteMembers: false,
  canExportData: false, canAssignTasks: false, canReviewContent: true,
};

const viewerPerms: MemberPermissions = {
  canEditProject: false, canApproveResearch: false, canUploadAssets: false,
  canPublish: false, canManageTeam: false, canViewAnalytics: true,
  canManageBilling: false, canDeleteContent: false, canInviteMembers: false,
  canExportData: false, canAssignTasks: false, canReviewContent: false,
};

// ─── Global Activity Log ──────────────────────────────────────────────────────

export const GLOBAL_ACTIVITY: ActivityEntry[] = [
  {
    id: 'act-1', timestamp: '2 min ago', userId: 'u-3', userName: 'Layla Hassan',
    userAvatar: 'LH', action: 'approved research report', target: 'Q4 Consumer Trends',
    projectName: 'Brand Refresh Campaign', type: 'content',
  },
  {
    id: 'act-2', timestamp: '14 min ago', userId: 'u-5', userName: 'Rami Al-Farsi',
    userAvatar: 'RF', action: 'uploaded 3 assets', target: 'Reel Sequence v2',
    projectName: 'Product Launch Video', type: 'content',
  },
  {
    id: 'act-3', timestamp: '1 hr ago', userId: 'u-1', userName: 'Nour Saleh',
    userAvatar: 'NS', action: 'changed role to Reviewer', target: 'Omar Khalid',
    projectName: undefined, type: 'role-change',
  },
  {
    id: 'act-4', timestamp: '2 hrs ago', userId: 'u-2', userName: 'Ayesha Rahman',
    userAvatar: 'AR', action: 'accepted invitation', target: undefined,
    projectName: undefined, type: 'invitation',
  },
  {
    id: 'act-5', timestamp: '3 hrs ago', userId: 'u-1', userName: 'Nour Saleh',
    userAvatar: 'NS', action: 'assigned project', target: 'Ayesha Rahman',
    projectName: 'Social Campaign Sprint', type: 'project-assigned',
  },
  {
    id: 'act-6', timestamp: '5 hrs ago', userId: 'u-4', userName: 'Ziad Mansour',
    userAvatar: 'ZM', action: 'updated script draft', target: 'Hook Variations v3',
    projectName: 'Viral Shorts Series', type: 'content',
  },
  {
    id: 'act-7', timestamp: '8 hrs ago', userId: 'u-6', userName: 'Dina Karimi',
    userAvatar: 'DK', action: 'joined the workspace', target: undefined,
    projectName: undefined, type: 'joined',
  },
  {
    id: 'act-8', timestamp: '1 day ago', userId: 'u-7', userName: 'Khalid Osman',
    userAvatar: 'KO', action: 'published to YouTube & TikTok', target: 'Episode 4',
    projectName: 'Documentary Series', type: 'content',
  },
  {
    id: 'act-9', timestamp: '1 day ago', userId: 'u-1', userName: 'Nour Saleh',
    userAvatar: 'NS', action: 'updated permissions for', target: 'Reviewer role',
    projectName: undefined, type: 'permission',
  },
  {
    id: 'act-10', timestamp: '2 days ago', userId: 'u-8', userName: 'Sara Al-Mutairi',
    userAvatar: 'SM', action: 'reviewed and approved cut', target: 'Final Edit v2',
    projectName: 'Brand Refresh Campaign', type: 'content',
  },
];

// ─── Team Members ─────────────────────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'u-1',
    name: 'Nour Saleh',
    email: 'nour.saleh@creativemind.io',
    avatar: 'NS',
    role: 'workspace-owner',
    onlineStatus: 'online',
    lastActivity: 'Just now',
    joinDate: 'Jan 12, 2024',
    workload: { activeProjects: 5, pendingReviews: 3, assignedTasks: 12, completedTasks: 47, capacityPct: 78 },
    permissions: ownerPerms,
    assignedProjects: [
      { id: 'p1', name: 'Brand Refresh Campaign', role: 'Owner', status: 'in-progress', color: '#8B5CF6' },
      { id: 'p2', name: 'Product Launch Video', role: 'Owner', status: 'review', color: '#EC4899' },
      { id: 'p3', name: 'Viral Shorts Series', role: 'Owner', status: 'in-progress', color: '#F59E0B' },
      { id: 'p4', name: 'Social Campaign Sprint', role: 'Owner', status: 'draft', color: '#06B6D4' },
      { id: 'p5', name: 'Documentary Series', role: 'Owner', status: 'published', color: '#10B981' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-1'),
  },
  {
    id: 'u-2',
    name: 'Ayesha Rahman',
    email: 'ayesha.rahman@creativemind.io',
    avatar: 'AR',
    role: 'project-lead',
    onlineStatus: 'online',
    lastActivity: '5 min ago',
    joinDate: 'Feb 3, 2024',
    workload: { activeProjects: 3, pendingReviews: 5, assignedTasks: 9, completedTasks: 31, capacityPct: 65 },
    permissions: projectLeadPerms,
    assignedProjects: [
      { id: 'p1', name: 'Brand Refresh Campaign', role: 'Lead', status: 'in-progress', color: '#8B5CF6' },
      { id: 'p4', name: 'Social Campaign Sprint', role: 'Lead', status: 'draft', color: '#06B6D4' },
      { id: 'p6', name: 'Influencer Series', role: 'Lead', status: 'in-progress', color: '#F97316' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-2'),
  },
  {
    id: 'u-3',
    name: 'Layla Hassan',
    email: 'layla.hassan@creativemind.io',
    avatar: 'LH',
    role: 'creative-strategist',
    onlineStatus: 'busy',
    lastActivity: '2 min ago',
    joinDate: 'Feb 14, 2024',
    workload: { activeProjects: 4, pendingReviews: 2, assignedTasks: 7, completedTasks: 22, capacityPct: 88 },
    permissions: strategistPerms,
    assignedProjects: [
      { id: 'p1', name: 'Brand Refresh Campaign', role: 'Strategist', status: 'in-progress', color: '#8B5CF6' },
      { id: 'p2', name: 'Product Launch Video', role: 'Strategist', status: 'review', color: '#EC4899' },
      { id: 'p6', name: 'Influencer Series', role: 'Strategist', status: 'in-progress', color: '#F97316' },
      { id: 'p7', name: 'Year-End Recap', role: 'Strategist', status: 'draft', color: '#84CC16' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-3'),
  },
  {
    id: 'u-4',
    name: 'Ziad Mansour',
    email: 'ziad.mansour@creativemind.io',
    avatar: 'ZM',
    role: 'scriptwriter',
    onlineStatus: 'online',
    lastActivity: '5 hrs ago',
    joinDate: 'Mar 1, 2024',
    workload: { activeProjects: 3, pendingReviews: 1, assignedTasks: 6, completedTasks: 18, capacityPct: 55 },
    permissions: scriptwriterPerms,
    assignedProjects: [
      { id: 'p3', name: 'Viral Shorts Series', role: 'Scriptwriter', status: 'in-progress', color: '#F59E0B' },
      { id: 'p6', name: 'Influencer Series', role: 'Scriptwriter', status: 'in-progress', color: '#F97316' },
      { id: 'p5', name: 'Documentary Series', role: 'Scriptwriter', status: 'published', color: '#10B981' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-4'),
  },
  {
    id: 'u-5',
    name: 'Rami Al-Farsi',
    email: 'rami.alfarsi@creativemind.io',
    avatar: 'RF',
    role: 'video-editor',
    onlineStatus: 'online',
    lastActivity: '14 min ago',
    joinDate: 'Mar 10, 2024',
    workload: { activeProjects: 2, pendingReviews: 4, assignedTasks: 8, completedTasks: 29, capacityPct: 72 },
    permissions: editorPerms,
    assignedProjects: [
      { id: 'p2', name: 'Product Launch Video', role: 'Editor', status: 'review', color: '#EC4899' },
      { id: 'p5', name: 'Documentary Series', role: 'Editor', status: 'published', color: '#10B981' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-5'),
  },
  {
    id: 'u-6',
    name: 'Dina Karimi',
    email: 'dina.karimi@creativemind.io',
    avatar: 'DK',
    role: 'researcher',
    onlineStatus: 'away',
    lastActivity: '8 hrs ago',
    joinDate: 'Apr 2, 2024',
    workload: { activeProjects: 2, pendingReviews: 0, assignedTasks: 5, completedTasks: 11, capacityPct: 40 },
    permissions: researcherPerms,
    assignedProjects: [
      { id: 'p1', name: 'Brand Refresh Campaign', role: 'Researcher', status: 'in-progress', color: '#8B5CF6' },
      { id: 'p4', name: 'Social Campaign Sprint', role: 'Researcher', status: 'draft', color: '#06B6D4' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-6'),
  },
  {
    id: 'u-7',
    name: 'Khalid Osman',
    email: 'khalid.osman@creativemind.io',
    avatar: 'KO',
    role: 'marketing-member',
    onlineStatus: 'offline',
    lastActivity: '1 day ago',
    joinDate: 'Apr 18, 2024',
    workload: { activeProjects: 3, pendingReviews: 1, assignedTasks: 4, completedTasks: 16, capacityPct: 50 },
    permissions: marketingPerms,
    assignedProjects: [
      { id: 'p5', name: 'Documentary Series', role: 'Publisher', status: 'published', color: '#10B981' },
      { id: 'p3', name: 'Viral Shorts Series', role: 'Publisher', status: 'in-progress', color: '#F59E0B' },
      { id: 'p6', name: 'Influencer Series', role: 'Publisher', status: 'in-progress', color: '#F97316' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-7'),
  },
  {
    id: 'u-8',
    name: 'Sara Al-Mutairi',
    email: 'sara.almutairi@creativemind.io',
    avatar: 'SM',
    role: 'reviewer',
    onlineStatus: 'away',
    lastActivity: '1 day ago',
    joinDate: 'May 5, 2024',
    workload: { activeProjects: 2, pendingReviews: 7, assignedTasks: 3, completedTasks: 24, capacityPct: 60 },
    permissions: reviewerPerms,
    assignedProjects: [
      { id: 'p1', name: 'Brand Refresh Campaign', role: 'Reviewer', status: 'in-progress', color: '#8B5CF6' },
      { id: 'p2', name: 'Product Launch Video', role: 'Reviewer', status: 'review', color: '#EC4899' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-8'),
  },
  {
    id: 'u-9',
    name: 'Omar Khalid',
    email: 'omar.khalid@creativemind.io',
    avatar: 'OK',
    role: 'viewer',
    onlineStatus: 'offline',
    lastActivity: '3 days ago',
    joinDate: 'May 20, 2024',
    workload: { activeProjects: 1, pendingReviews: 0, assignedTasks: 0, completedTasks: 0, capacityPct: 10 },
    permissions: viewerPerms,
    assignedProjects: [
      { id: 'p5', name: 'Documentary Series', role: 'Viewer', status: 'published', color: '#10B981' },
    ],
    recentActivity: GLOBAL_ACTIVITY.filter(a => a.userId === 'u-9'),
  },
  {
    id: 'u-10',
    name: 'Farah Nasser',
    email: 'farah.nasser@creativemind.io',
    avatar: 'FN',
    role: 'project-lead',
    onlineStatus: 'online',
    lastActivity: '30 min ago',
    joinDate: 'Jun 1, 2024',
    workload: { activeProjects: 2, pendingReviews: 3, assignedTasks: 10, completedTasks: 15, capacityPct: 62 },
    permissions: projectLeadPerms,
    assignedProjects: [
      { id: 'p7', name: 'Year-End Recap', role: 'Lead', status: 'draft', color: '#84CC16' },
      { id: 'p3', name: 'Viral Shorts Series', role: 'Lead', status: 'in-progress', color: '#F59E0B' },
    ],
    recentActivity: [],
  },
];

// ─── Invitations ──────────────────────────────────────────────────────────────

export const INVITATIONS: Invitation[] = [
  {
    id: 'inv-1',
    email: 'hassan.ali@studio.com',
    invitedBy: 'Nour Saleh',
    invitedByAvatar: 'NS',
    invitedAt: 'Jun 14, 2024',
    expiresAt: 'Jun 21, 2024',
    status: 'pending',
    role: 'scriptwriter',
  },
  {
    id: 'inv-2',
    email: 'mia.chen@freelance.co',
    invitedBy: 'Ayesha Rahman',
    invitedByAvatar: 'AR',
    invitedAt: 'Jun 12, 2024',
    expiresAt: 'Jun 19, 2024',
    status: 'pending',
    role: 'video-editor',
  },
  {
    id: 'inv-3',
    email: 'david.park@design.io',
    invitedBy: 'Nour Saleh',
    invitedByAvatar: 'NS',
    invitedAt: 'May 30, 2024',
    expiresAt: 'Jun 6, 2024',
    status: 'expired',
    role: 'creative-strategist',
  },
  {
    id: 'inv-4',
    email: 'yara.jabr@media.sa',
    invitedBy: 'Farah Nasser',
    invitedByAvatar: 'FN',
    invitedAt: 'Jun 10, 2024',
    expiresAt: 'Jun 17, 2024',
    status: 'accepted',
    role: 'researcher',
  },
  {
    id: 'inv-5',
    email: 'team@distribution.co',
    invitedBy: 'Nour Saleh',
    invitedByAvatar: 'NS',
    invitedAt: 'Jun 5, 2024',
    expiresAt: 'Jun 12, 2024',
    status: 'cancelled',
    role: 'marketing-member',
  },
];

// ─── Nav Sections ─────────────────────────────────────────────────────────────

export const NAV_SECTIONS: TeamNavSection[] = [
  { id: 'members',     label: 'Team Members',  iconName: 'Users',       total: TEAM_MEMBERS.length, pending: 2, statusColor: '#10B981' },
  { id: 'invitations', label: 'Invitations',   iconName: 'Mail',        total: INVITATIONS.length,  pending: 2, statusColor: '#F59E0B' },
  { id: 'roles',       label: 'Roles',         iconName: 'Shield',      total: ROLE_DEFINITIONS.length, pending: 0, statusColor: '#8B5CF6' },
  { id: 'permissions', label: 'Permissions',   iconName: 'Lock',        total: 12, pending: 1, statusColor: '#EC4899' },
  { id: 'activity',    label: 'Activity Log',  iconName: 'Activity',    total: GLOBAL_ACTIVITY.length, pending: 0, statusColor: '#06B6D4' },
];
