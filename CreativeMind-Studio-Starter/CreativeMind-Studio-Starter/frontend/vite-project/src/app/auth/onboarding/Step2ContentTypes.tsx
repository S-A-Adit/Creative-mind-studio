/**
 * Step2ContentTypes — onboarding step 2: Choose your content types.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlayCircle, Zap, Share2, Mic2, FileText, Package, GraduationCap,
  ArrowRight, ArrowLeft,
} from 'lucide-react';

const CONTENT_TYPES = [
  { id: 'documentary', label: 'YouTube Documentary', icon: <PlayCircle className="w-4 h-4" />, color: '#EF4444', desc: 'Long-form video content' },
  { id: 'shortform', label: 'Short-form Video', icon: <Zap className="w-4 h-4" />, color: '#F59E0B', desc: 'Reels, Shorts, TikTok' },
  { id: 'social', label: 'Social Media Campaign', icon: <Share2 className="w-4 h-4" />, color: '#3B82F6', desc: 'Multi-platform campaigns' },
  { id: 'podcast', label: 'Podcast', icon: <Mic2 className="w-4 h-4" />, color: '#8B5CF6', desc: 'Audio-first content' },
  { id: 'blog', label: 'Blog / Newsletter', icon: <FileText className="w-4 h-4" />, color: '#10B981', desc: 'Written long-form' },
  { id: 'product', label: 'Product Marketing', icon: <Package className="w-4 h-4" />, color: '#EC4899', desc: 'Product demos and ads' },
  { id: 'educational', label: 'Educational Content', icon: <GraduationCap className="w-4 h-4" />, color: '#06B6D4', desc: 'Courses and tutorials' },
];

const ease = [0.22, 1, 0.36, 1] as const;

interface Step2Props {
  onNext: (types: string[]) => void;
  onBack: () => void;
}

export const Step2ContentTypes: React.FC<Step2Props> = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="px-8 pb-8">
      {/* Heading */}
      <div className="mb-7">
        <h2 className="font-display font-bold text-xl text-white tracking-tight mb-1.5">
          Choose your content types
        </h2>
        <p className="text-slate-400 text-[14px] leading-relaxed">
          Select all that apply — you can change this later in your workspace settings.
        </p>
      </div>

      {/* Content type grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
        {CONTENT_TYPES.map((type, i) => {
          const isSelected = selected.has(type.id);
          return (
            <motion.button
              key={type.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04, ease }}
              whileHover={{ y: -1 }}
              onClick={() => toggle(type.id)}
              aria-pressed={isSelected}
              className={`group relative w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-white/[0.15] bg-white/[0.04] shadow-[0_2px_16px_rgba(0,0,0,0.3)]'
                  : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.1] hover:bg-white/[0.03]'
              }`}
            >
              {/* Active glow overlay */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1.5px ${type.color}40` }}
                />
              )}

              <div
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 ${isSelected ? 'scale-105' : ''}`}
                style={{
                  backgroundColor: isSelected ? `${type.color}18` : `${type.color}0C`,
                  borderColor: isSelected ? `${type.color}40` : `${type.color}15`,
                  color: isSelected ? type.color : '#475569',
                }}
              >
                {type.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {type.label}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">{type.desc}</p>
              </div>

              {/* Checkbox */}
              <div className={`flex-shrink-0 w-4.5 h-4.5 rounded border transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? 'border-transparent'
                  : 'border-white/[0.15] bg-transparent'
              }`}
                style={isSelected ? { backgroundColor: type.color } : {}}>
                {isSelected && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    viewBox="0 0 10 10"
                    className="w-2.5 h-2.5"
                  >
                    <polyline
                      points="1.5,5 4,7.5 8.5,2"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selection counter */}
      <p className="text-[12px] text-slate-600 font-mono mb-4 text-center">
        {selected.size === 0
          ? 'Select at least one content type'
          : `${selected.size} type${selected.size > 1 ? 's' : ''} selected`}
      </p>

      {/* Nav */}
      <div className="flex gap-3">
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
          whileHover={{ scale: selected.size > 0 ? 1.015 : 1 }}
          whileTap={{ scale: selected.size > 0 ? 0.985 : 1 }}
          onClick={() => selected.size > 0 && onNext(Array.from(selected))}
          disabled={selected.size === 0}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)] transition-shadow disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
