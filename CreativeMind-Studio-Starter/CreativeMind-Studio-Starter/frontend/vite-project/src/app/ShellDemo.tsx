/**
 * ShellDemo — a lightweight workspace placeholder that demonstrates
 * every shell feature: sidebar, header, command palette, inspector panel,
 * realtime hook, motion primitives, and loading skeletons.
 *
 * This is NOT a product page — it is purely for validating the shell.
 * Replace this content with real feature pages once they are built.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  BotMessageSquare,
  Command,
  ExternalLink,
  FlaskConical,
  FolderOpen,
  Plus,
  PanelRight,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { useLayout } from '../lib/useLayout';
import { useRealtimeProject } from '../hooks/useRealtimeProject';
import { CardEntrance, FadeIn, SlideUp, AnimatedProgressBar } from '../components/shared/MotionPrimitives';
import { SkeletonGrid } from '../components/shared/LoadingSkeleton';
import type { Project } from '../types/shell';

// ─── Mock project for demo ────────────────────────────────────────────────────

const DEMO_PROJECT: Project = {
  id: 'demo-project-1',
  name: 'Q4 Content Campaign',
  status: 'in-progress',
  description: 'AI-powered content strategy and production pipeline',
};

// ─── Connection badge ─────────────────────────────────────────────────────────

const ConnectionBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg: Record<string, { color: string; dot: string; label: string }> = {
    connecting:   { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500 animate-pulse', label: 'Connecting…' },
    connected:    { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500 animate-pulse', label: 'Realtime Connected' },
    disconnected: { color: 'text-slate-400 bg-white/[0.04] border-white/[0.07]', dot: 'bg-slate-600', label: 'Offline' },
    error:        { color: 'text-red-400 bg-red-500/10 border-red-500/20', dot: 'bg-red-500', label: 'Error' },
  };
  const c = cfg[status] ?? cfg.disconnected;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]
      font-mono border ${c.color}`}>
      {status === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ─── Feature section card ─────────────────────────────────────────────────────

interface FeatureTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureTile: React.FC<FeatureTileProps> = ({ icon, title, description, index }) => (
  <CardEntrance index={index}>
    <div className="h-full rounded-[16px] border border-white/[0.07] bg-[#0B0B12]
      hover:border-[#8B5CF6]/30 transition-colors duration-300 p-5 flex flex-col gap-3">
      <div className="w-9 h-9 rounded-[10px] bg-[#7C3AED]/10 border border-[#7C3AED]/20
        flex items-center justify-center text-[#9D6CFF]">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-slate-200">{title}</p>
        <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  </CardEntrance>
);

// ─── Main demo component ──────────────────────────────────────────────────────

export const ShellDemo: React.FC = () => {
  const {
    setActiveProject,
    setRightPanelOpen,
    setCommandPaletteOpen,
    setPrimaryAction,
    setBreadcrumbs,
  } = useLayout();

  const [loading, setLoading] = useState(true);
  const [projectActive, setProjectActive] = useState(false);

  const { connectionStatus, agentUpdates, presenceUsers } = useRealtimeProject(
    projectActive ? DEMO_PROJECT.id : ''
  );

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  // Set up shell context
  useEffect(() => {
    setBreadcrumbs([{ label: 'Home' }]);
    setPrimaryAction({
      label: 'New Project',
      icon: <Plus className="w-3.5 h-3.5" />,
      onClick: () => {
        setActiveProject(DEMO_PROJECT);
        setProjectActive(true);
        setPrimaryAction({
          label: 'Run Strategy',
          icon: <Zap className="w-3.5 h-3.5" />,
          onClick: () => setRightPanelOpen(true),
        });
      },
    });

    return () => setPrimaryAction(null);
  }, [setActiveProject, setBreadcrumbs, setPrimaryAction, setRightPanelOpen]);

  const agents = Object.values(agentUpdates);

  return (
    <FadeIn className="w-full min-h-full p-6 md:p-8 pb-24 md:pb-8 space-y-8">

      {/* ── Hero section ── */}
      <SlideUp>
        <div className="rounded-[20px] border border-white/[0.07] bg-gradient-to-br
          from-[#0B0B12] to-[#10101A] p-8 md:p-10 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full
            bg-[#7C3AED]/10 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end
            md:justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED]/15 border
                  border-[#8B5CF6]/25 text-[#9D6CFF] text-[11px] font-semibold font-mono
                  tracking-widest uppercase">
                  Shell Foundation
                </span>
                <ConnectionBadge status={connectionStatus} />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
                CreativeMind{' '}
                <span className="text-gradient-primary">Studio</span>
              </h1>

              <p className="text-slate-400 text-[14px] leading-relaxed">
                Production-ready application shell. All navigation, command palette,
                realtime architecture, and motion system are active. Replace this
                placeholder with feature pages.
              </p>
            </div>

            {/* Action cluster */}
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 h-9 px-4 rounded-[12px]
                  bg-white/[0.05] border border-white/[0.09] text-[13px] font-medium
                  text-slate-300 hover:text-slate-100 hover:bg-white/[0.08] transition-colors"
              >
                <Command className="w-3.5 h-3.5 text-[#9D6CFF]" />
                Command Palette
                <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[4px]
                  bg-white/[0.06] border border-white/[0.07] text-[10px] font-mono text-slate-600">
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => setRightPanelOpen(true)}
                className="flex items-center gap-2 h-9 px-4 rounded-[12px]
                  bg-white/[0.05] border border-white/[0.09] text-[13px] font-medium
                  text-slate-300 hover:text-slate-100 hover:bg-white/[0.08] transition-colors"
              >
                <PanelRight className="w-3.5 h-3.5 text-[#9D6CFF]" />
                Inspector Panel
              </button>
            </div>
          </div>
        </div>
      </SlideUp>

      {/* ── Shell features grid ── */}
      <section aria-label="Shell features">
        <SlideUp delay={0.05}>
          <h2 className="text-[11px] font-semibold tracking-widest uppercase
            text-slate-600 font-mono mb-4">
            Shell Components
          </h2>
        </SlideUp>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <FolderOpen className="w-4 h-4" />,
                title: 'Responsive Sidebar',
                description: 'Expanded/collapsed modes with animated transitions. Project-contextual navigation section.',
              },
              {
                icon: <Command className="w-4 h-4" />,
                title: 'Command Palette',
                description: 'Ctrl+K launches a Linear-style palette with categorised actions and keyboard navigation.',
              },
              {
                icon: <BotMessageSquare className="w-4 h-4" />,
                title: 'Realtime Architecture',
                description: 'useRealtimeProject hook with mock events, ready to swap in WebSockets or SSE.',
              },
              {
                icon: <Zap className="w-4 h-4" />,
                title: 'Layout Context',
                description: 'Global layout state for sidebar, breadcrumbs, primary actions, and right panel.',
              },
              {
                icon: <BarChart3 className="w-4 h-4" />,
                title: 'Motion Primitives',
                description: 'FadeIn, SlideUp, CardEntrance, PageTransition, HoverElevation — all motion-safe.',
              },
              {
                icon: <FlaskConical className="w-4 h-4" />,
                title: 'Loading Skeletons',
                description: 'Skeleton, SkeletonCard, SkeletonGrid, and SkeletonText components for all load states.',
              },
            ].map((f, i) => (
              <FeatureTile key={f.title} {...f} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── Realtime agent status ── */}
      {agents.length > 0 && projectActive && (
        <section aria-label="Realtime agent status">
          <SlideUp delay={0.1}>
            <h2 className="text-[11px] font-semibold tracking-widest uppercase
              text-slate-600 font-mono mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Agent Status
            </h2>
          </SlideUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {agents.map((agent, i) => (
              <CardEntrance key={agent.agentId} index={i}>
                <div className="rounded-[14px] border border-white/[0.07] bg-[#0B0B12] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-slate-300">{agent.agentName}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border
                      ${agent.status === 'running'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : agent.status === 'completed'
                          ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                          : 'text-slate-500 bg-white/[0.04] border-white/[0.07]'
                      }`}>
                      {agent.status}
                    </span>
                  </div>
                  {agent.message && (
                    <p className="text-[11px] text-slate-600 mb-2">{agent.message}</p>
                  )}
                  {agent.progress != null && (
                    <AnimatedProgressBar value={agent.progress} />
                  )}
                </div>
              </CardEntrance>
            ))}
          </div>
        </section>
      )}

      {/* ── Active collaborators ── */}
      {presenceUsers.length > 0 && projectActive && (
        <section aria-label="Active collaborators">
          <SlideUp delay={0.15}>
            <div className="flex items-center gap-3">
              <h2 className="text-[11px] font-semibold tracking-widest uppercase
                text-slate-600 font-mono">
                Online Now
              </h2>
            </div>
          </SlideUp>
          <div className="flex flex-wrap gap-2 mt-3">
            {presenceUsers.map((user) => (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-white/[0.04] border border-white/[0.07] text-[12px] text-slate-300"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {user.userName}
                {user.activeSection && (
                  <span className="text-slate-600 text-[11px] font-mono">
                    — {user.activeSection}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Try activating a project ── */}
      {!projectActive && !loading && (
        <SlideUp delay={0.2}>
          <div className="rounded-[16px] border border-dashed border-white/[0.09]
            bg-white/[0.02] p-8 text-center">
            <p className="text-slate-500 text-[13px] mb-4">
              Click <strong className="text-slate-300">New Project</strong> in the header
              to activate a project and see contextual sidebar navigation + realtime agent updates.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-[11px] text-slate-700 font-mono">
              <span className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Sidebar expands project routes
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Header shows project name + status badge
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Realtime agents begin streaming
              </span>
            </div>
          </div>
        </SlideUp>
      )}
    </FadeIn>
  );
};
