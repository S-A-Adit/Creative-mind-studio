/**
 * UploadArea.tsx — Drag-and-drop upload zone with active upload cards.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development only.
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Film,
  Image,
  Music,
  FileText,
  CloudUpload,
} from 'lucide-react';
import type { ActiveUpload, AssetCategory } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Category icon map ────────────────────────────────────────────────────────

function getCatIcon(category: AssetCategory): React.ReactNode {
  switch (category) {
    case 'stock-footage':
    case 'archival-footage':
    case 'original-shoot':
    case 'interview':
      return <Film className="w-4 h-4" />;
    case 'image':
    case 'chart':
    case 'map':
    case 'report-screenshot':
    case 'motion-graphic':
      return <Image className="w-4 h-4" />;
    case 'music':
    case 'sound-effect':
      return <Music className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

// ─── Upload card ──────────────────────────────────────────────────────────────

const UploadCard: React.FC<{
  upload: ActiveUpload;
  onRemove: (id: string) => void;
}> = ({ upload, onRemove }) => {
  const isComplete = upload.status === 'done';
  const isError = upload.status === 'error';
  const isActive = upload.status === 'uploading' || upload.status === 'processing';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2, ease: EASE }}
      className={`flex items-center gap-3 px-3 py-3 rounded-[12px] border
        ${isError
          ? 'bg-[#EF4444]/05 border-[#EF4444]/20'
          : isComplete
            ? 'bg-[#10B981]/05 border-[#10B981]/20'
            : 'bg-white/[0.03] border-white/[0.08]'
        }`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0
        ${isError ? 'bg-[#EF4444]/15 text-[#EF4444]'
          : isComplete ? 'bg-[#10B981]/15 text-[#10B981]'
          : 'bg-[#7C3AED]/15 text-[#9D6CFF]'}`}>
        {isComplete
          ? <CheckCircle2 className="w-4 h-4" />
          : isError
            ? <AlertCircle className="w-4 h-4" />
            : getCatIcon(upload.category)
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-200 truncate">{upload.fileName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-mono text-slate-600">{upload.fileSizeMb} MB</span>
          <span className="text-slate-700">·</span>
          <span className={`text-[10px] font-mono capitalize
            ${isError ? 'text-[#EF4444]' : isComplete ? 'text-[#10B981]' : 'text-[#9D6CFF]'}`}>
            {upload.status === 'uploading' ? `${upload.progress}%` : upload.status}
          </span>
        </div>

        {/* Progress bar */}
        {isActive && (
          <div className="mt-1.5 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#7C3AED] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${upload.progress}%` }}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </div>
        )}
      </div>

      {/* Status icon / remove */}
      <div className="flex-shrink-0">
        {isActive && <Loader2 className="w-4 h-4 text-[#7C3AED] animate-spin" />}
        {(isComplete || isError) && (
          <button
            type="button"
            onClick={() => onRemove(upload.id)}
            className="p-1 rounded-full text-slate-600 hover:text-slate-300 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main upload area ─────────────────────────────────────────────────────────

interface UploadAreaProps {
  uploads: ActiveUpload[];
  onFilesDropped: (files: File[]) => void;
  onRemoveUpload: (id: string) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  uploads,
  onFilesDropped,
  onRemoveUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFilesDropped(files);
  }, [onFilesDropped]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onFilesDropped(files);
    if (inputRef.current) inputRef.current.value = '';
  }, [onFilesDropped]);

  const activeUploads = uploads.filter(u => u.status === 'uploading' || u.status === 'processing');
  const completedUploads = uploads.filter(u => u.status === 'done' || u.status === 'error');

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={{
          borderColor: isDragging ? 'rgba(124,58,237,0.7)' : 'rgba(255,255,255,0.1)',
          backgroundColor: isDragging ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.02)',
        }}
        transition={{ duration: 0.15 }}
        className="rounded-2xl border-2 border-dashed p-6 flex flex-col items-center
          gap-3 cursor-pointer transition-all"
        onClick={() => inputRef.current?.click()}
      >
        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1, y: isDragging ? -4 : 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className={`w-10 h-10 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-[#7C3AED]/25 text-[#9D6CFF]' : 'bg-white/[0.06] text-slate-500'}`}
        >
          <CloudUpload className="w-5 h-5" />
        </motion.div>
        <div className="text-center">
          <p className="text-[12px] font-semibold text-slate-300">
            {isDragging ? 'Drop files here' : 'Drag & drop assets'}
          </p>
          <p className="text-[11px] font-mono text-slate-600 mt-0.5">
            Video, image, audio, PDF · or <span className="text-[#9D6CFF] underline decoration-dotted">browse</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {['MP4', 'MOV', 'JPG', 'PNG', 'MP3', 'WAV', 'PDF'].map(fmt => (
            <span key={fmt} className="px-1.5 py-0.5 rounded-md bg-white/[0.04]
              border border-white/[0.08] text-[9px] font-mono text-slate-600">
              .{fmt.toLowerCase()}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="video/*,image/*,audio/*,.pdf"
        onChange={handleInputChange}
      />

      {/* Active uploads */}
      {activeUploads.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest px-1">
            Uploading ({activeUploads.length})
          </p>
          <AnimatePresence mode="popLayout">
            {activeUploads.map(u => (
              <UploadCard key={u.id} upload={u} onRemove={onRemoveUpload} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completed uploads */}
      {completedUploads.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest px-1">
            Recent ({completedUploads.length})
          </p>
          <AnimatePresence mode="popLayout">
            {completedUploads.map(u => (
              <UploadCard key={u.id} upload={u} onRemove={onRemoveUpload} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-[11px]
          bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[11px] font-mono text-[#9D6CFF]
          hover:bg-[#7C3AED]/25 hover:border-[#7C3AED]/50 transition-all duration-150"
      >
        <Upload className="w-3.5 h-3.5" />
        Upload Assets
      </button>
    </div>
  );
};
