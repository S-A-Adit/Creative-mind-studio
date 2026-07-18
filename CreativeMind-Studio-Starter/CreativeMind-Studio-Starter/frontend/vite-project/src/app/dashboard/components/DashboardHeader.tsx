/**
 * DashboardHeader — greeting, date, and workspace context row.
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Building2 } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  workspaceName: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  workspaceName,
}) => {
  const greeting = useMemo(() => getGreeting(), []);
  const date = useMemo(() => formatDate(), []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      {/* Left: greeting */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
          {greeting},{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #9D6CFF 60%, #6366F1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {userName}
          </span>
          .
        </h1>
        <p className="text-slate-400 text-[14px] mt-1 leading-relaxed">
          Here is what your creative team is working on.
        </p>
      </motion.div>

      {/* Right: meta badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08, ease }}
        className="flex flex-wrap items-center gap-2"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[12px] text-slate-400 font-mono">
          <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
          {date}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[12px] text-[#9D6CFF] font-mono">
          <Building2 className="w-3.5 h-3.5" />
          {workspaceName}
        </span>
      </motion.div>
    </div>
  );
};
