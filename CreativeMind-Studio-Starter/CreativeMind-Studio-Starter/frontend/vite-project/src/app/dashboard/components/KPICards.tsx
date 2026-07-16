/**
 * KpiCards — six animated top-level statistic cards.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, Clock, CheckSquare, ShieldCheck,
  Image, Send, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import type { KpiCard } from '../hooks/useDashboardData';

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  FolderOpen:   <FolderOpen className="w-5 h-5" />,
  Clock:        <Clock className="w-5 h-5" />,
  CheckSquare:  <CheckSquare className="w-5 h-5" />,
  ShieldCheck:  <ShieldCheck className="w-5 h-5" />,
  Image:        <Image className="w-5 h-5" />,
  Send:         <Send className="w-5 h-5" />,
};

// ─── Single KPI card ──────────────────────────────────────────────────────────

const KpiCardItem: React.FC<{ card: KpiCard; index: number }> = ({ card, index }) => {
  const count = useCountUp(card.value, 800 + index * 80);

  const trendPositive = card.trend > 0;
  const trendNeutral = card.trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-white/[0.07]
        bg-[#10101A]/70 backdrop-blur-sm hover:border-white/[0.13]
        hover:bg-[#151521]/80 transition-colors duration-200 overflow-hidden"
    >
      {/* Corner glow on hover */}
      <div
        className="absolute top-0 right-0 w-28 h-28 opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none rounded-tr-2xl"
        style={{ background: `radial-gradient(circle at top right, ${card.color}18 0%, transparent 70%)` }}
      />

      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border
            transition-all duration-200 group-hover:scale-110"
          style={{
            backgroundColor: `${card.color}15`,
            borderColor: `${card.color}28`,
            color: card.color,
          }}
        >
          {ICON_MAP[card.iconName]}
        </div>

        {/* Trend chip */}
        <div
          className={`flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
            trendNeutral
              ? 'text-slate-500 bg-slate-800/40 border-slate-700/40'
              : trendPositive
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
          }`}
        >
          {trendNeutral ? (
            <Minus className="w-3 h-3" />
          ) : trendPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trendNeutral ? '—' : `${trendPositive ? '+' : ''}${card.trend}%`}
        </div>
      </div>

      {/* Value */}
      <div>
        <div className="flex items-end gap-1.5 mb-1">
          <span className="font-display font-bold text-3xl text-white tracking-tight tabular-nums">
            {count.toLocaleString()}
          </span>
          {card.unit && (
            <span className="text-slate-500 text-sm mb-0.5 font-mono">{card.unit}</span>
          )}
        </div>
        <p className="text-[12px] font-semibold text-slate-300 font-sans leading-tight">
          {card.label}
        </p>
      </div>

      {/* Description + trend label */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-1">
          {card.description}
        </p>
        <span className="text-[10px] text-slate-700 font-mono whitespace-nowrap ml-2">
          {card.trendLabel}
        </span>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)` }}
      />
    </motion.div>
  );
};

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface KpiCardsProps {
  cards: KpiCard[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ cards }) => (
  <section aria-label="Key performance indicators">
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <KpiCardItem key={card.id} card={card} index={i} />
      ))}
    </div>
  </section>
);
