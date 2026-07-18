/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * App.tsx — root component.
 *
 * Switches between thirteen top-level experiences:
 *   1. Marketing landing page      (view = 'marketing')
 *   2. Auth / Onboarding flow      (view = 'auth')
 *   3. Application shell           (view = 'app')
 *   4. Project creation wizard     (view = 'create-project')
 *   5. Project Overview            (view = 'project-overview')
 *   6. Strategy War Room           (view = 'strategy')
 *   7. Virality Twin Workspace     (view = 'virality-twin')
 *   8. Research Lab                (view = 'research-lab')
 *   9. Script & Story Room         (view = 'script-room')
 *  10. Asset Room                  (view = 'asset-room')
 *  11. Video Editor Workspace      (view = 'editor')
 *  12. Review & Approval Room      (view = 'review')
 *  13. Distribution Room           (view = 'distribution')
 *
 * Change DEFAULT_VIEW to start on a different screen during development.
 */

import React, { useState } from 'react';
import { MarketingPage } from './app/marketing/page';
import { AuthRouter } from './app/auth/AuthRouter';
import { LayoutProvider } from './lib/LayoutContext';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './app/dashboard/page';
import { ProjectCreationWizard } from './app/create-project/ProjectCreationWizard';
import { ProjectOverviewPage } from './app/dashboard/projects/projectId/overview/ProjectOverviewPage';
import { StrategyWarRoomPage } from './app/dashboard/projects/projectId/strategy/StrategyWarRoomPage';
import { ViralityTwinPage } from './app/dashboard/projects/projectId/virality-twin/ViralityTwinPage';
import { ResearchLabPage } from './app/dashboard/projects/projectId/research/ResearchLabPage';
import { ScriptRoomPage } from './app/dashboard/projects/projectId/script/ScriptRoomPage';
import { AssetRoomPage } from './app/dashboard/projects/projectId/assets/AssetRoomPage';
import { VideoEditorWorkspace } from './app/dashboard/projects/projectId/editor/VideoEditorWorkspace';
import { ReviewApprovalRoom } from './app/dashboard/projects/projectId/review/ReviewApprovalRoom';
import { DistributionRoom } from './app/dashboard/projects/projectId/distribution/DistributionRoom';
import { PerformanceWorkspace } from './app/dashboard/projects/projectId/analytics/PerformanceWorkspace';
import { NotificationsWorkspace } from './app/dashboard/notifications/NotificationsWorkspace';

type AppView =
  | 'marketing'
  | 'auth'
  | 'app'
  | 'create-project'
  | 'project-overview'
  | 'strategy'
  | 'virality-twin'
  | 'research-lab'
  | 'script-room'
  | 'asset-room'
  | 'editor'
  | 'review'
  | 'distribution'
  | 'performance'
  | 'notifications';

// ← Change this to jump to a specific screen during development
const DEFAULT_VIEW: AppView = 'notifications';

export default function App() {
  const [view, setView] = useState<AppView>(DEFAULT_VIEW);

  if (view === 'marketing') {
    return <MarketingPage />;
  }

  if (view === 'auth') {
    return (
      <AuthRouter
        initialPage="login"
        onAuthenticated={() => setView('app')}
      />
    );
  }

  if (view === 'create-project') {
    return (
      <LayoutProvider>
        <MainLayout>
          <ProjectCreationWizard
            onClose={() => setView('app')}
            onProjectCreated={() => setView('project-overview')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'project-overview') {
    return (
      <LayoutProvider>
        <MainLayout>
          <ProjectOverviewPage onBack={() => setView('app')} />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'strategy') {
    return (
      <LayoutProvider>
        <MainLayout>
          <StrategyWarRoomPage
            onBack={() => setView('project-overview')}
            onContinueToResearch={() => setView('virality-twin')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'virality-twin') {
    return (
      <LayoutProvider>
        <MainLayout>
          <ViralityTwinPage
            onBack={() => setView('strategy')}
            onContinue={() => setView('research-lab')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'research-lab') {
    return (
      <LayoutProvider>
        <MainLayout>
          <ResearchLabPage
            onBack={() => setView('virality-twin')}
            onContinue={() => setView('script-room')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'script-room') {
    return (
      <LayoutProvider>
        <MainLayout>
          <ScriptRoomPage
            onBack={() => setView('research-lab')}
            onContinue={() => setView('asset-room')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'asset-room') {
    return (
      <LayoutProvider>
        <MainLayout>
          <AssetRoomPage
            onBack={() => setView('script-room')}
            onContinue={() => setView('editor')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'editor') {
    return (
      <LayoutProvider>
        <MainLayout>
          <VideoEditorWorkspace
            onBack={() => setView('asset-room')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'review') {
    return (
      <LayoutProvider>
        <MainLayout>
          <ReviewApprovalRoom
            onBack={() => setView('editor')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'distribution') {
    return (
      <LayoutProvider>
        <MainLayout>
          <DistributionRoom
            onBack={() => setView('review')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'performance') {
    return (
      <LayoutProvider>
        <MainLayout>
          <PerformanceWorkspace
            onBack={() => setView('distribution')}
          />
        </MainLayout>
      </LayoutProvider>
    );
  }

  if (view === 'notifications') {
    return (
      <LayoutProvider>
        <MainLayout>
          <NotificationsWorkspace />
        </MainLayout>
      </LayoutProvider>
    );
  }

  // Application shell + Dashboard
  return (
    <LayoutProvider>
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    </LayoutProvider>
  );
}
