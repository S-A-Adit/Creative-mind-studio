/**
 * types.ts — All TypeScript types for the Project Overview page.
 */

// ─── Project status ───────────────────────────────────────────────────────────

export type OverviewProjectStatus =
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'on-hold'
  | 'published'
  | 'archived';

// ─── Phase ────────────────────────────────────────────────────────────────────

export type PhaseId =
  | 'strategy'
  | 'research'
  | 'script'
  | 'assets'
  | 'editing'
  | 'review'
  | 'distribution'
  | 'performance';

export type PhaseStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';

export interface PhaseCard {
  id: PhaseId;
  label: string;
  status: PhaseStatus;
  completion: number; // 0-100
  responsible: { name: string; initials: string; color: string };
  blockingIssue?: string;
  lastUpdated: string;
}

// ─── Health / KPI ─────────────────────────────────────────────────────────────

export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical';

export interface HealthMetric {
  id: string;
  label: string;
  score: number;       // 0-100
  trend: number;       // delta percentage
  explanation: string;
  status: HealthStatus;
  color: string;
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export type ActivityCategory =
  | 'strategy'
  | 'research'
  | 'script'
  | 'asset'
  | 'review'
  | 'distribution'
  | 'ai'
  | 'team';

export interface TimelineActivity {
  id: string;
  actor: string;
  actorType: 'human' | 'ai';
  actorInitials: string;
  actorColor: string;
  action: string;
  target: string;
  timestamp: Date;
  category: ActivityCategory;
  iconName: string;
}

// ─── Team member ─────────────────────────────────────────────────────────────

export type MemberStatus = 'online' | 'away' | 'offline';

export interface OverviewTeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  assignedPhase: PhaseId;
  status: MemberStatus;
  tasksOpen: number;
}

// ─── Approval ─────────────────────────────────────────────────────────────────

export type ApprovalPriority = 'critical' | 'high' | 'medium' | 'low';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  requester: { name: string; initials: string; color: string };
  priority: ApprovalPriority;
  dueDate: Date;
  status: ApprovalStatus;
  phase: PhaseId;
}

// ─── Recent file ──────────────────────────────────────────────────────────────

export type FileType = 'pdf' | 'doc' | 'video' | 'image' | 'audio' | 'script' | 'csv';

export interface RecentFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  uploadedBy: { name: string; initials: string; color: string };
  uploadedAt: Date;
  phase: PhaseId;
}

// ─── AI Recommendation ────────────────────────────────────────────────────────

export type RecommendationPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface AIRecommendation {
  id: string;
  priority: RecommendationPriority;
  title: string;
  body: string;
  agent: { name: string; initials: string; color: string };
  action: string;
  phase: PhaseId;
}

// ─── Project overview root ────────────────────────────────────────────────────

export interface ProjectOverviewData {
  id: string;
  title: string;
  description: string;
  thumbnailGradient: string;
  platform: string;
  duration: string;
  targetAudience: string;
  owner: { name: string; initials: string; color: string };
  deadline: Date;
  status: OverviewProjectStatus;
  overallProgress: number; // 0-100
  activePhaseId: PhaseId;

  phases: PhaseCard[];
  healthMetrics: HealthMetric[];
  timeline: TimelineActivity[];
  team: OverviewTeamMember[];
  approvals: ApprovalRequest[];
  recentFiles: RecentFile[];
  recommendations: AIRecommendation[];
}
