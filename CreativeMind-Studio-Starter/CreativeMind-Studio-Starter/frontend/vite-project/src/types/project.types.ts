/**
 * project.types.ts
 *
 * Core project, phase, task, and agent models.
 * This is the central domain model — all other workspace modules
 * reference projects via projectId.
 */

import type {
  ID, Timestamp, HexColor, URLString,
  Priority, Platform, ContentType, AspectRatio,
  Auditable, ProjectScoped, WorkspaceScoped,
  ActorRef,
} from './common.types';

// ─── Project status ───────────────────────────────────────────────────────────

export type ProjectStatus =
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'on-hold'
  | 'published'
  | 'archived';

// ─── Production phase ─────────────────────────────────────────────────────────

export type ProjectPhaseId =
  | 'strategy'
  | 'virality-twin'
  | 'research'
  | 'script'
  | 'assets'
  | 'editing'
  | 'review'
  | 'distribution'
  | 'performance';

export type PhaseStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';

/** One stage in the production pipeline */
export interface ProjectPhase {
  readonly id:              ProjectPhaseId;
  readonly label:           string;
  readonly status:          PhaseStatus;
  readonly completion:      number;   // 0–100
  readonly responsible:     ActorRef;
  readonly blockingIssue?:  string;
  readonly startedAt?:      Timestamp;
  readonly completedAt?:    Timestamp;
  readonly lastUpdatedAt:   Timestamp;
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done' | 'blocked' | 'cancelled';

/** A discrete unit of work inside a project phase */
export interface Task extends Auditable, ProjectScoped {
  readonly id:           ID;
  readonly phaseId:      ProjectPhaseId;
  readonly title:        string;
  readonly description?: string;
  readonly status:       TaskStatus;
  readonly priority:     Priority;
  readonly assignee:     ActorRef | null;
  readonly dueAt?:       Timestamp;
  readonly completedAt?: Timestamp;
  readonly tags:         readonly string[];
  readonly attachments:  readonly string[];
  readonly parentTaskId?:ID;
  readonly subtaskCount: number;
  readonly commentCount: number;
}

// ─── Core Project ─────────────────────────────────────────────────────────────

/** Full project model returned by GET /projects/:id */
export interface Project extends Auditable, WorkspaceScoped {
  readonly id:                 ID;
  readonly title:              string;
  readonly description:        string;
  readonly thumbnailGradient:  string;
  readonly thumbnailUrl?:      URLString;
  readonly status:             ProjectStatus;
  readonly contentType:        ContentType;
  readonly primaryPlatform:    Platform;
  readonly targetPlatforms:    readonly Platform[];
  readonly targetAudience:     string;
  readonly primaryGoal:        string;
  readonly tone:               string;
  readonly language:           string;
  readonly estimatedDuration:  string;
  readonly aspectRatio:        AspectRatio;
  readonly color:              HexColor;

  readonly ownerId:            ID;
  readonly teamMemberIds:      readonly ID[];

  readonly deadline:           Timestamp | null;
  readonly publishedAt?:       Timestamp;

  readonly overallProgress:    number;    // 0–100
  readonly activePhaseId:      ProjectPhaseId;
  readonly phases:             readonly ProjectPhase[];

  readonly tags:               readonly string[];
  readonly aiCreditsUsed:      number;

  /** Denormalised quick reference — refreshed by API */
  readonly taskSummary: {
    readonly total:     number;
    readonly done:      number;
    readonly blocked:   number;
  };
}

/** Lightweight card-form used in list views */
export interface ProjectCard extends WorkspaceScoped {
  readonly id:               ID;
  readonly title:            string;
  readonly status:           ProjectStatus;
  readonly contentType:      ContentType;
  readonly primaryPlatform:  Platform;
  readonly color:            HexColor;
  readonly thumbnailGradient:string;
  readonly overallProgress:  number;
  readonly activePhaseId:    ProjectPhaseId;
  readonly deadline:         Timestamp | null;
  readonly ownerRef:         ActorRef;
  readonly updatedAt:        Timestamp;
}

// ─── Project health ───────────────────────────────────────────────────────────

export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical';

export interface HealthMetric {
  readonly id:          ID;
  readonly label:       string;
  readonly score:       number;
  readonly trend:       number;   // delta percentage
  readonly explanation: string;
  readonly status:      HealthStatus;
  readonly color:       HexColor;
}

// ─── AI Agent ─────────────────────────────────────────────────────────────────

export type AgentRole =
  | 'strategy-director'
  | 'research-engine'
  | 'script-writer'
  | 'asset-curator'
  | 'risk-critic'
  | 'audience-analyst'
  | 'marketing-strategist'
  | 'platform-specialist'
  | 'ethics-auditor'
  | 'virality-predictor'
  | 'copywriter'
  | 'distribution-manager';

export type AgentStatus = 'running' | 'completed' | 'error' | 'idle' | 'waiting' | 'thinking' | 'responding';

export type AgentModel =
  | 'gpt-4o'
  | 'gpt-4-turbo'
  | 'claude-3-5-sonnet'
  | 'claude-3-opus'
  | 'gemini-1.5-pro'
  | 'llama-3-70b'
  | 'custom';

/** AI agent definition and live runtime state */
export interface Agent {
  readonly id:             ID;
  readonly name:           string;
  readonly role:           AgentRole;
  readonly model:          AgentModel;
  readonly color:          HexColor;
  readonly initials:       string;
  readonly status:         AgentStatus;
  readonly progress?:      number;    // 0–100
  readonly confidencePct?: number;    // 0–100
  readonly currentTask?:   string;
  readonly isActive:       boolean;
  readonly lastRunAt?:     Timestamp;
}

/** A message produced by an agent during a task or debate */
export interface AgentMessage {
  readonly id:           ID;
  readonly agentId:      ID;
  readonly agentName:    string;
  readonly agentRole:    AgentRole;
  readonly agentColor:   HexColor;
  readonly sessionId:    ID;
  readonly content:      string;
  readonly timestamp:    Timestamp;
  readonly confidence?:  number;
  readonly evidences:    readonly AgentEvidence[];
  /** References another message in the same session */
  readonly referencesId?:ID;
}

export interface AgentEvidence {
  readonly label:  string;
  readonly source: string;
  readonly url?:   URLString;
}

// ─── Approval request ─────────────────────────────────────────────────────────

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';

export interface ApprovalRequest extends ProjectScoped, Auditable {
  readonly id:          ID;
  readonly title:       string;
  readonly description: string;
  readonly requester:   ActorRef;
  readonly approvers:   readonly ActorRef[];
  readonly priority:    Priority;
  readonly dueAt:       Timestamp;
  readonly status:      ApprovalStatus;
  readonly phaseId:     ProjectPhaseId;
  readonly comments?:   string;
  readonly resolvedAt?: Timestamp;
  readonly resolvedBy?: ActorRef;
}

// ─── Create / update payloads ─────────────────────────────────────────────────

export interface CreateProjectPayload {
  title:           string;
  description:     string;
  contentType:     ContentType;
  primaryPlatform: Platform;
  targetPlatforms: Platform[];
  targetAudience:  string;
  primaryGoal:     string;
  tone:            string;
  language:        string;
  deadline?:       Timestamp;
  tags?:           string[];
}

export interface UpdateProjectPayload {
  title?:            string;
  description?:      string;
  status?:           ProjectStatus;
  deadline?:         Timestamp | null;
  primaryPlatform?:  Platform;
  targetPlatforms?:  Platform[];
  tags?:             string[];
  thumbnailUrl?:     URLString;
}

export interface CreateTaskPayload extends ProjectScoped {
  phaseId:      ProjectPhaseId;
  title:        string;
  description?: string;
  priority?:    Priority;
  assigneeId?:  ID;
  dueAt?:       Timestamp;
  tags?:        string[];
  parentTaskId?:ID;
}

export interface UpdateTaskPayload {
  title?:       string;
  description?: string;
  status?:      TaskStatus;
  priority?:    Priority;
  assigneeId?:  ID | null;
  dueAt?:       Timestamp | null;
}
