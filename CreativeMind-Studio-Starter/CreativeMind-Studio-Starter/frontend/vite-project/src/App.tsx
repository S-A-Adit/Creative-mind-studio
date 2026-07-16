/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * App.tsx — root component.
 *
 * Switches between three top-level experiences:
 *   1. Marketing landing page  (view = 'marketing')
 *   2. Auth / Onboarding flow  (view = 'auth')
 *   3. Application shell        (view = 'app')
 *
 * Change DEFAULT_VIEW to start on a different screen during development.
 */

import React, { useState } from 'react';
import { MarketingPage } from './app/marketing/page';
import { AuthRouter } from './app/auth/AuthRouter';
import { LayoutProvider } from './lib/LayoutContext';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './app/dashboard/page';

type AppView = 'marketing' | 'auth' | 'app';

// ← Change this to 'marketing' | 'auth' | 'app' to jump to a specific screen
const DEFAULT_VIEW: AppView = 'app';

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

  // Application shell + Dashboard
  return (
    <LayoutProvider>
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    </LayoutProvider>
  );
}
