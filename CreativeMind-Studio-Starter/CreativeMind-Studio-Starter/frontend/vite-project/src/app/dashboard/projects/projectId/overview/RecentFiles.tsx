/**
 * RecentFiles.tsx — Recently uploaded file cards for the Project Overview page.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FileImage,
  Film,
  Music,
  Table2,
  File,
  Download,
  ExternalLink,
} from 'lucide-react';
import type { RecentFile, FileType } from './types';
import { ease } from '../../../../../lib/motion-constants';

// ─── File type config ─────────────────────────────────────────────────────────

const FILE_TYPE_CONFIG: Record<FileType, {
  icon: React.ReactNode;
  color: string;
  bg: string;
  label: string;
}> = {
  pdf:    { icon: <FileText className="w-4 h-4" />,  color: '#EF4444', bg: 'bg-red-500/15',    label: 'PDF'    },
  doc:    { icon: <FileText className="w-4 h-4" />,  color: '#3B82F6', bg: 'bg-blue-500/15',   label: 'DOC'    },
  video:  { icon: <Film className="w-4 h-4" />,      color: '#7C3AED', bg: 'bg-violet-500/15', label: 'Video'  },
  image:  { icon: <FileImage className="w-4 h-4" />, color: '#F59E0B', bg: 'bg-amber-500/15',  label: 'Image'  },
  audio:  { icon: <Music className="w-4 h-4" />,     color: '#10B981', bg: 'bg-emerald-500/15',label: 'Audio'  },
  script: { icon: <FileText className="w-4 h-4" />,  color: '#9D6CFF', bg: 'bg-purple-500/15', label: 'Script' },
  csv:    { icon: <Table2 className="w-4 h-4" />,    color: '#06B6D4', bg: 'bg-cyan-500/15',   label: 'CSV'    },
};

// ─── Time ago ─────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Single file row ──────────────────────────────────────────────────────────

const FileRow: React.FC<{ file: RecentFile; index: number }> = ({ file, index }) => {
  const cfg = FILE_TYPE_CONFIG[file.type] ?? {
    icon: <File className="w-4 h-4" />,
    color: '#94A3B8',
    bg: 'bg-slate-500/15',
    label: 'File',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04, ease: ease.gentle }}
      className="group flex items-center gap-3 p-3 -mx-1 rounded-xl
        hover:bg-white/[0.03] transition-colors duration-150"
    >
      {/* File icon */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
          border transition-all duration-200 group-hover:scale-105 ${cfg.bg}`}
        style={{ color: cfg.color, borderColor: cfg.color + '30' }}
      >
        {cfg.icon}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-slate-200 truncate leading-tight">
          {file.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full"
            style={{ color: cfg.color, background: cfg.color + '15' }}
          >
            {cfg.label}
          </span>
          <span className="text-[10px] text-slate-600 font-mono">{file.size}</span>
          <span className="text-[10px] text-slate-700 font-mono">{timeAgo(file.uploadedAt)}</span>
        </div>
      </div>

      {/* Uploader */}
      <div className="flex-shrink-0 flex items-center gap-1.5">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{
            background: file.uploadedBy.color + '28',
            color: file.uploadedBy.color,
          }}
        >
          {file.uploadedBy.initials}
        </div>
        <span className="hidden sm:block text-[11px] text-slate-600 max-w-[72px] truncate">
          {file.uploadedBy.name.split(' ')[0]}
        </span>
      </div>

      {/* Action buttons — appear on hover */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          type="button"
          aria-label={`Download ${file.name}`}
          className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center
            text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-colors duration-150"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Open ${file.name}`}
          className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center
            text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-colors duration-150"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Section ─────────────────────────────────────────────────────────────────

interface RecentFilesProps {
  files: RecentFile[];
}

export const RecentFiles: React.FC<RecentFilesProps> = ({ files }) => (
  <section aria-label="Recent files">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-display font-semibold text-[16px] text-white tracking-tight">
          Recent Files
        </h2>
        <p className="text-[12px] text-slate-500 font-mono mt-0.5">
          {files.length} files uploaded this project
        </p>
      </div>
      <button
        type="button"
        className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors duration-150"
      >
        View all
      </button>
    </div>

    <div className="rounded-2xl border border-white/[0.07] bg-[#10101A]/70 backdrop-blur-sm px-4 py-3">
      <div className="divide-y divide-white/[0.04]">
        {files.map((f, i) => (
          <FileRow key={f.id} file={f} index={i} />
        ))}
      </div>
    </div>
  </section>
);
