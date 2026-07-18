/**
 * types.ts — Team & Role Management Workspace type definitions
 */

// ─── Roles ────────────────────────────────────────────────────────────────────

export type WorkspaceRole =
  | 'workspace-owner'
  | 'project-lead'
  | 'creative-strategist'
  | 'researcher'
  | 'scriptwriter'
  | 'video-editor'
  | 'marketing-member'
  | 'reviewer'
  | 'viewer';

// ─── Online Status ────────────────────────────────────────────────────────────

export type OnlineStatus = 'online' | 'away' | 'busy' | 'offline';

// ─── Invitation Status ────────────────────────────────────────────────────────

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

// ─── Permissions ──────────────────────────────────────────────────────────────

export interface MemberPermissions {
  canEditProject: boolean;
  canApproveResearch: boolean;
  canUploadAssets: boolean;
  canPublish: boolean;
  canManageTeam: boolean;
  canViewAnalytics: boolean;
  canManageBilling: boolean;
  canDeleteContent: boolean;
  canInviteMembers: boolean;
  canExportData: boolean;
  canAssignTasks: boolean;
  canReviewContent: boolean;
}

// ─── Workload ─────────────────────────────────────────────────────────────────

export interface MemberWorkload {
  activeProjects: number;
  pendingReviews: number;
  assignedTasks: number;
  completedTasks: number;
  capacityPct: number; // 0-100
}

// ─── Assigned Project ─────────────────────────────────────────────────────────

export interface AssignedProject {
  id: string;
  name: string;
  role: string;
  status: 'in-progress' | 'review' | 'published' | 'draft';
  color: string;
}

// ─── Activity Entry ───────────────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target?: string;
  projectName?: string;
  type: 'joined' | 'role-change' | 'project-assigned' | 'invitation' | 'content' | 'permission';
}

// ─── Team Member ──────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: WorkspaceRole;
  onlineStatus: OnlineStatus;
  lastActivity: string;
  joinDate: string;
  workload: MemberWorkload;
  permissions: MemberPermissions;
  assignedProjects: AssignedProject[];
  recentActivity: ActivityEntry[];
}

// ─── Invitation ───────────────────────────────────────────────────────────────

export interface Invitation {
  id: string;
  email: string;
  invitedBy: string;
  invitedByAvatar: string;
  invitedAt: string;
  expiresAt: string;
  status: InvitationStatus;
  role: WorkspaceRole;
}

// ─── Role Definition ──────────────────────────────────────────────────────────

export interface RoleDefinition {
  id: WorkspaceRole;
  label: string;
  description: string;
  iconName: string;
  color: string;
  permissionSummary: string[];
  memberCount: number;
}

// ─── Navigation Section ───────────────────────────────────────────────────────

export type TeamSection = 'members' | 'invitations' | 'roles' | 'permissions' | 'activity';

export interface TeamNavSection {
  id: TeamSection;
  label: string;
  iconName: string;
  total: number;
  pending: number;
  statusColor: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export type SortField = 'name' | 'role' | 'lastActivity' | 'workload';
export type SortDir = 'asc' | 'desc';

export interface TeamFilters {
  search: string;
  role: WorkspaceRole | 'all';
  status: OnlineStatus | 'all';
  sortField: SortField;
  sortDir: SortDir;
}
