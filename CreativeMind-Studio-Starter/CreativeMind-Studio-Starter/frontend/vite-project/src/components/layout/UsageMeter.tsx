/**
 * UsageMeter — shows the workspace token / generation usage in the sidebar footer.
 */

import React from 'react';
import { Zap } from 'lucide-react';

export const UsageMeter: React.FC = () => {
  // Mock values — replace with real API data
  const used = 6240;
  const limit = 10000;
  const pct = Math.round((used / limit) * 100);
  const label = pct >= 90 ? 'text-red-400' : pct >= 70 ? 'text-amber-400' : 'text-[#9D6CFF]';
  const bar = pct >= 90 ? 'from-red-500 to-rose-400' : pct >= 70 ? 'from-amber-500 to-yellow-400' : 'from-[#7C3AED] to-[#9D6CFF]';

  return (
    <div className="px-3 py-2.5 rounded-[12px] bg-white/[0.03] border border-white/[0.05] mb-1">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Zap className="w-3 h-3 text-[#9D6CFF]" />
          <span>Generations</span>
        </div>
        <span className={`text-[11px] font-mono font-semibold ${label}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Usage: ${pct}%`}
        />
      </div>
      <p className="text-[10px] text-slate-600 font-mono mt-1">
        {used.toLocaleString()} / {limit.toLocaleString()} tokens
      </p>
    </div>
  );
};
