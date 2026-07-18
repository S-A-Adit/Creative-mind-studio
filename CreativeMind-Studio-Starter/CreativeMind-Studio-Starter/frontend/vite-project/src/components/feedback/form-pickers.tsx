/**
 * form-pickers.tsx — Domain-specific picker components
 *
 * Exports:
 *   UserPicker    — pick a workspace member, shows avatar + role
 *   SourcePicker  — pick a verified research source
 *   AssetPicker   — pick from the asset library
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ChevronDown,
  Users, BookOpen, Image as ImageIcon,
  ShieldCheck, Film, FileText,
} from 'lucide-react';

// ─── Shared dropdown shell ────────────────────────────────────────────────────

interface DropdownShellProps {
  open:       boolean;
  children:   React.ReactNode;
  className?: string;
}

const DropdownShell: React.FC<DropdownShellProps> = ({ open, children, className = '' }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0,   scale: 1 }}
        exit={{   opacity: 0, y: -6,   scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={`absolute z-50 top-full mt-1.5 bg-[#111120] border border-white/[0.10] rounded-2xl shadow-2xl overflow-hidden ${className}`}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Search bar inside dropdown ───────────────────────────────────────────────

const PickerSearch: React.FC<{
  value:     string;
  onChange:  (v: string) => void;
  placeholder?:string;
}> = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="p-2.5 border-b border-white/[0.07]">
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
      <input
        autoFocus
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg py-1.5 pl-8 pr-3 text-[12.5px] text-slate-300 placeholder-slate-600 focus:outline-none"
      />
    </div>
  </div>
);

// ─── UserPicker ───────────────────────────────────────────────────────────────

export interface UserOption {
  id:     string;
  name:   string;
  email:  string;
  avatar: string;       // initials
  avatarColor: string;
  role?:  string;
  status?:'online' | 'away' | 'busy' | 'offline';
}

interface UserPickerProps {
  value?:    UserOption | null;
  options:   UserOption[];
  onChange:  (user: UserOption | null) => void;
  placeholder?:string;
  error?:    string;
  disabled?: boolean;
  label?:    string;
  isClearable?:boolean;
}

const STATUS_DOT: Record<string, string> = {
  online:  'bg-emerald-500',
  away:    'bg-amber-500',
  busy:    'bg-rose-500',
  offline: 'bg-slate-600',
};

export const UserPicker: React.FC<UserPickerProps> = ({
  value, options, onChange, placeholder = 'Select a member…',
  error, disabled, isClearable = true,
}) => {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2.5 bg-white/[0.04] border rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150
          ${error  ? 'border-rose-500/60' : 'border-white/[0.10]'}
          ${open   ? 'border-brand-purple/60 bg-white/[0.07]' : 'hover:border-white/[0.18]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {value ? (
          <>
            <div className="relative flex-shrink-0">
              <span
                className="w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: value.avatarColor }}
              >
                {value.avatar}
              </span>
              {value.status && (
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#111120] ${STATUS_DOT[value.status]}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-sans font-medium text-slate-200 truncate">{value.name}</p>
              {value.role && <p className="text-[10.5px] font-mono text-slate-500 truncate">{value.role}</p>}
            </div>
            {isClearable && (
              <button type="button" onClick={e => { e.stopPropagation(); onChange(null); }}
                className="text-slate-500 hover:text-rose-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <>
            <Users className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span className="flex-1 text-[13.5px] text-slate-600 font-sans">{placeholder}</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <DropdownShell open={open} className="w-full">
        <PickerSearch value={query} onChange={setQuery} placeholder="Search members…" />
        <div className="max-h-56 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-[12px] text-slate-600 text-center font-sans">No members found</p>
          ) : filtered.map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => { onChange(u); setOpen(false); setQuery(''); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/[0.06] transition-colors"
            >
              <div className="relative flex-shrink-0">
                <span
                  className="w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center text-white"
                  style={{ backgroundColor: u.avatarColor }}
                >
                  {u.avatar}
                </span>
                {u.status && (
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#111120] ${STATUS_DOT[u.status]}`} />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-sans font-medium text-slate-200 truncate">{u.name}</p>
                <p className="text-[11px] font-mono text-slate-500 truncate">{u.role ?? u.email}</p>
              </div>
            </button>
          ))}
        </div>
      </DropdownShell>

      {error && <p className="mt-1.5 text-[11.5px] text-rose-400 font-sans">{error}</p>}
    </div>
  );
};

// ─── SourcePicker ─────────────────────────────────────────────────────────────

export interface SourceOption {
  id:         string;
  title:      string;
  url:        string;
  domain:     string;
  isVerified: boolean;
  type:       'article' | 'study' | 'report' | 'dataset';
  date?:      string;
}

interface SourcePickerProps {
  value?:    SourceOption | null;
  options:   SourceOption[];
  onChange:  (src: SourceOption | null) => void;
  placeholder?:string;
  error?:    string;
  disabled?: boolean;
  isClearable?:boolean;
}

const SOURCE_TYPE_ICON: Record<string, React.ReactNode> = {
  article: <FileText  className="w-3.5 h-3.5 text-blue-400" />,
  study:   <BookOpen  className="w-3.5 h-3.5 text-violet-400" />,
  report:  <BookOpen  className="w-3.5 h-3.5 text-amber-400" />,
  dataset: <FileText  className="w-3.5 h-3.5 text-cyan-400" />,
};

export const SourcePicker: React.FC<SourcePickerProps> = ({
  value, options, onChange, placeholder = 'Select a source…',
  error, disabled, isClearable = true,
}) => {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.domain.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2.5 bg-white/[0.04] border rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150
          ${error  ? 'border-rose-500/60' : 'border-white/[0.10]'}
          ${open   ? 'border-brand-purple/60 bg-white/[0.07]' : 'hover:border-white/[0.18]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {value ? (
          <>
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
              {SOURCE_TYPE_ICON[value.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-sans font-medium text-slate-200 truncate">{value.title}</p>
              <p className="text-[11px] font-mono text-slate-500 truncate flex items-center gap-1">
                {value.domain}
                {value.isVerified && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
              </p>
            </div>
            {isClearable && (
              <button type="button" onClick={e => { e.stopPropagation(); onChange(null); }}
                className="text-slate-500 hover:text-rose-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span className="flex-1 text-[13.5px] text-slate-600 font-sans">{placeholder}</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <DropdownShell open={open} className="w-full">
        <PickerSearch value={query} onChange={setQuery} placeholder="Search sources…" />
        <div className="max-h-60 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-[12px] text-slate-600 text-center font-sans">No sources found</p>
          ) : filtered.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => { onChange(s); setOpen(false); setQuery(''); }}
              className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                {SOURCE_TYPE_ICON[s.type]}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-sans font-medium text-slate-200 truncate">{s.title}</p>
                <p className="text-[11px] font-mono text-slate-500 truncate flex items-center gap-1">
                  {s.domain}
                  {s.isVerified && <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                  {s.date && <span className="ml-1">{s.date}</span>}
                </p>
              </div>
              <span className="text-[9.5px] font-mono tracking-wider uppercase text-slate-600 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5 flex-shrink-0">
                {s.type}
              </span>
            </button>
          ))}
        </div>
      </DropdownShell>

      {error && <p className="mt-1.5 text-[11.5px] text-rose-400 font-sans">{error}</p>}
    </div>
  );
};

// ─── AssetPicker ──────────────────────────────────────────────────────────────

export interface AssetOption {
  id:       string;
  name:     string;
  type:     'image' | 'video' | 'document' | 'audio';
  sizeLabel:string;
  preview?: string; // URL for image previews
  tags?:    string[];
}

interface AssetPickerProps {
  value?:    AssetOption | null;
  options:   AssetOption[];
  onChange:  (asset: AssetOption | null) => void;
  placeholder?:string;
  error?:    string;
  disabled?: boolean;
  isClearable?:boolean;
}

const ASSET_ICON: Record<string, React.ReactNode> = {
  image:    <ImageIcon className="w-4 h-4 text-blue-400" />,
  video:    <Film      className="w-4 h-4 text-purple-400" />,
  document: <FileText  className="w-4 h-4 text-amber-400" />,
  audio:    <FileText  className="w-4 h-4 text-cyan-400" />,
};

export const AssetPicker: React.FC<AssetPickerProps> = ({
  value, options, onChange, placeholder = 'Select an asset…',
  error, disabled, isClearable = true,
}) => {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    (a.tags ?? []).some(t => t.toLowerCase().includes(query.toLowerCase())),
  );

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2.5 bg-white/[0.04] border rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150
          ${error  ? 'border-rose-500/60' : 'border-white/[0.10]'}
          ${open   ? 'border-brand-purple/60 bg-white/[0.07]' : 'hover:border-white/[0.18]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {value ? (
          <>
            {value.preview ? (
              <img src={value.preview} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                {ASSET_ICON[value.type]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-sans font-medium text-slate-200 truncate">{value.name}</p>
              <p className="text-[11px] font-mono text-slate-500">{value.sizeLabel} · {value.type}</p>
            </div>
            {isClearable && (
              <button type="button" onClick={e => { e.stopPropagation(); onChange(null); }}
                className="text-slate-500 hover:text-rose-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <>
            <ImageIcon className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span className="flex-1 text-[13.5px] text-slate-600 font-sans">{placeholder}</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <DropdownShell open={open} className="w-full">
        <PickerSearch value={query} onChange={setQuery} placeholder="Search assets…" />
        {/* Grid view for image assets */}
        {filtered.some(a => a.preview) ? (
          <div className="grid grid-cols-3 gap-2 p-3 max-h-56 overflow-y-auto">
            {filtered.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => { onChange(a); setOpen(false); setQuery(''); }}
                title={a.name}
                className="aspect-square rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.08] hover:border-brand-purple/40 transition-colors relative group"
              >
                {a.preview ? (
                  <img src={a.preview} alt={a.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {ASSET_ICON[a.type]}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <p className="text-[9px] text-white font-sans truncate w-full text-left">{a.name}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-[12px] text-slate-600 text-center font-sans">No assets found</p>
            ) : filtered.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => { onChange(a); setOpen(false); setQuery(''); }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  {ASSET_ICON[a.type]}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[13px] font-sans font-medium text-slate-200 truncate">{a.name}</p>
                  <p className="text-[11px] font-mono text-slate-500">{a.sizeLabel}</p>
                </div>
                <span className="text-[9.5px] font-mono tracking-wider uppercase text-slate-600 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5 flex-shrink-0">
                  {a.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </DropdownShell>

      {error && <p className="mt-1.5 text-[11.5px] text-rose-400 font-sans">{error}</p>}
    </div>
  );
};
