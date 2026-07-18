/**
 * virality.types.ts
 *
 * Virality Twin workspace — content benchmarking, DNA radar,
 * retention modelling, and AI insight analysis.
 */

import type {
  ID, Timestamp, HexColor, TrendDir,
  Platform, ContentType, Priority,
  ProjectScoped, Auditable,
} from './common.types';
import type { ActorRef } from './common.types';

// ─── Filter options ───────────────────────────────────────────────────────────

export type AnalysisRegion = 'global' | 'us' | 'eu' | 'mena' | 'apac' | 'latam';

export interface ViralityFilters {
  readonly platform:   Platform | 'all';
  readonly category:   ContentType | 'all';
  readonly region:     AnalysisRegion;
  readonly timeRange:  string;
}

// ─── Content card ─────────────────────────────────────────────────────────────

export type ContentCardType = 'concept' | 'success' | 'failure';

export type SuccessLevel =
  | 'viral'
  | 'high'
  | 'average'
  | 'underperformed'
  | 'failed';

/** A benchmarked content piece used in the comparison view */
export interface ViralityContentCard {
  readonly id:               ID;
  readonly type:             ContentCardType;
  readonly title:            string;
  readonly thumbnailGradient:string;
  readonly platform:         Platform;
  readonly contentType:      ContentType;
  readonly duration:         string;
  readonly publishedAt:      Timestamp;
  readonly audienceType:     string;
  readonly successLevel:     SuccessLevel;
  readonly views?:           string;
  readonly engagementRate?:  number;
  readonly channel?:         string;
}

// ─── Comparison metrics ───────────────────────────────────────────────────────

export type MetricStatus = 'better' | 'similar' | 'needs-improvement' | 'n/a';

export type MetricCategory = 'hook' | 'structure' | 'performance' | 'production';

export interface ComparisonMetric {
  readonly id:             ID;
  readonly label:          string;
  readonly category:       MetricCategory;
  readonly concept:        string;
  readonly success:        string;
  readonly failure:        string;
  readonly conceptStatus:  MetricStatus;
  readonly successStatus:  MetricStatus;
  readonly failureStatus:  MetricStatus;
}

// ─── Chart data ───────────────────────────────────────────────────────────────

export interface RetentionDataPoint {
  readonly second:  number;
  readonly label:   string;
  readonly concept: number;
  readonly success: number;
  readonly failure: number;
}

export interface RadarDataPoint {
  readonly metric:   string;
  readonly concept:  number;
  readonly success:  number;
  readonly failure:  number;
  readonly fullMark: number;
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export type InsightCategory =
  | 'shared-strength'
  | 'missing-element'
  | 'risk-pattern'
  | 'adjustment';

export interface ViralityInsight {
  readonly id:             ID;
  readonly category:       InsightCategory;
  readonly priority:       Priority;
  readonly title:          string;
  readonly description:    string;
  readonly expectedImpact: string;
  readonly agent:          ActorRef;
}

// ─── Confidence & data provenance ────────────────────────────────────────────

export type DataBadge = 'curated' | 'cached' | 'simulated';

export interface ViralityConfidence {
  readonly similarityScore:      number;   // 0–100
  readonly successConfidence:    number;
  readonly predictionConfidence: number;
  readonly datasetSize:          number;
  readonly analysisAt:           Timestamp;
  readonly datasetSource:        string;
  readonly dataBadge:            DataBadge;
  readonly note:                 string;
}

// ─── Quick wins ───────────────────────────────────────────────────────────────

export type EffortLevel = 'low' | 'medium' | 'high';

export interface QuickWin {
  readonly id:     ID;
  readonly action: string;
  readonly effort: EffortLevel;
  readonly gain:   string;
}

// ─── Right panel ─────────────────────────────────────────────────────────────

export interface ViralityRightPanel {
  readonly opportunities:      readonly { id: ID; label: string; detail: string; impact: string }[];
  readonly risks:              readonly { id: ID; label: string; detail: string; severity: Priority }[];
  readonly quickWins:          readonly QuickWin[];
  readonly recommendedNextStep:string;
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

export interface CreatorDNA extends ProjectScoped, Auditable {
  readonly id:       ID;
  readonly insights: readonly DnaInsight[];
  readonly version:  number;
}

export interface DnaInsight {
  readonly id:              DnaInsightId;
  readonly label:           string;
  readonly value:           string;
  readonly confidence:      number;   // 0–100
  readonly evidence:        string;
  readonly recommendation:  string;
  readonly trend:           TrendDir;
  readonly iconName:        string;
}

// ─── Root analysis data ───────────────────────────────────────────────────────

/** Full Virality Twin analysis snapshot */
export interface ViralityTwinSnapshot extends ProjectScoped, Auditable {
  readonly id:             ID;
  readonly filters:        ViralityFilters;
  readonly dataBadge:      DataBadge;
  readonly datasetCount:   number;
  readonly conceptCard:    ViralityContentCard;
  readonly successCard:    ViralityContentCard;
  readonly failureCard:    ViralityContentCard;
  readonly metrics:        readonly ComparisonMetric[];
  readonly retentionData:  readonly RetentionDataPoint[];
  readonly radarData:      readonly RadarDataPoint[];
  readonly insights:       readonly ViralityInsight[];
  readonly confidence:     ViralityConfidence;
  readonly rightPanel:     ViralityRightPanel;
}
