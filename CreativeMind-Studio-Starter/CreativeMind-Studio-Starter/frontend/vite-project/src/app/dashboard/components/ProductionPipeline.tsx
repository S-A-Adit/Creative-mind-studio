/**
 * ProductionPipeline — stage funnel with bar chart, tooltips, and project counts.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { PipelineStage } from '../hooks/useDashboardData';

const ease = [0.22, 1, 0.36, 1] as const;

interface ProductionPipelineProps {
  stages: PipelineStage[];
}

export const ProductionPipeline: React.FC<ProductionPipelineProps> = ({ stages }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const maxCount = Math.max(...stages.map((s) => s.count), 1);
  const total = stages.reduce((sum, s) => sum + s.count, 0);

  return (
    <section aria-label="Production pipeline">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
            Production Pipeline
          </h2>
          <p className="text-[12px] text-slate-500 font-mono mt-0.5">
            {total} projects across all stages
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/70 backdrop-blur-sm p-5 md:p-6">
        {/* Bar chart */}
        <div className="flex items-end gap-0.5 sm:gap-1 mb-3" style={{ height: 88 }}>
          {stages.map((stage, i) => {
            const isHovered = hovered === stage.id;
            const barH = stage.count === 0
              ? 4
              : Math.max((stage.count / maxCount) * 80, 10);

            return (
              <React.Fragment key={stage.id}>
                <div className="flex-1 relative flex flex-col justify-end">
                  {/* Count above bar */}
                  {stage.count > 0 && (
                    <span
                      className="text-center text-[10px] font-mono font-semibold mb-1 transition-colors"
                      style={{ color: isHovered ? stage.color : `${stage.color}80` }}
                    >
                      {stage.count}
                    </span>
                  )}

                  {/* Bar */}
                  <motion.button
                    type="button"
                    initial={{ height: 4, opacity: 0 }}
                    animate={{ height: barH, opacity: 1 }}
                    transition={{ duration: 0.55, delay: i * 0.05, ease }}
                    whileHover={{ scaleY: 1.04 }}
                    onHoverStart={() => setHovered(stage.id)}
                    onHoverEnd={() => setHovered(null)}
                    onFocus={() => setHovered(stage.id)}
                    onBlur={() => setHovered(null)}
                    aria-label={`${stage.label}: ${stage.count} projects`}
                    className="relative w-full rounded-t-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-colors duration-150"
                    style={{
                      backgroundColor: isHovered ? stage.color : `${stage.color}38`,
                      borderBottom: `2px solid ${stage.color}`,
                      originY: 'bottom',
                    }}
                  >
                    {/* Tooltip */}
                    <AnimatePresence>
                      {isHovered && stage.projects.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2.5 pointer-events-none"
                        >
                          <div className="bg-[#0B0B12] border border-white/[0.12] rounded-xl px-3 py-2.5 shadow-xl min-w-36 max-w-52">
                            <p
                              className="text-[10px] font-mono font-semibold uppercase tracking-widest mb-2"
                              style={{ color: stage.color }}
                            >
                              {stage.label}
                            </p>
                            {stage.projects.slice(0, 4).map((p) => (
                              <p key={p} className="text-[11px] text-slate-300 leading-snug truncate">
                                · {p}
                              </p>
                            ))}
                            {/* Arrow */}
                            <div
                              className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 border-r border-b border-white/[0.1]"
                              style={{ backgroundColor: '#0B0B12' }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Connector arrow */}
                {i < stages.length - 1 && (
                  <ChevronRight className="flex-shrink-0 w-2.5 h-2.5 text-slate-800 self-center mb-1" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Stage labels */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {stages.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div className="flex-1 text-center">
                <p
                  className="text-[8px] sm:text-[9px] md:text-[10px] font-mono uppercase tracking-wide truncate transition-colors duration-150"
                  style={{ color: hovered === stage.id ? stage.color : '#475569' }}
                >
                  {stage.label}
                </p>
              </div>
              {i < stages.length - 1 && <div className="flex-shrink-0 w-2.5 sm:w-1" />}
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-white/[0.05] flex flex-wrap gap-x-4 gap-y-1.5">
          {stages.filter((s) => s.count > 0).map((stage) => (
            <div key={stage.id} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
              <span className="text-[11px] text-slate-500 font-mono">
                {stage.label}
                <span className="ml-1 font-semibold" style={{ color: stage.color }}>
                  {stage.count}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
