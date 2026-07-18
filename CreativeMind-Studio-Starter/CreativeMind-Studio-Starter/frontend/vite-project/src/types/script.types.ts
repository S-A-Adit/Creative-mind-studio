/**
 * script.types.ts
 *
 * Script & Story Room workspace — sections, blocks, scenes, versions,
 * emotional curve, and inline comments.
 */

import type {
  ID, Timestamp, HexColor,
  Auditable, ProjectScoped,
  ActorRef,
} from './common.types';

// ─── Story structure ──────────────────────────────────────────────────────────

export type StoryStage =
  | 'hook'
  | 'setup'
  | 'conflict'
  | 'development'
  | 'reveal'
  | 'resolution'
  | 'cta';

export type SectionStatus =
  | 'not-started'
  | 'in-progress'
  | 'draft'
  | 'review'
  | 'approved'
  | 'locked'
  | 'needs-revision';

/** A major story section (e.g. Hook, Setup, Conflict) */
export interface ScriptSection extends ProjectScoped, Auditable {
  readonly id:                    ID;
  readonly stage:                 StoryStage;
  readonly title:                 string;
  readonly synopsis:              string;
  readonly status:                SectionStatus;
  readonly sceneCount:            number;
  readonly estimatedDurationSec:  number;
  readonly completionPercent:     number;
  readonly assignedWriter:        ActorRef;
  readonly linkedSourceIds:       readonly ID[];
  readonly blockIds:              readonly ID[];
  readonly order:                 number;
}

// ─── Script block ─────────────────────────────────────────────────────────────

export type BlockType =
  | 'narration'
  | 'dialogue'
  | 'interview'
  | 'on-screen-text'
  | 'visual-direction'
  | 'sound-direction'
  | 'citation'
  | 'editor-note';

export type BlockApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'locked'
  | 'needs-revision'
  | 'review';

export type ClaimStatus =
  | 'verified'
  | 'partially-supported'
  | 'contested'
  | 'unverified';

/** An inline review comment on a script block */
export interface InlineComment extends Auditable {
  readonly id:          ID;
  readonly blockId:     ID;
  readonly author:      ActorRef;
  readonly text:        string;
  readonly resolved:    boolean;
  readonly resolvedBy?: ActorRef;
  readonly resolvedAt?: Timestamp;
}

/** A single atomic unit of the script */
export interface ScriptBlock extends ProjectScoped, Auditable {
  readonly id:                    ID;
  readonly sectionId:             ID;
  readonly sceneNumber:           number;
  readonly order:                 number;
  readonly type:                  BlockType;
  readonly content:               string;
  readonly speakerName?:          string;
  readonly approvalStatus:        BlockApprovalStatus;
  readonly wordCount:             number;
  readonly estimatedDurationSec:  number;
  readonly linkedSourceId?:       ID;
  readonly claimStatus?:          ClaimStatus;
  readonly claimText?:            string;
  readonly commentCount:          number;
  readonly comments:              readonly InlineComment[];
  readonly suggestions?:          readonly string[];
  readonly aiRewritten:           boolean;
  readonly version:               number;
}

// ─── Scene ────────────────────────────────────────────────────────────────────

export type SceneApprovalStatus =
  | 'not-started'
  | 'scripted'
  | 'approved'
  | 'locked'
  | 'needs-revision';

/** A visual scene referenced by script blocks and linked to assets */
export interface Scene extends ProjectScoped, Auditable {
  readonly id:                    ID;
  readonly sectionId:             ID;
  readonly sceneNumber:           number;
  readonly title:                 string;
  readonly description:           string;
  readonly estimatedDurationSec:  number;
  readonly approvalStatus:        SceneApprovalStatus;
  readonly linkedAssetCount:      number;
  readonly linkedSourceCount:     number;
  readonly thumbnailGradient:     string;
}

/** Link between a scene and an asset */
export interface SceneAsset {
  readonly sceneId:    ID;
  readonly assetId:    ID;
  readonly order:      number;
  readonly inPoint?:   number;   // seconds
  readonly outPoint?:  number;   // seconds
  readonly notes?:     string;
}

// ─── Script version ───────────────────────────────────────────────────────────

/** An immutable snapshot of the script at a point in time */
export interface ScriptVersion extends ProjectScoped, Auditable {
  readonly id:          ID;
  readonly label:       string;
  readonly author:      ActorRef;
  readonly changeCount: number;
  readonly isCurrent:   boolean;
  readonly snapshotUrl: string;   // storage URL of the frozen JSON
}

// ─── Emotional curve ──────────────────────────────────────────────────────────

export interface EmotionalDataPoint {
  readonly stage:      string;
  readonly intensity:  number;
  readonly curiosity:  number;
  readonly tension:    number;
  readonly engagement: number;
}

// ─── Edit note ────────────────────────────────────────────────────────────────

/** A timestamped annotation left by a reviewer in the editor workspace */
export interface EditNote extends ProjectScoped, Auditable {
  readonly id:           ID;
  readonly author:       ActorRef;
  readonly targetId:     ID;     // blockId or sceneId
  readonly targetType:   'block' | 'scene';
  readonly text:         string;
  readonly timestampSec?:number; // video timestamp reference
  readonly resolved:     boolean;
  readonly resolvedBy?:  ActorRef;
  readonly resolvedAt?:  Timestamp;
}

// ─── Script metadata ──────────────────────────────────────────────────────────

export interface ScriptMeta extends ProjectScoped {
  readonly totalWords:              number;
  readonly estimatedReadingTimeSec: number;
  readonly estimatedVoiceoverSec:   number;
  readonly totalScenes:             number;
  readonly approvedBlocks:          number;
  readonly totalBlocks:             number;
  readonly completionPercent:       number;
  readonly lastSavedAt:             Timestamp;
  readonly autosaveStatus:          'saved' | 'saving' | 'unsaved' | 'error';
}

// ─── Create / update payloads ─────────────────────────────────────────────────

export interface CreateScriptBlockPayload {
  projectId:   ID;
  sectionId:   ID;
  type:        BlockType;
  content:     string;
  speakerName?:string;
  order?:      number;
}

export interface UpdateScriptBlockPayload {
  content?:         string;
  type?:            BlockType;
  approvalStatus?:  BlockApprovalStatus;
  speakerName?:     string;
}
