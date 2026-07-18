/**
 * notification.types.ts
 *
 * Notification center domain models — notifications, activity items,
 * user preferences, and delivery state.
 */

import type {
  ID, Timestamp, HexColor, URLString,
  Priority,
  ProjectScoped, WorkspaceScoped,
  Auditable, ActorRef,
} from './common.types';

// ─── Notification category ────────────────────────────────────────────────────

export type NotificationCategory =
  | 'assignment'
  | 'mention'
  | 'approval-request'
  | 'source-verified'
  | 'rights-warning'
  | 'ai-agent'
  | 'deadline'
  | 'comment'
  | 'publication-status'
  | 'system';

// ─── Notification type (for filter tabs) ─────────────────────────────────────

export type NotificationFilterTab =
  | 'all'
  | 'unread'
  | 'assignments'
  | 'mentions'
  | 'ai-agents'
  | 'deadlines'
  | 'approvals'
  | 'warnings';

// ─── Core Notification ────────────────────────────────────────────────────────

/** A single notification as stored in the backend and surfaced in the UI */
export interface Notification extends WorkspaceScoped, Auditable {
  readonly id:            ID;
  readonly category:      NotificationCategory;
  readonly priority:      Priority;
  readonly title:         string;
  readonly description:   string;
  readonly projectId?:    ID;
  readonly projectName?:  string;
  readonly projectColor?: HexColor;
  readonly actor:         ActorRef;
  readonly isRead:        boolean;
  readonly readAt?:       Timestamp;
  readonly actionUrl?:    URLString;
  readonly meta?:         Readonly<Record<string, string>>;
  readonly expiresAt?:    Timestamp;
}

// ─── Notification preferences ─────────────────────────────────────────────────

/** Per-user, per-workspace notification delivery preferences */
export interface NotificationPreferences extends WorkspaceScoped {
  readonly userId: ID;
  // Category toggles
  readonly assignments:        boolean;
  readonly mentions:           boolean;
  readonly aiAgents:           boolean;
  readonly approvals:          boolean;
  readonly deadlines:          boolean;
  readonly researchUpdates:    boolean;
  readonly publicationUpdates: boolean;
  // Delivery channels
  readonly emailDigest:        boolean;
  readonly pushNotifications:  boolean;
  readonly sound:              boolean;
  // Digest schedule
  readonly digestFrequency:    'immediate' | 'hourly' | 'daily' | 'weekly';
}

// ─── Activity item ────────────────────────────────────────────────────────────

export type ActivityItemType =
  | 'joined'
  | 'left'
  | 'role-change'
  | 'project-assigned'
  | 'project-unassigned'
  | 'invitation'
  | 'content-updated'
  | 'content-published'
  | 'approval-requested'
  | 'approval-given'
  | 'comment-added'
  | 'asset-uploaded'
  | 'ai-task-complete'
  | 'permission-changed'
  | 'deadline-set'
  | 'status-changed';

/** A denormalized activity feed item for dashboards and project timelines */
export interface ActivityItem extends WorkspaceScoped, Auditable {
  readonly id:          ID;
  readonly type:        ActivityItemType;
  readonly actor:       ActorRef;
  readonly action:      string;       // human-readable past-tense action
  readonly target?:     string;       // resource label
  readonly projectId?:  ID;
  readonly projectName?:string;
  readonly iconName:    string;
  readonly metadata?:   Readonly<Record<string, string>>;
}

// ─── Notification batch operations ───────────────────────────────────────────

export interface MarkNotificationsReadPayload {
  notificationIds: ID[];
}

export interface MarkAllNotificationsReadPayload {
  workspaceId: ID;
  before?:     Timestamp;
}

export interface UpdateNotificationPrefsPayload extends Partial<Omit<NotificationPreferences, 'userId' | 'workspaceId'>> {}
