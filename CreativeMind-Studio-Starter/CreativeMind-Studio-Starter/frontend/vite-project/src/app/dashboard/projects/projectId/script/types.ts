/**
 * types.ts — All TypeScript types for the Script & Story Room.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development and demonstration only.
 */

// ─── Story Structure ──────────────────────────────────────────────────────────

export type StoryStage =
  | 'hook'
  | 'setup'
  | 'conflict'
  | 'development'
  | 'reveal'
  | 'resolution'
  | 'cta';

export type SectionStatus = 'not-started' | 'in-progress' | 'draft' | 'review' | 'approved' | 'locked' | 'needs-revision';

export interface StoryWriter {
  id: string;
  name: string;
  initials: string;
  color: string;
  isAi: boolean;
}

export interface StorySection {
  id: string;
  stage: StoryStage;
  title: string;
  synopsis: string;
  status: SectionStatus;
  sceneCount: number;
  estimatedDurationSec: number;
  completionPercent: number;
  assignedWriter: StoryWriter;
  linkedSourceIds: string[];
  blockIds: string[];
}

// ─── Script Block ─────────────────────────────────────────────────────────────

export type BlockType =
  | 'narration'
  | 'dialogue'
  | 'interview'
  | 'on-screen-text'
  | 'visual-direction'
  | 'sound-direction'
  | 'citation'
  | 'editor-note';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'locked' | 'needs-revision' | 'review';

export type ClaimStatus = 'verified' | 'partially-supported' | 'contested' | 'unverified';

export interface InlineComment {
  id: string;
  author: StoryWriter;
  text: string;
  timestamp: string;
  resolved: boolean;
}

export interface ScriptBlock {
  id: string;
  sectionId: string;
  sceneNumber: number;
  type: BlockType;
  content: string;
  speakerName?: string;
  approvalStatus: ApprovalStatus;
  wordCount: number;
  estimatedDurationSec: number;
  linkedSourceId?: string;
  claimStatus?: ClaimStatus;
  claimText?: string;
  commentCount: number;
  comments: InlineComment[];
  suggestions?: string[];
  isSelected?: boolean;
  aiRewritten?: boolean;
  version: number;
}

// ─── Claim / Source link ──────────────────────────────────────────────────────

export interface LinkedSource {
  id: string;
  title: string;
  publisher: string;
  page?: string;
  confidenceScore: number;
  verificationStatus: ClaimStatus;
  url: string;
}

// ─── Scene (timeline) ─────────────────────────────────────────────────────────

export type SceneApprovalStatus = 'not-started' | 'scripted' | 'approved' | 'locked' | 'needs-revision';

export interface SceneCard {
  id: string;
  sectionId: string;
  sceneNumber: number;
  title: string;
  description: string;
  estimatedDurationSec: number;
  approvalStatus: SceneApprovalStatus;
  linkedAssets: number;
  linkedSources: number;
  thumbnailGradient: string;
}

// ─── Emotional curve ──────────────────────────────────────────────────────────

export interface EmotionalPoint {
  stage: string;
  intensity: number;
  curiosity: number;
  tension: number;
  engagement: number;
}

// ─── Inspector ────────────────────────────────────────────────────────────────

export interface BlockInspectorData {
  block: ScriptBlock | null;
  linkedSources: LinkedSource[];
  evidenceStrength: number;
  relatedResearch: string[];
  reviewerNotes: string[];
  suggestedImprovements: string[];
}

// ─── Autosave / version ───────────────────────────────────────────────────────

export type AutosaveState = 'saved' | 'saving' | 'unsaved' | 'error';

export interface ScriptVersion {
  id: string;
  label: string;
  timestamp: string;
  author: StoryWriter;
  changeCount: number;
  isCurrent: boolean;
}

// ─── Script metadata ──────────────────────────────────────────────────────────

export interface ScriptMeta {
  projectTitle: string;
  totalWords: number;
  estimatedReadingTimeSec: number;
  estimatedVoiceoverSec: number;
  totalScenes: number;
  approvedBlocks: number;
  totalBlocks: number;
  completionPercent: number;
  lastSavedAt: string;
}

// ─── Root page data ───────────────────────────────────────────────────────────

export interface ScriptRoomData {
  meta: ScriptMeta;
  writers: StoryWriter[];
  sections: StorySection[];
  blocks: ScriptBlock[];
  scenes: SceneCard[];
  emotionalCurve: EmotionalPoint[];
  versions: ScriptVersion[];
  linkedSources: Record<string, LinkedSource>;
  inspectorMap: Record<string, BlockInspectorData>;
}
