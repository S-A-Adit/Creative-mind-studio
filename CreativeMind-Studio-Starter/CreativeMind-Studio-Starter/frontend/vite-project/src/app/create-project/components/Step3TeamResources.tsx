/**
 * Step3TeamResources.tsx — Step 3: Team & Resources
 *
 * Features:
 * - Team member invite (email + role)
 * - Reference link management
 * - File upload zones (Research PDF, Documents, Brand Kit)
 * - Uploaded files displayed as modern cards with remove action
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Link2,
  Upload,
  FileText,
  File,
  Palette,
  X,
  Plus,
  Check,
  ExternalLink,
} from 'lucide-react';
import { FieldWrapper, TextInput } from './WizardFormPrimitives';
import type { Step3Data, TeamMember, ReferenceLink, UploadedFile } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeIcon(type: string) {
  if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
  if (type.includes('image')) return <Palette className="w-4 h-4 text-purple-400" />;
  return <File className="w-4 h-4 text-blue-400" />;
}

// ─── Team Member Row ──────────────────────────────────────────────────────────

const TeamMemberRow: React.FC<{
  member: TeamMember;
  onRemove: () => void;
}> = ({ member, onRemove }) => {
  const initials = member.email.slice(0, 2).toUpperCase();
  const roleColors: Record<TeamMember['role'], string> = {
    admin:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
    editor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    viewer: 'text-slate-400 bg-white/[0.04] border-white/[0.08]',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 p-3 rounded-[10px] bg-white/[0.03] border border-white/[0.07]"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED]/30 to-[#4F46E5]/20
        border border-[#8B5CF6]/25 flex items-center justify-center
        text-[11px] font-bold text-[#9D6CFF]">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-slate-200 font-medium truncate">{member.email}</p>
      </div>
      <span className={`flex-shrink-0 text-[10px] font-semibold font-mono uppercase px-2 py-0.5
        rounded-full border ${roleColors[member.role]}`}>
        {member.role}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${member.email}`}
        className="flex-shrink-0 p-1 rounded-[6px] text-slate-600 hover:text-red-400
          hover:bg-red-500/10 transition-colors duration-150"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

// ─── Add Team Member Form ─────────────────────────────────────────────────────

const AddTeamMemberForm: React.FC<{
  onAdd: (m: Omit<TeamMember, 'id'>) => void;
}> = ({ onAdd }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('editor');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!email.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    onAdd({ email: email.trim(), role });
    setEmail('');
    setError('');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <TextInput
          placeholder="teammate@studio.io"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          hasError={!!error}
          className="flex-1"
          type="email"
          aria-label="Team member email"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value as TeamMember['role'])}
          aria-label="Team member role"
          className="h-10 px-2.5 rounded-[10px] bg-[#0B0B12] border border-white/[0.08]
            text-[12px] text-slate-300 font-sans focus:outline-none focus:ring-2
            focus:ring-[#8B5CF6]/40 cursor-pointer"
        >
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <motion.button
          type="button"
          onClick={handleAdd}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 h-10 px-3.5 rounded-[10px] text-[12px] font-semibold
            transition-all duration-200 flex-shrink-0
            ${added
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-[#7C3AED]/20 border border-[#8B5CF6]/30 text-[#9D6CFF] hover:bg-[#7C3AED]/30'
            }`}
          aria-label="Add team member"
        >
          {added ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {added ? 'Added' : 'Add'}
        </motion.button>
      </div>
      {error && <p className="text-[11px] text-red-400 font-medium">{error}</p>}
    </div>
  );
};

// ─── Add Reference Link Form ──────────────────────────────────────────────────

const AddReferenceLinkForm: React.FC<{
  onAdd: (l: Omit<ReferenceLink, 'id'>) => void;
}> = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!url.startsWith('http')) {
      setError('Enter a valid URL starting with http');
      return;
    }
    onAdd({ url: url.trim(), label: label.trim() || url.trim() });
    setUrl('');
    setLabel('');
    setError('');
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <TextInput
          placeholder="https://example.com/reference"
          value={url}
          onChange={e => { setUrl(e.target.value); setError(''); }}
          hasError={!!error}
          className="flex-1"
          type="url"
          aria-label="Reference URL"
        />
        <TextInput
          placeholder="Label (optional)"
          value={label}
          onChange={e => setLabel(e.target.value)}
          className="w-36"
          aria-label="Reference label"
        />
        <button
          type="button"
          onClick={handleAdd}
          aria-label="Add reference link"
          className="flex items-center gap-1.5 h-10 px-3.5 rounded-[10px] text-[12px] font-semibold
            bg-[#7C3AED]/20 border border-[#8B5CF6]/30 text-[#9D6CFF] hover:bg-[#7C3AED]/30
            transition-all duration-200 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-[11px] text-red-400 font-medium">{error}</p>}
    </div>
  );
};

// ─── Reference Link Row ───────────────────────────────────────────────────────

const ReferenceLinkRow: React.FC<{
  link: ReferenceLink;
  onRemove: () => void;
}> = ({ link, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
    className="flex items-center gap-3 p-2.5 rounded-[10px] bg-white/[0.03] border border-white/[0.07]"
  >
    <div className="flex-shrink-0 w-7 h-7 rounded-[7px] bg-blue-500/10 border border-blue-500/20
      flex items-center justify-center">
      <Link2 className="w-3.5 h-3.5 text-blue-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] text-slate-200 font-medium truncate">
        {link.label || link.url}
      </p>
      <p className="text-[10px] text-slate-600 font-mono truncate">{link.url}</p>
    </div>
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-1 text-slate-600 hover:text-slate-300 transition-colors duration-150"
      aria-label={`Open ${link.url}`}
    >
      <ExternalLink className="w-3 h-3" />
    </a>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${link.label}`}
      className="p-1 rounded-[6px] text-slate-600 hover:text-red-400 hover:bg-red-500/10
        transition-colors duration-150"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

// ─── File Upload Zone ─────────────────────────────────────────────────────────

interface FileUploadZoneProps {
  label: string;
  icon: React.ReactNode;
  accept: string;
  category: UploadedFile['category'];
  onUpload: (file: Omit<UploadedFile, 'id' | 'uploadedAt'>) => void;
  color?: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  icon,
  accept,
  category,
  onUpload,
  color = 'text-[#9D6CFF]',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      onUpload({
        name: file.name,
        size: file.size,
        type: file.type,
        category,
      });
    });
  };

  return (
    <motion.button
      type="button"
      role="button"
      aria-label={`Upload ${label}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={e => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      className={`
        w-full flex flex-col items-center justify-center gap-2 p-5 rounded-[14px]
        border-2 border-dashed text-center cursor-pointer transition-all duration-200
        ${isDragging
          ? 'border-[#8B5CF6]/60 bg-[#7C3AED]/10'
          : 'border-white/[0.09] hover:border-white/[0.18] hover:bg-white/[0.02]'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        aria-label={label}
        onChange={e => handleFiles(e.target.files)}
      />
      <div className={`${color}`}>{icon}</div>
      <div>
        <p className="text-[12px] font-semibold text-slate-300">{label}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          {isDragging ? 'Drop files here' : 'Click or drag & drop'}
        </p>
      </div>
    </motion.button>
  );
};

// ─── Uploaded File Card ────────────────────────────────────────────────────────

const UploadedFileCard: React.FC<{
  file: UploadedFile;
  onRemove: () => void;
}> = ({ file, onRemove }) => {
  const categoryLabel: Record<UploadedFile['category'], string> = {
    research:   'Research',
    document:   'Document',
    'brand-kit':'Brand Kit',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="relative flex items-center gap-3 p-3 rounded-[12px]
        bg-[#0B0B12] border border-white/[0.08] hover:border-[#8B5CF6]/30
        transition-colors duration-200 group"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-[10px] bg-white/[0.04] border border-white/[0.07]
        flex items-center justify-center">
        {fileTypeIcon(file.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-slate-200 truncate">{file.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-slate-600 font-mono">{formatFileSize(file.size)}</span>
          <span className="text-slate-700">·</span>
          <span className="text-[10px] text-slate-600 font-mono">
            {categoryLabel[file.category]}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="flex-shrink-0 p-1 rounded-[6px] text-slate-700 hover:text-red-400
          hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

// ─── Step 3 Component ─────────────────────────────────────────────────────────

interface Step3TeamResourcesProps {
  data: Step3Data;
  onAddTeamMember: (m: Omit<TeamMember, 'id'>) => void;
  onRemoveTeamMember: (id: string) => void;
  onAddReferenceLink: (l: Omit<ReferenceLink, 'id'>) => void;
  onRemoveReferenceLink: (id: string) => void;
  onAddFile: (f: Omit<UploadedFile, 'id' | 'uploadedAt'>) => void;
  onRemoveFile: (id: string) => void;
}

export const Step3TeamResources: React.FC<Step3TeamResourcesProps> = ({
  data,
  onAddTeamMember,
  onRemoveTeamMember,
  onAddReferenceLink,
  onRemoveReferenceLink,
  onAddFile,
  onRemoveFile,
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8">
      {/* ── Left column ── */}
      <div className="xl:col-span-3 space-y-6">

        {/* Team Members */}
        <div className="space-y-3">
          <FieldWrapper label="Team Members" htmlFor="team-email">
            <AddTeamMemberForm onAdd={onAddTeamMember} />
          </FieldWrapper>
          <AnimatePresence mode="popLayout">
            {data.teamMembers.map(m => (
              <TeamMemberRow
                key={m.id}
                member={m}
                onRemove={() => onRemoveTeamMember(m.id)}
              />
            ))}
          </AnimatePresence>
          {data.teamMembers.length === 0 && (
            <p className="text-[12px] text-slate-700 italic pl-1">
              No team members added yet — you can always invite them later.
            </p>
          )}
        </div>

        {/* Reference Links */}
        <div className="space-y-3">
          <FieldWrapper label="Reference Links" htmlFor="ref-url">
            <AddReferenceLinkForm onAdd={onAddReferenceLink} />
          </FieldWrapper>
          <AnimatePresence mode="popLayout">
            {data.referenceLinks.map(l => (
              <ReferenceLinkRow
                key={l.id}
                link={l}
                onRemove={() => onRemoveReferenceLink(l.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* File Uploads */}
        <div className="space-y-3">
          <p className="text-[12px] font-semibold text-slate-400 tracking-wide uppercase">
            Upload Assets
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FileUploadZone
              label="Research PDF"
              icon={<FileText className="w-6 h-6" />}
              accept=".pdf"
              category="research"
              onUpload={onAddFile}
              color="text-red-400"
            />
            <FileUploadZone
              label="Documents"
              icon={<File className="w-6 h-6" />}
              accept=".doc,.docx,.txt,.md"
              category="document"
              onUpload={onAddFile}
              color="text-blue-400"
            />
            <FileUploadZone
              label="Brand Kit"
              icon={<Palette className="w-6 h-6" />}
              accept=".png,.jpg,.svg,.zip,.ai,.pdf"
              category="brand-kit"
              onUpload={onAddFile}
              color="text-purple-400"
            />
          </div>
        </div>
      </div>

      {/* ── Right column: Uploaded files ── */}
      <div className="xl:col-span-2">
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-3">
          Uploaded Files ({data.uploadedFiles.length})
        </p>
        {data.uploadedFiles.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-white/[0.07]
            bg-white/[0.01] p-8 flex flex-col items-center justify-center gap-3 text-center">
            <Upload className="w-8 h-8 text-slate-700" />
            <p className="text-[12px] text-slate-600">
              Uploaded files will appear here as cards.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {data.uploadedFiles.map(f => (
                <UploadedFileCard
                  key={f.id}
                  file={f}
                  onRemove={() => onRemoveFile(f.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
