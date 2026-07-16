/**
 * DocumentPreview.tsx — Preview cards for research documents.
 *
 * Supports: PDF, Article, Report, Image, Dataset.
 * Displays: title, thumbnail gradient, metadata, open-preview button.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  BookOpen,
  BarChart2,
  Image,
  Database,
  ExternalLink,
  Calendar,
  HardDrive,
  FileDigit,
} from 'lucide-react';
import type { ResearchDocument, DocumentType } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Document type config ─────────────────────────────────────────────────────

const DOC_TYPE_CFG: Record<DocumentType, {
  label: string;
  icon: React.ReactNode;
  badge: string;
}> = {
  'pdf':     { label: 'PDF',     icon: <FileText  className="w-5 h-5" />, badge: 'text-red-400    bg-red-500/10    border-red-500/25'    },
  'article': { label: 'Article', icon: <BookOpen  className="w-5 h-5" />, badge: 'text-blue-400   bg-blue-500/10   border-blue-500/25'   },
  'report':  { label: 'Report',  icon: <BarChart2 className="w-5 h-5" />, badge: 'text-violet-400 bg-violet-500/10 border-violet-500/25' },
  'image':   { label: 'Image',   icon: <Image     className="w-5 h-5" />, badge: 'text-teal-400   bg-teal-500/10   border-teal-500/25'   },
  'dataset': { label: 'Dataset', icon: <Database  className="w-5 h-5" />, badge: 'text-amber-400  bg-amber-500/10  border-amber-500/25'  },
};

// ─── Single card ──────────────────────────────────────────────────────────────

interface DocumentPreviewCardProps {
  doc: ResearchDocument;
  index: number;
}

const DocumentPreviewCard: React.FC<DocumentPreviewCardProps> = ({ doc, index }) => {
  const cfg = DOC_TYPE_CFG[doc.documentType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.06, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="group relative rounded-2xl border border-white/[0.07] bg-[#10101A] overflow-hidden
        transition-all duration-200 hover:border-white/[0.15]"
    >
      {/* Thumbnail */}
      <div className={`relative h-24 bg-gradient-to-br ${doc.thumbnailGradient} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm
          border border-white/20 flex items-center justify-center text-white">
          {cfg.icon}
        </div>

        {/* Doc type badge */}
        <span className={`absolute top-2 right-2 text-[9px] font-mono font-bold uppercase tracking-widest
          px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2.5">
        <h4 className="font-display font-semibold text-[12px] text-slate-200 leading-snug line-clamp-2">
          {doc.title}
        </h4>

        {/* Meta */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
            <BookOpen className="w-3 h-3" />
            <span className="truncate">{doc.publisher}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{doc.dateAdded}</span>
            </div>
            {doc.fileSize && (
              <div className="flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                <span>{doc.fileSize}</span>
              </div>
            )}
            {doc.pageCount && (
              <div className="flex items-center gap-1">
                <FileDigit className="w-3 h-3" />
                <span>{doc.pageCount} pp.</span>
              </div>
            )}
          </div>
        </div>

        {/* Open preview button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-[9px] text-[11px]
            font-mono text-slate-500 border border-white/[0.07] bg-white/[0.03]
            hover:text-[#9D6CFF] hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/08
            transition-all duration-150"
        >
          <ExternalLink className="w-3 h-3" />
          Open Preview
        </button>
      </div>
    </motion.div>
  );
};

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface DocumentPreviewGridProps {
  documents: ResearchDocument[];
}

export const DocumentPreviewGrid: React.FC<DocumentPreviewGridProps> = ({ documents }) => (
  <section aria-label="Document previews">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-display font-semibold text-[15px] text-white tracking-tight">
          Research Documents
        </h3>
        <p className="text-[11px] font-mono text-slate-500 mt-0.5">
          {documents.length} documents attached to this project
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {documents.map((doc, i) => (
        <DocumentPreviewCard key={doc.id} doc={doc} index={i} />
      ))}
    </div>
  </section>
);
