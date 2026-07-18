/**
 * ExportPanel.tsx — Export panel for the Distribution Room
 *
 * Supports: Copy Content, Export Markdown, Export PDF (placeholder),
 * Export JSON, Download Assets. Integration placeholders shown as "Coming Soon".
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy, FileText, FileDown, Code2, Package, Plug, CheckCircle2,
  MessageSquare, BookOpen, Rss,
} from 'lucide-react';
import { MASTER_CONTENT, PLATFORM_ADAPTATIONS } from '../mockData';
import type { ExportFormat } from '../types';
import { ComingSoonBadge, SectionLabel } from './DistributionShared';

// ─── Export option definitions ────────────────────────────────────────────────

interface ExportOption {
  id: ExportFormat;
  label: string;
  description: string;
  Icon: React.ElementType;
  available: boolean;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'copy',
    label: 'Copy Content',
    description: 'Copy all text content for selected platform to clipboard',
    Icon: Copy,
    available: true,
  },
  {
    id: 'markdown',
    label: 'Export Markdown',
    description: 'Download a .md file with full script and metadata',
    Icon: FileText,
    available: true,
  },
  {
    id: 'pdf',
    label: 'Export PDF',
    description: 'Download a styled PDF document (rendering in progress)',
    Icon: FileDown,
    available: false,
  },
  {
    id: 'json',
    label: 'Export JSON',
    description: 'Download structured JSON with all platform adaptations',
    Icon: Code2,
    available: true,
  },
  {
    id: 'assets',
    label: 'Download Assets',
    description: 'Package thumbnails, graphics, and attachments as a ZIP',
    Icon: Package,
    available: true,
  },
];

// ─── Integration options ──────────────────────────────────────────────────────

interface IntegrationOption {
  id: string;
  label: string;
  Icon: React.ElementType;
  available: boolean;
}

const INTEGRATIONS: IntegrationOption[] = [
  { id: 'slack', label: 'Send to Slack', Icon: MessageSquare, available: false },
  { id: 'notion', label: 'Sync to Notion', Icon: BookOpen, available: false },
  { id: 'rss', label: 'Publish to RSS Feed', Icon: Rss, available: false },
  { id: 'webhook', label: 'Webhook Export', Icon: Plug, available: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMarkdown(): string {
  const m = MASTER_CONTENT;
  let md = `# ${m.projectTitle}\n\n`;
  md += `> **Version:** ${m.version} | **Approved by:** ${m.approvedBy}\n\n`;
  md += `## Summary\n${m.summary}\n\n`;
  md += `## Primary Hook\n> ${m.primaryHook}\n\n`;
  md += `## Main Script\n\`\`\`\n${m.mainScript}\n\`\`\`\n\n`;
  md += `## CTA\n${m.cta}\n\n`;
  md += `## Platform Adaptations\n\n`;
  PLATFORM_ADAPTATIONS.forEach(p => {
    md += `### ${p.platformName}\n`;
    md += `- **Title:** ${p.generatedTitle}\n`;
    md += `- **Status:** ${p.status}\n`;
    md += `- **Duration:** ${p.estimatedDuration}\n`;
    md += `- **CTA:** ${p.cta}\n\n`;
  });
  return md;
}

function buildJSON(): string {
  return JSON.stringify(
    { masterContent: MASTER_CONTENT, platforms: PLATFORM_ADAPTATIONS },
    null,
    2
  );
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

// ─── Export Button ─────────────────────────────────────────────────────────────

interface ExportButtonProps {
  option: ExportOption;
  onExport: (id: ExportFormat) => void;
  completed: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ option, onExport, completed }) => (
  <motion.button
    whileHover={option.available ? { x: 2, transition: { duration: 0.12 } } : {}}
    whileTap={option.available ? { scale: 0.98 } : {}}
    onClick={() => option.available && onExport(option.id)}
    disabled={!option.available}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all group ${
      option.available
        ? 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15]'
        : 'border-white/[0.04] bg-transparent opacity-50 cursor-not-allowed'
    }`}
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        completed
          ? 'bg-emerald-500/15'
          : 'bg-white/[0.04] group-hover:bg-[#8B5CF6]/10'
      }`}
    >
      {completed ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <option.Icon
          className={`w-4 h-4 ${option.available ? 'text-slate-400 group-hover:text-[#9D6CFF]' : 'text-slate-600'}`}
        />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium ${
            option.available ? 'text-slate-200' : 'text-slate-600'
          }`}
        >
          {option.label}
        </span>
        {!option.available && <ComingSoonBadge />}
        {completed && (
          <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Done
          </span>
        )}
      </div>
      <p className="text-[10px] text-slate-600 mt-0.5 truncate">{option.description}</p>
    </div>
  </motion.button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ExportPanel: React.FC = () => {
  const [completed, setCompleted] = useState<Set<ExportFormat>>(new Set());

  const handleExport = async (id: ExportFormat) => {
    const slug = MASTER_CONTENT.projectTitle.toLowerCase().replace(/\s+/g, '-');

    switch (id) {
      case 'copy':
        await copyToClipboard(MASTER_CONTENT.mainScript);
        break;
      case 'markdown':
        downloadText(buildMarkdown(), `${slug}.md`, 'text/markdown');
        break;
      case 'json':
        downloadText(buildJSON(), `${slug}.json`, 'application/json');
        break;
      case 'assets':
        // Placeholder: in production this would call a backend endpoint
        await new Promise(r => setTimeout(r, 600));
        break;
      default:
        break;
    }

    setCompleted(prev => new Set(prev).add(id));
    setTimeout(() => {
      setCompleted(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0B0B12]">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <FileDown className="w-4 h-4 text-[#9D6CFF]" />
          <h3 className="font-display font-semibold text-white text-base">Export</h3>
        </div>
        <p className="text-xs text-slate-500">
          Export the master content or individual platform adaptations.
        </p>

        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
            <SectionLabel className="block mb-1">Platforms</SectionLabel>
            <span className="text-xl font-display font-bold text-white">
              {PLATFORM_ADAPTATIONS.length}
            </span>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
            <SectionLabel className="block mb-1">Ready</SectionLabel>
            <span className="text-xl font-display font-bold text-[#8B5CF6]">
              {PLATFORM_ADAPTATIONS.filter(
                p => p.status === 'approved' || p.status === 'ready-to-publish'
              ).length}
            </span>
          </div>
        </div>
      </div>

      {/* Export options */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <SectionLabel className="block mb-3">Export Formats</SectionLabel>
        <div className="space-y-2 mb-6">
          {EXPORT_OPTIONS.map(opt => (
            <ExportButton
              key={opt.id}
              option={opt}
              onExport={handleExport}
              completed={completed.has(opt.id)}
            />
          ))}
        </div>

        {/* Integrations section */}
        <SectionLabel className="block mb-3">Integrations</SectionLabel>
        <div className="space-y-2">
          {INTEGRATIONS.map(integration => (
            <div
              key={integration.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.04] bg-transparent opacity-50"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                <integration.Icon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600">{integration.label}</span>
                  <ComingSoonBadge />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
