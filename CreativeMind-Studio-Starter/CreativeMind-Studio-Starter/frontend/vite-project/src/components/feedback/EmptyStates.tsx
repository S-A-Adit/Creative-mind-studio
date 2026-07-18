/**
 * EmptyStates.tsx — contextual empty state components
 *
 * All variants share the same EmptyState base.
 * Named presets cover every major workspace in CreativeMind Studio.
 *
 * Usage:
 *   <EmptyState
 *     icon={<Folder />}
 *     title="No projects found"
 *     description="Create your first project to get started."
 *     primaryAction={{ label: 'New Project', onClick: () => {} }}
 *   />
 *   // — or use a preset —
 *   <EmptyProjects onNewProject={() => {}} />
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, ImageOff, Bell, BookOpen, Link2Off,
  Upload, Search, Users, FileText, BarChart2, Plus,
  RefreshCw,
} from 'lucide-react';

// ─── Base component ───────────────────────────────────────────────────────────

export interface EmptyAction {
  label:   string;
  onClick: () => void;
  icon?:   React.ReactNode;
}

export interface EmptyStateProps {
  /** Lucide icon or custom SVG */
  icon:           React.ReactNode;
  title:          string;
  description:    string;
  primaryAction?: EmptyAction;
  secondaryAction?:EmptyAction;
  className?:     string;
  /** Compact variant — less vertical padding, smaller text */
  compact?:       boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
  compact = false,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
    className={`flex flex-col items-center justify-center text-center
      ${compact ? 'py-10 px-6' : 'py-20 px-8'}
      ${className}`}
  >
    {/* Illustration placeholder */}
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1,    opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
      className={`flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08]
        ${compact ? 'w-14 h-14 mb-4' : 'w-20 h-20 mb-6'}
      `}
    >
      <div className={`text-slate-600 ${compact ? 'w-6 h-6' : 'w-9 h-9'}`}>
        {icon}
      </div>
    </motion.div>

    <h3 className={`font-display font-semibold text-slate-300 mb-2
      ${compact ? 'text-sm' : 'text-base'}`}>
      {title}
    </h3>

    <p className={`text-slate-500 font-sans max-w-xs leading-relaxed
      ${compact ? 'text-xs' : 'text-sm'}`}>
      {description}
    </p>

    {(primaryAction || secondaryAction) && (
      <div className={`flex items-center gap-3 flex-wrap justify-center ${compact ? 'mt-4' : 'mt-6'}`}>
        {primaryAction && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={primaryAction.onClick}
            className={`inline-flex items-center gap-2 font-sans font-semibold bg-brand-purple/90 hover:bg-brand-purple text-white rounded-xl transition-colors duration-150
              ${compact ? 'text-xs px-3.5 py-2' : 'text-sm px-5 py-2.5'}`}
          >
            {primaryAction.icon ?? <Plus className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
            {primaryAction.label}
          </motion.button>
        )}
        {secondaryAction && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={secondaryAction.onClick}
            className={`inline-flex items-center gap-2 font-sans font-medium text-slate-400 hover:text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-xl transition-colors duration-150
              ${compact ? 'text-xs px-3.5 py-2' : 'text-sm px-5 py-2.5'}`}
          >
            {secondaryAction.icon}
            {secondaryAction.label}
          </motion.button>
        )}
      </div>
    )}
  </motion.div>
);

// ─── Named presets ─────────────────────────────────────────────────────────────

export const EmptyProjects: React.FC<{
  onNewProject?: () => void;
  onBrowse?:     () => void;
}> = ({ onNewProject, onBrowse }) => (
  <EmptyState
    icon={<FolderOpen className="w-full h-full" />}
    title="No projects found"
    description="Create your first project to start building your creative pipeline end-to-end."
    primaryAction={onNewProject ? { label: 'New Project', onClick: onNewProject } : undefined}
    secondaryAction={onBrowse   ? { label: 'Browse Templates', onClick: onBrowse, icon: <Search className="w-4 h-4" /> } : undefined}
  />
);

export const EmptyAssets: React.FC<{
  onUpload?: () => void;
  onBrowse?: () => void;
}> = ({ onUpload, onBrowse }) => (
  <EmptyState
    icon={<ImageOff className="w-full h-full" />}
    title="No assets uploaded"
    description="Upload images, video clips, audio files, or documents to use in your projects."
    primaryAction={onUpload ? { label: 'Upload Assets', onClick: onUpload, icon: <Upload className="w-4 h-4" /> } : undefined}
    secondaryAction={onBrowse ? { label: 'Browse Library', onClick: onBrowse, icon: <Search className="w-4 h-4" /> } : undefined}
  />
);

export const EmptyNotifications: React.FC<{
  onSettings?: () => void;
}> = ({ onSettings }) => (
  <EmptyState
    icon={<Bell className="w-full h-full" />}
    title="No notifications"
    description="You're all caught up! Notifications for assignments, approvals, and AI agents will appear here."
    secondaryAction={onSettings ? { label: 'Notification Settings', onClick: onSettings } : undefined}
  />
);

export const EmptyResearch: React.FC<{
  onAddQuestion?: () => void;
  onImport?:      () => void;
}> = ({ onAddQuestion, onImport }) => (
  <EmptyState
    icon={<BookOpen className="w-full h-full" />}
    title="No research questions yet"
    description="Define your research questions to guide the AI research agent and structure your evidence gathering."
    primaryAction={onAddQuestion ? { label: 'Add Question', onClick: onAddQuestion } : undefined}
    secondaryAction={onImport    ? { label: 'Import Brief', onClick: onImport, icon: <Upload className="w-4 h-4" /> } : undefined}
  />
);

export const EmptyEvidence: React.FC<{
  onLink?:   () => void;
  onSearch?: () => void;
}> = ({ onLink, onSearch }) => (
  <EmptyState
    icon={<Link2Off className="w-full h-full" />}
    title="No evidence has been linked yet"
    description="Link verified sources, research reports, or fact-checked documents to support your content strategy."
    primaryAction={onLink   ? { label: 'Link Evidence', onClick: onLink, icon: <Plus className="w-4 h-4" /> } : undefined}
    secondaryAction={onSearch ? { label: 'Search Sources', onClick: onSearch, icon: <Search className="w-4 h-4" /> } : undefined}
  />
);

export const EmptyTeam: React.FC<{
  onInvite?: () => void;
}> = ({ onInvite }) => (
  <EmptyState
    icon={<Users className="w-full h-full" />}
    title="No team members yet"
    description="Invite collaborators to your workspace to assign roles, share projects, and review content together."
    primaryAction={onInvite ? { label: 'Invite Members', onClick: onInvite } : undefined}
  />
);

export const EmptyScripts: React.FC<{
  onNew?:   () => void;
  onImport?:() => void;
}> = ({ onNew, onImport }) => (
  <EmptyState
    icon={<FileText className="w-full h-full" />}
    title="No scripts written yet"
    description="Start writing your first script or use the AI Scriptwriter to generate hook variants and narrative frameworks."
    primaryAction={onNew    ? { label: 'New Script', onClick: onNew } : undefined}
    secondaryAction={onImport ? { label: 'Import Document', onClick: onImport, icon: <Upload className="w-4 h-4" /> } : undefined}
  />
);

export const EmptyAnalytics: React.FC<{
  onConnect?: () => void;
}> = ({ onConnect }) => (
  <EmptyState
    icon={<BarChart2 className="w-full h-full" />}
    title="No analytics data yet"
    description="Connect your distribution channels or publish content to start tracking performance metrics."
    primaryAction={onConnect ? { label: 'Connect Channel', onClick: onConnect } : undefined}
  />
);

export const EmptySearchResults: React.FC<{
  query:       string;
  onClear?:    () => void;
}> = ({ query, onClear }) => (
  <EmptyState
    compact
    icon={<Search className="w-full h-full" />}
    title={`No results for "${query}"`}
    description="Try adjusting your search terms, filters, or check spelling."
    secondaryAction={onClear ? { label: 'Clear Search', onClick: onClear, icon: <RefreshCw className="w-3.5 h-3.5" /> } : undefined}
  />
);
