/**
 * Step3Workspace — onboarding step 3: Create or join a workspace.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Hash, ArrowRight, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { FormField } from '../components/FormField';

const ease = [0.22, 1, 0.36, 1] as const;

type Mode = 'choose' | 'create' | 'join';

interface Step3Props {
  onNext: (workspace: { mode: 'create' | 'join'; name?: string; code?: string }) => void;
  onBack: () => void;
}

const WORKSPACE_COLORS = [
  '#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4',
];

export const Step3Workspace: React.FC<Step3Props> = ({ onNext, onBack }) => {
  const [mode, setMode] = useState<Mode>('choose');
  const [workspaceName, setWorkspaceName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [nameError, setNameError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [selectedColor, setSelectedColor] = useState(WORKSPACE_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const initials = workspaceName.trim().slice(0, 2).toUpperCase() || '??';

  const handleCreate = async () => {
    if (!workspaceName.trim()) {
      setNameError('Workspace name is required.');
      return;
    }
    if (workspaceName.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    onNext({ mode: 'create', name: workspaceName.trim() });
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      setCodeError('Invite code is required.');
      return;
    }
    if (joinCode.trim().length < 6) {
      setCodeError('Enter a valid 6+ character invite code.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    onNext({ mode: 'join', code: joinCode.trim() });
  };

  return (
    <div className="px-8 pb-8">
      <div className="mb-7">
        <h2 className="font-display font-bold text-xl text-white tracking-tight mb-1.5">
          Set up your workspace
        </h2>
        <p className="text-slate-400 text-[14px] leading-relaxed">
          Create a brand-new workspace or join one your team has already set up.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease }}
            className="space-y-3 mb-7"
          >
            {/* Create card */}
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => setMode('create')}
              className="group w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/06 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/25 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5 text-[#9D6CFF]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-white mb-0.5">Create a new workspace</p>
                <p className="text-[12px] text-slate-500">Start fresh with a clean slate and invite your team.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#9D6CFF] transition-colors" />
            </motion.button>

            {/* Join card */}
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => setMode('join')}
              className="group w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/06 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/12 border border-[#3B82F6]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Hash className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-white mb-0.5">Join an existing workspace</p>
                <p className="text-[12px] text-slate-500">Enter an invite code from your team admin.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#3B82F6] transition-colors" />
            </motion.button>
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease }}
            className="space-y-5 mb-7"
          >
            {/* Preview */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold font-display text-white border transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${selectedColor}40, ${selectedColor}20)`,
                  borderColor: `${selectedColor}40`,
                }}
              >
                {initials}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">
                  {workspaceName.trim() || 'Your Workspace'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">Pro Plan · Private</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 tracking-wide mb-1.5 block">
                Workspace Name <span className="text-[#7C3AED]">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => {
                    setWorkspaceName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="Apex Media Studio"
                  className={`w-full bg-slate-950/50 text-slate-200 border ${
                    nameError ? 'border-red-500/50' : 'border-slate-800/80 focus:border-[#7C3AED]/60'
                  } rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:bg-slate-950/80`}
                />
              </div>
              {nameError && (
                <p className="text-[11px] text-red-400 mt-1">{nameError}</p>
              )}
            </div>

            {/* Color picker */}
            <div>
              <label className="text-xs font-semibold text-slate-300 tracking-wide mb-2 block">
                Workspace Color
              </label>
              <div className="flex gap-2">
                {WORKSPACE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className="w-7 h-7 rounded-lg border-2 transition-all duration-150 flex items-center justify-center"
                    style={{
                      backgroundColor: color,
                      borderColor: selectedColor === color ? 'white' : 'transparent',
                      opacity: selectedColor === color ? 1 : 0.6,
                    }}
                  >
                    {selectedColor === color && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease }}
            className="space-y-4 mb-7"
          >
            <div className="p-4 rounded-xl bg-[#3B82F6]/06 border border-[#3B82F6]/15 mb-2">
              <p className="text-[13px] text-slate-300 leading-relaxed">
                Ask your workspace admin for an invite code. It looks like{' '}
                <span className="font-mono text-[#3B82F6] text-[12px]">APX-7F3K2M</span>.
              </p>
            </div>
            <FormField
              label="Invite Code"
              name="joinCode"
              type="text"
              value={joinCode}
              onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                if (codeError) setCodeError('');
              }}
              error={codeError}
              placeholder="e.g. APX-7F3K2M"
              autoComplete="off"
              leftIcon={<Hash className="w-4 h-4" />}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            if (mode !== 'choose') setMode('choose');
            else onBack();
          }}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 text-[13px] hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        {mode !== 'choose' && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={mode === 'create' ? handleCreate : handleJoin}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)] transition-shadow disabled:opacity-60 disabled:pointer-events-none"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                {mode === 'create' ? 'Create Workspace' : 'Join Workspace'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};
