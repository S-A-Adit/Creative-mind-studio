/**
 * DashboardPage — the home workspace after login.
 *
 * Uses MainLayout (shell) + useDashboardData hook.
 * All sections are individually lazy-mountable and independently scrollable.
 *
 * Layout (desktop):
 *   Full-width:  Header, KPI cards, Continue Working
 *   2-col:       Left (Pipeline + Activity) | Right (Agents + Deadlines)
 */
import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useLayout } from '../../lib/useLayout';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardHeader } from './components/DashboardHeader';
import { KpiCards } from './components/KpiCards';
import { ContinueWorking } from './components/ContinueWorking';
import { ProductionPipeline } from './components/ProductionPipeline';
import { ActivityFeed } from './components/ActivityFeed';
import { AgentActivity } from './components/AgentActivity';
import { UpcomingDeadlines } from './components/UpcomingDeadlines';

export const DashboardPage: React.FC = () => {
  const { setBreadcrumbs, setPrimaryAction } = useLayout();
  const { data, getAgentMessage } = useDashboardData();

  // Set shell context
  useEffect(() => {
    setBreadcrumbs([{ label: 'Home' }]);
    setPrimaryAction({
      label: 'New Project',
      icon: <Plus className="w-3.5 h-3.5" />,
      onClick: () => {},
    });
    return () => setPrimaryAction(null);
  }, [setBreadcrumbs, setPrimaryAction]);

  return (
    <div className="w-full min-h-full px-6 md:px-8 py-8 pb-20 md:pb-10 space-y-8">
      {/* ── Greeting header ── */}
      <DashboardHeader
        userName={data.userName}
        workspaceName={data.workspaceName}
      />

      {/* ── KPI cards ── */}
      <KpiCards cards={data.kpis} />

      {/* ── Continue Working (horizontal scroll) ── */}
      <ContinueWorking projects={data.recentProjects} />

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left column (wider): Pipeline + Activity */}
        <div className="xl:col-span-3 space-y-8">
          <ProductionPipeline stages={data.pipeline} />
          <ActivityFeed items={data.activity} />
        </div>

        {/* Right column (narrower): Agents + Deadlines */}
        <div className="xl:col-span-2 space-y-8">
          <AgentActivity
            agents={data.agents}
            getAgentMessage={getAgentMessage}
          />
          <UpcomingDeadlines deadlines={data.deadlines} />
        </div>
      </div>
    </div>
  );
};
