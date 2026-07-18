/**
 * common.types.ts
 *
 * Foundational primitive types, generic API shapes, pagination, and shared
 * enumerations used across every domain in CreativeMind Studio.
 *
 * RULES:
 *  - No domain-specific interfaces belong here.
 *  - All other type files import FROM here; this file imports from nowhere.
 *  - Avoid "any". Use "unknown" for truly opaque payloads.
 */

// ─── Opaque primitive aliases ─────────────────────────────────────────────────

/** Opaque string identifier (e.g. "u-123") */
export type ID = string;

/** UUID v4 format string */
export type UUID = string;

/** ISO 8601 datetime string, e.g. "2024-06-14T09:57:00Z" */
export type Timestamp = string;

/** Unix epoch milliseconds */
export type EpochMs = number;

/** Hex colour string, e.g. "#8B5CF6" */
export type HexColor = string;

/** Absolute or relative URL string */
export type URLString = string;

/** Base-64-encoded data URI */
export type DataURI = string;

/** Initials string, e.g. "NS" */
export type AvatarInitials = string;

// ─── Generic API response shapes ──────────────────────────────────────────────

/**
 * Standard single-resource API response envelope.
 * @template T - the data payload type
 */
export interface ApiResponse<T> {
  readonly data:    T;
  readonly success: boolean;
  readonly message: string | null;
  readonly errors:  ApiError[] | null;
  readonly meta:    ResponseMeta | null;
}

/**
 * Paginated list API response envelope.
 * @template T - the item type in the list
 */
export interface PaginatedResponse<T> {
  readonly data:       T[];
  readonly success:    boolean;
  readonly message:    string | null;
  readonly errors:     ApiError[] | null;
  readonly pagination: PaginationMeta;
}

/** Structured error returned inside an ApiResponse */
export interface ApiError {
  readonly code:    string;
  readonly message: string;
  readonly field?:  string;    // field-level validation error
  readonly detail?: string;
}

/** Metadata attached to every API response */
export interface ResponseMeta {
  readonly requestId:   UUID;
  readonly timestamp:   Timestamp;
  readonly version:     string;
  readonly serverRegion?:string;
}

/** Pagination cursor returned by list endpoints */
export interface PaginationMeta {
  readonly page:       number;
  readonly pageSize:   number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly hasNext:    boolean;
  readonly hasPrev:    boolean;
  readonly cursor?:    string;  // opaque cursor for keyset pagination
}

/** Parameters accepted by paginated list endpoints */
export interface PaginationParams {
  page?:     number;
  pageSize?: number;
  cursor?:   string;
}

// ─── Loading / async state ────────────────────────────────────────────────────

/** UI-level async data state */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'refreshing';

/** Generic async data holder — avoids re-declaring in every hook */
export interface AsyncData<T> {
  data:         T | null;
  state:        LoadingState;
  error:        string | null;
  lastUpdatedAt: Timestamp | null;
}

// ─── Sorting & filtering ──────────────────────────────────────────────────────

export type SortDir = 'asc' | 'desc';

export interface SortOption<TField extends string = string> {
  field:     TField;
  direction: SortDir;
  label:     string;
}

export interface FilterOption<TValue = string> {
  value:     TValue;
  label:     string;
  count?:    number;    // optional badge count
  disabled?: boolean;
}

// ─── Permissions & RBAC ───────────────────────────────────────────────────────

/** Fine-grained permission key */
export type PermissionKey =
  | 'canEditProject'
  | 'canApproveResearch'
  | 'canUploadAssets'
  | 'canPublish'
  | 'canManageTeam'
  | 'canViewAnalytics'
  | 'canManageBilling'
  | 'canDeleteContent'
  | 'canInviteMembers'
  | 'canExportData'
  | 'canAssignTasks'
  | 'canReviewContent';

/** Full permission set — every key must be explicitly set */
export type PermissionSet = Readonly<Record<PermissionKey, boolean>>;

/**
 * Workspace-level role.
 * Maps to a PermissionSet in the backend role-permission matrix.
 */
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

// ─── Shared status enumerations ───────────────────────────────────────────────

/** Universal priority level — used across tasks, notifications, risks, etc. */
export type Priority = 'critical' | 'high' | 'normal' | 'low';

/** Universal severity level — used for risks, errors, flags */
export type Severity = 'critical' | 'high' | 'medium' | 'low';

/** Universal online presence status */
export type OnlineStatus = 'online' | 'away' | 'busy' | 'offline';

/** Trend direction for analytics deltas */
export type TrendDir = 'up' | 'down' | 'flat';

/** Generic binary approval state */
export type ApprovalState = 'pending' | 'approved' | 'rejected' | 'needs-revision';

/** Verification state for claims and sources */
export type VerificationStatus =
  | 'verified'
  | 'partially-supported'
  | 'contested'
  | 'outdated'
  | 'unverified'
  | 'rejected';

/** Rights / IP risk level */
export type RightsRisk = 'low' | 'medium' | 'high' | 'blocked';

/** Platform publication status */
export type PublicationStatus =
  | 'draft'
  | 'generating'
  | 'ready-for-review'
  | 'approved'
  | 'ready-to-publish'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'archived';

/** Distribution platform identifier */
export type Platform =
  | 'youtube'
  | 'youtube-shorts'
  | 'instagram'
  | 'instagram-reel'
  | 'tiktok'
  | 'twitter-x'
  | 'linkedin'
  | 'spotify'
  | 'podcast'
  | 'newsletter'
  | 'blog'
  | 'website'
  | 'other';

/** Content format category */
export type ContentType =
  | 'video'
  | 'short-form'
  | 'documentary'
  | 'podcast'
  | 'article'
  | 'newsletter'
  | 'social-post'
  | 'advertisement'
  | 'other';

/** Video aspect ratio */
export type AspectRatio =
  | '16:9'
  | '9:16'
  | '4:3'
  | '1:1'
  | '4:5'
  | '2:3'
  | '21:9'
  | '3:2'
  | '5:3'
  | 'varies'
  | 'text'
  | 'audio';

// ─── Reusable entity fragments ────────────────────────────────────────────────

/** Minimal user reference embedded in other documents */
export interface ActorRef {
  readonly id:       ID;
  readonly name:     string;
  readonly initials: AvatarInitials;
  readonly color:    HexColor;
  readonly avatarUrl?: URLString;
  readonly isAi:     boolean;
}

/** Timestamp audit fields added to every persisted entity */
export interface Auditable {
  readonly createdAt:  Timestamp;
  readonly updatedAt:  Timestamp;
  readonly deletedAt?: Timestamp;
}

/** Soft-deletable version of Auditable */
export interface SoftDeletable extends Auditable {
  readonly isDeleted: boolean;
}

/** Entity that belongs to a project */
export interface ProjectScoped {
  readonly projectId: ID;
}

/** Entity that belongs to a workspace */
export interface WorkspaceScoped {
  readonly workspaceId: ID;
}

// ─── Realtime transport ───────────────────────────────────────────────────────

/** WebSocket / SSE connection health */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// ─── Misc UI utility types ────────────────────────────────────────────────────

/** Key–value tag */
export interface Tag {
  key:   string;
  value: string;
}

/** Breadcrumb navigation segment */
export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

/** Date range selection */
export interface DateRange {
  from: Timestamp;
  to:   Timestamp;
}

/** Analytics time window */
export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
