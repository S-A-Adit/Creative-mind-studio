/**
 * CenterPanel.tsx — Team Members list with search, filter, and sort
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, ChevronDown,
  Briefcase, Clock, ArrowUpDown, Users,
} from 'lucide-react';
import { MemberAvatar, RoleBadge, StatusDot, WorkloadBar } from './TeamShared';
import { ROLE_CONFIG } from './roleUtils';
import type { TeamMember, TeamFilters, WorkspaceRole, OnlineStatus, SortField } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CenterPanelProps {
  members: TeamMember[];
  selectedId: string | null;
  onSelect: (member: TeamMember) => void;
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

const ROLE_OPTIONS: Array<{ value: WorkspaceRole | 'all'; label: string }> = [
  { value: 'all', label: 'All Roles' },
  ...Object.entries(ROLE_CONFIG).map(([k, v]) => ({ value: k as WorkspaceRole, label: v.label })),
];

const STATUS_OPTIONS: Array<{ value: OnlineStatus | 'all'; label: string }> = [
  { value: 'all',     label: 'All Status' },
  { value: 'online',  label: 'Online'     },
  { value: 'away',    label: 'Away'       },
  { value: 'busy',    label: 'Busy'       },
  { value: 'offline', label: 'Offline'    },
];

const SORT_OPTIONS: Array<{ value: SortField; label: string }> = [
  { value: 'name',         label: 'Name'         },
  { value: 'role',         label: 'Role'         },
  { value: 'lastActivity', label: 'Last Active'  },
  { value: 'workload',     label: 'Workload'     },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const CenterPanel: React.FC<CenterPanelProps> = ({
  members, selectedId, onSelect,
}) => {
  const [filters, setFilters] = useState<TeamFilters>({
    search: '',
    role: 'all',
    status: 'all',
    sortField: 'name',
    sortDir: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...members];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        ROLE_CONFIG[m.role].label.toLowerCase().includes(q),
      );
    }
    if (filters.role !== 'all') {
      list = list.filter(m => m.role === filters.role);
    }
    if (filters.status !== 'all') {
      list = list.filter(m => m.onlineStatus === filters.status);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (filters.sortField === 'name')         cmp = a.name.localeCompare(b.name);
      if (filters.sortField === 'role')         cmp = a.role.localeCompare(b.role);
      if (filters.sortField === 'lastActivity') cmp = a.lastActivity.localeCompare(b.lastActivity);
      if (filters.sortField === 'workload')     cmp = a.workload.capacityPct - b.workload.capacityPct;
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [members, filters]);

  const patch = (p: Partial<TeamFilters>) => setFilters(prev => ({ ...prev, ...p }));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display font-semibold text-slate-100 text-sm tracking-wide">Team Members</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">{filtered.length} of {members.length} members</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              showFilters
                ? 'bg-brand-purple/15 border-brand-purple/30 text-brand-electric'
                : 'bg-white/5 border-white/8 text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input
            type="text"
            placeholder="Search members..."
            value={filters.search}
            onChange={e => patch({ search: e.target.value })}
            className="w-full bg-white/[0.04] border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-purple/40 transition-colors"
          />
        </div>

        {/* Filter row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-3">
                {/* Role filter */}
                <div className="relative">
                  <select
                    value={filters.role}
                    onChange={e => patch({ role: e.target.value as WorkspaceRole | 'all' })}
                    className="appearance-none bg-white/5 border border-white/8 rounded-lg pl-3 pr-7 py-1.5 text-[11px] text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#13131E]">{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>

                {/* Status filter */}
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={e => patch({ status: e.target.value as OnlineStatus | 'all' })}
                    className="appearance-none bg-white/5 border border-white/8 rounded-lg pl-3 pr-7 py-1.5 text-[11px] text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#13131E]">{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={filters.sortField}
                    onChange={e => patch({ sortField: e.target.value as SortField })}
                    className="appearance-none bg-white/5 border border-white/8 rounded-lg pl-3 pr-7 py-1.5 text-[11px] text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#13131E]">{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>

                <button
                  onClick={() => patch({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
                  className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  {filters.sortDir === 'asc' ? 'Asc' : 'Desc'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Member List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Users className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-sm text-slate-500">No members found</p>
              <p className="text-xs text-slate-600 mt-1">Try adjusting your filters</p>
            </motion.div>
          ) : (
            filtered.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                index={i}
                isSelected={selectedId === member.id}
                onSelect={onSelect}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Member Card ──────────────────────────────────────────────────────────────

interface MemberCardProps {
  member: TeamMember;
  index: number;
  isSelected: boolean;
  onSelect: (m: TeamMember) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, index, isSelected, onSelect }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
      onClick={() => onSelect(member)}
      className={`relative w-full flex items-start gap-3 px-3.5 py-3 rounded-xl cursor-pointer border transition-all duration-200 ${
        isSelected
          ? 'bg-brand-purple/12 border-brand-purple/30 shadow-sm'
          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10'
      }`}
    >
      {/* Avatar */}
      <MemberAvatar initials={member.avatar} status={member.onlineStatus} size="md" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-100 truncate">{member.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{member.email}</p>
          </div>
          <StatusDot status={member.onlineStatus} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <RoleBadge role={member.role} size="sm" />
        </div>

        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-600">
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {member.workload.activeProjects} projects
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {member.lastActivity}
          </span>
        </div>

        {/* Workload bar */}
        <div className="mt-2">
          <WorkloadBar value={member.workload.capacityPct} showLabel size="sm" />
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.span
          layoutId="member-selected"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full bg-brand-purple"
        />
      )}
    </motion.div>
  );
};
