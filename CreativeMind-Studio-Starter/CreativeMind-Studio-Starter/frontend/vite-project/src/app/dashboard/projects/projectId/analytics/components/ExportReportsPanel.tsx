/**
 * ExportReportsPanel.tsx — Export and reports panel
 *
 * Provides: Export Analytics Report, Download PDF (placeholder),
 * Export CSV, Export JSON, Compare with Previous Project, Share Dashboard.
 * Unavailable actions are labelled "Coming Soon".
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileDown, Code2, Table, Share2, GitCompare,
  CheckCircle2, BarChart3,
} from 'lucide-react';
import { PERFORMANCE_PROJECT, KPI_METRICS, AI_RECOMMENDATIONS } from '../mockData';
import { ComingSoonBadge, SectionLabel } from './PerformanceShared';

// ─── Export option definitions ────────────────────────────────────────────────

interface ExportOption {
  id: string;
  label: string;
  description: string;
  Icon: React.ElementType;
  available: boolean;
  handler?: () => void;
}

// ─── Build CSV ────────────────────────────────────────────────────────────────

function buildCsv(): string {
  const rows = [
    ['Metric', 'Value', 'Change', 'Trend', 'Time Range'],
    ...KPI_METRICS.map(m => [m.label, m.value, `${m.change}%`, m.trend, m.timeRange]),
  ];
  return rows.map(r => r.join(',')).join('\n');
}

function buildJson(): string {
  return JSON.stringify(
    {
      project: PERFORMANCE_PROJECT,
      kpiMetrics: KPI_METRICS,
      recommendations: AI_RECOMMENDATIONS,
    },
    null,
    2
  );
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Export button ────────────────────────────────────────────────────────────

interface ExportBtnProps {
  option: ExportOption;
  completed: boolean;
  onExport: (id: string) => void;
}

const ExportBtn: React.FC<ExportBtnProps> = ({ option, completed, onExport }) => (
  <motion.button
    whileHover={option.available ? { x: 2 } : {}}
    whileTap={option.available ? { scale: 0.98 } : {}}
    onClick={() => option.available && onExport(option.id)}
    disabled={!option.available}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all group ${
      option.available
        ? 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15]'
        : 'border-white/[0.04] bg-transparent opacity-50 cursor-not-allowed'
    }`}
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        completed
          ? 'bg-emerald-500/15'
          : 'bg-white/[0.04] group-hover:bg-[#8B5CF6]/10'
      }`}
    >
      {completed
        ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        : <option.Icon className={`w-4 h-4 ${option.available ? 'text-slate-400 group-hover:text-[#9D6CFF]' : 'text-slate-600'}`} />
      }
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${option.available ? 'text-slate-200' : 'text-slate-600'}`}>
          {option.label}
        </span>
        {!option.available && <ComingSoonBadge />}
        {completed && (
          <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Done
          </span>
        )}
      </div>
      <p className="text-[10px] text-slate-600 mt-0.5 truncate">{option.description}</p>
    </div>
  </motion.button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ExportReportsPanel: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const slug = PERFORMANCE_PROJECT.title.toLowerCase().replace(/\s+/g, '-');

  const EXPORT_OPTIONS: ExportOption[] = [
    {
      id: 'analytics-report',
      label: 'Export Analytics Report',
      description: 'Full performance report with all KPIs, charts, and recommendations',
      Icon: BarChart3,
      available: true,
      handler: () => downloadText(buildJson(), `${slug}-analytics.json`, 'application/json'),
    },
    {
      id: 'pdf',
      label: 'Download PDF Report',
      description: 'Styled PDF document with visual charts and executive summary',
      Icon: FileDown,
      available: false,
    },
    {
      id: 'csv',
      label: 'Export CSV',
      description: 'Raw KPI data in spreadsheet-compatible CSV format',
      Icon: Table,
      available: true,
      handler: () => downloadText(buildCsv(), `${slug}-metrics.csv`, 'text/csv'),
    },
    {
      id: 'json',
      label: 'Export JSON',
      description: 'Structured JSON with all metrics, insights, and learning log',
      Icon: Code2,
      available: true,
      handler: () => downloadText(buildJson(), `${slug}-data.json`, 'application/json'),
    },
    {
      id: 'compare',
      label: 'Compare with Previous Project',
      description: 'Side-by-side analytics comparison with your last published project',
      Icon: GitCompare,
      available: false,
    },
    {
      id: 'share',
      label: 'Share Dashboard',
      description: 'Generate a shareable read-only dashboard link',
      Icon: Share2,
      available: false,
    },
  ];

  const handleExport = (id: string) => {
    const option = EXPORT_OPTIONS.find(o => o.id === id);
    if (option?.handler) option.handler();
    setCompleted(prev => new Set(prev).add(id));
    setTimeout(() => {
      setCompleted(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 3000);
  };

  const availableCount = EXPORT_OPTIONS.filter(o => o.available).length;
  const unavailableCount = EXPORT_OPTIONS.length - availableCount;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0B0B12]">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <FileDown className="w-4 h-4 text-[#9D6CFF]" />
          <h3 className="font-display font-semibold text-white text-base">Export & Reports</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Download or share your performance analytics and insights.
        </p>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
            <SectionLabel className="block mb-1">Available Now</SectionLabel>
            <span className="text-xl font-display font-bold text-white">{availableCount}</span>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
            <SectionLabel className="block mb-1">Coming Soon</SectionLabel>
            <span className="text-xl font-display font-bold text-[#9D6CFF]">{unavailableCount}</span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {EXPORT_OPTIONS.map(opt => (
          <ExportBtn
            key={opt.id}
            option={opt}
            completed={completed.has(opt.id)}
            onExport={handleExport}
          />
        ))}
      </div>
    </div>
  );
};
