/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * App.tsx — root component.
 *
 * Switches between eight top-level experiences:
 *   1. Marketing landing page      (view = 'marketing')
 *   2. Auth / Onboarding flow      (view = 'auth')
 *   3. Application shell           (view = 'app')
 *   4. Project creation wizard     (view = 'create-project')
 *   5. Project Overview            (view = 'project-overview')
 *   6. Strategy War Room           (view = 'strategy')
 *   7. Virality Twin Workspace     (view = 'virality-twin')
 *   8. Research Lab                (view = 'research-lab')
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

type AppView =
  | 'marketing'
  | 'auth'
  | 'app'
  | 'create-project'
  | 'project-overview'
  | 'strategy'
  | 'virality-twin'
  | 'research-lab';

// ← Change this to jump to a specific screen during development
const DEFAULT_VIEW: AppView = 'research-lab';

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
            onContinue={() => setView('app')}
          />
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
