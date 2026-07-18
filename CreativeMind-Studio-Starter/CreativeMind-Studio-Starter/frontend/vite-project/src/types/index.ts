/**
 * index.ts — CreativeMind Studio Core Type System
 *
 * Single entry-point for the entire domain type system.
 *
 * Usage:
 *   import type { Project, User, Notification } from '../../types';
 *   import type { ApiResponse, PaginatedResponse } from '../../types';
 *
 * Import order mirrors the dependency graph:
 *   common → auth → user → workspace → project
 *          → strategy → virality → research → script
 *          → asset → review → distribution → analytics → notification
 *
 * RULES:
 *   - Re-export ONLY using `export type` (types only, no runtime code here).
 *   - Keep `shell.ts` separate — it contains React-dependent types (ReactNode).
 *   - Never import from this barrel inside the type files themselves
 *     (only from sibling .types.ts files directly, to avoid circular refs).
 */

// ─── Common primitives & generic shapes ──────────────────────────────────────

export type {
  // Primitive aliases
  ID,
  UUID,
  Timestamp,
  EpochMs,
  HexColor,
  URLString,
  DataURI,
  AvatarInitials,

  // API envelopes
  ApiResponse,
  PaginatedResponse,
  ApiError,
  ResponseMeta,
  PaginationMeta,
  PaginationParams,

  // Async state
  LoadingState,
  AsyncData,

  // Sorting & filtering
  SortDir,
  SortOption,
  FilterOption,

  // Permissions
  PermissionKey,
  PermissionSet,
  WorkspaceRole,

  // Status enumerations
  Priority,
  Severity,
  OnlineStatus,
  TrendDir,
  ApprovalState,
  VerificationStatus,
  RightsRisk,
  PublicationStatus,
  Platform,
  ContentType,
  AspectRatio,

  // Entity fragments
  ActorRef,
  Auditable,
  SoftDeletable,
  ProjectScoped,
  WorkspaceScoped,

  // Realtime
  ConnectionStatus,

  // UI utilities
  Tag,
  BreadcrumbSegment,
  DateRange,
  TimeRange,
} from './common.types';

// ─── Authentication ────────────────────────────────────────────────────────────

export type {
  AuthProvider,
  AccessTokenClaims,
  TokenPair,
  Session,
  AuthState,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  OAuthCallbackRequest,
  InvitationStatus,
  WorkspaceInvitation,
  AcceptInvitationRequest,
} from './auth.types';

// ─── User & team ──────────────────────────────────────────────────────────────

export type {
  User,
  UserRef,
  MemberWorkload,
  ProjectMemberStatus,
  AssignedProjectRef,
  TeamMember,
  RoleDefinition,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateMemberRolePayload,
} from './user.types';

// ─── Workspace ────────────────────────────────────────────────────────────────

export type {
  WorkspacePlan,
  BillingInterval,
  PlanLimits,
  SubscriptionPlan,
  Workspace,
  WorkspaceSettings,
  ActivityType,
  ActivityEntry,
  WorkspaceUsage,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
} from './workspace.types';

// ─── Project ──────────────────────────────────────────────────────────────────

export type {
  ProjectStatus,
  ProjectPhaseId,
  PhaseStatus,
  ProjectPhase,
  TaskStatus,
  Task,
  Project,
  ProjectCard,
  HealthStatus,
  HealthMetric,
  AgentRole,
  AgentStatus,
  AgentModel,
  Agent,
  AgentMessage,
  AgentEvidence,
  ApprovalStatus,
  ApprovalRequest,
  CreateProjectPayload,
  UpdateProjectPayload,
  CreateTaskPayload,
  UpdateTaskPayload,
} from './project.types';

// ─── Strategy War Room ────────────────────────────────────────────────────────

export type {
  StrategyAgentId,
  StrategyAgentStatus,
  AgreementLevel,
  StrategyAgent,
  DebateStage,
  DebateRunState,
  MessageType,
  DebateMessage,
  DebateSession,
  ScoreMetric,
  Scorecard,
  LedgerImpact,
  LedgerEntry,
  ConceptBrief,
  RiskItem,
  OpportunityItem,
  StrategyDecision,
  StartDebatePayload,
} from './strategy.types';

// ─── Virality Twin ────────────────────────────────────────────────────────────

export type {
  AnalysisRegion,
  ViralityFilters,
  ContentCardType,
  SuccessLevel,
  ViralityContentCard,
  MetricStatus,
  MetricCategory,
  ComparisonMetric,
  RetentionDataPoint,
  RadarDataPoint,
  InsightCategory,
  ViralityInsight,
  DataBadge,
  ViralityConfidence,
  EffortLevel,
  QuickWin,
  ViralityRightPanel,
  DnaInsightId,
  CreatorDNA,
  DnaInsight,
  ViralityTwinSnapshot,
} from './virality.types';

// ─── Research Lab ─────────────────────────────────────────────────────────────

export type {
  ResearchQuestionStatus,
  ResearchQuestion,
  SourceType,
  SourceTier,
  DocumentType,
  Source,
  ClaimStatus,
  Claim,
  ClaimSource,
  EvidenceNodeType,
  EvidenceNode,
  EvidenceEdge,
  EvidenceMap,
  ResearchDocument,
  ResearchCoverage,
  ResearchFinding,
  CreateResearchQuestionPayload,
  AddSourcePayload,
} from './research.types';

// ─── Script & Story Room ──────────────────────────────────────────────────────

export type {
  StoryStage,
  SectionStatus,
  ScriptSection,
  BlockType,
  BlockApprovalStatus,
  InlineComment,
  ScriptBlock,
  SceneApprovalStatus,
  Scene,
  SceneAsset,
  ScriptVersion,
  EmotionalDataPoint,
  EditNote,
  ScriptMeta,
  CreateScriptBlockPayload,
  UpdateScriptBlockPayload,
} from './script.types';

// ─── Asset Room ───────────────────────────────────────────────────────────────

export type {
  AssetCategory,
  AssetStatus,
  LicenseType,
  UploadStatus,
  ActiveUpload,
  Asset,
  AlternativeType,
  QualityLevel,
  CostLevel,
  AlternativeOption,
  AssetTimelineEventType,
  AssetTimelineEvent,
  UploadAssetPayload,
  UpdateAssetPayload,
} from './asset.types';

// ─── Review & Approval ────────────────────────────────────────────────────────

export type {
  ReviewStatus,
  ReviewType,
  AnnotationType,
  Annotation,
  Review,
  ApprovalStepStatus,
  ApprovalStep,
  CreateReviewPayload,
  SubmitApprovalDecisionPayload,
  AddAnnotationPayload,
} from './review.types';

// ─── Distribution Room ────────────────────────────────────────────────────────

export type {
  MasterContent,
  ThumbnailStatus,
  PlatformVariant,
  RecommendationType,
  DistributionRecommendation,
  DiffType,
  ComparisonField,
  ExportFormat,
  ExportOption,
  PublicationSnapshot,
  CreatePlatformVariantPayload,
  UpdatePlatformVariantPayload,
  SchedulePublicationPayload,
} from './distribution.types';

// ─── Analytics & Performance ──────────────────────────────────────────────────

export type {
  MetricId,
  KpiMetric,
  PlatformBreakdown,
  CategoryPerformance,
  AudienceInsights,
  AnalyticsSnapshot,
  ViralityPredictionComparison,
  RecommendationPriority,
  AnalyticsRecommendation,
  LearningImpact,
  LearningEntry,
} from './analytics.types';

// ─── Notifications ────────────────────────────────────────────────────────────

export type {
  NotificationCategory,
  NotificationFilterTab,
  Notification,
  NotificationPreferences,
  ActivityItemType,
  ActivityItem,
  MarkNotificationsReadPayload,
  MarkAllNotificationsReadPayload,
  UpdateNotificationPrefsPayload,
} from './notification.types';
