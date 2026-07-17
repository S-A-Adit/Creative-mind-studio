/**
 * RightsAuditTable.tsx — Rights & Licence audit table with sort, filter, search
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, Filter,
  Film, Image, Music, Cpu, AlertTriangle
} from 'lucide-react';
import type { AuditRow } from '../mockData';
import { AUDIT_ROWS } from '../mockData';
import { RiskRowBadge, BoolCell } from './ReviewShared';

type SortKey = keyof AuditRow;
type SortDir = 'asc' | 'desc';

const ASSET_ICONS: Record<string, React.ElementType> = {
  footage: Film,
  graphic: Cpu,
  audio: Music,
  image: Image,
};

const RISK_ORDER: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };

const COLUMNS: { key: SortKey; label: string; width: string; sortable: boolean }[] = [
  { key: 'asset',              label: 'Asset',                width: 'w-44',  sortable: true },
  { key: 'licence',            label: 'Licence',              width: 'w-40',  sortable: true },
  { key: 'commercialUse',      label: 'Commercial Use',       width: 'w-28',  sortable: false },
  { key: 'attributionRequired',label: 'Attribution Req.',     width: 'w-24',  sortable: false },
  { key: 'modificationAllowed',label: 'Modification',         width: 'w-24',  sortable: false },
  { key: 'publisher',          label: 'Publisher',            width: 'w-32',  sortable: true },
  { key: 'proofStored',        label: 'Proof Stored',         width: 'w-24',  sortable: false },
  { key: 'riskRating',         label: 'Risk Rating',          width: 'w-24',  sortable: true },
];

interface SortIconProps { col: SortKey; sortKey: SortKey; sortDir: SortDir }
const SortIcon: React.FC<SortIconProps> = ({ col, sortKey, sortDir }) => {
  if (col !== sortKey) return <ArrowUpDown size={10} className="text-[#64748B] ml-1" />;
  return sortDir === 'asc'
    ? <ArrowUp size={10} className="text-[#8B5CF6] ml-1" />
    : <ArrowDown size={10} className="text-[#8B5CF6] ml-1" />;
};

export const RightsAuditTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('riskRating');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let rows = [...AUDIT_ROWS];

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.asset.toLowerCase().includes(q) ||
        r.licence.toLowerCase().includes(q) ||
        r.publisher.toLowerCase().includes(q)
      );
    }

    if (riskFilter !== 'all') {
      rows = rows.filter(r => r.riskRating === riskFilter);
    }

    rows.sort((a, b) => {
      let av: string | number | boolean = a[sortKey] as any;
      let bv: string | number | boolean = b[sortKey] as any;

      if (sortKey === 'riskRating') {
        av = RISK_ORDER[av as string] ?? 0;
        bv = RISK_ORDER[bv as string] ?? 0;
      }

      if (typeof av === 'boolean') av = av ? 1 : 0;
      if (typeof bv === 'boolean') bv = bv ? 1 : 0;
      if (av === 'conditional') av = 0.5;
      if (bv === 'conditional') bv = 0.5;

      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [search, riskFilter, sortKey, sortDir]);

  const criticalCount = AUDIT_ROWS.filter(r => r.riskRating === 'critical').length;
  const highCount = AUDIT_ROWS.filter(r => r.riskRating === 'high').length;

  return (
    <div className="space-y-3">
      {/* Risk summary bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { level: 'critical', label: 'Critical', color: '#EF4444', count: AUDIT_ROWS.filter(r => r.riskRating === 'critical').length },
          { level: 'high',     label: 'High',     color: '#F97316', count: AUDIT_ROWS.filter(r => r.riskRating === 'high').length },
          { level: 'medium',   label: 'Medium',   color: '#F59E0B', count: AUDIT_ROWS.filter(r => r.riskRating === 'medium').length },
          { level: 'low',      label: 'Low',      color: '#10B981', count: AUDIT_ROWS.filter(r => r.riskRating === 'low').length },
        ].map(item => (
          <button
            key={item.level}
            onClick={() => setRiskFilter(riskFilter === item.level ? 'all' : item.level)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              riskFilter === item.level
                ? 'scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              color: item.color,
              background: `${item.color}12`,
              border: `1px solid ${item.color}${riskFilter === item.level ? '50' : '25'}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
            {item.label}
            <span className="font-mono">{item.count}</span>
          </button>
        ))}

        {(criticalCount > 0 || highCount > 0) && (
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-[#F59E0B] bg-[#F59E0B]/8 px-2.5 py-1 rounded-lg border border-[#F59E0B]/20">
            <AlertTriangle size={11} />
            {criticalCount + highCount} items require attention
          </div>
        )}
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets, licences, publishers…"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0B0B12] border border-white/8 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#8B5CF6]/40 transition-colors"
          />
        </div>
        <span className="text-[10px] font-mono text-[#94A3B8] px-2 py-1 bg-white/4 rounded border border-white/8">
          {filtered.length}/{AUDIT_ROWS.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/8 overflow-hidden bg-[#0B0B12]">
        {/* Sticky header */}
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 900 }}>
            <thead className="sticky top-0 z-10 bg-[#0B0B12] border-b border-white/8">
              <tr>
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className={`${col.width} px-3 py-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide whitespace-nowrap`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center hover:text-[#F8FAFC] transition-colors"
                      >
                        {col.label}
                        <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => {
                const Icon = ASSET_ICONS[row.assetType] ?? Film;
                const isHighRisk = row.riskRating === 'critical' || row.riskRating === 'high';
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`border-b border-white/4 hover:bg-white/2 transition-colors ${
                      isHighRisk ? 'bg-[#EF4444]/2' : ''
                    }`}
                  >
                    {/* Asset */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Icon size={11} className="text-[#94A3B8] flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-[#F8FAFC] truncate max-w-[160px]">{row.asset}</div>
                          {row.notes && (
                            <div className="text-[9px] text-[#F59E0B] mt-0.5 truncate max-w-[160px]">{row.notes}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Licence */}
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-[#CBD5E1]">{row.licence}</span>
                    </td>

                    {/* Commercial use */}
                    <td className="px-3 py-2.5">
                      <BoolCell value={row.commercialUse} labels={['Yes', 'Conditional', 'No']} />
                    </td>

                    {/* Attribution */}
                    <td className="px-3 py-2.5">
                      <BoolCell value={row.attributionRequired} labels={['Required', 'Conditional', 'Not Required']} />
                    </td>

                    {/* Modification */}
                    <td className="px-3 py-2.5">
                      <BoolCell value={row.modificationAllowed} labels={['Allowed', 'Conditional', 'Not Allowed']} />
                    </td>

                    {/* Publisher */}
                    <td className="px-3 py-2.5">
                      <span className="text-xs text-[#94A3B8]">{row.publisher}</span>
                    </td>

                    {/* Proof stored */}
                    <td className="px-3 py-2.5">
                      <BoolCell value={row.proofStored} labels={['Stored', 'Conditional', 'Missing']} />
                    </td>

                    {/* Risk rating */}
                    <td className="px-3 py-2.5">
                      <RiskRowBadge risk={row.riskRating} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[#94A3B8] text-xs">
            No assets match your search.
          </div>
        )}
      </div>
    </div>
  );
};
