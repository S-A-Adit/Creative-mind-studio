/**
 * WizardRightSidebar.tsx — Live preview panel shown alongside the wizard.
 *
 * Sections:
 *   • Estimated Timeline
 *   • Suggested AI Agents
 *   • Workflow Preview
 *   • Project Health (placeholder)
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Bot,
  GitBranch,
  HeartPulse,
  CheckCircle2,
  Clock,
  CircleDot,
} from 'lucide-react';
import type { ProjectWizardData } from '../types';
import { SUGGESTED_AGENTS, WORKFLOW_STAGES } from '../mockData';
import { ease } from '../../../lib/motion-constants';

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="text-slate-600">{icon}</span>
    <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest font-mono">
      {title}
    </h4>
  </div>
);

// ─── Estimated Timeline ───────────────────────────────────────────────────────

const EstimatedTimeline: React.FC<{ deadline: string }> = ({ deadline }) => {
  const totalDays = WORKFLOW_STAGES.reduce((sum, s) => sum + s.durationDays, 0);

  const deadlineDays = useMemo(() => {
    if (!deadline) return null;
    const nowMs = new Date().getTime();
    return Math.max(0, Math.ceil((new Date(deadline).getTime() - nowMs) / 86_400_000));
  }, [deadline]);

  const isOverdue = deadlineDays !== null && deadlineDays < totalDays;

  return (
    <div className="rounded-[12px] border border-white/[0.07] bg-[#0B0B12] p-4 space-y-3">
      <SectionHeader icon={<CalendarDays className="w-3.5 h-3.5" />} title="Timeline" />

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[24px] font-bold text-slate-100 font-mono leading-none">
            {totalDays}
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">estimated days</p>
        </div>

        {deadlineDays !== null && (
          <div className={`text-right ${isOverdue ? 'text-red-400' : 'text-emerald-400'}`}>
            <p className="text-[14px] font-semibold font-mono">{deadlineDays}d left</p>
            <p className={`text-[10px] font-mono ${isOverdue ? 'text-red-500' : 'text-slate-600'}`}>
              {isOverdue ? 'Tight — adjust scope' : 'On track'}
            </p>
          </div>
        )}
      </div>

      {/* Mini stage bars */}
      <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden">
        {WORKFLOW_STAGES.map(stage => (
          <motion.div
            key={stage.id}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: ease.snappy, delay: 0.1 }}
            style={{
              flex: stage.durationDays,
              transformOrigin: 'left',
              background:
                stage.status === 'active'
                  ? 'rgba(139,92,246,0.9)'
                  : stage.status === 'blocked'
                  ? 'rgba(239,68,68,0.6)'
                  : 'rgba(255,255,255,0.08)',
            }}
            className="rounded-full"
            title={`${stage.label}: ${stage.durationDays}d`}
          />
        ))}
      </div>
      <p className="text-[10px] text-slate-700 font-mono">
        Strategy → Research → Script → Production → Review → Publish
      </p>
    </div>
  );
};

// ─── Suggested AI Agents ──────────────────────────────────────────────────────

const statusConfig = {
  ready:   { label: 'Ready',   dot: 'bg-emerald-400' },
  standby: { label: 'Standby', dot: 'bg-amber-400'   },
  queued:  { label: 'Queued',  dot: 'bg-slate-600'   },
};

const SuggestedAgents: React.FC = () => (
  <div className="rounded-[12px] border border-white/[0.07] bg-[#0B0B12] p-4 space-y-3">
    <SectionHeader icon={<Bot className="w-3.5 h-3.5" />} title="AI Agents" />
    <div className="space-y-2">
      {SUGGESTED_AGENTS.map((agent, i) => {
        const cfg = statusConfig[agent.status];
        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, delay: i * 0.05, ease: ease.gentle }}
            className="flex items-center gap-3"
          >
            {/* Avatar */}
            <div className="flex-shrink-0 w-7 h-7 rounded-[8px] bg-gradient-to-br
              from-[#7C3AED]/25 to-[#9D6CFF]/10 border border-[#8B5CF6]/20
              flex items-center justify-center text-[10px] font-bold text-[#9D6CFF]">
              {agent.avatar}
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-slate-300 truncate">{agent.name}</p>
              <p className="text-[10px] text-slate-600 truncate">{agent.role}</p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              <span className="text-[10px] font-mono text-slate-600">{cfg.label}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

// ─── Workflow Preview ─────────────────────────────────────────────────────────

const WorkflowPreview: React.FC = () => (
  <div className="rounded-[12px] border border-white/[0.07] bg-[#0B0B12] p-4 space-y-3">
    <SectionHeader icon={<GitBranch className="w-3.5 h-3.5" />} title="Workflow" />
    <div className="space-y-1.5">
      {WORKFLOW_STAGES.map((stage, i) => (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04, ease: ease.gentle }}
          className="flex items-center gap-2.5"
        >
          {/* Connector line */}
          <div className="flex flex-col items-center">
            <CircleDot className="w-3 h-3 text-slate-700 flex-shrink-0" />
            {i < WORKFLOW_STAGES.length - 1 && (
              <div className="w-px h-3 bg-white/[0.06] mt-0.5" />
            )}
          </div>

          <div className="flex items-center justify-between flex-1 pb-1.5">
            <span className="text-[12px] text-slate-400">{stage.label}</span>
            <span className="text-[10px] font-mono text-slate-700">{stage.durationDays}d</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Project Health (placeholder) ────────────────────────────────────────────

const ProjectHealth: React.FC<{ formData: ProjectWizardData }> = ({ formData }) => {
  const checks = [
    { label: 'Title defined',      ok: formData.step1.projectTitle.trim().length >= 3 },
    { label: 'Category set',       ok: !!formData.step1.contentCategory },
    { label: 'Platform chosen',    ok: !!formData.step1.targetPlatform },
    { label: 'Creative idea',      ok: formData.step2.rawIdea.trim().length >= 10 },
    { label: 'Tone selected',      ok: !!formData.step2.tone },
    { label: 'Language chosen',    ok: !!formData.step2.language },
  ];

  const passCount = checks.filter(c => c.ok).length;
  const healthPct = Math.round((passCount / checks.length) * 100);

  const healthColor =
    healthPct >= 80 ? 'text-emerald-400' :
    healthPct >= 50 ? 'text-amber-400' :
    'text-red-400';

  const barColor =
    healthPct >= 80 ? 'from-emerald-500 to-emerald-400' :
    healthPct >= 50 ? 'from-amber-500 to-amber-400' :
    'from-red-500 to-red-400';

  return (
    <div className="rounded-[12px] border border-white/[0.07] bg-[#0B0B12] p-4 space-y-3">
      <SectionHeader icon={<HeartPulse className="w-3.5 h-3.5" />} title="Project Health" />

      {/* Score */}
      <div className="flex items-center gap-3">
        <span className={`text-[28px] font-bold font-mono leading-none ${healthColor}`}>
          {healthPct}
        </span>
        <div className="flex-1">
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
              animate={{ width: `${healthPct}%` }}
              transition={{ duration: 0.4, ease: ease.snappy }}
            />
          </div>
          <p className="text-[10px] text-slate-700 mt-1 font-mono">
            {passCount} / {checks.length} checks passed
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 gap-1">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {c.ok ? (
                <motion.span
                  key="ok"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, ease: ease.snappy }}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                </motion.span>
              ) : (
                <motion.span key="no" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Clock className="w-3 h-3 text-slate-700 flex-shrink-0" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className={`text-[11px] ${c.ok ? 'text-slate-400' : 'text-slate-700'}`}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

interface WizardRightSidebarProps {
  formData: ProjectWizardData;
}

export const WizardRightSidebar: React.FC<WizardRightSidebarProps> = ({ formData }) => {
  return (
    <aside
      aria-label="Project preview"
      className="flex flex-col gap-4 w-full"
    >
      <EstimatedTimeline deadline={formData.step2.deadline} />
      <SuggestedAgents />
      <WorkflowPreview />
      <ProjectHealth formData={formData} />
    </aside>
  );
};
