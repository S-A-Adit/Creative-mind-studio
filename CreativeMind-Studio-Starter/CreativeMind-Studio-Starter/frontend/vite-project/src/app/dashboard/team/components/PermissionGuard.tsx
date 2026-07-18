/**
 * PermissionGuard.tsx — Reusable permission gate component
 *
 * Wraps any protected UI. Supports:
 *   - hide: renders null when permission is denied (default)
 *   - disable: renders children but disabled/pointer-events-none
 *   - warn: renders children with a permission warning overlay
 *   - fallback: renders custom fallback UI
 */

import React from 'react';
import { Lock } from 'lucide-react';
import type { MemberPermissions } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PermissionKey = keyof MemberPermissions;
export type PermissionMode = 'hide' | 'disable' | 'warn' | 'fallback';

interface PermissionGuardProps {
  /** The permission key to check */
  permission: PermissionKey;
  /** The current user's permission object */
  permissions: MemberPermissions;
  /** Behaviour when the permission is denied. Defaults to 'hide'. */
  mode?: PermissionMode;
  /** Custom fallback rendered when mode is 'fallback' */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions,
  mode = 'hide',
  fallback,
  children,
}) => {
  const allowed = permissions[permission] === true;

  if (allowed) return <>{children}</>;

  if (mode === 'hide') return null;

  if (mode === 'disable') {
    return (
      <div className="pointer-events-none opacity-40 select-none" aria-disabled="true">
        {children}
      </div>
    );
  }

  if (mode === 'warn') {
    return (
      <div className="relative group">
        <div className="pointer-events-none opacity-40 select-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1.5 bg-[#0B0B12]/90 border border-rose-500/30 text-rose-400 text-[11px] font-mono px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>Permission required</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'fallback' && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs font-mono">
      <Lock className="w-3.5 h-3.5" />
      <span>You don't have permission for this action</span>
    </div>
  );
};
