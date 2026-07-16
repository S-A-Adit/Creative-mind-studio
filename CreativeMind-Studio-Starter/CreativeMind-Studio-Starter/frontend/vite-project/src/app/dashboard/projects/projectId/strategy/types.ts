/**
 * types.ts — All TypeScript types for the Strategy War Room.
 */

// ─── Agent ────────────────────────────────────────────────────────────────────

export type AgentId =
  | 'creative-director'
  | 'risk-critic'
  | 'audience-strategist'
  | 'marketing-strategist'
  | 'technical-expert'
  | 'platform-specialist'
  | 'ethics-auditor';

export type AgentStatus =
  | 'thinking'
  | 'responding'
  | 'reviewing'
  | 'completed'
  | 'idle'
  | 'waiting';

export interface StrategyAgent {
  id: AgentId;
  name: string;
  role: string;
  color: string;
  initials: string;
  status: AgentStatus;
  confidencePct: number;       // 0–100
  contributionPct: number;     // 0–100
  agreementLevel: 'agree' | 'disagree' | 'neutral' | 'partial';
  currentFocus: string;
  model: string;
}

// ─── Debate message ───────────────────────────────────────────────────────────

export type MessageType =
  | 'proposal'
  | 'challenge'
  | 'response'
  | 'agreement'
  | 'objection'
  | 'revision'
  | 'pivot'
  | 'synthesis'
  | 'flag';

export interface DebateEvidence {
  label: string;
  source: string;
}

export interface DebateMessage {
  id: string;
  agentId: AgentId;
  type: MessageType;
  round: number;
  timestamp: Date;
  message: string;
  confidence: number;       // 0–100
  evidences: DebateEvidence[];
  referencesMessageId?: string;   // links back to another message
  agreesWithId?: string;
  objectsToId?: string;
  suggestedPivot?: string;
}

// ─── Debate stage ─────────────────────────────────────────────────────────────

export type DebateStage =
  | 'brief-review'
  | 'initial-proposals'
  | 'challenge-round'
  | 'rebuttal'
  | 'synthesis'
  | 'final-vote'
  | 'complete';

// ─── Score card ───────────────────────────────────────────────────────────────

export type ScoreMetric =
  | 'originality'
  | 'feasibility'
  | 'audience-fit'
  | 'emotional-strength'
  | 'trend-relevance'
  | 'production-complexity'
  | 'brand-safety';

export interface ScoreCard {
  id: ScoreMetric;
  label: string;
  score: number;           // 0–100
  trend: number;           // delta vs last round
  explanation: string;
  improvement: string;
  color: string;
  agentId: AgentId;
}

// ─── Decision ledger entry ────────────────────────────────────────────────────

export interface LedgerEntry {
  id: string;
  round: number;
  originalIdea: string;
  criticismRaised: string;
  changeMade: string;
  reason: string;
  approvedBy: AgentId[];
  finalImpact: 'positive' | 'negative' | 'neutral';
  impactLabel: string;
}

// ─── Concept brief ────────────────────────────────────────────────────────────

export interface ConceptBrief {
  projectTitle: string;
  rawIdea: string;
  targetAudience: string;
  platform: string;
  goal: string;
  budget: string;
  timeline: string;
  references: Array<{ label: string; url: string }>;
}

// ─── Debate state ─────────────────────────────────────────────────────────────

export type DebateRunState = 'idle' | 'running' | 'paused' | 'complete';

export interface DebateState {
  runState: DebateRunState;
  stage: DebateStage;
  currentRound: number;
  totalRounds: number;
  consensusPct: number;
  remainingQuestions: number;
  elapsedSeconds: number;
  messages: DebateMessage[];
}

// ─── Right panel ──────────────────────────────────────────────────────────────

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface RiskItem {
  id: string;
  label: string;
  description: string;
  level: RiskLevel;
  owner: AgentId;
}

export interface OpportunityItem {
  id: string;
  label: string;
  description: string;
  potentialImpact: string;
}

export interface StrategyDecision {
  overallRecommendation: string;
  projectHealthPct: number;
  risks: RiskItem[];
  opportunities: OpportunityItem[];
  recommendedNextStep: string;
}

// ─── Root page data ───────────────────────────────────────────────────────────

export interface StrategyWarRoomData {
  brief: ConceptBrief;
  agents: StrategyAgent[];
  debate: DebateState;
  scorecards: ScoreCard[];
  ledger: LedgerEntry[];
  decision: StrategyDecision;
}
