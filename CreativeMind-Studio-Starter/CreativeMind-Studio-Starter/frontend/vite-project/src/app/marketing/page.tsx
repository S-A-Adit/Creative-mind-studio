/**
 * marketing/page.tsx — Landing page orchestrator.
 *
 * Renders all 14 sections as a standalone full-page experience
 * without the application shell (no sidebar, no header).
 */
import React from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { WorkflowSection } from './components/WorkflowSection';
import { ProblemSection } from './components/ProblemSection';
import { DepartmentsSection } from './components/DepartmentsSection';
import { StrategyRoomSection } from './components/StrategyRoomSection';
import { ViralityTwinSection } from './components/ViralityTwinSection';
import { ResearchSection } from './components/ResearchSection';
import { EditorSection } from './components/EditorSection';
import { RightsSection } from './components/RightsSection';
import { CollaborationSection } from './components/CollaborationSection';
import { PerformanceSection } from './components/PerformanceSection';
import { PricingSection } from './components/PricingSection';
import { CTASection } from './components/CTASection';
import { LandingFooter } from './components/LandingFooter';

// Subtle section divider
const Divider: React.FC = () => (
  <div className="max-w-7xl mx-auto px-6 md:px-8">
    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  </div>
);

export const MarketingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07070A] text-white overflow-x-hidden">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main content */}
      <main>
        {/* S1 — Hero */}
        <HeroSection />

        <Divider />

        {/* S2 — Trusted Creative Workflow */}
        <WorkflowSection />

        <Divider />

        {/* S3 — Problem */}
        <ProblemSection />

        <Divider />

        {/* S4 — Product Departments */}
        <DepartmentsSection />

        <Divider />

        {/* S5 — Multi-Agent Strategy Room */}
        <StrategyRoomSection />

        <Divider />

        {/* S6 — Virality Twin */}
        <ViralityTwinSection />

        <Divider />

        {/* S7 — Verified Research */}
        <ResearchSection />

        <Divider />

        {/* S8 — Editor Workspace */}
        <EditorSection />

        <Divider />

        {/* S9 — Rights & Brand Safety */}
        <RightsSection />

        <Divider />

        {/* S10 — Team Collaboration */}
        <CollaborationSection />

        <Divider />

        {/* S11 — Performance Loop */}
        <PerformanceSection />

        <Divider />

        {/* S12 — Pricing */}
        <PricingSection />

        <Divider />

        {/* S13 — Final CTA */}
        <CTASection />
      </main>

      {/* S14 — Footer */}
      <LandingFooter />
    </div>
  );
};
