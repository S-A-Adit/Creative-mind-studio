/**
 * Shell type definitions for CreativeMind Studio application foundation.
 * These types drive the sidebar, header, command palette, and layout system.
 */

// ─── Navigation ─────────────────────────────────────────────────────────────

export type NavItemId =
  | 'home'
  | 'projects'
  | 'agents'
  | 'team'
  | 'notifications'
  | 'analytics'
  | 'templates'
  | 'settings';

export type ProjectNavItemId =
  | 'project-overview'
  | 'strategy-room'
  | 'virality-twin'
  | 'research-lab'
  | 'story-script'
  | 'asset-room'
  | 'editor-workspace'
  | 'review-approval'
  | 'distribution'
  | 'performance';

export type ActiveNavId = NavItemId | ProjectNavItemId | string;

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  href?: string;
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'published'
  | 'archived';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  description?: string;
  color?: string;
  updatedAt?: string;
}

// ─── Workspace ───────────────────────────────────────────────────────────────

export type WorkspaceId = string;

export interface Workspace {
  id: WorkspaceId;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  avatarInitials?: string;
  color?: string;
}

// ─── Command Palette ─────────────────────────────────────────────────────────

export type CommandCategory =
  | 'project'
  | 'navigation'
  | 'team'
  | 'ai'
  | 'settings';

export interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  category: CommandCategory;
  keywords?: string[];
  action: () => void;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export type PrimaryAction = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export interface LayoutContextValue {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (v: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  activeNavId: ActiveNavId;
  setActiveNavId: (id: ActiveNavId) => void;
  breadcrumbs: BreadcrumbSegment[];
  setBreadcrumbs: (b: BreadcrumbSegment[]) => void;
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  activeWorkspace: Workspace;
  setActiveWorkspace: (w: Workspace) => void;
  workspaces: Workspace[];
  primaryAction: PrimaryAction | null;
  setPrimaryAction: (a: PrimaryAction | null) => void;
}

// ─── Realtime ────────────────────────────────────────────────────────────────

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export type RealtimeEventType =
  | 'agent-update'
  | 'comment'
  | 'presence'
  | 'activity'
  | 'research-progress'
  | 'asset-processing'
  | 'connection-status';

export interface RealtimeEvent<T = unknown> {
  type: RealtimeEventType;
  payload: T;
  timestamp: number;
  projectId: string;
}

export interface AgentUpdatePayload {
  agentId: string;
  agentName: string;
  status: 'running' | 'completed' | 'error' | 'idle';
  progress?: number;
  message?: string;
}

export interface PresencePayload {
  userId: string;
  userName: string;
  avatarUrl?: string;
  cursor?: { x: number; y: number };
  activeSection?: string;
}

export interface ActivityPayload {
  actorName: string;
  action: string;
  target?: string;
  timestamp: number;
}

export interface ResearchProgressPayload {
  queryId: string;
  query: string;
  progress: number; // 0-100
  sourcesFound: number;
  status: 'running' | 'completed' | 'error';
}

export interface AssetProcessingPayload {
  assetId: string;
  assetName: string;
  progress: number;
  stage: 'uploading' | 'processing' | 'optimizing' | 'done' | 'error';
}

export interface CommentPayload {
  commentId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  section: string;
  timestamp: number;
}

export interface RealtimeProjectState {
  connectionStatus: ConnectionStatus;
  presenceUsers: PresencePayload[];
  latestActivity: ActivityPayload[];
  agentUpdates: Record<string, AgentUpdatePayload>;
  researchProgress: Record<string, ResearchProgressPayload>;
  assetProcessing: Record<string, AssetProcessingPayload>;
  recentComments: CommentPayload[];
  events: RealtimeEvent[];
}

export interface UseRealtimeProjectReturn extends RealtimeProjectState {
  subscribeToEvent: <T>(type: RealtimeEventType, handler: (payload: T) => void) => () => void;
  simulateEvent: (event: RealtimeEvent) => void;
  disconnect: () => void;
  reconnect: () => void;
}
