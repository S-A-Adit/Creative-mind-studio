/**
 * research.types.ts
 *
 * Research Lab workspace — questions, sources, claims, evidence maps,
 * and document management models.
 */

import type {
  ID, URLString, HexColor, Priority,
  VerificationStatus, Auditable, ProjectScoped,
  ActorRef,
} from './common.types';

// ─── Research question ────────────────────────────────────────────────────────

export type ResearchQuestionStatus =
  | 'to-research'
  | 'in-progress'
  | 'needs-verification'
  | 'verified'
  | 'rejected';

export interface ResearchQuestion extends ProjectScoped, Auditable {
  readonly id:                ID;
  readonly question:          string;
  readonly subQuestions:      readonly string[];
  readonly assignedResearcher:ActorRef;
  readonly status:            ResearchQuestionStatus;
  readonly priority:          Priority;
  readonly sourceCount:       number;
  readonly dueAt:             string;
  readonly tags:              readonly string[];
}

// ─── Source ───────────────────────────────────────────────────────────────────

export type SourceType =
  | 'government'
  | 'academic'
  | 'institutional'
  | 'news'
  | 'interview'
  | 'dataset'
  | 'company-report'
  | 'archive'
  | 'social-post';

export type SourceTier = 'primary' | 'secondary';

export type DocumentType = 'pdf' | 'article' | 'report' | 'image' | 'dataset';

/** A single verified or unverified research source */
export interface Source extends ProjectScoped, Auditable {
  readonly id:                 ID;
  readonly title:              string;
  readonly publisher:          string;
  readonly author:             string;
  readonly publicationDate:    string;
  readonly sourceType:         SourceType;
  readonly url:                URLString;
  readonly relevantQuotation:  string;
  readonly reportPage?:        string;
  readonly figureOrTableRef?:  string;
  readonly tier:               SourceTier;
  readonly confidenceScore:    number;   // 0–100
  readonly freshnessScore:     number;   // 0–100
  readonly assignedResearcher: ActorRef;
  readonly verificationStatus: VerificationStatus;
  readonly linkedQuestionIds:  readonly ID[];
  readonly documentType:       DocumentType;
  readonly thumbnailGradient:  string;
  readonly notes?:             string;
}

// ─── Claim ────────────────────────────────────────────────────────────────────

export type ClaimStatus =
  | 'verified'
  | 'partially-supported'
  | 'contested'
  | 'unverified';

/** A factual claim made in the script, linked to supporting sources */
export interface Claim extends ProjectScoped, Auditable {
  readonly id:                  ID;
  readonly scriptBlockId:       ID;
  readonly claimText:           string;
  readonly status:              ClaimStatus;
  readonly verifiedBy?:         ActorRef;
  readonly verifiedAt?:         string;
  readonly sources:             readonly ClaimSource[];
  readonly notes?:              string;
}

/** A link between a claim and a specific source with context */
export interface ClaimSource {
  readonly id:                 ID;
  readonly claimId:            ID;
  readonly sourceId:           ID;
  readonly sourceTitle:        string;
  readonly publisher:          string;
  readonly page?:              string;
  readonly confidenceScore:    number;
  readonly verificationStatus: ClaimStatus;
  readonly url:                URLString;
}

// ─── Evidence map ─────────────────────────────────────────────────────────────

export type EvidenceNodeType =
  | 'claim'
  | 'primary-source'
  | 'supporting-source'
  | 'contradicting-source'
  | 'script-usage'
  | 'scene-usage';

export interface EvidenceNode {
  readonly id:       ID;
  readonly type:     EvidenceNodeType;
  readonly label:    string;
  readonly subtitle?:string;
  readonly x:        number;
  readonly y:        number;
}

export interface EvidenceEdge {
  readonly id:     ID;
  readonly source: ID;
  readonly target: ID;
  readonly label?: string;
}

export interface EvidenceMap {
  readonly projectId: ID;
  readonly nodes:     readonly EvidenceNode[];
  readonly edges:     readonly EvidenceEdge[];
}

// ─── Research document ────────────────────────────────────────────────────────

export interface ResearchDocument extends ProjectScoped, Auditable {
  readonly id:               ID;
  readonly title:            string;
  readonly documentType:     DocumentType;
  readonly thumbnailGradient:string;
  readonly publisher:        string;
  readonly pageCount?:       number;
  readonly fileSizeLabel?:   string;
  readonly sourceId:         ID;
}

// ─── Research coverage ────────────────────────────────────────────────────────

/** Aggregated coverage health for the research phase */
export interface ResearchCoverage {
  readonly coveragePercent:      number;
  readonly verifiedSources:      number;
  readonly pendingVerification:  number;
  readonly evidenceQuality:      number;
  readonly overallConfidence:    number;
  readonly totalSources:         number;
}

// ─── Research finding ─────────────────────────────────────────────────────────

/** A high-level insight extracted from the research process (AI-generated) */
export interface ResearchFinding extends ProjectScoped, Auditable {
  readonly id:              ID;
  readonly title:           string;
  readonly summary:         string;
  readonly evidence:        string;
  readonly linkedSourceIds: readonly ID[];
  readonly confidence:      number;
  readonly priority:        Priority;
  readonly agentId:         ID;
}

// ─── Create / update payloads ─────────────────────────────────────────────────

export interface CreateResearchQuestionPayload {
  projectId:           ID;
  question:            string;
  subQuestions?:       string[];
  assignedResearcherId:ID;
  priority?:           Priority;
  dueAt?:              string;
  tags?:               string[];
}

export interface AddSourcePayload {
  projectId:         ID;
  title:             string;
  publisher:         string;
  author:            string;
  publicationDate:   string;
  sourceType:        SourceType;
  url:               URLString;
  relevantQuotation: string;
  tier?:             SourceTier;
  linkedQuestionIds?:ID[];
}
