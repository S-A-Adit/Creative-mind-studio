/**
 * types.ts — Notification Center type definitions
 */

// ─── Notification Category ────────────────────────────────────────────────────

export type NotificationCategory =
  | 'assignment'
  | 'mention'
  | 'approval-request'
  | 'source-verified'
  | 'rights-warning'
  | 'ai-agent'
  | 'deadline'
  | 'comment'
  | 'publication-status';

// ─── Priority ─────────────────────────────────────────────────────────────────

export type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';

// ─── Filter Tab ───────────────────────────────────────────────────────────────

export type FilterTab =
  | 'all'
  | 'unread'
  | 'assignments'
  | 'mentions'
  | 'ai-agents'
  | 'deadlines'
  | 'approvals'
  | 'warnings';

// ─── Sort Options ─────────────────────────────────────────────────────────────

export type SortOrder = 'newest' | 'oldest' | 'priority';

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  description: string;
  projectName: string;
  projectColor: string;
  actor: {
    name: string;
    avatar: string; // initials
    avatarColor: string;
  };
  timestamp: string;
  timestampISO: string; // for sort
  isRead: boolean;
  actionUrl?: string;
  meta?: Record<string, string>; // e.g. { dueIn: '2h', taskName: 'Script review' }
}

// ─── Notification Preferences ─────────────────────────────────────────────────

export interface NotificationPreferences {
  assignments: boolean;
  mentions: boolean;
  aiAgents: boolean;
  approvals: boolean;
  deadlines: boolean;
  researchUpdates: boolean;
  publicationUpdates: boolean;
  // delivery
  emailDigest: boolean;
  pushNotifications: boolean;
  sound: boolean;
}
