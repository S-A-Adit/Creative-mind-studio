/**
 * user.types.ts
 *
 * User profile, workload, and team-member domain models.
 */

import type {
  ID, Timestamp, HexColor, URLString, AvatarInitials,
  OnlineStatus, WorkspaceRole, PermissionSet,
  Auditable, WorkspaceScoped,
} from './common.types';

// ─── Core User ────────────────────────────────────────────────────────────────

/** Full user profile as returned by the API */
export interface User extends Auditable {
  readonly id:           ID;
  readonly name:         string;
  readonly email:        string;
  readonly avatarUrl?:   URLString;
  readonly avatarInitials: AvatarInitials;
  readonly avatarColor:  HexColor;
  readonly bio?:         string;
  readonly timezone:     string;
  readonly locale:       string;
  readonly isVerified:   boolean;
  readonly isActive:     boolean;
}

/** Minimal user reference embedded in activity feeds, comments, etc. */
export interface UserRef {
  readonly id:       ID;
  readonly name:     string;
  readonly initials: AvatarInitials;
  readonly color:    HexColor;
  readonly avatarUrl?: URLString;
}

// ─── Workload ─────────────────────────────────────────────────────────────────

/** Current workload snapshot for a team member */
export interface MemberWorkload {
  readonly activeProjects:  number;
  readonly pendingReviews:  number;
  readonly assignedTasks:   number;
  readonly completedTasks:  number;
  /** Capacity utilisation 0–100 */
  readonly capacityPct:     number;
}

// ─── Assigned project reference ───────────────────────────────────────────────

export type ProjectMemberStatus = 'in-progress' | 'review' | 'published' | 'draft';

/** Lightweight project reference held inside a TeamMember */
export interface AssignedProjectRef {
  readonly id:     ID;
  readonly name:   string;
  readonly role:   string;
  readonly status: ProjectMemberStatus;
  readonly color:  HexColor;
}

// ─── Team Member ──────────────────────────────────────────────────────────────

/** Full team member model — user + workspace membership context */
export interface TeamMember extends Auditable, WorkspaceScoped {
  readonly id:               ID;
  readonly name:             string;
  readonly email:            string;
  readonly avatarInitials:   AvatarInitials;
  readonly avatarColor:      HexColor;
  readonly avatarUrl?:       URLString;
  readonly role:             WorkspaceRole;
  readonly onlineStatus:     OnlineStatus;
  readonly lastActivityAt:   Timestamp;
  readonly joinedAt:         Timestamp;
  readonly workload:         MemberWorkload;
  readonly permissions:      PermissionSet;
  readonly assignedProjects: AssignedProjectRef[];
  readonly isAi:             false;
}

// ─── Role definition ──────────────────────────────────────────────────────────

/** Workspace role definition with description and permission summary */
export interface RoleDefinition {
  readonly id:                WorkspaceRole;
  readonly label:             string;
  readonly description:       string;
  readonly iconName:          string;
  readonly color:             HexColor;
  readonly permissionSummary: readonly string[];
  readonly memberCount:       number;
  readonly isCustom:          boolean;
}

// ─── Create / update payloads ─────────────────────────────────────────────────

export interface CreateUserPayload {
  name:     string;
  email:    string;
  password: string;
  timezone?:string;
  locale?:  string;
}

export interface UpdateUserPayload {
  name?:      string;
  bio?:       string;
  timezone?:  string;
  locale?:    string;
  avatarUrl?: URLString;
}

export interface UpdateMemberRolePayload {
  memberId: ID;
  role:     WorkspaceRole;
}
