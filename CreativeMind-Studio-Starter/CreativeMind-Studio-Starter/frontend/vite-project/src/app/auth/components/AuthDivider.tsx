/**
 * AuthDivider — "or continue with" separator.
 */
import React from 'react';

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label = 'or continue with' }) => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-white/[0.06]" />
    <span className="text-[11px] text-slate-600 font-mono whitespace-nowrap">{label}</span>
    <div className="flex-1 h-px bg-white/[0.06]" />
  </div>
);
