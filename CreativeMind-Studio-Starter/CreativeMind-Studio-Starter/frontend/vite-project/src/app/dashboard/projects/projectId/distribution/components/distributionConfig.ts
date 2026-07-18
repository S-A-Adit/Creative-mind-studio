/**
 * distributionConfig.ts — Non-component constants for Distribution Room
 *
 * Separating from DistributionShared.tsx to satisfy react-refresh/only-export-components.
 */

import { FileText, Loader2, Send, Eye, Zap, CheckCircle2 } from 'lucide-react';
import type { PublicationStatus, DiffType } from '../types';

// ─── Status config ─────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  PublicationStatus,
  { label: string; color: string; bg: string; border: string; Icon: React.ElementType }
> = {
  draft: {
    label: 'Draft',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.1)',
    border: 'rgba(148,163,184,0.25)',
    Icon: FileText,
  },
  generating: {
    label: 'Generating',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)',
    Icon: Loader2,
  },
  'ready-for-review': {
    label: 'Ready for Review',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.25)',
    Icon: Eye,
  },
  approved: {
    label: 'Approved',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
    Icon: CheckCircle2,
  },
  'ready-to-publish': {
    label: 'Ready to Publish',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.25)',
    Icon: Send,
  },
  published: {
    label: 'Published',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.25)',
    Icon: Zap,
  },
};

// ─── Diff config ─────────────────────────────────────────────────────────────

export const DIFF_CONFIG: Record<DiffType, { label: string; color: string; bg: string }> = {
  unchanged:           { label: 'Unchanged',        color: '#94A3B8', bg: 'rgba(148,163,184,0.08)' },
  modified:            { label: 'Modified',          color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' },
  'ai-optimized':      { label: 'AI Optimized',      color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  'platform-specific': { label: 'Platform-Specific', color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
};

// ─── Priority config ─────────────────────────────────────────────────────────

export const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  medium: { label: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  low:    { label: 'Low',    color: '#94A3B8', bg: 'rgba(148,163,184,0.1)' },
};

// ─── Thumbnail status labels ──────────────────────────────────────────────────

export const THUMB_COLORS: Record<string, string> = {
  ready:      '#10B981',
  generating: '#F59E0B',
  missing:    '#EF4444',
  approved:   '#8B5CF6',
};

export const THUMB_LABELS: Record<string, string> = {
  ready: 'Ready', generating: 'Generating', missing: 'Missing', approved: 'Approved',
};

// ─── Platform colors ──────────────────────────────────────────────────────────

import type { PlatformId } from '../types';

export const PLATFORM_COLORS: Record<PlatformId, { bg: string; text: string }> = {
  youtube:          { bg: '#FF0000', text: '#ffffff' },
  'instagram-reel': { bg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', text: '#ffffff' },
  'youtube-shorts': { bg: '#FF0000', text: '#ffffff' },
  linkedin:         { bg: '#0A66C2', text: '#ffffff' },
  'x-thread':       { bg: '#000000', text: '#ffffff' },
  newsletter:       { bg: '#F59E0B', text: '#000000' },
  podcast:          { bg: '#8940FA', text: '#ffffff' },
  blog:             { bg: '#10B981', text: '#ffffff' },
  carousel:         { bg: '#EC4899', text: '#ffffff' },
};
