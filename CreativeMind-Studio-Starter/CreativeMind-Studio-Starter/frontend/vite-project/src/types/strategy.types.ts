/**
 * strategy.types.ts
 *
 * Strategy War Room domain models — AI debate sessions, scorecards,
 * decision ledger, risk/opportunity analysis.
 */

import type {
  ID, Timestamp, HexColor, Priority, Severity,
  Auditable, ProjectScoped,
} from './common.types';
import type { AgentMessage } from './project.types';

// ─── Agent identifiers for the strategy debate ────────────────────────────────

export type StrategyAgentId =
  | 'creative-director'
  | 'risk-critic'
  | 'audience-strategist'
  | 'marketing-strategist'
  | 'technical-expert'
  | 'platform-specialist'
  | 'ethics-auditor';

export type StrategyAgentStatus =
  | 'thinking'
  | 'responding'
  | 'reviewing'
  | 'completed'
  | 'idle'
  | 'waiting';

export type AgreementLevel = 'agree' | 'disagree' | 'neutral' | 'partial';

/** Strategy-room-specific agent enrichment */
export interface StrategyAgent {
  readonly id:               StrategyAgentId;
  readonly name:             string;
  readonly role:             string;
  readonly color:            HexColor;
  readonly initials:         string;
  readonly status:           StrategyAgentStatus;
  readonly model:            string;
  readonly confidencePct:    number;   // 0–100
  readonly contributionPct:  number;   // 0–100
  readonly agreementLevel:   AgreementLevel;
  readonly currentFocus:     string;
}

// ─── Debate ───────────────────────────────────────────────────────────────────

export type DebateStage =
  | 'brief-review'
  | 'initial-proposals'
  | 'challenge-round'
  | 'rebuttal'
  | 'synthesis'
  | 'final-vote'
  | 'complete';

export type DebateRunState = 'idle' | 'running' | 'paused' | 'complete';

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

/** A single turn in the strategy debate. Extends AgentMessage with debate metadata. */
export interface DebateMessage extends AgentMessage {
  readonly agentId:             StrategyAgentId;
  readonly messageType:         MessageType;
  readonly round:               number;
  readonly agreesWithId?:       ID;
  readonly objectsToId?:        ID;
  readonly suggestedPivot?:     string;
}

/** Complete debate session state */
export interface DebateSession extends ProjectScoped, Auditable {
  readonly id:                  ID;
  readonly runState:            DebateRunState;
  readonly stage:               DebateStage;
  readonly currentRound:        number;
  readonly totalRounds:         number;
  readonly consensusPct:        number;
  readonly remainingQuestions:  number;
  readonly elapsedSeconds:      number;
  readonly messages:            readonly DebateMessage[];
}

// ─── Scorecard ────────────────────────────────────────────────────────────────

export type ScoreMetric =
  | 'originality'
  | 'feasibility'
  | 'audience-fit'
  | 'emotional-strength'
  | 'trend-relevance'
  | 'production-complexity'
  | 'brand-safety';

/** Score for a single creative dimension, attributed to an agent */
export interface Scorecard {
  readonly id:           ScoreMetric;
  readonly label:        string;
  readonly score:        number;   // 0–100
  readonly trend:        number;   // delta vs last round
  readonly explanation:  string;
  readonly improvement:  string;
  readonly color:        HexColor;
  readonly agentId:      StrategyAgentId;
}

// ─── Decision ledger ──────────────────────────────────────────────────────────

export type LedgerImpact = 'positive' | 'negative' | 'neutral';

/** An immutable record of a debate decision / revision */
export interface LedgerEntry {
  readonly id:              ID;
  readonly sessionId:       ID;
  readonly round:           number;
  readonly originalIdea:    string;
  readonly criticismRaised: string;
  readonly changeMade:      string;
  readonly reason:          string;
  readonly approvedBy:      readonly StrategyAgentId[];
  readonly finalImpact:     LedgerImpact;
  readonly impactLabel:     string;
  readonly createdAt:       Timestamp;
}

// ─── Project brief ────────────────────────────────────────────────────────────

/** The structured brief fed into the strategy debate */
export interface ConceptBrief {
  readonly projectId:     ID;
  readonly projectTitle:  string;
  readonly rawIdea:       string;
  readonly targetAudience:string;
  readonly platform:      string;
  readonly goal:          string;
  readonly budget?:       string;
  readonly timeline?:     string;
  readonly references:    readonly { label: string; url: string }[];
}

// ─── Risk & opportunity ───────────────────────────────────────────────────────

export interface RiskItem {
  readonly id:          ID;
  readonly label:       string;
  readonly description: string;
  readonly level:       Severity;
  readonly owner:       StrategyAgentId;
}

export interface OpportunityItem {
  readonly id:             ID;
  readonly label:          string;
  readonly description:    string;
  readonly potentialImpact:string;
}

/** Aggregated strategic decision output from a completed debate */
export interface StrategyDecision {
  readonly sessionId:             ID;
  readonly overallRecommendation: string;
  readonly projectHealthPct:      number;
  readonly risks:                 readonly RiskItem[];
  readonly opportunities:         readonly OpportunityItem[];
  readonly recommendedNextStep:   string;
  readonly finalizedAt:           Timestamp;
}

// ─── Create payloads ──────────────────────────────────────────────────────────

export interface StartDebatePayload {
  projectId:    ID;
  brief:        ConceptBrief;
  totalRounds?: number;
  agentIds?:    StrategyAgentId[];
}
