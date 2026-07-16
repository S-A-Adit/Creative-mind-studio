/**
 * mockData.ts — All static mock data for the Virality Twin Workspace.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development and demonstration only.
 */

import type { ViralityTwinData } from './types';

const NOW = new Date();
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3_600_000);

export const MOCK_VIRALITY_TWIN: ViralityTwinData = {

  filters: {
    platform:  'youtube',
    category:  'documentary',
    region:    'global',
    timeRange: '1y',
  },

  lastAnalysisAt:  hoursAgo(2),
  datasetBadge:    'simulated',
  datasetCount:    4_820,

  // ── Cards ─────────────────────────────────────────────────────────────────

  conceptCard: {
    id: 'concept',
    type: 'concept',
    title: 'The Rise of AI in Healthcare',
    thumbnailGradient: 'from-[#7C3AED] via-[#4F46E5] to-[#06B6D4]',
    platform: 'youtube',
    category: 'documentary',
    duration: '14 min',
    publishDate: 'Upcoming',
    audienceType: 'Healthcare professionals · Investors',
    successLevel: 'average',
    channel: 'CreativeMind Studio',
  },

  successCard: {
    id: 'success',
    type: 'success',
    title: 'How AI Diagnosed My Cancer Before Doctors Could',
    thumbnailGradient: 'from-[#10B981] via-[#059669] to-[#0D9488]',
    platform: 'youtube',
    category: 'documentary',
    duration: '18 min',
    publishDate: 'Mar 2024',
    audienceType: 'General audience · Healthcare',
    successLevel: 'viral',
    views: '14.2M',
    engagementRate: 8.4,
    channel: 'TechMedInsider',
  },

  failureCard: {
    id: 'failure',
    type: 'failure',
    title: 'Artificial Intelligence: The Future of Medicine',
    thumbnailGradient: 'from-[#EF4444] via-[#DC2626] to-[#B91C1C]',
    platform: 'youtube',
    category: 'documentary',
    duration: '22 min',
    publishDate: 'Jan 2024',
    audienceType: 'Healthcare professionals',
    successLevel: 'underperformed',
    views: '28K',
    engagementRate: 1.2,
    channel: 'MedTechChannel',
  },

  // ── Comparison metrics ────────────────────────────────────────────────────

  metrics: [
    // Hook
    {
      id: 'hook-style',
      label: 'Hook Style',
      category: 'hook',
      concept:          'AI statistics reveal',
      success:          'Personal patient story',
      failure:          'Topic definition',
      conceptStatus:    'needs-improvement',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    {
      id: 'hook-length',
      label: 'Hook Length',
      category: 'hook',
      concept:          '~10 sec (planned)',
      success:          '7 sec',
      failure:          '18 sec (too long)',
      conceptStatus:    'similar',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    {
      id: 'emotional-angle',
      label: 'Emotional Angle',
      category: 'hook',
      concept:          'Wonder / curiosity',
      success:          'Fear → Hope',
      failure:          'Informational only',
      conceptStatus:    'similar',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    // Structure
    {
      id: 'topic-framing',
      label: 'Topic Framing',
      category: 'structure',
      concept:          'Technology-first',
      success:          'Human-first (patient)',
      failure:          'Technology-first',
      conceptStatus:    'needs-improvement',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    {
      id: 'narrative',
      label: 'Narrative Structure',
      category: 'structure',
      concept:          'Linear explainer',
      success:          '3-act story arc',
      failure:          'Lecture format',
      conceptStatus:    'needs-improvement',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    {
      id: 'pacing',
      label: 'Pacing',
      category: 'structure',
      concept:          'Moderate (planned)',
      success:          'Fast, varied',
      failure:          'Slow, uniform',
      conceptStatus:    'similar',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    // Production
    {
      id: 'duration',
      label: 'Duration',
      category: 'production',
      concept:          '14 min',
      success:          '18 min',
      failure:          '22 min',
      conceptStatus:    'better',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    {
      id: 'scene-freq',
      label: 'Scene Frequency',
      category: 'production',
      concept:          'Unknown (pre-prod)',
      success:          'Cut every 4–6 sec',
      failure:          'Cut every 15–20 sec',
      conceptStatus:    'n/a',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    {
      id: 'title-structure',
      label: 'Title Structure',
      category: 'production',
      concept:          'Neutral declarative',
      success:          'Personal + outcome',
      failure:          'Neutral declarative',
      conceptStatus:    'needs-improvement',
      successStatus:    'better',
      failureStatus:    'similar',
    },
    {
      id: 'thumbnail-style',
      label: 'Thumbnail Style',
      category: 'production',
      concept:          'Abstract (planned)',
      success:          'Human face + text overlay',
      failure:          'Stock photo + logo',
      conceptStatus:    'needs-improvement',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    // Performance
    {
      id: 'audience',
      label: 'Audience Category',
      category: 'performance',
      concept:          'Professional niche',
      success:          'Broad health-curious',
      failure:          'Professional niche',
      conceptStatus:    'similar',
      successStatus:    'better',
      failureStatus:    'similar',
    },
    {
      id: 'pred-retention',
      label: 'Predicted Retention',
      category: 'performance',
      concept:          '~42%',
      success:          '58%',
      failure:          '28%',
      conceptStatus:    'similar',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    {
      id: 'hist-retention',
      label: 'Historical Retention',
      category: 'performance',
      concept:          'N/A (new)',
      success:          '58%',
      failure:          '28%',
      conceptStatus:    'n/a',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
    {
      id: 'engagement',
      label: 'Engagement Rate',
      category: 'performance',
      concept:          'Projected 3.8%',
      success:          '8.4%',
      failure:          '1.2%',
      conceptStatus:    'similar',
      successStatus:    'better',
      failureStatus:    'needs-improvement',
    },
  ],

  // ── Retention curve (every 2 minutes, 0–22 min) ───────────────────────────

  retentionData: [
    { second:  0,  label: '0:00',  concept: 100, success: 100, failure: 100 },
    { second:  8,  label: '0:08',  concept: 88,  success: 94,  failure: 76  },
    { second:  30, label: '0:30',  concept: 78,  success: 91,  failure: 62  },
    { second:  60, label: '1:00',  concept: 72,  success: 88,  failure: 55  },
    { second:  120, label: '2:00', concept: 65,  success: 84,  failure: 48  },
    { second:  180, label: '3:00', concept: 60,  success: 80,  failure: 42  },
    { second:  300, label: '5:00', concept: 54,  success: 74,  failure: 35  },
    { second:  420, label: '7:00', concept: 50,  success: 69,  failure: 31  },
    { second:  600, label: '10:00',concept: 44,  success: 63,  failure: 28  },
    { second:  720, label: '12:00',concept: 42,  success: 60,  failure: 26  },
    { second:  840, label: '14:00',concept: 40,  success: 57,  failure: 24  },
    { second:  960, label: '16:00',concept: null as unknown as number, success: 54, failure: 22 },
    { second: 1080, label: '18:00',concept: null as unknown as number, success: 52, failure: 20 },
    { second: 1200, label: '20:00',concept: null as unknown as number, success: 50, failure: 18 },
    { second: 1320, label: '22:00',concept: null as unknown as number, success: 48, failure: 16 },
  ],

  // ── Radar / DNA data ──────────────────────────────────────────────────────

  radarData: [
    { metric: 'Hook Strength',         concept: 55,  success: 92,  failure: 28,  fullMark: 100 },
    { metric: 'Story Structure',       concept: 50,  success: 88,  failure: 30,  fullMark: 100 },
    { metric: 'Emotional Engagement',  concept: 62,  success: 91,  failure: 24,  fullMark: 100 },
    { metric: 'Pacing',                concept: 65,  success: 85,  failure: 35,  fullMark: 100 },
    { metric: 'Audience Fit',          concept: 70,  success: 78,  failure: 55,  fullMark: 100 },
    { metric: 'Retention',             concept: 42,  success: 82,  failure: 28,  fullMark: 100 },
    { metric: 'Trend Alignment',       concept: 88,  success: 90,  failure: 60,  fullMark: 100 },
    { metric: 'Platform Optimisation', concept: 60,  success: 87,  failure: 40,  fullMark: 100 },
  ],

  // ── Insights ──────────────────────────────────────────────────────────────

  insights: [
    {
      id: 'ins-1',
      category: 'shared-strength',
      priority: 'medium',
      title: 'Strong Trend Alignment',
      description: 'Your concept and the successful twin both capitalise on peak AI-in-healthcare search interest. Trend alignment is the single biggest shared advantage — both score 88–90% in this dimension.',
      expectedImpact: '+15–25% organic reach in first 30 days',
      agent: { name: 'ViralityTwin', initials: 'VT', color: '#8B5CF6' },
    },
    {
      id: 'ins-2',
      category: 'missing-element',
      priority: 'critical',
      title: 'Missing Human Opening Hook',
      description: 'Your hook begins with an AI statistics reveal, while the successful twin opens with a personal patient story within the first 7 seconds. A human-conflict-first opening lifts retention at the 30-second mark by an average of 18 percentage points in this category.',
      expectedImpact: '+18% retention at 30s · +3.2% engagement rate',
      agent: { name: 'ViralityTwin', initials: 'VT', color: '#8B5CF6' },
    },
    {
      id: 'ins-3',
      category: 'missing-element',
      priority: 'high',
      title: 'No 3-Act Narrative Arc',
      description: 'The successful twin follows a clear 3-act structure: (1) Problem — patient crisis, (2) AI intervention — the turning point, (3) Resolution — changed outcome. Your planned linear explainer format matches the failed twin\'s lecture structure, which correlates with high drop-off at the 5-minute mark.',
      expectedImpact: '+12% average view duration',
      agent: { name: 'StrategyBot', initials: 'SB', color: '#06B6D4' },
    },
    {
      id: 'ins-4',
      category: 'risk-pattern',
      priority: 'high',
      title: 'Title Structure Matches Failed Twin',
      description: '"The Rise of AI in Healthcare" is structurally identical to "Artificial Intelligence: The Future of Medicine" — both neutral declarative titles with no personal hook, no outcome, and no viewer-benefit signal. Titles without a personal or outcome angle average 40% lower CTR in this category.',
      expectedImpact: 'CTR risk: -40% vs category average',
      agent: { name: 'ViralityTwin', initials: 'VT', color: '#8B5CF6' },
    },
    {
      id: 'ins-5',
      category: 'risk-pattern',
      priority: 'medium',
      title: 'Technology-First Framing',
      description: 'Your concept leads with AI technology. The failed twin makes the same structural error. Human-first framing (a clinician or patient as the protagonist) broadens the addressable audience from "AI-interested" to "health-curious general public" — an audience 8× larger on YouTube.',
      expectedImpact: 'Audience reach: 8× wider addressable pool',
      agent: { name: 'AudienceAgent', initials: 'AA', color: '#10B981' },
    },
    {
      id: 'ins-6',
      category: 'adjustment',
      priority: 'critical',
      title: 'Open with a Clinician Using AI in Crisis',
      description: 'Reopen episode 1 with an emergency room scenario: a clinician running an AI diagnostic tool under time pressure. Show the AI output first, explain it second. This mirrors the successful twin\'s proven hook pattern and is achievable within current budget.',
      expectedImpact: '+18% retention at 30s · Doubles potential CTR',
      agent: { name: 'ViralityTwin', initials: 'VT', color: '#8B5CF6' },
    },
    {
      id: 'ins-7',
      category: 'adjustment',
      priority: 'high',
      title: 'Revise Title to Include Outcome',
      description: 'Change title from "The Rise of AI in Healthcare" to a format like "How AI Caught What Doctors Missed — 4 Stories from the Front Line". Personal + outcome + number structure consistently outperforms neutral declarative in this vertical.',
      expectedImpact: 'Est. +35–45% CTR improvement',
      agent: { name: 'StrategyBot', initials: 'SB', color: '#06B6D4' },
    },
    {
      id: 'ins-8',
      category: 'adjustment',
      priority: 'medium',
      title: 'Replace Abstract Thumbnail',
      description: 'Switch from planned abstract/gradient thumbnail to a human face (clinician or patient) with a 3-word text overlay including a number. Human-face thumbnails in healthcare content outperform abstract thumbnails by 2.4× CTR on average.',
      expectedImpact: 'Est. +2.4× CTR vs abstract thumbnail',
      agent: { name: 'ViralityTwin', initials: 'VT', color: '#8B5CF6' },
    },
  ],

  // ── Confidence data ───────────────────────────────────────────────────────

  confidence: {
    similarityScore:       76,
    successConfidence:     68,
    predictionConfidence:  71,
    datasetSize:           4820,
    analysisTimestamp:     hoursAgo(2),
    datasetSource:         'CreativeMind Curated Dataset v2.1',
    dataBadge:             'simulated',
    note: '⚠️ All data shown is simulated for demonstration purposes. Scores and predictions are not derived from live platform data.',
  },

  // ── Right panel ───────────────────────────────────────────────────────────

  rightPanel: {
    opportunities: [
      {
        id: 'op-1',
        label: 'Trend Timing Window',
        detail: 'AI healthcare at peak search volume. 3–6 week launch window before saturation.',
        impact: '+40% organic reach vs delayed launch',
      },
      {
        id: 'op-2',
        label: 'LinkedIn Cross-Post',
        detail: 'B2B healthcare micro-clips perform 3× better on LinkedIn for this audience profile.',
        impact: 'Est. 2,400 additional qualified leads per episode',
      },
      {
        id: 'op-3',
        label: 'Human Hook Revision',
        detail: 'One script change unlocks the broader 8× audience pool without production cost.',
        impact: '8× larger addressable audience',
      },
    ],
    risks: [
      {
        id: 'rk-1',
        label: 'Title Mirrors Failed Content',
        detail: 'Current title structure matches the #1 structural predictor of underperformance in this category.',
        severity: 'critical',
      },
      {
        id: 'rk-2',
        label: 'Lecture-Format Narrative',
        detail: 'Linear explainer format correlates with 60%+ drop-off before the 5-minute mark.',
        severity: 'high',
      },
      {
        id: 'rk-3',
        label: 'Abstract Thumbnail',
        detail: 'No human face = 2.4× lower CTR in healthcare documentary category.',
        severity: 'high',
      },
    ],
    quickWins: [
      { id: 'qw-1', action: 'Revise episode title to personal + outcome format',    effort: 'low',  gain: '+35–45% CTR' },
      { id: 'qw-2', action: 'Change thumbnail to clinician face + 3-word overlay',  effort: 'low',  gain: '+2.4× CTR'  },
      { id: 'qw-3', action: 'Move clinician story to first 8 seconds of episode 1', effort: 'medium', gain: '+18% retention' },
    ],
    recommendedNextStep: 'Apply the 3 quick wins first (title, thumbnail, hook re-order). These are script-level changes achievable before production begins. Then proceed to the Research Lab to validate the revised direction.',
  },
};
