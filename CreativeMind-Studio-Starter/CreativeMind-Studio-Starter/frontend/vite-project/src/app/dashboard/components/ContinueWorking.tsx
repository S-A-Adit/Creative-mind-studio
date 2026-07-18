/**
 * ContinueWorking — horizontal-scroll recent project cards.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Plus } from 'lucide-react';
import type { RecentProject, ProjectStage } from '../hooks/useDashboardData';

const ease = [0.22, 1, 0.36, 1] as const;

const STAGE_COLORS: Record<ProjectStage, string> = {
  Idea: '#94A3B8',
  Strategy: '#7C3AED',
  Research: '#6366F1',
  Script: '#3B82F6',
  Assets: '#06B6D4',
  Editing: '#10B981',
  Review: '#F59E0B',
  Published: '#EC4899',
};

const ProjectCard: React.FC<{ project: RecentProject; index: number }> = ({ project, index }) => {
  const stageColor = STAGE_COLORS[project.stage];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07, ease }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="group relative flex-shrink-0 w-72 sm:w-80 flex flex-col rounded-2xl border border-white/[0.07] bg-[#10101A]/80 backdrop-blur-sm overflow-hidden hover:border-white/[0.13] transition-all duration-200"
    >
      {/* Thumbnail */}
      <div
        className={`relative h-28 flex items-center justify-center overflow-hidden bg-gradient-to-br ${project.thumbnailGradient}`}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Stage badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border"
            style={{
              color: stageColor,
              backgroundColor: `${stageColor}18`,
              borderColor: `${stageColor}35`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: stageColor }}
            />
            {project.stage}
          </span>
        </div>
        {/* Content type badge */}
        <div className="absolute top-3 right-3">
          <span className="text-[9px] font-mono text-slate-500 bg-black/40 border border-white/[0.07] px-1.5 py-0.5 rounded-full">
            {project.contentType}
          </span>
        </div>
        {/* Completion arc — simplified */}
        <div
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: `${project.color}50` }}
        >
          <span
            className="font-display font-bold text-lg"
            style={{ color: project.color }}
          >
            {project.completion}%
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-display font-semibold text-[14px] text-white leading-snug line-clamp-2 mb-3">
          {project.title}
        </h3>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${project.completion}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease }}
              style={{ background: `linear-gradient(90deg, ${project.color}80, ${project.color})` }}
            />
          </div>
        </div>

        {/* Team + time */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex -space-x-1.5">
            {project.team.slice(0, 4).map((member) => (
              <div
                key={member.id}
                title={member.name}
                className="w-6 h-6 rounded-full border-2 border-[#10101A] flex items-center justify-center text-[9px] font-bold font-mono"
                style={{
                  background: `linear-gradient(135deg, ${member.color}45, ${member.color}20)`,
                  color: member.color,
                }}
              >
                {member.initials}
              </div>
            ))}
            {project.team.length > 4 && (
              <div className="w-6 h-6 rounded-full border-2 border-[#10101A] bg-slate-800 flex items-center justify-center text-[9px] font-mono text-slate-500">
                +{project.team.length - 4}
              </div>
            )}
          </div>
          <span className="flex items-center gap-1 text-[10px] text-slate-600 font-mono">
            <Clock className="w-3 h-3" />
            {project.lastActivity}
          </span>
        </div>
      </div>

      {/* Continue button */}
      <div className="px-4 pb-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.09] text-[12px] font-semibold text-slate-300 hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-200"
        >
          Continue
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

interface ContinueWorkingProps {
  projects: RecentProject[];
}

export const ContinueWorking: React.FC<ContinueWorkingProps> = ({ projects }) => (
  <section aria-label="Recent projects" className="overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
          Continue Working
        </h2>
        <p className="text-[12px] text-slate-500 font-mono mt-0.5">
          {projects.length} active projects
        </p>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 text-[12px] text-[#9D6CFF] hover:text-white transition-colors font-medium"
      >
        View all projects
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>

    <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:-mx-8 md:px-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}

      {/* New project card */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: projects.length * 0.07 }}
        whileHover={{ y: -4, transition: { duration: 0.15 } }}
        className="flex-shrink-0 w-72 sm:w-80 min-h-[220px] rounded-2xl border border-dashed border-white/[0.09] flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-slate-300 hover:border-[#7C3AED]/30 transition-all duration-200 group"
      >
        <div className="w-12 h-12 rounded-2xl border border-dashed border-white/[0.1] group-hover:border-[#7C3AED]/35 flex items-center justify-center transition-colors duration-200">
          <Plus className="w-5 h-5" />
        </div>
        <div className="text-center px-6">
          <p className="text-[13px] font-semibold group-hover:text-white transition-colors">
            New Project
          </p>
          <p className="text-[11px] font-mono mt-0.5">Start from scratch or template</p>
        </div>
      </motion.button>
    </div>
  </section>
);
