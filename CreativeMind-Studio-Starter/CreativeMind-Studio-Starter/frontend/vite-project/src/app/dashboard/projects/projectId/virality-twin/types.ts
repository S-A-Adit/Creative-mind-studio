/**
 * types.ts — All TypeScript types for the Virality Twin Workspace.
 */

// ─── Filter options ───────────────────────────────────────────────────────────

export type Platform =
  | 'youtube' | 'instagram' | 'tiktok' | 'twitter-x'
  | 'linkedin' | 'spotify' | 'website' | 'all';

export type ContentCategory =
  | 'documentary' | 'explainer' | 'story' | 'tutorial'
  | 'interview' | 'news' | 'advertisement' | 'entertainment' | 'all';

export type Region = 'global' | 'us' | 'eu' | 'mena' | 'apac' | 'latam';

export type TimeRange = '7d' | '30d' | '90d' | '1y' | '3y' | 'all-time';

export interface AnalysisFilters {
  platform: Platform;
  category: ContentCategory;
  region: Region;
  timeRange: TimeRange;
}

// ─── Content card ─────────────────────────────────────────────────────────────

export type CardType = 'concept' | 'success' | 'failure';

export type SuccessLevel =
  | 'viral'           // >10M views or 5× avg engagement
  | 'high'            // 2–10M or 2–5× avg
  | 'average'
  | 'underperformed'
  | 'failed';

export interface ContentCard {
  id: string;
  type: CardType;
  title: string;
  thumbnailGradient: string;
  platform: Platform;
  category: ContentCategory;
  duration: string;
  publishDate: string;
  audienceType: string;
  successLevel: SuccessLevel;
  views?: string;
  engagementRate?: number;
  channel?: string;
}

// ─── Comparison metric ────────────────────────────────────────────────────────

export type MetricStatus = 'better' | 'similar' | 'needs-improvement' | 'n/a';

export interface ComparisonMetric {
  id: string;
  label: string;
  category: 'hook' | 'structure' | 'performance' | 'production';
  concept: string;
  success: string;
  failure: string;
  conceptStatus: MetricStatus;
  successStatus: MetricStatus;
  failureStatus: MetricStatus;
}

// ─── Retention chart ──────────────────────────────────────────────────────────

export interface RetentionDataPoint {
  second: number;
  label: string;
  concept: number;
  success: number;
  failure: number;
}

// ─── DNA radar ───────────────────────────────────────────────────────────────

export interface RadarDataPoint {
  metric: string;
  concept: number;
  success: number;
  failure: number;
  fullMark: number;
}

// ─── Insight ──────────────────────────────────────────────────────────────────

export type InsightCategory =
  | 'shared-strength' | 'missing-element' | 'risk-pattern' | 'adjustment';

export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';

export interface InsightItem {
  id: string;
  category: InsightCategory;
  priority: InsightPriority;
  title: string;
  description: string;
  expectedImpact: string;
  agent: { name: string; initials: string; color: string };
}

// ─── Confidence panel ─────────────────────────────────────────────────────────

export type DataBadge = 'curated' | 'cached' | 'simulated';

export interface ConfidenceData {
  similarityScore: number;
  successConfidence: number;
  predictionConfidence: number;
  datasetSize: number;
  analysisTimestamp: Date;
  datasetSource: string;
  dataBadge: DataBadge;
  note: string;
}

// ─── Right panel items ────────────────────────────────────────────────────────

export interface OpportunityItem {
  id: string;
  label: string;
  detail: string;
  impact: string;
}

export interface RiskItem {
  id: string;
  label: string;
  detail: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface QuickWin {
  id: string;
  action: string;
  effort: 'low' | 'medium' | 'high';
  gain: string;
}

export interface RightInsightData {
  opportunities: OpportunityItem[];
  risks: RiskItem[];
  quickWins: QuickWin[];
  recommendedNextStep: string;
}

// ─── Root page data ───────────────────────────────────────────────────────────

export interface ViralityTwinData {
  filters: AnalysisFilters;
  lastAnalysisAt: Date;
  datasetBadge: DataBadge;
  datasetCount: number;
  conceptCard: ContentCard;
  successCard: ContentCard;
  failureCard: ContentCard;
  metrics: ComparisonMetric[];
  retentionData: RetentionDataPoint[];
  radarData: RadarDataPoint[];
  insights: InsightItem[];
  confidence: ConfidenceData;
  rightPanel: RightInsightData;
}
