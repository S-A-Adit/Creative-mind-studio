/**
 * workspace.types.ts
 *
 * Workspace, subscription plan, billing, and activity log models.
 */

import type {
  ID, Timestamp, HexColor, URLString, AvatarInitials,
  WorkspaceRole, Auditable, UserRef,
} from './common.types';

// ─── Subscription plan ────────────────────────────────────────────────────────

export type WorkspacePlan = 'free' | 'pro' | 'business' | 'enterprise';

export type BillingInterval = 'monthly' | 'annual';

export interface PlanLimits {
  readonly maxMembers:    number;
  readonly maxProjects:   number;
  readonly storageGb:     number;
  readonly aiCredits:     number;    // per month
  readonly exportFormats: readonly string[];
}

export interface SubscriptionPlan {
  readonly id:             WorkspacePlan;
  readonly label:          string;
  readonly price:          number;   // USD per seat
  readonly interval:       BillingInterval;
  readonly limits:         PlanLimits;
  readonly featureFlags:   Record<string, boolean>;
}

// ─── Core Workspace ───────────────────────────────────────────────────────────

/** Full workspace model */
export interface Workspace extends Auditable {
  readonly id:              ID;
  readonly name:            string;
  readonly slug:            string;
  readonly plan:            WorkspacePlan;
  readonly avatarInitials:  AvatarInitials;
  readonly avatarColor:     HexColor;
  readonly logoUrl?:        URLString;
  readonly ownerId:         ID;
  readonly memberCount:     number;
  readonly projectCount:    number;
  readonly storageUsedGb:   number;
  readonly aiCreditsUsed:   number;
  readonly aiCreditsTotal:  number;
  readonly isVerified:      boolean;
  readonly isActive:        boolean;
  readonly settings:        WorkspaceSettings;
}

export interface WorkspaceSettings {
  readonly defaultRole:           WorkspaceRole;
  readonly allowGuestAccess:      boolean;
  readonly requireMfaForAdmins:   boolean;
  readonly autoArchiveDays:       number;
  readonly brandColor:            HexColor;
  readonly timezone:              string;
  readonly locale:                string;
}

// ─── Activity log ─────────────────────────────────────────────────────────────

export type ActivityType =
  | 'joined'
  | 'left'
  | 'role-change'
  | 'project-assigned'
  | 'project-unassigned'
  | 'invitation'
  | 'content'
  | 'permission'
  | 'billing'
  | 'settings';

/** A single entry in the workspace activity audit log */
export interface ActivityEntry {
  readonly id:          ID;
  readonly workspaceId: ID;
  readonly timestamp:   Timestamp;
  readonly actor:       UserRef;
  readonly action:      string;
  readonly target?:     string;
  readonly projectId?:  ID;
  readonly projectName?:string;
  readonly type:        ActivityType;
  readonly metadata?:   Record<string, string>;
}

// ─── Usage metrics ────────────────────────────────────────────────────────────

export interface WorkspaceUsage {
  readonly members:          number;
  readonly projects:         number;
  readonly storageGb:        number;
  readonly storagePercent:   number;
  readonly aiCreditsUsed:    number;
  readonly aiCreditsPercent: number;
  readonly periodStart:      Timestamp;
  readonly periodEnd:        Timestamp;
}

// ─── Create / update payloads ─────────────────────────────────────────────────

export interface CreateWorkspacePayload {
  name:         string;
  slug:         string;
  plan?:        WorkspacePlan;
  brandColor?:  HexColor;
  timezone?:    string;
  locale?:      string;
}

export interface UpdateWorkspacePayload {
  name?:        string;
  logoUrl?:     URLString;
  settings?:    Partial<WorkspaceSettings>;
}
