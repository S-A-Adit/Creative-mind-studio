/**
 * ComparisonTable.tsx — Side-by-side metric comparison table for the Virality Twin.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, Minus, AlertTriangle, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { ComparisonMetric, MetricStatus } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<MetricStatus, {
  icon: React.ReactNode;
  cellClass: string;
  dot: string;
}> = {
  'better':           { icon: <CheckCircle2 className="w-3 h-3" />,  cellClass: 'text-emerald-400', dot: 'bg-emerald-500' },
  'similar':          { icon: <Minus className="w-3 h-3" />,         cellClass: 'text-blue-400',    dot: 'bg-blue-500'    },
  'needs-improvement':{ icon: <AlertTriangle className="w-3 h-3" />, cellClass: 'text-amber-400',   dot: 'bg-amber-500'   },
  'n/a':              { icon: <Minus className="w-3 h-3" />,         cellClass: 'text-slate-600',   dot: 'bg-slate-700'   },
};

const CATEGORY_LABELS: Record<string, string> = {
  hook: 'Hook',
  structure: 'Structure',
  production: 'Production',
  performance: 'Performance',
};

// ─── Cell ─────────────────────────────────────────────────────────────────────

const MetricCell: React.FC<{ value: string; status: MetricStatus }> = ({ value, status }) => {
  const cfg = STATUS_CFG[status];
  return (
    <td className="py-3 px-3 min-w-[130px]">
      <div className="flex items-start gap-2">
        <span className={`flex-shrink-0 mt-0.5 ${cfg.cellClass}`}>{cfg.icon}</span>
        <span className={`text-[12px] leading-snug ${cfg.cellClass}`}>{value}</span>
      </div>
    </td>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ComparisonTableProps {
  metrics: ComparisonMetric[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ metrics }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['hook', 'structure', 'performance', 'production'])
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const categories = ['hook', 'structure', 'production', 'performance'];

  return (
    <section aria-label="Metric comparison table">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
            Structural Comparison
          </h2>
          <p className="text-[12px] text-slate-500 font-mono mt-0.5">
            {metrics.length} metrics · side-by-side analysis
          </p>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3">
          {Object.entries(STATUS_CFG).filter(([k]) => k !== 'n/a').map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className={`text-[10px] font-mono capitalize ${cfg.cellClass}`}>
                {key === 'needs-improvement' ? 'Needs Work' : key === 'better' ? 'Better' : 'Similar'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/80 backdrop-blur-sm overflow-hidden">
        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]" role="table">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left py-3 px-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest font-semibold w-[140px]">
                  Metric
                </th>
                <th className="text-left py-3 px-3 text-[10px] font-mono text-[#9D6CFF] uppercase tracking-widest font-semibold bg-[#7C3AED]/04">
                  Your Concept
                </th>
                <th className="text-left py-3 px-3 text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  Successful Twin
                </th>
                <th className="text-left py-3 px-3 text-[10px] font-mono text-red-400 uppercase tracking-widest font-semibold">
                  Failed Twin
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map(cat => {
                const catMetrics = metrics.filter(m => m.category === cat);
                const isExpanded = expandedCategories.has(cat);
                return (
                  <React.Fragment key={cat}>
                    {/* Category header row */}
                    <tr
                      className="cursor-pointer hover:bg-white/[0.03] transition-colors duration-150"
                      onClick={() => toggleCategory(cat)}
                      role="button"
                      aria-expanded={isExpanded}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && toggleCategory(cat)}
                    >
                      <td colSpan={4} className="py-2.5 px-4 border-t border-white/[0.04]">
                        <div className="flex items-center gap-2">
                          {isExpanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
                            : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                          }
                          <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                            {CATEGORY_LABELS[cat]}
                          </span>
                          <span className="text-[10px] text-slate-700 font-mono">
                            ({catMetrics.length})
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Metric rows */}
                    {isExpanded && catMetrics.map((metric, i) => (
                      <motion.tr
                        key={metric.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: i * 0.03, ease: EASE }}
                        className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150"
                      >
                        <td className="py-3 px-4">
                          <span className="text-[12px] font-medium text-slate-400">{metric.label}</span>
                        </td>
                        <MetricCell value={metric.concept} status={metric.conceptStatus} />
                        <MetricCell value={metric.success} status={metric.successStatus} />
                        <MetricCell value={metric.failure} status={metric.failureStatus} />
                      </motion.tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
