/**
 * LeftPanel.tsx — Team Workspace navigation panel
 */

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { getNavIcon } from './roleUtils';
import type { TeamNavSection, TeamSection } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface LeftPanelProps {
  sections: TeamNavSection[];
  activeSection: TeamSection;
  onSectionChange: (id: TeamSection) => void;
  onInvite: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LeftPanel: React.FC<LeftPanelProps> = ({
  sections, activeSection, onSectionChange, onInvite,
}) => {
  return (
    <aside className="h-full flex flex-col bg-[#0E0E18]/60 border-r border-white/[0.06] overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.05]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-semibold text-slate-100 text-sm tracking-wide">Team</h2>
          <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded-md">
            Workspace
          </span>
        </div>
        <p className="text-[11px] text-slate-600">Manage your collaboration space</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {sections.map((section, i) => {
          const isActive = section.id === activeSection;
          return (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-brand-purple/15 border border-brand-purple/25 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {/* Icon */}
              <span className={isActive ? 'text-brand-electric' : 'text-slate-500 group-hover:text-slate-300'}>
                {getNavIcon(section.iconName)}
              </span>

              {/* Label & counts */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium truncate">{section.label}</span>
                  <span className={`text-[10px] font-mono ml-2 flex-shrink-0 ${
                    isActive ? 'text-brand-electric' : 'text-slate-600'
                  }`}>
                    {section.total}
                  </span>
                </div>
                {section.pending > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: section.statusColor }}
                    />
                    <span className="text-[10px] font-mono text-slate-600">
                      {section.pending} pending
                    </span>
                  </div>
                )}
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="w-1 h-4 rounded-full bg-brand-purple flex-shrink-0"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Invite CTA */}
      <div className="p-3 border-t border-white/[0.05]">
        <button
          onClick={onInvite}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/30 text-brand-electric text-sm font-medium transition-all duration-200 group"
        >
          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Invite Member
        </button>
      </div>
    </aside>
  );
};
