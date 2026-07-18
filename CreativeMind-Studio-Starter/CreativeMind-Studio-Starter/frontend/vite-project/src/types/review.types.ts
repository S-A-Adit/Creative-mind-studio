/**
 * review.types.ts
 *
 * Review & Approval Room workspace — review sessions, annotations,
 * approval chains, and feedback threads.
 */

import type {
  ID, Timestamp, HexColor, URLString, Priority,
  Auditable, ProjectScoped,
  ActorRef,
} from './common.types';

// ─── Review status ────────────────────────────────────────────────────────────

export type ReviewStatus =
  | 'pending'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'needs-revision'
  | 'conditionally-approved';

// ─── Review type ──────────────────────────────────────────────────────────────

export type ReviewType =
  | 'final-cut'
  | 'script-draft'
  | 'research-report'
  | 'asset-clearance'
  | 'platform-variant'
  | 'brand-compliance';

// ─── Annotation ───────────────────────────────────────────────────────────────

export type AnnotationType = 'comment' | 'approve' | 'reject' | 'question' | 'suggestion';

/** A timestamped annotation on a review item (video, script, document) */
export interface Annotation extends Auditable {
  readonly id:            ID;
  readonly reviewId:      ID;
  readonly author:        ActorRef;
  readonly type:          AnnotationType;
  readonly text:          string;
  readonly timestampSec?: number;   // for video reviews
  readonly x?:            number;   // for image/document reviews (0–1)
  readonly y?:            number;
  readonly resolved:      boolean;
  readonly resolvedBy?:   ActorRef;
  readonly resolvedAt?:   Timestamp;
  readonly parentId?:     ID;       // reply thread
  readonly reactions:     readonly string[];
}

// ─── Core Review ─────────────────────────────────────────────────────────────

/** A review session for a specific deliverable */
export interface Review extends ProjectScoped, Auditable {
  readonly id:              ID;
  readonly type:            ReviewType;
  readonly title:           string;
  readonly description:     string;
  readonly status:          ReviewStatus;
  readonly priority:        Priority;

  /** The deliverable under review (video URL, document URL, etc.) */
  readonly contentUrl:      URLString;
  readonly contentVersion:  string;

  readonly requester:       ActorRef;
  readonly assignedTo:      readonly ActorRef[];
  readonly dueAt:           Timestamp;
  readonly resolvedAt?:     Timestamp;

  readonly annotations:     readonly Annotation[];
  readonly openIssueCount:  number;
  readonly resolvedIssueCount:number;

  readonly approvalChain:   readonly ApprovalStep[];
}

// ─── Approval chain ───────────────────────────────────────────────────────────

export type ApprovalStepStatus = 'pending' | 'approved' | 'rejected' | 'skipped';

/** One step in a multi-reviewer approval chain */
export interface ApprovalStep {
  readonly id:          ID;
  readonly reviewId:    ID;
  readonly order:       number;
  readonly approver:    ActorRef;
  readonly status:      ApprovalStepStatus;
  readonly decidedAt?:  Timestamp;
  readonly comment?:    string;
  readonly isRequired:  boolean;
}

// ─── Create / update payloads ─────────────────────────────────────────────────

export interface CreateReviewPayload {
  projectId:     ID;
  type:          ReviewType;
  title:         string;
  description?:  string;
  priority?:     Priority;
  contentUrl:    URLString;
  contentVersion:string;
  assignedToIds: ID[];
  dueAt:         Timestamp;
  approverIds?:  ID[];
}

export interface SubmitApprovalDecisionPayload {
  reviewId: ID;
  stepId:   ID;
  decision: 'approved' | 'rejected';
  comment?: string;
}

export interface AddAnnotationPayload {
  reviewId:      ID;
  type:          AnnotationType;
  text:          string;
  timestampSec?: number;
  x?:            number;
  y?:            number;
  parentId?:     ID;
}
