/**
 * types.ts — All TypeScript types for the Research Lab workspace.
 *
 * ⚠️ SIMULATED DATA — Not live. Used for UI development and demonstration only.
 */

// ─── Research Question ────────────────────────────────────────────────────────

export type QuestionStatus =
  | 'to-research'
  | 'in-progress'
  | 'needs-verification'
  | 'verified'
  | 'rejected';

export type QuestionPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ResearchQuestion {
  id: string;
  question: string;
  subQuestions?: string[];
  assignedResearcher: Researcher;
  status: QuestionStatus;
  priority: QuestionPriority;
  sourceCount: number;
  deadline: string;
  createdAt: string;
  tags: string[];
}

// ─── Source / Evidence ────────────────────────────────────────────────────────

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

export type VerificationStatus =
  | 'verified'
  | 'partially-supported'
  | 'contested'
  | 'outdated'
  | 'unverified'
  | 'rejected';

export interface SourceCard {
  id: string;
  title: string;
  publisher: string;
  author: string;
  publicationDate: string;
  sourceType: SourceType;
  url: string;
  relevantQuotation: string;
  reportPage?: string;
  figureOrTableRef?: string;
  tier: SourceTier;
  confidenceScore: number;   // 0–100
  freshnessScore: number;    // 0–100
  assignedResearcher: Researcher;
  verificationStatus: VerificationStatus;
  linkedQuestionIds: string[];
  notes?: string;
  documentType: DocumentType;
  thumbnailGradient: string;
}

// ─── Researcher ───────────────────────────────────────────────────────────────

export interface Researcher {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  isAi: boolean;
}

// ─── Evidence Map ─────────────────────────────────────────────────────────────

export type EvidenceNodeType =
  | 'claim'
  | 'primary-source'
  | 'supporting-source'
  | 'contradicting-source'
  | 'script-usage'
  | 'scene-usage';

export interface EvidenceNode {
  id: string;
  type: EvidenceNodeType;
  label: string;
  subtitle?: string;
  x: number;
  y: number;
}

export interface EvidenceEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface EvidenceMap {
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
}

// ─── Document ─────────────────────────────────────────────────────────────────

export type DocumentType = 'pdf' | 'article' | 'report' | 'image' | 'dataset';

export interface ResearchDocument {
  id: string;
  title: string;
  documentType: DocumentType;
  thumbnailGradient: string;
  publisher: string;
  dateAdded: string;
  pageCount?: number;
  fileSize?: string;
  sourceId: string;
}

// ─── Inspector ────────────────────────────────────────────────────────────────

export interface EvidenceInspectorData {
  selectedSource: SourceCard | null;
  evidenceStrength: number;   // 0–100
  linkedClaims: string[];
  linkedScriptSections: string[];
  linkedScenes: string[];
  notes: string;
}

// ─── Coverage progress ────────────────────────────────────────────────────────

export interface ResearchCoverage {
  coveragePercent: number;
  verifiedSources: number;
  pendingVerification: number;
  evidenceQuality: number;
  overallConfidence: number;
  totalSources: number;
}

// ─── Root page data ───────────────────────────────────────────────────────────

export interface ResearchLabData {
  projectTitle: string;
  questions: ResearchQuestion[];
  sources: SourceCard[];
  documents: ResearchDocument[];
  evidenceMap: EvidenceMap;
  coverage: ResearchCoverage;
  researchers: Researcher[];
}
