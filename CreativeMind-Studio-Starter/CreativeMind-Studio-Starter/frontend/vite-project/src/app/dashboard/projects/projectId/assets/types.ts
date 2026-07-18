/**
 * types.ts — All TypeScript types for the Asset Room.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

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

// ─── Rights risk ──────────────────────────────────────────────────────────────

export type RightsRisk = 'low' | 'medium' | 'high' | 'blocked';

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

// ─── View mode ────────────────────────────────────────────────────────────────

export type ViewMode = 'grid' | 'list' | 'board' | 'scene-linked' | 'rights-risk';

// ─── Aspect ratio ─────────────────────────────────────────────────────────────

export type AspectRatio = '16:9' | '9:16' | '4:3' | '1:1' | '21:9' | '3:2' | '5:3' | 'varies';

// ─── Upload status ────────────────────────────────────────────────────────────

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

// ─── Asset card data ──────────────────────────────────────────────────────────

export interface AssetCard {
  id: string;
  title: string;
  category: AssetCategory;
  thumbnailGradient: string;
  thumbnailIcon?: string;         // emoji or icon key
  source: string;
  creator: string;
  resolution?: string;
  aspectRatio: AspectRatio;
  durationSec?: number;
  fileSizeMb: number;
  license: LicenseType;
  commercialUse: boolean;
  attributionRequired: boolean;
  rightsRisk: RightsRisk;
  assignedSceneId?: string;
  assignedSceneLabel?: string;
  status: AssetStatus;
  downloadStatus: 'not-downloaded' | 'downloading' | 'downloaded';
  addedAt: string;
  tags: string[];
  notes?: string;
  isPremium: boolean;
  estimatedCostUSD?: number;
  // inspector extras
  linkedScriptSections: string[];
  linkedScenes: string[];
  usageRights: string;
  licenseDetails: string;
  attributionText?: string;
  aiSuggestions: string[];
}

// ─── Alternative option ───────────────────────────────────────────────────────

export type AlternativeType =
  | 'free-asset'
  | 'premium-asset'
  | 'ai-generation'
  | 'motion-graphic'
  | 'original-filming';

export interface AlternativeOption {
  id: string;
  type: AlternativeType;
  label: string;
  description: string;
  estimatedQuality: 'excellent' | 'good' | 'fair';
  costLabel: string;
  costLevel: 'free' | 'low' | 'medium' | 'high';
  recommendedUseCase: string;
  thumbnailGradient: string;
}

// ─── Usage timeline event ─────────────────────────────────────────────────────

export type TimelineEventType = 'uploaded' | 'assigned' | 'approved' | 'used' | 'exported';

export interface TimelineEvent {
  id: string;
  assetId: string;
  eventType: TimelineEventType;
  label: string;
  detail: string;
  timestamp: string;
  actor: string;
}

// ─── Active upload ────────────────────────────────────────────────────────────

export interface ActiveUpload {
  id: string;
  fileName: string;
  fileSizeMb: number;
  progress: number;          // 0–100
  status: UploadStatus;
  category: AssetCategory;
}

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface AssetFilters {
  search: string;
  category: AssetCategory | 'all';
  status: AssetStatus | 'all';
  license: LicenseType | 'all';
  rightsRisk: RightsRisk | 'all';
  commercial: 'all' | 'yes' | 'no';
  isPremium: 'all' | 'free' | 'premium';
  scene: string | 'all';
}

// ─── Root page data ───────────────────────────────────────────────────────────

export interface AssetRoomData {
  projectTitle: string;
  assets: AssetCard[];
  alternatives: Record<string, AlternativeOption[]>;
  timeline: TimelineEvent[];
  categoryStats: Record<AssetCategory, number>;
}
