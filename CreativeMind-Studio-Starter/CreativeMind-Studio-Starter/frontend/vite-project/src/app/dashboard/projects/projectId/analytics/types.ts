/**
 * types.ts — Performance & Creator DNA Workspace type definitions
 */

// ─── KPI Metrics ─────────────────────────────────────────────────────────────

export type MetricId =
  | 'views'
  | 'impressions'
  | 'ctr'
  | 'watch_time'
  | 'avg_view_duration'
  | 'retention'
  | 'shares'
  | 'saves'
  | 'conversions';

export type TrendDirection = 'up' | 'down' | 'flat';

export interface KpiMetric {
  id: MetricId;
  label: string;
  value: string;
  rawValue: number;
  unit: string;
  change: number; // percentage, positive = up
  trend: TrendDirection;
  sparkline: number[]; // 7 data points
  timeRange: string;
  description: string;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

export interface RetentionDataPoint {
  second: number;
  label: string;
  predicted: number;
  actual: number;
}

export interface CtrDataPoint {
  date: string;
  ctr: number;
  impressions: number;
}

export interface PlatformDataPoint {
  platform: string;
  views: number;
  engagement: number;
  ctr: number;
  shares: number;
}

export interface CategoryDataPoint {
  category: string;
  avgViews: number;
  avgRetention: number;
  avgCtr: number;
  count: number;
}

export interface HookDataPoint {
  hookStyle: string;
  avgRetention30s: number;
  avgCtr: number;
  samples: number;
}

export interface AudienceSegmentPoint {
  age: string;
  percentage: number;
  avgWatchTime: number;
}

// ─── Virality Twin Comparison ─────────────────────────────────────────────────

export interface ViralityTwinComparison {
  projectTitle: string;
  predictedScore: number;
  actualScore: number;
  confidenceScore: number; // 0–100
  predictionError: number; // absolute points
  predictedDropOffPoint: number; // seconds
  actualDropOffPoint: number;
  aiExplanation: string;
  learningCaptured: string;
  metrics: Array<{
    label: string;
    predicted: number;
    actual: number;
    unit: string;
    diff: number;
  }>;
}

// ─── Creator DNA ─────────────────────────────────────────────────────────────

export type DnaInsightId =
  | 'hook_style'
  | 'duration'
  | 'platform'
  | 'topic_category'
  | 'audience'
  | 'tone'
  | 'pacing'
  | 'thumbnail'
  | 'editing'
  | 'next_experiment';

export interface DnaInsight {
  id: DnaInsightId;
  label: string;
  value: string;
  confidence: number; // 0–100
  evidence: string;
  recommendation: string;
  trend: TrendDirection;
  icon: string;
}

// ─── AI Learning Log ──────────────────────────────────────────────────────────

export interface LearningEntry {
  id: string;
  timestamp: string;
  category: string;
  prediction: string;
  actual: string;
  difference: string;
  learning: string;
  nextImprovement: string;
  applied: boolean;
  impact: 'high' | 'medium' | 'low';
}

// ─── Audience Insights ────────────────────────────────────────────────────────

export interface AudienceInsights {
  totalUniqueViewers: number;
  returningPct: number;
  newPct: number;
  ageDistribution: Array<{ age: string; pct: number; color: string }>;
  deviceBreakdown: Array<{ device: string; pct: number; color: string }>;
  geographicTop5: Array<{ country: string; pct: number; flag: string }>;
  trafficSources: Array<{ source: string; pct: number; color: string }>;
  platformEngagement: Array<{ platform: string; engagement: number; color: string }>;
}

// ─── AI Recommendation ────────────────────────────────────────────────────────

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  relatedMetric: string;
  expectedImpact: string;
  confidence: number;
  priority: RecommendationPriority;
  category: string;
  applied: boolean;
}

// ─── Time Range ───────────────────────────────────────────────────────────────

export type TimeRange = '7d' | '30d' | '90d' | 'all';
