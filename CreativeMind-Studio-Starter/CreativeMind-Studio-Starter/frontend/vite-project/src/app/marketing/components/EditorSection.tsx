/**
 * EditorSection — Section 8: Editor Workspace preview
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Play, Volume2, Type, ChevronRight, Square } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const SCENES = [
  { id: 1, label: 'Intro Hook', duration: '0:08', color: '#7C3AED', width: '12%' },
  { id: 2, label: 'Problem Setup', duration: '0:24', color: '#6366F1', width: '18%' },
  { id: 3, label: 'Research Cut', duration: '0:16', color: '#3B82F6', width: '14%' },
  { id: 4, label: 'Solution Reveal', duration: '0:32', color: '#10B981', width: '22%' },
  { id: 5, label: 'Demo Walkthrough', duration: '0:45', color: '#F59E0B', width: '30%' },
  { id: 6, label: 'CTA Close', duration: '0:12', color: '#EC4899', width: '10%' },
];

const TIMELINE_ROWS = [
  { id: 'video', label: 'Video', color: '#7C3AED', segments: [12, 18, 14, 22, 30, 10] },
  { id: 'audio', label: 'Voiceover', color: '#3B82F6', segments: [10, 20, 12, 24, 28, 10] },
  { id: 'captions', label: 'Captions', color: '#10B981', segments: [12, 18, 14, 22, 30, 10] },
  { id: 'music', label: 'Music', color: '#F59E0B', segments: [100] },
];

const ASSETS = [
  { label: 'Office establishing shot', type: 'Video', status: 'licensed' },
  { label: 'Dashboard mockup', type: 'Screen', status: 'owned' },
  { label: 'Team collaboration photo', type: 'Photo', status: 'licensed' },
  { label: 'Product demo recording', type: 'Video', status: 'owned' },
];

export const EditorSection: React.FC = () => {
  const [playhead, setPlayhead] = useState(35);

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#10B981]/04 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.35, ease }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="inline-block mb-4 text-[11px] font-mono font-semibold tracking-widest uppercase text-[#9D6CFF]">
            Editor Workspace
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-5">
            A timeline that thinks with you.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Professional editing tools powered by AI — auto captions, suggested cuts, scene detection, and real-time preview without leaving the browser.
          </p>
        </motion.div>

        {/* Editor mock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease }}
          className="rounded-2xl border border-white/[0.08] bg-[#0B0B12]/90 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        >
          {/* Editor chrome bar */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#10101A]/80">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]/60" />
            </div>
            <div className="flex items-center gap-1 ml-4">
              {['Project', 'Media', 'Effects', 'Export'].map((tab, i) => (
                <span
                  key={tab}
                  className={`px-3 py-1 rounded-lg text-[12px] transition-colors ${
                    i === 0 ? 'bg-white/[0.08] text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-600">2:17 / 2:37</span>
              <div className="w-px h-4 bg-white/[0.06]" />
              <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-2 py-0.5 rounded-full">
                Auto-saving
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05]">
            {/* Left: Scenes panel */}
            <div className="p-4 space-y-2">
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Scenes</p>
              {SCENES.map((scene) => (
                <motion.div
                  key={scene.id}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02] cursor-pointer transition-all"
                >
                  <div
                    className="flex-shrink-0 w-1.5 h-8 rounded-full"
                    style={{ backgroundColor: scene.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] text-slate-300 font-medium truncate">{scene.label}</p>
                    <p className="text-[10px] text-slate-600 font-mono">{scene.duration}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-700 ml-auto flex-shrink-0" />
                </motion.div>
              ))}
            </div>

            {/* Center: Preview + Timeline */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Preview area */}
              <div className="relative bg-black/60 flex items-center justify-center" style={{ aspectRatio: '16/7' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Mock video frame */}
                  <div className="w-full h-full relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ background: 'linear-gradient(135deg, #7C3AED20, #3B82F620)' }}
                    />
                    {/* Fake slide content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center mx-auto mb-3">
                          <Scissors className="w-7 h-7 text-[#9D6CFF]" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Scene 4 — Solution Reveal</p>
                        <p className="text-slate-600 text-[11px] font-mono mt-1">01:44 / 02:37</p>
                      </div>
                    </div>
                    {/* Caption bar */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/70 rounded-lg border border-white/[0.1]">
                      <p className="text-white text-[13px] font-medium text-center whitespace-nowrap">
                        "...and that's where everything changes."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Play controls overlay */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button type="button" className="w-8 h-8 rounded-lg bg-white/[0.1] border border-white/[0.1] flex items-center justify-center text-slate-300 hover:bg-white/[0.15] transition-colors">
                    <Square className="w-3 h-3" />
                  </button>
                  <button type="button" className="w-8 h-8 rounded-lg bg-[#7C3AED]/80 border border-[#7C3AED]/40 flex items-center justify-center text-white hover:bg-[#7C3AED] transition-colors">
                    <Play className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-4">
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Timeline</p>

                {/* Playhead */}
                <div className="relative mb-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={playhead}
                    onChange={(e) => setPlayhead(Number(e.target.value))}
                    className="w-full h-1 appearance-none bg-white/[0.06] rounded-full cursor-pointer"
                    style={{ accentColor: '#7C3AED' }}
                  />
                </div>

                {/* Track rows */}
                <div className="space-y-1.5">
                  {TIMELINE_ROWS.map((row) => (
                    <div key={row.id} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-600 w-14 flex-shrink-0">{row.label}</span>
                      <div className="flex-1 h-5 flex rounded-md overflow-hidden gap-px">
                        {row.segments.map((seg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="h-full rounded-sm transition-opacity hover:opacity-80"
                            style={{
                              width: `${seg}%`,
                              backgroundColor: `${row.color}${i % 2 === 0 ? '50' : '30'}`,
                              border: `1px solid ${row.color}30`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Assets panel */}
            <div className="p-4 space-y-2">
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Assets</p>
              {ASSETS.map((asset) => (
                <div key={asset.label} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer">
                  <div className={`flex-shrink-0 mt-0.5 w-2 h-2 rounded-full ${
                    asset.status === 'licensed' ? 'bg-[#10B981]' : 'bg-[#3B82F6]'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-300 leading-tight truncate">{asset.label}</p>
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">{asset.type} · {asset.status}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-[11px] text-slate-400">Voiceover</span>
                  <span className="ml-auto text-[10px] font-mono text-[#10B981]">AI Generated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-[11px] text-slate-400">Captions</span>
                  <span className="ml-auto text-[10px] font-mono text-[#10B981]">Auto-synced</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
