/**
 * types.ts — Distribution Room type definitions
 */

// ─── Publication Status ──────────────────────────────────────────────────────

export type PublicationStatus =
  | 'draft'
  | 'generating'
  | 'ready-for-review'
  | 'approved'
  | 'ready-to-publish'
  | 'published';

// ─── Platform ────────────────────────────────────────────────────────────────

export type PlatformId =
  | 'youtube'
  | 'instagram-reel'
  | 'youtube-shorts'
  | 'linkedin'
  | 'x-thread'
  | 'newsletter'
  | 'podcast'
  | 'blog'
  | 'carousel';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '2:3' | 'text' | 'audio';

// ─── Master Content ───────────────────────────────────────────────────────────

export interface MasterContent {
  projectTitle: string;
  summary: string;
  primaryHook: string;
  mainScript: string;
  targetAudience: string;
  primaryPlatform: PlatformId;
  estimatedDuration: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  cta: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  approvedBy: string;
  approvedAt: string;
  version: string;
  wordCount: number;
  characterCount: number;
}

// ─── AI Recommendation ────────────────────────────────────────────────────────

export interface AIRecommendation {
  id: string;
  type: 'seo' | 'engagement' | 'format' | 'tone' | 'structure' | 'pacing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  applied: boolean;
}

// ─── Platform Adaptation ─────────────────────────────────────────────────────

export interface PlatformAdaptation {
  id: string;
  platformId: PlatformId;
  platformName: string;
  icon: string;
  status: PublicationStatus;
  assignedTo: string;
  assignedToInitials: string;
  assignedToColor: string;
  generatedTitle: string;
  hook: string;
  description: string;
  estimatedDuration: string;
  aspectRatio: AspectRatio;
  characterLimit: number;
  currentCharacterCount: number;
  cta: string;
  thumbnailStatus: 'ready' | 'generating' | 'missing' | 'approved';
  readinessScore: number; // 0–100
  recommendations: AIRecommendation[];
  isLocked: boolean;
  lastUpdated: string;
}

// ─── Comparison Field ────────────────────────────────────────────────────────

export type DiffType = 'unchanged' | 'modified' | 'ai-optimized' | 'platform-specific';

export interface ComparisonField {
  label: string;
  masterValue: string;
  platformValue: string;
  diffType: DiffType;
}

// ─── Export Format ───────────────────────────────────────────────────────────

export type ExportFormat = 'copy' | 'markdown' | 'pdf' | 'json' | 'assets';

export interface ExportOption {
  id: ExportFormat;
  label: string;
  description: string;
  icon: string;
  available: boolean;
  comingSoon?: boolean;
}

// ─── Quick Action ────────────────────────────────────────────────────────────

export type QuickActionId =
  | 'generate'
  | 'regenerate'
  | 'lock'
  | 'edit'
  | 'approve'
  | 'copy'
  | 'export'
  | 'schedule';

export interface QuickAction {
  id: QuickActionId;
  label: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  comingSoon?: boolean;
  disabled?: boolean;
}
