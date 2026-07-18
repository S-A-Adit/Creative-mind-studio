/**
 * Step1RoleSelection — onboarding step 1: What best describes you?
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Video, Scissors, FlaskConical, FileText, TrendingUp, Building2, Users, ArrowRight,
} from 'lucide-react';

const ROLES = [
  { id: 'creator', label: 'Content Creator', desc: 'I make videos, articles, or media', icon: <Video className="w-5 h-5" />, color: '#7C3AED' },
  { id: 'editor', label: 'Video Editor', desc: 'I edit and post-produce content', icon: <Scissors className="w-5 h-5" />, color: '#3B82F6' },
  { id: 'researcher', label: 'Researcher', desc: 'I gather data and verify claims', icon: <FlaskConical className="w-5 h-5" />, color: '#6366F1' },
  { id: 'scriptwriter', label: 'Scriptwriter', desc: 'I write scripts and narratives', icon: <FileText className="w-5 h-5" />, color: '#8B5CF6' },
  { id: 'marketing', label: 'Marketing Professional', desc: 'I drive campaigns and growth', icon: <TrendingUp className="w-5 h-5" />, color: '#10B981' },
  { id: 'agency', label: 'Agency', desc: 'I manage multiple client projects', icon: <Building2 className="w-5 h-5" />, color: '#F59E0B' },
  { id: 'student', label: 'Student Team', desc: 'Academic or learning projects', icon: <Users className="w-5 h-5" />, color: '#EC4899' },
];

const ease = [0.22, 1, 0.36, 1] as const;

interface Step1Props {
  onNext: (role: string) => void;
}

export const Step1RoleSelection: React.FC<Step1Props> = ({ onNext }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="px-8 pb-8">
      {/* Heading */}
      <div className="mb-7">
        <h2 className="font-display font-bold text-xl text-white tracking-tight mb-1.5">
          What best describes you?
        </h2>
        <p className="text-slate-400 text-[14px] leading-relaxed">
          We'll personalise your workspace and AI agents for your workflow.
        </p>
      </div>

      {/* Role grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
        {ROLES.map((role, i) => {
          const isSelected = selected === role.id;
          return (
            <motion.button
              key={role.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04, ease }}
              whileHover={{ y: -2 }}
              onClick={() => setSelected(role.id)}
              className={`group relative w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-[#7C3AED]/60 bg-[#7C3AED]/10 shadow-[0_0_20px_rgba(124,58,237,0.2)]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
              }`}
              aria-pressed={isSelected}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="role-selector"
                  className="absolute inset-0 rounded-xl"
                  style={{ boxShadow: `inset 0 0 0 1.5px ${role.color}50` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                style={{
                  backgroundColor: isSelected ? `${role.color}20` : `${role.color}0C`,
                  borderColor: isSelected ? `${role.color}45` : `${role.color}18`,
                  color: isSelected ? role.color : '#64748B',
                }}
              >
                {role.icon}
              </div>

              <div className="min-w-0">
                <p className={`text-[13px] font-semibold transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {role.label}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">{role.desc}</p>
              </div>

              {/* Check dot */}
              <div className={`ml-auto flex-shrink-0 w-4 h-4 rounded-full border transition-all duration-200 ${
                isSelected
                  ? 'border-[#7C3AED] bg-[#7C3AED] shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                  : 'border-white/[0.15]'
              }`}>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <motion.button
        type="button"
        whileHover={{ scale: selected ? 1.015 : 1 }}
        whileTap={{ scale: selected ? 0.985 : 1 }}
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="flex w-full items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)] transition-shadow disabled:opacity-40 disabled:pointer-events-none"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};
