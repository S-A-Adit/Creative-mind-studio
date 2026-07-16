/**
 * ConsensusMeter.tsx — Live consensus & debate progress header for the center panel.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, HelpCircle, Trophy } from 'lucide-react';
import type { DebateState } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGE_LABELS: Record<DebateState['stage'], string> = {
  'brief-review':       'Brief Review',
  'initial-proposals':  'Initial Proposals',
  'challenge-round':    'Challenge Round',
  'rebuttal':           'Rebuttal',
  'synthesis':          'Synthesis',
  'final-vote':         'Final Vote',
  'complete':           'Complete',
};

const STAGE_ORDER: DebateState['stage'][] = [
  'brief-review', 'initial-proposals', 'challenge-round',
  'rebuttal', 'synthesis', 'final-vote', 'complete',
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface ConsensusMeterProps {
  debate: DebateState;
}

export const ConsensusMeter: React.FC<ConsensusMeterProps> = ({ debate }) => {
  const stageIdx = STAGE_ORDER.indexOf(debate.stage);
  const stageProgress = ((stageIdx + 1) / STAGE_ORDER.length) * 100;

  const consensusColor =
    debate.consensusPct >= 80 ? '#10B981' :
    debate.consensusPct >= 60 ? '#F59E0B' :
    '#EF4444';

  return (
    <div className="space-y-4">
      {/* Stage progress rail */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Debate Stage
          </span>
          <span className="text-[12px] font-semibold text-slate-200">{STAGE_LABELS[debate.stage]}</span>
        </div>
        <div className="flex gap-1">
          {STAGE_ORDER.map((stage, i) => {
            const isPast = i < stageIdx;
            const isCurrent = i === stageIdx;
            return (
              <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="h-1.5 w-full rounded-full"
                  style={{
                    backgroundColor: isPast
                      ? '#8B5CF6'
                      : isCurrent
                      ? undefined
                      : 'rgba(255,255,255,0.06)',
                  }}
                  animate={isCurrent ? {
                    background: ['#7C3AED', '#9D6CFF', '#7C3AED'],
                  } : undefined}
                  transition={isCurrent ? { duration: 2, repeat: Infinity } : undefined}
                />
                <span className="text-[8px] font-mono text-slate-700 text-center hidden sm:block truncate w-full text-center">
                  {STAGE_LABELS[stage].split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-1">
          <div className="h-px w-full bg-white/[0.05]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]"
              animate={{ width: `${stageProgress}%` }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </div>
        </div>
      </div>

      {/* Consensus arc + stats row */}
      <div className="flex items-center gap-4">
        {/* Consensus ring */}
        <div className="relative flex-shrink-0">
          <svg width={64} height={64} className="rotate-[-90deg]">
            <circle cx={32} cy={32} r={26} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
            <motion.circle
              cx={32} cy={32} r={26}
              fill="none"
              stroke={consensusColor}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 26}
              animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - debate.consensusPct / 100) }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-[14px] leading-none" style={{ color: consensusColor }}>
              {debate.consensusPct}
            </span>
            <span className="text-[8px] text-slate-600 font-mono">%</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-2">
          <StatPill icon={<Clock className="w-3 h-3" />} label="Elapsed" value={formatTime(debate.elapsedSeconds)} />
          <StatPill icon={<Trophy className="w-3 h-3" />} label="Round" value={`${debate.currentRound} / ${debate.totalRounds}`} />
          <StatPill icon={<MessageSquare className="w-3 h-3" />} label="Messages" value={String(debate.messages.length)} />
          <StatPill icon={<HelpCircle className="w-3 h-3" />} label="Open Qs" value={String(debate.remainingQuestions)} />
        </div>
      </div>
    </div>
  );
};

const StatPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] bg-white/[0.03] border border-white/[0.06]">
    <span className="text-slate-600">{icon}</span>
    <div>
      <p className="text-[9px] font-mono text-slate-700 uppercase tracking-wide">{label}</p>
      <p className="text-[12px] font-mono font-semibold text-slate-200">{value}</p>
    </div>
  </div>
);
