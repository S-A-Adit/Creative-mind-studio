/**
 * ProjectOverviewPage.tsx — Full command-centre page for a creative project.
 *
 * Layout (responsive):
 *
 *  Mobile  :  Stacked single column
 *  Tablet  :  2 columns
 *  Desktop :  3-column grid (primary 3fr + sidebar 2fr) for most sections
 *
 *  Sections (top → bottom):
 *   1. ProjectHeader          (full width)
 *   2. PhaseNavigator         (full width, horizontal scroll)
 *   3. QuickActions           (full width)
 *   4. HealthDashboard KPIs   (full width grid)
 *   5. Two-column body:
 *      Left  (3/5):  ActivityTimeline · RecentFiles
 *      Right (2/5):  AIRecommendations · TeamAssignments · PendingApprovals
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import { useLayout } from '../../../../../lib/useLayout';
import { ProjectHeader } from './ProjectHeader';
import { PhaseNavigator } from './PhaseNavigator';
import { HealthDashboard } from './HealthDashboard';
import { ActivityTimeline } from './ActivityTimeline';
import { TeamAssignments } from './TeamAssignments';
import { PendingApprovals } from './PendingApprovals';
import { RecentFiles } from './RecentFiles';
import { AIRecommendations } from './AIRecommendations';
import { QuickActions } from './QuickActions';
import { MOCK_PROJECT_OVERVIEW } from './mockData';
import type { PhaseId } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── Section divider with label ───────────────────────────────────────────────

const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="h-px flex-1 bg-white/[0.05]" />
    <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest flex-shrink-0">
      {label}
    </span>
    <div className="h-px flex-1 bg-white/[0.05]" />
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

interface ProjectOverviewPageProps {
  onBack?: () => void;
}

export const ProjectOverviewPage: React.FC<ProjectOverviewPageProps> = ({ onBack }) => {
  const { setBreadcrumbs, setPrimaryAction, setActiveNavId, setActiveProject } = useLayout();
  const project = MOCK_PROJECT_OVERVIEW;

  const [activePhase, setActivePhase] = useState<PhaseId>(project.activePhaseId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Shell integration ───────────────────────────────────────────────────────
  useEffect(() => {
    setActiveNavId('project-overview');
    setActiveProject({
      id: project.id,
      name: project.title,
      status: 'in-progress',
      description: project.description,
      color: '#8B5CF6',
    });
    setBreadcrumbs([
      { label: 'Projects', href: '#projects' },
      { label: project.title },
    ]);
    setPrimaryAction({
      label: 'New Project',
      icon: <Plus className="w-3.5 h-3.5" />,
      onClick: () => {},
    });
    return () => {
      setPrimaryAction(null);
      setActiveProject(null);
    };
  }, [setBreadcrumbs, setPrimaryAction, setActiveNavId, setActiveProject, project.id, project.title, project.description]);

  // ── Simulate refresh ────────────────────────────────────────────────────────
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: ease.snappy }}
      className="w-full min-h-full px-4 sm:px-6 md:px-8 py-6 pb-20 md:pb-10 space-y-8"
    >
      {/* ── Sub-page top bar ── */}
      <div className="flex items-center justify-between -mb-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[12px] text-slate-500
              hover:text-slate-300 transition-colors duration-150 font-mono"
          >
            ← Back to Projects
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <motion.button
            type="button"
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-8 h-8 rounded-[8px] border border-white/[0.08] flex items-center justify-center
              text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* ── 1. Project Header ── */}
      <ProjectHeader
        project={project}
        onOpenStrategy={() => {}}
        onInviteTeam={() => {}}
        onShare={() => {}}
      />

      {/* ── 2. Phase Navigator ── */}
      <PhaseNavigator
        phases={project.phases}
        activePhaseId={activePhase}
        onPhaseClick={setActivePhase}
      />

      {/* ── 3. Quick Actions ── */}
      <QuickActions onActionClick={() => {}} />

      <SectionDivider label="Project Intelligence" />

      {/* ── 4. Health Dashboard ── */}
      <HealthDashboard metrics={project.healthMetrics} />

      <SectionDivider label="Project Details" />

      {/* ── 5. Two-column body ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* ── Left column (wider) ── */}
        <div className="xl:col-span-3 space-y-8">
          {/* Activity Timeline */}
          <ActivityTimeline items={project.timeline} maxVisible={6} />

          {/* Recent Files */}
          <RecentFiles files={project.recentFiles} />
        </div>

        {/* ── Right column (narrower) ── */}
        <div className="xl:col-span-2 space-y-8">
          {/* AI Recommendations */}
          <AIRecommendations recommendations={project.recommendations} />

          {/* Team Assignments */}
          <TeamAssignments members={project.team} onInvite={() => {}} />

          {/* Pending Approvals */}
          <PendingApprovals approvals={project.approvals} />
        </div>
      </div>
    </motion.div>
  );
};
