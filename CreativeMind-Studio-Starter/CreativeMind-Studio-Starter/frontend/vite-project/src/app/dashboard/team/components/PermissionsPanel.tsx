/**
 * PermissionsPanel.tsx — Workspace-wide permission overview by category
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, X } from 'lucide-react';
import { ROLE_DEFINITIONS } from '../mockData';
import { PERMISSION_DISPLAY, PERMISSION_CATEGORIES, ROLE_CONFIG } from './roleUtils';
import { SectionLabel } from './TeamShared';
import type { WorkspaceRole } from '../types';

// ─── Permission matrix ────────────────────────────────────────────────────────

// Build a map: role → permissions granted (from permissionSummary keywords)
function roleHasPermission(role: WorkspaceRole, permKey: string): boolean {
  const def = ROLE_DEFINITIONS.find(r => r.id === role);
  if (!def) return false;

  // Full access roles
  if (def.permissionSummary.includes('Full access')) return true;

  const permLabel = PERMISSION_DISPLAY.find(p => p.key === permKey)?.label ?? '';
  return def.permissionSummary.some(s =>
    permLabel.toLowerCase().includes(s.toLowerCase().replace('full access', '').trim()) ||
    s.toLowerCase().includes(permLabel.toLowerCase().split(' ').pop()!)
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PermissionsPanel: React.FC = () => {
  const roles: WorkspaceRole[] = [
    'workspace-owner', 'project-lead', 'creative-strategist',
    'researcher', 'scriptwriter', 'video-editor',
    'marketing-member', 'reviewer', 'viewer',
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4.5 h-4.5 w-5 h-5 text-brand-electric" />
          <h2 className="font-display font-semibold text-slate-100 text-sm tracking-wide">Permission Matrix</h2>
        </div>
        <p className="text-[11px] text-slate-500">Role-based access overview for your workspace</p>
      </div>

      {/* Matrix */}
      <div className="flex-1 overflow-auto py-4 px-4">
        {PERMISSION_CATEGORIES.map(cat => {
          const perms = PERMISSION_DISPLAY.filter(p => p.category === cat);

          return (
            <motion.section
              key={cat}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-6"
            >
              <SectionLabel className="mb-3 block capitalize">{cat} Permissions</SectionLabel>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                {/* Role headers */}
                <div className="flex border-b border-white/[0.05] bg-white/[0.03]">
                  <div className="w-36 flex-shrink-0 px-3 py-2 text-[10px] font-mono text-slate-600">
                    Permission
                  </div>
                  {roles.map(role => {
                    const cfg = ROLE_CONFIG[role];
                    return (
                      <div
                        key={role}
                        className="flex-1 min-w-0 px-1 py-2 flex items-center justify-center"
                        title={cfg.label}
                      >
                        <span
                          className="text-[9px] font-mono font-bold truncate"
                          style={{ color: cfg.color }}
                        >
                          {cfg.label.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Permission rows */}
                {perms.map((perm, i) => (
                  <div
                    key={perm.key}
                    className={`flex items-center border-b border-white/[0.04] last:border-b-0 ${
                      i % 2 === 0 ? '' : 'bg-white/[0.01]'
                    }`}
                  >
                    <div className="w-36 flex-shrink-0 px-3 py-2.5">
                      <p className="text-[11px] font-medium text-slate-300">{perm.label}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">{perm.description}</p>
                    </div>
                    {roles.map(role => {
                      const allowed = roleHasPermission(role, perm.key);
                      const color = allowed ? '#10B981' : '#1E293B';
                      return (
                        <div
                          key={role}
                          className="flex-1 py-2.5 flex items-center justify-center"
                        >
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: `${color}20` }}
                          >
                            {allowed
                              ? <Check className="w-3 h-3 text-emerald-400" />
                              : <X className="w-2.5 h-2.5 text-slate-700" />
                            }
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
};
