/**
 * useDashboardData — single hook that owns all mock dashboard state.
 *
 * Real implementation: replace the static MOCK_* constants with API calls
 * (React Query / SWR) while keeping the same returned shape.
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectStage =
  | 'Idea'
  | 'Strategy'
  | 'Research'
  | 'Script'
  | 'Assets'
  | 'Editing'
  | 'Review'
  | 'Published';

export type AgentStatus = 'thinking' | 'working' | 'waiting' | 'done' | 'error';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface KpiCard {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend: number; // percentage delta, positive = up
  trendLabel: string;
  description: string;
  iconName: string;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface RecentProject {
  id: string;
  title: string;
  contentType: string;
  stage: ProjectStage;
  completion: number;
  team: TeamMember[];
  lastActivity: string;
  color: string;
  thumbnailGradient: string;
}

export interface PipelineStage {
  id: ProjectStage;
  label: string;
  count: number;
  color: string;
  projects: string[];
}

export interface ActivityItem {
  id: string;
  actor: string;
  actorType: 'human' | 'ai';
  actorInitials: string;
  actorColor: string;
  action: string;
  target: string;
  timestamp: Date;
  category: 'research' | 'strategy' | 'asset' | 'review' | 'publish' | 'ai';
}

export interface AgentCard {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  task: string;
  progress: number;
  model: string;
  color: string;
  messages: string[];
}

export interface Deadline {
  id: string;
  title: string;
  project: string;
  dueDate: Date;
  priority: Priority;
  stage: ProjectStage;
}

export interface DashboardData {
  kpis: KpiCard[];
  recentProjects: RecentProject[];
  pipeline: PipelineStage[];
  activity: ActivityItem[];
  agents: AgentCard[];
  deadlines: Deadline[];
  userName: string;
  workspaceName: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const now = new Date();
const daysOut = (d: number) => new Date(now.getTime() + d * 86_400_000);

const MOCK_DATA: DashboardData = {
  userName: 'Alex',
  workspaceName: 'Apex Media Studio',

  kpis: [
    {
      id: 'active-projects',
      label: 'Active Projects',
      value: 12,
      trend: 20,
      trendLabel: 'vs last month',
      description: 'Projects in active production',
      iconName: 'FolderOpen',
      color: '#7C3AED',
    },
    {
      id: 'tasks-due',
      label: 'Tasks Due',
      value: 8,
      trend: -12,
      trendLabel: 'vs last week',
      description: 'Due within the next 7 days',
      iconName: 'Clock',
      color: '#F59E0B',
    },
    {
      id: 'pending-approvals',
      label: 'Pending Approvals',
      value: 5,
      trend: 0,
      trendLabel: 'no change',
      description: 'Awaiting review sign-off',
      iconName: 'CheckSquare',
      color: '#3B82F6',
    },
    {
      id: 'sources-verified',
      label: 'Sources Verified',
      value: 247,
      trend: 34,
      trendLabel: 'this month',
      description: 'Evidence-linked and fact-checked',
      iconName: 'ShieldCheck',
      color: '#10B981',
    },
    {
      id: 'assets-ready',
      label: 'Assets Ready',
      value: 94,
      trend: 18,
      trendLabel: 'vs last sprint',
      description: 'Media cleared for production',
      iconName: 'Image',
      color: '#06B6D4',
    },
    {
      id: 'published',
      label: 'Published This Month',
      value: 7,
      trend: 40,
      trendLabel: 'vs last month',
      description: 'Pieces live across all platforms',
      iconName: 'Send',
      color: '#EC4899',
    },
  ],

  recentProjects: [
    {
      id: 'p1',
      title: 'The Future of Renewable Energy',
      contentType: 'YouTube Documentary',
      stage: 'Research',
      completion: 42,
      team: [
        { id: 'u1', name: 'Alex Chen', initials: 'AC', color: '#7C3AED' },
        { id: 'u2', name: 'Maya Okafor', initials: 'MO', color: '#3B82F6' },
        { id: 'u3', name: 'Jordan Kim', initials: 'JK', color: '#10B981' },
      ],
      lastActivity: '12 minutes ago',
      color: '#7C3AED',
      thumbnailGradient: 'from-[#7C3AED]/40 to-[#3B82F6]/20',
    },
    {
      id: 'p2',
      title: 'AI in Healthcare — 2025',
      contentType: 'Short-form Series',
      stage: 'Script',
      completion: 68,
      team: [
        { id: 'u2', name: 'Maya Okafor', initials: 'MO', color: '#3B82F6' },
        { id: 'u4', name: 'Sam Rivera', initials: 'SR', color: '#F59E0B' },
      ],
      lastActivity: '2 hours ago',
      color: '#3B82F6',
      thumbnailGradient: 'from-[#3B82F6]/40 to-[#06B6D4]/20',
    },
    {
      id: 'p3',
      title: 'CreatorEconomy Q4 Campaign',
      contentType: 'Social Media Campaign',
      stage: 'Editing',
      completion: 85,
      team: [
        { id: 'u1', name: 'Alex Chen', initials: 'AC', color: '#7C3AED' },
        { id: 'u3', name: 'Jordan Kim', initials: 'JK', color: '#10B981' },
        { id: 'u5', name: 'Priya Sharma', initials: 'PS', color: '#EC4899' },
      ],
      lastActivity: '45 minutes ago',
      color: '#10B981',
      thumbnailGradient: 'from-[#10B981]/40 to-[#06B6D4]/20',
    },
    {
      id: 'p4',
      title: 'Brand Safety Deep Dive',
      contentType: 'Blog / Newsletter',
      stage: 'Review',
      completion: 93,
      team: [
        { id: 'u4', name: 'Sam Rivera', initials: 'SR', color: '#F59E0B' },
      ],
      lastActivity: '1 hour ago',
      color: '#F59E0B',
      thumbnailGradient: 'from-[#F59E0B]/40 to-[#EF4444]/20',
    },
  ],

  pipeline: [
    { id: 'Idea',      label: 'Idea',      count: 3, color: '#94A3B8', projects: ['Product Demo S2', 'Podcast Ep.12', 'Year in Review'] },
    { id: 'Strategy',  label: 'Strategy',  count: 2, color: '#7C3AED', projects: ['Climate Series', 'Tech Roundup'] },
    { id: 'Research',  label: 'Research',  count: 2, color: '#6366F1', projects: ['The Future of Renewable Energy', 'AI in Finance'] },
    { id: 'Script',    label: 'Script',    count: 2, color: '#3B82F6', projects: ['AI in Healthcare', 'Startup Stories'] },
    { id: 'Assets',    label: 'Assets',    count: 1, color: '#06B6D4', projects: ['Brand Identity Refresh'] },
    { id: 'Editing',   label: 'Editing',   count: 1, color: '#10B981', projects: ['CreatorEconomy Q4'] },
    { id: 'Review',    label: 'Review',    count: 1, color: '#F59E0B', projects: ['Brand Safety Deep Dive'] },
    { id: 'Published', label: 'Published', count: 7, color: '#EC4899', projects: ['Q3 Recap', 'AI Weekly #48', 'Founder Stories', '+4 more'] },
  ],

  activity: [
    {
      id: 'a1',
      actor: 'Research Agent',
      actorType: 'ai',
      actorInitials: 'RA',
      actorColor: '#6366F1',
      action: 'added 8 verified sources to',
      target: 'The Future of Renewable Energy',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      category: 'research',
    },
    {
      id: 'a2',
      actor: 'Virality Twin',
      actorType: 'ai',
      actorInitials: 'VT',
      actorColor: '#7C3AED',
      action: 'completed analysis for',
      target: 'AI in Healthcare — 2025',
      timestamp: new Date(Date.now() - 28 * 60 * 1000),
      category: 'ai',
    },
    {
      id: 'a3',
      actor: 'Jordan Kim',
      actorType: 'human',
      actorInitials: 'JK',
      actorColor: '#10B981',
      action: 'moved Scene 12 to Approved in',
      target: 'CreatorEconomy Q4 Campaign',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      category: 'review',
    },
    {
      id: 'a4',
      actor: 'Rights Auditor',
      actorType: 'ai',
      actorInitials: 'RR',
      actorColor: '#EF4444',
      action: 'flagged one unlicensed news clip in',
      target: 'Brand Safety Deep Dive',
      timestamp: new Date(Date.now() - 72 * 60 * 1000),
      category: 'asset',
    },
    {
      id: 'a5',
      actor: 'Distribution Agent',
      actorType: 'ai',
      actorInitials: 'DA',
      actorColor: '#EC4899',
      action: 'generated Instagram adaptation for',
      target: 'AI Weekly #48',
      timestamp: new Date(Date.now() - 105 * 60 * 1000),
      category: 'publish',
    },
    {
      id: 'a6',
      actor: 'Maya Okafor',
      actorType: 'human',
      actorInitials: 'MO',
      actorColor: '#3B82F6',
      action: 'approved final script for',
      target: 'AI in Healthcare — 2025',
      timestamp: new Date(Date.now() - 130 * 60 * 1000),
      category: 'review',
    },
    {
      id: 'a7',
      actor: 'Strategy Agent',
      actorType: 'ai',
      actorInitials: 'SA',
      actorColor: '#8B5CF6',
      action: 'generated 3 content angle variants for',
      target: 'Climate Series',
      timestamp: new Date(Date.now() - 180 * 60 * 1000),
      category: 'strategy',
    },
  ],

  agents: [
    {
      id: 'creative-director',
      name: 'Creative Director',
      role: 'Vision & Narrative',
      status: 'thinking',
      task: 'Evaluating hook variants for Scene 1',
      progress: 35,
      model: 'GPT-4o',
      color: '#7C3AED',
      messages: [
        'Analyzing narrative arc…',
        'The tension curve drops in act 2. Restructuring…',
        'Generating 3 hook variants for Scene 1…',
      ],
    },
    {
      id: 'research-agent',
      name: 'Research Agent',
      role: 'Evidence & Sources',
      status: 'working',
      task: 'Scanning 14 primary sources',
      progress: 62,
      model: 'Claude 3.5',
      color: '#6366F1',
      messages: [
        'Discovered 14 relevant primary sources…',
        'Cross-referencing Gartner 2024 data…',
        'Confidence score: 91% — flagging 1 ambiguous claim…',
      ],
    },
    {
      id: 'scriptwriter',
      name: 'Scriptwriter',
      role: 'Story & Script',
      status: 'working',
      task: 'Drafting Act 2 transitions',
      progress: 78,
      model: 'GPT-4o',
      color: '#3B82F6',
      messages: [
        'Applying brand voice calibration…',
        'Drafting Act 2 with tension-release pattern…',
        'Estimated completion in ~40 seconds…',
      ],
    },
    {
      id: 'reviewer',
      name: 'Reviewer',
      role: 'QA & Brand Safety',
      status: 'waiting',
      task: 'Waiting for script completion',
      progress: 0,
      model: 'Claude 3.5',
      color: '#F59E0B',
      messages: ['Standing by for scriptwriter output…'],
    },
    {
      id: 'virality-twin',
      name: 'Virality Twin',
      role: 'Benchmark Analysis',
      status: 'done',
      task: 'Analysis complete',
      progress: 100,
      model: 'GPT-4o',
      color: '#10B981',
      messages: [
        'Similarity score vs. benchmark: 67%',
        'Missing open-loop at 0:08 — recommendation added.',
        'Analysis complete. 4 optimizations queued.',
      ],
    },
    {
      id: 'rights-auditor',
      name: 'Rights Auditor',
      role: 'Copyright & Compliance',
      status: 'error',
      task: '1 asset requires attention',
      progress: 100,
      model: 'GPT-4o',
      color: '#EF4444',
      messages: [
        'Scanned 47 assets — 46 cleared.',
        '⚠ 1 news clip requires license verification.',
      ],
    },
  ],

  deadlines: [
    {
      id: 'd1',
      title: 'Final edit delivery',
      project: 'CreatorEconomy Q4 Campaign',
      dueDate: daysOut(1),
      priority: 'critical',
      stage: 'Editing',
    },
    {
      id: 'd2',
      title: 'Review sign-off',
      project: 'Brand Safety Deep Dive',
      dueDate: daysOut(2),
      priority: 'high',
      stage: 'Review',
    },
    {
      id: 'd3',
      title: 'Script submission',
      project: 'AI in Healthcare — 2025',
      dueDate: daysOut(3),
      priority: 'high',
      stage: 'Script',
    },
    {
      id: 'd4',
      title: 'Research complete',
      project: 'The Future of Renewable Energy',
      dueDate: daysOut(5),
      priority: 'medium',
      stage: 'Research',
    },
    {
      id: 'd5',
      title: 'Asset upload deadline',
      project: 'Brand Identity Refresh',
      dueDate: daysOut(7),
      priority: 'medium',
      stage: 'Assets',
    },
    {
      id: 'd6',
      title: 'Publish window opens',
      project: 'Climate Series',
      dueDate: daysOut(10),
      priority: 'low',
      stage: 'Strategy',
    },
  ],
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDashboardData() {
  const [data] = useState<DashboardData>(MOCK_DATA);
  const [agentMessages, setAgentMessages] = useState<Record<string, number>>({});
  const [isLoading] = useState(false);

  // Rotate agent messages every 3 s to simulate live thinking
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentMessages((prev) => {
        const next = { ...prev };
        data.agents.forEach((a) => {
          if (a.status === 'thinking' || a.status === 'working') {
            next[a.id] = ((prev[a.id] ?? 0) + 1) % a.messages.length;
          }
        });
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [data.agents]);

  const getAgentMessage = useCallback(
    (agentId: string, fallbackMessages: string[]) => {
      const idx = agentMessages[agentId] ?? 0;
      return fallbackMessages[idx] ?? fallbackMessages[0];
    },
    [agentMessages]
  );

  return { data, isLoading, getAgentMessage };
}
