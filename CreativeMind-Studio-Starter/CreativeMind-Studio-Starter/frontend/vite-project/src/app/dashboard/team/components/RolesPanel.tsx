/**
 * RolesPanel.tsx — Role definitions browser with member counts
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users } from 'lucide-react';
import { PermissionCheckItem, SectionLabel } from './TeamShared';
import { PERMISSION_DISPLAY } from './roleUtils';
import type { RoleDefinition } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RolesPanelProps {
  roles: RoleDefinition[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RolesPanel: React.FC<RolesPanelProps> = ({ roles }) => {
  const [expanded, setExpanded] = useState<string | null>('workspace-owner');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06] flex-shrink-0">
        <h2 className="font-display font-semibold text-slate-100 text-sm tracking-wide">Workspace Roles</h2>
        <p className="text-[11px] text-slate-500 mt-0.5">{roles.length} roles · Click to expand</p>
      </div>

      {/* Role list */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
        {roles.map((role, i) => (
          <RoleCard
            key={role.id}
            role={role}
            index={i}
            isExpanded={expanded === role.id}
            onToggle={() => setExpanded(expanded === role.id ? null : role.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Role Card ────────────────────────────────────────────────────────────────

interface RoleCardProps {
  role: RoleDefinition;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, index, isExpanded, onToggle }) => {
  // Derive a mock permission set for this role from PERMISSION_DISPLAY labels vs permissionSummary
  const summarySet = new Set(role.permissionSummary.map(s => s.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isExpanded
          ? 'border-white/15 bg-white/[0.04]'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
      }`}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        {/* Color dot */}
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: role.color, boxShadow: `0 0 8px ${role.color}60` }}
        />

        {/* Label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-100">{role.label}</span>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
              style={{ color: role.color, background: `${role.color}15` }}
            >
              {role.memberCount} {role.memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>
          {!isExpanded && (
            <p className="text-[11px] text-slate-600 mt-0.5 truncate">{role.description}</p>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.05] pt-3">
              <p className="text-xs text-slate-400 leading-relaxed">{role.description}</p>

              <div>
                <SectionLabel className="mb-2 block">Key Permissions</SectionLabel>
                <div className="grid grid-cols-1 gap-1.5">
                  {PERMISSION_DISPLAY.slice(0, 8).map(p => {
                    // Approximate: check if any summary word matches label
                    const granted = role.permissionSummary.some(s =>
                      p.label.toLowerCase().includes(s.toLowerCase().replace('full access', '').trim()) ||
                      s.toLowerCase().includes(p.label.toLowerCase().split(' ').pop()!)
                    );
                    return (
                      <PermissionCheckItem key={p.key} allowed={granted} label={p.label} />
                    );
                  })}
                </div>
              </div>

              <div>
                <SectionLabel className="mb-2 block">Summary</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissionSummary.map(s => (
                    <span
                      key={s}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{ color: role.color, background: `${role.color}15`, border: `1px solid ${role.color}30` }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                <span>{role.memberCount} team {role.memberCount === 1 ? 'member' : 'members'} assigned</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
