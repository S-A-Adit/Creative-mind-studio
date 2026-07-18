/**
 * mockData.ts — All static mock data for the Project Creation Flow.
 */

import type {
  WizardStep,
  SuggestedAgent,
  WorkflowStage,
  ContentCategory,
  TargetPlatform,
  PrimaryGoal,
  ToneOption,
  LanguageOption,
  DurationOption,
  StartOptionId,
} from './types';

// ─── Wizard Steps ─────────────────────────────────────────────────────────────

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    label: 'Basic Info',
    description: 'Project identity & goals',
  },
  {
    id: 2,
    label: 'Creative Idea',
    description: 'Concept & creative direction',
  },
  {
    id: 3,
    label: 'Team & Resources',
    description: 'Collaborators & assets',
  },
  {
    id: 4,
    label: 'Start Options',
    description: 'Choose how to begin',
  },
];

// ─── Step 1 Options ───────────────────────────────────────────────────────────

export const CONTENT_CATEGORIES: Array<{ value: ContentCategory; label: string; icon: string }> = [
  { value: 'youtube',      label: 'YouTube Video',    icon: '▶' },
  { value: 'podcast',      label: 'Podcast',          icon: '🎙' },
  { value: 'blog',         label: 'Blog / Article',   icon: '✍' },
  { value: 'social-media', label: 'Social Media',     icon: '📲' },
  { value: 'newsletter',   label: 'Newsletter',       icon: '📬' },
  { value: 'documentary',  label: 'Documentary',      icon: '🎬' },
  { value: 'advertisement',label: 'Advertisement',    icon: '📣' },
  { value: 'other',        label: 'Other',            icon: '✦' },
];

export const TARGET_PLATFORMS: Array<{ value: TargetPlatform; label: string }> = [
  { value: 'youtube',    label: 'YouTube'     },
  { value: 'instagram',  label: 'Instagram'   },
  { value: 'tiktok',     label: 'TikTok'      },
  { value: 'twitter-x',  label: 'X (Twitter)' },
  { value: 'linkedin',   label: 'LinkedIn'    },
  { value: 'spotify',    label: 'Spotify'     },
  { value: 'website',    label: 'Website'     },
  { value: 'other',      label: 'Other'       },
];

export const PRIMARY_GOALS: Array<{ value: PrimaryGoal; label: string }> = [
  { value: 'brand-awareness',   label: 'Brand Awareness'   },
  { value: 'lead-generation',   label: 'Lead Generation'   },
  { value: 'education',         label: 'Education'         },
  { value: 'entertainment',     label: 'Entertainment'     },
  { value: 'community-building',label: 'Community Building'},
  { value: 'sales',             label: 'Sales'             },
  { value: 'thought-leadership',label: 'Thought Leadership'},
  { value: 'other',             label: 'Other'             },
];

// ─── Step 2 Options ───────────────────────────────────────────────────────────

export const TONE_OPTIONS: Array<{ value: ToneOption; label: string; emoji: string }> = [
  { value: 'professional',  label: 'Professional',  emoji: '💼' },
  { value: 'casual',        label: 'Casual',        emoji: '😊' },
  { value: 'humorous',      label: 'Humorous',      emoji: '😂' },
  { value: 'educational',   label: 'Educational',   emoji: '📚' },
  { value: 'inspirational', label: 'Inspirational', emoji: '✨' },
  { value: 'controversial', label: 'Controversial', emoji: '🔥' },
  { value: 'storytelling',  label: 'Storytelling',  emoji: '📖' },
  { value: 'documentary',   label: 'Documentary',   emoji: '🎬' },
];

export const LANGUAGE_OPTIONS: Array<{ value: LanguageOption; label: string; flag: string }> = [
  { value: 'english',    label: 'English',    flag: '🇬🇧' },
  { value: 'arabic',     label: 'Arabic',     flag: '🇸🇦' },
  { value: 'spanish',    label: 'Spanish',    flag: '🇪🇸' },
  { value: 'french',     label: 'French',     flag: '🇫🇷' },
  { value: 'german',     label: 'German',     flag: '🇩🇪' },
  { value: 'portuguese', label: 'Portuguese', flag: '🇧🇷' },
  { value: 'japanese',   label: 'Japanese',   flag: '🇯🇵' },
  { value: 'chinese',    label: 'Chinese',    flag: '🇨🇳' },
];

export const DURATION_OPTIONS: Array<{ value: DurationOption; label: string }> = [
  { value: 'under-1min', label: '< 1 minute'   },
  { value: '1-3min',     label: '1 – 3 minutes' },
  { value: '3-10min',    label: '3 – 10 minutes'},
  { value: '10-20min',   label: '10 – 20 min'   },
  { value: '20-60min',   label: '20 – 60 min'   },
  { value: 'over-60min', label: '60+ minutes'   },
];

// ─── AI Tips (Step 2) ─────────────────────────────────────────────────────────

export const AI_TIPS = [
  {
    id: 'tip-1',
    tip: 'Adding a specific data point or statistic to your idea will make it 3× more shareable.',
    category: 'Engagement',
  },
  {
    id: 'tip-2',
    tip: 'Consider a hook in the first 3 seconds — your retention rate could jump by 40%.',
    category: 'Retention',
  },
  {
    id: 'tip-3',
    tip: 'This topic is trending +270% this week. Strike while the iron is hot.',
    category: 'Virality',
  },
  {
    id: 'tip-4',
    tip: 'Short-form (< 3 min) content for your selected platform converts 55% better for awareness goals.',
    category: 'Platform Fit',
  },
];

// ─── Start Options (Step 4) ───────────────────────────────────────────────────

export interface StartOption {
  id: StartOptionId;
  icon: string;
  label: string;
  description: string;
  badge?: string;
  recommended?: boolean;
}

export const START_OPTIONS: StartOption[] = [
  {
    id: 'blank',
    icon: '✦',
    label: 'Start from Scratch',
    description: 'Begin with a blank canvas and full AI assistance to shape your idea.',
    recommended: true,
  },
  {
    id: 'template',
    icon: '▤',
    label: 'Start from Template',
    description: 'Choose from 40+ expert-designed templates for your content type.',
    badge: '40+ templates',
  },
  {
    id: 'import-script',
    icon: '↗',
    label: 'Import Existing Script',
    description: 'Bring in a script you already have and let AI enhance it.',
  },
  {
    id: 'upload-research',
    icon: '📄',
    label: 'Upload Research PDF',
    description: 'Feed your research documents directly into the AI pipeline.',
  },
  {
    id: 'simple-idea',
    icon: '💡',
    label: 'Start from a Simple Idea',
    description: 'Type a one-liner and let CreativeMind build the full concept.',
  },
];

// ─── Right Sidebar — Suggested Agents ────────────────────────────────────────

export const SUGGESTED_AGENTS: SuggestedAgent[] = [
  {
    id: 'agent-strategist',
    name: 'StrategyBot',
    role: 'Content Strategist',
    avatar: 'SB',
    status: 'ready',
  },
  {
    id: 'agent-researcher',
    name: 'ResearchOwl',
    role: 'Research Analyst',
    avatar: 'RO',
    status: 'ready',
  },
  {
    id: 'agent-writer',
    name: 'ScriptGenius',
    role: 'Script Writer',
    avatar: 'SG',
    status: 'standby',
  },
  {
    id: 'agent-editor',
    name: 'ViralityTwin',
    role: 'Virality Analyst',
    avatar: 'VT',
    status: 'queued',
  },
];

// ─── Right Sidebar — Workflow Preview ─────────────────────────────────────────

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: 'strategy',    label: 'Strategy',    durationDays: 2, status: 'planned' },
  { id: 'research',    label: 'Research',    durationDays: 3, status: 'planned' },
  { id: 'scripting',   label: 'Scripting',   durationDays: 2, status: 'planned' },
  { id: 'production',  label: 'Production',  durationDays: 5, status: 'planned' },
  { id: 'review',      label: 'Review',      durationDays: 2, status: 'planned' },
  { id: 'publish',     label: 'Publish',     durationDays: 1, status: 'planned' },
];

// ─── Team member suggestions ──────────────────────────────────────────────────

export const TEAM_SUGGESTIONS = [
  { id: 'sug-1', email: 'alex@studio.io',   role: 'editor', initials: 'AX' },
  { id: 'sug-2', email: 'maria@studio.io',  role: 'viewer', initials: 'MR' },
  { id: 'sug-3', email: 'james@studio.io',  role: 'editor', initials: 'JM' },
];
