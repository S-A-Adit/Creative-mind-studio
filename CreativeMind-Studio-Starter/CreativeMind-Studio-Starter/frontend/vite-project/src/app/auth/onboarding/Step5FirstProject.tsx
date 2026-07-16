/**
 * Step5FirstProject — onboarding step 5: Create your first project.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder, ArrowLeft, Sparkles, CheckCircle2, Lightbulb,
  TrendingUp, FlaskConical, Film,
} from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const TEMPLATES = [
  {
    id: 'documentary',
    label: 'Documentary',
    desc: 'Deep-dive research-backed video content',
    icon: <Film className="w-5 h-5" />,
    color: '#7C3AED',
    steps: ['Strategy', 'Research', 'Script', 'Scene Plan', 'Assets', 'Edit'],
  },
  {
    id: 'campaign',
    label: 'Marketing Campaign',
    desc: 'Multi-channel creative campaign',
    icon: <TrendingUp className="w-5 h-5" />,
    color: '#10B981',
    steps: ['Strategy', 'Content Plan', 'Assets', 'Publish'],
  },
  {
    id: 'research',
    label: 'Research Report',
    desc: 'Evidence-heavy written content',
    icon: <FlaskConical className="w-5 h-5" />,
    color: '#3B82F6',
    steps: ['Research', 'Evidence Map', 'Script', 'Review', 'Publish'],
  },
  {
    id: 'blank',
    label: 'Blank Project',
    desc: 'Start from scratch',
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#F59E0B',
    steps: ['All stages available'],
  },
];

interface Step5Props {
  onFinish: (project: { name: string; template: string }) => void;
  onBack: () => void;
}

export const Step5FirstProject: React.FC<Step5Props> = ({ onFinish, onBack }) => {
  const [projectName, setProjectName] = useState('');
  const [nameError, setNameError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setNameError('Project name is required.');
      return;
    }
    if (!selectedTemplate) {
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setDone(true);
    setTimeout(() => onFinish({ name: projectName.trim(), template: selectedTemplate }), 1400);
  };

  return (
    <div className="px-8 pb-8">
      <div className="mb-7">
        <h2 className="font-display font-bold text-xl text-white tracking-tight mb-1.5">
          Create your first project
        </h2>
        <p className="text-slate-400 text-[14px] leading-relaxed">
          Name your project and choose a template to fast-track your production pipeline.
        </p>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[13px] mb-5"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Project created — launching your workspace…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project name */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-300 tracking-wide mb-1.5 block">
          Project Name <span className="text-[#7C3AED]">*</span>
        </label>
        <div className="relative">
          <Folder className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="e.g. The Future of AI Content"
            className={`w-full bg-slate-950/50 text-slate-200 border ${
              nameError ? 'border-red-500/50' : 'border-slate-800/80 focus:border-[#7C3AED]/60'
            } rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20`}
          />
        </div>
        {nameError && <p className="text-[11px] text-red-400 mt-1">{nameError}</p>}
      </div>

      {/* Templates */}
      <div className="mb-2">
        <label className="text-xs font-semibold text-slate-300 tracking-wide mb-3 block">
          Choose a Template
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TEMPLATES.map((tmpl, i) => {
            const isSelected = selectedTemplate === tmpl.id;
            return (
              <motion.button
                key={tmpl.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04, ease }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedTemplate(tmpl.id)}
                aria-pressed={isSelected}
                className={`group relative w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-white/[0.15] bg-white/[0.04]'
                    : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.1]'
                }`}
              >
                {isSelected && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${tmpl.color}45` }}
                  />
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 transition-transform duration-200 ${isSelected ? 'scale-105' : ''}`}
                    style={{
                      backgroundColor: isSelected ? `${tmpl.color}18` : `${tmpl.color}0C`,
                      borderColor: isSelected ? `${tmpl.color}40` : `${tmpl.color}15`,
                      color: isSelected ? tmpl.color : '#475569',
                    }}
                  >
                    {tmpl.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {tmpl.label}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{tmpl.desc}</p>
                  </div>
                </div>

                {/* Pipeline preview */}
                <div className="flex flex-wrap gap-1">
                  {tmpl.steps.map((step) => (
                    <span
                      key={step}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                      style={{
                        color: isSelected ? tmpl.color : '#475569',
                        borderColor: isSelected ? `${tmpl.color}30` : 'rgba(255,255,255,0.06)',
                        backgroundColor: isSelected ? `${tmpl.color}10` : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {!selectedTemplate && (
        <p className="text-[11px] text-slate-700 font-mono text-center mb-5 mt-2">
          Select a template to continue
        </p>
      )}

      {/* Nav */}
      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 text-[13px] hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <motion.button
          type="button"
          whileHover={{ scale: selectedTemplate && projectName ? 1.015 : 1 }}
          whileTap={{ scale: selectedTemplate && projectName ? 0.985 : 1 }}
          onClick={handleCreate}
          disabled={isLoading || done || !selectedTemplate}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)] transition-shadow disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Launch Workspace
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
