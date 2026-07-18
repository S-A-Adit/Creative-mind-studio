/**
 * UpcomingDeadlines — compact deadline list with priority badges and relative dates.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, AlertCircle, Clock, Minus, ArrowRight } from 'lucide-react';
import type { Deadline, Priority } from '../hooks/useDashboardData';

const ease = [0.22, 1, 0.36, 1] as const;

const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  color: string;
  Icon: React.FC<{ className?: string }>;
}> = {
  critical: { label: 'Critical', color: '#EF4444', Icon: AlertCircle },
  high:     { label: 'High',     color: '#F59E0B', Icon: AlertCircle },
  medium:   { label: 'Medium',   color: '#3B82F6', Icon: Clock },
  low:      { label: 'Low',      color: '#475569', Icon: Minus },
};

function formatDue(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / 86_400_000);
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function urgencyBg(date: Date): string {
  const diffDays = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
  if (diffDays <= 1) return 'bg-red-500/06 border-red-500/15';
  if (diffDays <= 3) return 'bg-amber-500/06 border-amber-500/12';
  return 'bg-white/[0.015] border-white/[0.06]';
}

const DeadlineRow: React.FC<{ item: Deadline; index: number }> = ({ item, index }) => {
  const cfg = PRIORITY_CONFIG[item.priority];
  const { Icon } = cfg;
  const dueLabel = formatDue(item.dueDate);
  const rowBg = urgencyBg(item.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05, ease }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${rowBg} hover:bg-white/[0.03] transition-colors duration-150 group`}
    >
      {/* Priority icon */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border"
        style={{
          backgroundColor: `${cfg.color}12`,
          borderColor: `${cfg.color}25`,
          color: cfg.color,
        }}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-white truncate leading-tight">
          {item.title}
        </p>
        <p className="text-[10px] text-slate-600 font-mono truncate mt-0.5">
          {item.project} · {item.stage}
        </p>
      </div>

      {/* Due date */}
      <div className="flex-shrink-0 text-right">
        <span
          className="text-[11px] font-mono font-semibold"
          style={{ color: cfg.color }}
        >
          {dueLabel}
        </span>
        <p className="text-[9px] text-slate-700 font-mono mt-0.5">
          {item.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
    </motion.div>
  );
};

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ deadlines }) => {
  const critical = deadlines.filter((d) => d.priority === 'critical' || d.priority === 'high');

  return (
    <section aria-label="Upcoming deadlines">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
            Upcoming Deadlines
          </h2>
          <p className="text-[12px] text-slate-500 font-mono mt-0.5">
            {critical.length} high-priority items
          </p>
        </div>
        {critical.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-3 h-3" />
            {critical.length} urgent
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/70 backdrop-blur-sm p-4 md:p-5">
        {/* Calendar mini-header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.05]">
          <CalendarClock className="w-4 h-4 text-[#7C3AED]" />
          <span className="text-[12px] font-mono text-slate-400">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Deadline list */}
        <div className="space-y-2">
          {deadlines.map((item, i) => (
            <DeadlineRow key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Footer CTA */}
        <button
          type="button"
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/[0.06] text-[12px] text-slate-500 hover:text-slate-300 hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-200"
        >
          View full calendar
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
