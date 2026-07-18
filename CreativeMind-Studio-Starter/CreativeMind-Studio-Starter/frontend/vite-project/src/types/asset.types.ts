/**
 * asset.types.ts
 *
 * Asset Room workspace — media asset management, rights tracking,
 * upload state, and alternative suggestions.
 */

import type {
  ID, Timestamp, HexColor, URLString,
  RightsRisk, AspectRatio,
  Auditable, ProjectScoped,
  ActorRef,
} from './common.types';

// ─── Asset category ───────────────────────────────────────────────────────────

export type AssetCategory =
  | 'stock-footage'
  | 'archival-footage'
  | 'news-reference'
  | 'image'
  | 'chart'
  | 'report-screenshot'
  | 'map'
  | 'music'
  | 'sound-effect'
  | 'interview'
  | 'ai-generated'
  | 'motion-graphic'
  | 'original-shoot';

// ─── Asset status ─────────────────────────────────────────────────────────────

export type AssetStatus =
  | 'suggested'
  | 'shortlisted'
  | 'approved'
  | 'rejected'
  | 'purchased'
  | 'downloaded'
  | 'used'
  | 'attribution-added';

// ─── License type ─────────────────────────────────────────────────────────────

export type LicenseType =
  | 'cc0'
  | 'cc-by'
  | 'cc-by-sa'
  | 'cc-by-nc'
  | 'royalty-free'
  | 'editorial-only'
  | 'rights-managed'
  | 'proprietary'
  | 'ai-generated'
  | 'unknown';

// ─── Upload state ─────────────────────────────────────────────────────────────

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'optimizing' | 'done' | 'error';

/** Live state for an asset being uploaded */
export interface ActiveUpload {
  readonly id:          ID;
  readonly fileName:    string;
  readonly fileSizeMb:  number;
  readonly progress:    number;     // 0–100
  readonly status:      UploadStatus;
  readonly category:    AssetCategory;
  readonly startedAt:   Timestamp;
  readonly error?:      string;
}

// ─── Core Asset ───────────────────────────────────────────────────────────────

/** Full asset model — the canonical record of a media item */
export interface Asset extends ProjectScoped, Auditable {
  readonly id:                   ID;
  readonly title:                string;
  readonly category:             AssetCategory;
  readonly thumbnailGradient:    string;
  readonly thumbnailUrl?:        URLString;
  readonly source:               string;
  readonly creator:              string;
  readonly resolution?:          string;
  readonly aspectRatio:          AspectRatio;
  readonly durationSec?:         number;
  readonly fileSizeMb:           number;
  readonly storageUrl?:          URLString;

  // Rights
  readonly license:              LicenseType;
  readonly commercialUse:        boolean;
  readonly attributionRequired:  boolean;
  readonly attributionText?:     string;
  readonly rightsRisk:           RightsRisk;
  readonly licenseDetails:       string;
  readonly usageRights:          string;
  readonly estimatedCostUSD?:    number;
  readonly isPremium:            boolean;

  // Production links
  readonly assignedSceneId?:     ID;
  readonly assignedSceneLabel?:  string;
  readonly linkedScriptSections: readonly string[];
  readonly linkedScenes:         readonly ID[];

  // Status
  readonly status:               AssetStatus;
  readonly downloadStatus:       'not-downloaded' | 'downloading' | 'downloaded';
  readonly addedBy:              ActorRef;

  // Metadata
  readonly tags:                 readonly string[];
  readonly notes?:               string;
  readonly aiSuggestions:        readonly string[];
}

// ─── Alternative option ───────────────────────────────────────────────────────

export type AlternativeType =
  | 'free-asset'
  | 'premium-asset'
  | 'ai-generation'
  | 'motion-graphic'
  | 'original-filming';

export type QualityLevel = 'excellent' | 'good' | 'fair';
export type CostLevel    = 'free' | 'low' | 'medium' | 'high';

/** An AI-suggested alternative when an asset has rights issues */
export interface AlternativeOption {
  readonly id:                  ID;
  readonly type:                AlternativeType;
  readonly label:               string;
  readonly description:         string;
  readonly estimatedQuality:    QualityLevel;
  readonly costLabel:           string;
  readonly costLevel:           CostLevel;
  readonly recommendedUseCase:  string;
  readonly thumbnailGradient:   string;
}

// ─── Usage timeline event ─────────────────────────────────────────────────────

export type AssetTimelineEventType =
  | 'uploaded'
  | 'assigned'
  | 'approved'
  | 'used'
  | 'exported'
  | 'rights-checked'
  | 'rights-flag';

export interface AssetTimelineEvent {
  readonly id:        ID;
  readonly assetId:   ID;
  readonly eventType: AssetTimelineEventType;
  readonly label:     string;
  readonly detail:    string;
  readonly timestamp: Timestamp;
  readonly actor:     ActorRef;
}

// ─── Create / update payloads ─────────────────────────────────────────────────

export interface UploadAssetPayload {
  projectId:          ID;
  title:              string;
  category:           AssetCategory;
  license:            LicenseType;
  commercialUse:      boolean;
  attributionRequired:boolean;
  tags?:              string[];
  notes?:             string;
  assignedSceneId?:   ID;
}

export interface UpdateAssetPayload {
  title?:              string;
  status?:             AssetStatus;
  assignedSceneId?:    ID | null;
  notes?:              string;
  tags?:               string[];
  rightsRisk?:         RightsRisk;
  attributionText?:    string;
}
