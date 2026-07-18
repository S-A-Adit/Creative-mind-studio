/**
 * distribution.types.ts
 *
 * Distribution Room workspace — platform adaptations, publication scheduling,
 * export formats, and multi-platform content variants.
 */

import type {
  ID, Timestamp, URLString,
  Platform, AspectRatio, PublicationStatus,
  Auditable, ProjectScoped,
  ActorRef,
} from './common.types';

// ─── Master content ───────────────────────────────────────────────────────────

/** The approved master content record from which all platform variants are derived */
export interface MasterContent extends ProjectScoped, Auditable {
  readonly id:                ID;
  readonly projectTitle:      string;
  readonly summary:           string;
  readonly primaryHook:       string;
  readonly mainScript:        string;
  readonly targetAudience:    string;
  readonly primaryPlatform:   Platform;
  readonly estimatedDuration: string;
  readonly thumbnailUrl?:     URLString;
  readonly cta:               string;
  readonly approvalStatus:    'approved' | 'pending' | 'rejected';
  readonly approvedBy?:       ActorRef;
  readonly approvedAt?:       Timestamp;
  readonly version:           string;
  readonly wordCount:         number;
  readonly characterCount:    number;
}

// ─── Platform variant ─────────────────────────────────────────────────────────

export type ThumbnailStatus = 'ready' | 'generating' | 'missing' | 'approved';

/** An AI-adapted version of the master content for a specific platform */
export interface PlatformVariant extends ProjectScoped, Auditable {
  readonly id:                    ID;
  readonly masterContentId:       ID;
  readonly platformId:            Platform;
  readonly platformName:          string;
  readonly status:                PublicationStatus;
  readonly assignedTo:            ActorRef;

  // Adapted content
  readonly generatedTitle:        string;
  readonly hook:                  string;
  readonly description:           string;
  readonly cta:                   string;
  readonly estimatedDuration:     string;
  readonly aspectRatio:           AspectRatio;
  readonly characterLimit:        number;
  readonly currentCharacterCount: number;

  // Production state
  readonly thumbnailStatus:       ThumbnailStatus;
  readonly readinessScore:        number;   // 0–100
  readonly isLocked:              boolean;

  // Schedule
  readonly scheduledAt?:          Timestamp;
  readonly publishedAt?:          Timestamp;
  readonly publishedUrl?:         URLString;
}

// ─── Distribution recommendation ─────────────────────────────────────────────

export type RecommendationType =
  | 'seo'
  | 'engagement'
  | 'format'
  | 'tone'
  | 'structure'
  | 'pacing';

export interface DistributionRecommendation {
  readonly id:          ID;
  readonly variantId:   ID;
  readonly type:        RecommendationType;
  readonly priority:    'high' | 'medium' | 'low';
  readonly title:       string;
  readonly description: string;
  readonly applied:     boolean;
}

// ─── Diff field for master/variant comparison ─────────────────────────────────

export type DiffType = 'unchanged' | 'modified' | 'ai-optimized' | 'platform-specific';

export interface ComparisonField {
  readonly label:         string;
  readonly masterValue:   string;
  readonly variantValue:  string;
  readonly diffType:      DiffType;
}

// ─── Export format ────────────────────────────────────────────────────────────

export type ExportFormat = 'copy' | 'markdown' | 'pdf' | 'json' | 'assets' | 'xml';

export interface ExportOption {
  readonly id:          ExportFormat;
  readonly label:       string;
  readonly description: string;
  readonly available:   boolean;
  readonly comingSoon?: boolean;
}

// ─── Distribution analytics snapshot ─────────────────────────────────────────

/** Post-publish engagement snapshot for a platform variant */
export interface PublicationSnapshot extends ProjectScoped, Auditable {
  readonly id:             ID;
  readonly variantId:      ID;
  readonly platformId:     Platform;
  readonly capturedAt:     Timestamp;
  readonly views:          number;
  readonly impressions:    number;
  readonly engagementRate: number;
  readonly clickRate:      number;
  readonly shares:         number;
  readonly saves:          number;
  readonly comments:       number;
  readonly watchTimeSec:   number;
}

// ─── Create / update payloads ─────────────────────────────────────────────────

export interface CreatePlatformVariantPayload {
  projectId:       ID;
  masterContentId: ID;
  platformId:      Platform;
  assignedToId:    ID;
}

export interface UpdatePlatformVariantPayload {
  generatedTitle?:  string;
  hook?:            string;
  description?:     string;
  cta?:             string;
  status?:          PublicationStatus;
  scheduledAt?:     Timestamp | null;
  isLocked?:        boolean;
}

export interface SchedulePublicationPayload {
  variantId:   ID;
  scheduledAt: Timestamp;
}
