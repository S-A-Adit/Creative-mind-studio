/**
 * mockData.ts — Performance & Creator DNA Workspace realistic mock data
 */

import type {
  KpiMetric,
  RetentionDataPoint,
  CtrDataPoint,
  PlatformDataPoint,
  CategoryDataPoint,
  HookDataPoint,
  AudienceSegmentPoint,
  ViralityTwinComparison,
  DnaInsight,
  LearningEntry,
  AudienceInsights,
  AIRecommendation,
} from './types';

// ─── KPI Metrics ─────────────────────────────────────────────────────────────

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'views',
    label: 'Total Views',
    value: '2.4M',
    rawValue: 2_412_880,
    unit: 'views',
    change: +34.2,
    trend: 'up',
    sparkline: [820, 910, 870, 1050, 1240, 1180, 1420],
    timeRange: 'Last 30 days',
    description: 'Unique video views across all platforms',
  },
  {
    id: 'impressions',
    label: 'Impressions',
    value: '18.7M',
    rawValue: 18_742_000,
    unit: 'impressions',
    change: +21.8,
    trend: 'up',
    sparkline: [5200, 5800, 6100, 5900, 6400, 7100, 7800],
    timeRange: 'Last 30 days',
    description: 'Total times thumbnail was shown',
  },
  {
    id: 'ctr',
    label: 'Click-Through Rate',
    value: '12.9%',
    rawValue: 12.9,
    unit: '%',
    change: +2.4,
    trend: 'up',
    sparkline: [10.1, 10.8, 11.2, 11.9, 12.1, 12.6, 12.9],
    timeRange: 'Last 30 days',
    description: 'Percentage of impressions that became views',
  },
  {
    id: 'watch_time',
    label: 'Watch Time',
    value: '142K hrs',
    rawValue: 142_400,
    unit: 'hours',
    change: +28.6,
    trend: 'up',
    sparkline: [38, 42, 45, 41, 55, 62, 74],
    timeRange: 'Last 30 days',
    description: 'Total hours of content consumed',
  },
  {
    id: 'avg_view_duration',
    label: 'Avg View Duration',
    value: '7:24',
    rawValue: 444,
    unit: 'seconds',
    change: +12.3,
    trend: 'up',
    sparkline: [380, 390, 410, 415, 425, 438, 444],
    timeRange: 'Last 30 days',
    description: 'Average time viewers spend watching',
  },
  {
    id: 'retention',
    label: 'Avg Retention',
    value: '74.2%',
    rawValue: 74.2,
    unit: '%',
    change: +6.8,
    trend: 'up',
    sparkline: [63, 65, 67, 69, 71, 73, 74],
    timeRange: 'Last 30 days',
    description: 'Percentage of video watched on average',
  },
  {
    id: 'shares',
    label: 'Shares',
    value: '84.2K',
    rawValue: 84_200,
    unit: 'shares',
    change: +47.1,
    trend: 'up',
    sparkline: [12, 18, 22, 25, 30, 38, 48],
    timeRange: 'Last 30 days',
    description: 'Content shared across platforms',
  },
  {
    id: 'saves',
    label: 'Saves',
    value: '31.6K',
    rawValue: 31_600,
    unit: 'saves',
    change: +19.4,
    trend: 'up',
    sparkline: [8, 11, 12, 15, 18, 21, 26],
    timeRange: 'Last 30 days',
    description: 'Content saved / bookmarked by viewers',
  },
  {
    id: 'conversions',
    label: 'Conversions',
    value: '6.2K',
    rawValue: 6_240,
    unit: 'conversions',
    change: -4.1,
    trend: 'down',
    sparkline: [920, 880, 840, 760, 700, 680, 640],
    timeRange: 'Last 30 days',
    description: 'Viewers who took the CTA action',
  },
];

// ─── Retention Curve ──────────────────────────────────────────────────────────

export const RETENTION_DATA: RetentionDataPoint[] = Array.from({ length: 31 }, (_, i) => {
  const s = i * 20;
  const predicted = Math.max(
    30,
    100 - Math.pow(i, 1.12) * 1.8 + (i < 3 ? 0 : -2) + (i === 8 ? -5 : 0)
  );
  const actual = Math.max(
    28,
    predicted + (i < 5 ? 2 : i < 12 ? -3 : i < 20 ? -8 : -12) + (Math.random() * 4 - 2)
  );
  return {
    second: s,
    label: `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`,
    predicted: Math.round(predicted * 10) / 10,
    actual: Math.round(actual * 10) / 10,
  };
});

// Manually adjust key points for realism
RETENTION_DATA[0] = { second: 0, label: '0:00', predicted: 100, actual: 100 };
RETENTION_DATA[1] = { second: 20, label: '0:20', predicted: 95.2, actual: 96.8 };
RETENTION_DATA[2] = { second: 40, label: '0:40', predicted: 89.4, actual: 91.2 };
RETENTION_DATA[3] = { second: 60, label: '1:00', predicted: 84.1, actual: 82.3 };
RETENTION_DATA[5] = { second: 100, label: '1:40', predicted: 76.8, actual: 71.2 };
RETENTION_DATA[9] = { second: 180, label: '3:00', predicted: 68.4, actual: 58.1 }; // drop-off
RETENTION_DATA[15] = { second: 300, label: '5:00', predicted: 58.2, actual: 49.8 };
RETENTION_DATA[20] = { second: 400, label: '6:40', predicted: 52.1, actual: 46.2 };
RETENTION_DATA[30] = { second: 600, label: '10:00', predicted: 42.0, actual: 38.5 };

// ─── CTR Over Time ────────────────────────────────────────────────────────────

export const CTR_DATA: CtrDataPoint[] = [
  { date: 'Dec 16', ctr: 8.4, impressions: 420_000 },
  { date: 'Dec 18', ctr: 9.1, impressions: 510_000 },
  { date: 'Dec 20', ctr: 9.8, impressions: 580_000 },
  { date: 'Dec 22', ctr: 11.2, impressions: 720_000 },
  { date: 'Dec 24', ctr: 10.6, impressions: 690_000 },
  { date: 'Dec 26', ctr: 11.8, impressions: 810_000 },
  { date: 'Dec 28', ctr: 12.1, impressions: 880_000 },
  { date: 'Dec 30', ctr: 11.4, impressions: 840_000 },
  { date: 'Jan 01', ctr: 13.2, impressions: 1_050_000 },
  { date: 'Jan 03', ctr: 12.8, impressions: 990_000 },
  { date: 'Jan 05', ctr: 13.6, impressions: 1_120_000 },
  { date: 'Jan 07', ctr: 12.9, impressions: 1_080_000 },
  { date: 'Jan 09', ctr: 14.1, impressions: 1_200_000 },
  { date: 'Jan 11', ctr: 13.4, impressions: 1_150_000 },
  { date: 'Jan 13', ctr: 12.9, impressions: 1_100_000 },
];

// ─── Platform Performance ─────────────────────────────────────────────────────

export const PLATFORM_DATA: PlatformDataPoint[] = [
  { platform: 'YouTube',    views: 1_240_000, engagement: 8.4, ctr: 12.9, shares: 38_200 },
  { platform: 'LinkedIn',   views: 420_000,   engagement: 11.2, ctr: 9.4,  shares: 18_400 },
  { platform: 'Instagram',  views: 380_000,   engagement: 14.8, ctr: 7.2,  shares: 14_100 },
  { platform: 'X (Twitter)',views: 210_000,   engagement: 6.2,  ctr: 5.8,  shares: 9_200  },
  { platform: 'Newsletter', views: 98_000,    engagement: 22.4, ctr: 18.6, shares: 3_800  },
  { platform: 'Podcast',    views: 64_880,    engagement: 31.2, ctr: 4.1,  shares: 600    },
];

// ─── Category Performance ─────────────────────────────────────────────────────

export const CATEGORY_DATA: CategoryDataPoint[] = [
  { category: 'Psychology',    avgViews: 1_820_000, avgRetention: 74.2, avgCtr: 13.1, count: 4 },
  { category: 'Productivity',  avgViews: 1_240_000, avgRetention: 68.8, avgCtr: 11.4, count: 7 },
  { category: 'AI & Tech',     avgViews: 980_000,   avgRetention: 71.2, avgCtr: 12.8, count: 5 },
  { category: 'Storytelling',  avgViews: 870_000,   avgRetention: 76.4, avgCtr: 10.2, count: 3 },
  { category: 'Business',      avgViews: 640_000,   avgRetention: 62.1, avgCtr: 9.8,  count: 6 },
  { category: 'Marketing',     avgViews: 520_000,   avgRetention: 58.4, avgCtr: 8.6,  count: 8 },
];

// ─── Hook Performance ─────────────────────────────────────────────────────────

export const HOOK_DATA: HookDataPoint[] = [
  { hookStyle: 'Shocking Stat',     avgRetention30s: 88.4, avgCtr: 14.2, samples: 6 },
  { hookStyle: 'Question + Gap',    avgRetention30s: 84.1, avgCtr: 13.8, samples: 9 },
  { hookStyle: 'Counterintuitive',  avgRetention30s: 81.6, avgCtr: 12.4, samples: 5 },
  { hookStyle: 'Story Opening',     avgRetention30s: 76.2, avgCtr: 11.1, samples: 7 },
  { hookStyle: 'Bold Claim',        avgRetention30s: 72.8, avgCtr: 10.6, samples: 4 },
  { hookStyle: 'Listicle Promise',  avgRetention30s: 64.4, avgCtr: 9.2,  samples: 8 },
  { hookStyle: 'Tutorial Start',    avgRetention30s: 58.1, avgCtr: 7.8,  samples: 6 },
];

// ─── Audience Segments ────────────────────────────────────────────────────────

export const AUDIENCE_SEGMENTS: AudienceSegmentPoint[] = [
  { age: '18–24', percentage: 18, avgWatchTime: 5.2 },
  { age: '25–34', percentage: 34, avgWatchTime: 7.8 },
  { age: '35–44', percentage: 28, avgWatchTime: 8.4 },
  { age: '45–54', percentage: 14, avgWatchTime: 6.9 },
  { age: '55+',   percentage: 6,  avgWatchTime: 5.1 },
];

// ─── Virality Twin Comparison ─────────────────────────────────────────────────

export const VIRALITY_TWIN: ViralityTwinComparison = {
  projectTitle: 'The Hidden Psychology of Viral Content',
  predictedScore: 82,
  actualScore: 71,
  confidenceScore: 78,
  predictionError: 11,
  predictedDropOffPoint: 245,
  actualDropOffPoint: 178,
  aiExplanation:
    'The model overestimated retention in the 2–4 minute window. The extended introduction (47 seconds vs the optimal 22s) caused a steeper drop-off than predicted. The novelty-detection spike model was accurate for the first 60 seconds but did not account for the "expectation lag" effect when the core thesis was delayed.',
  learningCaptured:
    'Extended intros above 30 seconds reduce mid-video retention by an average of 14.2 percentage points on psychology content. The pattern-completion system requires a "teaser reveal" within the first 45 seconds to maintain curiosity tension.',
  metrics: [
    { label: 'Peak Views/Hour',    predicted: 42_000,  actual: 38_200,  unit: 'views', diff: -9 },
    { label: '30s Retention',      predicted: 84.0,    actual: 78.4,    unit: '%',     diff: -6.6 },
    { label: '3min Retention',     predicted: 68.4,    actual: 58.1,    unit: '%',     diff: -15.2 },
    { label: 'Share Rate',         predicted: 3.8,     actual: 3.5,     unit: '%',     diff: -0.3 },
    { label: 'Avg View Duration',  predicted: 8.2,     actual: 7.4,     unit: 'min',   diff: -9.8 },
    { label: 'Subscriber Conv.',   predicted: 2.1,     actual: 2.8,     unit: '%',     diff: +0.7 },
  ],
};

// ─── Creator DNA ──────────────────────────────────────────────────────────────

export const CREATOR_DNA: DnaInsight[] = [
  {
    id: 'hook_style',
    label: 'Best Hook Style',
    value: 'Shocking Statistic + Knowledge Gap',
    confidence: 91,
    evidence: 'Based on 6 videos. Average 30s retention: 88.4% vs 64% baseline.',
    recommendation: 'Continue opening with a counterintuitive data point before introducing the premise.',
    trend: 'up',
    icon: 'zap',
  },
  {
    id: 'duration',
    label: 'Best Duration',
    value: '8–10 minutes',
    confidence: 84,
    evidence: '7–10min videos average 74% retention vs 61% for under 5min and 58% for over 12min.',
    recommendation: 'Target 8:30–9:45 runtime for your topic category. Trim closing segments first.',
    trend: 'flat',
    icon: 'clock',
  },
  {
    id: 'platform',
    label: 'Strongest Platform',
    value: 'YouTube Long-form',
    confidence: 88,
    evidence: 'YouTube generates 51% of total views with 68% of total watch time.',
    recommendation: 'Double down on YouTube SEO. LinkedIn is underperforming relative to audience size.',
    trend: 'up',
    icon: 'monitor',
  },
  {
    id: 'topic_category',
    label: 'Best Topic Category',
    value: 'Applied Psychology',
    confidence: 79,
    evidence: 'Psychology topics average 1.82M views vs 0.64M for business content.',
    recommendation: 'Your psychology + productivity hybrid format outperforms either category alone by 31%.',
    trend: 'up',
    icon: 'brain',
  },
  {
    id: 'audience',
    label: 'Core Audience',
    value: '25–44 Professionals',
    confidence: 86,
    evidence: '62% of watch time comes from 25–44 age group. High save rate signals bookmark-worthy content.',
    recommendation: 'Deepen professional applicability framing. Add "use this at work" angle to hooks.',
    trend: 'flat',
    icon: 'users',
  },
  {
    id: 'tone',
    label: 'Preferred Tone',
    value: 'Authoritative but Conversational',
    confidence: 77,
    evidence: 'Videos with academic evidence + casual delivery average 12% higher retention than either extreme.',
    recommendation: 'Maintain the research-backed credibility while reducing formal sentence structures in Act 2.',
    trend: 'up',
    icon: 'mic',
  },
  {
    id: 'pacing',
    label: 'Best-performing Pacing',
    value: 'Fast open → Mid slowdown → Rapid close',
    confidence: 72,
    evidence: 'Cut cadence analysis: 3.2s avg in Act 1, 6.1s in Act 2, 2.8s in Act 3 correlates with highest completion.',
    recommendation: 'Avoid uniform pacing. Introduce a deliberate slow moment at the 60% mark before the final acceleration.',
    trend: 'flat',
    icon: 'activity',
  },
  {
    id: 'thumbnail',
    label: 'Strongest Thumbnail Style',
    value: 'Face + Bold Text + Dark BG',
    confidence: 83,
    evidence: 'Face-forward thumbnails with ≤5 words of contrasting text achieve 13.8% CTR vs 8.2% for text-only.',
    recommendation: 'Add an orange or yellow accent element — color theory analysis shows it increases CTR by 2.1pp.',
    trend: 'up',
    icon: 'image',
  },
  {
    id: 'editing',
    label: 'Editing Pattern',
    value: 'Jump cuts + B-roll inserts + Zoom punches',
    confidence: 68,
    evidence: 'Pattern detected across 11 videos. Zoom punches on key stats correlate with +22% replay at those moments.',
    recommendation: 'Add more data visualisation overlays at key statistics to reinforce retention spikes.',
    trend: 'flat',
    icon: 'scissors',
  },
  {
    id: 'next_experiment',
    label: 'Recommended Next Experiment',
    value: 'Test "Story-first" hook (remove opening stat)',
    confidence: 65,
    evidence: 'Your data shows high initial curiosity but you\'ve never tested a narrative-first opening.',
    recommendation: 'Run an A/B split: keep current shocking stat format vs open cold with a personal story that leads to the same thesis.',
    trend: 'up',
    icon: 'flask',
  },
];

// ─── AI Learning Log ──────────────────────────────────────────────────────────

export const LEARNING_LOG: LearningEntry[] = [
  {
    id: 'll-001',
    timestamp: '2025-01-15T10:42:00Z',
    category: 'Hook Retention',
    prediction: 'Hook retention expected to remain above 70% through 30 seconds.',
    actual: 'Retention dropped to 58% after 18 seconds when the opening statistic was followed by a 12-second credit sequence.',
    difference: '−12pp below prediction at 18s mark',
    learning: 'Long introduction sequences immediately after a hook break curiosity tension. The pattern-completion loop opened by a statistic must be maintained for at least 45 seconds before any self-referential content.',
    nextImprovement: 'Move conflict and core tension into the first 8 seconds. Delay all credits, logos, and channel intros to the 90+ second mark.',
    applied: true,
    impact: 'high',
  },
  {
    id: 'll-002',
    timestamp: '2025-01-13T15:20:00Z',
    category: 'CTR Prediction',
    prediction: 'Thumbnail CTR predicted at 11.4% based on text + face format similarity.',
    actual: 'Actual CTR was 12.9% — exceeded prediction by 1.5pp.',
    difference: '+1.5pp above prediction',
    learning: 'The addition of a contrasting orange accent element in the thumbnail background was not modeled. Color contrast increases CTR beyond text and face composition alone.',
    nextImprovement: 'Add color-contrast variable to thumbnail prediction model. Create a thumbnail A/B test for accent color impact.',
    applied: false,
    impact: 'medium',
  },
  {
    id: 'll-003',
    timestamp: '2025-01-10T09:15:00Z',
    category: 'Platform Distribution',
    prediction: 'LinkedIn expected to generate 18% of total views based on audience overlap.',
    actual: 'LinkedIn generated only 11% of total views — 38% below prediction.',
    difference: '−7pp below prediction (38% miss)',
    learning: 'LinkedIn organic reach for video content has declined significantly since Q3 2024 algorithm update. Prediction model was trained on pre-update data.',
    nextImprovement: 'Update LinkedIn reach model with post-Q3 2024 decay coefficient. Increase LinkedIn post frequency from 1× to 3× per content piece.',
    applied: true,
    impact: 'high',
  },
  {
    id: 'll-004',
    timestamp: '2025-01-07T14:00:00Z',
    category: 'Audience Retention',
    prediction: 'Mid-video retention predicted at 68% at the 5-minute mark.',
    actual: 'Retention was 49.8% at the 5-minute mark — well below prediction.',
    difference: '−18.2pp below prediction',
    learning: 'The Act 2 structure contained 3 consecutive examples without narrative tension escalation. Audiences disengage when evidence density exceeds novelty introduction rate.',
    nextImprovement: 'Interleave counterarguments and tension escalations every 60–90 seconds throughout Act 2. Never present more than 2 supporting examples in sequence.',
    applied: false,
    impact: 'high',
  },
  {
    id: 'll-005',
    timestamp: '2025-01-03T11:30:00Z',
    category: 'Share Rate',
    prediction: 'Share rate predicted at 3.8% based on emotional resonance score.',
    actual: 'Share rate was 3.5% — slightly below but within margin.',
    difference: '−0.3pp (within 10% margin)',
    learning: 'Emotional resonance model was accurate. Share rate correlates most strongly with the final CTA framing — "share this with someone who needs it" outperforms "subscribe" by 2.4×.',
    nextImprovement: 'Standardize CTA as identity-based ("share with a fellow creator") rather than action-based ("subscribe"). Test in next 3 videos.',
    applied: true,
    impact: 'medium',
  },
  {
    id: 'll-006',
    timestamp: '2024-12-28T16:45:00Z',
    category: 'Subscriber Conversion',
    prediction: 'Subscriber conversion predicted at 2.1% of new viewers.',
    actual: 'Subscriber conversion was 2.8% — exceeded prediction by 33%.',
    difference: '+0.7pp above prediction',
    learning: 'The identity-based closing ("if this changed how you think about content…") triggered stronger conversion than modeled. The double CTA pattern (mid-video soft CTA + end CTA) was not captured in the baseline model.',
    nextImprovement: 'Add mid-video soft CTA at the 70% retention mark as standard practice. Update baseline model with double-CTA coefficient.',
    applied: true,
    impact: 'medium',
  },
];

// ─── Audience Insights ────────────────────────────────────────────────────────

export const AUDIENCE_INSIGHTS: AudienceInsights = {
  totalUniqueViewers: 1_842_000,
  returningPct: 34,
  newPct: 66,
  ageDistribution: [
    { age: '18–24', pct: 18, color: '#3B82F6' },
    { age: '25–34', pct: 34, color: '#8B5CF6' },
    { age: '35–44', pct: 28, color: '#10B981' },
    { age: '45–54', pct: 14, color: '#F59E0B' },
    { age: '55+',   pct: 6,  color: '#EF4444' },
  ],
  deviceBreakdown: [
    { device: 'Mobile',  pct: 58, color: '#8B5CF6' },
    { device: 'Desktop', pct: 28, color: '#3B82F6' },
    { device: 'Tablet',  pct: 10, color: '#10B981' },
    { device: 'TV',      pct: 4,  color: '#F59E0B' },
  ],
  geographicTop5: [
    { country: 'United States',  pct: 38, flag: '🇺🇸' },
    { country: 'United Kingdom', pct: 14, flag: '🇬🇧' },
    { country: 'Canada',         pct: 9,  flag: '🇨🇦' },
    { country: 'Australia',      pct: 7,  flag: '🇦🇺' },
    { country: 'Germany',        pct: 5,  flag: '🇩🇪' },
  ],
  trafficSources: [
    { source: 'YouTube Search',  pct: 42, color: '#FF0000' },
    { source: 'Suggested',       pct: 28, color: '#8B5CF6' },
    { source: 'External',        pct: 14, color: '#3B82F6' },
    { source: 'Direct',          pct: 10, color: '#10B981' },
    { source: 'Notifications',   pct: 6,  color: '#F59E0B' },
  ],
  platformEngagement: [
    { platform: 'YouTube',    engagement: 8.4,  color: '#FF0000' },
    { platform: 'Newsletter', engagement: 22.4, color: '#F59E0B' },
    { platform: 'Podcast',    engagement: 31.2, color: '#8B5CF6' },
    { platform: 'LinkedIn',   engagement: 11.2, color: '#0A66C2' },
    { platform: 'Instagram',  engagement: 14.8, color: '#E1306C' },
    { platform: 'X',          engagement: 6.2,  color: '#000000' },
  ],
};

// ─── AI Recommendations ───────────────────────────────────────────────────────

export const AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-001',
    title: 'Move core conflict to first 8 seconds',
    description: 'Your current hook takes 18 seconds to establish the core tension. Based on your retention data, every second of delay costs approximately 0.8% of your audience. Restructure to open on conflict, not setup.',
    relatedMetric: '30s Retention',
    expectedImpact: '+6–10pp retention at 30s',
    confidence: 89,
    priority: 'critical',
    category: 'Hook & Pacing',
    applied: false,
  },
  {
    id: 'rec-002',
    title: 'Reduce intro length below 12 seconds',
    description: 'Your average intro runs 34 seconds including credits. Intros over 20 seconds cause a measurable "patience break" for first-time viewers. Move all channel identity elements to post-hook (90+ seconds).',
    relatedMetric: 'Avg View Duration',
    expectedImpact: '+8–14% average view duration',
    confidence: 84,
    priority: 'high',
    category: 'Hook & Pacing',
    applied: false,
  },
  {
    id: 'rec-003',
    title: 'Insert a tension escalation every 90 seconds',
    description: 'Analysis of your Act 2 sections shows retention drop-off accelerates when you present 3+ consecutive examples without a counterargument or tension spike. Audiences expect new information density to remain high.',
    relatedMetric: 'Avg Retention',
    expectedImpact: '+12–18pp mid-video retention',
    confidence: 76,
    priority: 'high',
    category: 'Script Structure',
    applied: false,
  },
  {
    id: 'rec-004',
    title: 'Publish on Tuesday at 10:00 AM EST',
    description: 'Your audience peak engagement window is Tuesday–Wednesday, 9–11 AM EST. Current publication pattern misses this by an average of 6 hours, resulting in estimated 22% suppression of first-hour algorithmic boost.',
    relatedMetric: 'Peak Views/Hour',
    expectedImpact: '+18–24% first-hour views',
    confidence: 71,
    priority: 'high',
    category: 'Publishing',
    applied: true,
  },
  {
    id: 'rec-005',
    title: 'Add orange accent to thumbnail',
    description: 'Color contrast analysis shows your current thumbnails use blue/purple dominance. A warm accent color (orange or yellow) in the corner or as a text background improves visual separation in dark feed environments.',
    relatedMetric: 'CTR',
    expectedImpact: '+1.8–2.4pp CTR',
    confidence: 67,
    priority: 'medium',
    category: 'Thumbnail',
    applied: false,
  },
  {
    id: 'rec-006',
    title: 'Test narrative-first hook format',
    description: 'You have not tested a story-opening format. Your current data suggests high audience susceptibility to narrative hooks based on psychographic profiling of your core 25–44 segment. Recommend A/B split on next video.',
    relatedMetric: 'Hook Retention',
    expectedImpact: 'Unknown — requires experiment',
    confidence: 58,
    priority: 'medium',
    category: 'Experimentation',
    applied: false,
  },
  {
    id: 'rec-007',
    title: 'Add identity-based CTA at 70% watch mark',
    description: 'Your current CTA placement is at end-screen only. A soft mid-video identity CTA ("if you\'re the type of creator who wants to understand this…") at the 70% watch mark correlates with +33% subscriber conversion in similar channels.',
    relatedMetric: 'Conversions',
    expectedImpact: '+25–35% subscriber conversion',
    confidence: 82,
    priority: 'medium',
    category: 'Monetization',
    applied: true,
  },
  {
    id: 'rec-008',
    title: 'Increase storytelling tension in psychology content',
    description: 'Your psychology category outperforms all others, but emotional tension tracking shows the "revelation build" phase is consistently truncated. Extending this phase by 30–60 seconds is predicted to add 4–7pp retention.',
    relatedMetric: 'Avg Retention',
    expectedImpact: '+4–7pp overall retention',
    confidence: 73,
    priority: 'low',
    category: 'Script Structure',
    applied: false,
  },
];

// ─── Project summary ──────────────────────────────────────────────────────────

export const PERFORMANCE_PROJECT = {
  title: 'The Hidden Psychology of Viral Content',
  publishedAt: '2025-01-10T10:00:00Z',
  platform: 'YouTube',
  overallScore: 71,
  predictedScore: 82,
  lastUpdated: '2025-01-15T11:00:00Z',
};
