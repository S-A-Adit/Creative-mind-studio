/**
 * QuestionBoard.tsx — Kanban-style Research Question Board.
 *
 * Drag-and-drop between columns using HTML5 drag API (no external dep).
 * Columns: To Research · In Progress · Needs Verification · Verified · Rejected
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag,
  User,
  Calendar,
  BookOpen,
  Plus,
  GripVertical,
  Clock,
  ChevronDown,
  ChevronUp,
  Bot,
} from 'lucide-react';
import type { ResearchQuestion, QuestionStatus, QuestionPriority } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Column config ────────────────────────────────────────────────────────────

interface ColConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
}

const COLUMNS: Array<{ id: QuestionStatus } & ColConfig> = [
  {
    id: 'to-research',
    label: 'To Research',
    color: '#64748B',
    bg: 'bg-slate-500/08',
    border: 'border-slate-500/20',
    dot: 'bg-slate-500',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    color: '#3B82F6',
    bg: 'bg-blue-500/08',
    border: 'border-blue-500/20',
    dot: 'bg-blue-500',
  },
  {
    id: 'needs-verification',
    label: 'Needs Verification',
    color: '#F59E0B',
    bg: 'bg-amber-500/08',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500',
  },
  {
    id: 'verified',
    label: 'Verified',
    color: '#10B981',
    bg: 'bg-emerald-500/08',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    color: '#EF4444',
    bg: 'bg-red-500/08',
    border: 'border-red-500/20',
    dot: 'bg-red-500',
  },
];

// ─── Priority config ──────────────────────────────────────────────────────────

const PRIORITY_CFG: Record<QuestionPriority, { label: string; badge: string }> = {
  critical: { label: 'Critical', badge: 'text-red-400 bg-red-500/10 border-red-500/25' },
  high:     { label: 'High',     badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25' },
  medium:   { label: 'Medium',   badge: 'text-amber-400 bg-amber-500/10 border-amber-500/25' },
  low:      { label: 'Low',      badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
};

// ─── Single question card ─────────────────────────────────────────────────────

interface QuestionCardProps {
  question: ResearchQuestion;
  onDragStart: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onDragStart }) => {
  const [expanded, setExpanded] = useState(false);
  const pri = PRIORITY_CFG[question.priority];
  const col = COLUMNS.find(c => c.id === question.status)!;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22, ease: EASE }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      draggable
      onDragStart={() => onDragStart(question.id)}
      className="group relative rounded-[14px] border border-white/[0.08] bg-[#10101A]/90
        cursor-grab active:cursor-grabbing transition-all duration-200
        hover:border-white/[0.15] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
      role="article"
      aria-label={`Research question: ${question.question}`}
    >
      {/* Color accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[14px]"
        style={{ background: `linear-gradient(90deg, transparent, ${col.color}60, transparent)` }}
      />

      {/* Drag handle + header */}
      <div className="flex items-start gap-2.5 p-3.5">
        <GripVertical className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5 group-hover:text-slate-500 transition-colors" />

        <div className="flex-1 min-w-0">
          {/* Priority + sources */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border ${pri.badge}`}>
              <Flag className="w-2.5 h-2.5" />
              {pri.label}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
              <BookOpen className="w-3 h-3" />
              <span>{question.sourceCount} sources</span>
            </div>
          </div>

          {/* Question text */}
          <p className="text-[12px] font-medium text-slate-200 leading-snug mb-2.5">
            {question.question}
          </p>

          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {question.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[9px] font-mono text-slate-600 px-1.5 py-0.5
                  rounded-full bg-white/[0.04] border border-white/[0.06]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
            {/* Researcher */}
            <div className="flex items-center gap-1">
              {question.assignedResearcher.isAi
                ? <Bot className="w-3 h-3" />
                : <User className="w-3 h-3" />
              }
              <span
                className="font-medium"
                style={{ color: question.assignedResearcher.color }}
              >
                {question.assignedResearcher.initials}
              </span>
            </div>
            {/* Deadline */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{question.deadline}</span>
            </div>
          </div>

          {/* Sub-questions toggle */}
          {question.subQuestions && question.subQuestions.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setExpanded(e => !e)}
                className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono
                  text-slate-600 hover:text-slate-400 transition-colors"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {question.subQuestions.length} sub-question{question.subQuestions.length > 1 ? 's' : ''}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-1.5 pl-2 border-l border-white/[0.07]">
                      {question.subQuestions.map((sq, i) => (
                        <p key={i} className="text-[11px] text-slate-500 leading-snug">{sq}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Add sub-question footer */}
      <div className="border-t border-white/[0.05] px-3.5 py-2">
        <button
          type="button"
          className="flex items-center gap-1.5 text-[10px] font-mono text-slate-700
            hover:text-slate-400 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add sub-question
        </button>
      </div>
    </motion.div>
  );
};

// ─── Kanban column ────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  config: typeof COLUMNS[number];
  questions: ResearchQuestion[];
  onDragStart: (id: string) => void;
  onDrop: (status: QuestionStatus) => void;
  isDragOver: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  config,
  questions,
  onDragStart,
  onDrop,
  isDragOver,
  onDragEnter,
  onDragLeave,
}) => (
  <div
    className={`flex flex-col gap-2.5 min-h-[200px] rounded-2xl p-3 border transition-all duration-200
      ${isDragOver ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/04' : `${config.border} ${config.bg}`}`}
    onDragOver={e => e.preventDefault()}
    onDrop={() => onDrop(config.id)}
    onDragEnter={onDragEnter}
    onDragLeave={onDragLeave}
  >
    {/* Column header */}
    <div className="flex items-center gap-2 px-1 mb-1">
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span className="text-[11px] font-mono font-semibold uppercase tracking-widest" style={{ color: config.color }}>
        {config.label}
      </span>
      <span className="ml-auto text-[10px] font-mono text-slate-700">
        {questions.length}
      </span>
    </div>

    {/* Cards */}
    <AnimatePresence mode="popLayout">
      {questions.map(q => (
        <QuestionCard key={q.id} question={q} onDragStart={onDragStart} />
      ))}
    </AnimatePresence>

    {/* Drop hint */}
    {questions.length === 0 && !isDragOver && (
      <div className="flex-1 flex items-center justify-center min-h-[80px]">
        <p className="text-[10px] font-mono text-slate-700">Drop here</p>
      </div>
    )}

    {isDragOver && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-16 rounded-xl border-2 border-dashed border-[#8B5CF6]/40 bg-[#8B5CF6]/04
          flex items-center justify-center"
      >
        <p className="text-[10px] font-mono text-[#8B5CF6]/70">Move here</p>
      </motion.div>
    )}
  </div>
);

// ─── Public component ─────────────────────────────────────────────────────────

interface QuestionBoardProps {
  questions: ResearchQuestion[];
}

export const QuestionBoard: React.FC<QuestionBoardProps> = ({ questions: initialQuestions }) => {
  const [questions, setQuestions] = useState<ResearchQuestion[]>(initialQuestions);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<QuestionStatus | null>(null);

  const handleDragStart = (id: string) => setDraggingId(id);

  const handleDrop = (status: QuestionStatus) => {
    if (!draggingId) return;
    setQuestions(prev =>
      prev.map(q => q.id === draggingId ? { ...q, status } : q)
    );
    setDraggingId(null);
    setDragOverCol(null);
  };

  return (
    <div className="space-y-3">
      {/* Clock indicator */}
      <div className="flex items-center gap-2 px-1">
        <Clock className="w-3 h-3 text-slate-600" />
        <p className="text-[10px] font-mono text-slate-600">
          Drag cards between columns to update research status
        </p>
      </div>

      {/* Columns — horizontal scroll on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-2 min-h-[300px]">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex-shrink-0 w-[220px] lg:w-auto lg:flex-1">
            <KanbanColumn
              config={col}
              questions={questions.filter(q => q.status === col.id)}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              isDragOver={dragOverCol === col.id}
              onDragEnter={() => setDragOverCol(col.id)}
              onDragLeave={() => setDragOverCol(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
