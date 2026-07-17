/**
 * ExportModal.tsx — Premium Export Modal for Video Editor Workspace
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Download, FileText, FileJson, FilePdf, Film,
  CheckCircle2, Clock, AlertCircle, Zap, FileCode2,
  Lock
} from 'lucide-react';
import { PROJECT_META } from '../mockData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'json' | 'pdf' | 'davinci' | 'premiere' | 'finalcut';

interface FormatOption {
  id: ExportFormat;
  label: string;
  description: string;
  icon: React.ElementType;
  available: boolean;
  comingSoon?: boolean;
  extension: string;
  color: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'csv',
    label: 'CSV Export',
    description: 'Scene list, assets, and metadata as a spreadsheet.',
    icon: FileText,
    available: true,
    extension: '.csv',
    color: '#10B981',
  },
  {
    id: 'json',
    label: 'JSON Export',
    description: 'Full project data as structured JSON for custom tools.',
    icon: FileJson,
    available: true,
    extension: '.json',
    color: '#F59E0B',
  },
  {
    id: 'pdf',
    label: 'Production PDF',
    description: 'Formatted production bible with scenes, shots, and notes.',
    icon: FileText,
    available: true,
    extension: '.pdf',
    color: '#EF4444',
    comingSoon: false,
  },
  {
    id: 'davinci',
    label: 'DaVinci Resolve Markers',
    description: 'Import scene markers directly into DaVinci Resolve timeline.',
    icon: Film,
    available: false,
    comingSoon: true,
    extension: '.xml',
    color: '#8B5CF6',
  },
  {
    id: 'premiere',
    label: 'Premiere Pro Markers',
    description: 'Sequence markers XML compatible with Adobe Premiere Pro.',
    icon: Zap,
    available: false,
    comingSoon: true,
    extension: '.xml',
    color: '#3B82F6',
  },
  {
    id: 'finalcut',
    label: 'Final Cut Pro XML',
    description: 'FCPXML format for importing into Final Cut Pro library.',
    icon: FileCode2,
    available: false,
    comingSoon: true,
    extension: '.fcpxml',
    color: '#06B6D4',
  },
];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (exporting) return;
    const fmt = FORMAT_OPTIONS.find(f => f.id === selectedFormat);
    if (!fmt?.available) return;

    setExporting(true);
    await new Promise(r => setTimeout(r, 1200));
    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const selected = FORMAT_OPTIONS.find(f => f.id === selectedFormat)!;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
          >
            <div className="w-full max-w-lg bg-[#0F0F1A] rounded-2xl border border-white/10 shadow-2xl pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div>
                  <h2 className="text-base font-bold text-[#F8FAFC] font-display">Export Project</h2>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    {PROJECT_META.title} · {PROJECT_META.totalScenes} scenes
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Format options */}
              <div className="px-6 py-4">
                <p className="text-[11px] text-[#94A3B8] mb-3 uppercase tracking-wide font-semibold">Select format</p>
                <div className="space-y-2">
                  {FORMAT_OPTIONS.map(fmt => {
                    const Icon = fmt.icon;
                    const isSelected = selectedFormat === fmt.id;

                    return (
                      <motion.button
                        key={fmt.id}
                        onClick={() => fmt.available && setSelectedFormat(fmt.id)}
                        whileHover={fmt.available ? { x: 2, transition: { duration: 0.15 } } : {}}
                        className={`w-full flex items-center gap-3 rounded-xl p-3 border transition-all duration-150 text-left ${
                          !fmt.available
                            ? 'opacity-50 cursor-not-allowed border-white/4 bg-white/1'
                            : isSelected
                            ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/8'
                            : 'border-white/6 bg-[#151521] hover:border-white/12 hover:bg-[#1B1B2A]'
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected ? `${fmt.color}20` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isSelected ? fmt.color + '40' : 'rgba(255,255,255,0.06)'}`,
                          }}
                        >
                          {!fmt.available ? (
                            <Lock size={14} style={{ color: '#64748B' }} />
                          ) : (
                            <Icon size={16} style={{ color: isSelected ? fmt.color : '#94A3B8' }} />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${isSelected ? 'text-[#F8FAFC]' : 'text-[#CBD5E1]'}`}>
                              {fmt.label}
                            </span>
                            {fmt.comingSoon && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20">
                                COMING SOON
                              </span>
                            )}
                            {fmt.available && (
                              <span className="ml-auto text-[9px] font-mono text-[#64748B]">{fmt.extension}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">{fmt.description}</p>
                        </div>

                        {/* Selected indicator */}
                        {isSelected && (
                          <CheckCircle2 size={16} style={{ color: fmt.color }} className="flex-shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Export options for available formats */}
              {selected.available && (
                <div className="px-6 pb-2">
                  <div className="rounded-lg bg-[#0B0B12] border border-white/5 p-3">
                    <p className="text-[10px] text-[#94A3B8] uppercase tracking-wide font-semibold mb-2">Include in export</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        'Scene metadata', 'Shot lists', 'Narration scripts',
                        'Asset inventory', 'Source citations', 'Editor notes',
                      ].map(option => (
                        <label key={option} className="flex items-center gap-2 text-[11px] text-[#CBD5E1] cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-3.5 h-3.5 rounded accent-[#8B5CF6] cursor-pointer"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 mt-2">
                <div className="text-[11px] text-[#64748B]">
                  {selected.available ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-[#10B981]" />
                      {selected.label} available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-[#8B5CF6]" />
                      Integration in development
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] bg-white/4 hover:bg-white/6 border border-white/8 transition-colors"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={selected.available ? { scale: 1.02 } : {}}
                    whileTap={selected.available ? { scale: 0.97 } : {}}
                    onClick={handleExport}
                    disabled={!selected.available || exporting}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                      !selected.available
                        ? 'opacity-40 cursor-not-allowed bg-[#8B5CF6]/20 text-[#8B5CF6]'
                        : exported
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                        : 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg shadow-[#7C3AED]/20'
                    }`}
                  >
                    {exported ? (
                      <>
                        <CheckCircle2 size={13} />
                        Exported!
                      </>
                    ) : exporting ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        Exporting…
                      </>
                    ) : (
                      <>
                        <Download size={13} />
                        Export {selected.extension}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
