/**
 * ActivityLog.tsx — Global team activity timeline
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus, UserCog, FolderOpen, Mail, FileText, Lock, Filter,
} from 'lucide-react';
import { MemberAvatar, SectionLabel } from './TeamShared';
import type { ActivityEntry } from '../types';

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CFG = {
  joined:           { Icon: UserPlus,    color: '#10B981', label: 'Joined'   },
  'role-change':    { Icon: UserCog,     color: '#8B5CF6', label: 'Role'     },
  'project-assigned':{ Icon: FolderOpen, color: '#06B6D4', label: 'Project'  },
  invitation:       { Icon: Mail,        color: '#F59E0B', label: 'Invite'   },
  content:          { Icon: FileText,    color: '#EC4899', label: 'Content'  },
  permission:       { Icon: Lock,        color: '#F97316', label: 'Perm'     },
} as const;

type ActivityType = keyof typeof TYPE_CFG;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ActivityLogProps {
  activities: ActivityEntry[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');

  const filtered = filterType === 'all'
    ? activities
    : activities.filter(a => a.type === filterType);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display font-semibold text-slate-100 text-sm tracking-wide">Activity Log</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">{filtered.length} events</p>
          </div>
          <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </span>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-1.5">
          <FilterPill active={filterType === 'all'} onClick={() => setFilterType('all')} color="#94A3B8">
            All
          </FilterPill>
          {(Object.keys(TYPE_CFG) as ActivityType[]).map(type => {
            const cfg = TYPE_CFG[type];
            return (
              <FilterPill
                key={type}
                active={filterType === type}
                onClick={() => setFilterType(type)}
                color={cfg.color}
              >
                {cfg.label}
              </FilterPill>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto py-4 px-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-slate-500">No activity found</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filtered.map((entry, i) => {
              const cfg = TYPE_CFG[entry.type as ActivityType] ?? TYPE_CFG.content;
              const Icon = cfg.Icon;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.035 }}
                  className="relative flex gap-3.5 pb-5"
                >
                  {/* Timeline line */}
                  {i < filtered.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-white/[0.05]" />
                  )}

                  {/* Icon dot */}
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center z-10"
                    style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}35` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start gap-2">
                      <MemberAvatar initials={entry.userAvatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <span className="font-semibold text-slate-100">{entry.userName}</span>
                          {' '}{entry.action}
                          {entry.target && (
                            <span className="text-brand-electric"> {entry.target}</span>
                          )}
                        </p>
                        {entry.projectName && (
                          <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
                            <FolderOpen className="w-3 h-3" />
                            {entry.projectName}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">{entry.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── FilterPill ───────────────────────────────────────────────────────────────

const FilterPill: React.FC<{
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}> = ({ active, onClick, color, children }) => (
  <button
    onClick={onClick}
    className={`text-[10px] font-mono font-medium px-2.5 py-1 rounded-full border transition-all ${
      active ? '' : 'text-slate-500 border-white/8 hover:text-slate-300 hover:border-white/15'
    }`}
    style={active ? { color, background: `${color}15`, borderColor: `${color}40` } : undefined}
  >
    {children}
  </button>
);
