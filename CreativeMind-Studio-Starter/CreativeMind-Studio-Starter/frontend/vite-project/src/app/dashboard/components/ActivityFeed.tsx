/**
 * ActivityFeed — live activity stream with human/AI differentiation.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ArrowRight } from 'lucide-react';
import type { ActivityItem } from '../hooks/useDashboardData';

const ease = [0.22, 1, 0.36, 1] as const;

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const CATEGORY_COLORS: Record<ActivityItem['category'], string> = {
  research: '#6366F1',
  strategy: '#7C3AED',
  asset: '#EF4444',
  review: '#10B981',
  publish: '#EC4899',
  ai: '#8B5CF6',
};

const ActivityRow: React.FC<{ item: ActivityItem; index: number }> = ({ item, index }) => {
  const catColor = CATEGORY_COLORS[item.category];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease }}
      className="group flex items-start gap-3 py-3 px-2 -mx-2 rounded-xl hover:bg-white/[0.025] transition-colors duration-150"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold font-mono border"
          style={{
            background: `linear-gradient(135deg, ${item.actorColor}25, ${item.actorColor}10)`,
            borderColor: `${item.actorColor}${item.actorType === 'ai' ? '45' : '28'}`,
            borderStyle: item.actorType === 'ai' ? 'dashed' : 'solid',
            color: item.actorColor,
          }}
        >
          {item.actorType === 'ai' ? (
            <Bot className="w-3.5 h-3.5" />
          ) : (
            item.actorInitials
          )}
        </div>
        {/* AI micro badge */}
        {item.actorType === 'ai' && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#0B0B12] flex items-center justify-center"
            style={{ backgroundColor: catColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug">
          <span className="font-semibold text-white">{item.actor}</span>{' '}
          <span className="text-slate-400">{item.action}</span>{' '}
          <span className="text-[#9D6CFF] font-medium">{item.target}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-slate-600 font-mono">{timeAgo(item.timestamp)}</span>
          {item.actorType === 'ai' && (
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border"
              style={{
                color: catColor,
                backgroundColor: `${catColor}12`,
                borderColor: `${catColor}25`,
              }}
            >
              AI
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface ActivityFeedProps {
  items: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => (
  <section aria-label="Recent activity">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
          Recent Activity
        </h2>
        <p className="text-[12px] text-slate-500 font-mono mt-0.5">Across all projects</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] text-emerald-400 font-mono">Live</span>
      </div>
    </div>

    <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/70 backdrop-blur-sm p-4 md:p-5">
      <AnimatePresence initial={false}>
        <div className="divide-y divide-white/[0.04]">
          {items.map((item, i) => (
            <ActivityRow key={item.id} item={item} index={i} />
          ))}
        </div>
      </AnimatePresence>

      <button
        type="button"
        className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/[0.06] text-[12px] text-slate-500 hover:text-slate-300 hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-200"
      >
        Load more activity
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </section>
);
