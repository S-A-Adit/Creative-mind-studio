/**
 * BreadcrumbNav — accessible breadcrumb with separator icons.
 * Reads from LayoutContext automatically.
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLayout } from '../../lib/useLayout';
import type { BreadcrumbSegment } from '../../types/shell';

interface BreadcrumbNavProps {
  /** Override breadcrumbs from context. Usually not needed. */
  override?: BreadcrumbSegment[];
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ override }) => {
  const { breadcrumbs } = useLayout();
  const items = override ?? breadcrumbs;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-[12px] font-mono">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight
                  className="w-3 h-3 text-slate-700 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={
                    isLast
                      ? 'text-slate-300 font-medium'
                      : 'text-slate-600 hover:text-slate-400 transition-colors cursor-default'
                  }
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-slate-500 hover:text-slate-300 transition-colors duration-150"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
