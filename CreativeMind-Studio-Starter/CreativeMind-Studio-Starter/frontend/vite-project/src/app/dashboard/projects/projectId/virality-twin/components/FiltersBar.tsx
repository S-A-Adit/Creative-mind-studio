/**
 * FiltersBar.tsx — Analysis filters + run button for the Virality Twin Workspace.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Clock,
  Database,
  AlertCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import type { AnalysisFilters, Platform, ContentCategory, Region, TimeRange, DataBadge } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Option maps ──────────────────────────────────────────────────────────────

const PLATFORMS: Array<{ value: Platform; label: string }> = [
  { value: 'all',       label: 'All Platforms'  },
  { value: 'youtube',   label: 'YouTube'        },
  { value: 'instagram', label: 'Instagram'      },
  { value: 'tiktok',    label: 'TikTok'         },
  { value: 'twitter-x', label: 'X (Twitter)'    },
  { value: 'linkedin',  label: 'LinkedIn'       },
  { value: 'spotify',   label: 'Spotify'        },
];

const CATEGORIES: Array<{ value: ContentCategory; label: string }> = [
  { value: 'all',           label: 'All Categories' },
  { value: 'documentary',   label: 'Documentary'    },
  { value: 'explainer',     label: 'Explainer'      },
  { value: 'story',         label: 'Story'          },
  { value: 'tutorial',      label: 'Tutorial'       },
  { value: 'interview',     label: 'Interview'      },
  { value: 'news',          label: 'News'           },
  { value: 'advertisement', label: 'Advertisement'  },
  { value: 'entertainment', label: 'Entertainment'  },
];

const REGIONS: Array<{ value: Region; label: string }> = [
  { value: 'global', label: 'Global'     },
  { value: 'us',     label: 'US'         },
  { value: 'eu',     label: 'Europe'     },
  { value: 'mena',   label: 'MENA'       },
  { value: 'apac',   label: 'Asia-Pacific'},
  { value: 'latam',  label: 'Latin America'},
];

const TIME_RANGES: Array<{ value: TimeRange; label: string }> = [
  { value: '7d',       label: 'Last 7 days'    },
  { value: '30d',      label: 'Last 30 days'   },
  { value: '90d',      label: 'Last 90 days'   },
  { value: '1y',       label: 'Last 1 year'    },
  { value: '3y',       label: 'Last 3 years'   },
  { value: 'all-time', label: 'All time'       },
];

const BADGE_CFG: Record<DataBadge, { label: string; cls: string }> = {
  curated:   { label: 'Curated Dataset',  cls: 'text-violet-400 bg-violet-500/10 border-violet-500/25' },
  cached:    { label: 'Cached Data',      cls: 'text-amber-400  bg-amber-500/10  border-amber-500/25'  },
  simulated: { label: 'Simulated Data',   cls: 'text-orange-400 bg-orange-500/10 border-orange-500/25' },
};

// ─── Filter select ────────────────────────────────────────────────────────────

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className="w-full h-8 pl-2.5 pr-7 rounded-[8px] bg-[#0B0B12] border border-white/[0.09]
            text-[12px] text-slate-200 font-sans appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 focus:border-[#8B5CF6]/60
            transition-all duration-200 hover:border-white/[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} className="bg-[#0B0B12]">
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FiltersBarProps {
  filters: AnalysisFilters;
  onFiltersChange: (f: Partial<AnalysisFilters>) => void;
  onRunAnalysis: () => void;
  isRunning: boolean;
  lastAnalysisAt: Date;
  datasetCount: number;
  dataBadge: DataBadge;
}

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFiltersChange,
  onRunAnalysis,
  isRunning,
  lastAnalysisAt,
  datasetCount,
  dataBadge,
}) => {
  const badge = BADGE_CFG[dataBadge];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="flex flex-wrap items-end gap-3 p-4 rounded-2xl border border-white/[0.07]
        bg-[#10101A]/80 backdrop-blur-sm"
    >
      {/* Filters row */}
      <FilterSelect
        label="Platform"
        value={filters.platform}
        options={PLATFORMS}
        onChange={v => onFiltersChange({ platform: v })}
      />
      <FilterSelect
        label="Category"
        value={filters.category}
        options={CATEGORIES}
        onChange={v => onFiltersChange({ category: v })}
      />
      <FilterSelect
        label="Region"
        value={filters.region}
        options={REGIONS}
        onChange={v => onFiltersChange({ region: v })}
      />
      <FilterSelect
        label="Time Range"
        value={filters.timeRange}
        options={TIME_RANGES}
        onChange={v => onFiltersChange({ timeRange: v })}
      />

      {/* Divider */}
      <div className="hidden sm:block w-px h-8 bg-white/[0.07] self-end" />

      {/* Meta info */}
      <div className="flex items-center gap-3 flex-wrap self-end pb-0.5">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600">
          <Clock className="w-3 h-3" />
          <span>Last run: <span className="text-slate-400">{timeAgo(lastAnalysisAt)}</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600">
          <Database className="w-3 h-3" />
          <span><span className="text-slate-400">{datasetCount.toLocaleString()}</span> samples</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${badge.cls}`}>
          {dataBadge === 'simulated' && <AlertCircle className="w-3 h-3" />}
          {badge.label}
        </span>
      </div>

      {/* Run button — pushed right */}
      <div className="ml-auto self-end">
        <motion.button
          type="button"
          onClick={onRunAnalysis}
          disabled={isRunning}
          whileHover={{ scale: isRunning ? 1 : 1.03 }}
          whileTap={{ scale: isRunning ? 1 : 0.97 }}
          transition={{ duration: 0.15 }}
          className="relative inline-flex items-center gap-2 px-5 py-2 rounded-[10px]
            text-[13px] font-semibold text-white overflow-hidden
            bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]
            border border-[#8B5CF6]/30
            shadow-[0_4px_16px_rgba(124,58,237,0.3)]
            hover:shadow-[0_4px_22px_rgba(139,92,246,0.45)]
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1.5 }}
          />
          {isRunning
            ? <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10" />
            : <Play className="w-3.5 h-3.5 relative z-10" />
          }
          <span className="relative z-10">{isRunning ? 'Analysing…' : 'Run Twin Analysis'}</span>
          {!isRunning && <ChevronDown className="w-3 h-3 rotate-[-90deg] relative z-10 opacity-60" />}
        </motion.button>
      </div>
    </motion.div>
  );
};
