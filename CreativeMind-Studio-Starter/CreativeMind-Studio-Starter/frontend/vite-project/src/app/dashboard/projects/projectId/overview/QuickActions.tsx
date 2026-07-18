/**
 * QuickActions.tsx — Quick-access action cards for the Project Overview page.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  BookOpen,
  FileText,
  Layers,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { ease } from '../../../../../lib/motion-constants';

// ─── Action definition ────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  badge?: string;
  primary?: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'strategy',
    icon: <Compass className="w-5 h-5" />,
    label: 'Strategy Room',
    description: 'Review goals, audience insights, and AI analysis',
    color: '#8B5CF6',
    primary: true,
  },
  {
    id: 'research',
    icon: <BookOpen className="w-5 h-5" />,
    label: 'Continue Research',
    description: 'Verify remaining sources and expand findings',
    color: '#06B6D4',
    badge: '4 pending',
  },
  {
    id: 'script',
    icon: <FileText className="w-5 h-5" />,
    label: 'Edit Script',
    description: 'Open Script v3 and refine with AI assistance',
    color: '#10B981',
    badge: 'v3 ready',
  },
  {
    id: 'assets',
    icon: <Layers className="w-5 h-5" />,
    label: 'Review Assets',
    description: 'Check flagged items and add missing visuals',
    color: '#F59E0B',
    badge: '1 flagged',
  },
  {
    id: 'team',
    icon: <UserPlus className="w-5 h-5" />,
    label: 'Invite Team',
    description: 'Add collaborators and assign phases',
    color: '#EC4899',
  },
];

// ─── Single action card ───────────────────────────────────────────────────────

const ActionCard: React.FC<{ action: QuickAction; index: number; onClick?: () => void }> = ({
  action,
  index,
  onClick,
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.22, delay: index * 0.05, ease: ease.snappy }}
    whileHover={{ y: -3, transition: { duration: 0.16 } }}
    whileTap={{ scale: 0.97 }}
    className={`
      group relative flex flex-col gap-3 p-4 rounded-2xl border text-left
      transition-all duration-200 overflow-hidden
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
      ${action.primary
        ? 'border-[#8B5CF6]/40 bg-[#7C3AED]/08 hover:border-[#8B5CF6]/60 hover:bg-[#7C3AED]/12'
        : 'border-white/[0.07] bg-[#10101A]/80 hover:border-white/[0.14] hover:bg-[#151521]/80'
      }
    `}
  >
    {/* Corner glow */}
    <div
      className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100
        transition-opacity duration-300 pointer-events-none rounded-tr-2xl"
      style={{ background: `radial-gradient(circle at top right, ${action.color}20 0%, transparent 70%)` }}
    />

    {/* Active accent line */}
    {action.primary && (
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)' }}
      />
    )}

    {/* Icon + badge */}
    <div className="flex items-start justify-between">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center border
          transition-all duration-200 group-hover:scale-110"
        style={{
          background: action.color + '18',
          borderColor: action.color + '30',
          color: action.color,
        }}
      >
        {action.icon}
      </div>
      {action.badge && (
        <span
          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border"
          style={{
            color: action.color,
            background: action.color + '15',
            borderColor: action.color + '28',
          }}
        >
          {action.badge}
        </span>
      )}
    </div>

    {/* Label + description */}
    <div>
      <p className={`text-[14px] font-semibold leading-tight mb-1 transition-colors duration-200
        ${action.primary ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
        {action.label}
      </p>
      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
        {action.description}
      </p>
    </div>

    {/* Arrow */}
    <div
      className="flex items-center gap-1 text-[11px] font-medium mt-auto
        opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
        transition-all duration-200"
      style={{ color: action.color }}
    >
      Open
      <ArrowRight className="w-3.5 h-3.5" />
    </div>
  </motion.button>
);

// ─── Section ─────────────────────────────────────────────────────────────────

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => (
  <section aria-label="Quick actions">
    <div className="mb-4">
      <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
        Quick Actions
      </h2>
      <p className="text-[12px] text-slate-500 font-mono mt-0.5">
        Jump to any part of your workflow
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {QUICK_ACTIONS.map((action, i) => (
        <ActionCard
          key={action.id}
          action={action}
          index={i}
          onClick={() => onActionClick?.(action.id)}
        />
      ))}
    </div>
  </section>
);
