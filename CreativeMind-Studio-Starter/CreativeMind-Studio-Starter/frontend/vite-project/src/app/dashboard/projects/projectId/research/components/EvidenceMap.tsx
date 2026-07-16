/**
 * EvidenceMap.tsx — Custom SVG-based interactive evidence relationship map.
 *
 * No external graph library — pure SVG with Framer Motion entrance animations.
 * Supports pan (drag) and zoom (scroll). Shows claim → source → script → scene chains.
 */

import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitBranch,
} from 'lucide-react';
import type { EvidenceMap as EvidenceMapType, EvidenceNodeType, EvidenceNode, EvidenceEdge } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Node config ──────────────────────────────────────────────────────────────

const NODE_CFG: Record<EvidenceNodeType, {
  bg: string;
  border: string;
  text: string;
  label: string;
  w: number;
  h: number;
}> = {
  'claim':                 { bg: '#7C3AED22', border: '#8B5CF6',  text: '#C4B5FD', label: 'Claim',        w: 160, h: 52 },
  'primary-source':        { bg: '#10B98120', border: '#10B981',  text: '#6EE7B7', label: 'Primary Src',  w: 148, h: 52 },
  'supporting-source':     { bg: '#06B6D420', border: '#06B6D4',  text: '#67E8F9', label: 'Supporting',   w: 148, h: 52 },
  'contradicting-source':  { bg: '#EF444422', border: '#EF4444',  text: '#FCA5A5', label: 'Contradicts',  w: 148, h: 52 },
  'script-usage':          { bg: '#F59E0B20', border: '#F59E0B',  text: '#FCD34D', label: 'Script',       w: 148, h: 52 },
  'scene-usage':           { bg: '#8B5CF622', border: '#A78BFA',  text: '#DDD6FE', label: 'Scene',        w: 148, h: 52 },
};

const EDGE_COLORS: Record<string, string> = {
  'supports':      '#10B981',
  'corroborates':  '#06B6D4',
  'contradicts':   '#EF4444',
  'cited in':      '#F59E0B',
  'referenced in': '#8B5CF6',
  'visualised in': '#A78BFA',
};

// ─── SVG edge path ────────────────────────────────────────────────────────────

const getEdgePath = (
  source: EvidenceNode,
  target: EvidenceNode,
): string => {
  const sx = source.x + NODE_CFG[source.type].w / 2;
  const sy = source.y + NODE_CFG[source.type].h;
  const tx = target.x + NODE_CFG[target.type].w / 2;
  const ty = target.y;
  const cy1 = sy + (ty - sy) * 0.4;
  const cy2 = ty - (ty - sy) * 0.4;
  return `M ${sx} ${sy} C ${sx} ${cy1}, ${tx} ${cy2}, ${tx} ${ty}`;
};

// ─── Edge label mid-point ─────────────────────────────────────────────────────

const edgeMidPoint = (s: EvidenceNode, t: EvidenceNode): [number, number] => {
  const sx = s.x + NODE_CFG[s.type].w / 2;
  const sy = s.y + NODE_CFG[s.type].h;
  const tx = t.x + NODE_CFG[t.type].w / 2;
  const ty = t.y;
  return [(sx + tx) / 2, (sy + ty) / 2];
};

// ─── Node component ───────────────────────────────────────────────────────────

interface MapNodeProps {
  node: EvidenceNode;
  index: number;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const MapNode: React.FC<MapNodeProps> = ({ node, index, isSelected, onClick }) => {
  const cfg = NODE_CFG[node.type];

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: EASE }}
      onClick={() => onClick(node.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Shadow */}
      <rect
        x={node.x + 2} y={node.y + 3}
        width={cfg.w} height={cfg.h}
        rx={10} ry={10}
        fill="rgba(0,0,0,0.4)"
      />
      {/* Body */}
      <rect
        x={node.x} y={node.y}
        width={cfg.w} height={cfg.h}
        rx={10} ry={10}
        fill={cfg.bg}
        stroke={isSelected ? '#FFFFFF' : cfg.border}
        strokeWidth={isSelected ? 2 : 1.5}
        opacity={0.95}
      />
      {/* Type label */}
      <text
        x={node.x + 8} y={node.y + 16}
        fill={cfg.border}
        fontSize={8}
        fontFamily="JetBrains Mono, monospace"
        fontWeight={700}
        textAnchor="start"
        style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        {cfg.label}
      </text>
      {/* Node label */}
      <foreignObject x={node.x + 6} y={node.y + 20} width={cfg.w - 12} height={cfg.h - 24}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          fontSize: '10px',
          color: cfg.text,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          lineHeight: '1.35',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {node.label}
        </div>
      </foreignObject>
    </motion.g>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface EvidenceMapProps {
  data: EvidenceMapType;
}

export const EvidenceMapView: React.FC<EvidenceMapProps> = ({ data }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const CANVAS_W = 700;
  const CANVAS_H = 700;

  const clampZoom = (z: number) => Math.min(2, Math.max(0.4, z));

  // ── Wheel zoom ─────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => clampZoom(z - e.deltaY * 0.001));
  }, []);

  // ── Pan ────────────────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // ── Node index map ─────────────────────────────────────────────────────────
  const nodeMap = Object.fromEntries(data.nodes.map(n => [n.id, n]));

  const legend = [
    { type: 'claim'               as EvidenceNodeType, label: 'Claim'         },
    { type: 'primary-source'      as EvidenceNodeType, label: 'Primary Source' },
    { type: 'supporting-source'   as EvidenceNodeType, label: 'Supporting'     },
    { type: 'contradicting-source'as EvidenceNodeType, label: 'Contradicts'    },
    { type: 'script-usage'        as EvidenceNodeType, label: 'Script'         },
    { type: 'scene-usage'         as EvidenceNodeType, label: 'Scene'          },
  ];

  return (
    <section aria-label="Evidence map">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-[15px] text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#8B5CF6]" />
            Evidence Map
          </h3>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            Claim → Source → Script → Scene relationships · scroll to zoom · drag to pan
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom(z => clampZoom(z + 0.15))}
            className="p-1.5 rounded-[8px] border border-white/[0.09] bg-[#10101A]
              text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(z => clampZoom(z - 0.15))}
            className="p-1.5 rounded-[8px] border border-white/[0.09] bg-[#10101A]
              text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded-[8px] border border-white/[0.09] bg-[#10101A]
              text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-slate-600 w-10 text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Map container */}
      <div
        className="rounded-2xl border border-white/[0.07] bg-[#07070A] overflow-hidden"
        style={{ height: '500px', cursor: isDragging ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ userSelect: 'none' }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#475569" />
            </marker>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          <g transform={`translate(${pan.x + 16}, ${pan.y + 16}) scale(${zoom})`}>

            {/* Edges */}
            {data.edges.map((edge: EvidenceEdge) => {
              const src = nodeMap[edge.source];
              const tgt = nodeMap[edge.target];
              if (!src || !tgt) return null;
              const path = getEdgePath(src, tgt);
              const [mx, my] = edgeMidPoint(src, tgt);
              const edgeColor = edge.label ? (EDGE_COLORS[edge.label] || '#475569') : '#475569';
              return (
                <g key={edge.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth={1.5}
                    strokeOpacity={0.5}
                    strokeDasharray="4 3"
                    markerEnd="url(#arrowhead)"
                  />
                  {edge.label && (
                    <g>
                      <rect
                        x={mx - 28} y={my - 9}
                        width={56} height={16}
                        rx={6} ry={6}
                        fill="#0B0B12"
                        stroke={edgeColor}
                        strokeOpacity={0.3}
                        strokeWidth={0.8}
                      />
                      <text
                        x={mx} y={my + 4}
                        textAnchor="middle"
                        fill={edgeColor}
                        fontSize={8}
                        fontFamily="JetBrains Mono, monospace"
                        opacity={0.8}
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {data.nodes.map((node, i) => (
              <MapNode
                key={node.id}
                node={node}
                index={i}
                isSelected={selectedNodeId === node.id}
                onClick={id => setSelectedNodeId(prev => prev === id ? null : id)}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 px-1">
        {legend.map(l => {
          const cfg = NODE_CFG[l.type];
          return (
            <div key={l.type} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }} />
              <span className="text-[10px] font-mono text-slate-600">{l.label}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-[10px] font-mono text-slate-700 text-center">
        ⚠️ Evidence relationships shown are simulated for UI demonstration only.
      </p>
    </section>
  );
};
