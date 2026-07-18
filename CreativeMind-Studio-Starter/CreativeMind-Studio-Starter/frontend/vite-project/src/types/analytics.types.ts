/**
 * analytics.types.ts
 *
 * Performance workspace — KPI metrics, retention data, audience insights,
 * AI recommendations, and Creator DNA learning log.
 */

import type {
  ID, Timestamp, HexColor, TrendDir,
  Platform, TimeRange,
  Auditable, ProjectScoped,
} from './common.types';

// ─── KPI metric ───────────────────────────────────────────────────────────────

export type MetricId =
  | 'views'
  | 'impressions'
  | 'ctr'
  | 'watch_time'
  | 'avg_view_duration'
  | 'retention'
  | 'shares'
  | 'saves'
  | 'conversions'
  | 'comments'
  | 'subscribers';

export interface KpiMetric {
  readonly id:          MetricId;
  readonly label:       string;
  readonly value:       string;      // formatted display value
  readonly rawValue:    number;
  readonly unit:        string;
  readonly change:      number;      // percentage, positive = up
  readonly trend:       TrendDir;
  readonly sparkline:   readonly number[];   // 7 data points
  readonly timeRange:   TimeRange;
  readonly description: string;
  readonly platform?:   Platform;
}

// ─── Retention curve ─────────────────────────────────────────────────────────

export interface RetentionDataPoint {
  readonly second:    number;
  readonly label:     string;
  readonly predicted: number;
  readonly actual:    number;
}

// ─── Platform breakdown ───────────────────────────────────────────────────────

export interface PlatformBreakdown {
  readonly platform:    Platform;
  readonly views:       number;
  readonly engagement:  number;
  readonly ctr:         number;
  readonly shares:      number;
  readonly color:       HexColor;
}

// ─── Category performance ─────────────────────────────────────────────────────

export interface CategoryPerformance {
  readonly category:      string;
  readonly avgViews:      number;
  readonly avgRetention:  number;
  readonly avgCtr:        number;
  readonly count:         number;
  readonly color:         HexColor;
}

// ─── Audience insights ────────────────────────────────────────────────────────

export interface AudienceInsights {
  readonly totalUniqueViewers:  number;
  readonly returningPct:        number;
  readonly newPct:              number;
  readonly ageDistribution:     readonly { age: string; pct: number; color: HexColor }[];
  readonly deviceBreakdown:     readonly { device: string; pct: number; color: HexColor }[];
  readonly geographicTop5:      readonly { country: string; pct: number; flag: string }[];
  readonly trafficSources:      readonly { source: string; pct: number; color: HexColor }[];
  readonly platformEngagement:  readonly { platform: Platform; engagement: number; color: HexColor }[];
}

// ─── Analytics snapshot ───────────────────────────────────────────────────────

/** An immutable analytics snapshot captured for a project at a point in time */
export interface AnalyticsSnapshot extends ProjectScoped, Auditable {
  readonly id:              ID;
  readonly capturedAt:      Timestamp;
  readonly timeRange:       TimeRange;
  readonly kpis:            readonly KpiMetric[];
  readonly retention:       readonly RetentionDataPoint[];
  readonly platformData:    readonly PlatformBreakdown[];
  readonly categoryData:    readonly CategoryPerformance[];
  readonly audienceInsights:AudienceInsights;
}

// ─── Virality prediction comparison ──────────────────────────────────────────

/** Comparison between the Virality Twin's prediction and actual performance */
export interface ViralityPredictionComparison extends ProjectScoped {
  readonly projectTitle:           string;
  readonly predictedScore:         number;
  readonly actualScore:            number;
  readonly confidenceScore:        number;   // 0–100
  readonly predictionError:        number;
  readonly predictedDropOffSec:    number;
  readonly actualDropOffSec:       number;
  readonly aiExplanation:          string;
  readonly learningCaptured:       string;
  readonly metrics: readonly {
    readonly label:     string;
    readonly predicted: number;
    readonly actual:    number;
    readonly unit:      string;
    readonly diff:      number;
  }[];
}

// ─── AI recommendation ────────────────────────────────────────────────────────

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface AnalyticsRecommendation extends ProjectScoped {
  readonly id:              ID;
  readonly title:           string;
  readonly description:     string;
  readonly relatedMetric:   MetricId;
  readonly expectedImpact:  string;
  readonly confidence:      number;
  readonly priority:        RecommendationPriority;
  readonly category:        string;
  readonly applied:         boolean;
  readonly appliedAt?:      Timestamp;
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
  readonly id:             DnaInsightId;
  readonly label:          string;
  readonly value:          string;
  readonly confidence:     number;   // 0–100
  readonly evidence:       string;
  readonly recommendation: string;
  readonly trend:          TrendDir;
  readonly iconName:       string;
}

/** The workspace's evolving creative fingerprint derived from historical data */
export interface CreatorDNA extends Auditable {
  readonly workspaceId:   ID;
  readonly version:       number;
  readonly insights:      readonly DnaInsight[];
  readonly lastUpdatedAt: Timestamp;
  readonly dataPoints:    number;   // total videos analysed
}

// ─── AI Learning log ─────────────────────────────────────────────────────────

export type LearningImpact = 'high' | 'medium' | 'low';

/** A record of what the AI learned from prediction vs actual comparison */
export interface LearningEntry extends ProjectScoped, Auditable {
  readonly id:               ID;
  readonly category:         string;
  readonly prediction:       string;
  readonly actual:           string;
  readonly difference:       string;
  readonly learning:         string;
  readonly nextImprovement:  string;
  readonly applied:          boolean;
  readonly appliedAt?:       Timestamp;
  readonly impact:           LearningImpact;
}
