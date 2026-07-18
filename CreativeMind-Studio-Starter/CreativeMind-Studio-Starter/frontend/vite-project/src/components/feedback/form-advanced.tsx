/**
 * form-advanced.tsx — Advanced form input components
 *
 * Exports:
 *   MultiSelect      — tag-style multi-select with search
 *   AsyncSelect      — async-loaded option list with debounce
 *   FileUpload       — drag-and-drop file zone
 *   DatePicker       — lightweight calendar date picker
 *   RichTextField    — simple rich text / markdown input toolbar
 */

import React, {
  useState, useRef, useCallback, useEffect,
  KeyboardEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, ChevronDown, Loader2,
  Upload, FileText, Image as ImageIcon, Film, Paperclip,
  Bold, Italic, List, Link2, Heading2, Quote,
  Calendar, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ─── MultiSelect ──────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  color?: string;
  avatar?: string;
}

interface MultiSelectProps {
  options:    MultiSelectOption[];
  value:      string[];
  onChange:   (values: string[]) => void;
  placeholder?:string;
  error?:     string;
  disabled?:  boolean;
  maxItems?:  number;
  /** Show colored tag badge */
  showColor?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options, value, onChange, placeholder = 'Select…',
  error, disabled, maxItems, showColor = false,
}) => {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.filter(o => value.includes(o.value));
  const filtered = options.filter(o =>
    !value.includes(o.value) &&
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue));
    } else if (!maxItems || value.length < maxItems) {
      onChange([...value, optValue]);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen(o => !o)}
        role="combobox"
        aria-expanded={open}
        className={`min-h-[42px] w-full bg-white/[0.04] border rounded-xl px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-pointer transition-colors duration-150
          ${error  ? 'border-rose-500/60' : 'border-white/[0.10]'}
          ${open   ? 'border-brand-purple/60 bg-white/[0.07]' : 'hover:border-white/[0.18]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {selected.length === 0 && (
          <span className="text-[13.5px] text-slate-600 flex-1">{placeholder}</span>
        )}
        {selected.map(opt => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 text-[12px] font-medium font-sans text-slate-300 bg-white/[0.08] border border-white/[0.10] rounded-lg px-2 py-0.5"
            style={opt.color && showColor ? { borderColor: `${opt.color}40`, color: opt.color } : {}}
          >
            {opt.label}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); toggle(opt.value); }}
              className="text-slate-500 hover:text-slate-200 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <ChevronDown className={`w-4 h-4 text-slate-500 ml-auto flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -6,   scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1.5 w-full bg-[#111120] border border-white/[0.10] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-white/[0.07]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg py-1.5 pl-8 pr-3 text-[12.5px] text-slate-300 placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-3 text-[12px] text-slate-600 text-center font-sans">No options</p>
              ) : (
                filtered.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] text-slate-300 hover:bg-white/[0.06] hover:text-slate-100 transition-colors font-sans"
                  >
                    {opt.color && showColor && (
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: opt.color }} />
                    )}
                    {opt.label}
                  </button>
                ))
              )}
            </div>
            {maxItems && (
              <div className="px-3 py-2 border-t border-white/[0.07]">
                <p className="text-[10px] text-slate-600 font-mono">{value.length}/{maxItems} selected</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1.5 text-[11.5px] text-rose-400 font-sans">{error}</p>
      )}
    </div>
  );
};

// ─── AsyncSelect ──────────────────────────────────────────────────────────────

interface AsyncSelectOption {
  value: string;
  label: string;
  meta?:  string;
}

interface AsyncSelectProps {
  value?:         AsyncSelectOption | null;
  onChange:       (option: AsyncSelectOption | null) => void;
  loadOptions:    (query: string) => Promise<AsyncSelectOption[]>;
  placeholder?:   string;
  debounceMs?:    number;
  error?:         string;
  disabled?:      boolean;
  isClearable?:   boolean;
}

export const AsyncSelect: React.FC<AsyncSelectProps> = ({
  value, onChange, loadOptions, placeholder = 'Search and select…',
  debounceMs = 300, error, disabled, isClearable = true,
}) => {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [options, setOptions] = useState<AsyncSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref      = useRef<HTMLDivElement>(null);

  const load = useCallback(async (q: string) => {
    if (!q.trim()) { setOptions([]); return; }
    setLoading(true);
    try {
      const res = await loadOptions(q);
      setOptions(res);
    } finally {
      setLoading(false);
    }
  }, [loadOptions]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => load(query), debounceMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, load, debounceMs]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div
        onClick={() => !disabled && setOpen(o => !o)}
        className={`flex items-center gap-2 min-h-[42px] w-full bg-white/[0.04] border rounded-xl px-3 py-2 cursor-pointer transition-colors duration-150
          ${error ? 'border-rose-500/60' : 'border-white/[0.10]'}
          ${open  ? 'border-brand-purple/60 bg-white/[0.07]' : 'hover:border-white/[0.18]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {value ? (
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-[13.5px] text-slate-200 font-sans">{value.label}</p>
              {value.meta && <p className="text-[11px] text-slate-500 font-mono">{value.meta}</p>}
            </div>
            {isClearable && (
              <button type="button" onClick={e => { e.stopPropagation(); onChange(null); setQuery(''); }}
                className="text-slate-500 hover:text-slate-200 transition-colors ml-2">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-[13.5px] text-slate-600 flex-1">{placeholder}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1.5 w-full bg-[#111120] border border-white/[0.10] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-white/[0.07]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Type to search…"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg py-1.5 pl-8 pr-3 text-[12.5px] text-slate-300 placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-4 h-4 text-brand-electric animate-spin" />
                </div>
              ) : options.length === 0 && query.trim() ? (
                <p className="px-3 py-3 text-[12px] text-slate-600 text-center font-sans">No results</p>
              ) : options.length === 0 ? (
                <p className="px-3 py-3 text-[12px] text-slate-600 text-center font-sans">Type to search</p>
              ) : (
                options.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt); setOpen(false); setQuery(''); }}
                    className="w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-white/[0.06] transition-colors"
                  >
                    <div>
                      <p className="text-[13px] text-slate-200 font-sans">{opt.label}</p>
                      {opt.meta && <p className="text-[11px] text-slate-500 font-mono">{opt.meta}</p>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1.5 text-[11.5px] text-rose-400 font-sans">{error}</p>}
    </div>
  );
};

// ─── FileUpload ───────────────────────────────────────────────────────────────

interface UploadedFile {
  file:    File;
  preview?: string;
}

interface FileUploadProps {
  value?:        UploadedFile[];
  onChange:      (files: UploadedFile[]) => void;
  accept?:       string;
  maxSizeMB?:    number;
  multiple?:     boolean;
  error?:        string;
  disabled?:     boolean;
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  image: <ImageIcon className="w-4 h-4 text-blue-400" />,
  video: <Film className="w-4 h-4 text-purple-400" />,
  default: <FileText className="w-4 h-4 text-slate-400" />,
};

function getFileIcon(file: File): React.ReactNode {
  if (file.type.startsWith('image/')) return FILE_ICONS.image;
  if (file.type.startsWith('video/')) return FILE_ICONS.video;
  return FILE_ICONS.default;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value = [], onChange, accept, maxSizeMB = 50, multiple = true, error, disabled,
}) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((raw: FileList | null) => {
    if (!raw) return;
    const maxBytes = maxSizeMB * 1024 * 1024;
    const newFiles: UploadedFile[] = Array.from(raw)
      .filter(f => f.size <= maxBytes)
      .map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
    onChange(multiple ? [...value, ...newFiles] : newFiles);
  }, [value, onChange, maxSizeMB, multiple]);

  const remove = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); !disabled && setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-colors duration-150
          ${dragging ? 'border-brand-purple/70 bg-brand-purple/8' : 'border-white/[0.12] hover:border-white/[0.22] hover:bg-white/[0.02]'}
          ${error    ? 'border-rose-500/50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${dragging ? 'bg-brand-purple/20' : 'bg-white/[0.05]'}`}>
          <Upload className={`w-5 h-5 ${dragging ? 'text-brand-electric' : 'text-slate-500'}`} />
        </div>
        <div className="text-center">
          <p className="text-[13px] font-sans font-medium text-slate-300">
            {dragging ? 'Drop files here' : 'Drop files or click to upload'}
          </p>
          <p className="text-[11.5px] text-slate-600 font-sans mt-0.5">
            {accept ?? 'Any file type'} · max {maxSizeMB} MB
          </p>
        </div>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="sr-only"
          onChange={e => processFiles(e.target.files)} disabled={disabled} />
      </div>

      {/* File list */}
      <AnimatePresence initial={false}>
        {value.map((uf, i) => (
          <motion.div
            key={`${uf.file.name}-${i}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-3 px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl"
          >
            {uf.preview ? (
              <img src={uf.preview} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                {getFileIcon(uf.file)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-sans text-slate-200 truncate">{uf.file.name}</p>
              <p className="text-[10.5px] font-mono text-slate-600">{formatBytes(uf.file.size)}</p>
            </div>
            <button type="button" onClick={() => remove(i)}
              className="text-slate-500 hover:text-rose-400 transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {error && <p className="text-[11.5px] text-rose-400 font-sans">{error}</p>}
    </div>
  );
};

// ─── DatePicker ───────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

interface DatePickerProps {
  value?:    Date | null;
  onChange:  (date: Date) => void;
  min?:      Date;
  max?:      Date;
  error?:    string;
  disabled?: boolean;
  placeholder?:string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value, onChange, min, max, error, disabled, placeholder = 'Select date…',
}) => {
  const [open,    setOpen]    = useState(false);
  const [cursor,  setCursor]  = useState(() => value ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const year  = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));

  const isDisabled = (d: Date) =>
    (min && d < min) || (max && d > max);

  const isSelected = (d: Date) =>
    value && d.toDateString() === value.toDateString();

  const isToday = (d: Date) =>
    d.toDateString() === new Date().toDateString();

  const formatted = value
    ? `${MONTHS[value.getMonth()]} ${value.getDate()}, ${value.getFullYear()}`
    : null;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 bg-white/[0.04] border rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150
          ${error  ? 'border-rose-500/60' : 'border-white/[0.10]'}
          ${open   ? 'border-brand-purple/60 bg-white/[0.07]' : 'hover:border-white/[0.18]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <span className={`flex-1 text-[13.5px] font-sans ${formatted ? 'text-slate-200' : 'text-slate-600'}`}>
          {formatted ?? placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -6,   scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1.5 w-72 bg-[#111120] border border-white/[0.10] rounded-2xl shadow-2xl p-4"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[13px] font-semibold font-display text-slate-200">
                {MONTHS[month]} {year}
              </span>
              <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1.5">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold font-mono text-slate-600 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = new Date(year, month, i + 1);
                const sel  = isSelected(d);
                const tod  = isToday(d);
                const dis  = isDisabled(d);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={dis}
                    onClick={() => { onChange(d); setOpen(false); }}
                    className={`aspect-square w-full rounded-lg text-[12px] font-sans font-medium transition-colors duration-100
                      ${sel ? 'bg-brand-purple text-white' : tod ? 'border border-brand-purple/50 text-brand-electric' : 'text-slate-300 hover:bg-white/[0.08]'}
                      ${dis ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1.5 text-[11.5px] text-rose-400 font-sans">{error}</p>}
    </div>
  );
};

// ─── RichTextField ─────────────────────────────────────────────────────────────

interface RichTextFieldProps {
  value:      string;
  onChange:   (val: string) => void;
  placeholder?:string;
  error?:     string;
  disabled?:  boolean;
  minRows?:   number;
  maxLength?: number;
}

const TOOLBAR_ACTIONS: Array<{ icon: React.ReactNode; label: string; prefix: string; suffix?: string }> = [
  { icon: <Bold   className="w-3.5 h-3.5" />, label: 'Bold',        prefix: '**', suffix: '**' },
  { icon: <Italic className="w-3.5 h-3.5" />, label: 'Italic',      prefix: '_',  suffix: '_'  },
  { icon: <Heading2 className="w-3.5 h-3.5" />, label: 'Heading',   prefix: '## '              },
  { icon: <List   className="w-3.5 h-3.5" />, label: 'List item',   prefix: '- '               },
  { icon: <Quote  className="w-3.5 h-3.5" />, label: 'Blockquote',  prefix: '> '               },
  { icon: <Link2  className="w-3.5 h-3.5" />, label: 'Link',        prefix: '[', suffix: '](url)' },
];

export const RichTextField: React.FC<RichTextFieldProps> = ({
  value, onChange, placeholder = 'Write something…',
  error, disabled, minRows = 5, maxLength,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix?: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const sel   = value.slice(start, end);
    const ins   = suffix ? `${prefix}${sel || 'text'}${suffix}` : `${prefix}${sel}`;
    const next  = value.slice(0, start) + ins + value.slice(end);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + ins.length - (suffix?.length ?? 0));
    }, 0);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab → indent
    if (e.key === 'Tab') {
      e.preventDefault();
      insertMarkdown('  ');
    }
  };

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors duration-150
      ${error  ? 'border-rose-500/60' : 'border-white/[0.10]'}
      focus-within:border-brand-purple/60 focus-within:ring-1 focus-within:ring-brand-purple/25
    `}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-white/[0.03] border-b border-white/[0.07]">
        {TOOLBAR_ACTIONS.map(action => (
          <button
            key={action.label}
            type="button"
            title={action.label}
            disabled={disabled}
            onClick={() => insertMarkdown(action.prefix, action.suffix)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/[0.08] transition-colors duration-100 disabled:opacity-40"
          >
            {action.icon}
          </button>
        ))}
        {maxLength && (
          <span className={`ml-auto text-[10.5px] font-mono pr-1 ${
            value.length > maxLength * 0.9 ? 'text-amber-500' : 'text-slate-600'
          }`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={minRows}
        className="w-full bg-white/[0.04] text-[13.5px] text-slate-200 font-mono px-3.5 py-3 placeholder-slate-600 resize-y focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
      />
    </div>
  );
};
